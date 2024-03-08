// ******************************************************************************************************
//  AggregatingCircles.tsx - Gbtc
//
//  Copyright © 2023, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA licenses this file to you under the MIT License (MIT), the "License"; you may not use this
//  file except in compliance with the License. You may obtain a copy of the License at:
//
//      http://opensource.org/licenses/MIT
//
//  Unless agreed to in writing, the subject software distributed under the License is distributed on an
//  "AS-IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. Refer to the
//  License for the specific language governing permissions and limitations.
//
//  Code Modification History:
//  ----------------------------------------------------------------------------------------------------
//  03/02/2023 - C Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************


import * as React from 'react';
import { AxisIdentifier, GraphContext } from './GraphContext';
import { ContextlessCircle, IProps as ICircleProps} from './Circle';

interface IAggregationFunctions {
  XTransformation: (x: number) => number,
  YTransformation: (y: number, a: AxisIdentifier) => number,
  XInverseTransformation: (p: number) => number,
  YInverseTransformation: (p: number, a: AxisIdentifier) => number,
}

/*
  canAggregate determines if 2 circles are aggregated
  onAggregation does the actual Aggregation
  data is the full circle data
  useSingleAggregation - if true groups will not be aggregated. 
*/
export interface IProps {
    canAggregate: (d1: ICircleProps, d2: ICircleProps, fxn: IAggregationFunctions) => boolean,
    onAggregation: (data: ICircleProps[], fxn: IAggregationFunctions) => ICircleProps,
    data: ICircleProps[],
    useSingleAggregation?: boolean
}

const AggregatingCircles = (props: IProps) => {
  /*
    Circle that will aggregate into larger circles
  */

  const context = React.useContext(GraphContext)
  const [aggregate, setAggregate] = React.useState<ICircleProps[]>([])

  // Optional prop to prevent aggregating into groups
    const useSingleAggregation = props.useSingleAggregation === undefined ? false : props.useSingleAggregation;

  // Re-calculate aggregation when data or context changes
  React.useEffect(() => {
      setAggregate(cluster(props.data));
  }, [props.data, context.UpdateFlag])

   // Cluster circles based on aggregation criteria
  function cluster(circles: ICircleProps[]): ICircleProps[] {

    const singleCircles: ICircleProps[] = circles.map(c => ({...c}))
    let clusters: ICluster[] = [];

    // Define transformation functions using the context
    const fctn: IAggregationFunctions  = {
      YInverseTransformation : context.YInverseTransformation,
      XInverseTransformation: context.XInverseTransformation,
      YTransformation: context.YTransformation,
      XTransformation: context.XTransformation
     }

    interface ICluster { 
      Indices: number[],
      Aggregate: ICircleProps|null
    }

    // Cluster start to cluster based on single circles
    for (let i = 0; i < singleCircles.length; i = i+1) {
      let c1 = clusters.findIndex(c => c.Indices.includes(i));
      for (let j = i+1; j < singleCircles.length; j = j+1) {
        if (!props.canAggregate(singleCircles[i],singleCircles[j],fctn))
          continue;
        const c2 = clusters.findIndex(c => c.Indices.includes(j));

        // Handle various scenarios for merging and creating new clusters
        if (c1 < 0 && c2 < 0) {
          clusters.push({ Indices: [i,j], Aggregate: null});
          c1 = clusters.length - 1;
          continue;
        }

        if (c1 === c2)
          continue
        
        if (c1 >= 0 && c2 < 0) {
          clusters[c1].Indices.push(j);
        }

        if (c1 < 0 && c2 >= 0) {
          clusters[c2].Indices.push(i);
          c1 = clusters.length - 1;
          continue;
        }

        if (c1 >= 0 && c2 >= 0) {
          clusters[c1].Indices.push(...clusters[c2].Indices);
          clusters.splice(c2,1);
          c1 = clusters.findIndex(c => c.Indices.includes(i));
        }
    }
  }

  let NClusters = clusters.length;
  let NClustered = clusters.reduce((s,c) => s + c.Indices.length,0);
  clusters.forEach(c => {
    c.Aggregate = props.onAggregation(singleCircles.filter((x,i) => c.Indices.includes(i)),fctn)
  });

  // If not using single aggregation mode, perform further aggregation
  if (!useSingleAggregation && NClusters > 0) {
    do {
        NClusters = clusters.length;
        NClustered = clusters.reduce((s,c) => s + c.Indices.length,0);

        // clusters with index in 0 are replaced with clusters in index 1 (always remove i)
        const clusterReplacements: number[] = [];
        for (let i = 0; i < clusters.length; i = i+1) {
          let replacementCluster = i;
          for (let j = i+1; j < clusters.length; j = j+1) {
            if (!props.canAggregate(clusters[i].Aggregate as ICircleProps,clusters[j].Aggregate as ICircleProps,fctn))
                  continue;

            clusterReplacements.push(i);
            clusters[j].Indices.push(...clusters[i].Indices);
            clusters[j].Aggregate = props.onAggregation(singleCircles.filter((x,l) => clusters[j].Indices.includes(l)),fctn);
            replacementCluster = j;
            break;
            }

          for (let j = 0; j < singleCircles.length; j = j+1) {
            if (clusters.findIndex(cl => cl.Indices.includes(j)) > -1)
              continue;

            if (!props.canAggregate(clusters[replacementCluster].Aggregate as ICircleProps,singleCircles[j],fctn))
              continue;

            clusters[replacementCluster].Indices.push(j);
            clusters[replacementCluster].Aggregate = props.onAggregation(singleCircles.filter((x,l) => clusters[replacementCluster].Indices.includes(l)),fctn);
          }
        }

        clusters = clusters.filter((c,l) => !clusterReplacements.includes(l));
      }
      while (NClusters !== clusters.length || NClustered !== clusters.reduce((s,c) => s + c.Indices.length,0));

    }

    // Return a combination of single circles not in any cluster and the aggregated circles
    return [...singleCircles.filter((c,i) => clusters.findIndex(cl => cl.Indices.includes(i)) === -1),
       ...clusters.map((c) => c.Aggregate as ICircleProps)];
  }


   return (
       <g>
          {aggregate.map((c,i) => <ContextlessCircle key={i.toString() + (c.text === undefined? '': c.text)} circleProps={c} context={context} />)}
       </g>
   );
}

export default AggregatingCircles;
