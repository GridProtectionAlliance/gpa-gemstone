//******************************************************************************************************
//  VerticalMarker.tsx - Gbtc
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
//  02/23/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import { Portal } from 'react-portal';
import { useXViewportContext } from '../ViewportContext/XViewportContext';
import { useYViewportContext } from '../ViewportContext/YViewportContext';
import { GetPortalID, PortalIds, useLayoutContext } from '../LayoutContext';

export interface IVerticalMarkerProps {
    /** X value in data units where the vertical line is drawn */
    Value: number;
    /** Optional Y start in data units. Defaults to full height. */
    Start?: number;
    /** Optional Y end in data units. Defaults to full height. */
    End?: number;
    /** Line color */
    Color: string;
    /** Line width in pixels. Default: 2. */
    Width?: number;
    /** Stroke dash array (e.g., "5,5") */
    StrokeDasharray?: string;
    /** Line opacity (0-1). Default: 1. */
    Opacity?: number;
}

const VerticalMarker = (props: IVerticalMarkerProps) => {
    const { Value, Start, End, Color, Width = 2, StrokeDasharray, Opacity = 1 } = props;

    const { PlotID } = useLayoutContext();
    const {XTransform} = useXViewportContext();
    const {YTransform} = useYViewportContext();

    const x = XTransform(Value);

    const { DataArea } = useLayoutContext();

    const y1 = Start != null ? YTransform(Start) : 0;
    const y2 = End != null ? YTransform(End) : DataArea.Height;

    if (!isFinite(x)) return null;

    return (
        <Portal node={document.getElementById(GetPortalID(PlotID, PortalIds.DATA))}>
            <path
                d={`M ${x} ${y1} L ${x} ${y2}`}
                fill="none"
                stroke={Color}
                strokeWidth={Width}
                strokeDasharray={StrokeDasharray}
                opacity={Opacity}
                style={{ pointerEvents: 'none' }}
            />
        </Portal>
    );
};

export default VerticalMarker;