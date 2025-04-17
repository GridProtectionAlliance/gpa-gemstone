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
import { Warning } from '@gpa-gemstone/gpa-symbols';
import { ILegendRequiredProps, LegendContext } from './LegendContext';

export interface IProps extends ILegendRequiredProps {
    color: string,
    lineStyle: LineStyle,
    setEnabled: (arg: boolean) => void,
    hasNoData: boolean,
    label: string
}

const fontFamily = "Courier New";

function LineLegend(props: IProps) {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [label, setLabel] = React.useState<string>(props.label ?? "");
    const context = React.useContext(LegendContext);

    React.useEffect(() => {
        setLabel((props.hasNoData ? Warning : "") + props.label);
    }, [props.hasNoData, props.label]);


    return (
        <div style={{ height: context.SmHeight, width: context.SmWidth }} ref={containerRef}>
            <div 
                onClick={(evt) => {
                    if (evt.ctrlKey && context.SendMassEnable != null) context.SendMassEnable.current(props.id)
                    else props.setEnabled(!props.enabled)
                }} 
                style={{ width: '100%', display: 'flex', alignItems: 'center', marginRight: '5px', height: '100%' }}
            >
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
                        whiteSpace: (context.UseMultiLine ? 'normal' : 'nowrap')
                    }}
                >
                    {label}
                </label>
            </div>
        </div>
    );
}

export default LineLegend;