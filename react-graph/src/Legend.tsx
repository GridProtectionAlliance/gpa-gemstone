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
  HideDisabled: boolean
}

const itemHeight = 25;
const itemsWhenBottom = 3;

// line legend consts
const fontFamily = window.getComputedStyle(document.body).fontFamily;
const nonTextualWidth = 25;
const cssStyle = `margin: auto auto auto 0px; display: inline-block; font-weight: 400; font-family: ${fontFamily};`;

function Legend(props: IProps) {
  const graphContext = React.useContext(GraphContext);

  const [nLegendsSm, nLegendsLg] = React.useMemo(() => {
    const newNLegends = [...graphContext.Data.current.values()].reduce((s, c) => {
      if (c.legend === undefined) return s;
      if (props.HideDisabled && !(c.legend?.props?.enabled as boolean ?? true)) return s;
      if ((c.legend?.props?.size ?? 'sm') === 'sm') s.sm = s.sm + 1;
      else s.lg = s.lg + 1;
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
    const findLargestNeededLine = (size: 'sm'|'lg', label: string) => {
        console.log(label)
        const availableWidth = size === 'sm' ? smWidth : lgWidth;
        const availableHeight = size === 'sm' ? smHeight : lgHeight;
        let newFontSize = 1;
        let textHeight = GetTextHeight(fontFamily, `${newFontSize}em`, label, `${cssStyle}`, `${availableWidth - nonTextualWidth}px`);
        let textWidth = GetTextWidth(fontFamily, `${newFontSize}em`, label, `${cssStyle}`, `${textHeight}px`);
        let useML = false;
        while (newFontSize > 0.4 && (textWidth > availableWidth - nonTextualWidth || textHeight > availableHeight)) {
            newFontSize -= 0.05;
            textWidth = GetTextWidth(fontFamily, `${newFontSize}em`, label, `${cssStyle}`, `${availableHeight}px`, `${useML ? 'normal' : undefined}`, `${availableWidth - nonTextualWidth}px`);
            textHeight = GetTextHeight(fontFamily, `${newFontSize}em`, label, `${cssStyle}`, `${availableWidth - nonTextualWidth}px`, `${useML ? 'normal' : undefined}`);
            useML = false;
            // Consider special case when width is limiting but height is available
            if (textWidth >= (availableWidth - nonTextualWidth) && textHeight < availableHeight) {
                useML = true;
                textHeight = GetTextHeight(fontFamily, `${newFontSize}em`, label, `${cssStyle}`, `${availableWidth - nonTextualWidth}px`, `${useML ? 'normal' : undefined}`);
                textWidth = GetTextWidth(fontFamily, `${newFontSize}em`, label, `${cssStyle}`, `${availableHeight}px`, `${useML ? 'normal' : undefined}`, `${availableWidth - nonTextualWidth}px`);
            }
        }
        setNeeded(size, textWidth);
        if (newFontSize < smallestFont) {
          smallestFont = newFontSize;
          isMultiLine = useML;
        }
      }

    const lineLegendArray = _.orderBy(legendArray.filter(legend => 
      (!props.HideDisabled || (legend?.props?.enabled ?? false)) &&
      (legend as React.ReactElement<any>).type === LineLegend
    ),(item) => item?.props?.label?.length ?? 0, ['desc']);
    
    const smLineIndex = lineLegendArray.findIndex(legend => legend?.props?.size === 'sm');
    const lgLineIndex = lineLegendArray.findIndex(legend => legend?.props?.size === 'lg');
    if (smLineIndex >= 0) findLargestNeededLine('sm', lineLegendArray[smLineIndex]?.props?.label);
    if (lgLineIndex >= 0) findLargestNeededLine('lg', lineLegendArray[lgLineIndex]?.props?.label);

    // Find if we have a heat legend
    const handleHeatLegend = (size: 'sm' | 'lg') => {
      const heatIndex = legendArray.findIndex(legend => 
        (props.HideDisabled && !(legend?.props?.enabled ?? false)) &&
        (legend as React.ReactElement<any>).type === HeatLegend &&
        legend?.props?.size === size
      );
      if (heatIndex >=0) setNeeded(size, 50);
    }
    handleHeatLegend('sm');
    handleHeatLegend('lg');

    
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
      UseMultiLine: useMultiLine
    }
  }, [smallestFontSize, smHeight, lgHeight, smWidth, smHeight, useMultiLine]);

  React.useEffect(() => {
    if (props.RequestLegendHeight !== undefined && requiredHeight !== height) props.RequestLegendHeight(requiredHeight);
  }, [requiredHeight, height]);

  React.useEffect(() => {
    if (props.RequestLegendWidth !== undefined && requiredWidth !== width) props.RequestLegendWidth(requiredHeight);
  }, [requiredHeight, height]);

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