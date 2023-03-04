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

export interface IGraphContext {
  XDomain: [number, number],
  XHover: number,

  YHover: number,
  YDomain: [number, number],

  CurrentMode: 'zoom'|'pan'|'select',
  Data: Map<string, IDataSeries>,
  XTransformation: (x: number) => number,
  YTransformation: (y: number) => number,
  AddData: ((d: IDataSeries) => string),
  RemoveData: (key: string) => void,
  UpdateData: (key: string, d: IDataSeries) => void,
  SetLegend: (key: string, legend: HTMLElement|undefined) => void,
  RegisterSelect: (handlers: IHandlers) => string,
  RemoveSelect: (key: string) => void,
  UpdateSelect: (key: string, handlers: IHandlers) => void,
  UpdateFlag: number,
  XInverseTransformation: (p: number) => number,
  YInverseTransformation: (p: number) => number,

};

export const GraphContext = React.createContext({
  XDomain: [0, 0],
  XHover: NaN,

  YHover: NaN,
  YDomain: [0, 0],
  CurrentMode: 'select',


  Data: new Map<string, IDataSeries>(),
  XTransformation: (_: number) => 0,
  YTransformation: (_: number) => 0,
  XInverseTransformation: (_: number) => 0,
  YInverseTransformation: (_: number) => 0,
  AddData: ((_: IDataSeries) => ""),
  RemoveData: (_: string) => undefined,
  UpdateData: (_) => undefined,
  SetLegend: (_) => undefined,
  RegisterSelect: (_) => "",
  RemoveSelect: (_) => undefined,
  UpdateSelect: (_) => undefined,

  UpdateFlag: 0
} as IGraphContext);

export interface IDataSeries {
  getMin: (tDomain: [number, number]) => number| undefined,
  getMax: (tDomain: [number, number]) => number|undefined,
  legend?: HTMLElement,
};

export type LineStyle = '-'|':';

export interface IHandlers {
  onClick?: (x:number, y: number) => void,
  onRelease?: (x: number,y: number) => void,
  onPlotLeave?: (x: number, y:number) => void
}