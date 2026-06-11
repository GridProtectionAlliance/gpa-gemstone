//******************************************************************************************************
//  ValueXAxis.tsx - Gbtc
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
//  02/13/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import { Portal } from 'react-portal';
import { PortalIds, useLayoutContext, GetPortalID } from '../LayoutContext';
import { XViewportContext, IXViewportContext, IXDataSeries } from '../ViewportContext/XViewportContext';
import { useViewportRegistryContext } from '../ViewportContext/ViewportRegistryContext';
import { GetTextHeight, GetTextWidth } from '@gpa-gemstone/helper-functions';


export interface IValueXAxisProps {
    /** Fixed domain [min, max]. If omitted, auto-scales to fit registered data. */
    MinDomain?: number;

    MaxDomain?: number;
    /**
     * Optional Axis Label.
     */
    Label?: string;
    /**
     * Optional flag to show vertical grid lines for each tick. Defaults to false.
     */
    ShowGrid?: boolean;
    /** When true, displays the hovered X value as a label on the axis. Default: false. */
    HighlightHover?: boolean;
}

const DEFAULT_DOMAIN: [number, number] = [0, 1];

const ValueXAxis = (props: React.PropsWithChildren<IValueXAxisProps>) => {
    const { MinDomain: propMinDomain, MaxDomain: propMaxDomain, Label, ShowGrid = false, HighlightHover = false, children } = props;

    const isAuto = propMinDomain == null || propMaxDomain == null;

    const { DataArea, PlotID } = useLayoutContext();
    const registry = useViewportRegistryContext();

    const [minDomain, setMinDomain] = React.useState<number>(propMinDomain ?? DEFAULT_DOMAIN[0]);
    const [maxDomain, setMaxDomain] = React.useState<number>(propMaxDomain ?? DEFAULT_DOMAIN[1]);

    // Tracks the auto-computed domain separately so we can use it as the "initial" for reset
    const [minAutoDomain, setMinAutoDomain] = React.useState<number>(DEFAULT_DOMAIN[0]);
    const [maxAutoDomain, setMaxAutoDomain] = React.useState<number>(DEFAULT_DOMAIN[1]);

    const registeredData = React.useRef<Map<string, IXDataSeries>>(new Map());
    // Bumped whenever data is registered/unregistered to trigger auto-scale recomputation
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

    // Local hover label for axis display -- only this component re-renders
    const [hoverLabel, setHoverLabel] = React.useState<string | null>(null);

    const [ticks, setTicks] = React.useState<number[]>([]);
    const [decimalPlaces, setDecimalPlaces] = React.useState<number>(0);
    const [labelHeight, setLabelHeight] = React.useState<number>(0);

    React.useEffect(() => {
        if (!HighlightHover) return;
        return registerHover((v) => {
            setHoverLabel(v != null ? formatNumber(v, decimalPlaces) : null);
        });
    }, [HighlightHover, registerHover, decimalPlaces]);

    // Track the interaction registration ID
    const registrationId = React.useRef<string | null>(null);

    // Sync domain when prop changes (manual mode)
    React.useEffect(() => {
        if (propMinDomain != null && propMaxDomain != null) {
            setMinDomain(propMinDomain);
            setMaxDomain(propMaxDomain);
        }
    }, [propMinDomain, propMaxDomain]);

    // Effect to compute auto domain from registered data
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

        // No valid data — fall back to default
        if (min >= max) {
            setMinAutoDomain(DEFAULT_DOMAIN[0]);
            setMaxAutoDomain(DEFAULT_DOMAIN[1]);
            setMinDomain(DEFAULT_DOMAIN[0]);
            setMaxDomain(DEFAULT_DOMAIN[1]);
            return;
        }


        const newDomain: [number, number] = [min, max];
        setMinAutoDomain(newDomain[0]);
        setMaxAutoDomain(newDomain[1]);
        setMinDomain(newDomain[0]);
        setMaxDomain(newDomain[1]);
    }, [isAuto, dataRevision]);

    // Effect to calculate label height
    React.useEffect(() => {
        setLabelHeight(Label != null ? GetTextHeight('Segoe UI', '1em', Label) : 0);
    }, [Label]);

    // Effect to calculate ticks when domain or available width changes
    React.useEffect(() => {
        const deltaX = maxDomain - minDomain;
        if (deltaX === 0 || DataArea.Width === 0) return;

        // Measure a representative label to estimate per-tick width
        const sampleLabel = formatNumber(minDomain, 2);
        const labelWidth = GetTextWidth('Segoe UI', '1em', sampleLabel);

        const { tickInterval, decimalPlaces: dp } = calculateTickInterval(
            minDomain, maxDomain, DataArea.Width, labelWidth
        );

        const startTick = Math.ceil(minDomain / tickInterval) * tickInterval;
        const newTicks: number[] = [];

        for (let t = startTick; t <= maxDomain; t += tickInterval) {
            newTicks.push(t);
        }

        setTicks(newTicks);
        setDecimalPlaces(dp);
    }, [minDomain, maxDomain, DataArea.Width]);

    // Func to transform data X values to pixel positions
    const xTransform = React.useCallback((x: number): number => {
        const range = maxDomain - minDomain;
        if (range === 0) return 0;
        return ((x - minDomain) / range) * DataArea.Width;
    }, [minDomain, maxDomain, DataArea.Width]);

    // Func to transform pixel positions back to data X values
    const inverseXTransform = React.useCallback((px: number): number => {
        const range = maxDomain - minDomain;
        if (DataArea.Width === 0) return minDomain;
        return (px / DataArea.Width) * range + minDomain;
    }, [minDomain, maxDomain, DataArea.Width]);

    //Stable func to register data series with this axis for auto-scaling
    const registerData = React.useRef((id: string, data: IXDataSeries) => {
        registeredData.current.set(id, data);
        setDataRevision((r) => r + 1);
    });

    // Stable func to unregister data series from this axis
    const unregisterData = React.useRef((id: string) => {
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
        UnregisterData: unregisterData,
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
                    <path
                        stroke="currentColor"
                        strokeWidth={1}
                        d={`M 0 0 H ${DataArea.Width}`}
                    />

                    {/* Ticks and labels */}
                    {ticks.map((t, i) => {
                        const x = xTransform(t);
                        return (
                            <g key={i}>
                                <path
                                    stroke="currentColor"
                                    strokeWidth={1}
                                    d={`M ${x} 0 v 6`}
                                />
                                <text
                                    fill="currentColor"
                                    fontSize="1em"
                                    textAnchor="middle"
                                    dominantBaseline="hanging"
                                    x={x}
                                    y={8}
                                >
                                    {formatNumber(t, decimalPlaces)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Axis label */}
                    {Label != null && (
                        <text
                            fill="currentColor"
                            fontSize="1em"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            x={DataArea.Width / 2}
                            y={28 + labelHeight / 2}
                        >
                            {Label}
                        </text>
                    )}

                    {/* Hovered value */}
                    {hoverLabel != null && (
                        <text
                            fill="currentColor"
                            fontSize="1em"
                            textAnchor="start"
                            dominantBaseline="middle"
                            x={0}
                            y={28 + labelHeight / 2}
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

// Helper functions
const formatNumber = (value: number, decimalPlaces: number): string => {
    return value.toFixed(decimalPlaces);
};

const calculateTickInterval = (
    min: number,
    max: number,
    availablePx?: number,
    labelSizePx?: number
): { tickInterval: number; decimalPlaces: number } => {
    const range = max - min;

    // If pixel dimensions are available, compute max ticks that fit without overlap.
    // Each label needs its own width plus a small gap so adjacent labels don't touch.
    let desiredTicks = 7;
    if (availablePx != null && labelSizePx != null && labelSizePx > 0) {
        const minSpacingPx = labelSizePx + 10;
        desiredTicks = Math.min(10, Math.max(2, Math.floor(availablePx / minSpacingPx)));
    }

    const rawTickInterval = range / desiredTicks;

    const exponent = Math.floor(Math.log10(rawTickInterval));
    const fraction = rawTickInterval / Math.pow(10, exponent);

    let niceFraction: number;
    if (fraction <= 1)
        niceFraction = 1;
    else if (fraction <= 2)
        niceFraction = 2;
    else if (fraction <= 5)
        niceFraction = 5;
    else
        niceFraction = 10;

    const tickInterval = niceFraction * Math.pow(10, exponent);
    const decimalPlaces = Math.max(0, -Math.floor(Math.log10(tickInterval)));

    return { tickInterval, decimalPlaces };
};

export default ValueXAxis;