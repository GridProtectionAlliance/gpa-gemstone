// ******************************************************************************************************
//  Vertica;Marker.tsx - Gbtc
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
    setValue?: (x: number) => void,
    color: string,
    lineStyle: LineStyle,
    width: number
}

function VerticalMarker(props: IProps) {
  /*
    Marks an X Value vertically as a line.
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
    }, [props.width, props.Value])

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
        setValue(context.XHover);
   }, [context.XHover])

   function generateData() {
       const y1 = (props.start === undefined? context.YDomain[0] : props.start);
       const y2 = (props.end === undefined? context.YDomain[1] : props.end);

       return `M ${context.XTransformation(props.Value)} ${context.YTransformation(y1)} L ${context.XTransformation(props.Value)} ${context.YTransformation(y2)}`;
   }

   function onClick(x: number, _: number) {
       let xP = context.XTransformation(props.Value);
       let xT = context.XTransformation(x);
        if (xT <= xP + (props.width/2) && xT >= xP - (props.width/2))
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

export default VerticalMarker;
