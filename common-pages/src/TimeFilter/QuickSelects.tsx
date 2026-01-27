//******************************************************************************************************
//  QuickSelects.tsx - Gbtc
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
//       Moved QuickSelects from TimeFilter to new file
//******************************************************************************************************

import * as React from 'react';
import { getTimeWindowFromFilter, DateTimeSetting, ITimeFilter } from './TimeFilter';
import moment from 'moment';
import momentTZ from 'moment-timezone';
import { Gemstone } from '@gpa-gemstone/application-typings'
import { TimeUnit } from './TimeWindowUtils';

interface IQuickSelect {
    label: string,
    hideQuickPick: (quickSelectRange?: Gemstone.TSX.Types.QuickSelectRange) => boolean,
    createFilter: (timeZone: string, format?: Gemstone.TSX.Types.DateUnit) => ITimeFilter,
}

interface IProps {
    DateTimeSetting: DateTimeSetting,
    Format?: "YYYY-MM-DD" | "HH:mm:ss.SSS" | "MM/DD/YYYY HH:mm:ss.SSS",
    DateUnit?: Gemstone.TSX.Types.DateUnit,
    QuickSelectRange?: Gemstone.TSX.Types.QuickSelectRange
    Timezone: string,
    ActiveQP: number,
    SetActiveQP: (qp: number) => void,
    SetFilter: (start: string, end: string, unit: TimeUnit, duration: number) => void,
    AddRowContainer?: boolean,
    SplitSelects?: boolean,
}

const QuickSelects = (props: IProps) => {
    const CurrentQuickSelects = React.useMemo(() => AvailableQuickSelects.filter(qs => !qs.hideQuickPick(props.QuickSelectRange ?? getQuickSelectRange(props.DateUnit))), [props.QuickSelectRange, props.DateUnit]);

    return (
        <Container AddRow={props.AddRowContainer ?? true}>
            {CurrentQuickSelects.map((qs, i) => {

                if (i % 3 !== 0)
                    return null;

                return (
                    <div
                        key={i}
                        className={getColSize(props.DateTimeSetting, props.SplitSelects ?? false)}
                        style={{
                            paddingLeft: (props.DateTimeSetting === 'startEnd' ? 0 : (i % 9 == 0 ? 15 : 0)),
                            paddingRight: (props.DateTimeSetting === 'startEnd' ? 2 : ((i % 18 == 6 || i % 18 == 15) ? 15 : 2)),
                            marginTop: 10
                        }}
                    >
                        <ul className="list-group" key={i}>
                            <li
                                key={i}
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    const flt = getTimeWindowFromFilter(CurrentQuickSelects[i].createFilter(props.Timezone, props.DateUnit), props.Format);
                                    props.SetFilter(flt.start, flt.end, flt.unit, flt.duration);
                                    props.SetActiveQP(i);
                                }}
                                className={"item badge badge-" + (i == props.ActiveQP ? "primary" : "secondary")}
                            >
                                {CurrentQuickSelects[i].label}
                            </li>
                            {i + 1 < CurrentQuickSelects.length ?
                                <li
                                    key={i + 1}
                                    style={{ marginTop: 3, cursor: 'pointer' }}
                                    className={"item badge badge-" + (i + 1 == props.ActiveQP ? "primary" : "secondary")}
                                    onClick={() => {
                                        const flt = getTimeWindowFromFilter(CurrentQuickSelects[i + 1].createFilter(props.Timezone, props.DateUnit), props.Format);
                                        props.SetFilter(flt.start, flt.end, flt.unit, flt.duration);
                                        props.SetActiveQP(i + 1)
                                    }}
                                >
                                    {CurrentQuickSelects[i + 1].label}
                                </li>
                                : null}
                            {i + 2 < CurrentQuickSelects.length ?
                                <li
                                    key={i + 2}
                                    style={{ marginTop: 3, cursor: 'pointer' }}
                                    className={"item badge badge-" + (i + 2 == props.ActiveQP ? "primary" : "secondary")}
                                    onClick={() => {
                                        const flt = getTimeWindowFromFilter(CurrentQuickSelects[i + 2].createFilter(props.Timezone, props.DateUnit), props.Format);
                                        props.SetFilter(flt.start, flt.end, flt.unit, flt.duration);
                                        props.SetActiveQP(i + 2);
                                    }}
                                >
                                    {CurrentQuickSelects[i + 2].label}
                                </li>
                                : null}
                        </ul>
                    </div>
                )
            })}
        </Container>
    )
}

export default QuickSelects;

export function getFormat(format?: Gemstone.TSX.Types.DateUnit) {
    if (format == 'date')
        return 'YYYY-MM-DD'
    else if (format == "time")
        return 'HH:mm:ss.SSS'
    else
        return 'MM/DD/YYYY HH:mm:ss.SSS'
}

export function getQuickSelectRange(dateUnit?: Gemstone.TSX.Types.DateUnit) {
    if (dateUnit === 'datetime-local')
        return 'full'
    if (dateUnit === 'time')
        return 'medium'
    if (dateUnit === 'date')
        return 'long'
}

const getColSize = (dateTimeSetting: DateTimeSetting, splitSelects: boolean) => {
    if (dateTimeSetting === 'startEnd') {
        if (splitSelects)
            return 'col-4'
        else
            return 'col-2'
    }

    if (splitSelects)
        return 'col-8'
    else
        return 'col-4'
}

//update all quick selects to use new timefilters
export const AvailableQuickSelects: IQuickSelect[] = [
    {
        label: '1/2 cycle', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().subtract(cyclesToSeconds(1/2), 'second').format('YYYY-MM--DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'second');
            return {
                end: t.format(getFormat(format)),
                unit: 's',
                duration: cyclesToSeconds(1/2),
            }
        },
        hideQuickPick: (f) => {
            return f !== 'cycles'
        }
    },
    {
        label: '1 cycle', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().subtract(cyclesToSeconds(1), 'second').format('YYYY-MM--DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'second');
            return {
                end: t.format(getFormat(format)),
                unit: 's',
                duration: cyclesToSeconds(1),
            }
        },
        hideQuickPick: (f) => {
            return f !== 'cycles'
        }
    },
    {
        label: '2 cycles', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().subtract(cyclesToSeconds(2), 'second').format('YYYY-MM--DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'second');
            return {
                end: t.format(getFormat(format)),
                unit: 's',
                duration: cyclesToSeconds(2),
            }
        },
        hideQuickPick: (f) => {
            return f !== 'cycles'
        }
    },
    {
        label: '5 cycles', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().subtract(cyclesToSeconds(5), 'second').format('YYYY-MM--DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'second');
            return {
                end: t.format(getFormat(format)),
                unit: 's',
                duration: cyclesToSeconds(5),
            }
        },
        hideQuickPick: (f) => {
            return f !== 'cycles'
        }
    },
    {
        label: '10 cycles', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().subtract(cyclesToSeconds(10), 'second').format('YYYY-MM--DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'second');
            return {
                end: t.format(getFormat(format)),
                unit: 's',
                duration: cyclesToSeconds(10),
            }
        },
        hideQuickPick: (f) => {
            return f !== 'cycles'
        }
    },
    {
        label: '15 cycles', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().subtract(cyclesToSeconds(15), 'second').format('YYYY-MM--DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'second');
            return {
                end: t.format(getFormat(format)),
                unit: 's',
                duration: cyclesToSeconds(15),
            }
        },
        hideQuickPick: (f) => {
            return f !== 'cycles'
        }
    },
    {
        label: '20 cycles', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().subtract(cyclesToSeconds(20), 'second').format('YYYY-MM--DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'second');
            return {
                end: t.format(getFormat(format)),
                unit: 's',
                duration: cyclesToSeconds(20),
            }
        },
        hideQuickPick: (f) => {
            return f !== 'cycles'
        }
    },
    {
        label: '30 cycles', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().subtract(cyclesToSeconds(30), 'second').format('YYYY-MM--DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'second');
            return {
                end: t.format(getFormat(format)),
                unit: 's',
                duration: cyclesToSeconds(30),
            }
        },
        hideQuickPick: (f) => {
            return f !== 'cycles'
        }
    },
    {
        label: '40 cycles', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().subtract(cyclesToSeconds(40), 'second').format('YYYY-MM--DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'second');
            return {
                end: t.format(getFormat(format)),
                unit: 's',
                duration: cyclesToSeconds(40),
            }
        },
        hideQuickPick: (f) => {
            return f !== 'cycles'
        }
    },
    {
        label: 'Last 1 Second', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('second').subtract(1, 'second').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'second').startOf('second');

            return {
                end: t.format(getFormat(format)),
                unit: 's',
                duration: 1,
            }
        },
        hideQuickPick: (f) => {
            return f !== 'short' && f !== 'cycles'
        }
    },
    {
        label: 'Last 2 Seconds', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('second').subtract(2, 'seconds').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'seconds').startOf('second');

            return {
                end: t.format(getFormat(format)),
                unit: 's',
                duration: 52
            }
        },
        hideQuickPick: (f) => {
            return f !== 'cycles'
        }
    },
    {
        label: 'Last 5 Seconds', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('second').subtract(5, 'seconds').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'seconds').startOf('second');

            return {
                end: t.format(getFormat(format)),
                unit: 's',
                duration: 5,
            }
        },
        hideQuickPick: (f) => {
            return f !== 'short' && f !== 'cycles'
        }
    },
    {
        label: 'Last 10 Seconds', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('second').subtract(10, 'seconds').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'seconds').startOf('second');

            return {
                end: t.format(getFormat(format)),
                unit: 's',
                duration: 10,
            }
        },
        hideQuickPick: (f) => {
            return f !== 'short'
        }
    },
    {
        label: 'Last 15 Seconds', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('second').subtract(15, 'seconds').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'seconds').startOf('second');

            return {
                end: t.format(getFormat(format)),
                unit: 's',
                duration: 15,
            }
        },
        hideQuickPick: (f) => {
            return f !== 'short'
        }
    },
    {
        label: 'Last 30 Seconds', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('second').subtract(30, 'seconds').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'seconds').startOf('second');

            return {
                end: t.format(getFormat(format)),
                unit: 's',
                duration: 30,
            }
        },
        hideQuickPick: (f) => {
            return f !== 'short'
        }
    },
    {
        label: 'Last 45 Seconds', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('second').subtract(45, 'seconds').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'seconds').startOf('second');

            return {
                end: t.format(getFormat(format)),
                unit: 's',
                duration: 45,
            }
        },
        hideQuickPick: (f) => {
            return f !== 'short'
        }
    },
    {
        label: 'Last 1 Minute', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('minute').subtract(1, 'minute').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('minute');

            return {
                end: t.format(getFormat(format)),
                unit: 'm',
                duration: 1,
            }
        },
        hideQuickPick: (f) => {
            return f !== 'short'
        }
    },
    {
        label: 'Last 5 Minutes', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('minute').subtract(5, 'minutes').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('minute');

            return {
                end: t.format(getFormat(format)),
                unit: 'm',
                duration: 5,
            }
        },
        hideQuickPick: (f) => {
            return f !== 'short'
        }
    },
    {
        label: 'Last 10 Minutes', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('minute').subtract(10, 'minutes').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('minute');

            return {
                end: t.format(getFormat(format)),
                unit: 'm',
                duration: 10,
            }
        },
        hideQuickPick: (f) => {
            return f !== 'short'
        }
    },
    {
        label: 'Last 15 Minutes', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('minute').subtract(15, 'minutes').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('minute');

            return {
                end: t.format(getFormat(format)),
                unit: 'm',
                duration: 15,
            }
        },
        hideQuickPick: (f) => {
            return f !== 'short'
        }
    },
    {
        label: 'Last 30 Minutes', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('minute').subtract(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('minute');

            return {
                end: t.format(getFormat(format)),
                unit: 'm',
                duration: 30,
            }
        },
        hideQuickPick: (f) => {
            return f !== 'short'
        }
    },
    {
        label: 'Last 45 Minutes', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('minute').subtract(45, 'minutes').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('minute');

            return {
                end: t.format(getFormat(format)),
                unit: 'm',
                duration: 45,
            }
        },
        hideQuickPick: (f) => {
            return f !== 'short'
        }
    },
    {
        label: 'This Hour', createFilter: (tz, format) => {

            const offset = momentTZ.tz(moment.utc().startOf('hour').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('hour');
            return {
                start: t.format(getFormat(format)),
                end: t.add(60, 'm').format(getFormat(format)),
            }
        },
        hideQuickPick: (f) => {
            return f == 'long' || f == 'cycles'
        }
    },
    {
        label: 'Last Hour', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('hour').subtract(1, 'hour').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('hour');
            return {
                end: t.format(getFormat(format)),
                unit: 'm',
                duration: 60,
            }
        },
        hideQuickPick: (f) => {
            return f == 'long' || f == 'cycles'
        }
    },
    {
        label: 'Last 60 Minutes', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('minute').subtract(1, 'hour').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('minute');

            return {
                end: t.format(getFormat(format)),
                unit: 'm',
                duration: 60,
            }
        },
        hideQuickPick: (f) => {
            return f == 'long' || f == 'cycles'
        }
    },
    {
        label: 'Today', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('day');
            return {
                start: t.format(getFormat(format)),
                unit: 'h',
                duration: 24,
            }
        },
        hideQuickPick: (f) => {
            return f == 'medium' || f == 'cycles'
        }
    },
    {
        label: 'Yesterday', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('day');
            return {
                end: t.format(getFormat(format)),
                unit: 'h',
                duration: 24,
            }
        },
        hideQuickPick: (f) => {
            return f == 'medium' || f == 'cycles'
        }
    },
    {
        label: 'Last 24 Hours', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('hour').subtract(24, 'hours').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes');
            return {
                end: t.format(getFormat(format)),
                unit: 'h',
                duration: 24,
            }
        },
        hideQuickPick: (f) => {
            return f == 'long' || f == 'medium' || f == 'cycles'
        }
    },
    {
        label: 'This Week', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('week').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('week');
            return {
                start: t.format(getFormat(format)),
                unit: 'd',
                duration: 7
            }
        },
        hideQuickPick: (f) => {
            return f == 'medium' || f == 'short' || f == 'cycles'
        }
    },
    {
        label: 'Last Week', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('week').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('week');
            return {
                end: t.format(getFormat(format)),
                unit: 'd',
                duration: 7
            }
        },
        hideQuickPick: (f) => {
            return f == 'medium' || f == 'short' || f == 'cycles'
        }
    },
    {
        label: 'Last 7 Days', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('day');
            return {
                end: t.format(getFormat(format)),
                unit: 'd',
                duration: 7
            }
        },
        hideQuickPick: (f) => {
            return f == 'medium' || f == 'short' || f == 'cycles'
        }
    },
    {
        label: 'This Month', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('month').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('month');
            return {
                start: t.format(getFormat(format)),
                unit: 'd',
                duration: t.daysInMonth()
            }
        },
        hideQuickPick: (f) => {
            return f == 'medium' || f == 'short' || f == 'cycles'
        }
    },
    {
        label: 'Last Month', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('month').subtract(1, 'month').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('month').subtract(1, 'month');
            return {
                start: t.format(getFormat(format)),
                unit: 'd',
                duration: t.daysInMonth()
            }
        },
        hideQuickPick: (f) => {
            return f == 'medium' || f == 'short' || f == 'cycles'
        }
    },
    {
        label: 'Last 30 Days', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('day');
            return {
                end: t.format(getFormat(format)),
                unit: 'd',
                duration: 30,
            }
        },
        hideQuickPick: (f) => {
            return f == 'medium' || f == 'short' || f == 'cycles'
        }
    },
    {
        label: 'This Quarter', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('quarter').add(1, 'quarter').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const offset_tend = momentTZ.tz(moment.utc().startOf('quarter').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('quarter');
            const tend = moment.utc().add(offset_tend, 'minutes').startOf('quarter');
            tend.add(1, 'quarter')
            const h = moment.duration(tend.diff(t)).asDays();

            return {
                start: t.format(getFormat(format)),
                unit: 'd',
                duration: h,
            }
        },
        hideQuickPick: (f) => {
            return f == 'medium' || f == 'short' || f == 'cycles'
        }
    },
    {
        label: 'Last Quarter', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('quarter').subtract(1, 'quarter').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const offset_tend = momentTZ.tz(moment.utc().startOf('quarter').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('quarter');
            const tend = moment.utc().add(offset_tend, 'minutes').startOf('quarter');
            t.subtract(1, 'quarter');
            const h = moment.duration(tend.diff(t)).asDays();

            return {
                start: t.format(getFormat(format)),
                unit: 'd',
                duration: h,
            }
        },
        hideQuickPick: (f) => {
            return f == 'medium' || f == 'short' || f == 'cycles'
        }
    },
    {
        label: 'Last 90 Days', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').subtract(45, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('day');
            return {
                end: t.format(getFormat(format)),
                unit: 'd',
                duration: 90,
            }
        },
        hideQuickPick: (f) => {
            return f == 'medium' || f == 'short' || f == 'cycles'
        }
    },
    {
        label: 'This Year', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('year').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('year');
            return {
                start: t.format(getFormat(format)),
                unit: 'M',
                duration: 12
            }
        },
        hideQuickPick: (f) => {
            return f == 'medium' || f == 'short' || f == 'cycles'
        }
    },
    {
        label: 'Last Year', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('year').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('year');
            return {
                end: t.format(getFormat(format)),
                unit: 'M',
                duration: 12
            }
        },
        hideQuickPick: (f) => {
            return f == 'medium' || f == 'short' || f == 'cycles'
        }
    },
    {
        label: 'Last 365 Days', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').subtract(182.5, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minute').startOf('day');
            return {
                end: t.format(getFormat(format)),
                unit: 'd',
                duration: 365,
            }
        },
        hideQuickPick: (f) => {
            return f == 'medium' || f == 'short' || f == 'cycles'
        }
    }
]

interface IContainerProps {
    AddRow: boolean,
}

const Container = (props: React.PropsWithChildren<IContainerProps>) => {
    if (props.AddRow)
        return <div className='row m-0 align-items-center justify-content-center'>{props.children}</div>
    else
        return <>{props.children}</>
}

const cyclesToSeconds = (cycle: number) => {
    return cycle / 60;
}