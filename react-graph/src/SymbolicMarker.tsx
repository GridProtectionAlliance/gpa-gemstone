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
import {GraphContext, IHandlers} from './GraphContext';

export interface IProps {
  xPos: number,
  yPos: number,
  radius: number,
  setPosition?: (x: number, y: number) => void,
  onHover?: () => void
}

const SymbolicMarker: React.FunctionComponent<React.PropsWithChildren<IProps>> = (props) => {
  const context = React.useContext(GraphContext);
  const [position, setPosition] = React.useState<{x: number, y: number}>({x: props.xPos, y: props.yPos});
  const [isSelected, setSelected] = React.useState<boolean>(false);
  const [guid, setGuid] = React.useState<string>("");

  React.useEffect(() => {
    const id = context.RegisterSelect({
      onRelease: (_) => setSelected(false),
      onPlotLeave: (_) => setSelected(false),
      onClick,
      onMove,
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
      onMove
    } as IHandlers)
  }, [props.radius, props.xPos, props.yPos]);

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
      setPosition({x: context.XHover, y: context.YHover});
  }, [context.XHover, context.YHover]);

  function isInBounds(xArg: number, yArg: number) {
    const xP = context.XTransformation(props.xPos);
    const xT = context.XTransformation(xArg);
    const yP = context.YTransformation(props.yPos);
    const yT = context.YTransformation(yArg);
    // Note: This is actually a rectangular box
    return (xT <= xP + props.radius && xT >= xP - props.radius && yT <= yP + props.radius && yT >= yP - props.radius);
  }

  function onClick(xArg: number, yArg: number): void {
    if (isInBounds(xArg,yArg))
      setSelected(true);
  }

  function onMove(xArg: number, yArg: number) {
    if (props.onHover !== undefined && isInBounds(xArg,yArg))
      props.onHover();
  }

  return (
    <>
      <SymbolicGraphic x={props.xPos} y={props.yPos} r={props.radius}>{props.children}</SymbolicGraphic>
      {props.setPosition !== undefined && (props.xPos !== position.x || props.yPos !== position.y) ?
        <SymbolicGraphic x={position.x} y={position.y} r={props.radius}>{props.children}</SymbolicGraphic>
        : null}
    </>);
}

interface IGraphicProps {
  x: number,
  y: number,
  r: number
}
const SymbolicGraphic: React.FunctionComponent<React.PropsWithChildren<IGraphicProps>> = (props) => {
  const context = React.useContext(GraphContext);
  const xPixels: number = context.XTransformation(props.x); 
  const yPixels: number = context.YTransformation(props.y); 
  return (
    <foreignObject x={xPixels-props.r} y={yPixels-props.r} width={2*props.r} height={2*props.r}>
      {props.children}
    </foreignObject>
  );
}

export default SymbolicMarker;
