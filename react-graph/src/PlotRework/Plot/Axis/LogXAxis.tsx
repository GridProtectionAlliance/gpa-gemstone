//******************************************************************************************************
//  TimeXAxis.tsx - Gbtc
//
//  Copyright (c) 2026, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA may license this file to you under the MIT License (MIT), the "License"; you may not use this
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
//  02/17/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import moment from 'moment';
import { Portal } from 'react-portal';
import { PortalIds, useLayoutContext, GetPortalID } from '../LayoutContext';
import { XViewportContext, IXViewportContext, IXDataSeries } from '../ViewportContext/XViewportContext';
import { useViewportRegistryContext } from '../ViewportContext/ViewportRegistryContext';
import { GetTextHeight, GetTextWidth } from '@gpa-gemstone/helper-functions';

export interface ITimeXAxisProps {
    /** Fixed domain [min, max] in ms since epoch. If omitted, auto-scales to fit registered data. */
    MinDomain?: number;
    MaxDomain?: number;
    /** Axis label. If empty string, auto-generates from visible range. If undefined, hidden. */
    Label?: string;
    /** Whether to show vertical grid lines for each tick. Default: false. */
    ShowGrid?: boolean;
    /** When true, shows a date context string at the right edge of the axis (e.g. "MM/DD HH:mm"). Default: false. */
    ShowDate?: boolean;
    /** When true, displays the hovered X value as a label on the axis. Default: false. */
    HighlightHover?: boolean;
}

const DEFAULT_DOMAIN: [number, number] = [0, 1];

// Time constants (ms)
const MS_PER_SECOND = 1_000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;
const MS_PER_YEAR = MS_PER_DAY * 365;

type TimeStep = 'y' | 'M' | 'w' | 'd' | 'h' | 'm' | 's' | 'ms';
type TickFormat = 'SSS' | 'ss.SS' | 'ss' | 'mm:ss' | 'mm' | 'HH:mm' | 'HH' | 'DD HH' | 'MM/DD' | 'MM YY' | 'YYYY';

const TimeXAxis = (props: React.PropsWithChildren<ITimeXAxisProps>) => {
    const { MinDomain: propMinDomain, MaxDomain: propMaxDomain, Label, ShowGrid = false, ShowDate = false, HighlightHover = false, children } = props;

    const isAuto = propMinDomain == null || propMaxDomain == null;

    const { DataArea, PlotID } = useLayoutContext();
    const registry = useViewportRegistryContext();

    const [minDomain, setMinDomain] = React.useState<number>(propMinDomain ?? DEFAULT_DOMAIN[0]);
    const [maxDomain, setMaxDomain] = React.useState<number>(propMaxDomain ?? DEFAULT_DOMAIN[1]);

    const [minAutoDomain, setMinAutoDomain] = React.useState<number>(DEFAULT_DOMAIN[0]);
    const [maxAutoDomain, setMaxAutoDomain] = React.useState<number>(DEFAULT_DOMAIN[1]);

    const registeredData = React.useRef<Map<string, IXDataSeries>>(new Map());
    const [dataRevision, setDataRevision] = React.useState<number>(0);
    // Hover state lives in a ref to avoid invalidating the context value on every
    // mousemove. Interested components subscribe via SubscribeToHover instead.
    const hoverValueRef = React.useRef<number | null>(null);
    const hoverSubscribers = React.useRef<Set<(v: number | null) => void>>(new Set());

    const getHoverValue = React.useCallback(() => hoverValueRef.current, []);

    const registerHover = React.useCallback((cb: (v: number | null) => void) => {
        hoverSubscribers.current.add(cb);
        return () => { hoverSubscribers.current.delete(cb); };
    }, []);

    const setHoverValue = React.useCallback((v: number | null) => {
        hoverValueRef.current = v;
        hoverSubscribers.current.forEach(cb => cb(v));
    }, []);

    const registrationId = React.useRef<string | null>(null);

    // Sync domain when prop changes (manual mode)
    React.useEffect(() => {
        if (propMinDomain != null && propMaxDomain != null) {
            setMinDomain(propMinDomain);
            setMaxDomain(propMaxDomain);
        }
    }, [propMinDomain, propMaxDomain]);

    // Auto-scale from registered data
    React.useEffect(() => {
        if (!isAuto) return;

        let min = Number.MAX_VALUE;
        let max = -Number.MAX_VALUE;

        registeredData.current.forEach((series) => {
            if (!series.Enabled) return;
            const seriesMin = series.GetMin();
            const seriesMax = series.GetMax();
            if (seriesMin != null && isFinite(seriesMin)) min = Math.min(min, seriesMin);
            if (seriesMax != null && isFinite(seriesMax)) max = Math.max(max, seriesMax);
        });

        if (min >= max) {
            setMinAutoDomain(DEFAULT_DOMAIN[0]);
            setMaxAutoDomain(DEFAULT_DOMAIN[1]);
            setMinDomain(DEFAULT_DOMAIN[0]);
            setMaxDomain(DEFAULT_DOMAIN[1]);
            return;
        }

        setMinAutoDomain(min);
        setMaxAutoDomain(max);
        setMinDomain(min);
        setMaxDomain(max);
    }, [isAuto, dataRevision]);

    // Compute ticks and format from domain, accounting for available width
    const { ticks, config } = React.useMemo(() => computeTimeTicks([minDomain, maxDomain], DataArea.Width), [minDomain, maxDomain, DataArea.Width]);

    // Build title string
    const title = React.useMemo(() => {
        if (Label === undefined) return undefined;

        const unit = config.unitLabel;
        if (Label !== '') return `${Label} ${unit}`;

        // Auto-generate: use titleFormat on first tick (or domain start) for date context
        const refTime = ticks.length > 0 ? ticks[0] : minDomain;
        const dateContext = config.titleFormat !== '' ? formatTick(refTime, config.titleFormat) : 'Time';
        return `${dateContext} ${unit}`;
    }, [Label, config, ticks, minDomain]);

    // Transforms
    const xTransform = React.useCallback((x: number): number => {
        const range = maxDomain - minDomain;
        if (range === 0) return 0;
        return ((x - minDomain) / range) * DataArea.Width;
    }, [minDomain, maxDomain, DataArea.Width]);

    const inverseXTransform = React.useCallback((px: number): number => {
        const range = maxDomain - minDomain;
        if (DataArea.Width === 0) return minDomain;
        return (px / DataArea.Width) * range + minDomain;
    }, [minDomain, maxDomain, DataArea.Width]);

    // Local hover label for axis display -- only this component re-renders
    const [hoverLabel, setHoverLabel] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!HighlightHover) return;
        return registerHover((v) => {
            setHoverLabel(v != null ? moment.utc(v).format('MM/DD/YY hh:mm:ss.SSS') : null);
        });
    }, [HighlightHover, registerHover]);

    // Label height for positioning
    const titleHeight = React.useMemo(() => title != null ? GetTextHeight('Segoe UI', '1em', title) : 0, [title]);

    // Data registration refs
    const registerData = React.useRef((id: string, data: IXDataSeries) => {
        registeredData.current.set(id, data);
        setDataRevision((r) => r + 1);
    });

    const removeData = React.useRef((id: string) => {
        registeredData.current.delete(id);
        setDataRevision((r) => r + 1);
    });

    const resetDomain = React.useCallback(() => {
        const initialMin = isAuto ? minAutoDomain : (propMinDomain ?? DEFAULT_DOMAIN[0]);
        const initialMax = isAuto ? maxAutoDomain : (propMaxDomain ?? DEFAULT_DOMAIN[1]);
        setMinDomain(initialMin);
        setMaxDomain(initialMax);
    }, [isAuto, minAutoDomain, maxAutoDomain, propMinDomain, propMaxDomain]);

    // Single context value -- hoverValue is intentionally excluded so mousemove
    // does not invalidate the context and cascade re-renders to data components.
    const contextValue: IXViewportContext = React.useMemo(() => ({
        MinDomain: minDomain,
        MaxDomain: maxDomain,
        SetMinDomain: setMinDomain,
        SetMaxDomain: setMaxDomain,
        XTransform: xTransform,
        InverseXTransform: inverseXTransform,
        GetHoverValue: getHoverValue,
        RegisterHover: registerHover,
        RegisterData: registerData,
        UnregisterData: removeData,
        Reset: resetDomain,
        SetHoverValue: setHoverValue,
    }), [minDomain, maxDomain, xTransform, inverseXTransform, getHoverValue, registerHover, setHoverValue, resetDomain]);

    // Register context value with viewport registry
    React.useEffect(() => {
        if (registrationId.current != null)
            registry.UnregisterXViewport(registrationId.current);

        registrationId.current = registry.RegisterXViewport(contextValue);

        return () => {
            if (registrationId.current != null) {
                registry.UnregisterXViewport(registrationId.current);
                registrationId.current = null;
            }
        };
    }, [contextValue, registry]);

    return (
        <XViewportContext.Provider value={contextValue}>
            <Portal node={document.getElementById(GetPortalID(PlotID, PortalIds.BOTTOM_AXIS))}>
                <g>
                    {/* Main axis line */}
                    <path stroke="currentColor" strokeWidth={1} d={`M 0 0 H ${DataArea.Width}`} />

                    {/* Ticks and labels */}
                    {ticks.map((t, i) => {
                        const x = xTransform(t);
                        return (
                            <g key={i}>
                                <path stroke="currentColor" strokeWidth={1} d={`M ${x} 0 v 6`} />
                                <text
                                    fill="currentColor"
                                    fontSize="1em"
                                    textAnchor="middle"
                                    dominantBaseline="hanging"
                                    x={x}
                                    y={8}
                                >
                                    {formatTick(t, config.format)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Axis title */}
                    {title != null && (
                        <text
                            fill="currentColor"
                            fontSize="1em"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            x={DataArea.Width / 2}
                            y={28 + titleHeight / 2}
                        >
                            {title}
                        </text>
                    )}

                    {/* Date context at right edge */}
                    {ShowDate && config.dateFormat !== '' && ticks.length > 0 && (
                        <text
                            fill="currentColor"
                            fontSize="1em"
                            textAnchor="end"
                            dominantBaseline="middle"
                            x={DataArea.Width}
                            y={28 + titleHeight / 2}
                        >
                            {formatTick(ticks[0], config.dateFormat)}
                        </text>
                    )}

                    {/* Hover value label */}
                    {hoverLabel != null && (
                        <text
                            fill="currentColor"
                            fontSize="1em"
                            textAnchor="start"
                            dominantBaseline="middle"
                            x={0}
                            y={28 + titleHeight / 2}
                        >
                            {hoverLabel}
                        </text>
                    )}
                </g>
            </Portal>
            {/* Grid lines rendered in data area so they don't affect axis measurement */}
            {ShowGrid ? (
                <Portal node={document.getElementById(GetPortalID(PlotID, PortalIds.DATA))}>
                    <g style={{ pointerEvents: 'none' }}>
                        {ticks.map((t, i) => {
                            const x = xTransform(t);
                            return (
                                <path
                                    key={i}
                                    stroke="currentColor"
                                    strokeOpacity={0.5}
                                    strokeWidth={1}
                                    d={`M ${x} 0 V ${DataArea.Height}`}
                                />
                            );
                        })}
                    </g>
                </Portal>
            ) : null}
            {children}
        </XViewportContext.Provider>
    );
};

//Helper Funcs
interface ITickConfig {
    /** format string used to render each tick label (e.g. 'HH:mm', 'MM/DD') */
    format: TickFormat;
    /** The unit type that ticks step by (e.g. 'h' for hours, 'm' for minutes) */
    stepType: TimeStep;
    /** Number of stepType units between each tick (e.g. step=15 with stepType='m' = one tick every 15 minutes) */
    step: number;
    /** format string for the date context shown in the axis title (e.g. 'MMM Do, YYYY'). Empty string when the tick format already includes enough context. */
    titleFormat: string;
    /** Human-readable unit description appended to the axis label (e.g. '(hour:min)', '(sec)') */
    unitLabel: string;
    /** format string for the date shown at the right edge when ShowDate is enabled. Empty string when not applicable. */
    dateFormat: string;
}

/**
 * Generates aligned tick positions for a given time domain.
 * When availableWidth is provided, promotes to a coarser config if labels would overlap.
 */
const computeTimeTicks = (
    domain: [number, number],
    availableWidth?: number
): { ticks: number[]; config: ITickConfig } => {
    const deltaMs = domain[1] - domain[0];
    if (deltaMs <= 0) return { ticks: [], config: TICK_CONFIGS[0].config };

    const config = getTickConfig(deltaMs, availableWidth);

    const tStart = moment.utc(domain[0]).clone();
    const tEnd = moment.utc(domain[1]);

    alignToStep(tStart, config.stepType, config.step);

    // Advance one step past the floor so the first tick is inside the domain
    tStart.add(config.step, config.stepType);

    const result: number[] = [];
    while (tStart.isBefore(tEnd)) {
        result.push(tStart.valueOf());
        tStart.add(config.step, config.stepType);
    }

    return { ticks: result, config };
};

/** Milliseconds per step unit, used to estimate tick count for a given config. */
const msPerStep = (cfg: ITickConfig): number => {
    const base: Record<TimeStep, number> = {
        ms: 1,
        s: MS_PER_SECOND,
        m: MS_PER_MINUTE,
        h: MS_PER_HOUR,
        d: MS_PER_DAY,
        w: MS_PER_DAY * 7,
        M: MS_PER_DAY * 30,
        y: MS_PER_YEAR,
    };
    return (base[cfg.stepType] ?? MS_PER_DAY) * cfg.step;
};

/** Ordered from finest to coarsest. Each entry's maxDelta is the upper bound where that config is the natural fit. */
const TICK_CONFIGS: { maxDelta: number; config: ITickConfig }[] = [
    { maxDelta: 20, config: { format: 'SSS', stepType: 'ms', step: 1, titleFormat: 'MMM Do, YYYY HH:mm:ss', unitLabel: '(ms)', dateFormat: 'MM/DD HH:mm:ss' } },
    { maxDelta: 100, config: { format: 'SSS', stepType: 'ms', step: 10, titleFormat: 'MMM Do, YYYY HH:mm:ss', unitLabel: '(ms)', dateFormat: 'MM/DD HH:mm:ss' } },
    { maxDelta: 500, config: { format: 'SSS', stepType: 'ms', step: 50, titleFormat: 'MMM Do, YYYY HH:mm:ss', unitLabel: '(ms)', dateFormat: 'MM/DD HH:mm:ss' } },
    { maxDelta: MS_PER_SECOND, config: { format: 'SSS', stepType: 'ms', step: 100, titleFormat: 'MMM Do, YYYY HH:mm:ss', unitLabel: '(ms)', dateFormat: 'MM/DD HH:mm:ss' } },
    { maxDelta: 2 * MS_PER_SECOND, config: { format: 'SSS', stepType: 'ms', step: 250, titleFormat: 'MMM Do, YYYY HH:mm:ss', unitLabel: '(ms)', dateFormat: 'MM/DD HH:mm:ss' } },
    { maxDelta: 5 * MS_PER_SECOND, config: { format: 'SSS', stepType: 'ms', step: 500, titleFormat: 'MMM Do, YYYY HH:mm:ss', unitLabel: '(ms)', dateFormat: 'MM/DD HH:mm:ss' } },
    { maxDelta: 15 * MS_PER_SECOND, config: { format: 'ss', stepType: 's', step: 1, titleFormat: 'MMM Do, YYYY HH:mm', unitLabel: '(sec)', dateFormat: 'MM/DD HH:mm' } },
    { maxDelta: 30 * MS_PER_SECOND, config: { format: 'ss', stepType: 's', step: 2, titleFormat: 'MMM Do, YYYY HH:mm', unitLabel: '(sec)', dateFormat: 'MM/DD HH:mm' } },
    { maxDelta: MS_PER_MINUTE, config: { format: 'ss.SS', stepType: 's', step: 5, titleFormat: 'MMM Do, YYYY HH:mm', unitLabel: '(sec.ms)', dateFormat: 'MM/DD HH:mm' } },
    { maxDelta: 2 * MS_PER_MINUTE, config: { format: 'ss', stepType: 's', step: 15, titleFormat: 'MMM Do, YYYY HH:mm', unitLabel: '(sec)', dateFormat: 'MM/DD HH:mm' } },
    { maxDelta: 5 * MS_PER_MINUTE, config: { format: 'ss', stepType: 's', step: 30, titleFormat: 'MMM Do, YYYY HH:mm', unitLabel: '(sec)', dateFormat: 'MM/DD HH:mm' } },
    { maxDelta: 10 * MS_PER_MINUTE, config: { format: 'mm:ss', stepType: 'm', step: 1, titleFormat: 'MMM Do, YYYY HH', unitLabel: '(min:sec)', dateFormat: 'MM/DD HH' } },
    { maxDelta: 20 * MS_PER_MINUTE, config: { format: 'mm:ss', stepType: 'm', step: 2, titleFormat: 'MMM Do, YYYY HH', unitLabel: '(min:sec)', dateFormat: 'MM/DD HH' } },
    { maxDelta: MS_PER_HOUR, config: { format: 'mm', stepType: 'm', step: 5, titleFormat: 'MMM Do, YYYY HH', unitLabel: '(min)', dateFormat: 'MM/DD HH' } },
    { maxDelta: 3 * MS_PER_HOUR, config: { format: 'mm', stepType: 'm', step: 15, titleFormat: 'MMM Do, YYYY HH', unitLabel: '(min)', dateFormat: 'MM/DD HH' } },
    { maxDelta: 6 * MS_PER_HOUR, config: { format: 'HH:mm', stepType: 'm', step: 30, titleFormat: 'MMM Do, YYYY', unitLabel: '(hour:min)', dateFormat: 'MM/DD' } },
    { maxDelta: 18 * MS_PER_HOUR, config: { format: 'HH:mm', stepType: 'h', step: 1, titleFormat: 'MMM Do, YYYY', unitLabel: '(hour:min)', dateFormat: 'MM/DD' } },
    { maxDelta: 30 * MS_PER_HOUR, config: { format: 'HH', stepType: 'h', step: 3, titleFormat: 'MMM Do, YYYY', unitLabel: '(hour)', dateFormat: 'MM/DD' } },
    { maxDelta: 3 * MS_PER_DAY, config: { format: 'HH', stepType: 'h', step: 6, titleFormat: 'MMM Do, YYYY', unitLabel: '(hour)', dateFormat: 'MM/DD' } },
    { maxDelta: 10 * MS_PER_DAY, config: { format: 'DD HH', stepType: 'h', step: 12, titleFormat: 'MMM YYYY', unitLabel: '(day hour)', dateFormat: 'YY' } },
    { maxDelta: 16 * MS_PER_DAY, config: { format: 'DD HH', stepType: 'd', step: 1, titleFormat: 'MMM YYYY', unitLabel: '(day hour)', dateFormat: 'YY' } },
    { maxDelta: 30 * MS_PER_DAY, config: { format: 'DD HH', stepType: 'd', step: 2, titleFormat: 'MMM YYYY', unitLabel: '(day hour)', dateFormat: 'YY' } },
    { maxDelta: 2 * 30 * MS_PER_DAY, config: { format: 'MM/DD', stepType: 'w', step: 1, titleFormat: 'YYYY', unitLabel: '(month/day)', dateFormat: 'YY' } },
    { maxDelta: 6 * 30 * MS_PER_DAY, config: { format: 'MM/DD', stepType: 'w', step: 2, titleFormat: 'YYYY', unitLabel: '(month/day)', dateFormat: 'YY' } },
    { maxDelta: 1.5 * MS_PER_YEAR, config: { format: 'MM/DD', stepType: 'M', step: 1, titleFormat: 'YYYY', unitLabel: '(month/day)', dateFormat: 'YY' } },
    { maxDelta: 4 * MS_PER_YEAR, config: { format: 'MM YY', stepType: 'M', step: 3, titleFormat: '', unitLabel: '(month year)', dateFormat: '' } },
    { maxDelta: 6 * MS_PER_YEAR, config: { format: 'MM YY', stepType: 'M', step: 6, titleFormat: '', unitLabel: '(month year)', dateFormat: '' } },
    { maxDelta: 15 * MS_PER_YEAR, config: { format: 'MM YY', stepType: 'M', step: 12, titleFormat: '', unitLabel: '(month year)', dateFormat: '' } },
    { maxDelta: 40 * MS_PER_YEAR, config: { format: 'YYYY', stepType: 'y', step: 2, titleFormat: '', unitLabel: '(year)', dateFormat: '' } },
    { maxDelta: 70 * MS_PER_YEAR, config: { format: 'YYYY', stepType: 'y', step: 5, titleFormat: '', unitLabel: '(year)', dateFormat: '' } },
    { maxDelta: Infinity, config: { format: 'YYYY', stepType: 'y', step: 10, titleFormat: '', unitLabel: '(year)', dateFormat: '' } },
];

/**
 * Picks the best tick config for the given time range.
 * Starts with the natural fit based on deltaMs, then walks to coarser configs if the resulting labels would overlap in the available pixel width.
 */
const getTickConfig = (deltaMs: number, availableWidth?: number): ITickConfig => {
    // Find the first config whose maxDelta exceeds the range
    let startIdx = TICK_CONFIGS.findIndex(e => deltaMs < e.maxDelta);
    if (startIdx < 0) startIdx = TICK_CONFIGS.length - 1;

    // Without width info, just return the natural config
    if (availableWidth == null || availableWidth <= 0)
        return TICK_CONFIGS[startIdx].config;

    // Walk from the natural config toward coarser ones until labels fit
    for (let i = startIdx; i < TICK_CONFIGS.length; i++) {
        const cfg = TICK_CONFIGS[i].config;
        const stepMs = msPerStep(cfg);
        const approxTicks = Math.ceil(deltaMs / stepMs);
        const labelWidth = GetTextWidth('Segoe UI', '1em', sampleLabelForFormat(cfg.format));
        const neededWidth = approxTicks * (labelWidth + 10);

        if ((approxTicks <= 10 && neededWidth <= availableWidth) || i === TICK_CONFIGS.length - 1)
            return cfg;
    }

    return TICK_CONFIGS[TICK_CONFIGS.length - 1].config;
};

/** Returns a representative label string for a given format to estimate width. */
const sampleLabelForFormat = (format: TickFormat): string => {
    const samples: Record<TickFormat, string> = {
        'SSS': '000',
        'ss.SS': '00.00',
        'ss': '00',
        'mm:ss': '00:00',
        'mm': '00',
        'HH:mm': '00:00',
        'HH': '00',
        'DD HH': '00 00',
        'MM/DD': '00/00',
        'MM YY': '00 00',
        'YYYY': '0000',
    };
    return samples[format] ?? '00:00';
};

/**
 * Aligns a moment to the "top" of the given step unit.
 * e.g. for stepType='h', floors to the start of the hour.
 */
const alignToStep = (t: moment.Moment, stepType: TimeStep, step: number): void => {
    switch (stepType) {
        case 'y':
            t.month(0); t.date(1); t.hours(0); t.minutes(0); t.seconds(0); t.milliseconds(0);
            t.year(Math.floor(t.year() / step) * step);
            break;
        case 'M':
            t.date(1); t.hours(0); t.minutes(0); t.seconds(0); t.milliseconds(0);
            t.month(Math.floor(t.month() / step) * step);
            break;
        case 'w':
            t.weekday(0); t.hours(0); t.minutes(0); t.seconds(0); t.milliseconds(0);
            break;
        case 'd':
            t.hours(0); t.minutes(0); t.seconds(0); t.milliseconds(0);
            break;
        case 'h':
            t.minutes(0); t.seconds(0); t.milliseconds(0);
            t.hours(Math.floor(t.hours() / step) * step);
            break;
        case 'm':
            t.seconds(0); t.milliseconds(0);
            t.minutes(Math.floor(t.minutes() / step) * step);
            break;
        case 's':
            t.milliseconds(0);
            t.seconds(Math.floor(t.seconds() / step) * step);
            break;
        case 'ms':
            t.milliseconds(Math.floor(t.milliseconds() / step) * step);
            break;
    }
};

const formatTick = (t: number, format: string): string => moment.utc(t).format(format);

export default TimeXAxis;