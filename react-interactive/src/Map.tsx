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
import leaflet from 'leaflet';
import { useGetContainerPosition } from '@gpa-gemstone/helper-functions';

interface IProps {
    Map: React.MutableRefObject<leaflet.Map | null>,
    MapOptions: leaflet.MapOptions,
    TileLayerOptions: leaflet.TileLayerOptions,
    TileLayerURL: string,
}

const Map = (props: IProps) => {
    const mapDivRef = React.useRef<HTMLDivElement | null>(null);
    const { width, height } = useGetContainerPosition(mapDivRef);

    React.useEffect(() => {
        if (props.Map.current == null) return
        props.Map.current.invalidateSize();
    }, [width, height])

    // Initialize map
    React.useEffect(() => {
        if (mapDivRef.current == null) return;

        props.Map.current = leaflet.map(mapDivRef.current, props.MapOptions);

        leaflet.tileLayer(props.TileLayerURL, props.TileLayerOptions).addTo(props.Map.current);

        return () => {
            if (props.Map.current == null) return;
            props.Map.current.remove();
            props.Map.current = null;
        };
    }, [props.MapOptions, props.TileLayerURL, props.TileLayerOptions]);

    return (
        <div className='h-100 w-100' ref={mapDivRef} />
    )
}

export default Map;