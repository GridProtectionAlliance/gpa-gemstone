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
            export type QuickSelectRange = 'cycles' | 'short' | 'medium' | 'long' | 'full'
            export type DateUnit = 'datetime-local' | 'date' | 'time'
        }
        export namespace Interfaces {
            export interface IBaseFormProps<T> {
                /**
                 * Record containing the field edited by the form control.
                 */
                Record: T,
                /**
                 * Key of the record field edited by the form control.
                 */
                Field: keyof T;
                /**
                 * Optional label shown for the form control, defaulting to the field name.
                 */
                Label?: string | JSX.Element;
                /**
                 * Updates the record after the field value changes.
                 * @param record - Record containing the updated field value.
                 */
                Setter: (record: T) => void;
                /**
                 * Optional help content displayed with the form control.
                 */
                Help?: string | JSX.Element,
                /**
                 * Optional flag that disables the form control, defaulting to false.
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
                /**
                 * Unprocessed text read from the uploaded file.
                 */
                RawFileData: string | null,
                /**
                 * Records produced by the pipeline so far.
                 */
                Data: T[],
                /**
                 * Updates the records produced by the pipeline.
                 * @param data - Processed records to store.
                 */
                SetData: (data: T[]) => void,
                /**
                 * Index of the active pipeline step.
                 */
                CurrentPipelineStep: number,
                /**
                 * Updates the active pipeline step.
                 * @param step - Index of the step to activate.
                 */
                SetPipelineStep: (step: number) => void,
                /**
                 * Validation or processing errors reported by the pipeline.
                 */
                Errors: string[],
                /**
                 * Updates validation or processing errors reported by the pipeline.
                 */
                SetErrors: React.Dispatch<React.SetStateAction<string[]>>,
                /**
                 * Optional package-specific data supplied to the pipeline step.
                 */
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

            export interface ILabelValue<T> {
                Label: string,
                Value: T
            }

            export interface AbortablePromise<T> extends PromiseLike<T> {
                abort?: () => void
            }

            export interface IDecisionNodeOption {
                Label: string;
                NextNodeKey: string;
            }

            export interface IDecisionTreeNode {
                Prompt: string | JSX.Element;
                /** Branch options (if absent or empty, this will be treated as a result node) */
                Options?: IDecisionNodeOption[];
                /** RecommendedValue (only for result nodes) */
                RecommendedValue?: any;
            }

            export interface IDecisionTreeData {
                /** Mapping of node IDs to nodes */
                Nodes: Record<string, IDecisionTreeNode>;
                /** Starting node ID */
                RootId: string;
            }
            
            export interface IRecordField<R> {
                AllowSort: boolean,
                IsDefaultColumn: boolean,
                Label?: string,
                Content?: (item: R) => JSX.Element,
                /**
                 * Function to convert the field value to a string for export purposes
                 * @param item The record being exported
                 * @returns The string representation of the field value for export
                 */
                ExportConverter?: (item: R) => string
            }

            export type IRecordFields<T> = {
                [K in keyof T]?: IRecordField<T>;
            };

        }
    }
}

export default Gemstone;
