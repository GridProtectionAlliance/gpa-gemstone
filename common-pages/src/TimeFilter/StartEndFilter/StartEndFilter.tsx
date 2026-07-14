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
import { getTimeWindowFromFilter, ITimeWindow } from "../TimeFilter";
import QuickSelects from '../QuickSelects';
import { Gemstone } from '@gpa-gemstone/application-typings';
import { TimeUnit } from '../TimeWindowUtils';
import { Modal } from '@gpa-gemstone/react-interactive';
import DateTimeLocalFilter from './DateTimeLocalFilter';
import TimeFilter from './TimeFilter';
import DateFilter from './DateFilter';

/** Configures the shared state and behavior of start/end time filters. */
export interface IFilterProps {
    /**
     * Current normalized start, end, and duration values.
     */
    TimeWindowFilter: ITimeWindow,
    /**
     * Updates the normalized time window.
     */
    SetTimeWindowFilter: React.Dispatch<React.SetStateAction<ITimeWindow>>,
    /**
     * Optional help text displayed with the date or time input.
     */
    HelpMessage?: string,
    /**
     * String format used by the date and time controls.
     */
    Format: "YYYY-MM-DD" | "HH:mm:ss.SSS" | "MM/DD/YYYY HH:mm:ss.SSS",
    /**
     * Input mode used for the start and end values.
     */
    DateUnit: Gemstone.TSX.Types.DateUnit
    /**
     * Optional range used to limit the available quick selections.
     */
    QuickSelectRange?: Gemstone.TSX.Types.QuickSelectRange
    /**
     * Time zone represented by the filter values.
     */
    Timezone: string
    /**
     * Optional precision applied to time input values.
     */
    Accuracy?: Gemstone.TSX.Types.Accuracy,
    /**
     * Index of the currently active quick selection.
     */
    ActiveQP: number
    /**
     * Updates the active quick-selection index.
     */
    SetActiveQP: React.Dispatch<React.SetStateAction<number>>,
    /**
     * Applies the selected time window to the parent filter.
     * @param start - Selected start value.
     * @param end - Selected end value.
     * @param unit - Unit used by the selected duration.
     * @param duration - Length of the selected time window.
     */
    SetFilter: (start: string, end: string, unit: TimeUnit, duration: number) => void,
    /**
     * Controls whether quick-selection shortcuts are displayed.
     */
    ShowQuickSelects: boolean,
    /**
     * Width used to select a responsive filter layout.
     */
    ContainerWidth: number
}

/**
 * Selects the appropriate start/end editor for the configured date unit.
 * @param props - Current time window, input mode, and update handlers.
 * @returns Date, time, or local date-time filter controls.
 */
const StartEndFilter = (props: IFilterProps) => {
    if (props.DateUnit === 'datetime-local')
        return <DateTimeLocalFilter {...props} />

    if (props.DateUnit === 'time')
        return <TimeFilter {...props} />

    if (props.DateUnit === 'date')
        return <DateFilter {...props} />

    return <></>
}


export default StartEndFilter;