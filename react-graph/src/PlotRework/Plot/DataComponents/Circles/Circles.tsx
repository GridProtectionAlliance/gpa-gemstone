//******************************************************************************************************
//  Circles.tsx - Gbtc
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
import { useDataSeriesContext } from '../../Legend/DataSeriesContext';
import DataSeriesGroup from '../../Legend/DataSeriesGroup';
import CirclesInternal from './CirclesInternal';
import { LegendPosition } from '../../LayoutContext';

export interface ICirclesProps {
    /**
     * Data points as array of [x, y] tuples
     */
    Data: [number, number][];
    /**
     * Circle radius in pixels
     */
    Radius?: number;
    /**
     * Legend label. If provided and not already inside a DataSeriesGroup,
     * automatically wraps in one to produce a legend entry.
     */
    Label?: string;
    /**
     * Fill color. Falls back to DataSeriesContext.Color, then 'currentColor'.
     */
    Color?: string;
    /**
     * Fill opacity (0-1). Falls back to DataSeriesContext.Opacity, then 1.
     */
    Opacity?: number;
    /**
     * Border stroke color.
     */
    BorderColor?: string;
    /**
     * Border stroke width in pixels.
     */
    BorderThickness?: number;
    /**
     * Which legend to place this entry in. Falls back to Plot's LegendPosition.
     */
    LegendPosition?: LegendPosition;
}

/**
 * Public-facing Circles component.
 * If Label is provided and we're not already inside a DataSeriesGroup,
 * wraps in one so the legend entry and enabled state are handled by the group.
 */
const Circles = (props: ICirclesProps) => {
    const series = useDataSeriesContext();
    const isInGroup = series != null;

    if (!isInGroup && props.Label != null) {
        return (
            <DataSeriesGroup
                Label={props.Label}
                Color={props.Color}
                Opacity={props.Opacity}
                LegendPosition={props.LegendPosition}
            >
                <CirclesInternal {...props} />
            </DataSeriesGroup>
        );
    }

    return <CirclesInternal {...props} />;
};

export default Circles;