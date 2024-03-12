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
import {GraphContext} from './GraphContext';
import { ILegendContext, LegendContext } from './LegendContext';

interface IProps {
  height: number,
  width: number,
  location: 'bottom'|'right',
  graphHeight: number,
  graphWidth: number,
  RequestLegendWidth: (width: number, requesterID: string) => void,
  RequestLegendHeight: (height: number) => void,
  HideDisabled: boolean
}

const itemHeight = 25;
const itemsWhenBottom = 3;

function Legend(props: IProps) {
  const graphContext = React.useContext(GraphContext);
  const [width, setWidth] = React.useState<number>(props.location === 'bottom'? props.graphWidth : props.width);
  const [height, setHeight] = React.useState<number>(props.location === 'right'? props.graphHeight : props.height);
  const [nLegends, setNLegends] = React.useState<{sm: number, lg: number}>({sm: 0, lg: 0});
  const [hasScroll, setHasScroll] = React.useState<boolean>(false);
  const [leftPad, setLeftPad] = React.useState<number>(0);

  const legendContextValue = React.useMemo(() => {
    const scrollBarSpace = (hasScroll ? 6 : 0);
    const baseWidth = width - leftPad;
    const baseHeight = props.location === 'bottom'? itemHeight : Math.max(height/(Math.max(nLegends.sm + nLegends.lg, 1)), itemHeight);
    return {
      SmWidth: (baseWidth / (props.location === 'bottom'  ? itemsWhenBottom : 1)) - scrollBarSpace,
      LgWidth: baseWidth - scrollBarSpace,
      SmHeight: baseHeight,
      LgHeight: baseHeight * (props.location === 'bottom' ? 2 : 1),
      RequestLegendWidth: props.RequestLegendWidth,
      RequestLegendHeight: props.RequestLegendHeight
    } as ILegendContext
  }, [width, height, props.RequestLegendWidth, props.RequestLegendHeight, hasScroll, props.location, leftPad, nLegends]);

  React.useEffect(() => {
    const newWidth = props.location === 'bottom'? props.graphWidth : props.width;
    if (newWidth !== width) setWidth(newWidth);
  }, [props.width, props.graphWidth, props.location]);

  React.useEffect(() => {
    const newHeight = props.location === 'right'? props.graphHeight : props.height;
    if (newHeight !== height) setHeight(newHeight);
  }, [props.height, props.graphHeight, props.location]);

  React.useEffect(() => {
    const newNLegends = [...graphContext.Data.values()].reduce((s,c) => {
      if (c.legend === undefined) return s;
      if (props.HideDisabled && !(c.legend?.props?.enabled as boolean ?? true)) return s;
      if ((c.legend?.props?.size ?? 'sm') === 'sm') s.sm = s.sm + 1;
      else s.lg = s.lg + 1;
      return s;
    }, {sm: 0, lg: 0});
    if (newNLegends.sm !== nLegends.sm || newNLegends.lg !== nLegends.lg) setNLegends(newNLegends);
  }, [graphContext.Data, props.HideDisabled]);

  React.useEffect(() => {
    const requiredHeight = Math.ceil(nLegends.sm/ (props.location === 'bottom' ? itemsWhenBottom : 1)) * legendContextValue.SmHeight + nLegends.lg * legendContextValue.LgHeight;
    if (props.RequestLegendHeight !== undefined && requiredHeight !== height) props.RequestLegendHeight(requiredHeight);
    setHasScroll(requiredHeight > height);
  }, [nLegends, props.location, height, props.RequestLegendHeight]);

   React.useEffect(() => setLeftPad(props.location === 'bottom' ? 39 : 0), [props.location]);

  return (
    <LegendContext.Provider value={legendContextValue}>
      <div style={{ height, width, paddingLeft: `${leftPad}px`, position: (props.location === 'bottom'? 'absolute' : 'relative'), float:(props.location as any), display: 'flex', flexWrap: 'wrap', bottom: 0, 
        overflowY: hasScroll ? 'scroll' : 'hidden', overflowX: hasScroll ? 'visible' : 'hidden', cursor: 'default' }}>
        {[...graphContext.Data.values()].map((series, index) => (series.legend !== undefined && (!props.HideDisabled || (series.legend.props.enabled as boolean ?? true)) ? 
          <div key={index} data-html2canvas-ignore={!(series.legend.props.enabled as boolean ?? true)}>{series.legend}</div> : null))}
      </div>
    </LegendContext.Provider>);
}

export default React.memo(Legend);