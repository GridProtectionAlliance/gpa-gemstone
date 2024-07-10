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

export type origin = ("upper-right" | "upper-left" | "upper-center" | "lower-right" | "lower-left" | "lower-center")

interface IProps {
  /**
   * Specifies the X coordinate of the upper left corner of the box (or other spots depending on origin).
   */
  X: number,
  /**
   * Specifies the Y coordinate of the upper left corner of the box (or other spots depending on origin).
   */
  Y: number,
  /**
   * Determines if the positioning should be based on pixel values.
   */
  UsePixelPositioning?: boolean,
  /**
   * If true, snapping of the box to grid or other elements is disallowed.
   */
  DisallowSnapping?: boolean,
  /**
   * Identifier for the axis the box is associated with.
   */
  Axis?: AxisIdentifier,
  /**
   * Specifies the origin point for positioning the box.
   */
  Origin?: origin,
  /**
   * Specifies the offset of the box from the origin point, in pixels.
   */
  Offset?: number,
  /**
   * DOM ID of the child element, used for sizing the child.
   */
  ChildID: string,
  /**
   * Opacity of the box.
   */
  Opacity?: number,
  /**
   * Function to set the position of the box.
   */
  SetPosition?: (x: number, y: number) => void,
  /**
   * Event handler for mouse move events.
   */
  OnMouseMove?: (x: number, y: number) => void,
}

interface IGraphicProps {
  X: number,
  Y: number,
  Width: number,
  Height: number,
  Opacity?: number
}

const offsetDefault = 0;
const widthPadding = 3;

const Infobox: React.FunctionComponent<IProps> = (props) => {
  const context = React.useContext(GraphContext);
  const [isSelected, setSelected] = React.useState<boolean>(false);
  const [position, setPosition] = React.useState<{ x: number, y: number }>({ x: props.X, y: props.Y });
  const [size, setSize] = React.useState<{ width: number, height: number }>({ width: 100, height: 100 });
  const [guid, setGuid] = React.useState<string>("");

  // Functions
  const calculateX = React.useCallback((xArg: number) => {
    let x: number = (props.UsePixelPositioning ?? false) ? context.XApplyPixelOffset(xArg) : context.XTransformation(xArg);
    // Convert x/y to upper-left corner
    switch (props.Origin) {
      case "lower-right":
      case "upper-right": {
        x -= (size.width + (props.Offset ?? offsetDefault));
        break;
      }
      case "lower-center":
      case "upper-center": {
        x -= Math.floor(size.width / 2);
        break;
      }
      // Do-nothing case
      case undefined:
      case "lower-left":
      case "upper-left":
        x += props.Offset ?? offsetDefault;
        break;
    }
    return x;
  }, [context.XApplyPixelOffset, context.XTransformation, props.Origin, props.Offset, props.UsePixelPositioning, size]);

  const calculateY = React.useCallback((yArg: number) => {
    let y: number = (props.UsePixelPositioning ?? false) ? context.YApplyPixelOffset(yArg) : context.YTransformation(yArg, AxisMap.get(props.Axis));
    // Convert x/y to upper-left corner
    switch (props.Origin) {
      case undefined:
      case "upper-left":
      case "upper-right":
      case "upper-center":
        y += props.Offset ?? offsetDefault;
        break;
      case "lower-left":
      case "lower-right":
      case "lower-center":
        y -= (size.height + (props.Offset ?? offsetDefault));
        break;
    }
    return y;
  }, [context.YApplyPixelOffset, context.YTransformation, props.Origin, props.Offset, props.UsePixelPositioning, props.Axis, size]);

  const onClick = React.useCallback((xArg: number, yArg: number) => {
    const xP = calculateX(props.X);
    const xT = context.XTransformation(xArg);
    const yP = calculateY(props.Y);
    const yT = context.YTransformation(yArg, AxisMap.get(props.Axis));
    if (xT <= xP + size.width && xT >= xP && yT <= yP + size.height && yT >= yP) {
      setSelected(true);
    }
  }, [props.X, props.Y, calculateX, calculateY, size, setSelected, context.XTransformation, context.YTransformation, props.Axis]);

  // Note: this is the only function not effected by usePixelPositioning
  const onMove = props.OnMouseMove === undefined ? undefined : React.useCallback((xArg: number, yArg: number) => {
    if (props.OnMouseMove !== undefined) props.OnMouseMove(xArg, yArg);
  }, [props.OnMouseMove]);

  // useEffect
  React.useEffect(() => {
    const id = context.RegisterSelect({
      axis: props.Axis,
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
      axis: props.Axis,
      allowSnapping: false,
      onRelease: (_) => setSelected(false),
      onPlotLeave: (_) => setSelected(false),
      onClick,
      onMove
    } as IHandlers)
  }, [onClick, onMove, props.Axis]);

  React.useEffect(() => {
    setPosition({ x: props.X, y: props.Y });
  }, [props.X, props.Y]);

  React.useEffect(() => {
    if (props.SetPosition === undefined)
      return;
    if (!isSelected && (props.X !== position.x || props.Y !== position.y))
      props.SetPosition(position.x, position.y);
  }, [isSelected, position]);

  React.useEffect(() => {
    if (context.CurrentMode !== 'select')
      setSelected(false);
  }, [context.CurrentMode]);

  React.useEffect(() => {
    if (isSelected && !(props.DisallowSnapping ?? false))
      setPosition({ x: context.XHoverSnap, y: context.YHoverSnap[AxisMap.get(props.Axis)] });
  }, [context.XHoverSnap, context.YHoverSnap, props.Axis]);

  React.useEffect(() => {
    if (isSelected && (props.DisallowSnapping ?? false))
      setPosition({ x: context.XHover, y: context.YHover[AxisMap.get(props.Axis)] });
  }, [context.XHover, context.YHover, props.Axis]);

  // Get Heights and Widths
  React.useEffect(() => {
    const newSize = getSize(props.ChildID);
    if (newSize.width - widthPadding !== size.width || newSize.height !== size.height) 
      setSize(newSize);
    
  }, [props.children, props.ChildID]);

  return (
    <g>
      <InfoGraphic X={calculateX(props.X)} Y={calculateY(props.Y)} Width={size.width} Height={size.height} Opacity={props.Opacity} />
      <foreignObject x={calculateX(props.X)} y={calculateY(props.Y)} width={size.width} height={size.height} >
        {props.children}
      </foreignObject>
      {props.SetPosition !== undefined && (props.X !== position.x || props.Y !== position.y) ?
        <InfoGraphic X={calculateX(position.x)} Y={calculateY(position.y)} Width={size.width} Height={size.height} Opacity={props.Opacity} />
        : null}
    </g>);
}

const InfoGraphic: React.FunctionComponent<IGraphicProps> = (props) => {
  return (
    <path d={`M ${props.X} ${props.Y} h ${props.Width} v ${props.Height} h -${props.Width} v -${props.Height}`} stroke={'black'} style={{ opacity: props.Opacity ?? 1 }} />
  );
}

//helper functions
const getSize = (childID: string): { width: number, height: number } => {
  const childElement = document.getElementById(childID);
  if (childElement == null) {
    console.error(`Invalid element id passed for child element in infobox ${childID}`);
    return { width: 100, height: 100 };
  }
  const width = Math.ceil(childElement.clientWidth) + widthPadding
  const height = Math.ceil(childElement.clientHeight)
  return { width, height }
}
export default Infobox;
