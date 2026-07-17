// ******************************************************************************************************
//  BarGroup.tsx - Gbtc
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
//  07/16/2026 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************
import * as React from 'react';
import { IBarProps } from './Bar';

export interface IBarGroupProps {
    /** Bars that share a legend entry and enabled state. */
    children: React.ReactElement<IBarProps> | React.ReactElement<IBarProps>[],
    /** Legend text shared by the grouped bars. */
    Legend: string,
    /** Optional controlled enabled state. */
    Enabled?: boolean,
    /** Optional controlled enabled-state setter. */
    SetEnabled?: React.Dispatch<React.SetStateAction<boolean>>
}

const BarGroup = (props: IBarGroupProps) => {
    const [localEnabled, setLocalEnabled] = React.useState<boolean>(true);
    const enabled = props.Enabled ?? localEnabled;
    const setEnabled = props.SetEnabled ?? setLocalEnabled;
    return <>
        {React.Children.map(props.children, (child, index) => {
            if (!React.isValidElement(child))
                return null;

            const groupedProps: Partial<IBarProps> = { Enabled: enabled, SetEnabled: setEnabled };
            if (index === 0)
                groupedProps.Legend = props.Legend;

            return React.cloneElement(child, groupedProps);
        })}
    </>;
};

export default BarGroup;
