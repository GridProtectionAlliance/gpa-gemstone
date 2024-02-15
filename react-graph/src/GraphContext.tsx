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
import { map } from 'lodash';
import * as React from 'react';

export interface IGraphContext extends IHandlerRegistration, IDataRegistration {
  XDomain: [number, number],
  XHover: number,
  XHoverSnap: number,

  YHover: number[],
  YHoverSnap: number[],
  YDomain: [number, number][],

  CurrentMode: 'zoom'|'pan'|'select',
  Data: Map<string, IDataSeries>,
  XApplyPixelOffset: (x: number) => number,
  YApplyPixelOffset: (y: number) => number,
  XTransformation: (x: number) => number,
  YTransformation: (y: number, axis: AxisIdentifier|number) => number,
  UpdateFlag: number,
  XInverseTransformation: (p: number) => number,
  YInverseTransformation: (p: number, axis: AxisIdentifier|number) => number,
  SetXDomain: React.SetStateAction<[number,number]> | ((t: [number,number]) => void),
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


  Data: new Map<string, IDataSeries>(),
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

export interface IDataSeries {
  getData: (tDomain: [number, number], includeEdges?: boolean) => [...number[]][],
  getMin: (tDomain: [number, number]) => number| undefined,
  getMax: (tDomain: [number, number]) => number|undefined,
  getPoint: (xValue: number) => [...number[]]|undefined,
  dataId?: string,
  axis: AxisIdentifier|undefined,
  legend?: React.ReactElement
}

export type LineStyle = '-'|':';
export type FillStyle = 'fill';
export type AxisIdentifier = 'left'|'right'; 

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

export interface IHandlers {
  onClick?: (x:number, y: number) => void,
  onRelease?: (x: number, y: number) => void,
  onPlotLeave?: (x: number, y:number) => void,
  onMove?: (x: number, y: number) => void,
  axis: number|AxisIdentifier,
  allowSnapping: boolean
}

export interface IDataRegistration {
  AddData: ((d: IDataSeries) => string),
  RemoveData: (key: string) => void,
  UpdateData: (key: string, d: IDataSeries) => void,
  SetLegend: (key: string, legend?: React.ReactElement) => void,
}

export interface IHandlerRegistration {
  RegisterSelect: (handlers: IHandlers) => string,
  RemoveSelect: (key: string) => void,
  UpdateSelect: (key: string, handlers: IHandlers) => void,
}

export interface IActionFunctions {
  setTDomain: React.SetStateAction<[number,number]>,
  setYDomain: React.SetStateAction<[number,number][]>
}

interface IContextWrapperProps extends IHandlerRegistration, IDataRegistration {
  XDomain: [number, number],
  MousePosition: [number,number],
  MousePositionSnap: [number,number],
  YDomain: [number,number][],
  CurrentMode: 'zoom-rectangular' | 'zoom-vertical' | 'zoom-horizontal' | 'pan' | 'select',
  MouseIn: boolean,
  UpdateFlag: number,
  Data: Map<string, IDataSeries>,
  XApplyPixelOffset: (_: number) => number,
  YApplyPixelOffset: (_: number) => number, 
  XTransform: (x: number) => number,
  YTransform: (y: number, axis: AxisIdentifier|number) => number,
  XInvTransform: (p: number) => number,
  YInvTransform: (p: number, axis: AxisIdentifier|number) => number,
  SetXDomain: (x: [number,number]) => void,
  SetYDomain: (y: [number, number][]) => void
}

export const ContextWrapper: React.FC<IContextWrapperProps> = (props) => {

  const context = React.useMemo(GetContext, [
    props.XDomain,
    props.MousePosition,
    props.MousePositionSnap,
    props.YDomain,
    props.CurrentMode,
    props.MouseIn,
    props.UpdateFlag,
    props.Data,
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