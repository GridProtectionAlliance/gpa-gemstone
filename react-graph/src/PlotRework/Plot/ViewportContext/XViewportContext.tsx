//******************************************************************************************************
//  XViewportContext.tsx - Gbtc
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
import { IRegisteredXViewport } from './ViewportRegistryContext';

export interface IXDataSeries {
    /** Get the minimum X value in this data series */
    GetMin: () => number | undefined;
    
    /** Get the maximum X value in this data series */
    GetMax: () => number | undefined;
    
    /** Whether this series is enabled/visible affects auto-scaling */
    Enabled: boolean;
}

/** Callback signature for hover value subscribers. */
export type HoverSubscriber = (value: number | null) => void;

/**
 * Context interface for X-axis viewport state and operations.
 * Extends the registered viewport with data-component-specific fields.
 * Provided by X-axis components, consumed by data components.
 */
export interface IXViewportContext extends IRegisteredXViewport {
    /**
     * Returns the current hover value without triggering a re-render.
     * Use RegisterHover for reactive updates.
     */
    GetHoverValue: () => number | null;

    /**
     * Subscribes to hover value changes. Returns an unsubscribe function.
     * Only components that need to react to hover (highlight circles,
     * axis hover labels) should subscribe -- this avoids re-rendering
     * every data component on every mousemove.
     */
    RegisterHover: (callback: HoverSubscriber) => () => void;

    /**
     * Ref to register (or update) a data series with this X axis for auto-scaling.
     * @param id - Stable unique ID for this data series
     * @param data - The data series descriptor
     */
    RegisterData: React.MutableRefObject<(id: string, data: IXDataSeries) => void>;

    /**
     * Ref to unregister a data series from this X axis by ID.
     * @param id - The ID used during registration
     */
    UnregisterData: React.MutableRefObject<(id: string) => void>;
}

const noopRegRef = { current: () => { /* */} };
const noopUnregRef = { current: () => {/* */ } };
const noopFunc = () => {/* */ };

export const XViewportContext = React.createContext<IXViewportContext>({
    MinDomain: 0,
    MaxDomain: 0,
    SetMinDomain: noopFunc,
    SetMaxDomain: noopFunc,
    XTransform: () => 0,
    InverseXTransform: () => 0,
    GetHoverValue: () => null,
    RegisterHover: () => noopFunc,
    RegisterData: noopRegRef,
    UnregisterData: noopUnregRef,
    Reset: noopFunc,
    SetHoverValue: noopFunc,
});

export const useXViewportContext = () => {
    const context = React.useContext(XViewportContext);
    return context as IXViewportContext;
};

/**
 * Hook that subscribes to hover value changes and returns the current value
 * as local state. Only the component using this hook re-renders on hover --
 * siblings and other context consumers are unaffected.
 *
 * When enabled is false the hook skips the subscription entirely and always
 * returns null, so lines without HighlightHover never re-render on mousemove.
 */
export const useHoverValue = (enabled = true): number | null => {
    const { GetHoverValue, RegisterHover } = useXViewportContext();
    const [value, setValue] = React.useState<number | null>(() => enabled ? GetHoverValue() : null);

    React.useEffect(() => {
        if (!enabled) {
            setValue(null);
            return;
        }
        setValue(GetHoverValue());
        return RegisterHover(setValue);
    }, [enabled, GetHoverValue, RegisterHover]);

    return value;
};