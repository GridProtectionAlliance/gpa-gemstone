// ******************************************************************************************************
//  Legend.tsx - Gbtc
//
//  Copyright © 2021, Grid Protection Alliance.  All Rights Reserved.
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
//  03/19/2021 - C. lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import {GraphContext} from './GraphContext';

interface IProps {
  height: number,
  width: number,
  location: 'bottom'|'right',
  graphHeight: number,
  graphWidth: number
}

const itemHeight = 25;
const itemsWhenBottom = 3;

function Legend(props: IProps) {
  const context = React.useContext(GraphContext);
  const [width, setWidth] = React.useState<number>(props.location === 'bottom'? props.graphWidth : props.width);
  const [height, setHeight] = React.useState<number>(props.location === 'right'? props.graphHeight : props.height);
  const [nLegends, setNLegends] = React.useState<{sm: number, lg: number}>({sm: 0, lg: 0});
  const [hasScroll, setHasScroll] = React.useState<boolean>(false);

  const leftPad = React.useMemo(() => (props.location === 'bottom' ? 39 : 0), [props.location]);
  const scrollBarSpace = React.useMemo(() => (hasScroll ? 6 : 0), [hasScroll]);

  React.useEffect(() => {
    const newWidth = props.location === 'bottom'? props.graphWidth : props.width;
    if (newWidth !== width) setWidth(newWidth);
  }, [props.width, props.graphWidth, props.location]);

  React.useEffect(() => {
    const newHeight = props.location === 'right'? props.graphHeight : props.height;
    if (newHeight !== height) setHeight(newHeight);
  }, [props.height, props.graphHeight, props.location]);

  React.useEffect(() => {
    const newNLegends = [...context.Data.values()].reduce((s,c) => {
      if (c.legend === undefined) return s;
      if (c.legendSize === 'lg') s.lg = s.lg + 1;
      else s.sm = s.sm + 1;
      return s;
    }, {sm: 0, lg: 0});
    if (newNLegends.sm !== nLegends.sm || newNLegends.lg !== nLegends.lg) setNLegends(newNLegends);
  }, [context.Data]);

  React.useEffect(() => {
    const requiredHeight = Math.ceil(nLegends.sm/ (props.location === 'bottom' ? itemsWhenBottom : 1)) * itemHeight + nLegends.lg * 2*itemHeight;
    if (props.location === 'bottom' && context.RequestLegendHeight !== undefined) context.RequestLegendHeight(requiredHeight);
    setHasScroll(requiredHeight > height);
  }, [nLegends, props.location, height, context.RequestLegendHeight]);

  return (
    <div style={{ height, width, paddingLeft: `${leftPad}px`, position: (props.location === 'bottom'? 'absolute' : 'relative'), float:(props.location as any), display: 'flex', flexWrap: 'wrap', bottom: 0, 
      overflowY: hasScroll ? 'scroll' : 'hidden', overflowX: hasScroll ? 'visible' : 'hidden'}}>
      {[...context.Data.values()].map((series, index) => (series.legend !== undefined ?
            <div key={index} style={
              {width: ((width - leftPad) / ((props.location === 'bottom' && (series.legendSize ?? 'sm') === 'sm') ? itemsWhenBottom : 1) - scrollBarSpace),
               height: props.location === 'bottom'? ((series.legendSize ?? 'sm') === 'lg' ? 2 : 1) * itemHeight : Math.max(height/(nLegends.sm + nLegends.lg), itemHeight)}}>
                {series.legend}
        </div> : null))}
    </div>);
}

export default React.memo(Legend);
