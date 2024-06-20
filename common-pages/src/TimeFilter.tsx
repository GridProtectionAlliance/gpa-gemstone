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
import momentTZ from 'moment-timezone';
import { DatePicker, Select, Input } from '@gpa-gemstone/react-forms'
import { findAppropriateUnit, getMoment, getStartEndTime, units, ITimeFilter, readableUnit, momentDateFormat, momentTimeFormat } from './TimeWindowUtils';
import { AvailableQuickSelects } from './TimeFilter/QuickSelects'

//add different timefilter types, change filter t
interface IProps {
    filter: ITimeFilter;
    setFilter: (filter: ITimeFilter) => void,
    showQuickSelect: boolean;
    dateTimeSetting: 'center' | 'startWindow' | 'endWindow' | 'startEnd';
    timeZone: string;
    isHorizontal: boolean;
}


function Row(props: React.PropsWithChildren<{addRow: boolean}>){
    if (props.addRow){
        return <div className='row'>{props.children}</div>
    }
    return <>{props.children}</>
}



// update props to use new timefilter
const TimeFilter = (props: IProps) => {
    const [activeQP, setActiveQP] = React.useState<number>(-1);
    const [filter, setFilter] = React.useState<ITimeFilter>({
        centerTime: props.filter.centerTime,
        startTime: props.filter.startTime,
        endTime: props.filter.endTime,
        timeWindowUnits: props.filter.timeWindowUnits,
        windowSize: props.filter.windowSize,
        halfWindowSize: props.filter.halfWindowSize,
    });


    React.useEffect(() => {
        if (isEqual(filter, props.filter))
            return;
        props.setFilter({
            centerTime: filter.centerTime,
            startTime: filter.startTime,
            endTime: filter.endTime,
            windowSize: filter.windowSize,
            timeWindowUnits: filter.timeWindowUnits,
            halfWindowSize: filter.halfWindowSize
        });
    }, [filter])

// update function to use new timefilter
    function isEqual(flt1: ITimeFilter, flt2: ITimeFilter) {
        return flt1.centerTime == flt2.centerTime &&
            flt1.timeWindowUnits == flt2.timeWindowUnits &&
            flt1.windowSize == flt2.windowSize;
    }

    React.useEffect(() => {
        if (isEqual(filter, props.filter))
            return;

        const durationValue = props.filter.halfWindowSize;
        const dUnits = props.filter.timeWindowUnits;

        const centerTime = moment(props.filter.centerTime, 'MM/DD/YYYY HH:mm:ss.SSS');
        const [startTime, endTime] = [moment(props.filter.startTime, 'MM/DD/YYYY HH:mm:ss.SSS'), moment(props.filter.endTime, 'MM/DD/YYYY HH:mm:ss.SSS')];
// update function to use new timefilter
        setFilter(prevState => ({
            ...prevState,
            centerTime: centerTime.format('MM/DD/YYYY HH:mm:ss.SSS'),
            startTime: startTime.format('MM/DD/YYYY HH:mm:ss.SSS'),
            endTime: endTime.format('MM/DD/YYYY HH:mm:ss.SSS'),
            timeWindowUnits: dUnits,
            windowSize: durationValue * 2,
            halfWindowSize: durationValue,
        }));

    }, [props.filter]);


    return (
        <fieldset className="border" style={{ padding: '10px', height: '100%' }}>
            <legend className="w-auto" style={{ fontSize: 'large' }}>Date/Time Filter:</legend>
            <Row addRow={props.isHorizontal} >

            {props.dateTimeSetting === 'center' ?
                <Row addRow={!props.isHorizontal} >
                    <div className={props.isHorizontal ? (props.showQuickSelect? 'col-4': 'col-6'): 'col-12'}>
                        <DatePicker< ITimeFilter > Record={filter} Field="centerTime" Help={`All times are in system time. System time is currently set to ${props.timeZone}. `}
                            Setter={(r) => {
                                const centerTime = getMoment(r.centerTime);
                                const [startTime, endTime] = getStartEndTime(centerTime, filter.halfWindowSize, units[filter.timeWindowUnits]);

                                setFilter(prevFilter => ({
                                    ...prevFilter,
                                    centerTime: centerTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                    startTime: startTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                    endTime: endTime.format(momentDateFormat + ' ' + momentTimeFormat)
                                }));
                                setActiveQP(-1);
                            }}
                            Label='Time Window Center:'
                            Type='datetime-local'
                            Valid={() => true} Format={momentDateFormat + ' ' + momentTimeFormat} />
                    </div>
                </Row>

                : null
            }
            {props.dateTimeSetting === 'startWindow' || props.dateTimeSetting === 'startEnd' ?

                <Row addRow={!props.isHorizontal} >
                    <div className={props.isHorizontal ? (props.showQuickSelect? 'col-4': 'col-6'): 'col-12'}>
                        <DatePicker< ITimeFilter > Record={filter} Field="startTime" Help={`All times are in system time. System time is currently set to ${props.timeZone}. `}
                            Setter={(r) => {
                                const startTime = getMoment(r.startTime);
                                let window = filter.halfWindowSize;
                                let unit = filter.timeWindowUnits;
                                if (props.dateTimeSetting === 'startEnd') {
                                    [unit, window] = findAppropriateUnit(startTime, getMoment(filter.endTime), undefined, true);
                                }

                                const d = moment.duration(window, units[unit]);
                                const centerTime = startTime.clone().add(d);
                                const endTime = centerTime.clone().add(d);
                                setFilter({
                                    centerTime: centerTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                    startTime: startTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                    endTime: endTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                    windowSize: window * 2,
                                    halfWindowSize: window,
                                    timeWindowUnits: unit

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
                        <DatePicker<ITimeFilter> Record={filter} Field="endTime" Help={`All times are in system time. System time is currently set to ${props.timeZone}. `}
                            Setter={(r) => {
                                const endTime = getMoment(r.endTime);
                                let window = filter.halfWindowSize;
                                let unit = filter.timeWindowUnits;
                                if (props.dateTimeSetting === 'startEnd') {
                                    [unit, window] = findAppropriateUnit(getMoment(filter.startTime), endTime, undefined, true);
                                }
                                const d = moment.duration(window, units[unit]);
                                const centerTime = endTime.clone().subtract(d);
                                const startTime = centerTime.clone().subtract(d);
                                setFilter({
                                    centerTime: centerTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                    startTime: startTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                    endTime: endTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                    windowSize: window * 2,
                                    halfWindowSize: window,
                                    timeWindowUnits: unit

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
                            <Input<ITimeFilter> Record={filter} Field='halfWindowSize' Setter={(r) => {
                                const centerTime = getMoment(filter.centerTime);
                                const [startTime, endTime] = getStartEndTime(centerTime, r.halfWindowSize, units[filter.timeWindowUnits]);

                                setFilter(prevFilter => ({
                                    ...prevFilter,
                                    windowSize: r.windowSize,
                                    halfWindowSize: r.halfWindowSize,
                                    startTime: startTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                    endTime: endTime.format(momentDateFormat + ' ' + momentTimeFormat)
                                }));
                                setActiveQP(-1);
                            }} Label='' Valid={() => true}
                                Type='number' />
                        </div>
                        <div className={props.isHorizontal ? (props.showQuickSelect? 'col-2': 'col-3'): 'col-6'}>
                            <Select<ITimeFilter> Record={filter} Label=''
                                Field='timeWindowUnits'
                                Setter={(r) => {
                                    const centerTime = getMoment(filter.centerTime);
                                    const [startTime, endTime] = getStartEndTime(centerTime, filter.halfWindowSize, units[r.timeWindowUnits]);
                                    setFilter(prevFilter => ({
                                        ...prevFilter,
                                        timeWindowUnits: r.timeWindowUnits,
                                        startTime: startTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                        endTime: endTime.format(momentDateFormat + ' ' + momentTimeFormat)
                                    }));
                                    setActiveQP(-1);
                                }}

                                // use TimeUnits function
                                Options={
                                    units.map((unit) => ({
                                        Value: unit.toString(),
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
                            <Input<ITimeFilter> Record={filter} Field='windowSize' Setter={(r) => {
                                const startTime = getMoment(filter.startTime);
                                const d = moment.duration(r.halfWindowSize, units[filter.timeWindowUnits]);
                                const centerTime = startTime.clone().add(d);
                                const endTime = centerTime.clone().add(d);
                                setFilter(prevFilter => ({
                                    ...prevFilter,
                                    windowSize: r.windowSize,
                                    halfWindowSize: r.halfWindowSize,
                                    centerTime: centerTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                    endTime: endTime.format(momentDateFormat + ' ' + momentTimeFormat)
                                }));
                                setActiveQP(-1);
                            }} Label='' Valid={() => true}
                                Type='number' />
                        </div>
                        <div className={props.isHorizontal ? (props.showQuickSelect? 'col-2': 'col-3'): 'col-6'}>
                            <Select<ITimeFilter> Record={filter} Label=''
                                Field='timeWindowUnits'
                                Setter={(r) => {
                                    const startTime = getMoment(filter.startTime);
                                    const d = moment.duration(filter.halfWindowSize, units[r.timeWindowUnits]);
                                    const centerTime = startTime.clone().add(d);
                                    const endTime = centerTime.clone().add(d);
                                    setFilter(prevFilter => ({
                                        ...prevFilter,
                                        timeWindowUnits: r.timeWindowUnits,
                                        centerTime: centerTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                        endTime: endTime.format(momentDateFormat + ' ' + momentTimeFormat)
                                    }));
                                    setActiveQP(-1);
                                }}
                                Options={
                                    units.map((unit) => ({
                                        Value: unit.toString(),
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
                            <Input<ITimeFilter> Record={filter} Field='windowSize' Setter={(r) => {
                                const endTime = getMoment(filter.endTime);
                                const d = moment.duration(r.halfWindowSize, units[filter.timeWindowUnits]);
                                const centerTime = endTime.clone().subtract(d);
                                const startTime = centerTime.clone().subtract(d);
                                setFilter(prevFilter => ({
                                    ...prevFilter,
                                    windowSize: r.windowSize,
                                    halfWindowSize: r.halfWindowSize,
                                    centerTime: centerTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                    startTime: startTime.format(momentDateFormat + ' ' + momentTimeFormat)
                                }));
                                setActiveQP(-1);
                            }} Label='' Valid={() => true}
                                Type='number' />
                        </div>
                        <div className={props.isHorizontal ? (props.showQuickSelect? 'col-2': 'col-3'): 'col-6'}>
                            <Select<ITimeFilter> Record={filter} Label=''
                                Field='timeWindowUnits'
                                Setter={(r) => {
                                    const endTime = getMoment(filter.endTime);
                                    const d = moment.duration(filter.halfWindowSize, units[r.timeWindowUnits]);
                                    const centerTime = endTime.clone().subtract(d);
                                    const startTime = centerTime.clone().subtract(d);
                                    setFilter(prevFilter => ({
                                        ...prevFilter,
                                        timeWindowUnits: r.timeWindowUnits,
                                        centerTime: centerTime.format(momentDateFormat + ' ' + momentTimeFormat),
                                        startTime: startTime.format(momentDateFormat + ' ' + momentTimeFormat)
                                    }));
                                    setActiveQP(-1);
                                }}
                                Options={
                                    units.map((unit) => ({
                                        Value: unit.toString(),
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
                                                props.setFilter(AvailableQuickSelects[i].createFilter(props.timeZone));
                                                setActiveQP(i);
                                            }}
                                            className={"item badge badge-" + (i == activeQP ? "primary" : "secondary")}>{AvailableQuickSelects[i].label}
                                        </li>
                                        {i + 1 < AvailableQuickSelects.length ?
                                            <li key={i + 1} style={{ marginTop: 3, cursor: 'pointer' }}
                                                className={"item badge badge-" + (i + 1 == activeQP ? "primary" : "secondary")}
                                                onClick={() => {
                                                    props.setFilter(AvailableQuickSelects[i + 1].createFilter(props.timeZone));
                                                    setActiveQP(i + 1)
                                                }}>
                                                {AvailableQuickSelects[i + 1].label}
                                            </li> : null}
                                        {i + 2 < AvailableQuickSelects.length ?
                                            <li key={i + 2}
                                                style={{ marginTop: 3, cursor: 'pointer' }}
                                                className={"item badge badge-" + (i + 2 == activeQP ? "primary" : "secondary")}
                                                onClick={() => {
                                                    props.setFilter(AvailableQuickSelects[i + 2].createFilter(props.timeZone));
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