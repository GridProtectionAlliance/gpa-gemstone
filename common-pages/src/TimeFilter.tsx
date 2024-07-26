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
import moment from 'moment';
import { DatePicker, Select, Input } from '@gpa-gemstone/react-forms'
import { findAppropriateUnit, getMoment, getStartEndTime, units, IStartEnd, IStartDuration, IEndDuration, 
    ICenterDuration, readableUnit, isStartEnd, isStartDuration, 
    isEndDuration, isCenterDuration, TimeUnit } from './TimeWindowUtils';
import { AvailableQuickSelects } from './TimeFilter/QuickSelects'


interface ITimeWindow {
    center: string,
    start: string,
    end: string,
    unit: TimeUnit,
    duration: number,
    halfDuration: number,
}

export type ITimeFilter = IStartEnd | IStartDuration | IEndDuration | ICenterDuration


// Converts ITimeFilter to an ITimeWindow filter           
export function getTimeWindow (flt: ITimeFilter, format?: string){
    let center, start, end, unit, duration, halfDuration;

    if (isCenterDuration(flt)){
        center = getMoment(flt.center, format);
        [start, end] = getStartEndTime(center, flt.halfDuration, flt.unit);        
        unit = flt.unit;
        halfDuration = flt.halfDuration;
        duration = halfDuration * 2;
    }
    else if (isStartDuration(flt)){
        start = getMoment(flt.start, format);
        const d = moment.duration(flt.duration / 2.0, flt.unit);
        center = start.clone().add(d);
        end= center.clone().add(d);
        unit = flt.unit;
        duration = flt.duration,
        halfDuration = duration / 2.0;
    }
    else if (isEndDuration(flt)){
        end = getMoment(flt.end, format);
        const d = moment.duration(flt.duration / 2.0, flt.unit);
        center = end.clone().subtract(d);
        start = center.clone().subtract(d);
        unit = flt.unit;
        duration = flt.duration,
        halfDuration = duration / 2.0;
    }
    else if (isStartEnd(flt)){
        start = getMoment(flt.start, format);
        end = getMoment(flt.end, format);
        [unit, halfDuration] = findAppropriateUnit(start, end, undefined, true);
        const d = moment.duration(halfDuration, unit);
        center = start.clone().add(d);
        duration = halfDuration * 2;
    }
    return {center: center?.format(format) ?? '',
            start: start?.format(format) ?? '',
            end: end?.format(format) ?? '', 
            unit: unit ?? 'ms', 
            duration: duration ?? 0, 
            halfDuration: halfDuration ?? 0}
}

/**
*    filter: an interface of IStartEnd | IStartDuration | IEndDuration | ICenterDuration
*    showQuickSelect: displays Quick Select component
*    isHorizontal: displays Quick Selects in horizontal view 
*/
interface IProps {
    filter: ITimeFilter;
    setFilter: (center: string, start: string, end: string, unit: TimeUnit, duration: number) => void,
    showQuickSelect: boolean;
    dateTimeSetting: 'center' | 'startWindow' | 'endWindow' | 'startEnd';
    timeZone: string;
    isHorizontal: boolean;
    format?: ('datetime-local' | 'date' | 'time');
}


// Returns a row div element with props as children of row 
function Row(props: React.PropsWithChildren<{addRow: boolean, class?: string}>){
    if (props.addRow){
        return <div className={`row ${props.class}`}>{props.children}</div>
    }
    return <>{props.children}</>
}

const TimeFilter = (props: IProps) => {
    const format = (props.format == 'date') ? 'YYYY-MM-DD' : 'MM/DD/YYYY HH:mm:ss.SSS'
    const [activeQP, setActiveQP] = React.useState<number>(-1);
    const [filter, setFilter] = React.useState<ITimeWindow>(getTimeWindow(props.filter, format));

    React.useEffect(() => {
        if (!isEqual(filter, props.filter))
            props.setFilter(filter.center, filter.start, filter.end, filter.unit, filter.duration);
    }, [filter])

    //Checks typing of ITimeFilter and then compares to ITimeWindow
    function isEqual(flt1: ITimeWindow, flt2: ITimeFilter) {
        const flt = getTimeWindow(flt2, format);
        return flt1.center == flt.center &&
            flt1.unit == flt.unit &&
            flt1.duration == flt.duration
    }

    React.useEffect(() => {
        if (!isEqual(filter, props.filter)){
            const flt = getTimeWindow(props.filter, format);
            setFilter(flt);
        }
    }, [props.filter]);

    return (
        <fieldset className="border" style={{ padding: '10px', height: '100%' }}>
            <legend className="w-auto" style={{ fontSize: 'large' }}>Date/Time Filter:</legend>
            <Row addRow={props.isHorizontal} >

            {props.dateTimeSetting === 'center' ?
                <Row addRow={!props.isHorizontal} >
                    <div className={props.isHorizontal ? (props.showQuickSelect? 'col-2': 'col-6'): 'col-12'}>
                        <DatePicker< ITimeWindow > Record={filter} Field="center" Help={`All times are in system time. System time is currently set to ${props.timeZone}. `}
                            Setter={(r) => {
                                setFilter(prevFilter => ({
                                    ...prevFilter,
                                    center: r.center,
                                    start: r.start,
                                    end: r.end
                                }));
                                setActiveQP(-1);
                            }}
                            Label='Time Window Center:'
                            Type={props.format ?? 'datetime-local'}
                            Valid={() => true} Format={format} 
                            />
                    </div>
                </Row>

                : null
            }
            {props.dateTimeSetting === 'startWindow' || props.dateTimeSetting === 'startEnd' ?

                <Row addRow={!props.isHorizontal} >
                    <div className={props.isHorizontal ? (props.showQuickSelect? 'col-2': 'col-6'): 'col-12'}>
                        <DatePicker< ITimeWindow > Record={filter} Field="start" Help={`All times are in system time. System time is currently set to ${props.timeZone}. `}
                            Setter={(r) => {
                                let halfDur = filter.halfDuration;
                                let unit = filter.unit;
                                if (props.dateTimeSetting === 'startEnd') {
                                    [unit, halfDur] = findAppropriateUnit(getMoment(r.start, format), getMoment(filter.end, format), undefined, true);
                                }

                                const flt = getTimeWindow({start: r.start, duration: halfDur*2, unit: unit}, format);
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
                    <div className={props.isHorizontal ? (props.showQuickSelect? 'col-2': 'col-6'): 'col-12'}>
                        <DatePicker<ITimeWindow> Record={filter} Field="end" Help={`All times are in system time. System time is currently set to ${props.timeZone}. `}
                            Setter={(r) => {
                                let halfDur = filter.halfDuration;
                                let unit = filter.unit;
                                if (props.dateTimeSetting === 'startEnd') {
                                    [unit, halfDur] = findAppropriateUnit(getMoment(filter.start, format), getMoment(r.end, format), undefined, true);
                                }

                                const flt = getTimeWindow({end: r.end, duration: halfDur*2, unit: unit}, format);
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
            {props.dateTimeSetting === 'center' ?
                <>
                    <label style={{ width: '100%', position: 'relative', float: "left" }}>Time Window(+/-): </label>
                    <Row addRow={!props.isHorizontal}>
                        <div className={props.isHorizontal ? (props.showQuickSelect? 'col-1': 'col-3'): 'col-6'}>
                            <Input<ITimeWindow> Record={filter} Field='halfDuration' Setter={(r) => {
                                const flt = getTimeWindow({center: filter.center, halfDuration: r.halfDuration, unit: filter.unit}, format);
                                setFilter(prevFilter => ({
                                    ...prevFilter,
                                    duration: r.duration,
                                    halfDuration: r.halfDuration,
                                    start: flt.start,
                                    end: flt.end
                                }));
                                setActiveQP(-1);
                            }}
                            Label='' Valid={() => true}
                            Type='number' />
                        </div>
                        <div className={props.isHorizontal ? (props.showQuickSelect? 'col-1': 'col-3'): 'col-6'}>
                            <Select<ITimeWindow> Record={filter} Label=''
                                Field='unit'
                                Setter={(r) => {
                                    const flt = getTimeWindow({center: filter.center, halfDuration: filter.halfDuration, unit: r.unit}, format);
                                    setFilter(prevFilter => ({
                                        ...prevFilter,
                                        unit: r.unit,
                                        start: flt.start,
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
            {props.dateTimeSetting === 'startWindow' ?
                <>
                    <label style={{ width: '100%', position: 'relative', float: "left" }}>Time Window(+): </label>
                    <Row addRow={!props.isHorizontal}>
                        <div className={props.isHorizontal ? (props.showQuickSelect? 'col-1': 'col-3'): 'col-6'}>
                            <Input<ITimeWindow> Record={filter} Field='duration' Setter={(r) => {
                                const flt = getTimeWindow({start: filter.start, duration: r.duration, unit: filter.unit}, format);
                                setFilter(prevFilter => ({
                                    ...prevFilter,
                                    duration: r.duration,
                                    halfDuration: r.halfDuration,
                                    center: flt.center,
                                    end: flt.end
                                }));
                                setActiveQP(-1);
                            }}
                             Label='' Valid={() => true}
                                Type='number' />
                        </div>
                        <div className={props.isHorizontal ? (props.showQuickSelect? 'col-1': 'col-3'): 'col-6'}>
                            <Select<ITimeWindow> Record={filter} Label=''
                                Field='unit'
                                Setter={(r) => {
                                    const flt = getTimeWindow({start: filter.start, duration: filter.duration, unit: r.unit}, format);
                                    setFilter(prevFilter => ({
                                        ...prevFilter,
                                        unit: r.unit,
                                        center: flt.center,
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
                        <div className={props.isHorizontal ? (props.showQuickSelect? 'col-1': 'col-3'): 'col-6'}>
                            <Input<ITimeWindow> Record={filter} Field='duration' Setter={(r) => {
                                const flt = getTimeWindow({end: filter.end, duration: r.duration, unit: filter.unit}, format);
                                setFilter(prevFilter => ({
                                    ...prevFilter,
                                    duration: r.duration,
                                    halfDuration: r.halfDuration,
                                    center: flt.center,
                                    start: flt.start
                                }));
                                setActiveQP(-1);
                            }}
                                Label='' Valid={() => true}
                                Type='number' />
                        </div>
                        <div className={props.isHorizontal ? (props.showQuickSelect? 'col-1': 'col-3'): 'col-6'}>
                            <Select<ITimeWindow> Record={filter} Label=''
                                Field='unit'
                                Setter={(r) => {
                                    const flt = getTimeWindow({end: filter.end, duration: filter.duration, unit: r.unit}, format);
                                    setFilter(prevFilter => ({
                                        ...prevFilter,
                                        unit: r.unit,
                                        center: flt.center,
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
                <div className={props.isHorizontal ? 'col-8': 'row'}>
                    <Row addRow={props.isHorizontal} class="justify-content-center">
                        {AvailableQuickSelects.map((qs, i) => {
                            if (i % 3 !== 0 || (i == 0 && props.format == 'date'))   // remove first column of QuickSelects as date formate doesn't include time
                                return null;
                            return (
                                <div key={i} className={props.isHorizontal ? 'col-2': "col-4"} style={{ paddingLeft: (props.isHorizontal ? 0 : (i % 9 == 0 ? 15 : 0)), paddingRight: (props.isHorizontal ? 2 : ((i % 18 == 6 || i % 18 == 15) ? 15 : 2)), marginTop: 10 }}>
                                    <ul className="list-group" key={i}>
                                        <li key={i} style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                const flt = getTimeWindow(AvailableQuickSelects[i].createFilter(props.timeZone, format), format);
                                                props.setFilter(flt.center, flt.start, flt.end, flt.unit, flt.duration);
                                                setActiveQP(i);
                                            }}
                                            className={"item badge badge-" + (i == activeQP ? "primary" : "secondary")}>{AvailableQuickSelects[i].label}
                                        </li>
                                        {i + 1 < AvailableQuickSelects.length ?
                                            <li key={i + 1} style={{ marginTop: 3, cursor: 'pointer' }}
                                                className={"item badge badge-" + (i + 1 == activeQP ? "primary" : "secondary")}
                                                onClick={() => {
                                                    const flt = getTimeWindow(AvailableQuickSelects[i + 1].createFilter(props.timeZone, format), format);
                                                    props.setFilter(flt.center, flt.start, flt.end, flt.unit, flt.duration);
                                                    setActiveQP(i + 1)
                                                }}>
                                                {AvailableQuickSelects[i + 1].label}
                                            </li> : null}
                                        {i + 2 < AvailableQuickSelects.length ?
                                            <li key={i + 2}
                                                style={{ marginTop: 3, cursor: 'pointer' }}
                                                className={"item badge badge-" + (i + 2 == activeQP ? "primary" : "secondary")}
                                                onClick={() => {
                                                    const flt = getTimeWindow(AvailableQuickSelects[i + 2].createFilter(props.timeZone, format), format);
                                                    props.setFilter(flt.center, flt.start, flt.end, flt.unit, flt.duration);
                                                    setActiveQP(i + 2);
                                                }}>
                                                {AvailableQuickSelects[i + 2].label}
                                            </li> : null}
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