//******************************************************************************************************
//  DataSeriesContext.tsx - Gbtc
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
//  02/16/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';

/**
 * Shared styling and state for a group of data components. Used to group data elements together for shared legend entries and styling.
 * For example, a DataSeriesGroup with Label="Group 1" and Color='red' that contains two Line components will render a single legend entry "Group 1" in red, and both lines will be red.
 * Data components can override group styles by providing their own props (e.g., a Line with Color='blue' inside the group will be blue instead of red).
 * Data components use their own prop if provided, otherwise fall back to this context.
 */
export interface IDataSeriesContext {
    /** Shared color for the group */
    Color?: string;
    /** Shared opacity (0-1) */
    Opacity?: number;
    /** Shared stroke dash array (e.g., "5,5") */
    StrokeDasharray?: string;
    /** Shared stroke width */
    StrokeWidth?: number;
    /** Whether this group is enabled/visible */
    Enabled: boolean;
    /** Toggle enabled state (called by legend entry on click) */
    SetEnabled: (enabled: boolean) => void;
}

export const DataSeriesContext = React.createContext<IDataSeriesContext | null>(null);

/**
 * Returns the DataSeriesContext if inside a DataSeriesGroup, or null if standalone.
 * Data components should use this to fall back to group styles.
 */
export const useDataSeriesContext = () => React.useContext(DataSeriesContext);