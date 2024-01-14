// ******************************************************************************************************
//  HorizontalMarker.tsx - Gbtc
//
//  Copyright © 2022, Grid Protection Alliance.  All Rights Reserved.
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
//  04/29/2022 - C Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************


import * as React from 'react';
import {AxisIdentifier, AxisMap, GraphContext, IHandlers, LineStyle} from './GraphContext';

export interface IProps {
    start?: number,
    end?: number,
    Value: number,
    setValue?: (y: number) => void,
    color: string,
    lineStyle: LineStyle,
    width: number,
    axis?: AxisIdentifier,
}

function HorizontalMarker(props: IProps) {
  /*
    Marks a Y Value horizontally as a line.
  */
  const context = React.useContext(GraphContext)
  const [value, setValue] = React.useState<number>(props.Value);
  const [isSelected, setSelected] = React.useState<boolean>(false);
  const [guid, setGuid] = React.useState<string>("");

  function generateData(v: number) {
    const axis = AxisMap.get(props.axis);
    const x1 = (props.start === undefined? context.XDomain[0] : props.start);
    const x2 = (props.end === undefined? context.XDomain[1] : props.end);
      
    return `M ${context.XTransformation(x1)} ${context.YTransformation(v, axis)} L ${context.XTransformation(x2)} ${context.YTransformation(v, axis)}`;
  }

  const onClick = React.useCallback((_: number, y: number) => {
    const axis = AxisMap.get(props.axis);
    const yP = context.YTransformation(props.Value, axis);
    const yT = context.YTransformation(y, axis);
    if (yT <= yP + (props.width/2) && yT >= yP - (props.width/2))
      setSelected(true);
  }, [props.width, props.Value, props.axis]);

  React.useEffect(() => {
        const id = context.RegisterSelect({
            axis: props.axis,
            allowSnapping: false,
            onClick,
            onRelease: (_) => setSelected(false),
            onPlotLeave: (_) => setSelected(false)
        } as IHandlers)
        setGuid(id)
        return () => { context.RemoveSelect(id) }
    }, []);

    React.useEffect(() => {
        if (guid === "")
            return;

        context.UpdateSelect(guid, {
            axis: props.axis,
            allowSnapping: false,
            onClick,
            onRelease: (_) => setSelected(false),
            onPlotLeave: (_) => setSelected(false)
        } as IHandlers)
    }, [onClick])

   React.useEffect(() => {
      setValue(props.Value);
   }, [props.Value]);

   React.useEffect(() => {
        if (props.setValue === undefined)
            return;
        if (!isSelected && props.Value !== value)
            props.setValue(value);
   }, [isSelected, value]);
   
   React.useEffect(() => {
    if (context.CurrentMode !== 'select')
        setSelected(false);
   },[context.CurrentMode]);

   React.useEffect(() => {
       if (isSelected)
        setValue(context.YHoverSnap[AxisMap.get(props.axis)]);
   }, [context.YHoverSnap, props.axis]);

   return (
       
       <g>
          <path d={generateData(props.Value)} 
           style={{ fill: 'none', strokeWidth: props.width, stroke: props.color }}
           strokeDasharray={props.lineStyle === ':'? '10,5' : 'none'} 
           />
           {props.setValue !== undefined && props.Value !== value && isSelected?
           <path d={generateData(value)} 
           style={{ fill: 'none', strokeWidth: props.width, stroke: props.color, opacity: 0.5}}
           strokeDasharray={props.lineStyle === ':'? '10,5' : 'none'} 
           />
           : null}
        </g>
   );
}

export default HorizontalMarker;
