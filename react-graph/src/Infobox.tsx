// ******************************************************************************************************
//  Infobox.tsx - Gbtc
//
//  Copyright © 2020, Grid Protection Alliance.  All Rights Reserved.
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
//  06/16/2023 - G Santos
//       Generated original version of source code.
//
// ******************************************************************************************************

import { GetTextWidth } from '@gpa-gemstone/helper-functions';
import * as React from 'react';
import { GraphContext, IHandlers } from './GraphContext';

interface IProps {
  // Specifies the upper left corner of the box (or other spots depending on origin)
  x: number,
  y: number,
  origin?: "upper-right" | "upper-left" | "upper-center",
  // Specifies the offset of the pox from the origin point, In pixels
  offset?: number,
  // Specifies the dimensions of the box (in pixels)
  width: number,
  height: number,
  opacity?: number,
  // Function to move box
  setPosition?: (x: number, y: number) => void
}

const Infobox: React.FunctionComponent<IProps> = (props) => {
  const context = React.useContext(GraphContext);
  const [isSelected, setSelected] = React.useState<boolean>(false);
  const [position, setPosition] = React.useState<{x: number, y: number}>({x: props.x, y: props.y});
  const [guid, setGuid] = React.useState<string>("");
  const offsetDefault = 0;
  
  // Functions
  const calculateX = React.useCallback((xArg: number) => {
    let x: number = context.XTransformation(xArg);
    // Convert x/y to upper-left corner
    switch(props.origin) {
      case "upper-right": {
        x -= (props.width + (props.offset ?? offsetDefault));
        break;
      }
      case "upper-center": {
        x -= Math.floor(props.width / 2);
        break;
      }
      // Do-nothing case
      case undefined: 
      case "upper-left":
        x += props.offset ?? offsetDefault;
        break;
    }
    return x;
  }, [context.XTransformation, props.origin, props.offset]);
  
  const calculateY = React.useCallback((yArg: number) => {
    let y: number = context.YTransformation(yArg);
    // Convert x/y to upper-left corner
    switch(props.origin) {
      case undefined: 
      case "upper-left":
      case "upper-right":
      case "upper-center":
        y += props.offset ?? offsetDefault;
        break;
    }
    return y;
  }, [context.YTransformation, props.origin, props.offset]);
  
  const onClick = React.useCallback((xArg: number, yArg: number) => {
    const xP = calculateX(props.x);
    const xT = context.XTransformation(xArg);
    const yP = calculateY(props.y);
    const yT = context.YTransformation(yArg);
    if (xT <= xP + props.width && xT >= xP && yT <= yP + props.height && yT >= yP) {
      setSelected(true);
    }
  }, [props.x, props.y, calculateX, calculateY, props.width, props.height, setSelected, context.XTransformation, context.YTransformation]);


  // useEffect
  React.useEffect(() => {
    const id = context.RegisterSelect({
      onRelease: (_) => setSelected(false),
      onPlotLeave: (_) => setSelected(false),
      onClick
    } as IHandlers)
    setGuid(id)
    return () => { context.RemoveSelect(id) }
  }, []);
  
  React.useEffect(() => {
    if (guid === "")
      return;
  
    context.UpdateSelect(guid, {
      onRelease: (_) => setSelected(false),
      onPlotLeave: (_) => setSelected(false),
      onClick
    } as IHandlers)
  }, [onClick]);
  
  React.useEffect(() => {
    setPosition({x: props.x, y: props.y});
  }, [props.x, props.y]);

  React.useEffect(() => {
    if (props.setPosition === undefined)
      return;
    if (!isSelected && (props.x !== position.x || props.y !== position.y))
      props.setPosition(position.x, position.y);
  }, [isSelected, position]);
  
  React.useEffect(() => {
    if (context.CurrentMode !== 'select')
      setSelected(false);
  },[context.CurrentMode]);
  
  React.useEffect(() => {
    if (isSelected)
      setPosition({x: context.XHover, y: context.YHover});
  }, [context.XHover, context.YHover]);

  return (
    <g>
      <InfoGraphic x={calculateX(props.x)} y={calculateY(props.y)} width={props.width} height={props.height} opacity={props.opacity} />
      <foreignObject x={calculateX(props.x)} y={calculateY(props.y)} width={props.width} height={props.height}>
        {props.children}
      </foreignObject>
      {props.setPosition !== undefined && (props.x !== position.x || props.y !== position.y) ?
        <InfoGraphic x={calculateX(position.x)} y={calculateY(position.y)} width={props.width} height={props.height} opacity={props.opacity} />
        : null}
    </g>);
}

interface IGraphicProps {
  x: number,
  y: number,
  width: number,
  height: number,
  opacity?: number
}
const InfoGraphic: React.FunctionComponent<IGraphicProps> = (props) => {
  return (
    <path d={`M ${props.x} ${props.y} h ${props.width} v ${props.height} h -${props.width} v -${props.height}`} stroke={'black'} style={{opacity: props.opacity ?? 1}} />
  );
}

export default Infobox;
