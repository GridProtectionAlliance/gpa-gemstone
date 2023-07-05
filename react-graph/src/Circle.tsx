// ******************************************************************************************************
//  Circle.tsx - Gbtc
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


import { GetTextHeight, GetTextWidth } from '@gpa-gemstone/helper-functions';
import * as React from 'react';
import {IDataSeries, GraphContext, IGraphContext, IHandlers, IActionFunctions} from './GraphContext';

export interface IProps {
  data: [number, number],
  color: string,
  radius: number,
  borderColor?: string,
  borderThickness?: number,
  text?: string,
  opacity?: number,
  onClick?: (actions: IActionFunctions) => void
}

interface IContextlessProps{
  context: IGraphContext
  circleProps: IProps
}

export function ContextlessCircle(props: IContextlessProps) {
  /*
    Circle with basic styling
  */
  const [guid, setGuid] = React.useState<string>("");
  const [textSize, setTextSize] = React.useState<number>(1);

   React.useEffect(() => {
       if (guid === "")
           return;

       props.context.UpdateData(guid, {
           legend: undefined,
           getMax: (t) => (t[0] < props.circleProps.data[0] && t[1] > props.circleProps.data[0]? props.circleProps.data[1] : undefined ),
           getMin: (t) => (t[0] < props.circleProps.data[0] && t[1] > props.circleProps.data[0]? props.circleProps.data[1] : undefined ),
       } as IDataSeries)
   }, [props.circleProps])


   React.useEffect(() => {
       const id = props.context.AddData({
           legend: undefined,
           getMax: (t) => (t[0] < props.circleProps.data[0] && t[1] > props.circleProps.data[0]? props.circleProps.data[1] : undefined ),
           getMin: (t) => (t[0] < props.circleProps.data[0] && t[1] > props.circleProps.data[0]? props.circleProps.data[1] : undefined ),
       } as IDataSeries)
     setGuid(id)
       return () => { props.context.RemoveData(id) }
   }, []);

   React.useEffect(() => {
    if (props.circleProps.text === undefined)
      return;
    
    let tSize = 5;
    let dX = GetTextWidth("Segoe UI", tSize + "em",props.circleProps.text);
    let dY = GetTextHeight("Segoe UI", tSize + "em",props.circleProps.text);

      while ((dX > 2*props.circleProps.radius || dY > 2*props.circleProps.radius) && tSize > 0.05)
      {
        tSize = tSize - 0.01;
        dX = GetTextWidth("Segoe UI", tSize + "em",props.circleProps.text);
        dY = GetTextHeight("Segoe UI", tSize + "em",props.circleProps.text);
      }
      setTextSize(tSize);
        
   }, [props.circleProps.text, props.circleProps.radius])

   
   React.useEffect(() => {
    if (guid === "" || props.circleProps.onClick === undefined)
        return;

      props.context.UpdateSelect(guid, {
          onClick
      } as IHandlers)
    }, [props.circleProps.onClick, props.context.UpdateFlag ])

    function onClick(x: number, y: number) {
      if (props.circleProps.onClick === undefined)
        return;
      const xP = props.context.XTransformation(x);
      const yP = props.context.YTransformation(y);
      const xC = props.context.XTransformation(props.circleProps.data[0]);
      const yC = props.context.YTransformation(props.circleProps.data[1]);

      if (xP <= xC + props.circleProps.radius && xP >= xC - props.circleProps.radius &&
        yP <= yC + props.circleProps.radius && yP >= yC - props.circleProps.radius)
        props.circleProps.onClick( {
          setYDomain: props.context.SetYDomain as React.SetStateAction<[number,number]>, 
          setTDomain: props.context.SetXDomain as React.SetStateAction<[number,number]>
          });

 }
 
   if (!isFinite(props.context.XTransformation(props.circleProps.data[0])) || !isFinite(props.context.YTransformation(props.circleProps.data[1])))
    return null;
   return (
    <g>
       <circle r={props.circleProps.radius} 
       cx={props.context.XTransformation(props.circleProps.data[0])} 
       cy={props.context.YTransformation(props.circleProps.data[1])} 
       fill={props.circleProps.color}
       opacity={props.circleProps.opacity} 
       stroke={props.circleProps.borderColor} strokeWidth={props.circleProps.borderThickness} />
       {props.circleProps.text !== undefined? <text fill={'black'}
       style={{ fontSize: textSize + 'em', textAnchor: 'middle', dominantBaseline: 'middle' }} 
       y={props.context.YTransformation(props.circleProps.data[1])} 
       x={props.context.XTransformation(props.circleProps.data[0])}>{props.circleProps.text}</text> : null}
    </g>
   );
}

const Circle = (props: IProps) => {
  const context = React.useContext(GraphContext);
  return <ContextlessCircle circleProps={props} context={context}/>
}

export default Circle;
