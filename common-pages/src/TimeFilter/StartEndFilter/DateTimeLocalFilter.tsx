//******************************************************************************************************
//  DateTimeLocalFilter.tsx - Gbtc
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
import { Modal } from '@gpa-gemstone/react-interactive';
import { IFilterProps } from './StartEndFilter';

const DateTimeLocalFilter = (props: IFilterProps) => {
    const FirstFallbackBreakpointQS = 1768;
    const SecondFallbackBreakpointQS = 612, FirstFallbacKBreakpointNoQS = 612;

    const [showQuickPickModal, setShowQuickPickModal] = React.useState<boolean>(false);

    const handleSetTimeWindowFilter = React.useCallback((record: ITimeWindow) => {
        const flt = getTimeWindowFromFilter({ start: record.start, end: record.end }, props.Format);
        props.SetTimeWindowFilter(flt);
        props.SetActiveQP(-1);
    }, [props.Format]);

    const startEndCol = React.useMemo(() => {
        if (props.ShowQuickSelects) {
            if (props.ContainerWidth > FirstFallbackBreakpointQS)
                return 'col-2';
            else if (props.ContainerWidth > SecondFallbackBreakpointQS)
                return 'col-6'
            else
                return 'col-12'
        }

        if (props.ContainerWidth > FirstFallbacKBreakpointNoQS)
            return 'col-6'
        else
            return 'col-12';
    }, [props.ShowQuickSelects, props.DateUnit, props.ContainerWidth])

    const quickSelectCol = React.useMemo(() => {
        if (props.ContainerWidth > FirstFallbackBreakpointQS)
            return 'col-8'
        return 'col-12'

    }, [props.DateUnit, props.ContainerWidth])

    if (props.ContainerWidth > FirstFallbackBreakpointQS) {
        return (
            <div className='row m-0'>
                <div className={startEndCol}>
                    <DatePicker<ITimeWindow>
                        Record={props.TimeWindowFilter}
                        Field="start"
                        Help={props.HelpMessage}
                        Setter={handleSetTimeWindowFilter}
                        Label='Start'
                        Type={props.DateUnit ?? 'datetime-local'}
                        Valid={() => true}
                        Format={props.Format}
                        Accuracy={props.Accuracy}
                    />
                </div>
                <div className={startEndCol}>
                    <DatePicker<ITimeWindow>
                        Record={props.TimeWindowFilter}
                        Field="end"
                        Help={props.HelpMessage}
                        Setter={handleSetTimeWindowFilter}
                        Label='End'
                        Type={props.DateUnit ?? 'datetime-local'}
                        Valid={() => true}
                        Format={props.Format}
                        Accuracy={props.Accuracy}
                    />
                </div>
                {props.ShowQuickSelects ?
                    <div className={quickSelectCol}>
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
    }
    else if (props.ContainerWidth > SecondFallbackBreakpointQS) {
        return (
            <div className='row m-0'>
                <div className={startEndCol}>
                    <DatePicker<ITimeWindow>
                        Record={props.TimeWindowFilter}
                        Field="start"
                        Help={props.HelpMessage}
                        Setter={handleSetTimeWindowFilter}
                        Label='Start'
                        Type={props.DateUnit ?? 'datetime-local'}
                        Valid={() => true}
                        Format={props.Format}
                        Accuracy={props.Accuracy}
                    />
                </div>
                <div className={startEndCol}>
                    <DatePicker<ITimeWindow>
                        Record={props.TimeWindowFilter}
                        Field="end"
                        Help={props.HelpMessage}
                        Setter={handleSetTimeWindowFilter}
                        Label='End'
                        Type={props.DateUnit ?? 'datetime-local'}
                        Valid={() => true}
                        Format={props.Format}
                        Accuracy={props.Accuracy}
                    />
                </div>
                <div className='row m-0 w-100'>
                    {props.ShowQuickSelects ?
                        <div className={quickSelectCol}>
                            <QuickSelects
                                DateTimeSetting={'startEnd'}
                                Timezone={props.Timezone}
                                ActiveQP={props.ActiveQP}
                                SetActiveQP={props.SetActiveQP}
                                SetFilter={props.SetFilter}
                                Format={props.Format}
                                DateUnit={props.DateUnit}
                            />
                        </div>
                        : null}
                </div>
            </div>
        )
    }
    else {
        return (
            <div className='row m-0'>
                <div className={startEndCol}>
                    <DatePicker<ITimeWindow>
                        Record={props.TimeWindowFilter}
                        Field="start"
                        Help={props.HelpMessage}
                        Setter={handleSetTimeWindowFilter}
                        Label='Start'
                        Type={props.DateUnit ?? 'datetime-local'}
                        Valid={() => true}
                        Format={props.Format}
                        Accuracy={props.Accuracy}
                    />
                </div>
                <div className={startEndCol}>
                    <DatePicker<ITimeWindow>
                        Record={props.TimeWindowFilter}
                        Field="end"
                        Help={props.HelpMessage}
                        Setter={handleSetTimeWindowFilter}
                        Label='End'
                        Type={props.DateUnit ?? 'datetime-local'}
                        Valid={() => true}
                        Format={props.Format}
                        Accuracy={props.Accuracy}
                    />
                </div>
                {props.ShowQuickSelects ?
                    <div className='row m-0 w-100'>
                        <div className='col-12 d-flex align-items-center justify-content-center'>
                            <button className='btn btn-primary  w-100' onClick={() => setShowQuickPickModal(true)}>
                                Quick Selects
                            </button>
                        </div>
                        <Modal
                            Show={showQuickPickModal}
                            Title='Quick Selects'
                            CallBack={() => setShowQuickPickModal(false)}
                            ShowX={true}
                            ShowCancel={false}
                            ShowConfirm={false}
                            Size='xlg'
                        >
                            <div className={quickSelectCol}>
                                <QuickSelects
                                    DateTimeSetting={'startEnd'}
                                    Timezone={props.Timezone}
                                    ActiveQP={props.ActiveQP}
                                    SetActiveQP={props.SetActiveQP}
                                    SetFilter={props.SetFilter}
                                    Format={props.Format}
                                    DateUnit={props.DateUnit}
                                />
                            </div>
                        </Modal>
                    </div>
                    : null}
            </div>
        )
    }
}

export default DateTimeLocalFilter;