// ******************************************************************************************************
//  ItemForm.tsx - Gbtc
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
//  07/04/2021 - C. Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import { SystemCenter } from '@gpa-gemstone/application-typings';
import { Input } from '@gpa-gemstone/react-forms';
import { IsInteger } from '@gpa-gemstone/helper-functions';

interface IProps {
    Record: SystemCenter.Types.ValueListItem,
     Setter: (record: SystemCenter.Types.ValueListItem) => void,
     ErrorSetter?: (errors: string[]) => void
    }

export default function ItemForm(props: IProps) {
    const [errors, setErrors] = React.useState<string[]>([]);

    React.useEffect(() => {
        const e = [];

        if (props.Record.Value == null || props.Record.Value.length === 0)
            e.push('A Value is required.')
        if (props.Record.Value != null && props.Record.Value.length > 200)
            e.push('Value has to be less than 200 characters.')
        if (props.Record.AltValue != null && props.Record.AltValue.length > 200)
            e.push('Alt Value has to be less than 200 characters.')
        if (props.Record.SortOrder != null && !IsInteger(props.Record.SortOrder))
                e.push('Sort Order has to be an integer or be left blank.')
        setErrors(e)

    }, [props.Record])

    React.useEffect(() => {
        if (props.ErrorSetter !== undefined)
            props.ErrorSetter(errors);
    }, [errors,props.ErrorSetter]);

    function Valid(field: keyof (SystemCenter.Types.ValueListItem)): boolean {
        if (field === 'Value')
            return props.Record.Value != null && props.Record.Value.length > 0 && props.Record.Value.length <= 200;
        else if (field === 'AltValue')
            return props.Record.AltValue == null || props.Record.AltValue.length <= 200;
                else if (field === 'SortOrder')
                    return props.Record.SortOrder == null ||  IsInteger(props.Record.SortOrder)
        return true;
    }

    return (
        <form>
            <Input<SystemCenter.Types.ValueListItem> Record={props.Record} Field={'Value'} Feedback={'Value must be set and be less than 200 characters.'} Valid={Valid} Setter={props.Setter} />
            <Input<SystemCenter.Types.ValueListItem> Record={props.Record} Field={'AltValue'} Label={'Alt. Value'} Feedback={'Alt. Value must be less than 200 characters.'} Valid={Valid} Setter={props.Setter} />
            <Input<SystemCenter.Types.ValueListItem> Record={props.Record} Field={'SortOrder'} Label={'Sort Order'} Type='number' Valid={Valid} Setter={props.Setter} />
        </form>

        );
}
