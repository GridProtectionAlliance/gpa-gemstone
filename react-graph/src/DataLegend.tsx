// ******************************************************************************************************
//  DataLegend.tsx - Gbtc
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
//  12/01/2025 - G. Santos
//       Changed scope to include other types of data.
//
// ******************************************************************************************************


import * as React from 'react';
import { LineStyle } from './GraphContext';
import { Warning } from '@gpa-gemstone/gpa-symbols';
import { ILegendRequiredProps, LegendContext } from './LegendContext';
import { fontFamily } from './Legend'
import { CreateGuid } from '@gpa-gemstone/helper-functions';
import { ToolTip } from '@gpa-gemstone/react-forms';

/** Identifies the symbol style displayed for a data legend entry. */
export type LegendStyle = LineStyle | 'none' | 'square' | 'circle';

/** Defines content and symbol styling for a data legend entry. */
export interface IProps extends ILegendRequiredProps {
    /**
     * Color applied to the legend symbol.
     */
    color: string,
    /**
     * Shape or line style used for the legend symbol.
     */
    legendSymbol: LegendStyle,
    /**
     * Callback invoked to change the data series enabled state.
     * @param arg - New enabled state for the data series.
     * @param e - Mouse event that triggered the change.
     */
    setEnabled: (arg: boolean, e: React.MouseEvent<HTMLDivElement>) => void,
    /**
     * Indicates whether the legend should mark the data series as empty.
     */
    hasNoData: boolean,
    /**
     * The label to display next to the legend symbol.
     */
    label: string,
    /**
     * Optional tooltip text displayed while hovering over the legend entry.
     */
    toolTipText?: string
}

/**
 * Renders a clickable legend entry for a graph data series.
 * @param props - Legend identity, label, symbol, and enabled-state behavior.
 * @returns Interactive legend entry.
 */
const DataLegend = (props: IProps) => {
    const context = React.useContext(LegendContext);
    const [label, setLabel] = React.useState<string>(props.label ?? "");

    const guid = React.useRef<string>(CreateGuid());
    const [isHovering, setIsHovering] = React.useState<boolean>(false);

    //Effect to set the label with no data warning if applicable
    React.useEffect(() => {
        setLabel((props.hasNoData ? Warning : "") + props.label);
    }, [props.hasNoData, props.label]);

    return (
        <div style={{ height: context.SmHeight, width: context.SmWidth }}>
            <div
                className="d-flex align-items-center h-100 w-100"
                onClick={(evt) => {
                    if (evt.ctrlKey && context.SendMassEnable != null)
                        context.SendMassEnable.current(props.id);
                    else
                        props.setEnabled(!props.enabled, evt);

                    setIsHovering(false);
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                style={{ marginRight: '5px', cursor: 'pointer' }}
            >
                <DataSymbol
                    color={props.color}
                    symbol={props.legendSymbol}
                    enabled={props.enabled}
                />
                <span
                    style={{
                        fontFamily: fontFamily,
                        fontWeight: 400,
                        display: 'inline-block',
                        margin: 'auto',
                        marginLeft: 0,
                        fontSize: context.SmallestFontSize + 'em',
                        whiteSpace: (context.UseMultiLine ? 'normal' : 'nowrap')
                    }}
                    data-tooltip={guid.current}
                >
                    {label}
                </span>
                {props.toolTipText != null ?
                    <ToolTip Show={isHovering} Target={guid.current}>
                        {props.toolTipText}
                    </ToolTip>
                : null}
            </div>
        </div>
    );
}

/** Defines color and style for the legend's graphical symbol. */
interface ISymbolProps {
    /** Shape or line style rendered for the legend symbol. */
    symbol: LegendStyle,
    /** Color applied to the legend symbol. */
    color: string,
    /** Controls whether the symbol is rendered at full or reduced opacity. */
    enabled: boolean
}

/**
 * Renders the shape representing a data series in the legend.
 * @param props - Symbol style, color, and enabled state.
 * @returns Styled legend symbol.
 */
const DataSymbol = (props: ISymbolProps) => {
    /* Total width of symbol element should be 15px with a 5px margin */
    switch (props.symbol) {
        default:
            console.warn("Unrecognized symbol type in Data Legend: " + props.symbol);
        // falls through
        case '-':
        case 'solid':
            return (
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
                />
            );
        case 'none':
            return (
                <div
                    style={{
                        width: '20px',
                        height: 0,
                        overflow: 'hidden',
                        marginRight: '5px',
                        opacity: 0
                    }}
                />
            );
        case ':':
        case 'dash':
        case 'short-dash':
        case 'long-dash':
            return (
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
            );

        case 'square':
            return (
                <div
                    style={{
                        width: '10px',
                        height: '20px',
                        borderTop: `2px solid ${props.color}`,
                        borderRight: `10px solid ${props.color}`,
                        borderBottom: `2px solid ${props.color}`,
                        borderLeft: `10px solid ${props.color}`,
                        overflow: 'hidden',
                        marginRight: '5px',
                        opacity: (props.enabled ? 1 : 0.5)
                    }}
                />
            );
        case 'circle':
            return (
                <div
                    style={{
                        width: '10px',
                        height: '20px',
                        borderRadius: '10px',
                        borderTop: `2px solid ${props.color}`,
                        borderRight: `10px solid ${props.color}`,
                        borderBottom: `2px solid ${props.color}`,
                        borderLeft: `10px solid ${props.color}`,
                        overflow: 'hidden',
                        marginRight: '5px',
                        opacity: (props.enabled ? 1 : 0.5)
                    }}
                />
            );

    }
}

export default DataLegend;