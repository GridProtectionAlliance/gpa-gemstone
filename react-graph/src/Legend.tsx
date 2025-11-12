// ******************************************************************************************************
//  ContextlessLegend.tsx - Gbtc
//
//  Copyright © 2021, Grid Protection Alliance.  All Rights Reserved.
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
//  03/19/2021 - C. lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import * as _ from 'lodash';
import { ILegendContext, LegendContext } from './LegendContext';
import { GetScrollbarWidth, GetTextHeight, GetTextWidth } from '@gpa-gemstone/helper-functions';
import LineLegend from './LineLegend';
import HeatLegend from './HeatLegend';

interface IProps {
  orientation: 'horizontal' | 'vertical',
  height: number,
  width: number,
  RequestLegendWidth?: (width: number) => void,
  RequestLegendHeight?: (height: number) => void,
  SendMassCommand?: (args: {requester: string, command: "disable-others"|"enable-all"}) => void, 
  HideDisabled?: boolean,
  LegendElements: JSX.Element[]
}

const itemHeight = 25;
const itemsWhenBottom = 3;

// line legend consts (font family needs to be monospaced)
export const fontFamily = "Courier New"
const nonTextualWidth = 25;
const cssStyle = `margin: auto auto auto 0px; display: inline-block; font-weight: 400; font-family: ${fontFamily};`;

// heat legend consts
const heatWidth = 50;

export const Legend = React.memo((props: IProps) => {
  const massEnableRef = React.useRef((_: string)=>{ /* do nothing */ });

  const [nLegendsSm, nLegendsLg] = React.useMemo(() => {
    const newNLegends = props.LegendElements.reduce((s, c) => {
      if (c === undefined) return s;
      if (props.HideDisabled && !(c?.props?.enabled as boolean ?? true)) return s;
      if ((c as React.ReactElement<any>)?.type === LineLegend) s.sm = s.sm + 1;
      else if ((c as React.ReactElement<any>)?.type === HeatLegend) s.lg = s.lg + 1;
      else {
        s.sm = s.sm + 1;
        console.warn("Unknown legend element found. Please check legend component or children to legend.")
      }
      return s;
    }, { sm: 0, lg: 0 });
    return [newNLegends.sm, newNLegends.lg];
  }, [props.LegendElements, props.HideDisabled]);

  const leftPad = props.orientation === 'horizontal' ? 39 : 0;
  const smHeight = props.orientation === 'horizontal' ? itemHeight : Math.max(props.height / (Math.max(nLegendsSm+ nLegendsLg, 1)), itemHeight);
  const lgHeight = smHeight * (props.orientation === 'horizontal' ? 2 : 1);
  const requiredHeight = Math.ceil(nLegendsSm/ (props.orientation === 'horizontal' ? itemsWhenBottom : 1)) * smHeight + nLegendsLg * lgHeight;
  const scrollBarSpace = (requiredHeight > props.height ? GetScrollbarWidth() : 0);
  const smWidth = ((props.width - leftPad) / (props.orientation === 'horizontal' ? itemsWhenBottom : 1)) - scrollBarSpace;
  const lgWidth = props.width - leftPad - scrollBarSpace;

  const [smallestFontSize, useMultiLine, requiredWidth] = React.useMemo(() => {
    let smallestFont = 1;
    let isMultiLine = false;
    let lgWidthNeeded = 0;
    let smWidthNeeded = 0;
    const legendArray = props.LegendElements;

    const setNeeded = (size: 'sm'|'lg', width: number) => {
      if (size === 'lg' && width > lgWidthNeeded)
        lgWidthNeeded = width;
      else if (size === 'sm' && width > smWidthNeeded) smWidthNeeded = width
    }

    // Handle line array
    const findSizing = (label: string) => {
        let newFontSize = 1;
        let textHeight = GetTextHeight(fontFamily, `${newFontSize}em`, label, `${cssStyle}`, `${smWidth - nonTextualWidth}px`);
        let textWidth = GetTextWidth(fontFamily, `${newFontSize}em`, label, `${cssStyle}`, `${textHeight}px`);
        // LineLegend is considered a "small" element
        if (textWidth > smWidthNeeded) smWidthNeeded = textWidth;

        let useML = false;
        while (newFontSize > 0.4 && (textWidth > smWidth - nonTextualWidth || textHeight > smHeight)) {
            newFontSize -= 0.05;
            textWidth = GetTextWidth(fontFamily, `${newFontSize}em`, label, `${cssStyle}`, `${smHeight}px`, `${useML ? 'normal' : undefined}`, `${smWidth - nonTextualWidth}px`);
            textHeight = GetTextHeight(fontFamily, `${newFontSize}em`, label, `${cssStyle}`, `${smWidth - nonTextualWidth}px`, `${useML ? 'normal' : undefined}`);
            useML = false;
            // Consider special case when width is limiting but height is available
            if (textWidth >= (smWidth - nonTextualWidth) && textHeight < smHeight) {
                useML = true;
                textHeight = GetTextHeight(fontFamily, `${newFontSize}em`, label, `${cssStyle}`, `${smWidth - nonTextualWidth}px`, `${useML ? 'normal' : undefined}`);
                textWidth = GetTextWidth(fontFamily, `${newFontSize}em`, label, `${cssStyle}`, `${smHeight}px`, `${useML ? 'normal' : undefined}`, `${smWidth - nonTextualWidth}px`);
            }
        }
        if (newFontSize < smallestFont) {
          smallestFont = newFontSize;
          isMultiLine = useML;
        }
      }

    const lineLegendArray = _.orderBy(legendArray.filter(legend => 
      (!props.HideDisabled || ((legend?.props?.enabled as boolean) ?? false)) &&
      (legend as React.ReactElement<any>)?.type === LineLegend
    ),(item) => item?.props?.label?.length ?? 0, ['desc']);

    if (lineLegendArray.length > 0) findSizing(lineLegendArray[0]?.props?.label);

    // Find if we have a heat legend
    const heatIndex = legendArray.findIndex(legend => 
      (props.HideDisabled && !((legend?.props?.enabled as boolean)  ?? false)) &&
      (legend as React.ReactElement<any>)?.type === HeatLegend
    );
    // HeatLegend is considered a "large" element
    if (heatIndex >=0) setNeeded('lg', 50);
    if (heatIndex >=0 && heatWidth > lgWidthNeeded) lgWidthNeeded = heatWidth;

    const smTotal = (smWidthNeeded + scrollBarSpace) * (props.orientation === 'horizontal' ? itemsWhenBottom : 1) + leftPad;
    const lgTotal = lgWidthNeeded + leftPad + scrollBarSpace;
  
    return [smallestFont, isMultiLine, Math.max(smTotal, lgTotal)]
  }, [props.LegendElements, props.HideDisabled, lgWidth, smWidth, smHeight, lgHeight, leftPad, props.orientation, scrollBarSpace]);

  const legendContextValue = React.useMemo<ILegendContext>(() => {
    return {
      SmWidth: smWidth,
      LgWidth: lgWidth,
      SmHeight: smHeight,
      LgHeight: lgHeight,
      SmallestFontSize: smallestFontSize,
      UseMultiLine: useMultiLine,
      SendMassEnable: massEnableRef
    }
  }, [smallestFontSize, smHeight, lgHeight, smWidth, smHeight, useMultiLine]);

  React.useEffect(() => {
    if (props.RequestLegendHeight !== undefined && requiredHeight !== props.height) props.RequestLegendHeight(requiredHeight);
  }, [requiredHeight, props.height]);

  React.useEffect(() => {
    if (props.RequestLegendWidth !== undefined && requiredWidth !== props.width) props.RequestLegendWidth(requiredWidth);
  }, [requiredWidth, props.width]);

  React.useEffect(() => {
    massEnableRef.current = (triggerId: string) => {
      const isMassDisable = props.LegendElements.some(element => 
        ((element?.props?.enabled as boolean) && (element?.props?.id !== triggerId))
      );
      if (props.SendMassCommand != null)
        props.SendMassCommand({requester: triggerId, command: isMassDisable ? "disable-others" : "enable-all"});
    }
  }, [props.LegendElements, props.SendMassCommand]);

  return (
    <LegendContext.Provider value={legendContextValue}>
      <div
        style={{
          height: props.height,
          width: props.width,
          paddingLeft: `${leftPad}px`,
          position: (props.orientation === 'horizontal' ? 'absolute' : 'relative'),
          float: (props.orientation as any),
          display: 'flex',
          flexWrap: 'wrap',
          bottom: 0,
          overflowY: requiredHeight > props.height ? 'scroll' : 'hidden',
          overflowX: requiredHeight > props.height ? 'visible' : 'hidden',
          cursor: 'default'
        }}
      >
        {props.LegendElements.map((element, index) => (element !== undefined && (!props.HideDisabled || (element.props.enabled as boolean ?? true)) ?
          <div
            key={index}
            data-html2canvas-ignore={!(element.props.enabled as boolean ?? true)}
          >
            {element}
          </div> : null))}
      </div>
    </LegendContext.Provider>);
});

export default Legend;