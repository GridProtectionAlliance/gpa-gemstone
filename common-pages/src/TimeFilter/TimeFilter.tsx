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
import { DatePicker, Select, Input } from '@gpa-gemstone/react-forms'
import {
    units, IStartEnd, IStartDuration, IEndDuration,
    readableUnit, TimeUnit, dateTimeFormat
} from './TimeWindowUtils';
import moment from 'moment';
import { AvailableQuickSelects, getFormat, DateUnit } from './QuickSelects';

interface ITimeWindow {
    start: string,
    end: string,
    unit: TimeUnit,
    duration: number,
}

export type ITimeFilter = IStartEnd | IStartDuration | IEndDuration

// Converts ITimeFilter to an ITimeWindow filter
export function getTimeWindowFromFilter(flt: ITimeFilter, format?: string): ITimeWindow {
    let center, start, end, unit, duration;

    if ('start' in flt && 'duration' in flt) {     // type is IStartDuration
        start = moment(flt.start, format);
        unit = flt.unit;
        duration = flt.duration;
    }
    else if ('end' in flt && 'duration' in flt) {  // type is IEndDuration
        end = moment(flt.end, format);
        unit = flt.unit;
        duration = flt.duration;
    }
    else if ('start' in flt && 'end' in flt) {     // type is IStartEnd
        start = moment(flt.start, format);
        end = moment(flt.end, format);
    }
    return {
        start: start?.format(format) ?? '',
        end: end?.format(format) ?? '',
        unit: unit ?? 'ms',
        duration: duration ?? 0,
    }
}

/**
*    filter: an interface of IStartEnd | IStartDuration | IEndDuration | ICenterDuration
*    showQuickSelect: displays Quick Select component
*    isHorizontal: displays Quick Selects in horizontal view 
*/
interface IProps {
    filter: ITimeFilter;
    setFilter: (start: string, end: string, unit: TimeUnit, duration: number) => void,
    showQuickSelect: boolean;
    dateTimeSetting: 'center' | 'startWindow' | 'endWindow' | 'startEnd';
    timeZone: string;
    isHorizontal: boolean;
    format?: DateUnit;
}


// Returns a row div element with props as children of row 
function Row(props: React.PropsWithChildren<{ addRow: boolean, class?: string }>) {
    if (props.addRow) {
        return <div className={`row ${props.class ?? ''}`}>{props.children}</div>
    }
    return <>{props.children}</>
}

const TimeFilter = (props: IProps) => {
    const format = getFormat(props.format); // ! This is problematic cause the format may not be the global one
    const QuickSelects = React.useMemo(() => AvailableQuickSelects.filter(qs => !qs.hideQuickPick(props.format)), [props.format]);
    const [activeQP, setActiveQP] = React.useState<number>(-1);
    const [filter, setFilter] = React.useState<ITimeWindow>(getTimeWindowFromFilter(props.filter, format));

    React.useEffect(() => {
        if (!isEqual(filter, props.filter))
            props.setFilter(filter.start, filter.end, filter.unit, filter.duration);
    }, [filter])

    // Checks typing of ITimeFilter and then compares to ITimeWindow
    function isEqual(timeWindow: ITimeWindow, timeFilter: ITimeFilter) {
        const flt = getTimeWindowFromFilter(timeFilter, format);
        return timeWindow.start == flt.start
            && timeWindow.end == flt.end
            && timeWindow.unit == flt.unit
            && timeWindow.duration == flt.duration
    }

    React.useEffect(() => {
        if (!isEqual(filter, props.filter)) {
            const flt = getTimeWindowFromFilter(props.filter, format);
            setFilter(flt);
        }
    }, [props.filter]);

    return (
        <fieldset className="border" style={{ padding: '10px', height: '100%' }}>
            <legend className="w-auto" style={{ fontSize: 'large' }}>Date/Time Filter:</legend>
            <Row addRow={props.isHorizontal} >
                {props.dateTimeSetting === 'startWindow' || props.dateTimeSetting === 'startEnd' ?
                    <Row addRow={!props.isHorizontal} >
                        <div className={props.isHorizontal ? (props.showQuickSelect ? 'col-2' : 'col-6') : 'col-12'}>
                            <DatePicker< ITimeWindow > Record={filter} Field="start" Help={`All times are in system time. System time is currently set to ${props.timeZone}. `}
                                Setter={(r) => {
                                    let unit = filter.unit;
                                    const flt = getTimeWindowFromFilter({ start: r.start, duration: r.duration, unit: unit }, format);
                                    setFilter(flt);
                                    setActiveQP(-1);
                                }}
                                Label='Start of Time Window:'
                                Type={props.format ?? 'datetime-local'}
                                Valid={() => true} Format={format}
                            />
                        </div>
                    </Row>
                    : null
                }
                {props.dateTimeSetting === 'endWindow' || props.dateTimeSetting === 'startEnd' ?
                    <Row addRow={!props.isHorizontal}>
                        <div className={props.isHorizontal ? (props.showQuickSelect ? 'col-2' : 'col-6') : 'col-12'}>
                            <DatePicker<ITimeWindow> Record={filter} Field="end" Help={`All times are in system time. System time is currently set to ${props.timeZone}. `}
                                Setter={(r) => {
                                    let unit = filter.unit;
                                    const flt = getTimeWindowFromFilter({ end: r.end, duration: r.duration, unit: unit }, format);
                                    setFilter(flt);
                                    setActiveQP(-1);
                                }}
                                Label='End of Time Window :'
                                Type={props.format ?? 'datetime-local'}
                                Valid={() => true} Format={format}
                            />
                        </div>
                    </Row>
                    : null
                }
                {props.dateTimeSetting === 'startWindow' ?
                    <>
                        <label style={{ width: '100%', position: 'relative', float: "left" }}>Time Window(+): </label>
                        <Row addRow={!props.isHorizontal}>
                            <div className={props.isHorizontal ? (props.showQuickSelect ? 'col-1' : 'col-3') : 'col-6'}>
                                <Input<ITimeWindow> Record={filter} Field='duration' Setter={(r) => {
                                    const flt = getTimeWindowFromFilter({ start: filter.start, duration: r.duration, unit: filter.unit }, format);
                                    setFilter(prevFilter => ({
                                        ...prevFilter,
                                        duration: r.duration,
                                        end: flt.end
                                    }));
                                    setActiveQP(-1);
                                }}
                                    Label='' Valid={() => true}
                                    Type='number' />
                            </div>
                            <div className={props.isHorizontal ? (props.showQuickSelect ? 'col-1' : 'col-3') : 'col-6'}>
                                <Select<ITimeWindow> Record={filter} Label=''
                                    Field='unit'
                                    Setter={(r) => {
                                        const flt = getTimeWindowFromFilter({ start: filter.start, duration: filter.duration, unit: r.unit }, format);
                                        setFilter(prevFilter => ({
                                            ...prevFilter,
                                            unit: r.unit,
                                            end: flt.end
                                        }));
                                        setActiveQP(-1);
                                    }}
                                    Options={
                                        units.map((unit) => ({
                                            Value: unit,
                                            Label: readableUnit(unit)
                                        }
                                        ))
                                    } />
                            </div>
                        </Row>
                    </>
                    : null
                }
                {props.dateTimeSetting === 'endWindow' ?
                    <>
                        <label style={{ width: '100%', position: 'relative', float: "left" }}>Time Window(-): </label>
                        <Row addRow={!props.isHorizontal}>
                            <div className={props.isHorizontal ? (props.showQuickSelect ? 'col-1' : 'col-3') : 'col-6'}>
                                <Input<ITimeWindow> Record={filter} Field='duration' Setter={(r) => {
                                    const flt = getTimeWindowFromFilter({ end: filter.end, duration: r.duration, unit: filter.unit }, format);
                                    setFilter(prevFilter => ({
                                        ...prevFilter,
                                        duration: r.duration,
                                        start: flt.start
                                    }));
                                    setActiveQP(-1);
                                }}
                                    Label='' Valid={() => true}
                                    Type='number' />
                            </div>
                            <div className={props.isHorizontal ? (props.showQuickSelect ? 'col-1' : 'col-3') : 'col-6'}>
                                <Select<ITimeWindow> Record={filter} Label=''
                                    Field='unit'
                                    Setter={(r) => {
                                        const flt = getTimeWindowFromFilter({ end: filter.end, duration: filter.duration, unit: r.unit }, format);
                                        setFilter(prevFilter => ({
                                            ...prevFilter,
                                            unit: r.unit,
                                            start: flt.start
                                        }));
                                        setActiveQP(-1);
                                    }}
                                    Options={
                                        units.map((unit) => ({
                                            Value: unit,
                                            Label: readableUnit(unit)
                                        }
                                        ))
                                    } />
                            </div>
                        </Row>
                    </>
                    : null
                }
                {props.showQuickSelect ?
                    <div className={props.isHorizontal ? 'col-8' : 'row'}>
                        <Row addRow={props.isHorizontal} class="justify-content-center">
                            {QuickSelects.map((qs, i) => {
                                if (i % 3 !== 0)
                                    return null;
                                return (
                                    <div key={i} className={props.isHorizontal ? 'col-2' : "col-4"} style={{ paddingLeft: (props.isHorizontal ? 0 : (i % 9 == 0 ? 15 : 0)), paddingRight: (props.isHorizontal ? 2 : ((i % 18 == 6 || i % 18 == 15) ? 15 : 2)), marginTop: 10 }}>
                                        <ul className="list-group" key={i}>
                                            <li key={i} style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    const flt = getTimeWindowFromFilter(QuickSelects[i].createFilter(props.timeZone, props.format), format);
                                                    props.setFilter(flt.start, flt.end, flt.unit, flt.duration);
                                                    setActiveQP(i);
                                                }}
                                                className={"item badge badge-" + (i == activeQP ? "primary" : "secondary")}>{QuickSelects[i].label}
                                            </li>
                                            {i + 1 < QuickSelects.length ?
                                                <li key={i + 1} style={{ marginTop: 3, cursor: 'pointer' }}
                                                    className={"item badge badge-" + (i + 1 == activeQP ? "primary" : "secondary")}
                                                    onClick={() => {
                                                        const flt = getTimeWindowFromFilter(QuickSelects[i + 1].createFilter(props.timeZone, props.format), format);
                                                        props.setFilter(flt.start, flt.end, flt.unit, flt.duration);
                                                        setActiveQP(i + 1)
                                                    }}>
                                                    {QuickSelects[i + 1].label}
                                                </li>
                                                : null}
                                            {i + 2 < QuickSelects.length ?
                                                <li key={i + 2}
                                                    style={{ marginTop: 3, cursor: 'pointer' }}
                                                    className={"item badge badge-" + (i + 2 == activeQP ? "primary" : "secondary")}
                                                    onClick={() => {
                                                        const flt = getTimeWindowFromFilter(QuickSelects[i + 2].createFilter(props.timeZone, props.format), format);
                                                        props.setFilter(flt.start, flt.end, flt.unit, flt.duration);
                                                        setActiveQP(i + 2);
                                                    }}>
                                                    {QuickSelects[i + 2].label}
                                                </li>
                                                : null}
                                        </ul>
                                    </div>
                                )
                            })}
                        </Row>
                    </div>
                    : null}
            </Row>
        </fieldset>
    );
}
export default TimeFilter;