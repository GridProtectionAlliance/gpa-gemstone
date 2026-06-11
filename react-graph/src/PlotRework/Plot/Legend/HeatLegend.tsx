//******************************************************************************************************
//  HeatLegend.tsx - Gbtc
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
//  03/04/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import { CreateGuid, HsvToHex } from '@gpa-gemstone/helper-functions';

export interface IHeatLegendProps {
    /** Minimum z value displayed. */
    MinValue: number;
    /** Maximum z value displayed. */
    MaxValue: number;
    /** Hue component (0-1). */
    Hue: number;
    /** Saturation component (0-1). */
    Saturation: number;
    /** Optional unit label appended to values. */
    Unit?: string;
    /** Whether the series is currently enabled. */
    Enabled: boolean;
    /** Called when clicked to toggle enabled state. */
    OnToggle: (enabled: boolean) => void;
}

const GRADIENT_WIDTH = 100;
const GRADIENT_HEIGHT = 12;

const HeatLegend: React.FC<IHeatLegendProps> = (props) => {
    const { MinValue, MaxValue, Hue, Saturation, Unit, Enabled, OnToggle } = props;

    const gradientId = React.useRef(CreateGuid()).current;

    const minColor = HsvToHex(Hue, Saturation, 1);
    const maxColor = HsvToHex(Hue, Saturation, 0);

    // Determine decimal places based on value range
    const nDigits = React.useMemo(() => {
        let delta = MaxValue - MinValue;
        if (delta === 0) delta = Math.abs(MinValue);
        if (delta === 0) return 2;
        if (delta >= 15) return 0;
        if (delta >= 1.5) return 1;
        if (delta >= 0.15) return 2;
        if (delta >= 0.015) return 3;
        if (delta >= 0.0015) return 4;
        return 5;
    }, [MinValue, MaxValue]);

    const formatValue = React.useCallback((val: number) => {
        return `${val.toFixed(nDigits)}${Unit != null ? Unit : ''}`;
    }, [nDigits, Unit]);

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
            <span style={{ fontSize: '0.7em', whiteSpace: 'nowrap' }}>{formatValue(MinValue)}</span>
            <svg width={GRADIENT_WIDTH} height={GRADIENT_HEIGHT} style={{ flexShrink: 0 }}>
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={minColor} />
                        <stop offset="100%" stopColor={maxColor} />
                    </linearGradient>
                </defs>
                <rect
                    x={0}
                    y={0}
                    width={GRADIENT_WIDTH}
                    height={GRADIENT_HEIGHT}
                    fill={`url(#${gradientId})`}
                    stroke="currentColor"
                    strokeWidth={0.5}
                />
            </svg>
            <span style={{ fontSize: '0.7em', whiteSpace: 'nowrap' }}>{formatValue(MaxValue)}</span>
        </div>
    );
};

export default HeatLegend;