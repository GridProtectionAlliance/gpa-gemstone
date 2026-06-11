//******************************************************************************************************
//  ValueYAxis.tsx - Gbtc
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
import { YViewportContext, IYViewportContext, IYDataSeries } from '../ViewportContext/YViewportContext';
import { useAxisGroupContext } from './ValueYAxisGroup';
import { useViewportRegistryContext } from '../ViewportContext/ViewportRegistryContext';
import { GetTextWidth, GetTextHeight } from '@gpa-gemstone/helper-functions';

export interface IValueYAxisProps {
    MinDomain?: number;
    MaxDomain?: number;
    /**
     * Optional Axis Label.
     */
    Label?: string;
    /** Only used when not inside an AxisGroup. Default: 'left' */
    Position?: 'left' | 'right';
    /**
     * Optional flag to show horizontal grid lines for each tick. Defaults to false.
     */
    ShowGrid?: boolean;
    /**
     * When true, tick labels are scaled by a metric factor (powers of 1000) and
     * the multiplier is displayed above the axis. Keeps large/small values readable.
     */
    UseMetricFactor?: boolean;
}

/** Default Domain */
const DefaultDomain: [number, number] = [0, 1];
/** Length of the ticks */
const TickLength = 6;
/** Gap between tick and label */
const TickLabelGap = 2;
/** Gap between label and axis */
const LabelGap = 10;

const ValueYAxis = (props: React.PropsWithChildren<IValueYAxisProps>) => {
    const { MinDomain: propMinDomain, MaxDomain: propMaxDomain, Label, Position: PositionProp = 'left', ShowGrid = false, UseMetricFactor = false, children } = props;

    const isAuto = propMinDomain == null || propMaxDomain == null;

    const { DataArea, PlotID } = useLayoutContext();
    const registry = useViewportRegistryContext();

    const axisGroup = useAxisGroupContext();
    const isInGroup = axisGroup != null;

    const Position = isInGroup ? axisGroup.Position : PositionProp;

    const [axisIndex, setAxisIndex] = React.useState<number>(0);

    const [minDomain, setMinDomain] = React.useState<number>(DefaultDomain[0]);
    const [maxDomain, setMaxDomain] = React.useState<number>(DefaultDomain[1]);

    const [minAutoDomain, setMinAutoDomain] = React.useState<number>(DefaultDomain[0]);
    const [maxAutoDomain, setMaxAutoDomain] = React.useState<number>(DefaultDomain[1]);

    const [dataRevision, setDataRevision] = React.useState<number>(0); // Bumped whenever data is registered/unregistered to trigger auto-scale recomputation

    const registeredData = React.useRef<Map<string, IYDataSeries>>(new Map());

    // Register viewport with interaction context
    const registrationId = React.useRef<string | null>(null);

    // Stable func to register a data series
    const registerData = React.useRef((id: string, data: IYDataSeries) => {
        registeredData.current.set(id, data);
        setDataRevision((r) => r + 1);
    });

    // Stable func to unregister a data series
    const removeData = React.useRef((id: string) => {
        registeredData.current.delete(id);
        setDataRevision((r) => r + 1);
    });

    // Compute metric factor from domain. Rounds the exponent to the nearest
    // multiple of 3 so labels stay in familiar SI magnitudes (kilo, mega, etc).
    const { factor, factorExponent } = React.useMemo(() => {
        if (!UseMetricFactor) return { factor: 1, factorExponent: 0 };

        const yMax = Math.max(Math.abs(minDomain), Math.abs(maxDomain));
        if (yMax === 0) return { factor: 1, factorExponent: 0 };

        let exp = 0;
        while ((yMax * Math.pow(10, exp)) < 1)
            exp += 1;
        while ((yMax * Math.pow(10, exp)) > 10)
            exp -= 1;

        // Round to nearest multiple of 3
        exp = Math.sign(exp) * (Math.floor(Math.abs(exp) / 3)) * 3;

        // If the scaled range would be too small, bump up by one step
        const range = Math.abs(maxDomain - minDomain);
        if (range * Math.pow(10, exp) < 0.1 && range !== 0)
            exp += 3;

        return { factor: Math.pow(10, exp), factorExponent: exp };
    }, [UseMetricFactor, minDomain, maxDomain]);

    // Compute ticks and decimal places from domain
    const { ticks, decimalPlaces } = React.useMemo(() => {
        const range = maxDomain - minDomain;

        if (!isFinite(range) || isNaN(range))
            return { ticks: [] as number[], decimalPlaces: 1 };

        if (range === 0)
            return { ticks: [minDomain], decimalPlaces: 1 };

        const { tickInterval, decimalPlaces: dp } = calculateTickInterval(
            minDomain, maxDomain, DataArea.Height,
            GetTextHeight('Segoe UI', '1em', (minDomain * factor).toFixed(2))
        );
        const startTick = Math.ceil(minDomain / tickInterval) * tickInterval;
        const newTicks: number[] = [];

        for (let t = startTick; t <= maxDomain; t += tickInterval) {
            newTicks.push(t);
        }

        // When using a metric factor, recompute decimal places based on the scaled range
        if (factor !== 1) {
            const scaledRange = range * factor;
            let scaledDecimalPlaces: number;
            if (scaledRange >= 15) scaledDecimalPlaces = 0;
            else if (scaledRange >= 1.5) scaledDecimalPlaces = 1;
            else if (scaledRange >= 0.15) scaledDecimalPlaces = 2;
            else if (scaledRange >= 0.015) scaledDecimalPlaces = 3;
            else if (scaledRange >= 0.0015) scaledDecimalPlaces = 4;
            else scaledDecimalPlaces = 5;

            return { ticks: newTicks, decimalPlaces: scaledDecimalPlaces };
        }

        return { ticks: newTicks, decimalPlaces: dp };
    }, [minDomain, maxDomain, factor, DataArea.Height]);

    // Compute tick font size from ticks
    const tickFontSize = React.useMemo(() => {
        if (ticks.length === 0) return 1;

        const sampleLabel = (ticks[0] * factor).toFixed(decimalPlaces);
        const availableHeightPerTick = DataArea.Height / ticks.length;

        let newFontSize = 1;
        let sampleHeight = GetTextHeight('Segoe UI', newFontSize + 'em', sampleLabel);

        while (sampleHeight > availableHeightPerTick && newFontSize > 0.5) {
            newFontSize -= 0.05;
            sampleHeight = GetTextHeight('Segoe UI', newFontSize + 'em', sampleLabel);
        }

        return newFontSize;
    }, [ticks, decimalPlaces, factor, DataArea.Height]);

    // Compute label font size
    const labelFontSize = React.useMemo(() => {
        if (Label == null) return 1;

        let size = 1;
        let width = GetTextWidth('Segoe UI', size + 'em', Label);

        while (width > DataArea.Height && size > 0.1) {
            size -= 0.1;
            width = GetTextWidth('Segoe UI', size + 'em', Label);
        }

        return size;
    }, [Label, DataArea.Height]);

    // Compute the widest tick label width (using scaled values when factor is active)
    const maxTickWidth = React.useMemo(() => {
        if (ticks.length === 0) return 0;

        let widest = 0;
        for (const t of ticks) {
            const label = (t * factor).toFixed(decimalPlaces);
            const w = GetTextWidth('Segoe UI', tickFontSize + 'em', label);
            if (w > widest) widest = w;
        }

        return widest;
    }, [ticks, decimalPlaces, factor, tickFontSize]);

    const labelWidth = React.useMemo(() => {
        if (Label == null) return 0;
        return GetTextHeight('Segoe UI', labelFontSize + 'em', Label); // rotated 90, so text height == visual width
    }, [Label, labelFontSize]);

    // Clean label for the metric factor (e.g. "x10^-3" instead of "x0.001")
    const factorLabelText = React.useMemo(() => {
        if (factor === 1 || factorExponent === 0) return null;
        return 'x10^' + (-factorExponent).toString();
    }, [factor, factorExponent]);

    // Func to transform data Y values to pixel positions
    const yTransform = React.useCallback((y: number): number => {
        const range = maxDomain - minDomain;
        if (range === 0) return 0;
        return DataArea.Height - ((y - minDomain) / range) * DataArea.Height;
    }, [minDomain, maxDomain, DataArea.Height]);

    // Func to transform pixel positions back to data Y values
    const inverseYTransform = React.useCallback((py: number): number => {
        const range = maxDomain - minDomain;
        if (DataArea.Height === 0) return minDomain;
        return ((DataArea.Height - py) / DataArea.Height) * range + minDomain;
    }, [minDomain, maxDomain, DataArea.Height]);

    // Computes Y domain to fit data within a given X domain (used by InteractionOverlay for auto-scale on X zoom)
    const constrainToXDomain = React.useCallback((xDomain: [number, number]): [number, number] | undefined => {
        if (!isAuto) return undefined;

        let min = Number.MAX_VALUE;
        let max = -Number.MAX_VALUE;

        registeredData.current.forEach((series) => {
            if (!series.Enabled) return;
            const seriesMin = series.GetMin(xDomain);
            const seriesMax = series.GetMax(xDomain);
            if (seriesMin != null && isFinite(seriesMin)) min = Math.min(min, seriesMin);
            if (seriesMax != null && isFinite(seriesMax)) max = Math.max(max, seriesMax);
        });

        if (min >= max) return undefined;

        const range = max - min;
        const padding = range * 0.05;
        return [min - padding, max + padding];
    }, [isAuto]);

    const resetDomain = React.useCallback(() => {
        const initialMin = isAuto ? minAutoDomain : (propMinDomain ?? DefaultDomain[0]);
        const initialMax = isAuto ? maxAutoDomain : (propMaxDomain ?? DefaultDomain[1]);
        setMinDomain(initialMin);
        setMaxDomain(initialMax);
    }, [isAuto, minAutoDomain, maxAutoDomain, propMinDomain, propMaxDomain]);

    // Stable callback for the interaction layer to access data series (for snap)
    const getDataSeries = React.useCallback(() => [...registeredData.current.values()], []);

    // Single context value
    const contextValue: IYViewportContext = React.useMemo(() => ({
        MinDomain: minDomain,
        MaxDomain: maxDomain,
        SetMinDomain: setMinDomain,
        SetMaxDomain: setMaxDomain,
        YTransform: yTransform,
        InverseYTransform: inverseYTransform,
        ConstrainToXDomain: isAuto ? constrainToXDomain : undefined,
        HoverValue: null,
        RegisterData: registerData,
        UnregisterData: removeData,
        Reset: resetDomain,
        GetDataSeries: getDataSeries,
    }), [minDomain, maxDomain, yTransform, inverseYTransform, constrainToXDomain, resetDomain, isAuto, getDataSeries]);

    // Register context value with viewport registry
    React.useEffect(() => {
        if (registrationId.current != null)
            registry.UnregisterYViewport(registrationId.current);

        registrationId.current = registry.RegisterYViewport(contextValue);

        return () => {
            if (registrationId.current != null) {
                registry.UnregisterYViewport(registrationId.current);
                registrationId.current = null;
            }
        };
    }, [contextValue, registry]);

    // Effect to register this axis with the axis group
    React.useEffect(() => {
        if (axisGroup != null) {
            const index = axisGroup.RegisterAxis();
            setAxisIndex(index);
            return () => axisGroup.UnregisterAxis(index);
        }
    }, [axisGroup]);

    // Effect to sync domain when prop changes (manual mode)
    React.useEffect(() => {
        if (propMinDomain == null || propMaxDomain == null)
            return;

        setMinDomain(propMinDomain);
        setMaxDomain(propMaxDomain);
    }, [propMinDomain, propMaxDomain]);

    // Effect to compute auto domain from registered data
    React.useEffect(() => {
        if (!isAuto) return;

        // Use a wide X domain for initial auto-scale so we capture all data
        const xDomain: [number, number] = [-Number.MAX_VALUE, Number.MAX_VALUE];
        let min = Number.MAX_VALUE;
        let max = -Number.MAX_VALUE;

        registeredData.current.forEach((series) => {
            if (!series.Enabled) return;
            const seriesMin = series.GetMin(xDomain);
            const seriesMax = series.GetMax(xDomain);
            if (seriesMin != null && isFinite(seriesMin)) min = Math.min(min, seriesMin);
            if (seriesMax != null && isFinite(seriesMax)) max = Math.max(max, seriesMax);
        });

        // No valid data -- fall back to default
        if (min >= max) {
            setMinAutoDomain(DefaultDomain[0]);
            setMaxAutoDomain(DefaultDomain[1]);
            setMinDomain(DefaultDomain[0]);
            setMaxDomain(DefaultDomain[1]);
            return;
        }

        const newDomain: [number, number] = [min, max];
        setMinAutoDomain(newDomain[0]);
        setMaxAutoDomain(newDomain[1]);
        setMinDomain(newDomain[0]);
        setMaxDomain(newDomain[1]);
    }, [isAuto, dataRevision]);

    const totalAxisWidth = TickLength + TickLabelGap + maxTickWidth + LabelGap + labelWidth;

    //Effect to report axis width to group for layout when in a group
    React.useEffect(() => {
        if (!isInGroup) return;

        axisGroup.ReportAxisWidth(axisIndex, totalAxisWidth);
    }, [isInGroup, axisGroup, axisIndex, totalAxisWidth]);

    // layout values 
    const offset = isInGroup ? axisGroup.GetAxisOffset(axisIndex) : 0;

    // outDir: the direction pointing AWAY from the data area
    const outDirection = Position === 'left' ? -1 : 1;

    // Axis line: at the data edge for index 0, further out for higher indices
    const lineX = outDirection * offset;

    // Ticks extend outward from the line
    const tickEndX = lineX + outDirection * TickLength;
    const tickLabelX = tickEndX + outDirection * TickLabelGap;
    const tickLabelAnchor = Position === 'left' ? 'end' : 'start';

    // Label positioned beyond the tick labels with a small gap
    const labelX = outDirection * (offset + TickLength + TickLabelGap + maxTickWidth + LabelGap);

    return (
        <YViewportContext.Provider value={contextValue}>
            <Portal node={document.getElementById(
                Position === 'left'
                    ? GetPortalID(PlotID, PortalIds.LEFT_AXIS)
                    : GetPortalID(PlotID, PortalIds.RIGHT_AXIS)
            )}>
                <g>
                    {/* Main axis line */}
                    <path
                        stroke="currentColor"
                        strokeWidth={1}
                        d={`M ${lineX} 0 V ${DataArea.Height}`}
                    />

                    {ticks.map((t, i) => {
                        const y = yTransform(t);
                        return (
                            <g key={i}>
                                {/* Tick mark - outward from axis line */}
                                <path
                                    stroke="currentColor"
                                    strokeWidth={1}
                                    d={`M ${lineX} ${y} H ${tickEndX}`}
                                />
                                {/* Tick label (scaled by factor) */}
                                <text
                                    fill="currentColor"
                                    fontSize={`${tickFontSize}em`}
                                    textAnchor={tickLabelAnchor}
                                    dominantBaseline="middle"
                                    x={tickLabelX}
                                    y={y}
                                >
                                    {(t * factor).toFixed(decimalPlaces)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Axis label */}
                    {Label != null && (
                        <text
                            fill="currentColor"
                            fontSize={`${labelFontSize}em`}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            transform={`rotate(${-90}, ${labelX}, ${DataArea.Height / 2})`}
                            x={labelX}
                            y={DataArea.Height / 2}
                        >
                            {Label}
                        </text>
                    )}

                    {/* Metric factor label centered on the axis line, above the top tick */}
                    {factorLabelText != null && (
                        <text
                            fill="currentColor"
                            fontSize="0.85em"
                            textAnchor="middle"
                            dominantBaseline="auto"
                            x={lineX}
                            y={-5}
                        >
                            {factorLabelText}
                        </text>
                    )}
                </g>
            </Portal>
            {/* Grid lines rendered in data area so they don't affect axis measurement */}
            {ShowGrid ? (
                <Portal node={document.getElementById(GetPortalID(PlotID, PortalIds.DATA))}>
                    <g style={{ pointerEvents: 'none' }}>
                        {ticks.map((t, i) => {
                            const y = yTransform(t);
                            return (
                                <path
                                    key={i}
                                    stroke="currentColor"
                                    strokeOpacity={0.5}
                                    strokeWidth={1}
                                    d={`M 0 ${y} H ${DataArea.Width}`}
                                />
                            );
                        })}
                    </g>
                </Portal>
            ) : null}
            {children}
        </YViewportContext.Provider>
    );
};

const calculateTickInterval = (
    min: number,
    max: number,
    availablePx?: number,
    labelSizePx?: number
) => {
    const range = max - min;

    // If pixel dimensions are available, compute max ticks that fit without overlap.
    // Each label needs its own height plus a gap so adjacent labels don't collide.
    let desiredTicks = 7;
    if (availablePx != null && labelSizePx != null && labelSizePx > 0) {
        const minSpacingPx = labelSizePx + 6;
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

export default ValueYAxis;