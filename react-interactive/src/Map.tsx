//******************************************************************************************************
//  Map.tsx - Gbtc
//
//  Copyright (c) 2024, Grid Protection Alliance.  All Rights Reserved.
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
//  10/09/2025 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import { map, tileLayer, Map as LeafletMap, MapOptions, TileLayerOptions, LatLngBoundsExpression  } from 'leaflet';
import { useGetContainerPosition } from '@gpa-gemstone/helper-functions';

// Import Leaflet's CSS so consumers don't have to.
import 'leaflet/dist/leaflet.css';

/** Configures the map viewport, layers, and interaction callbacks. */
interface IProps {
    /**
     * Mutable reference populated with the Leaflet map instance and cleared on unmount.
     */
    Map: React.MutableRefObject<LeafletMap | null>,
    /**
     * Optional Leaflet options used when creating the map instance.
     */
    MapOptions?: MapOptions,
    /**
     * Leaflet options applied when creating the map's tile layer.
     */
    TileLayerOptions: TileLayerOptions,
    /**
     * URL template used to load map tiles.
     */
    TileLayerURL: string,
    /**
     * Optional geographic bounds fitted after the map is initialized.
     */
    Bounds?: LatLngBoundsExpression
}

/**
 * Creates and maintains a Leaflet map that fills its measured container.
 * @param props - Supplies the map reference, initialization options, tile layer, and bounds.
 * @returns The container element used by Leaflet.
 */
const Map = (props: IProps) => {
    const mapDivRef = React.useRef<HTMLDivElement | null>(null);
    const { width, height } = useGetContainerPosition(mapDivRef);

    const stringifiedMapOptions = React.useMemo(() => JSON.stringify(props.MapOptions ?? {}), [props.MapOptions]);
    const stringifiedTileLayerOptions = React.useMemo(() => JSON.stringify(props.TileLayerOptions), [props.TileLayerOptions]);
    const stringifiedBounds = React.useMemo(() => JSON.stringify(props.Bounds ?? null), [props.Bounds]);

    const memoizedMapOptions = React.useMemo(() => JSON.parse(stringifiedMapOptions) as MapOptions, [stringifiedMapOptions]);
    const memoizedTileLayerOptions = React.useMemo(() => JSON.parse(stringifiedTileLayerOptions) as TileLayerOptions, [stringifiedTileLayerOptions]);
    const memoizedBounds = React.useMemo(() => JSON.parse(stringifiedBounds) as LatLngBoundsExpression | null, [stringifiedBounds]);

    React.useEffect(() => {
        if (props.Map.current == null) return
        props.Map.current.invalidateSize();
    }, [width, height])

    // Initialize map
    React.useEffect(() => {
        if (mapDivRef.current == null) return;

        props.Map.current = map(mapDivRef.current, memoizedMapOptions);

        tileLayer(props.TileLayerURL, memoizedTileLayerOptions).addTo(props.Map.current);

        //Fit to bounds if provided
        if(memoizedBounds != null)
            props.Map.current.fitBounds(memoizedBounds);

        return () => {
            if (props.Map.current == null) return;
            props.Map.current.remove();
            props.Map.current = null;
        };
    }, [memoizedMapOptions, props.TileLayerURL, memoizedTileLayerOptions, memoizedBounds]);

    return (
        <div className='h-100 w-100' ref={mapDivRef} />
    )
}

export default Map;