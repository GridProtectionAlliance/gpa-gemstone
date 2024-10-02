// ******************************************************************************************************
//  HighlightBox.tsx - Gbtc
//
//  Copyright © 2024, Grid Protection Alliance.  All Rights Reserved.
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
//  09/03/2024 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import { GraphContext, AxisMap, AxisIdentifier } from './GraphContext';

interface IProps {
    Color: string;
    Opacity: number;
    XVals: [number, number];
    StartY?: number;
    EndY?: number;
    Axis?: AxisIdentifier;
    Stroke?: string
}

const HighlightBox = (props: IProps) => {
    const context = React.useContext(GraphContext);
    const axisIndex = AxisMap.get(props.Axis);

    const y1 = props.StartY ?? context.YDomain[axisIndex][0];
    const y2 = props.EndY ?? context.YDomain[axisIndex][1];

    const xStart = context.XTransformation(props.XVals[0]);
    const xEnd = context.XTransformation(props.XVals[1]);

    const yStart = context.YTransformation(y1, axisIndex);
    const yEnd = context.YTransformation(y2, axisIndex);

    const boxHeight = Math.abs(yEnd - yStart);
    const boxWidth = Math.abs(xEnd - xStart);

    return (
        <g>
            <rect
                x={Math.min(xStart, xEnd)}
                y={Math.min(yStart, yEnd)}
                width={boxWidth}
                height={boxHeight}
                fill={props.Color}
                opacity={props.Opacity}
                stroke={props.Stroke ?? "none"}
            />
        </g>
    );
};

export default HighlightBox;
