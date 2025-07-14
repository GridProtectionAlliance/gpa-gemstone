//******************************************************************************************************
//  StartEndFilter.tsx - Gbtc
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
import { getTimeWindowFromFilter, ITimeWindow } from "./TimeFilter";
import QuickSelects, { DateUnit } from './QuickSelects';
import { Gemstone } from '@gpa-gemstone/application-typings';
import { TimeUnit } from './TimeWindowUtils';

export interface IFilterProps {
    TimeWindowFilter: ITimeWindow,
    SetTimeWindowFilter: React.Dispatch<React.SetStateAction<ITimeWindow>>,

    HelpMessage?: string,

    Format: "YYYY-MM-DD" | "HH:mm:ss.SSS" | "MM/DD/YYYY HH:mm:ss.SSS",
    DateUnit?: DateUnit

    Timezone: string
    Accuracy?: Gemstone.TSX.Types.Accuracy,

    ShowStartOverlay: boolean,
    SetShowStartOverlay: (show: boolean) => void,
    ShowEndOverlay: boolean,
    SetShowEndOverlay: (show: boolean) => void,

    ActiveQP: number
    SetActiveQP: React.Dispatch<React.SetStateAction<number>>,

    SetFilter: (start: string, end: string, unit: TimeUnit, duration: number) => void,

    ShowQuickSelects: boolean
}

const StartEndFilter = (props: IFilterProps) => {

    const handleSetTimeWindowFilter = React.useCallback((record: ITimeWindow) => {
        const flt = getTimeWindowFromFilter({ start: record.start, end: record.end }, props.Format);
        props.SetTimeWindowFilter(flt);
        props.SetActiveQP(-1);
    }, [props.Format]);

    const startEndCol = props.ShowQuickSelects ? 'col-2' : 'col-6';

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
                    Type={props.DateUnit ?? 'datetime-local'}
                    Valid={() => true}
                    Format={props.Format}
                    Accuracy={props.Accuracy}
                    ShowOverlay={props.ShowEndOverlay}
                    SetShowOverlay={props.SetShowEndOverlay}
                />
            </div>
            {props.ShowQuickSelects ?
                <div className='col-8'>
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

export default StartEndFilter;