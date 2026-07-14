//******************************************************************************************************
//  WindowForm.tsx - Gbtc
//
//  Copyright © 2025, Grid Protection Alliance.  All Rights Reserved.
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
//  07/14/2025 - Preston Crawford
//       Generated original version of source code.
//******************************************************************************************************

import { Input, Select } from '@gpa-gemstone/react-forms';
import * as React from 'react';
import { getTimeWindowFromFilter, ITimeWindow } from '../TimeFilter';
import { readableUnit, units } from '../TimeWindowUtils';

/** End of a time window used as its fixed anchor. */
export type Window = "start" | "end"

/** Configures duration editing for an anchored time window. */
export interface IProps {
    /**
     * Time window whose duration and unit are edited by the form.
     */
    Filter: ITimeWindow,
    /**
     * Updates the time window after its duration or unit changes.
     * @param filter - Normalized time window to store.
     */
    SetFilter: (filter: ITimeWindow) => void,
    /**
     * Updates the active quick-selection index.
     * @param qp - Index to activate, or -1 to clear the selection.
     */
    SetActiveQP: (qp: number) => void,
    /**
     * String format used to normalize the time window.
     */
    Format: string,
    /**
     * Indicates whether quick-selection shortcuts are displayed beside the form.
     */
    ShowQuickSelect: boolean,
    /**
     * End of the time window anchored by the date input.
     */
    Window: Window
}

/**
 * Edits the duration and unit of an anchored time window.
 * @param props - Current time window, anchor, format, and update handlers.
 * @returns Duration and unit form controls.
 */
const WindowForm = (props: IProps) => {

    const setter = React.useCallback((record: ITimeWindow) => {
        if (props.Window === 'start') {
            props.SetFilter(getTimeWindowFromFilter({ start: record.start, duration: record.duration, unit: record.unit }, props.Format));
            props.SetActiveQP(-1);
        } else {
            props.SetFilter(getTimeWindowFromFilter({ end: record.end, duration: record.duration, unit: record.unit }, props.Format));
            props.SetActiveQP(-1);
        }

    }, [props.Window, props.Format, props.SetActiveQP, props.SetActiveQP])

    return (
        <div className='form-group'>
            <label style={{ width: '100%', position: 'relative', float: "left" }}>
                Span({props.Window === 'start' ? '+' : '-'})
            </label>
            <div className='row'>
                <div className={'col-6'}>
                    <Input<ITimeWindow>
                        Record={props.Filter}
                        Field='duration'
                        Label=''
                        Valid={() => true}
                        Type='number'
                        Setter={setter}
                    />
                </div>
                <div className={'col-6'}>
                    <Select<ITimeWindow>
                        Record={props.Filter}
                        Label=''
                        Field='unit'
                        Options={units.map((unit) => ({ Value: unit, Label: readableUnit(unit) }))}
                        Setter={setter}
                    />
                </div>
            </div>
        </div>
    )
}

export default WindowForm;