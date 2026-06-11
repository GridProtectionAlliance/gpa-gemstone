//******************************************************************************************************
//  YViewportContext.tsx - Gbtc
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
import { IRegisteredYViewport } from './ViewportRegistryContext';

export interface IYDataSeries {
    /** 
     * Get the minimum Y value for data within the given X domain.
     * @param xDomain - Current X axis domain [min, max]
     */
    GetMin: (xDomain: [number, number]) => number | undefined;

    /** 
     * Get the maximum Y value for data within the given X domain.
     * @param xDomain - Current X axis domain [min, max]
     */
    GetMax: (xDomain: [number, number]) => number | undefined;

    /**
     * Get data points near a given X value (for hover/tooltip).
     * @param xValue - X value to search near
     * @param pointsAround - Number of points on each side (default: 0)
     * @returns Array of [x, y] points, or undefined if not applicable
     */
    GetPoints?: (xValue: number, pointsAround?: number) => [number, number][] | undefined;

    /** Whether this series is enabled/visible (affects auto-scale) */
    Enabled: boolean;
}

/**
 * Context interface for Y-axis viewport state and operations.
 * Extends the registered viewport with data-component-specific fields.
 * Provided by Y-axis components, consumed by data components.
 */
export interface IYViewportContext extends IRegisteredYViewport {
    /**
     * Ref to register (or update) a data series with this YAxis
     * @param id - Stable unique ID for this data series
     * @param data - The data series descriptor
     */
    RegisterData: React.MutableRefObject<(id: string, data: IYDataSeries) => void>;

    /**
     * Ref to remove a data series from this YAxis by ID
     * @param id - The ID used during registration
     */
    UnregisterData: React.MutableRefObject<(id: string) => void>;
}

const noopRegRef = { current: () => { /* */} };
const noopUnregRef = { current: () => {/* */ } };
const noopFunc = () => {/* */ };

export const YViewportContext = React.createContext<IYViewportContext>({
    MinDomain: 0,
    MaxDomain: 0,
    SetMinDomain: noopFunc,
    SetMaxDomain: noopFunc,
    YTransform: () => 0,
    InverseYTransform: () => 0,
    RegisterData: noopRegRef,
    UnregisterData: noopUnregRef,
    Reset: noopFunc,
    GetDataSeries: () => [],
});

export const useYViewportContext = () => {
    const context = React.useContext(YViewportContext);
    return context as IYViewportContext;
}