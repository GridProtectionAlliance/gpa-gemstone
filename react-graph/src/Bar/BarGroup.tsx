// ******************************************************************************************************
//  BarGroup.tsx - Gbtc
//
//  Copyright © 2020, Grid Protection Alliance.  All Rights Reserved.
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
//  06/18/2024 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import Bar, { ContexlessBar } from './Bar';
import { IGraphContext, GraphContext } from '../GraphContext';

export interface IBarContext extends IGraphContext {
    GetYPosition?: (timeValue: number, barHeight: number, baseY: number) => number
}

/**
    Wraps bar components to vertically stacks bars with matching time values. 
*/
const BarGroup: React.FC = (props) => {
    const barHeightsRef = React.useRef<Map<number, number>>(new Map());
    const context = React.useContext(GraphContext);

    const GetYPosition = (timeValue: number, barHeight: number, baseYPosition: number) => {
        const cumulativeBarHeight = barHeightsRef.current.get(timeValue) ?? 0;
        const newBarHeight = cumulativeBarHeight + barHeight;
        barHeightsRef.current.set(timeValue, newBarHeight);
        return baseYPosition - newBarHeight;
    };

    const barContext = React.useMemo(() => {
        return {
            ...context,
            GetYPosition: GetYPosition
        } as IBarContext;
    }, [context, GetYPosition]);

    // Reset the bar heights map on each render
    React.useEffect(() => {
        barHeightsRef.current.clear();
    });

    return (
        <g>
            {React.Children.map(props.children, (element) => {
            if (!React.isValidElement(element)) return null;

            if (element.type === Bar) {
                return (
                    <ContexlessBar
                        key={element.key}
                        BarProps={element.props}
                        Context={barContext}
                    />
                );
            }
        })}
        </g>
    );
}

export default BarGroup;
