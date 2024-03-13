// ******************************************************************************************************
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
import { LineStyle } from './GraphContext';
import { GetTextWidth, GetTextHeight } from '@gpa-gemstone/helper-functions';
import { Warning } from '@gpa-gemstone/gpa-symbols';
import { CreateGuid } from '@gpa-gemstone/helper-functions';
import { ILegendRequiredProps, LegendContext } from './LegendContext';

export interface IProps extends ILegendRequiredProps {
    label: string,
    color: string,
    lineStyle: LineStyle,
    setEnabled: (arg: boolean) => void,
    hasNoData: boolean
}
const fontFamily = `-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`
const nonTextualWidth = 45;
const textFont = "Segoe UI";
const cssStyle = `argin: auto auto auto 0px; display: inline-block; font-weight: 400; font-family: ${fontFamily};`

function LineLegend(props: IProps) {
  const [label, setLabel] = React.useState<string>(props.label);
  const [legendWidth, setLegendWith] = React.useState<number>(100);
  const [legendHeight, setLegendHeight] = React.useState<number>(100);
  const [textSize, setTextSize] = React.useState<number>(1);
  const [useMultiLine, setUseMultiLine] = React.useState<boolean>(false);
  const [guid] = React.useState<string>(CreateGuid());
  const context = React.useContext(LegendContext);
  React.useEffect(() => {
    return () => {
      context.RequestLegendWidth(-1, guid);
    }
  }, []);

  React.useEffect(() => {
    setLabel((props.hasNoData ? Warning : "") + props.label);
  }, [props.hasNoData, props.label]);

  React.useEffect(() => setLegendWith(props.size === 'sm' ? context.SmWidth : context.LgWidth), [context.LgWidth, context.SmWidth, props.size]);
  React.useEffect(() => setLegendHeight(props.size === 'sm' ? context.SmHeight : context.LgHeight), [context.SmHeight, context.LgHeight, props.size]);

  React.useEffect(() => {
    let fontSize = 1;
    let textWidth = GetTextWidth(textFont, `${fontSize}em`, label, `${cssStyle}`);
    let textHeight = GetTextHeight(textFont, `${fontSize}em`, label, `${cssStyle}`);
    let useML = false;
    context.RequestLegendWidth(textWidth + nonTextualWidth, guid);
        
    while (fontSize > 0.4 && (textWidth > legendWidth - nonTextualWidth || textHeight > legendHeight)) {
      fontSize = fontSize - 0.05;
      textWidth = GetTextWidth(textFont, `${fontSize}em`, label, `${cssStyle};`, undefined, `${useML ? 'normal' : undefined}`);
      textHeight = GetTextHeight(textFont, `${fontSize}em`, label, `${cssStyle}`);
      useML = false;

      // Consider special case when width is limiting but height is available
      if (textWidth > (legendWidth - nonTextualWidth) && textHeight < legendHeight) {
        useML = true;
        textHeight = GetTextHeight(textFont, `${fontSize}em`, label,  `${cssStyle}`, `${legendWidth-nonTextualWidth}px`, `normal`);
        textWidth = legendWidth - nonTextualWidth;
      }
    }
    setTextSize(fontSize);
    setUseMultiLine(useML);
  }, [label, legendWidth, legendHeight, props.size, props.hasNoData]);

   return (
    <div style={{ height: legendHeight, width: legendWidth }}>
      <div onClick={() => props.setEnabled(!props.enabled)} style={{ width: '100%', display: 'flex', alignItems: 'center', marginRight: '5px', height: '100%' }}>
        {(props.lineStyle === '-' ?
          <div style={{ width: ' 10px', height: 0, borderTop: '2px solid', borderRight: '10px solid', borderBottom: '2px solid', borderLeft: '10px solid', borderColor: props.color, overflow: 'hidden', marginRight: '5px', opacity: (props.enabled? 1 : 0.5) }}></div> :
          <div style={{ width: ' 10px', height: '4px', borderTop: '0px solid', borderRight: '3px solid', borderBottom: '0px solid', borderLeft: '3px solid', borderColor: props.color, overflow: 'hidden', marginRight: '5px', opacity:(props.enabled? 1 : 0.5) }}></div>
        )}
        <label style={{ fontFamily: fontFamily, fontWeight: 400, display: 'inline-block', margin: 'auto', marginLeft: 0, fontSize: textSize + 'em', whiteSpace: (useMultiLine? 'normal' : 'nowrap') }}> {label}</label>
      </div>
    </div>
);
}

export default LineLegend;