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
import { LineStyle } from './GraphContext';
import { GetTextHeight,  CreateGuid } from '@gpa-gemstone/helper-functions';
import { Warning } from '@gpa-gemstone/gpa-symbols';
import { ILegendRequiredProps, LegendContext } from './LegendContext';

export interface IProps extends ILegendRequiredProps {
    label: string,
    color: string,
    lineStyle: LineStyle,
    setEnabled: (arg: boolean) => void,
    hasNoData: boolean
}

const fontFamily = window.getComputedStyle(document.body).fontFamily;
const nonTextualWidth = 25;
const cssStyle = `margin: auto auto auto 0px; display: inline-block; font-weight: 400; font-family: ${fontFamily};`

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
        let textHeight = GetTextHeight(fontFamily, `${fontSize}em`, label, `${cssStyle}`, `${legendWidth - nonTextualWidth}px`);
        let textWidth = GetTextWidth(fontFamily, `${fontSize}em`, label, `${cssStyle}`, `${textHeight}px`);

        let useML = false;
        context.RequestLegendWidth(textWidth + nonTextualWidth, guid);

        while (fontSize > 0.4 && (textWidth > legendWidth - nonTextualWidth || textHeight > legendHeight)) {
            fontSize -= 0.05;
            
            textWidth = GetTextWidth(fontFamily, `${fontSize}em`, label, `${cssStyle}`, `${legendHeight}px`, `${useML ? 'normal' : undefined}`, `${legendWidth - nonTextualWidth}px`);
            textHeight = GetTextHeight(fontFamily, `${fontSize}em`, label, `${cssStyle}`, `${legendWidth - nonTextualWidth}px`, `${useML ? 'normal' : undefined}`);
            useML = false;
            // Consider special case when width is limiting but height is available
            if (textWidth >= (legendWidth - nonTextualWidth) && textHeight < legendHeight) {
                useML = true;
                textHeight = GetTextHeight(fontFamily, `${fontSize}em`, label, `${cssStyle}`, `${legendWidth - nonTextualWidth}px`, `${useML ? 'normal' : undefined}`);
                textWidth = GetTextWidth(fontFamily, `${fontSize}em`, label, `${cssStyle}`, `${legendHeight}px`, `${useML ? 'normal' : undefined}`, `${legendWidth - nonTextualWidth}px`);
            }
        }
        setTextSize(fontSize);
        setUseMultiLine(useML);
    }, [label, legendWidth, legendHeight, props.size, props.hasNoData]);

    return (
        <div style={{ height: legendHeight, width: legendWidth }}>
            <div onClick={() => props.setEnabled(!props.enabled)} style={{ width: '100%', display: 'flex', alignItems: 'center', marginRight: '5px', height: '100%' }}>
                {(props.lineStyle === '-' ?
                    <div style={{ width: ' 10px', height: 0, borderTop: `2px solid ${props.color}`, borderRight: `10px solid ${props.color}`, borderBottom: `2px solid ${props.color}`, borderLeft: `10px solid ${props.color}`, overflow: 'hidden', marginRight: '5px', opacity: (props.enabled ? 1 : 0.5) }}></div> :
                    <div style={{ width: ' 10px', height: '4px', borderTop: 'none', borderRight: `3px solid ${props.color}`, borderBottom: 'none', borderLeft: `3px solid ${props.color}`, overflow: 'hidden', marginRight: '5px', opacity: (props.enabled ? 1 : 0.5) }}></div>
                )}
                <label style={{ fontFamily: fontFamily, fontWeight: 400, display: 'inline-block', margin: 'auto', marginLeft: 0, fontSize: textSize + 'em', whiteSpace: (useMultiLine ? 'normal' : 'nowrap') }}> {label}</label>
            </div>
        </div>
    );
}

function GetTextWidth(font: string, fontSize: string, word: string, cssStyle?: string, height?: string, whiteSpace?: string, containerWidth?: string): number {
    const text = document.createElement("span");

    if (cssStyle !== undefined)
        text.style.cssText = cssStyle;

    // Set font properties
    text.style.font = font;
    text.style.fontSize = fontSize;
    text.style.height = height ?? 'auto';
    text.style.width = 'auto';
    text.style.whiteSpace = whiteSpace ?? 'nowrap';
    text.innerHTML = word;

    // Create a container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.visibility = 'hidden';
    container.style.overflow = 'visible'; // So overflowed text is measured
    container.style.height = height ?? 'auto';
    container.style.width = containerWidth ?? 'auto';
    container.style.whiteSpace = whiteSpace ?? 'nowrap';

    // Append text to the container
    container.appendChild(text);
    document.body.appendChild(container);

    // Measure the width
    const width = text.offsetWidth;

    // Clean up
    document.body.removeChild(container);

    return Math.ceil(width);
}

export default LineLegend;