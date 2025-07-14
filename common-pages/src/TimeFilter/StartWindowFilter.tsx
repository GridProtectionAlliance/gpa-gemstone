//******************************************************************************************************
//  StartWindowFilter.tsx - Gbtc
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
//  07/14/2025 - Preston Crawford
//       Generated original version of source code.
//******************************************************************************************************

import { DatePicker, Input, Select } from '@gpa-gemstone/react-forms';
import * as React from 'react';
import { getTimeWindowFromFilter, ITimeWindow } from './TimeFilter';
import { IFilterProps } from './StartEndFilter';
import { readableUnit, units } from './TimeWindowUtils';
import QuickSelects from './QuickSelects';

const StartWindowFilter = (props: IFilterProps) => {
    return (
        <div className='row m-0'>
            <div className={(props.ShowQuickSelects ? 'col-4' : 'col-6')}>
                <DatePicker<ITimeWindow>
                    Record={props.TimeWindowFilter}
                    Field="start"
                    Help={props.HelpMessage}
                    Setter={(r) => {
                        const flt = getTimeWindowFromFilter({ start: r.start, duration: r.duration, unit: r.unit }, props.Format)
                        props.SetTimeWindowFilter(flt);
                        props.SetActiveQP(-1);
                    }}
                    Label='Start'
                    Type={props.DateUnit ?? 'datetime-local'}
                    Valid={() => true}
                    Format={props.Format}
                    Accuracy={props.Accuracy}
                    ShowOverlay={props.ShowStartOverlay}
                    SetShowOverlay={props.SetShowStartOverlay}
                />
                <StartWindowForm
                    Filter={props.TimeWindowFilter}
                    SetFilter={props.SetTimeWindowFilter}
                    SetActiveQP={props.SetActiveQP}
                    Format={props.Format}
                    ShowQuickSelect={props.ShowQuickSelects}
                />
            </div>
            {props.ShowQuickSelects ?
                <div className='col-8'>
                    <QuickSelects
                        DateTimeSetting={'startWindow'}
                        Timezone={props.Timezone}
                        ActiveQP={props.ActiveQP}
                        SetActiveQP={props.SetActiveQP}
                        SetFilter={props.SetFilter}
                        Format={props.Format}
                        DateUnit={props.DateUnit}
                    />
                </div> : null}
        </div>
    )
}

export interface IStartEndWindowProps {
    Filter: ITimeWindow,
    SetFilter: (filter: ITimeWindow) => void,
    SetActiveQP: (qp: number) => void,
    Format: string,
    ShowQuickSelect: boolean
}

const StartWindowForm = (props: IStartEndWindowProps) => {
    return (
        <div className={props.ShowQuickSelect ? 'col-12 p-0' : 'col-6'}>
            <div className='form-group'>
                <label style={{ width: '100%', position: 'relative', float: "left" }}>
                    Span(+)
                </label>
                <div className='row'>
                    <div className={'col-6'}>
                        <Input<ITimeWindow>
                            Record={props.Filter}
                            Field='duration'
                            Label=''
                            Valid={() => true}
                            Type='number'
                            Setter={(r) => {
                                props.SetFilter(getTimeWindowFromFilter({ start: r.start, duration: r.duration, unit: r.unit }, props.Format));
                                props.SetActiveQP(-1);
                            }}
                        />
                    </div>
                    <div className={'col-6'}>
                        <Select<ITimeWindow>
                            Record={props.Filter}
                            Label=''
                            Field='unit'
                            Options={units.map((unit) => ({ Value: unit, Label: readableUnit(unit) }))}
                            Setter={(r) => {
                                props.SetFilter(getTimeWindowFromFilter({ start: r.start, duration: r.duration, unit: r.unit }, props.Format));
                                props.SetActiveQP(-1);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StartWindowFilter;