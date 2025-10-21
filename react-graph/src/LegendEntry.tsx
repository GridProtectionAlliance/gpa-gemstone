// ******************************************************************************************************
//  LegendEntry.tsx - Gbtc
//
//  Copyright © 2025, Grid Protection Alliance.  All Rights Reserved.
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
//  10/16/2025 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import { GraphContext, IDataSeries } from './GraphContext';
import LineLegend from './LineLegend';

interface IProps {
    OnClick?: (e: React.MouseEvent<HTMLDivElement>) => void,
    Label: string
}

const LegendEntry = (props: IProps) => {
    const [guid, setGuid] = React.useState<string | null>(null);
    const context = React.useContext(GraphContext);

    const makeSeries = React.useCallback((): IDataSeries => ({
        legend: guid == null ? undefined :
            <LineLegend
                id={guid}
                label={props.Label}
                color={'' /* Color doesnt matter here */}
                lineStyle={'none' /* No line shown in legend */}
                setEnabled={(_, e) => props.OnClick?.(e)}
                enabled={true}
                hasNoData={false}
            />,
        axis: undefined,
        enabled: true,
        getMax: () => undefined,
        getMin: () => undefined,
        getPoints: () => undefined
    }), [guid, props.Label, props.OnClick]);

    //Effect to register the 'action' with the legend context
    React.useEffect(() => {
        const id = context.AddData(makeSeries());
        setGuid(id);
        return () => context.RemoveData(id);
    }, []);

    //Effect to update the legend if makeSeries changes
    React.useEffect(() => {
        if (guid == null) return;
        context.UpdateData(guid, makeSeries());
    }, [makeSeries, guid]);

    //no need to return anything as this component just registers a line entry in the legend
    return null;
}

export default LegendEntry;