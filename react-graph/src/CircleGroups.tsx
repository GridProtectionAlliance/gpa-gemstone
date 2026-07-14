// ******************************************************************************************************
//  AggregatingCircles.tsx - Gbtc
//
//  Copyright © 2023, Grid Protection Alliance.  All Rights Reserved.
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
//  11/11/2025 - G. Santos
//       Generated original version of source code.
//
// ******************************************************************************************************


import * as React from 'react';
import { AxisIdentifier, AxisMap, GraphContext, IDataSeries } from './GraphContext';
import Circle from './Circle';
import DataLegend from './DataLegend';

/** Defines grouped circle data and styling behavior. */
export interface IProps {
  /** Optional label displayed for the circle series in the legend. */
  Legend?: string,
  /** Default fill color applied to every circle in the series. */
  Color: string,
  /** Data-space coordinates rendered as circles. */
  Data: [number, number][],
  /** Optional Y-axis associated with the series. */
  Axis?: AxisIdentifier,
  /**
   * Optional callback that customizes an individual circle.
   * @param dataPoint - Coordinates of the circle being styled.
   * @param index - Position of the circle in the data array.
   * @returns Style overrides for the circle.
   */
  GetCircleStyle?: (dataPoint: [number, number], index: number) => ICircleStyle
  /**
   * Optional callback invoked when an individual circle is clicked.
   * @param dataPoint - Coordinates of the clicked circle.
   * @param index - Position of the circle in the data array.
   */
  OnClick?: (dataPoint: [number, number], index: number) => void
}

/** Defines visual styling returned for a circle group entry. */
export interface ICircleStyle {
  /** Optional fill color that replaces the series color for one circle. */
  ColorOverride?: string,
  /** Optional opacity applied to one circle, defaulting to 1. */
  Opacity?: number,
  /** Optional radius in pixels for one circle, defaulting to 5. */
  Radius?: number,
  /** Optional stroke color applied around one circle. */
  BorderColor?: string
}

/**
 * Renders and registers a legend-enabled series of circle data points.
 * @param props - Series data, styling callbacks, and legend options.
 * @returns SVG group containing visible circles in the current domain.
 */
const CircleGroup = React.memo((props: IProps) => {
	const [guid, setGuid] = React.useState<string|undefined>(undefined);
	const [enabled, setEnabled] = React.useState<boolean>(true);

	const context = React.useContext(GraphContext);
	const axis = AxisMap.get(props.Axis);

	// cull points based on domain
	// ToDo: This memoization of circles should NOT be neccessary, 
	// but circles change context which causes this to rerender.
	const points = React.useMemo(() =>
		enabled ? // just skip calculation if not enabled, its not neccessary
		props.Data.map((c,i) => {
			if (c[0] < context.XDomain[0] || 
				c[0] > context.XDomain[1] || 
				c[1] < context.YDomain[axis][0] ||
				c[1] > context.YDomain[axis][1])
				return null;
			const style = props.GetCircleStyle == null ? {} : props.GetCircleStyle(c, i);
			return (<Circle 
				key={i} 
				data={c} 
				color={style.ColorOverride ?? props.Color} 
				radius={style.Radius ?? 5}
				opacity={style.Opacity ?? 1}
				axis={props.Axis}
				onClick={() => props.OnClick == null ? null : props.OnClick(c, i)}
				borderColor={style.BorderColor}
			/>)
		}).filter(item => item != null) : []
	, [context.YDomain[axis], context.XDomain, props.GetCircleStyle, props.Axis, props.OnClick, props.Data, enabled]);

    const createLegend = React.useCallback(() => {
        if (props.Legend == null || guid == null)
            return undefined;

        return (
			<DataLegend
				id={guid}
				label={props.Legend}
				color={props.Color}
				legendSymbol='circle'
				setEnabled={setEnabled}
				enabled={enabled}
				hasNoData={props.Data.length === 0}
			/>
		);
    }, [props.Color, props.Data, guid, enabled, props.Legend]);
	
	const createContextData: () => IDataSeries = React.useCallback(() => 
		({
			legend: createLegend(),
			axis: props.Axis,
			enabled: enabled,
			getMax: (t: [number, number]) =>
				Math.max(...props.Data
					.filter(point => point[0] >= t[0] && point[0] <= t[1])
					.map(point => point[1])
				),
			getMin: (t: [number, number]) =>
				Math.max(...props.Data
					.filter(point => point[0] >= t[0] && point[0] <= t[1])
					.map(point => point[1])
				),
		} as IDataSeries)
	, [props.Axis, props.Data, createLegend, enabled]);
	
	React.useEffect(() => {
		if (guid == null) return;
		context.UpdateData(guid, createContextData());
	}, [createContextData, guid]);

	React.useEffect(() => {
		if (guid == null) return;
		context.SetLegend(guid, createLegend());
	}, [createLegend]);

	React.useEffect(() => {
		const id = context.AddData(createContextData());
		setGuid(id);
		return () => { context.RemoveData(id) }
	}, []);

	if (!enabled) return null;

	return (
		<g>
			{points}
		</g>
	);
});

export default CircleGroup;
