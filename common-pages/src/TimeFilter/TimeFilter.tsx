//******************************************************************************************************
//  TimeFilter.tsx - Gbtc
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
//  09/16/2021 - Christoph Lackner
//       Generated original version of source code.
//  06/20/2024 - Ali Karrar
//       Moved TimeFilter from SEBrowser to gemstone
//******************************************************************************************************

import * as React from 'react';
import {
    IStartEnd, IStartDuration, IEndDuration,
    TimeUnit, findAppropriateUnit, addDuration
} from './TimeWindowUtils';
import moment from 'moment';
import { getFormat } from './QuickSelects';
import _ from 'lodash';
import { Gemstone } from '@gpa-gemstone/application-typings';
import StartEndFilter from './StartEndFilter/StartEndFilter';
import { useGetContainerPosition } from '@gpa-gemstone/helper-functions';
import WindowFilter from './WindowFilter/WindowFilter';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';

/** Stores a normalized time window with both endpoints and its duration. */
export interface ITimeWindow {
    /** Start of the time window. */
    start: string,
    /** End of the time window. */
    end: string,
    /** Unit used by the window duration. */
    unit: TimeUnit,
    /** Length of the time window. */
    duration: number,
}

/** Supported combinations of endpoints and duration used to define a time filter. */
export type ITimeFilter = IStartEnd | IStartDuration | IEndDuration
/** Layout used to edit a time filter. */
export type DateTimeSetting = 'startWindow' | 'endWindow' | 'startEnd';

/** Configures time-filter values, layout, and update behavior. */
interface IProps {
    /**
     * Time filter values edited by the component.
     */
    filter: ITimeFilter;
    /**
     * Applies updated time filter values.
     * @param start - Updated start value.
     * @param end - Updated end value.
     * @param unit - Unit used by the duration.
     * @param duration - Length of the time window.
     */
    setFilter: (start: string, end: string, unit: TimeUnit, duration: number) => void,
    /**
     * Controls whether quick-selection shortcuts are displayed.
     */
    showQuickSelect: boolean;
    /**
     * Filter mode used to render start, end, or window controls.
     */
    dateTimeSetting: DateTimeSetting;
    /**
     * Time zone represented by the filter values.
     */
    timeZone: string;
    /**
     * Optional date and time input mode, defaulting to `datetime-local`.
     */
    format?: Gemstone.TSX.Types.DateUnit;
    /**
     * Optional precision applied to time input values.
     */
    accuracy?: Gemstone.TSX.Types.Accuracy
    /**
     * Optional flag that shows the time-zone help message, defaulting to true.
     */
    showHelpMessage?: boolean,
    /**
     * Optional range used to limit the available quick selections.
     */
    quickSelectRange?: Gemstone.TSX.Types.QuickSelectRange
    /**
     * Optional flag that allows the filter controls to be collapsed, defaulting to false.
     */
    enableCollapse?: boolean
    /**
     * Optional callback that reports changes to the collapsed state.
     * @param collapsed - Whether the filter controls are collapsed.
     */
    setCollapsed?: (collapsed: boolean) => void
}

/**
 * Provides start/end or anchored-window filtering with optional quick selections.
 * @param props - Active filter values, display settings, and update handlers.
 * @returns Responsive date and time filter controls.
 */
const TimeFilter = (props: IProps) => {
    const containerRef = React.useRef<HTMLFieldSetElement | null>(null);
    const { width } = useGetContainerPosition(containerRef as any);

    const format = getFormat(props.format);

    const [activeQuickSelect, setActiveQuickSelect] = React.useState<number>(-1);
    const [filter, setFilter] = React.useState<ITimeWindow>(getTimeWindowFromFilter(props.filter, format));

    const [collapsed, setCollapsed] = React.useState(false);

    //Effect to set parent filter when internal filter changes
    React.useEffect(() => {
        if (!isEqual(filter, props.filter)) {
            props.setFilter(filter.start, filter.end, filter.unit, filter.duration);
        }
    }, [filter])

    //Effect to sync filter if external filter changes
    React.useEffect(() => {
        if (!isEqual(filter, props.filter)) {
            const flt = getTimeWindowFromFilter(props.filter, format);
            setFilter(flt);
        }
    }, [props.filter]);

    //Effect to push collapse state to parent
    React.useEffect(() => {
        if (props.setCollapsed == null) return;
        props.setCollapsed(collapsed);
    }, [collapsed])

    // Checks typing of ITimeFilter and then compares to ITimeWindow
    const isEqual = (timeWindow: ITimeWindow, timeFilter: ITimeFilter) => {
        const flt = getTimeWindowFromFilter(timeFilter, format);
        return _.isEqual(timeWindow, flt)
    }

    const helpMessaage = (props.showHelpMessage ?? true) ? `All times shown are in system time (${props.timeZone}).` : undefined

    return (
        <fieldset className="border" style={{ padding: '10px', height: '100%', overflow: 'hidden' }} ref={containerRef}>
            <legend className="w-auto" style={{ fontSize: 'large' }}>
                <div className="d-flex align-items-center">
                    <span className="mr-2">Date/Time Filter:</span>
                    {(props.enableCollapse ?? false) ?
                        <button
                            type="button"
                            className="btn p-0 ml-auto"
                            onClick={() => setCollapsed(x => !x)}
                        >
                            {collapsed ? <ReactIcons.ArrowDropDown /> : <ReactIcons.ArrowDropUp />}
                        </button> : null}
                </div>
            </legend>
            {collapsed ? null :
                props.dateTimeSetting === 'startEnd' ?
                    <StartEndFilter
                        TimeWindowFilter={filter}
                        SetTimeWindowFilter={setFilter}
                        Timezone={props.timeZone}
                        ActiveQP={activeQuickSelect}
                        SetActiveQP={setActiveQuickSelect}
                        SetFilter={props.setFilter}
                        Accuracy={props.accuracy}
                        Format={format}
                        DateUnit={props.format ?? 'datetime-local'}
                        ShowQuickSelects={props.showQuickSelect}
                        ContainerWidth={width}
                        HelpMessage={helpMessaage}
                        QuickSelectRange={props.quickSelectRange}
                    />
                    : props.dateTimeSetting === 'startWindow' ?
                        <WindowFilter
                            TimeWindowFilter={filter}
                            SetTimeWindowFilter={setFilter}
                            Timezone={props.timeZone}
                            ActiveQP={activeQuickSelect}
                            SetActiveQP={setActiveQuickSelect}
                            SetFilter={props.setFilter}
                            Accuracy={props.accuracy}
                            Format={format}
                            DateUnit={props.format ?? 'datetime-local'}
                            ShowQuickSelects={props.showQuickSelect}
                            ContainerWidth={width}
                            HelpMessage={helpMessaage}
                            Window={'start'}
                            QuickSelectRange={props.quickSelectRange}
                        />
                        :
                        <WindowFilter
                            TimeWindowFilter={filter}
                            SetTimeWindowFilter={setFilter}
                            Timezone={props.timeZone}
                            ActiveQP={activeQuickSelect}
                            SetActiveQP={setActiveQuickSelect}
                            SetFilter={props.setFilter}
                            Accuracy={props.accuracy}
                            Format={format}
                            DateUnit={props.format ?? 'datetime-local'}
                            ShowQuickSelects={props.showQuickSelect}
                            ContainerWidth={width}
                            HelpMessage={helpMessaage}
                            Window={'end'}
                            QuickSelectRange={props.quickSelectRange}
                        />
            }
        </fieldset >
    );
}

// Converts ITimeFilter to an ITimeWindow filter
export function getTimeWindowFromFilter(flt: ITimeFilter, format?: string): ITimeWindow {
    let start: moment.Moment;
    let end: moment.Moment;
    let unit: TimeUnit;
    let duration: number;

    const formatFunction = (
        start: moment.Moment,
        end: moment.Moment,
        unit: TimeUnit,
        duration: number
    ) => ({
        start: start.format(format),
        end: end.format(format),
        unit: unit,
        duration: duration,
    });

    if ('start' in flt && 'duration' in flt) {     // type is IStartDuration
        start = moment(flt.start, format);
        duration = flt.duration;
        unit = flt.unit;
        end = addDuration(start, duration, unit);
        return formatFunction(start, end, unit, duration);
    }
    if ('end' in flt && 'duration' in flt) {  // type is IEndDuration
        end = moment(flt.end, format);
        duration = flt.duration;
        unit = flt.unit;
        start = addDuration(end, -duration, unit);
        return formatFunction(start, end, unit, duration);
    }
    if ('start' in flt && 'end' in flt) {     // type is IStartEnd
        start = moment(flt.start, format);
        end = moment(flt.end, format);
        unit = findAppropriateUnit(start, end);
        duration = end.diff(start, unit);
        return formatFunction(start, end, unit, duration);
    }

    throw TypeError(`Unexpected type in getTimeWindowFromFilter, filter is: ${(flt as object).toString()}`);
}

export default TimeFilter;