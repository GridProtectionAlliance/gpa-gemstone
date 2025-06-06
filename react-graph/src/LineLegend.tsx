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
import { GetTextHeight, CreateGuid, GetScrollbarWidth, GetTextWidth } from '@gpa-gemstone/helper-functions';
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
const scrollBarWidth = GetScrollbarWidth();

function LineLegend(props: IProps) {
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const [label, setLabel] = React.useState<string>(props.label);
    const [legendWidth, setLegendWith] = React.useState<number>(100);
    const [legendHeight, setLegendHeight] = React.useState<number>(100);
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
        const hasYScroll = legendHeight < (containerRef.current?.scrollHeight ?? -1)
        const availableWidth = hasYScroll ? legendWidth - scrollBarWidth : legendWidth;

        let newFontSize = 1;
        let textHeight = GetTextHeight(fontFamily, `${newFontSize}em`, label, `${cssStyle}`, `${availableWidth - nonTextualWidth}px`);
        let textWidth = GetTextWidth(fontFamily, `${newFontSize}em`, label, `${cssStyle}`, `${textHeight}px`);

        let useML = false;
        context.RequestLegendWidth(textWidth + nonTextualWidth, guid);

        while (newFontSize > 0.4 && (textWidth > availableWidth - nonTextualWidth || textHeight > legendHeight)) {
            newFontSize -= 0.05;

            textWidth = GetTextWidth(fontFamily, `${newFontSize}em`, label, `${cssStyle}`, `${legendHeight}px`, `${useML ? 'normal' : undefined}`, `${availableWidth - nonTextualWidth}px`);
            textHeight = GetTextHeight(fontFamily, `${newFontSize}em`, label, `${cssStyle}`, `${availableWidth - nonTextualWidth}px`, `${useML ? 'normal' : undefined}`);
            useML = false;
            // Consider special case when width is limiting but height is available
            if (textWidth >= (availableWidth - nonTextualWidth) && textHeight < legendHeight) {
                useML = true;
                textHeight = GetTextHeight(fontFamily, `${newFontSize}em`, label, `${cssStyle}`, `${availableWidth - nonTextualWidth}px`, `${useML ? 'normal' : undefined}`);
                textWidth = GetTextWidth(fontFamily, `${newFontSize}em`, label, `${cssStyle}`, `${legendHeight}px`, `${useML ? 'normal' : undefined}`, `${availableWidth - nonTextualWidth}px`);
            }
        }
        context.RegisterFontSize(guid, newFontSize)
        setUseMultiLine(useML);
    }, [label, legendWidth, legendHeight, props.size, props.hasNoData, guid, context.RegisterFontSize]);

    React.useEffect(() => {
        return () => {
            context.UnRegisterFontSize(guid)
        }
    }, [guid])

    return (
        <div style={{ height: legendHeight, width: legendWidth }} ref={containerRef}>
            <div onClick={() => props.setEnabled(!props.enabled)} style={{ width: '100%', display: 'flex', alignItems: 'center', marginRight: '5px', height: '100%' }}>
                {(props.lineStyle === '-' ?
                    <div
                        style={{
                            width: '10px',
                            height: 0,
                            borderTop: `2px solid ${props.color}`,
                            borderRight: `10px solid ${props.color}`,
                            borderBottom: `2px solid ${props.color}`,
                            borderLeft: `10px solid ${props.color}`,
                            overflow: 'hidden',
                            marginRight: '5px',
                            opacity: (props.enabled ? 1 : 0.5)
                        }}
                    /> :
                    <div
                        style={{
                            width: '10px',
                            height: '4px',
                            borderTop: 'none',
                            borderRight: `3px solid ${props.color}`,
                            borderBottom: 'none',
                            borderLeft: `3px solid ${props.color}`,
                            overflow: 'hidden',
                            marginRight: '5px',
                            opacity: (props.enabled ? 1 : 0.5)
                        }}
                    />
                )}
                <label
                    style={{
                        fontFamily: fontFamily,
                        fontWeight: 400,
                        display: 'inline-block',
                        margin: 'auto',
                        marginLeft: 0,
                        fontSize: context.SmallestFontSize + 'em',
                        whiteSpace: (useMultiLine ? 'normal' : 'nowrap')
                    }}
                >
                    {label}
                </label>
            </div>
        </div>
    );
}

export default LineLegend;