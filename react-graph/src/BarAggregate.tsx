// ******************************************************************************************************
//  BarAggregate.tsx - Gbtc
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
//  11/04/2025 - Gabriel Santos
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import Bar, { IBarProps } from './Bar';

interface IProps extends Omit<IBarProps, "GetBarStyle"> {
    AggregationType?: "min_max_avg"
}

const BarAggregate = (props: IProps) => {
    const data = React.useMemo(() => {
        switch (props.AggregationType){
            default:
            case "min_max_avg": {
                const max = Math.max(...props.Data);
                const avg = props.Data.reduce((a, b) => a + b) / props.Data.length;
                const min = Math.min(...props.Data);
                return [min, avg, max];
            }
        }
    }, [props.Data, props.AggregationType])

    return <Bar{...props} Data={data} />
}

export default BarAggregate;
