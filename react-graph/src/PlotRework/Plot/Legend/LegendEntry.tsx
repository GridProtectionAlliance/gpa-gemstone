//******************************************************************************************************
//  LegendEntry.tsx - Gbtc
//
//  Copyright (c) 2026, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA may license this file to you under the MIT License (MIT), the "License"; you may not use this
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
//  02/16/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';

export interface ILegendEntryProps {
    /** Display label */
    Label: string;
    /** Entry color */
    Color: string;
    /** Whether the series is currently enabled */
    Enabled: boolean;
    /** Dash pattern for the entry line (e.g., "5,3") */
    StrokeDasharray?: string;
    /** Called when clicked to toggle enabled state */
    OnToggle: (enabled: boolean) => void;
}

const ENTRY_WIDTH = 20;
const ENTRY_HEIGHT = 4;

const LegendEntry: React.FC<ILegendEntryProps> = (props) => {
    const { Label, Color, Enabled, StrokeDasharray, OnToggle } = props;

    const handleClick = React.useCallback(() => {
        OnToggle(!Enabled);
    }, [Enabled, OnToggle]);

    return (
        <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 8px',
                cursor: 'pointer',
                opacity: Enabled ? 1 : 0.4,
                userSelect: 'none',
                minWidth: 0,
            }}
            onClick={handleClick}
        >
            <svg width={ENTRY_WIDTH} height={ENTRY_HEIGHT + 4} style={{ flexShrink: 0 }}>
                <line
                    x1={0}
                    y1={(ENTRY_HEIGHT + 4) / 2}
                    x2={ENTRY_WIDTH}
                    y2={(ENTRY_HEIGHT + 4) / 2}
                    stroke={Color}
                    strokeWidth={ENTRY_HEIGHT}
                    strokeDasharray={StrokeDasharray}
                />
            </svg>
            <span style={{ fontSize: '0.8em', overflowWrap: 'break-word', wordBreak: 'break-word', minWidth: 0 }}>
                {Label}
            </span>
        </div>
    );
};

export default LegendEntry;