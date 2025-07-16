//******************************************************************************************************
//  DateFilter.tsx - Gbtc
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

import * as React from 'react';
import { DatePicker } from "@gpa-gemstone/react-forms";
import { getTimeWindowFromFilter, ITimeWindow } from "../TimeFilter";
import QuickSelects from '../QuickSelects';
import { IFilterProps } from './StartEndFilter';

const DateFilter = (props: IFilterProps) => {
    const FirstFallbackBreakpoint = 1050;
    const SecondFallbackBreakpoint = 541;

    const FirstFallbackBreakpointNoQS = 375;

    const handleSetTimeWindowFilter = React.useCallback((record: ITimeWindow) => {
        const flt = getTimeWindowFromFilter({ start: record.start, end: record.end }, props.Format);
        props.SetTimeWindowFilter(flt);
        props.SetActiveQP(-1);
    }, [props.Format]);

    const startEndCol = React.useMemo(() => {
        if (props.ShowQuickSelects && props.ContainerWidth > FirstFallbackBreakpoint)
            return 'col-2';

        if (!props.ShowQuickSelects && props.ContainerWidth > FirstFallbackBreakpointNoQS)
            return 'col-6'
        else
            return 'col-12'
    }, [props.ShowQuickSelects, props.ContainerWidth])

    const quickSelectClass = React.useMemo(() => {
        if (props.ContainerWidth > FirstFallbackBreakpoint)
            return 'col-8';
        else
            return 'col-12'
    }, [props.ContainerWidth])

    if (props.ContainerWidth > FirstFallbackBreakpoint)
        return (
            <div className='row m-0'>
                <div className={startEndCol}>
                    <DatePicker<ITimeWindow>
                        Record={props.TimeWindowFilter}
                        Field="start"
                        Help={props.HelpMessage}
                        Setter={handleSetTimeWindowFilter}
                        Label='Start'
                        Type={props.DateUnit}
                        Valid={() => true}
                        Format={props.Format}
                        Accuracy={props.Accuracy}
                        ShowOverlay={props.ShowStartOverlay}
                        SetShowOverlay={props.SetShowStartOverlay}
                    />
                </div>
                <div className={startEndCol}>
                    <DatePicker<ITimeWindow>
                        Record={props.TimeWindowFilter}
                        Field="end"
                        Help={props.HelpMessage}
                        Setter={handleSetTimeWindowFilter}
                        Label='End'
                        Type={props.DateUnit}
                        Valid={() => true}
                        Format={props.Format}
                        Accuracy={props.Accuracy}
                        ShowOverlay={props.ShowEndOverlay}
                        SetShowOverlay={props.SetShowEndOverlay}
                    />
                </div>
                {props.ShowQuickSelects ?
                    <div className={quickSelectClass}>
                        <QuickSelects
                            DateTimeSetting={'startEnd'}
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
    else
        return (
            <>
                <div className='row m-0'>
                    <div className={startEndCol}>
                        <DatePicker<ITimeWindow>
                            Record={props.TimeWindowFilter}
                            Field="start"
                            Help={props.HelpMessage}
                            Setter={handleSetTimeWindowFilter}
                            Label='Start'
                            Type={props.DateUnit}
                            Valid={() => true}
                            Format={props.Format}
                            Accuracy={props.Accuracy}
                            ShowOverlay={props.ShowStartOverlay}
                            SetShowOverlay={props.SetShowStartOverlay}
                        />
                    </div>
                    <div className={startEndCol}>
                        <DatePicker<ITimeWindow>
                            Record={props.TimeWindowFilter}
                            Field="end"
                            Help={props.HelpMessage}
                            Setter={handleSetTimeWindowFilter}
                            Label='End'
                            Type={props.DateUnit}
                            Valid={() => true}
                            Format={props.Format}
                            Accuracy={props.Accuracy}
                            ShowOverlay={props.ShowEndOverlay}
                            SetShowOverlay={props.SetShowEndOverlay}
                        />
                    </div>
                </div>
                {props.ShowQuickSelects ?
                    <div className={quickSelectClass}>
                        <QuickSelects
                            DateTimeSetting={'startEnd'}
                            Timezone={props.Timezone}
                            ActiveQP={props.ActiveQP}
                            SetActiveQP={props.SetActiveQP}
                            SetFilter={props.SetFilter}
                            Format={props.Format}
                            DateUnit={props.DateUnit}
                            SplitSelects={props.ContainerWidth < SecondFallbackBreakpoint}
                        />
                    </div> : null}
            </>
        )
}

export default DateFilter;