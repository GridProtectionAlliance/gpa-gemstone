//******************************************************************************************************
//  OverlayBox.tsx - Gbtc
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

export interface IHighlightBoxProps {
    /** X range in data units [start, end] */
    XVals: [number, number];
    /** Fill color */
    Color: string;
    /** Fill opacity (0-1) */
    Opacity: number;
    /** Optional Y start in data units. Defaults to full height. */
    StartY?: number;
    /** Optional Y end in data units. Defaults to full height. */
    EndY?: number;
    /** Optional stroke color around the box */
    Stroke?: string;
    /** Optional stroke width. Default: 1. */
    StrokeWidth?: number;
}

const OverlayBox = (props: IHighlightBoxProps) => {
    const { XVals, Color, Opacity, StartY, EndY, Stroke, StrokeWidth = 1 } = props;

    const { PlotID } = useLayoutContext();
    const { XTransform } = useXViewportContext();
    const { YTransform } = useYViewportContext();
    const { DataArea } = useLayoutContext();

    const yStart = StartY != null ? YTransform(StartY) : 0;
    const yEnd = EndY != null ? YTransform(EndY) : DataArea.Height;

    const xStart = XTransform(XVals[0]);
    const xEnd = XTransform(XVals[1]);

    const boxX = Math.min(xStart, xEnd);
    const boxY = Math.min(yStart, yEnd);
    const boxWidth = Math.abs(xEnd - xStart);
    const boxHeight = Math.abs(yEnd - yStart);

    if (boxWidth === 0 || boxHeight === 0) return null;

    return (
        <Portal node={document.getElementById(GetPortalID(PlotID, PortalIds.DATA))}>
            <rect
                x={boxX}
                y={boxY}
                width={boxWidth}
                height={boxHeight}
                fill={Color}
                opacity={Opacity}
                stroke={Stroke ?? 'none'}
                strokeWidth={Stroke != null ? StrokeWidth : 0}
                style={{ pointerEvents: 'none' }}
            />
        </Portal>
    );
};

export default OverlayBox;