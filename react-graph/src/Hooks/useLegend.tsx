// ******************************************************************************************************
//  useLegend.tsx - Gbtc
//
//  Copyright © 2026, Grid Protection Alliance.  All Rights Reserved.
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
//  01/05/2026 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from "react";
import { GraphContext } from "../GraphContext";
import DataLegend, { LegendStyle } from '../DataLegend';

/**
 * Hook to create and manage legend entries/operations.
 * @param color The color of the legend entry.
 * @param legendSymbol The symbol style of the legend entry.
 * @param guid The unique identifier for the data series component.
 * @param hasNoData Indicates if the data series has no data.
 * @param legendLabel Text label for the legend entry.
 * @param enabledOverride Optional enabled state controlled by the data series component.
 * @param setEnabledOverride Optional state setter controlled by the data series component.
 * @returns An object containing the createLegend function and the enabled state.
 */
const useLegend = (color: string, legendSymbol: LegendStyle, guid: string, hasNoData?: boolean, legendLabel?: string,
    enabledOverride?: boolean, setEnabledOverride?: React.Dispatch<React.SetStateAction<boolean>>) => {
    const context = React.useContext(GraphContext);
    const [localEnabled, setLocalEnabled] = React.useState<boolean>(true);
    const enabled = enabledOverride ?? localEnabled;
    const setEnabled = setEnabledOverride ?? setLocalEnabled;

    const createLegend = React.useCallback(() => {
        if (legendLabel === undefined || guid === "")
            return undefined;

        return <DataLegend
            id={guid}
            label={legendLabel}
            color={color}
            legendSymbol={legendSymbol}
            setEnabled={setEnabled}
            enabled={enabled}
            hasNoData={hasNoData ?? false}
        />;
    }, [color, enabled, legendLabel, guid, legendSymbol, hasNoData, setEnabled]);

    React.useEffect(() => {
        if (guid === "") return;
        context.SetLegend(guid, createLegend());
    }, [enabled, createLegend, guid, context]);

    React.useEffect(() => {
        if (context.MassEnableCommand.command === "enable-all")
            setEnabled(true);
        else if (context.MassEnableCommand.command === "disable-others")
            setEnabled(guid === context.MassEnableCommand.requester);
    }, [context.MassEnableCommand, guid, setEnabled]);

    return { createLegend, enabled };
};

export default useLegend;
