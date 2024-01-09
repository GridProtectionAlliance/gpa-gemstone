// ******************************************************************************************************
//  DoubleInput.tsx - Gbtc
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
//  01/07/2021 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';

/**
 * DoubleInput Component.
 * A component that renders two input fields, allowing input for two related fields in a single record.
 */
export default function DoubleInput<T>(props: {
    Record: T;
    Field1: keyof T;
    Field2: keyof T;
    Setter: (record: T) => void;
    Valid: (field: keyof T) => boolean;
    Label?: string;
    Feedback?: string;
    Disabled?: boolean;
    Type?: 'number' | 'text' | 'password' | 'email' | 'color'; 
}) {
    return (
        <div className="form-group">
            {/* Label for the input group. Defaults to concatenating the names of the two fields if no label is provided. */}
            <label>{props.Label == null ? (props.Field1 + ' ' + props.Field2) : props.Label}</label>
            <div className="input-group">
                {/* First input field */}
                <input
                    type={props.Type === undefined ? 'text' : props.Type}
                    className={props.Valid(props.Field1) ? 'form-control' : 'form-control is-invalid'}
                    onChange={(evt) =>
                        props.Setter({ ...props.Record, [props.Field1]: evt.target.value !== '' ? evt.target.value : null })
                    }
                    value={props.Record[props.Field1] == null ? '' : (props.Record[props.Field1] as any).toString()}
                    disabled={props.Disabled == null ? false : props.Disabled}
                />

                {/* Second input field */}
                <input
                    type={props.Type === undefined ? 'text' : props.Type}
                    className={props.Valid(props.Field2) ? 'form-control' : 'form-control is-invalid'}
                    onChange={(evt) =>
                        props.Setter({ ...props.Record, [props.Field2]: evt.target.value !== '' ? evt.target.value : null })
                    }
                    value={props.Record[props.Field2] == null ? '' : (props.Record[props.Field2] as any).toString()}
                    disabled={props.Disabled == null ? false : props.Disabled}
                />
            </div>

            {/* Feedback message for validation errors. */}
            <div className="invalid-feedback">
                {props.Feedback == null ? (props.Field1 + ' ' + props.Field2 + ' is a required field.') : props.Feedback}
            </div>
        </div>
    );
}