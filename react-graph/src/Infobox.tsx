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

import * as React from 'react';
import { AxisIdentifier, AxisMap, GraphContext, IHandlers } from './GraphContext';

interface IProps {
  // Specifies the upper left corner of the box (or other spots depending on origin)
  x: number,
  y: number,
  usePixelPositioning?: boolean,
  disallowSnapping?: boolean,
  axis?: AxisIdentifier,
  origin?: "upper-right" | "upper-left" | "upper-center" | "lower-right" | "lower-left" | "lower-center",
  // Specifies the offset of the pox from the origin point, In pixels
  offset?: number,
  // Dom ID of child, used for sizing of child
  childId: string,
  opacity?: number,
  // Function to move box
  setPosition?: (x: number, y: number) => void,
  onMouseMove?: (x: number, y: number) => void
}

const Infobox = (props: React.PropsWithChildren<IProps>) => {
  const context = React.useContext(GraphContext);
  const [isSelected, setSelected] = React.useState<boolean>(false);
  const [position, setPosition] = React.useState<{x: number, y: number}>({x: props.x, y: props.y});
  const [dimension, setDimensions] = React.useState<{width: number, height: number}>({width: 100, height: 100});
  const [guid, setGuid] = React.useState<string>("");
  const offsetDefault = 0;
  
  // Functions
  const calculateX = React.useCallback((xArg: number) => {
    let x: number = (props.usePixelPositioning ?? false) ? context.XApplyPixelOffset(xArg) : context.XTransformation(xArg);
    // Convert x/y to upper-left corner
    switch(props.origin) {
      case "lower-right":
      case "upper-right": {
        x -= (dimension.width + (props.offset ?? offsetDefault));
        break;
      }
      case "lower-center":
      case "upper-center": {
        x -= Math.floor(dimension.width / 2);
        break;
      }
      // Do-nothing case
      case undefined: 
      case "lower-left":
      case "upper-left":
        x += props.offset ?? offsetDefault;
        break;
    }
    return x;
  }, [context.XApplyPixelOffset, context.XTransformation, props.origin, props.offset, props.usePixelPositioning, dimension]);
  
  const calculateY = React.useCallback((yArg: number) => {
    let y: number = (props.usePixelPositioning ?? false) ? context.YApplyPixelOffset(yArg) : context.YTransformation(yArg, AxisMap.get(props.axis));
    // Convert x/y to upper-left corner
    switch(props.origin) {
      case undefined: 
      case "upper-left":
      case "upper-right":
      case "upper-center":
        y += props.offset ?? offsetDefault;
        break;
      case "lower-left":
      case "lower-right":
      case "lower-center":
        y -= (dimension.height + (props.offset ?? offsetDefault));
        break;
    }
    return y;
  }, [context.YApplyPixelOffset, context.YTransformation, props.origin, props.offset, props.usePixelPositioning, props.axis, dimension]);
  
  const onClick = React.useCallback((xArg: number, yArg: number) => {
    const xP = calculateX(props.x);
    const xT = context.XTransformation(xArg);
    const yP = calculateY(props.y);
    const yT = context.YTransformation(yArg, AxisMap.get(props.axis));
    if (xT <= xP + dimension.width && xT >= xP && yT <= yP + dimension.height && yT >= yP) {
      setSelected(true);
    }
  }, [props.x, props.y, calculateX, calculateY, dimension, setSelected, context.XTransformation, context.YTransformation, props.axis]);
  
  // Note: this is the only function not effected by usePixelPositioning
  const onMove = props.onMouseMove === undefined ? undefined : React.useCallback((xArg: number, yArg: number) => {
    if (props.onMouseMove !== undefined) props.onMouseMove(xArg, yArg);
  }, [props.onMouseMove]);


  // useEffect
  React.useEffect(() => {
    const id = context.RegisterSelect({
      axis: props.axis,
      allowSnapping: false,
      onRelease: (_) => setSelected(false),
      onPlotLeave: (_) => setSelected(false),
      onClick,
      onMove
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
      onRelease: (_) => setSelected(false),
      onPlotLeave: (_) => setSelected(false),
      onClick,
      onMove
    } as IHandlers)
  }, [onClick, onMove, props.axis]);
  
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
    if (isSelected && !(props.disallowSnapping ?? false))
        setPosition({x: context.XHoverSnap, y: context.YHoverSnap[AxisMap.get(props.axis)]});
  }, [context.XHoverSnap, context.YHoverSnap, props.axis]);
  
  React.useEffect(() => {
    if (isSelected && (props.disallowSnapping ?? false))
        setPosition({x: context.XHover, y: context.YHover[AxisMap.get(props.axis)]});
  }, [context.XHover, context.YHover, props.axis]);
  
  // Get Heights and Widths
  React.useEffect(() => {
    const domEle = document.getElementById(props.childId);
    if (domEle == null) {
      console.error(`Invalid element id passed for child element in infobox ${props.childId}`);
      setDimensions({width: 100, height: 100});
      return;
    }
    if (dimension.width === Math.ceil(domEle.clientWidth) && dimension.height === Math.ceil(domEle.clientHeight)) return;
    setDimensions({width: Math.ceil(domEle.clientWidth), height: Math.ceil(domEle.clientHeight)});
  }, [props.children, props.childId]);

  return (
    <g>
      <InfoGraphic x={calculateX(props.x)} y={calculateY(props.y)} width={dimension.width} height={dimension.height} opacity={props.opacity} />
      <foreignObject x={calculateX(props.x)} y={calculateY(props.y)} width={dimension.width} height={dimension.height}>
        {props.children}
      </foreignObject>
      {props.setPosition !== undefined && (props.x !== position.x || props.y !== position.y) ?
        <InfoGraphic x={calculateX(position.x)} y={calculateY(position.y)} width={dimension.width} height={dimension.height} opacity={props.opacity} />
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
const InfoGraphic = (props: IGraphicProps) => {
  return (
    <path d={`M ${props.x} ${props.y} h ${props.width} v ${props.height} h -${props.width} v -${props.height}`} stroke={'black'} style={{opacity: props.opacity ?? 1}} />
  );
}

export default Infobox;
