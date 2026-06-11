//******************************************************************************************************
//  AxisGroup.tsx - Gbtc
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

interface IAxisGroupContext {
    /** Register an axis and get back its index */
    RegisterAxis: () => number;
    /** Unregister an axis */
    UnregisterAxis: (index: number) => void;
    /** Position of this group */
    Position: 'left' | 'right';
    /**
     * Report the width of an axis
     * @param index The index of the axis
     * @param width The width of the axis in pixels
     */
    ReportAxisWidth: (index: number, width: number) => void;
    /** Get the total offset for an axis based on its index */
    GetAxisOffset: (index: number) => number;
}

const AxisGroupContext = React.createContext<IAxisGroupContext | null>(null);

export const useAxisGroupContext = () => {
    return React.useContext(AxisGroupContext);
};

export interface IAxisGroupProps {
    /** Which side of the plot */
    Position: 'left' | 'right';
}

const AxisGroupGap = 8;

/** Component to manage a group of axes */
const ValueYAxisGroup = (props: React.PropsWithChildren<IAxisGroupProps>) => {
    const { Position, children } = props;

    const activeIndices = React.useRef<Set<number>>(new Set());
    const axisWidths = React.useRef<Map<number, number>>(new Map());

    const registerAxis = React.useCallback(() => {
        let index = 0;
        while (activeIndices.current.has(index)) index++;
        activeIndices.current.add(index);
        return index;
    }, []);

    const unregisterAxis = React.useCallback((index: number) => {
        activeIndices.current.delete(index);
        axisWidths.current.delete(index);
    }, []);

    const reportAxisWidth = React.useCallback((index: number, width: number) => {
        axisWidths.current.set(index, width);
    }, []);

    const getAxisOffset = React.useCallback((index: number): number => {
        let offset = 0;
        for (let i = 0; i < index; i++) {
            if (activeIndices.current.has(i)) {
                offset += (axisWidths.current.get(i) ?? 0) + AxisGroupGap;
            }
        }
        return offset;
    }, []);

    const contextValue: IAxisGroupContext = React.useMemo(() => ({
        RegisterAxis: registerAxis,
        UnregisterAxis: unregisterAxis,
        Position: Position,
        ReportAxisWidth: reportAxisWidth,
        GetAxisOffset: getAxisOffset
    }), [registerAxis, unregisterAxis, Position, reportAxisWidth, getAxisOffset]);

    return (
        <AxisGroupContext.Provider value={contextValue}>
            {children}
        </AxisGroupContext.Provider>
    );
};

export default ValueYAxisGroup;