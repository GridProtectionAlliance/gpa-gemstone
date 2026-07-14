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
import { GraphContext } from './GraphContext';
import { Legend } from './Legend';

interface IProps {
  /** Side of the graph where the legend is displayed. */
  location: 'bottom' | 'right',
  /** Graph height available for sizing the legend in pixels. */
  graphHeight: number,
  /** Graph width available for sizing the legend in pixels. */
  graphWidth: number,
  /** Current legend height in pixels. */
  height: number,
  /** Current legend width in pixels. */
  width: number,
  /**
   * Callback that reports the width required by the legend.
   * @param width - Required legend width in pixels.
   */
  RequestLegendWidth: (width: number) => void,
  /**
   * Callback that reports the height required by the legend.
   * @param height - Required legend height in pixels.
   */
  RequestLegendHeight: (height: number) => void,
  /**
   * Callback that broadcasts an enable or disable command to legend entries.
   * @param args - Requesting entry and command to broadcast.
   */
  SendMassCommand: (args: {requester: string, command: "disable-others"|"enable-all"}) => void, 
  /** Controls whether disabled entries are removed from the legend. */
  HideDisabled: boolean
}

/**
 * Builds a legend from data series registered in the graph context.
 * @param props - Legend placement, dimensions, sizing callbacks, and visibility rules.
 * @returns Context-driven graph legend.
 */
function LegendWithContext(props: IProps) {
  const context = React.useContext(GraphContext);

  const elements = React.useMemo(() => 
    [...context.Data.current.values()]
      .map(element => element.legend)
      .filter(element => element != null)
  ,[context.DataGuid]);

  const width = props.location === 'bottom' ? props.graphWidth : props.width;
  const height = props.location === 'right' ? props.graphHeight : props.height;

  return (
  <Legend
    orientation={props.location === 'bottom' ? 'horizontal': 'vertical'}
    height={height}
    width={width}
    RequestLegendHeight={props.RequestLegendHeight}
    RequestLegendWidth={props.RequestLegendWidth}
    SendMassCommand={props.SendMassCommand}
    HideDisabled={props.HideDisabled}
    LegendElements={elements}
    />
  );
}

export default React.memo(LegendWithContext);
