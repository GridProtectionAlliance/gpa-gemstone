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
import {GraphContext, IHandlers, LineStyle} from './GraphContext';

export interface IProps {
    start?: number,
    end?: number,
    Value: number,
    setValue?: (y: number) => void,
    color: string,
    lineStyle: LineStyle,
    width: number
}

function HorizontalMarker(props: IProps) {
  /*
    Marks a Y Value horizontally as a line.
  */
  const context = React.useContext(GraphContext)
  const [value, setValue] = React.useState<number>(props.Value);
  const [ isSelected, setSelected] = React.useState<boolean>(false);
  const [guid, setGuid] = React.useState<string>("");

  React.useEffect(() => {
        const id = context.RegisterSelect({
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
            onClick,
            onRelease: (_) => setSelected(false),
            onPlotLeave: (_) => setSelected(false)
        } as IHandlers)
    }, [props.width, props.Value, ])

   React.useEffect(() => {
      setValue(props.Value);
   }, [props.Value]);

   React.useEffect(() => {
        if (props.setValue === undefined)
            return;
        if (!isSelected && props.Value !== value)
            props.setValue(value);
   }, [isSelected, value])
   
   React.useEffect(() => {
    if (context.CurrentMode !== 'select')
        setSelected(false);
   },[context.CurrentMode])

   React.useEffect(() => {
       if (isSelected)
        setValue(context.YHover);
   }, [context.YHover])

   function generateData() {
       const x1 = (props.start === undefined? context.XDomain[0] : props.start);
       const x2 = (props.end === undefined? context.XDomain[1] : props.end);

       return `M ${context.XTransformation(x1)} ${context.YTransformation(value)} L ${context.XTransformation(x2)} ${context.YTransformation(value)}`;
   }

   function onClick(_: number, y: number) {
        let yP = context.YTransformation(props.Value);
        let yT = context.YTransformation(y);
        if (yT <= yP + (props.width/2) && yT >= yP - (props.width/2))
          setSelected(true);
   }

   return (
       
       <g>
          <path d={generateData()} 
           style={{ fill: 'none', strokeWidth: props.width, stroke: props.color, cursor: (props.setValue !== undefined && true)? 'grab' : 'auto' }}
           strokeDasharray={props.lineStyle === ':'? '10,5' : 'none'} 
           />
        </g>
   );
}

export default HorizontalMarker;
