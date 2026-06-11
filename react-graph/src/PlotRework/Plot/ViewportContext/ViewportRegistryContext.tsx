//******************************************************************************************************
//  ViewportRegistryContext.tsx - Gbtc
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
//  02/27/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import { IYDataSeries } from './YViewportContext';

interface IRegisteredViewportBase {
    /** Minimum domain value */
    MinDomain: number;
    /** Maximum domain value */
    MaxDomain: number;
    /** Sets the minimum domain value */
    SetMinDomain: (min: number) => void;
    /** Sets the maximum domain value */
    SetMaxDomain: (max: number) => void;
    /** Transforms a data value to pixel coordinates */
    Reset: () => void;
}

/**
 * Registered X viewport. Contains the viewport state that axes expose
 * for the interaction layer (zoom/pan) and data components (transforms).
 */
export interface IRegisteredXViewport extends IRegisteredViewportBase {
    /** Transforms an X data value to pixel coordinates */
    XTransform: (x: number) => number;
    /** Transforms a pixel coordinate to an X data value */
    InverseXTransform: (px: number) => number;
    /** Sets the current hover value in data units, or null when not hovering */
    SetHoverValue: (value: number | null) => void;
}

/**
 * Registered Y viewport. Contains the viewport state that axes expose
 * for the interaction layer (zoom/pan) and data components (transforms).
 */
export interface IRegisteredYViewport extends IRegisteredViewportBase {
    /** Transforms a Y data value to pixel coordinates */
    YTransform: (y: number) => number;
    /** Transforms a pixel coordinate to a Y data value */
    InverseYTransform: (py: number) => number;
    /** 
     * If this axis is in auto mode, recomputes Y domain to fit data within the given X domain.
     * Returns the constrained domain, or undefined if not in auto mode.
     */
    ConstrainToXDomain?: (xDomain: [number, number]) => [number, number] | undefined;
    /**
     * Returns all data series registered with this Y axis.
     * Used by the interaction layer for mouse snapping.
     */
    GetDataSeries: () => IYDataSeries[];
}

export interface IViewportRegistryContext {
    /** Registers an X viewport and returns its ID */
    RegisterXViewport: (vp: IRegisteredXViewport) => string;
    /** Unregisters an X viewport by its ID */
    UnregisterXViewport: (id: string) => void;
    /** Registers a Y viewport and returns its ID */
    RegisterYViewport: (vp: IRegisteredYViewport) => string;
    /** Unregisters a Y viewport by its ID */
    UnregisterYViewport: (id: string) => void;

    /** Gets all registered X viewports */
    GetXViewports: () => IRegisteredXViewport[];
    /** Gets all registered Y viewports */
    GetYViewports: () => IRegisteredYViewport[];
    /** Resets all registered viewports to their initial state */
    Reset: () => void;
}

const noop = () => { /* */ };

export const ViewportRegistryContext = React.createContext<IViewportRegistryContext>({
    RegisterXViewport: () => '',
    UnregisterXViewport: noop,
    RegisterYViewport: () => '',
    UnregisterYViewport: noop,
    GetXViewports: () => [],
    GetYViewports: () => [],
    Reset: () => {/* */ },
});

export const useViewportRegistryContext = () => React.useContext(ViewportRegistryContext);