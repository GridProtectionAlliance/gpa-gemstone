// ******************************************************************************************************
//  Clock.tsx - Gbtc
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
//  05/15/2023 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import * as moment from 'moment';
import { IsInteger } from '@gpa-gemstone/helper-functions'
import { Gemstone } from '@gpa-gemstone/application-typings';

interface IProps {
    DateTime: moment.Moment| undefined,
    Setter: (record: moment.Moment) => void,
    Accuracy?: Gemstone.TSX.Types.Accuracy
}

type Parameter = ('h' | 'm' | 's' | 'ms');

export default function Clock(props: IProps) {
    const [hour, setHour] = React.useState<string>(props.DateTime?.format("HH") ?? '00');
    const [minute, setMinute] = React.useState<string>(props.DateTime?.format("mm") ?? '00');
    const [second, setSecond] = React.useState<string>(props.DateTime?.format("ss") ?? '00');
    const [millisecond, setMilliSecond] = React.useState<string>(props.DateTime?.format("SSS") ?? '000');
    const [hover, setHover] = React.useState<'increase_ms' | 'increase_s' | 'increase_m' | 'increase_h' | 'decrease_ms' | 'decrease_s' | 'decrease_m' | 'decrease_h' | 'none'>('none');

    React.useEffect(() => {
        setHour(props.DateTime?.format("HH") ?? '00');
        setMinute(props.DateTime?.format("mm") ?? '00')
        setSecond(props.DateTime?.format("ss") ?? '00')
        setMilliSecond(props.DateTime?.format("SSS") ?? '000')
    }, [props.DateTime])

    React.useEffect(() => {
        const h = parseInt(hour, 10);
        const m = parseInt(minute, 10);
        const s = parseInt(second, 10);
        const ms = parseInt(millisecond, 10)

        if (isNaN(h) || isNaN(m) || isNaN(s) || isNaN(ms))
            return;

        if (h !== props.DateTime?.hour() || m !== props.DateTime?.minute() || s !== props.DateTime?.second() || ms !== props.DateTime?.millisecond()) {
            let d = moment(props.DateTime);
            if (!d.isValid())
                d = moment.utc().startOf('d');
            d.hour(h).minute(m).second(s).millisecond(ms);
            props.Setter(d);
        }

    }, [hour, minute, second, millisecond])

    function increase(type: Parameter) {
        const d = moment(props.DateTime).add(1, type);
        if (type === 'h')
            setHour(d.format("HH"));
        if (type === 'm')
            setMinute(d.format("mm"));
        if (type === 's')
            setSecond(d.format("ss"))
        if (type === 'ms')
            setMilliSecond(d.format("SSS"))
    }

    function decrease(type: Parameter) {
        const d = moment(props.DateTime).subtract(1, type);
        if (type === 'h')
            setHour(d.format("HH"));
        if (type === 'm')
            setMinute(d.format("mm"));
        if (type === 's')
            setSecond(d.format("ss"))
        if (type === 'ms')
            setMilliSecond(d.format("SSS"))
    }

    return (
        <div style={{ background: '#f0f0f0', marginTop: 10, opacity: 1 }}>
            <table style={{ textAlign: 'center' }}>
                <tbody>
                    <tr style={{ height: 20, lineHeight: '20px' }}>
                        {/* Hour */}
                        <td
                            style={{ width: 52, padding: 5, cursor: 'pointer', background: (hover === 'increase_h' ? '#d3d3d3' : undefined) }}
                            onClick={() => increase('h')}
                            onMouseEnter={() => setHover('increase_h')}
                            onMouseLeave={() => setHover('none')}
                        > ^ </td>
                        {/* Minute */}
                        <td style={{ width: 20, padding: 5 }}></td>
                        <td
                            style={{ width: 52, padding: 5, cursor: 'pointer', background: (hover === 'increase_m' ? '#d3d3d3' : undefined) }}
                            onClick={() => increase('m')}
                            onMouseEnter={() => setHover('increase_m')}
                            onMouseLeave={() => setHover('none')}
                        > ^ </td>
                        {/* Second */}
                        {(props.Accuracy === 'second' || props.Accuracy === 'millisecond') && (
                            <>
                                <td style={{ width: 20, padding: 5, }}></td>
                                <td
                                    style={{ width: 52, padding: 5, cursor: 'pointer', background: (hover === 'increase_s' ? '#d3d3d3' : undefined) }}
                                    onClick={() => increase('s')}
                                    onMouseEnter={() => setHover('increase_s')}
                                    onMouseLeave={() => setHover('none')}
                                > ^ </td>
                            </>
                        )}
                        {/* Millisecond */}
                        {props.Accuracy === 'millisecond' && (
                            <>
                                <td style={{ width: 20, padding: 5 }}></td>
                                <td
                                    style={{ width: 52, padding: 5, cursor: 'pointer', background: (hover === 'increase_ms' ? '#d3d3d3' : undefined) }}
                                    onClick={() => increase('ms')}
                                    onMouseEnter={() => setHover('increase_ms')}
                                    onMouseLeave={() => setHover('none')}
                                > ^ </td>
                            </>
                        )}
                    </tr>
                    <tr style={{ height: 20, lineHeight: '20px' }}>
                        {/* Hour */}
                        <td style={{ width: 52, padding: 5, }}> <TimeInput value={hour} setValue={setHour} max={23} /> </td>
                        {/* Minute */}
                        <td style={{ width: 20, padding: 5, }}> : </td>
                        <td style={{ width: 52, padding: 5, }}> <TimeInput value={minute} setValue={setMinute} max={59} /> </td>
                        {/* Second */}
                        {(props.Accuracy === 'second' || props.Accuracy === 'millisecond') && (
                            <>
                                <td style={{ width: 20, padding: 5, }}> : </td>
                                <td style={{ width: 52, padding: 5, }}> <TimeInput value={second} setValue={setSecond} max={59} /> </td>
                            </>
                        )}
                        {/* Millisecond */}
                        {props.Accuracy === 'millisecond' && (
                            <>
                                <td style={{ width: 20, padding: 5, }}> : </td>
                                <td style={{ width: 52, padding: 5, }}> <TimeInput value={millisecond} setValue={setMilliSecond} max={999} /> </td>
                            </>
                        )}
                    </tr>
                    <tr style={{ height: 20, lineHeight: '20px' }}>
                        {/* Hour */}
                        <td
                            style={{ width: 52, padding: 5, cursor: 'pointer', background: (hover === 'decrease_h' ? '#d3d3d3' : undefined) }}
                            onClick={() => decrease('h')}
                            onMouseEnter={() => setHover('decrease_h')}
                            onMouseLeave={() => setHover('none')}
                        > v </td>
                        {/* Minute */}
                        <td style={{ width: 20, padding: 5, }}></td>
                        <td
                            style={{ width: 52, padding: 5, cursor: 'pointer', background: (hover === 'decrease_m' ? '#d3d3d3' : undefined) }}
                            onClick={() => decrease('m')}
                            onMouseEnter={() => setHover('decrease_m')}
                            onMouseLeave={() => setHover('none')}
                        > v </td>
                        {/* Second */}
                        {(props.Accuracy === 'second' || props.Accuracy === 'millisecond') && (
                            <>
                                <td style={{ width: 20, padding: 5, }}></td>
                                <td
                                    style={{ width: 52, padding: 5, cursor: 'pointer', background: (hover === 'decrease_s' ? '#d3d3d3' : undefined) }}
                                    onClick={() => decrease('s')}
                                    onMouseEnter={() => setHover('decrease_s')}
                                    onMouseLeave={() => setHover('none')}
                                > v </td>
                            </>
                        )}
                        {/* Millisecond */}
                        {props.Accuracy === 'millisecond' && (
                            <>
                                <td style={{ width: 20, padding: 5, }}></td>
                                <td
                                    style={{ width: 52, padding: 5, cursor: 'pointer', background: (hover === 'decrease_ms' ? '#d3d3d3' : undefined) }}
                                    onClick={() => decrease('ms')}
                                    onMouseEnter={() => setHover('decrease_ms')}
                                    onMouseLeave={() => setHover('none')}
                                > v </td>
                            </>
                        )}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

const TimeInput = (props: { value: string, setValue: (v: string) => void, max: number }) => {
    const [val, setVal] = React.useState<string>(props.value.toString());
    const [error, setError] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (props.value.length > 5) {
            setVal("");
            return;
        }
        setVal(props.value.toString());
    }, [props.value])


    React.useEffect(() => {
        if (!IsInteger(val))
            return;
        const v = parseInt(val, 10)
        if (v > props.max || v < 0) {
            setError(true);
            return;
        }
        setError(false);
        props.setValue(val)
    }, [val, error])

    return <div className={"form-group form-group-sm"} style={{ width: 52 }}>
        <input
            type={"text"}
            className={!error ? 'form-control' : 'form-control is-invalid'}
            onChange={(evt) => {
                if (IsInteger(evt.target.value))
                    setVal(evt.target.value)
            }}
            value={val}
        />
    </div>


}


