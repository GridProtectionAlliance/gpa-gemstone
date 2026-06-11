//******************************************************************************************************
//  BarAggregate.tsx - Gbtc
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
//  03/03/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import StackedBar, { IBarProps, IBarStyle } from './Bar';

export interface IBarAggregateProps extends Omit<IBarProps, 'GetBarStyle'> {
    AggregationType?: 'min_max_avg';
}

/** Default styling for min_max_avg: lower segment (min→avg) is lighter, upper (avg→max) is darker. */
const defaultAggregateStyle = (_yValues: [number, number], index: number): IBarStyle => ({
    Opacity: index === 0 ? 0.35 : 0.7,
});

const BarAggregate = (props: IBarAggregateProps) => {
    const data = React.useMemo(() => {
        if (props.Data.length === 0) return [];

        switch (props.AggregationType) {
            default:
            case 'min_max_avg': {
                const max = Math.max(...props.Data);
                const avg = props.Data.reduce((a, b) => a + b) / props.Data.length;
                const min = Math.min(...props.Data);
                return [min, avg, max];
            }
        }
    }, [props.Data, props.AggregationType]);

    return <StackedBar {...props} Data={data} GetBarStyle={defaultAggregateStyle} />;
};

export default BarAggregate;
