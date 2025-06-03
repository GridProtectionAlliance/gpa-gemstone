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
        export namespace Types {
            export type BulkUploadStep = ('Upload' | 'Process' | 'Review' | 'Complete')
            export type Accuracy = ('minute' | 'second' | 'millisecond');
            export type ScreenSize = 'xs' | "sm" | 'md' | 'lg' | 'xl'
        }
        export namespace Interfaces {
            export interface IBaseFormProps<T> {
                /**
                  * Record to be used in form
                  * @type {T}
                */
                Record: T,
                /**
                    * Field of the record to be edited
                    * @type {keyof T}
                */
                Field: keyof T;
                /**
                    * Label to display for the form, defaults to the Field prop
                    * @type {string | JSX.Element}
                    * @optional
                */
                Label?: string | JSX.Element;
                /**
                    * Setter function to update the Record
                    * @param record - Updated Record
                */
                Setter: (record: T) => void;
                /**
                  * Help message or element to display
                  * @type {string | JSX.Element}
                  * @optional
                */
                Help?: string | JSX.Element,
                /**
                  * Flag to disable the input field
                  * @type {boolean}
                  * @optional
                */
                Disabled?: boolean;
            }
            export interface IElementPosition {
                Top: number,
                Left: number,
                Width: number,
                Height: number
            }
            export interface ICSVFieldEditContext<T> {
                Value: string,
                SetValue: (val: string) => void,
                Validate: ((value: string) => boolean) | ((value: string) => Promise<[boolean, () => void]>);
                Feedback?: string,
                AllRecordValues: Partial<Record<keyof T, string>>,
                SelectOptions?: { Label: string, Value: string | number }[]
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
                 * @returns {boolean | Promise<[boolean, () => void]>}
                 */
                Validate: ((value: string) => boolean) | ((value: string) => Promise<[boolean, () => void]>);

                /**
                 * Component for editing the field value.
                 */
                EditComponent: JSX.Element;

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
                 * @param {keyof T} field - The field of the record to update.
                 * @returns {T}
                 */
                Process: (val: string, record: T, field: keyof T) => T;

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

                /**
                 * Flag indicating if the field values should be the same for all rows.
                 * @type {boolean}
                 */
                SameValueForAllRows?: boolean,

                SelectOptions?: { Label: string, Value: string | number }[]
            }
            export interface ISearchFilter<T> {
                FieldName: keyof T,
                SearchParameter: string,
                Operator: ('=' | '<>' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'NOT LIKE' | 'IN' | 'NOT IN')
            }

            export interface IPipelineStepProps<T, U = null> {
                RawFileData: string | null,
                Data: T[],
                SetData: (data: T[]) => void,
                CurrentPipelineStep: number,
                SetPipelineStep: (step: number) => void,
                Errors: string[],
                SetErrors: (errors: string[]) => void,
                AdditionalProps?: U,
            }

            export interface IPipelineSteps<T, U = null> {
                Label: string,
                UI: (props: IPipelineStepProps<T, U>) => JSX.Element
                AdditionalProps?: U,
            }

            export interface IPipeline<T, U = null> {
                Select: (mimeType: string, fileExtension: string) => boolean; //func to return true when the fileExtension is correct
                Steps: IPipelineSteps<T, U>[]; //list of steps to go through based on current step,
                AdditionalUploadUI?: JSX.Element //Additional UI to go under the input element in the Upload stage
            }

            export interface ILabelStringValue {
                Label: string,
                Value: string
            }

            export interface ILabelNumValue {
                Label: string,
                Value: number
            }

            export interface ILabelValue {
                Label: string | number,
                Value: number
            }
        }
    }
}

export default Gemstone;
