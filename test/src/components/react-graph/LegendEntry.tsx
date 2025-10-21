//******************************************************************************************************
//  LegendEntry.tsx - Gbtc
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
//  10/21/2025 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from "react";
import { Plot, LegendEntry } from "@gpa-gemstone/react-graph";

export const LegendEntry_ID = `legend-entry-test-id`;
export const LegendEntry_Label = `Test Legend Entry`; //This is needed as a way to identify the component in testing

/* NOTE: dont change the limits on the plot as we depend on them for the # of ticks displayed in the jest test */
const LegendEntryTestComponent = () => {

    return (
        <div className="container-fluid h-100 p-0 d-flex flex-column">
            <div className="row h-100">
                <div className="col-12" id={LegendEntry_ID}>
                    <Plot
                        defaultTdomain={[0, 10]}
                        defaultYdomain={[0, 10]}
                        height={500}
                        width={500}
                        legend={'right'}
                    >
                        <LegendEntry
                            Label={LegendEntry_Label}
                            OnClick={() => { }}
                        />                  
                    </Plot>
                </div>
            </div>
        </div>
    )

}

export default LegendEntryTestComponent;