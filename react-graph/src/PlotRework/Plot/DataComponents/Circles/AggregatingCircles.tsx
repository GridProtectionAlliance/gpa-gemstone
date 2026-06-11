//******************************************************************************************************
//  AggregatingCircles.tsx - Gbtc
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
//  03/04/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import { CreateGuid } from '@gpa-gemstone/helper-functions';
import { useXViewportContext, IXDataSeries } from '../../ViewportContext/XViewportContext';
import { useYViewportContext, IYDataSeries } from '../../ViewportContext/YViewportContext';
import { LegendPosition } from '../../LayoutContext';
import { useDataSeriesContext } from '../../Legend/DataSeriesContext';
import Circle from './Circle';
import DataSeriesGroup from '../../Legend/DataSeriesGroup';

/** Transformation functions provided to aggregation callbacks. */
export interface IAggregationFunctions {
    XTransform: (x: number) => number;
    YTransform: (y: number) => number;
    InverseXTransform: (px: number) => number;
    InverseYTransform: (py: number) => number;
}

/** Visual properties for a single circle in the aggregation. */
export interface ICircleData {
    /** Data point as [x, y] */
    Data: [number, number];
    /** Radius in pixels */
    Radius: number;
    /** Fill color */
    Color?: string;
    /** Fill opacity (0-1) */
    Opacity?: number;
    /** Text to display inside the circle */
    Text?: string;
}

export interface IAggregatingCirclesProps {
    /** Array of circle data to potentially aggregate. */
    Data: ICircleData[];
    /**
     * Determines whether two circles should be aggregated together.
     * Called with the two circle data objects and transform functions.
     */
    CanAggregate: (d1: ICircleData, d2: ICircleData, fns: IAggregationFunctions) => boolean;
    /**
     * Produces a single aggregated circle from a group of circles.
     * Called with the array of circles in the cluster and transform functions.
     */
    OnAggregation: (data: ICircleData[], fns: IAggregationFunctions) => ICircleData;
    /**
     * When true, only individual circles are aggregated — existing clusters
     * are not further merged with other clusters. Default: false.
     */
    SinglePassOnly?: boolean;
    /** Legend label. Auto-wraps in DataSeriesGroup if not already in one. */
    Label?: string;
    /** Default color for circles that don't specify their own. */
    Color?: string;
    /** Which legend to place this entry in. */
    LegendPosition?: LegendPosition;
}

interface ICluster {
    Indices: number[];
    Aggregate: ICircleData | null;
}

const AggregatingCirclesInternal = (props: IAggregatingCirclesProps) => {
    const { Data, CanAggregate, OnAggregation, SinglePassOnly = false } = props;

    const regId = React.useRef(CreateGuid());
    const series = useDataSeriesContext();

    const color = props.Color ?? series?.Color ?? 'currentColor';
    const enabled = series?.Enabled ?? true;

    const xViewport = useXViewportContext();
    const yViewport = useYViewportContext();

    // Build transform functions for aggregation callbacks
    const fns = React.useMemo<IAggregationFunctions>(() => ({
        XTransform: xViewport.XTransform,
        YTransform: yViewport.YTransform,
        InverseXTransform: xViewport.InverseXTransform,
        InverseYTransform: yViewport.InverseYTransform,
    }), [xViewport.XTransform, yViewport.YTransform, xViewport.InverseXTransform, yViewport.InverseYTransform]);

    // Cluster and aggregate circles
    const aggregated = React.useMemo(() => {
        if (Data.length === 0) return [];

        const circles = Data.map(c => ({ ...c }));
        let clusters: ICluster[] = [];

        // Initial clustering pass — compare all pairs of individual circles
        for (let i = 0; i < circles.length; i++) {
            let c1 = clusters.findIndex(c => c.Indices.includes(i));
            for (let j = i + 1; j < circles.length; j++) {
                if (!CanAggregate(circles[i], circles[j], fns))
                    continue;

                const c2 = clusters.findIndex(c => c.Indices.includes(j));

                if (c1 < 0 && c2 < 0) {
                    clusters.push({ Indices: [i, j], Aggregate: null });
                    c1 = clusters.length - 1;
                    continue;
                }
                if (c1 === c2) continue;
                if (c1 >= 0 && c2 < 0) {
                    clusters[c1].Indices.push(j);
                } else if (c1 < 0 && c2 >= 0) {
                    clusters[c2].Indices.push(i);
                    c1 = c2;
                } else if (c1 >= 0 && c2 >= 0) {
                    clusters[c1].Indices.push(...clusters[c2].Indices);
                    clusters.splice(c2, 1);
                    c1 = clusters.findIndex(c => c.Indices.includes(i));
                }
            }
        }

        // Compute initial aggregates
        clusters.forEach(c => {
            c.Aggregate = OnAggregation(circles.filter((_, i) => c.Indices.includes(i)), fns);
        });

        // Multi-pass: merge clusters with each other and absorb unclustered circles
        if (!SinglePassOnly && clusters.length > 0) {
            let prevCount: number;
            let prevClustered: number;
            do {
                prevCount = clusters.length;
                prevClustered = clusters.reduce((s, c) => s + c.Indices.length, 0);

                const toRemove: number[] = [];
                for (let i = 0; i < clusters.length; i++) {
                    let target = i;
                    for (let j = i + 1; j < clusters.length; j++) {
                        const cluster1 = clusters[i].Aggregate;
                        const cluster2 = clusters[j].Aggregate;
                        if (cluster1 == null || cluster2 == null) continue;

                        if (!CanAggregate(cluster1, cluster2, fns))
                            continue;

                        toRemove.push(i);
                        clusters[j].Indices.push(...clusters[i].Indices);
                        clusters[j].Aggregate = OnAggregation(circles.filter((_, l) => clusters[j].Indices.includes(l)), fns);
                        target = j;
                        break;
                    }

                    // Try to absorb unclustered circles into the winning cluster
                    for (let j = 0; j < circles.length; j++) {
                        const cluster = clusters[target].Aggregate;
                        if (clusters.some(cl => cl.Indices.includes(j)) || cluster == null) continue;

                        if (!CanAggregate(cluster, circles[j], fns)) continue;
                        clusters[target].Indices.push(j);
                        clusters[target].Aggregate = OnAggregation(circles.filter((_, l) => clusters[target].Indices.includes(l)), fns);
                    }
                }

                clusters = clusters.filter((_, i) => !toRemove.includes(i));
            } while (prevCount !== clusters.length || prevClustered !== clusters.reduce((s, c) => s + c.Indices.length, 0));
        }

        // Return unclustered circles + aggregated circles
        const clusteredIndices = new Set(clusters.flatMap(c => c.Indices));
        return [
            ...circles.filter((_, i) => !clusteredIndices.has(i)),
            ...clusters.filter(c => c.Aggregate != null).map(c => c.Aggregate as ICircleData),
        ];
    }, [Data, CanAggregate, OnAggregation, SinglePassOnly, fns]);

    // X data series — covers the full X range of all circles
    const xDataSeries = React.useMemo<IXDataSeries>(() => ({
        GetMin: () => {
            if (Data.length === 0) return undefined;
            return Math.min(...Data.map(d => d.Data[0]));
        },
        GetMax: () => {
            if (Data.length === 0) return undefined;
            return Math.max(...Data.map(d => d.Data[0]));
        },
        Enabled: enabled
    }), [Data, enabled]);

    // Y data series
    const yDataSeries = React.useMemo<IYDataSeries>(() => ({
        GetMin: (xDomain: [number, number]) => {
            const inRange = Data.filter(d => d.Data[0] >= xDomain[0] && d.Data[0] <= xDomain[1]);
            if (inRange.length === 0) return undefined;
            return Math.min(...inRange.map(d => d.Data[1]));
        },
        GetMax: (xDomain: [number, number]) => {
            const inRange = Data.filter(d => d.Data[0] >= xDomain[0] && d.Data[0] <= xDomain[1]);
            if (inRange.length === 0) return undefined;
            return Math.max(...inRange.map(d => d.Data[1]));
        },
        Enabled: enabled
    }), [Data, enabled]);

    // Register with axes
    React.useEffect(() => {
        const id = regId.current;
        const xRegister = xViewport.RegisterData.current;
        const yRegister = yViewport.RegisterData.current;
        const xUnregister = xViewport.UnregisterData.current;
        const yUnregister = yViewport.UnregisterData.current;

        xRegister(id, xDataSeries);
        yRegister(id, yDataSeries);

        return () => {
            xUnregister(id);
            yUnregister(id);
        };
    }, [xDataSeries, yDataSeries, xViewport.RegisterData, yViewport.RegisterData, xViewport.UnregisterData, yViewport.UnregisterData]);


    if (!enabled || aggregated.length === 0) return null;

    return (
        <>
            {aggregated.map((c, i) => (
                <Circle
                    key={i}
                    Data={c.Data}
                    Radius={c.Radius}
                    Color={c.Color ?? color}
                    Opacity={c.Opacity}
                    Text={c.Text}
                    BorderColor="currentColor"
                    BorderThickness={0.8}
                />
            ))}
        </>
    );
};

const AggregatingCircles = (props: IAggregatingCirclesProps) => {
    const series = useDataSeriesContext();
    const isInGroup = series != null;

    if (!isInGroup && props.Label != null) {
        return (
            <DataSeriesGroup
                Label={props.Label}
                Color={props.Color}
                LegendPosition={props.LegendPosition}
            >
                <AggregatingCirclesInternal {...props} />
            </DataSeriesGroup>
        );
    }

    return <AggregatingCirclesInternal {...props} />;
};

export default AggregatingCircles;