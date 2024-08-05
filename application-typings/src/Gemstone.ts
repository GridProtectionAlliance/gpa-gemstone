// ******************************************************************************************************
//  Gemstone.tsx - Gbtc
//
//  Copyright © 2024, Grid Protection Alliance.  All Rights Reserved.
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
//  06/03/2024 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************
import * as React from 'react';

namespace Gemstone {
    export namespace TSX {
        export namespace Types { }
        export namespace Interfaces {
            export interface IElementPosition {
                Top: number,
                Left: number,
                Width: number,
                Height: number
            }
            export interface ICSVField<T> {
                /**
                 * The field in the record this definition applies to.
                 * @type {keyof T}
                 */
                Field: keyof T;
            
                /**
                 * The label for the field, used for select element.
                 * @type {string}
                 */
                Label: string;
            
                /**
                 * Function to validate the field value.
                 * @param {string} value - The value to validate.
                 * @returns {boolean}
                 */
                Validate: (value: string) => boolean;
            
                /**
                 * Component for editing the field value.
                 */
                EditComponent: React.FC<{ Value: string, SetValue: (val: string) => void, Valid: boolean, Feedback?: string }>;
            
                /**
                 * Optional help text for the select element.
                 * @type {string}
                 * @optional
                 */
                Help?: string;
            
                /**
                 * Optional feedback for the EditComponent
                 * @type {string}
                 * @optional
                 */
                Feedback?: string;
            
                /**
                 * Function to process the field value and update the record.
                 * @param {string} val - The value to process.
                 * @param {T} record - The record to update.
                 * @returns {T}
                 */
                Process: (val: string, record: T) => T;
            
                /**
                 * Flag indicating if the field is required.
                 * @type {boolean}
                 */
                Required: boolean;
            
                /**
                 * Flag indicating if the field can be empty.
                 * @type {boolean}
                 */
                AllowEmpty: boolean;
            
                /**
                 * Flag indicating if the field values must be unique.
                 * @type {boolean}
                 */
                Unique: boolean;
            }
            export interface ISearchFilter<T> {
                FieldName: keyof T,
                SearchParameter: string,
                Operator: ('=' | '<>' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'NOT LIKE' | 'IN' | 'NOT IN')
            }
            
        }
    }
}

export default Gemstone;
