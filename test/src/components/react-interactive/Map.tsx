//******************************************************************************************************
//  Checkbox.tsx - Gbtc
//
//  Copyright (c) 2025, Grid Protection Alliance.  All Rights Reserved.
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
//  05/05/2025 - Collins Self
//       Generated original version of source code.
//
//******************************************************************************************************

import { Map } from "@gpa-gemstone/react-interactive";
import React from "react";
import { Map as LeafletMap } from 'leaflet';

export const MAP_ID = 'map-test';

export const Default_Map_Options = {
    center: [35.0458, -85.3094],
    zoom: 7
};

export const Default_Tile_Layer_Options = {
    minZoom: 1,
    maxZoom: 19,
    detectRetina: true,
    attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <br>' + '&copy; <a href="http://cartodb.com/attributions">CartoDB</a>`,
    Subdomains: `abcd`,
};

const MapTestComponent = () => {
    const map = React.useRef<LeafletMap | null>(null);

    return (
        <div className="container-fluid h-100 p-0 d-flex flex-column">
            <div className="row h-100" id={MAP_ID}>
                <div className="col-12" id={`${MAP_ID}-1`}>
                    <Map
                        Map={map}
                        TileLayerURL={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}
                        MapOptions={Default_Map_Options}
                        TileLayerOptions={Default_Tile_Layer_Options}
                    />
                </div>
            </div>
        </div>
    )
}

export default MapTestComponent;