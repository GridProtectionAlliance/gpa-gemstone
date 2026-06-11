//******************************************************************************************************
//  DataSeriesGroup.tsx - Gbtc
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
import { Portal } from 'react-portal';
import { DataSeriesContext, IDataSeriesContext } from './DataSeriesContext';
import { PortalIds, useLayoutContext, GetPortalID, LegendPosition } from '../LayoutContext';
import LegendEntry from './LegendEntry';

export interface IDataSeriesGroupProps {
    /** Legend label. If omitted, no legend entry is rendered. */
    Label?: string;
    /** Shared color for all children (children can override via their own props) */
    Color?: string;
    /** Shared opacity for all children */
    Opacity?: number;
    /** Shared stroke dash array for all children */
    StrokeDasharray?: string;
    /** Shared stroke width for all children */
    StrokeWidth?: number;
    /** Initial enabled state. Default: true */
    DefaultEnabled?: boolean;
    /** External enabled override. When provided, syncs internal state to this value. */
    Enabled?: boolean;
    /** Called whenever the enabled state changes (legend toggle or external sync). */
    OnEnabledChange?: (enabled: boolean) => void;
    /** Which legend to place this entry in. Falls back to Plot's LegendPosition. */
    LegendPosition?: LegendPosition;
    /** Custom legend element to render instead of the default LegendEntry. Receives Enabled and OnToggle props. */
    CustomLegend?: React.ReactElement;
}

const DataSeriesGroup = (props: React.PropsWithChildren<IDataSeriesGroupProps>) => {
    const { Label, Color, Opacity, StrokeDasharray, StrokeWidth, DefaultEnabled = true, Enabled, OnEnabledChange, CustomLegend, children } = props;
    const { PlotID, LegendPosition: defaultPosition } = useLayoutContext();

    const position = props.LegendPosition ?? defaultPosition;

    const [enabled, setEnabled] = React.useState<boolean>(DefaultEnabled);

    React.useEffect(() => {
        if (Enabled !== undefined) setEnabled(Enabled);
    }, [Enabled]);

    const handleSetEnabled = React.useCallback((value: boolean) => {
        setEnabled(value);
        OnEnabledChange?.(value);
    }, [OnEnabledChange]);

    const contextValue: IDataSeriesContext = React.useMemo(() => ({
        Color,
        Opacity,
        StrokeDasharray,
        StrokeWidth,
        Enabled: enabled,
        SetEnabled: handleSetEnabled,
    }), [Color, Opacity, StrokeDasharray, StrokeWidth, enabled, handleSetEnabled]);

    const legendPortalNode = document.getElementById(GetPortalID(PlotID, legendPortalId(position)));

    return (
        <DataSeriesContext.Provider value={contextValue}>
            {children}
            {Label != null && legendPortalNode != null ?
                <Portal node={legendPortalNode}>
                    {CustomLegend != null
                        ? React.cloneElement(CustomLegend, { Enabled: enabled, OnToggle: handleSetEnabled })
                        : <LegendEntry
                            Label={Label}
                            Color={Color ?? 'currentColor'}
                            Enabled={enabled}
                            StrokeDasharray={StrokeDasharray}
                            OnToggle={handleSetEnabled}
                        />
                    }
                </Portal>
                : null}
        </DataSeriesContext.Provider>
    );
};

/** Maps a LegendPosition to the portal ID used to target that legend container. */
const legendPortalId = (position: LegendPosition): string => {
    switch (position) {
        case 'left': return PortalIds.LEFT_LEGEND;
        case 'right': return PortalIds.RIGHT_LEGEND;
        default: return PortalIds.LEGEND;
    }
};

export default DataSeriesGroup;