// ******************************************************************************************************
//  Legend.tsx - Gbtc
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
import { GraphContext, IDataSeries } from './GraphContext';
import { ILegendContext, ILegendRequiredProps, LegendContext } from './LegendContext';
import { GetScrollbarWidth, GetTextHeight, GetTextWidth } from '@gpa-gemstone/helper-functions';
import LineLegend from './LineLegend';
import HeatLegend from './HeatLegend';

interface IProps {
  height: number,
  width: number,
  location: 'bottom' | 'right',
  graphHeight: number,
  graphWidth: number,
  RequestLegendWidth: (width: number) => void,
  RequestLegendHeight: (height: number) => void,
  SendMassCommand: (args: {requester: string, command: "disable-others"|"enable-all"}) => void, 
  HideDisabled: boolean
}

const itemHeight = 25;
const itemsWhenBottom = 3;

// line legend consts (font family needs to be monospaced)
export const fontFamily = "Courier New"
const nonTextualWidth = 25;
const cssStyle = `margin: auto auto auto 0px; display: inline-block; font-weight: 400; font-family: ${fontFamily};`;

// heat legend consts
const heatWidth = 50;

function Legend(props: IProps) {
  const graphContext = React.useContext(GraphContext);
  const massEnableRef = React.useRef((_: string)=>{});

  const [nLegendsSm, nLegendsLg] = React.useMemo(() => {
    const newNLegends = [...graphContext.Data.current.values()].reduce((s, c) => {
      if (c.legend === undefined) return s;
      if (props.HideDisabled && !(c.legend?.props?.enabled as boolean ?? true)) return s;
      if ((c.legend as React.ReactElement<any>)?.type === LineLegend) s.sm = s.sm + 1;
      else if ((c.legend as React.ReactElement<any>)?.type === HeatLegend) s.lg = s.lg + 1;
      else {
        s.sm = s.sm + 1;
        console.warn("Unknown legend element found. Please check legend component or children to legend.")
      }
      return s;
    }, { sm: 0, lg: 0 });
    return [newNLegends.sm, newNLegends.lg];
  }, [graphContext.DataGuid, props.HideDisabled]);

  const leftPad = props.location === 'bottom' ? 39 : 0;
  const width = props.location === 'bottom' ? props.graphWidth : props.width;
  const height = props.location === 'right' ? props.graphHeight : props.height;

  const smHeight = props.location === 'bottom' ? itemHeight : Math.max(height / (Math.max(nLegendsSm+ nLegendsLg, 1)), itemHeight);
  const lgHeight = smHeight * (props.location === 'bottom' ? 2 : 1);
  const requiredHeight = Math.ceil(nLegendsSm/ (props.location === 'bottom' ? itemsWhenBottom : 1)) * smHeight + nLegendsLg * lgHeight;
  const scrollBarSpace = (requiredHeight > height ? GetScrollbarWidth() : 0);
  const smWidth = ((width - leftPad) / (props.location === 'bottom' ? itemsWhenBottom : 1)) - scrollBarSpace;
  const lgWidth = width - leftPad - scrollBarSpace;

  const [smallestFontSize, useMultiLine, requiredWidth] = React.useMemo(() => {
    let smallestFont = 1;
    let isMultiLine = false;
    let lgWidthNeeded = 0;
    let smWidthNeeded = 0;
    const legendArray = [...graphContext.Data.current.values()].map(dataSeries => dataSeries?.legend);

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
      (!props.HideDisabled || (legend?.props?.enabled ?? false)) &&
      (legend as React.ReactElement<any>)?.type === LineLegend
    ),(item) => item?.props?.label?.length ?? 0, ['desc']);

    if (lineLegendArray.length > 0) findSizing(lineLegendArray[0]?.props?.label);

    // Find if we have a heat legend
    const heatIndex = legendArray.findIndex(legend => 
      (props.HideDisabled && !(legend?.props?.enabled ?? false)) &&
      (legend as React.ReactElement<any>)?.type === HeatLegend
    );
    // HeatLegend is considered a "large" element
    if (heatIndex >=0) setNeeded('lg', 50);
    if (heatIndex >=0 && heatWidth > lgWidthNeeded) lgWidthNeeded = heatWidth;

    const smTotal = (smWidthNeeded + scrollBarSpace) * (props.location === 'bottom' ? itemsWhenBottom : 1) + leftPad;
    const lgTotal = lgWidthNeeded + leftPad + scrollBarSpace;
  
    return [smallestFont, isMultiLine, Math.max(smTotal, lgTotal)]
  }, [graphContext.DataGuid, props.HideDisabled, lgWidth, smWidth, smHeight, lgHeight, leftPad, props.location, scrollBarSpace]);

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
    if (props.RequestLegendHeight !== undefined && requiredHeight !== height) props.RequestLegendHeight(requiredHeight);
  }, [requiredHeight, height]);

  React.useEffect(() => {
    if (props.RequestLegendWidth !== undefined && requiredWidth !== width) props.RequestLegendWidth(requiredHeight);
  }, [requiredHeight, height]);

  React.useEffect(() => {
    massEnableRef.current = (triggerId: string) => {
      const isMassDisable = [...graphContext.Data.current.values()].some(dataSeries => 
        (dataSeries?.legend?.props?.enabled && (dataSeries?.legend?.props?.id !== triggerId))
      );
      props.SendMassCommand({requester: triggerId, command: isMassDisable ? "disable-others" : "enable-all"});
    }
  }, [graphContext.DataGuid, props.SendMassCommand]);

  return (
    <LegendContext.Provider value={legendContextValue}>
      <div
        style={{
          height,
          width,
          paddingLeft: `${leftPad}px`,
          position: (props.location === 'bottom' ? 'absolute' : 'relative'),
          float: (props.location as any),
          display: 'flex',
          flexWrap: 'wrap',
          bottom: 0,
          overflowY: requiredHeight > height ? 'scroll' : 'hidden',
          overflowX: requiredHeight > height ? 'visible' : 'hidden',
          cursor: 'default'
        }}
      >
        {[...graphContext.Data.current.values()].map((series, index) => (series.legend !== undefined && (!props.HideDisabled || (series.legend.props.enabled as boolean ?? true)) ?
          <div
            key={index}
            data-html2canvas-ignore={!(series.legend.props.enabled as boolean ?? true)}
          >
            {series.legend}
          </div> : null))}
      </div>
    </LegendContext.Provider>);
}

export default React.memo(Legend);