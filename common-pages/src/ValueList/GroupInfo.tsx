// ******************************************************************************************************
//  GroupInfo.tsx - Gbtc
//
//  Copyright © 2021, Grid Protection Alliance.  All Rights Reserved.
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
//  07/04/2021 - C. Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import { SystemCenter } from '@gpa-gemstone/application-typings';
import GroupForm from './GroupForm';
import { ToolTip } from '@gpa-gemstone/react-interactive';
import { Warning, CrossMark } from '@gpa-gemstone/gpa-symbols';

interface IProps {
        Record: SystemCenter.Types.ValueListGroup
        Setter: (record: SystemCenter.Types.ValueListGroup) => void,
    }

    const InfoWindow = (props: IProps) => {
        const [record, setRecord] = React.useState<SystemCenter.Types.ValueListGroup>(props.Record);
            const [errors, setErrors] = React.useState<string[]>([]);
            const [warnings, setWarnings] = React.useState<string[]>([]);
            const [hover, setHover] = React.useState<('None' | 'Clear' | 'Update')>('None');

            React.useEffect(() => {
                const w = [];

                if (record == null)
                    return;
                if (record.Name !== props.Record.Name)
                    w.push('Changes to Name will be lost.');
                if (record.Description !== props.Record.Description)
                    w.push('Changes to Description will be lost.');
                setWarnings(w)
            }, [props.Record, record]);

        if (record == null) return null;

        return (
            <div className="card" style={{ marginBottom: 10 }}>
                <div className="card-header">
                    <div className="row">
                        <div className="col">
                            <h4>Value List Group Information:</h4>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <GroupForm Record={record} Setter={(r) => setRecord(r) } ErrorSetter={setErrors}/>
                </div>
                <div className="card-footer">
                    <div className="btn-group mr-2">
                        <button className={"btn btn-primary" + (errors.length > 0 || warnings.length === 0? ' disabled': '')} onClick={() => {
                                                if (errors.length === 0 && warnings.length > 0)
                                                    props.Setter(record)
                                            }} hidden={record.ID === 0} data-tooltip={'Update'}
                        onMouseEnter={() => setHover('Update')} onMouseLeave={() => setHover('None')}>Update</button>
                    </div>
                                    <ToolTip Show={hover === 'Clear' && (errors.length > 0)} Position={'top'} Theme={'dark'} Target={"Update"}>
                    {errors.map((t, i) => <p key={i}>{CrossMark} {t}</p>)}
                  </ToolTip>
                    <div className="btn-group mr-2">
                        <button className="btn btn-default" onClick={() => setRecord(props.Record)} disabled={warnings.length === 0} data-tooltip={'Clr'}
                        onMouseEnter={() => setHover('Clear')} onMouseLeave={() => setHover('None')}>Reset</button>
                    </div>
                                    <ToolTip Show={hover === 'Clear' && (warnings.length > 0)} Position={'top'} Theme={'dark'} Target={"Clr"}>
                    {warnings.map((t, i) => <p key={i}>{Warning} {t}</p>)}
                  </ToolTip>
                </div>


            </div>
        );
    }

    export default InfoWindow;
