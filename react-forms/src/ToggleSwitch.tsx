// ******************************************************************************************************
//  ToggleSwitch.tsx - Gbtc
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
//  04/19/2024 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import { CreateGuid } from '@gpa-gemstone/helper-functions'
import HelperMessage from './HelperMessage';

interface IProps<T> {
    Record: T,
    Field: keyof T,
    Setter: (record: T) => void;
    Label?: string,
    Disabled?: boolean,
    Help?: string | JSX.Element;
    Style?: React.CSSProperties;
}

export default function ToggleSwitch<T>(props: IProps<T>) {
    const [helpID, setHelpID] = React.useState<string>("");
    const [switchID, setSwitchID] = React.useState<string>('');
    const [showHelp, setShowHelp] = React.useState<boolean>(false);

    const showHelpIcon = props.Help !== undefined;

    React.useEffect(() => {
        setHelpID(CreateGuid());
        setSwitchID(CreateGuid());
    }, []);

    return (
        <div className="custom-control custom-switch" data-help={helpID} style={props.Style}>
            <input
                type="checkbox"
                className="custom-control-input"
                onChange={(evt) => {
                    const record: T = { ...props.Record };
                    record[props.Field] = evt.target.checked as any;
                    props.Setter(record);
                }}
                value={(props.Record[props.Field] as unknown as boolean) ? 'on' : 'off'}
                checked={(props.Record[props.Field] as unknown as boolean)}
                disabled={props.Disabled == null ? false : props.Disabled}
                id={switchID}
            />
            <label className="custom-control-label" htmlFor={switchID}>{props.Label == null ? props.Field : props.Label}</label>
            {showHelpIcon ?
                <>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'inline-block', background: '#0D6EFD', marginLeft: 10, textAlign: 'center', fontWeight: 'bold' }}
                        onMouseEnter={() => setShowHelp(true)}
                        onMouseLeave={() => setShowHelp(false)}>
                        ?
                    </div>
                    <HelperMessage Show={showHelp} Target={helpID} Zindex={9999}>
                        {props.Help}
                    </HelperMessage>
                </>
                : null}

        </div>
    );

}
