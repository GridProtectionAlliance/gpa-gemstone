// ******************************************************************************************************
//  FilterRow.tsx - Gbtc
//
//  Copyright © 2020, Grid Protection Alliance.  All Rights Reserved.
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
//  12/23/2025 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import { Search } from './SearchBar';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';

interface IFilterRowProps<T> {
    /**
     * Filter whose field, operator, and search text are displayed in the row.
     */
    Filter: Search.IFilter<T>,
    /**
     * Callback fired when the row's edit button is clicked.
     */
    Edit: () => void,
    /**
     * Callback fired when the row's delete button is clicked.
     */
    Delete: () => void,
    /**
     * Available fields used to resolve the filter's display label.
     */
    Collumns: Search.IField<T>[]
}

/**
 * Renders one active filter with controls for editing or deleting it.
 * @param props - Supplies the filter, available fields, and row action callbacks.
 * @returns The filter table row.
 */
const FilterRow = <T,>(props: IFilterRowProps<T>) => {
    const column = React.useMemo(() => props.Collumns.find(c => c.key === props.Filter.FieldName), [props.Filter, props.Collumns]);

    return (
        <tr>
            <td>
                {column === undefined ? props.Filter.FieldName : column.label}
            </td>
            <td>
                {props.Filter.Operator}
            </td>
            <td>
                {props.Filter.SearchText}
            </td>
            <td>
                <button type='button' className="btn btn-sm" onClick={props.Edit}>
                    <span>
                        <ReactIcons.Pencil />
                    </span>
                </button>
            </td>
            <td>
                <button type='button' className="btn btn-sm" onClick={props.Delete}>
                    <span>
                        <ReactIcons.TrashCan Style={{ color: 'var(--danger)' }} />
                    </span>
                </button>
            </td>
        </tr>
    );
}

export default FilterRow;