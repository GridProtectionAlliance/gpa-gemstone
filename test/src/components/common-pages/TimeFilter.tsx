//******************************************************************************************************
//  TimeFilter.tsx - Gbtc
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
//  07/22/2025 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import { TimeFilter } from "@gpa-gemstone/common-pages";
import React from "react";

export const StartEndTimeFilterID = 'startEnd-timeFilter-id';
export const StartWindowTimeFilterID = 'startWindow-timeFilter-id';
export const EndWindowTimeFilterID = 'endWindow-timeFilter-id';

const TimeFilterTestComponent = () => {

    const [timeFilter, setTimeFilter] = React.useState<{ start: string, end: string }>({
        start: new Date().toUTCString(),
        end: new Date().toUTCString(),
    });

    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div className="w-100 h-100" id={StartEndTimeFilterID}>
                        <TimeFilter
                            filter={timeFilter}
                            setFilter={(start, end) => setTimeFilter({ start: start, end: end })}
                            showQuickSelect={true}
                            isHorizontal={true}
                            dateTimeSetting={'startEnd'}
                            timeZone={'UTC'}
                            format={'datetime-local'}
                            showHelpMessage={true}
                            accuracy={'millisecond'}
                        />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="w-100 h-100" id={StartWindowTimeFilterID}>
                        <TimeFilter
                            filter={timeFilter}
                            setFilter={(start, end) => setTimeFilter({ start: start, end: end })}
                            showQuickSelect={true}
                            isHorizontal={true}
                            dateTimeSetting={'startWindow'}
                            timeZone={'UTC'}
                            format={'datetime-local'}
                            showHelpMessage={true}
                            accuracy={'millisecond'}
                        />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="w-100 h-100" id={EndWindowTimeFilterID}>
                        <TimeFilter
                            filter={timeFilter}
                            setFilter={(start, end) => setTimeFilter({ start: start, end: end })}
                            showQuickSelect={true}
                            isHorizontal={true}
                            dateTimeSetting={'endWindow'}
                            timeZone={'UTC'}
                            format={'datetime-local'}
                            showHelpMessage={true}
                            accuracy={'millisecond'}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default TimeFilterTestComponent;