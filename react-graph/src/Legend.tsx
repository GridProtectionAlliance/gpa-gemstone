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

import { has } from 'lodash';
import * as React from 'react';
import {GraphContext} from './GraphContext'

interface IProps {
  height: number,
  width: number,
  location: 'bottom'|'right',
  graphHeight: number,
  graphWidth: number
}

function Legend(props: IProps) {
  const context = React.useContext(GraphContext)
  const w = (props.location === 'bottom'? props.graphWidth : props.width);
  const h = (props.location === 'right'? props.graphHeight : props.height);
  const itemHeight = 25;

  const itemsWhenBottom = 3;
  const nLegends = [...context.Data.values()].reduce((s,c) => (c.legend ===undefined? 0 : 1) + s,0)
  const scroll = Math.ceil(nLegends/ (props.location === 'bottom' ? itemsWhenBottom : 1)) * itemHeight > h;
  const position = (props.location === 'bottom'? 'absolute' : 'relative');
  const scrollBarSpace = (scroll === undefined || !scroll ? 0 : 6)

    return (
      <div style={{ height: h, width: w, position, float:(props.location as any) ,display: 'flex', flexWrap: 'wrap', bottom: 0, 
        overflowY: (scroll === undefined || !scroll ? 'visible' : 'scroll'), overflowX: (scroll === undefined || !scroll ? 'visible' : 'hidden')}}>
        {[...context.Data.values()].map((series, index) => (series.legend !== undefined ?
              <div key={index} style={{width:(props.location === 'bottom' ? w/itemsWhenBottom - scrollBarSpace : w-scrollBarSpace), height: props.location === 'bottom'? itemHeight: Math.max(h/nLegends, itemHeight)}}>
                  {series.legend}
          </div> : null))}
      </div>)
}

export default Legend;
