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
  offset?: number,
  // Specifies the maximum dimensions of the box
  maxWidth?: number,
  maxHeight?: number,
  opacity?: number,
  // Info to fill the box in
  info: string,
  // Function to move box
  setPosition?: (x: number, y: number) => void,
}

function Infobox(props: IProps) {
  const context = React.useContext(GraphContext);
  const [isSelected, setSelected] = React.useState<boolean>(false);
  const [boxWidth, setBoxWidth] = React.useState<number>(5);
  const [boxHeight, setBoxHeight] = React.useState<number>(5);
  const [position, setPosition] = React.useState<{x: number, y: number}>({x: props.x, y: props.y});
  const [guid, setGuid] = React.useState<string>("");
  const [offSetPix, setOffsetPix] = React.useState<number>(0);

  // text formatting consts
  const fontSize = "1em";
  const font = "Segoe UI";
  
  // Functions
  const calculateX = React.useCallback((xArg: number) => {
    let x: number = context.XTransformation(xArg);
    // Convert x/y to upper-left corner
    switch(props.origin) {
      case "upper-right": {
        x -= (boxWidth + offSetPix);
        break;
      }
      case "upper-center": {
        x -= Math.floor(boxWidth / 2);
        break;
      }
      // Do-nothing case
      case undefined: 
      case "upper-left":
        x += offSetPix;
        break;
    }
    return x;
  }, [context.XTransformation, props.origin, offSetPix]);
  
  const calculateY = React.useCallback((yArg: number) => {
    let y: number = context.YTransformation(yArg);
    // Convert x/y to upper-left corner
    switch(props.origin) {
      case undefined: 
      case "upper-left":
      case "upper-right":
      case "upper-center":
        y += offSetPix;
        break;
    }
    return y;
  }, [context.YTransformation, props.origin, offSetPix]);
  
  const onClickConsumable = React.useCallback((xArg: number, yArg: number) => {
    const xP = calculateX(props.x);
    const xT = context.XTransformation(xArg);
    const yP = calculateY(props.y);
    const yT = context.YTransformation(yArg);
    console.log(`(${xP}, ${yP}); (${xT}, ${yT}); ${boxWidth}/${boxHeight}`)
    if (xT <= xP + boxWidth && xT >= xP && yT <= yP + boxHeight && yT >= yP) {
      setSelected(true);
      return true;
    }
    return false;
  }, [props.x, props.y, calculateX, calculateY, boxWidth, boxHeight, setSelected, context.XTransformation, context.YTransformation]);
  
  const getGraphic = React.useCallback((xArg: number, yArg: number) => {
    return <path d={`M ${calculateX(xArg)} ${calculateY(yArg)} h ${boxWidth} v ${boxHeight} h -${boxWidth} v -${boxHeight}`} stroke={'black'} style={{opacity: props.opacity ?? 1}} />
  }, [calculateX, calculateY, boxWidth, boxHeight, props.opacity]);

  // useEffect
  React.useEffect(() => {
    const id = context.RegisterSelect({
      onRelease: (_) => setSelected(false),
      onPlotLeave: (_) => setSelected(false),
      onClickConsumable
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
      onClickConsumable
    } as IHandlers)
  }, [onClickConsumable]);
  
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

  React.useEffect(()=> {
    // Get height/width dimensions, limited by maxes (if provided)
    let divWidth = GetBoxWidth(font, fontSize, props.info, undefined, true);
    if (props.maxWidth !== undefined && divWidth > props.maxWidth)
    divWidth = props.maxWidth;
    let divHeight = GetBoxHeight(font, fontSize, props.info, undefined, divWidth + 'px');
    if (props.maxHeight !== undefined && divHeight > props.maxHeight)
      divHeight = props.maxHeight;

    setBoxWidth(divWidth);
    setBoxHeight(divHeight);
  }, [props.info, props.maxHeight, props.maxWidth]);
  
  React.useEffect(() => {
    setOffsetPix(props.offset ?? 0);
  }, [props.offset]);

  return (
    <g>
      {getGraphic(props.x, props.y)}
      <foreignObject x={calculateX(props.x)} y={calculateY(props.y)} width={boxWidth} height={boxHeight}>
        <div style={{ background: 'white', overflow: 'auto', whiteSpace: 'pre-wrap', opacity: props.opacity ?? 1 }}>{props.info}</div>
      </foreignObject>
      {props.setPosition !== undefined && (props.x !== position.x || props.y !== position.y) ?
        getGraphic(position.x, position.y)
        : null}
    </g>);
}

//TODO: Update helper functions with these as an option later
function GetBoxHeight(font: string, fontSize: string, word: string, cssStyle?: string, widthLimit?: string): number {

    const text = document.createElement("span");
    document.body.appendChild(text);

    text.style.font = font;
    text.style.fontSize = fontSize;
    text.style.height = 'auto';
    text.style.width = widthLimit ?? 'auto';
    text.style.position = 'absolute';
    text.style.whiteSpace = (widthLimit !== undefined) ? 'pre-wrap' : 'no-wrap';

    if (cssStyle !== undefined)
        text.style.cssText = cssStyle;

    text.innerHTML = word;

    const height = Math.ceil(text.clientHeight);
    document.body.removeChild(text);
    return height;
}

function GetBoxWidth(font: string, fontSize: string, word: string, cssStyle?: string, allowWhiteSpace?: boolean): number {

    const text = document.createElement("span");
    document.body.appendChild(text);

    text.style.font = font;
    text.style.fontSize = fontSize;
    text.style.height = 'auto';
    text.style.width = 'auto';
    text.style.position = 'absolute';
    text.style.whiteSpace = (allowWhiteSpace ?? false) ? 'pre-wrap' : 'no-wrap';

    if (cssStyle !== undefined)
        text.style.cssText = cssStyle;

    text.innerHTML = word;

    const width = Math.ceil(text.clientWidth);
    document.body.removeChild(text);
    return width;
} 

export default Infobox;
