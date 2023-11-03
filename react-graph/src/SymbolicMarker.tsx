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
import {AxisIdentifier, AxisMap, GraphContext, IHandlers} from './GraphContext';

export interface IProps {
  xPos: number,
  yPos: number,
  usePixelPositioning?: {x?: boolean, y?: boolean},
  radius: number,
  setPosition?: (x: number, y: number) => void,
  onHover?: () => void,
  axis?: AxisIdentifier
}

const SymbolicMarker: React.FunctionComponent<IProps> = (props) => {
  const context = React.useContext(GraphContext);
  const [position, setPosition] = React.useState<{x: number, y: number}>({x: props.xPos, y: props.yPos});
  const [isSelected, setSelected] = React.useState<boolean>(false);
  const [guid, setGuid] = React.useState<string>("");

  const isInBounds = React.useCallback((xArg: number, yArg: number) => {
    const xP = (props.usePixelPositioning?.x ?? false) ? context.XApplyPixelOffset(props.xPos) : context.XTransformation(props.xPos);
    const xT = context.XTransformation(xArg);
    const yP = (props.usePixelPositioning?.y ?? false) ? context.YApplyPixelOffset(props.yPos) : context.YTransformation(props.yPos, AxisMap.get(props.axis));
    const yT = context.YTransformation(yArg, AxisMap.get(props.axis));
    // Note: This is actually a rectangular box
    return (xT <= xP + props.radius && xT >= xP - props.radius && yT <= yP + props.radius && yT >= yP - props.radius);
  }, [props.axis, props.yPos, props.yPos, props.radius, AxisMap, props.usePixelPositioning, context.XTransformation, context.YTransformation, context.XApplyPixelOffset, context.YApplyPixelOffset]);

  const onClick = React.useCallback((xArg: number, yArg: number) => {
    if (isInBounds(xArg,yArg))
      setSelected(true);
  }, [setSelected, isInBounds]);

  const onMove = React.useCallback((xArg: number, yArg: number) => {
    if (props.onHover !== undefined && isInBounds(xArg,yArg))
      props.onHover();
  }, [props.onHover, isInBounds]);

  React.useEffect(() => {
    const id = context.RegisterSelect({
      onRelease: (_) => setSelected(false),
      onPlotLeave: (_) => setSelected(false),
      onClick,
      onMove,
      axis: props.axis,
      allowSnapping: false
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
      onClick,
      onMove,
      axis: props.axis,
      allowSnapping: false
    } as IHandlers)
  }, [onClick, onMove]);

  React.useEffect(() => {
    setPosition({x: props.xPos, y: props.yPos});
  }, [props.xPos, props.yPos]);

  React.useEffect(() => {
    if (props.setPosition === undefined)
      return;
    if (!isSelected && (props.xPos !== position.x || props.yPos !== position.y))
      props.setPosition(position.x, position.y);
  }, [isSelected, position]);
  
  React.useEffect(() => {
    if (context.CurrentMode !== 'select')
      setSelected(false);
  },[context.CurrentMode]);

  React.useEffect(() => {
    if (isSelected)
      setPosition({x: context.XHoverSnap, y: context.YHoverSnap[AxisMap.get(props.axis)]});
  }, [context.XHoverSnap, context.YHoverSnap]);

  return (
    <>
      <SymbolicGraphic x={props.xPos} y={props.yPos} r={props.radius} a={AxisMap.get(props.axis)} inPixels={props.usePixelPositioning}>{props.children}</SymbolicGraphic>
      {props.setPosition !== undefined && (props.xPos !== position.x || props.yPos !== position.y) ?
        <SymbolicGraphic x={position.x} y={position.y} r={props.radius} a={AxisMap.get(props.axis)} inPixels={props.usePixelPositioning}>{props.children}</SymbolicGraphic>
        : null}
    </>);
}

interface IGraphicProps {
  x: number,
  y: number,
  r: number,
  a: number|AxisIdentifier,
  inPixels?: {x?: boolean, y?: boolean}
}
const SymbolicGraphic: React.FunctionComponent<IGraphicProps> = (props) => {
  const context = React.useContext(GraphContext);
  const xPixels: number = (props.inPixels?.x ?? false) ? context.XApplyPixelOffset(props.x) : context.XTransformation(props.x); 
  const yPixels: number = (props.inPixels?.y ?? false) ? context.YApplyPixelOffset(props.y) : context.YTransformation(props.y, props.a); 
  return (
    <foreignObject x={xPixels-props.r} y={yPixels-props.r} width={2*props.r} height={2*props.r}>
      {props.children}
    </foreignObject>
  );
}

export default SymbolicMarker;
