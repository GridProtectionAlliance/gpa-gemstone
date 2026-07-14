// ******************************************************************************************************
//  GraphContext.tsx - Gbtc
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
//  03/18/2021 - C Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************
import * as React from 'react';

/** Describes graph domains, pointer state, transformations, data, and interaction registrations. */
export interface IGraphContext extends IHandlerRegistration, IDataRegistration {
  /** Visible X-axis domain. */
  XDomain: [number, number],
  /** Current unsnapped X pointer coordinate. */
  XHover: number,
  /** Current snapped X pointer coordinate. */
  XHoverSnap: number,

  /** Current unsnapped Y pointer coordinate for each axis. */
  YHover: number[],
  /** Current snapped Y pointer coordinate for each axis. */
  YHoverSnap: number[],
  /** Visible domain for each Y-axis. */
  YDomain: [number, number][],

  /** Interaction mode currently active on the graph. */
  CurrentMode: SelectType,
  /** Registered data series keyed by identifier. */
  Data: React.MutableRefObject<Map<string, IDataSeries>>,
  /** Identifier associated with the current data update. */
  DataGuid: string,
  /** Command coordinating enabled state across graph series. */
  MassEnableCommand: {requester: string, command: "disable-others"|"enable-all"|"none"},
  /** Converts an X pixel offset into a plot pixel coordinate. */
  XApplyPixelOffset: (x: number) => number,
  /** Converts a Y pixel offset into a plot pixel coordinate. */
  YApplyPixelOffset: (y: number) => number,
  /** Converts an X data coordinate into a plot coordinate. */
  XTransformation: (x: number) => number,
  /** Converts a Y data coordinate on the selected axis into a plot coordinate. */
  YTransformation: (y: number, axis: AxisIdentifier|number) => number,
  /** Revision value used to notify consumers of graph updates. */
  UpdateFlag: number,
  /** Converts an X plot coordinate back into a data coordinate. */
  XInverseTransformation: (p: number) => number,
  /** Converts a Y plot coordinate on the selected axis back into a data coordinate. */
  YInverseTransformation: (p: number, axis: AxisIdentifier|number) => number,
  /** State action or callback used to update the visible X domain. */
  SetXDomain: React.SetStateAction<[number,number]> | ((t: [number,number]) => void),
  /** State action or callback used to update the visible Y domains. */
  SetYDomain:  React.SetStateAction<[number,number]> | ((t: [number,number][]) => void)
}

export const GraphContext = React.createContext({
  XDomain: [0, 0],
  XHover: NaN,
  XHoverSnap: NaN,

  YHover: [NaN, NaN],
  YHoverSnap: [NaN, NaN],
  YDomain: [[0, 0]],
  CurrentMode: 'select',
  MassEnableCommand: {requester: "", command: "none"},


  Data: React.createRef(),
  DataGuid: "",
  XApplyPixelOffset: (_: number) => _,
  YApplyPixelOffset: (_: number) => _,
  XTransformation: (_: number) => 0,
  YTransformation: (_: number, __: AxisIdentifier|number) => 0,
  XInverseTransformation: (_: number) => 0,
  YInverseTransformation: (_: number, __: AxisIdentifier|number) => 0,
  AddData: ((_: IDataSeries) => ""),
  RemoveData: (_: string) => undefined,
  UpdateData: (_) => undefined,
  SetLegend: (_) => undefined,
  RegisterSelect: (_) => "",
  RemoveSelect: (_) => undefined,
  UpdateSelect: (_) => undefined,
  SetXDomain: (_) => undefined,
  SetYDomain: (_: any) => undefined,
  UpdateFlag: 0
} as IGraphContext);

/** Describes a graph data series and its domain query operations. */
export interface IDataSeries {
  /** Returns the minimum series value inside an X-domain. */
  getMin: (tDomain: [number, number]) => number| undefined,
  /** Returns the maximum series value inside an X-domain. */
  getMax: (tDomain: [number, number]) => number|undefined,
  /** Returns series points surrounding an X value. */
  getPoints: (xValue: number, pointsAround?: number) => [...number[]][]|undefined,
  /** Whether the series participates in rendering and domain calculations. */
  enabled: boolean,
  /** Optional Y-axis associated with the series. */
  axis: AxisIdentifier|undefined,
  /** Optional legend element representing the series. */
  legend?: React.ReactElement
}

/** Identifies the stroke pattern used to render a line. */
export type LineStyle = '-'|':'|'solid'|'dash'|'short-dash'|'long-dash';

export const LineMap = new Map<LineStyle, string>([
  ['-', 'none'],
  ['solid', 'none'],
  [':', '10,5'],
  ['short-dash', '10,5'],
  ['dash', '20,5'],
  ['long-dash', '30,5']
]);

/** Identifies the supported filled-area style. */
export type FillStyle = 'fill';
/** Identifies the left or right Y-axis. */
export type AxisIdentifier = 'left'|'right'; 
/** Identifies a graph selection, zoom, or pan interaction mode. */
export type SelectType = 'zoom-rectangular' | 'zoom-vertical' | 'zoom-horizontal' | 'pan' | 'select';

class AxisMapClass<T, U> {
  private mapBase: Map<T, U>;
  private undefinedOverride: U; 
  size: number;
  constructor(iterable: Iterable<[T,U]>, undefinedOverride: U) {
    this.mapBase = new Map<T,U>(iterable); 
    this.undefinedOverride = undefinedOverride;
    // Note: if we ever allow mapBase to be mutated, the mutate methods should assign this
    this.size = this.mapBase.size;
  }
  get = (key: T): U => (this.mapBase.get(key) ?? this.undefinedOverride);
  values = (): IterableIterator<U> => (this.mapBase.values());
  keys = (): IterableIterator<T> => (this.mapBase.keys());
}

// Giving this undefined (such as when an axis for a component is not specfied), will return 0, same as making a default of 'left'
export const AxisMap = new AxisMapClass<AxisIdentifier|undefined, number>([
  ['left', 0],
  ['right', 1]
], 0);

/** Defines pointer handlers registered with the graph. */
export interface IHandlers {
  /** Optional callback invoked when the graph is clicked. */
  onClick?: (x:number, y: number) => void,
  /** Optional callback invoked when a pointer interaction is released. */
  onRelease?: (x: number, y: number) => void,
  /** Optional callback invoked when the pointer leaves the plot. */
  onPlotLeave?: (x: number, y:number) => void,
  /** Optional callback invoked as the pointer moves across the plot. */
  onMove?: (x: number, y: number) => void,
  /** Y-axis used to interpret handler coordinates. */
  axis: number|AxisIdentifier,
  /** Whether handler coordinates may snap to series points. */
  allowSnapping: boolean
}

/** Defines operations for registering graph data series and legends. */
export interface IDataRegistration {
  /** Registers a data series and returns its identifier. */
  AddData: ((d: IDataSeries) => string),
  /** Removes the data series associated with an identifier. */
  RemoveData: (key: string) => void,
  /** Replaces the data series associated with an identifier. */
  UpdateData: (key: string, d: IDataSeries) => void,
  /** Sets the legend element associated with a data series. */
  SetLegend: (key: string, legend?: React.ReactElement) => void,
}

/** Defines operations for registering graph interaction handlers. */
export interface IHandlerRegistration {
  /** Registers interaction handlers and returns their identifier. */
  RegisterSelect: (handlers: IHandlers) => string,
  /** Removes the interaction handlers associated with an identifier. */
  RemoveSelect: (key: string) => void,
  /** Replaces the interaction handlers associated with an identifier. */
  UpdateSelect: (key: string, handlers: IHandlers) => void,
}

/** Defines state actions used to update graph domains. */
export interface IActionFunctions {
  /** State action that updates the X domain. */
  setTDomain: React.SetStateAction<[number,number]>,
  /** State action that updates the Y domains. */
  setYDomain: React.SetStateAction<[number,number][]>
}

/** Defines graph state supplied by the context wrapper. */
interface IContextWrapperProps extends IHandlerRegistration, IDataRegistration {
  /** Visible X-axis domain. */
  XDomain: [number, number],
  /** Current unsnapped pointer position in data coordinates. */
  MousePosition: [number,number],
  /** Current snapped pointer position in data coordinates. */
  MousePositionSnap: [number,number],
  /** Visible domains for each Y-axis. */
  YDomain: [number,number][],
  /** Interaction mode currently active on the graph. */
  CurrentMode: SelectType,
  /** Indicates whether the pointer is inside the plotting area. */
  MouseIn: boolean,
  /** Revision value used to notify consumers of context updates. */
  UpdateFlag: number,
  /** Registered data series keyed by identifier. */
  Data: React.MutableRefObject<Map<string, IDataSeries>>,
  /** Identifier of the data series associated with the current update. */
  DataGuid: string,
  /** Command used to coordinate enabled state across legend entries. */
  MassEnableCommand: {requester: string, command: "disable-others"|"enable-all"|"none"},
  /**
   * Converts an X pixel offset into a plot pixel coordinate.
   * @param _ - X offset in pixels.
   * @returns Plot-relative X coordinate in pixels.
   */
  XApplyPixelOffset: (_: number) => number,
  /**
   * Converts a Y pixel offset into a plot pixel coordinate.
   * @param _ - Y offset in pixels.
   * @returns Plot-relative Y coordinate in pixels.
   */
  YApplyPixelOffset: (_: number) => number, 
  /**
   * Transforms an X data value into a pixel coordinate.
   * @param x - X value in data coordinates.
   * @returns X coordinate in pixels.
   */
  XTransform: (x: number) => number,
  /**
   * Transforms a Y data value into a pixel coordinate.
   * @param y - Y value in data coordinates.
   * @param axis - Y-axis used for the transformation.
   * @returns Y coordinate in pixels.
   */
  YTransform: (y: number, axis: AxisIdentifier|number) => number,
  /**
   * Converts an X pixel coordinate into a data value.
   * @param p - X coordinate in pixels.
   * @returns X value in data coordinates.
   */
  XInvTransform: (p: number) => number,
  /**
   * Converts a Y pixel coordinate into a data value.
   * @param p - Y coordinate in pixels.
   * @param axis - Y-axis used for the transformation.
   * @returns Y value in data coordinates.
   */
  YInvTransform: (p: number, axis: AxisIdentifier|number) => number,
  /**
   * Replaces the visible X-axis domain.
   * @param x - New X-axis bounds.
   */
  SetXDomain: (x: [number,number]) => void,
  /**
   * Replaces the visible domains for all Y-axes.
   * @param y - New bounds for each Y-axis.
   */
  SetYDomain: (y: [number, number][]) => void
}

/**
 * Publishes graph domains, transformations, data, and interaction handlers to descendants.
 * @param props - Graph state, registrations, transformations, and child content.
 * @returns Graph context provider wrapping the supplied children.
 */
export const ContextWrapper = (props: React.PropsWithChildren<IContextWrapperProps>) => {

  const context = React.useMemo(GetContext, [
    props.XDomain,
    props.MousePosition,
    props.MousePositionSnap,
    props.YDomain,
    props.CurrentMode,
    props.MouseIn,
    props.UpdateFlag,
    props.DataGuid,
    props.XApplyPixelOffset,
    props.YApplyPixelOffset,
    props.XTransform,
    props.XInvTransform,
    props.YInvTransform,
    props.YTransform,
    props.SetXDomain,
    props.SetYDomain,
    props.AddData,
    props.RemoveData,
    props.UpdateData,
    props.SetLegend,
    props.RegisterSelect,
    props.RemoveSelect,
    props.UpdateSelect
  ]);

  function GetContext(): IGraphContext {
    return {
        XDomain: props.XDomain,
        XHover: props.MouseIn ? props.XInvTransform(props.MousePosition[0]) : NaN,
        YHover: props.MouseIn ? [...AxisMap.values()].map(axis => props.YInvTransform(props.MousePosition[1], axis)) : Array<number>(AxisMap.size).fill(NaN),
        XHoverSnap: props.MouseIn ? props.XInvTransform(props.MousePositionSnap[0]) : NaN,
        YHoverSnap: props.MouseIn ? [...AxisMap.values()].map(axis => props.YInvTransform(props.MousePositionSnap[1], axis)) : Array<number>(AxisMap.size).fill(NaN),
        YDomain: props.YDomain,
        CurrentMode: props.CurrentMode,
        Data: props.Data,
        MassEnableCommand: props.MassEnableCommand,
        DataGuid: props.DataGuid,
        XApplyPixelOffset: props.XApplyPixelOffset,
        YApplyPixelOffset: props.YApplyPixelOffset,
        XTransformation: props.XTransform,
        YTransformation: props.YTransform,
        XInverseTransformation: props.XInvTransform,
        YInverseTransformation: props.YInvTransform,
        AddData: props.AddData,
        RemoveData: props.RemoveData,
        UpdateData: props.UpdateData,
        SetLegend: props.SetLegend,
        RegisterSelect: props.RegisterSelect,
        RemoveSelect: props.RemoveSelect,
        UpdateSelect: props.UpdateSelect,
        UpdateFlag: props.UpdateFlag,
        SetXDomain: props.SetXDomain,
        SetYDomain: props.SetYDomain
    } as IGraphContext
  }

  return <GraphContext.Provider value={context}>
    {props.children}
  </GraphContext.Provider>
}