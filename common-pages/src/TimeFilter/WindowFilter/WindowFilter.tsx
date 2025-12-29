//******************************************************************************************************
//  TimeWindowFilter.tsx - Gbtc
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

import { DatePicker } from '@gpa-gemstone/react-forms';
import * as React from 'react';
import { getTimeWindowFromFilter, ITimeWindow } from '../TimeFilter';
import { IFilterProps } from '../StartEndFilter/StartEndFilter';
import QuickSelects from '../QuickSelects';
import WindowForm, { Window } from './WindowForm';

const WINDOW_FirstFallbackBreakpoint = 898;
const WINDOW_SecondFallbackBreakpoint = 611;

export interface IProps extends IFilterProps {
    Window: Window,
}

const WindowFilter = (props: IProps) => {
    const DatePickerField = props.Window;
    const DatePickerLabel = props.Window.charAt(0).toUpperCase() + props.Window.slice(1);
    const filterType = props.Window === 'start' ? 'startWindow' : 'endWindow'

    const setter = React.useCallback((record: ITimeWindow) => {
        if (props.Window === 'start') {
            const flt = getTimeWindowFromFilter({ start: record.start, duration: record.duration, unit: record.unit }, props.Format)
            props.SetTimeWindowFilter(flt);
            props.SetActiveQP(-1);
        }
        else {
            const flt = getTimeWindowFromFilter({ end: record.end, duration: record.duration, unit: record.unit }, props.Format)
            props.SetTimeWindowFilter(flt);
            props.SetActiveQP(-1);
        }
    }, [props.Window, props.SetTimeWindowFilter, props.SetActiveQP, props.Format])

    if (!props.ShowQuickSelects) {
        return (
            <div className='row m-0'>
                <div className={'col-12'}>
                    <DatePicker<ITimeWindow>
                        Record={props.TimeWindowFilter}
                        Field={DatePickerField}
                        Help={props.HelpMessage}
                        Setter={setter}
                        Label={DatePickerLabel}
                        Type={props.DateUnit ?? 'datetime-local'}
                        Valid={() => true}
                        Format={props.Format}
                        Accuracy={props.Accuracy}
                    />
                    <WindowForm
                        Filter={props.TimeWindowFilter}
                        SetFilter={props.SetTimeWindowFilter}
                        SetActiveQP={props.SetActiveQP}
                        Format={props.Format}
                        ShowQuickSelect={props.ShowQuickSelects}
                        Window={props.Window}
                    />
                </div>
            </div>
        )
    }
    else if (props.ContainerWidth > WINDOW_FirstFallbackBreakpoint)
        return (
            <div className='row m-0'>
                <div className='col-4'>
                    <DatePicker<ITimeWindow>
                        Record={props.TimeWindowFilter}
                        Field={DatePickerField}
                        Help={props.HelpMessage}
                        Setter={setter}
                        Label={DatePickerLabel}
                        Type={props.DateUnit ?? 'datetime-local'}
                        Valid={() => true}
                        Format={props.Format}
                        Accuracy={props.Accuracy}
                    />
                    <WindowForm
                        Filter={props.TimeWindowFilter}
                        SetFilter={props.SetTimeWindowFilter}
                        SetActiveQP={props.SetActiveQP}
                        Format={props.Format}
                        ShowQuickSelect={props.ShowQuickSelects}
                        Window={props.Window}
                    />
                </div>
                <div className='col-8 pt-3'>
                    <QuickSelects
                        DateTimeSetting={filterType}
                        Timezone={props.Timezone}
                        ActiveQP={props.ActiveQP}
                        SetActiveQP={props.SetActiveQP}
                        SetFilter={props.SetFilter}
                        Format={props.Format}
                        DateUnit={props.DateUnit}
                        QuickSelectDateUnit={props.QuickSelectDateUnit ?? props.DateUnit}
                    />
                </div>
            </div>
        )
    else if (props.ContainerWidth > WINDOW_SecondFallbackBreakpoint) {
        return (
            <>
                <div className='row m-0'>
                    <div className='col-6'>
                        <DatePicker<ITimeWindow>
                            Record={props.TimeWindowFilter}
                            Field={DatePickerField}
                            Help={props.HelpMessage}
                            Setter={setter}
                            Label={DatePickerLabel}
                            Type={props.DateUnit ?? 'datetime-local'}
                            Valid={() => true}
                            Format={props.Format}
                            Accuracy={props.Accuracy}
                        />
                    </div>
                    <div className='col-6'>
                        <WindowForm
                            Filter={props.TimeWindowFilter}
                            SetFilter={props.SetTimeWindowFilter}
                            SetActiveQP={props.SetActiveQP}
                            Format={props.Format}
                            ShowQuickSelect={props.ShowQuickSelects}
                            Window={props.Window}
                        />
                    </div>
                </div>
                <div className='row m-0'>
                    <div className='col-12'>
                        <QuickSelects
                            DateTimeSetting={filterType}
                            Timezone={props.Timezone}
                            ActiveQP={props.ActiveQP}
                            SetActiveQP={props.SetActiveQP}
                            SetFilter={props.SetFilter}
                            Format={props.Format}
                            DateUnit={props.DateUnit}
                            QuickSelectDateUnit={props.QuickSelectDateUnit ?? props.DateUnit}
                        />
                    </div>
                </div>
            </>
        )
    }
    else {
        return (
            <>
                <div className='row m-0'>
                    <div className='col-12'>
                        <DatePicker<ITimeWindow>
                            Record={props.TimeWindowFilter}
                            Field={DatePickerField}
                            Help={props.HelpMessage}
                            Setter={setter}
                            Label={DatePickerLabel}
                            Type={props.DateUnit ?? 'datetime-local'}
                            Valid={() => true}
                            Format={props.Format}
                            Accuracy={props.Accuracy}
                        />
                    </div>
                </div>
                <div className='row m-0'>
                    <div className='col-12'>
                        <WindowForm
                            Filter={props.TimeWindowFilter}
                            SetFilter={props.SetTimeWindowFilter}
                            SetActiveQP={props.SetActiveQP}
                            Format={props.Format}
                            ShowQuickSelect={props.ShowQuickSelects}
                            Window={props.Window}
                        />
                    </div>
                </div>
                <div className='row m-0'>
                    <div className='col-12'>
                        <QuickSelects
                            DateTimeSetting={filterType}
                            Timezone={props.Timezone}
                            ActiveQP={props.ActiveQP}
                            SetActiveQP={props.SetActiveQP}
                            SetFilter={props.SetFilter}
                            Format={props.Format}
                            DateUnit={props.DateUnit}
                            QuickSelectDateUnit={props.QuickSelectDateUnit ?? props.DateUnit}
                        />
                    </div>
                </div>
            </>
        )
    }
}

export default WindowFilter;