﻿// ******************************************************************************************************
//  LineLegend.tsx - Gbtc
//
//  Copyright © 2023, Grid Protection Alliance.  All Rights Reserved.
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
//  03/04/2023 - C Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************


import * as React from 'react';
import { LineStyle} from './GraphContext';
import { GetTextWidth, GetTextHeight } from '@gpa-gemstone/helper-functions';
import { CreateGuid } from '@gpa-gemstone/helper-functions';


export interface IProps {
    label: string,
    color: string,
    lineStyle: LineStyle,
    onClick: () => void,
    opacity: number,
    requestWidth?: (newWidth: number, guid: string) => void
}

const nonTextualWidth = 45;
const textFont = "Segoe UI";
function LineLegend(props: IProps) {
  const ref = React.useRef(null);
  const [wLegend, setWLegend] = React.useState<number>(0);
  const [hLegend, setHLegend] = React.useState<number>(0);
  const [textSize, setTextSize] = React.useState<number>(1);
  const [useMultiLine, setUseMultiLine] = React.useState<boolean>(false);
  const [guid, setGuid] = React.useState<string>('');

  React.useLayoutEffect(() => {
    setWLegend(((ref?.current as any)?.offsetWidth) ?? 0);
    setHLegend((ref?.current as any)?.offsetHeight ?? 0);
  });

  React.useEffect(() => {
    const generatedID = CreateGuid();
    setGuid(generatedID);
    return () => {
      if (props.requestWidth !== undefined) props.requestWidth(-1, guid);
    }
  }, [])

  React.useEffect(() => {
    let t = 1;
    let w = GetTextWidth(textFont, `${t}em`, props.label);
    let h = GetTextWidth(textFont, `${t}em`, props.label);
    let useML = false;
    if (props.requestWidth !== undefined) props.requestWidth(h, guid);

    while (t > 0.4 &&  ( w > wLegend - nonTextualWidth || h > hLegend)) {
      t = t - 0.05;
      w = GetTextWidth(textFont, `${t}em`, props.label);
      h = GetTextHeight(textFont, `${t}em`, props.label);
      useML = false;
      // Consider special case when width is limiting but height is available
      if (w > (wLegend - nonTextualWidth) && h < hLegend) {
        useML = true;
        h = GetTextHeight(textFont, `${t}em`, props.label, undefined, `${wLegend-nonTextualWidth}px`, `normal`);
        w = wLegend - nonTextualWidth;
      }
    }
    setTextSize(t);
    setUseMultiLine(useML)
  }, [props.label, wLegend, hLegend])

   return (
    <div ref={ref} onClick={() => props.onClick()} style={{ width: '100%', display: 'flex', alignItems: 'center', marginRight: '5px', height:'100%' }}>
       {(props.lineStyle === '-' ?
         <div style={{ width: ' 10px', height: 0, borderTop: '2px solid', borderRight: '10px solid', borderBottom: '2px solid', borderLeft: '10px solid', borderColor: props.color, overflow: 'hidden', marginRight: '5px',
          opacity: props.opacity }}></div> :
         <div style={{ width: ' 10px', height: '4px', borderTop: '0px solid', borderRight: '3px solid', borderBottom: '0px solid', borderLeft: '3px solid', borderColor: props.color, overflow: 'hidden', marginRight: '5px', opacity: props.opacity }}></div>
       )}
       <label style={{ margin: 'auto', marginLeft: 0, fontSize: textSize + 'em', whiteSpace: (useMultiLine? 'normal' : 'nowrap') }}> {props.label}</label>
    </div>
);
}

export default LineLegend;
