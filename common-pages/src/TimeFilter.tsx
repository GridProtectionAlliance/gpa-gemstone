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
    ICenterDuration, getTimeWindow, readableUnit, momentDateFormat, momentTimeFormat, TimeUnit } from './TimeWindowUtils';
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

/**
*    filter: an interface of IStartEnd | IStartDuration | IEndDuration | ICenterDuration
*    showQuickSelect: displays Quick Select component
*    isHorizontal: displays Quick Selects in horizontal view 
*/
interface IProps {
    filter: ITimeFilter;
    setFilter: (center: string, start: string, end: string, units: TimeUnit, duration: number) => void,
    showQuickSelect: boolean;
    dateTimeSetting: 'center' | 'startWindow' | 'endWindow' | 'startEnd';
    timeZone: string;
    isHorizontal: boolean;
}


// Returns a row div element with props as children of row 
function Row(props: React.PropsWithChildren<{addRow: boolean}>){
    if (props.addRow){
        return <div className='row'>{props.children}</div>
    }
    return <>{props.children}</>
}

const TimeFilter = (props: IProps) => {
    const [activeQP, setActiveQP] = React.useState<number>(-1);
    const filt = getTimeWindow(props.filter)

    const [filter, setFilter] = React.useState<ITimeWindow>({
        center: filt.center,
        start: filt.start,
        end: filt.end,
        unit: filt.unit,
        duration: filt.window,
        halfDuration: filt.halfWindow
    });

    React.useEffect(() => {
        if (isEqual(filter, props.filter))
            return;
        props.setFilter(filter.center, filter.start, filter.end, filter.unit, filter.duration);
    }, [filter])

    //Checks typing of ITimeFilter and then compares to ITimeWindow
    function isEqual(flt1: ITimeWindow, flt2: ITimeFilter) {
        const flt = getTimeWindow(flt2)
        return flt1.center == flt.center &&
            flt1.unit == flt.unit &&
            flt1.duration == flt.window
    }

    React.useEffect(() => {
        if (isEqual(filter, props.filter))
            return;

        const flt = getTimeWindow(props.filter)
        const durationValue = flt.halfWindow;
        const dUnits = flt.unit;

        const centerTime = moment(flt.center, 'MM/DD/YYYY HH:mm:ss.SSS');
        const [startTime, endTime] = [moment(flt.start, 'MM/DD/YYYY HH:mm:ss.SSS'), moment(flt.end, 'MM/DD/YYYY HH:mm:ss.SSS')];

        setFilter(prevState => ({
            ...prevState,
            center: centerTime.format('MM/DD/YYYY HH:mm:ss.SSS'),
            start: startTime.format('MM/DD/YYYY HH:mm:ss.SSS'),
            end: endTime.format('MM/DD/YYYY HH:mm:ss.SSS'),
            unit: dUnits,
            duration: durationValue * 2,
            halfDuration: durationValue,
        }));

    }, [props.filter]);

    return (
        <fieldset className="border" style={{ padding: '10px', height: '100%' }}>
            <legend className="w-auto" style={{ fontSize: 'large' }}>Date/Time Filter:</legend>
            <Row addRow={props.isHorizontal} >

            {props.dateTimeSetting === 'center' ?
                <Row addRow={!props.isHorizontal} >
                    <div className={props.isHorizontal ? (props.showQuickSelect? 'col-4': 'col-6'): 'col-12'}>
                        <DatePicker< ITimeWindow > Record={filter} Field="center" Help={`All times are in system time. System time is currently set to ${props.timeZone}. `}
                            Setter={(r) => {
                                const centerTime = getMoment(r.center);
                                const [startTime, endTime] = getStartEndTime(centerTime, filter.halfDuration, filter.unit);

                                setFilter(prevFilter => ({
                                    ...prevFilter,
                                    center: centerTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                    start: startTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                    end: endTime.format(momentDateFormat + ' ' + momentTimeFormat)
                                }));
                                setActiveQP(-1);
                            }}
                            Label='Time Window Center:'
                            Type='datetime-local'
                            Valid={() => true} Format={momentDateFormat + ' ' + momentTimeFormat} 
                            />
                    </div>
                </Row>

                : null
            }
            {props.dateTimeSetting === 'startWindow' || props.dateTimeSetting === 'startEnd' ?

                <Row addRow={!props.isHorizontal} >
                    <div className={props.isHorizontal ? (props.showQuickSelect? 'col-4': 'col-6'): 'col-12'}>
                        <DatePicker< ITimeWindow > Record={filter} Field="start" Help={`All times are in system time. System time is currently set to ${props.timeZone}. `}
                            Setter={(r) => {
                                const startTime = getMoment(r.start);
                                let window = filter.halfDuration;
                                let unit = filter.unit;

                                if (props.dateTimeSetting === 'startEnd') {
                                    [unit, window] = findAppropriateUnit(startTime, getMoment(filter.end), undefined, true);
                                }

                                const d = moment.duration(window, unit);
                                const centerTime = startTime.clone().add(d);
                                const endTime = centerTime.clone().add(d);
                                setFilter({
                                    center: centerTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                    start: startTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                    end: endTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                    duration: window * 2,
                                    halfDuration: window,
                                    unit: unit

                                });
                                setActiveQP(-1);
                            }}
                            Label='Start of Time Window:'
                            Type='datetime-local'
                            Valid={() => true} Format={momentDateFormat + ' ' + momentTimeFormat}
                        />
                    </div>
                </Row>
                : null
            }
            {props.dateTimeSetting === 'endWindow' || props.dateTimeSetting === 'startEnd' ?
                <Row addRow={!props.isHorizontal}>
                    <div className={props.isHorizontal ? (props.showQuickSelect? 'col-4': 'col-6'): 'col-12'}>
                        <DatePicker<ITimeWindow> Record={filter} Field="end" Help={`All times are in system time. System time is currently set to ${props.timeZone}. `}
                            Setter={(r) => {
                                const endTime = getMoment(r.end);
                                let window = filter.halfDuration;
                                let unit = filter.unit;

                                if (props.dateTimeSetting === 'startEnd') {
                                    [unit, window] = findAppropriateUnit(getMoment(filter.start), endTime, undefined, true);
                                }
                                const d = moment.duration(window, unit);
                                const centerTime = endTime.clone().subtract(d);
                                const startTime = centerTime.clone().subtract(d);
                                setFilter({
                                    center: centerTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                    start: startTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                    end: endTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                    duration: window * 2,
                                    halfDuration: window,
                                    unit: unit

                                });
                                setActiveQP(-1);
                            }}
                            Label='End of Time Window :'
                            Type='datetime-local'
                            Valid={() => true} Format={momentDateFormat + ' ' + momentTimeFormat}
                        />
                    </div>
                </Row>
                : null
            }
            {props.dateTimeSetting === 'center' ?
                <>
                    <label style={{ width: '100%', position: 'relative', float: "left" }}>Time Window(+/-): </label>
                    <Row addRow={!props.isHorizontal}>
                        <div className={props.isHorizontal ? (props.showQuickSelect? 'col-2': 'col-3'): 'col-6'}>
                            <Input<ITimeWindow> Record={filter} Field='halfDuration' Setter={(r) => {
                                const centerTime = getMoment(filter.center);
                                const [startTime, endTime] = getStartEndTime(centerTime, r.halfDuration, filter.unit);

                                setFilter(prevFilter => ({
                                    ...prevFilter,
                                    duration: r.duration,
                                    halfDuration: r.halfDuration,
                                    start: startTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                    end: endTime.format(momentDateFormat + ' ' + momentTimeFormat)
                                }));
                                setActiveQP(-1);
                            }}
                            Label='' Valid={() => true}
                            Type='number' />
                        </div>
                        <div className={props.isHorizontal ? (props.showQuickSelect? 'col-2': 'col-3'): 'col-6'}>
                            <Select<ITimeWindow> Record={filter} Label=''
                                Field='unit'
                                Setter={(r) => {
                                    const centerTime = getMoment(filter.center);
                                    const [startTime, endTime] = getStartEndTime(centerTime, filter.halfDuration, r.unit);

                                    setFilter(prevFilter => ({
                                        ...prevFilter,
                                        unit: r.unit,
                                        start: startTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                        end: endTime.format(momentDateFormat + ' ' + momentTimeFormat)
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
                        <div className={props.isHorizontal ? (props.showQuickSelect? 'col-2': 'col-3'): 'col-6'}>
                            <Input<ITimeWindow> Record={filter} Field='duration' Setter={(r) => {
                                const startTime = getMoment(filter.start);
                                const d = moment.duration(r.halfDuration, filter.unit);
                                const centerTime = startTime.clone().add(d);
                                const endTime = centerTime.clone().add(d);

                                setFilter(prevFilter => ({
                                    ...prevFilter,
                                    duration: r.duration,
                                    halfDuration: r.halfDuration,
                                    center: centerTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                    end: endTime.format(momentDateFormat + ' ' + momentTimeFormat)
                                }));
                                setActiveQP(-1);
                            }}
                             Label='' Valid={() => true}
                                Type='number' />
                        </div>
                        <div className={props.isHorizontal ? (props.showQuickSelect? 'col-2': 'col-3'): 'col-6'}>
                            <Select<ITimeWindow> Record={filter} Label=''
                                Field='unit'
                                Setter={(r) => {
                                    const startTime = getMoment(filter.start);
                                    const d = moment.duration(filter.halfDuration, r.unit);
                                    const centerTime = startTime.clone().add(d);
                                    const endTime = centerTime.clone().add(d);

                                    setFilter(prevFilter => ({
                                        ...prevFilter,
                                        unit: r.unit,
                                        center: centerTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                        end: endTime.format(momentDateFormat + ' ' + momentTimeFormat)
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
                        <div className={props.isHorizontal ? (props.showQuickSelect? 'col-2': 'col-3'): 'col-6'}>
                            <Input<ITimeWindow> Record={filter} Field='duration' Setter={(r) => {
                                const endTime = getMoment(filter.end);
                                const d = moment.duration(r.halfDuration, filter.unit);
                                const centerTime = endTime.clone().subtract(d);
                                const startTime = centerTime.clone().subtract(d);

                                setFilter(prevFilter => ({
                                    ...prevFilter,
                                    duration: r.duration,
                                    halfDuration: r.halfDuration,
                                    center: centerTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                    start: startTime.format(momentDateFormat + ' ' + momentTimeFormat)
                                }));
                                setActiveQP(-1);
                            }}
                                Label='' Valid={() => true}
                                Type='number' />
                        </div>
                        <div className={props.isHorizontal ? (props.showQuickSelect? 'col-2': 'col-3'): 'col-6'}>
                            <Select<ITimeWindow> Record={filter} Label=''
                                Field='unit'
                                Setter={(r) => {
                                    const endTime = getMoment(filter.end);
                                    const d = moment.duration(filter.halfDuration, r.unit);
                                    const centerTime = endTime.clone().subtract(d);
                                    const startTime = centerTime.clone().subtract(d);

                                    setFilter(prevFilter => ({
                                        ...prevFilter,
                                        unit: r.unit,
                                        center: centerTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                        start: startTime.format(momentDateFormat + ' ' + momentTimeFormat)
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
                <div className={props.isHorizontal ? 'col-4': 'row'}>
                    <Row addRow={props.isHorizontal}>
                        {AvailableQuickSelects.map((qs, i) => {
                            if (i % 3 !== 0)
                                return null;
                            return (
                                <div key={i} className={"col-4"} style={{ paddingLeft: (props.isHorizontal ? 0 : (i % 9 == 0 ? 15 : 0)), paddingRight: (props.isHorizontal ? 2 : ((i % 18 == 6 || i % 18 == 15) ? 15 : 2)), marginTop: 10 }}>
                                    <ul className="list-group" key={i}>
                                        <li key={i} style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                const flt = getTimeWindow(AvailableQuickSelects[i].createFilter(props.timeZone));
                                                props.setFilter(flt.center, flt.start, flt.end, flt.unit, flt.window);
                                                setActiveQP(i);
                                            }}
                                            className={"item badge badge-" + (i == activeQP ? "primary" : "secondary")}>{AvailableQuickSelects[i].label}
                                        </li>
                                        {i + 1 < AvailableQuickSelects.length ?
                                            <li key={i + 1} style={{ marginTop: 3, cursor: 'pointer' }}
                                                className={"item badge badge-" + (i + 1 == activeQP ? "primary" : "secondary")}
                                                onClick={() => {
                                                    const flt = getTimeWindow(AvailableQuickSelects[i + 1].createFilter(props.timeZone));
                                                    props.setFilter(flt.center, flt.start, flt.end, flt.unit, flt.window);
                                                    setActiveQP(i + 1)
                                                }}>
                                                {AvailableQuickSelects[i + 1].label}
                                            </li> : null}
                                        {i + 2 < AvailableQuickSelects.length ?
                                            <li key={i + 2}
                                                style={{ marginTop: 3, cursor: 'pointer' }}
                                                className={"item badge badge-" + (i + 2 == activeQP ? "primary" : "secondary")}
                                                onClick={() => {
                                                    const flt = getTimeWindow(AvailableQuickSelects[i + 2].createFilter(props.timeZone));
                                                    props.setFilter(flt.center, flt.start, flt.end, flt.unit, flt.window);
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