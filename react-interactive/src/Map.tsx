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
import { map, tileLayer, Map as LeafletMap, MapOptions, TileLayerOptions  } from 'leaflet';
import { useGetContainerPosition } from '@gpa-gemstone/helper-functions';

// Import Leaflet's CSS so consumers don't have to.
import 'leaflet/dist/leaflet.css';

interface IProps {
    Map: React.MutableRefObject<LeafletMap | null>,
    MapOptions: MapOptions,
    TileLayerOptions: TileLayerOptions,
    TileLayerURL: string
}

const Map = (props: IProps) => {
    const mapDivRef = React.useRef<HTMLDivElement | null>(null);
    const { width, height } = useGetContainerPosition(mapDivRef);

    const stringifiedMapOptions = React.useMemo(() => JSON.stringify(props.MapOptions), [props.MapOptions]);
    const stringifiedTileLayerOptions = React.useMemo(() => JSON.stringify(props.TileLayerOptions), [props.TileLayerOptions]);

    const memoizedMapOptions = React.useMemo(() => JSON.parse(stringifiedMapOptions) as MapOptions, [stringifiedMapOptions]);
    const memoizedTileLayerOptions = React.useMemo(() => JSON.parse(stringifiedTileLayerOptions) as TileLayerOptions, [stringifiedTileLayerOptions]);

    React.useEffect(() => {
        if (props.Map.current == null) return
        props.Map.current.invalidateSize();
    }, [width, height])

    // Initialize map
    React.useEffect(() => {
        if (mapDivRef.current == null) return;

        props.Map.current = map(mapDivRef.current, memoizedMapOptions);

        tileLayer(props.TileLayerURL, memoizedTileLayerOptions).addTo(props.Map.current);

        return () => {
            if (props.Map.current == null) return;
            props.Map.current.remove();
            props.Map.current = null;
        };
    }, [memoizedMapOptions, props.TileLayerURL, memoizedTileLayerOptions]);

    return (
        <div className='h-100 w-100' ref={mapDivRef} />
    )
}

export default Map;