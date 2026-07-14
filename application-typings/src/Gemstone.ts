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
            /** Identifies a stage in the bulk-upload workflow. */
            export type BulkUploadStep = ('Upload' | 'Process' | 'Review' | 'Complete')
            /** Defines the supported timestamp precision levels. */
            export type Accuracy = ('minute' | 'second' | 'millisecond');
            /** Defines responsive screen-size breakpoints. */
            export type ScreenSize = 'xs' | "sm" | 'md' | 'lg' | 'xl'
            /** Defines preset ranges available to quick-select controls. */
            export type QuickSelectRange = 'cycles' | 'short' | 'medium' | 'long' | 'full'
            /** Defines the HTML input modes supported by date controls. */
            export type DateUnit = 'datetime-local' | 'date' | 'time'
        }
        export namespace Interfaces {
            /** Provides the shared contract for record-backed form controls. */
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
            /** Describes an element's position and dimensions. */
            export interface IElementPosition {
                /** Distance from the top edge, in pixels. */
                Top: number,
                /** Distance from the left edge, in pixels. */
                Left: number,
                /** Element width, in pixels. */
                Width: number,
                /** Element height, in pixels. */
                Height: number
            }
            /** Provides the state and validation context used to edit an imported CSV field. */
            export interface ICSVFieldEditContext<T> {
                /** Current text value being edited. */
                Value: string,
                /**
                * Updates the current text value.
                * @param val - Text value to store.
                */
                SetValue: (val: string) => void,
                /**
                * Validates a proposed text value.
                * @param value - Text value to validate.
                * @returns Whether the value is valid, or an asynchronous validation result and follow-up action.
                */
                Validate: ((value: string) => boolean) | ((value: string) => Promise<[boolean, () => void]>);
                /** Optional validation feedback shown to the user. */
                Feedback?: string,
                /** Text values for the other fields in the imported record. */
                AllRecordValues: Partial<Record<keyof T, string>>,
                /** Optional choices available when the field is edited with a select control. */
                SelectOptions?: {
                    /** Text displayed for the choice. */
                    Label: string,
                    /** Value represented by the choice. */
                    Value: string | number
                }[]
            }
            /** Defines how a record field is presented, validated, and processed during CSV import. */
            export interface ICSVField<T> {
                /**
                * The field in the record this definition applies to.
                */
                Field: keyof T;
                /**
                * The label for the field, used for select element.
                */
                Label: string;
                /**
                * Function to validate the field value.
                * @param value - The value to validate.
                * @returns Whether the value is valid, or an asynchronous validation result and follow-up action.
                */
                Validate: ((value: string) => boolean) | ((value: string) => Promise<[boolean, () => void]>);
                /**
                * Component for editing the field value.
                */
                EditComponent: JSX.Element;
                /**
                * Optional help text for the select element.
                */
                Help?: string;
                /**
                * Optional feedback shown by the edit component.
                */
                Feedback?: string;
                /**
                * Function to process the field value and update the record.
                * @param val - The value to process.
                * @param record - The record to update.
                * @param field - The field of the record to update.
                * @returns The updated record.
                */
                Process: (val: string, record: T, field: keyof T) => T;
                /**
                * Flag indicating if the field is required.
                */
                Required: boolean;
                /**
                * Flag indicating if the field can be empty.
                */
                AllowEmpty: boolean;
                /**
                * Flag indicating if the field values must be unique.
                */
                Unique: boolean;
                /**
                * Flag indicating if the field values should be the same for all rows.
                */
                SameValueForAllRows?: boolean,
                /** Optional choices available when the field is edited with a select control. */
                SelectOptions?: {
                    /** Text displayed for the choice. */
                    Label: string,
                    /** Value represented by the choice. */
                    Value: string | number
                }[]
            }
            /** Defines a comparison applied to a searchable record field. */
            export interface ISearchFilter<T> {
                /** Record field evaluated by the filter. */
                FieldName: keyof T,
                /** Search value compared with the record field. */
                SearchParameter: string,
                /** Comparison operator applied by the filter. */
                Operator: ('=' | '<>' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'NOT LIKE' | 'IN' | 'NOT IN')
            }

            /** Provides the state and controls available to a bulk-upload pipeline step. */
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

            /** Defines one stage in a bulk-upload pipeline. */
            export interface IPipelineSteps<T, U = null> {
                /** Label displayed for the pipeline stage. */
                Label: string,
                /**
                * Renders the pipeline stage.
                * @param props - State and controls supplied by the pipeline.
                * @returns The rendered stage content.
                */
                UI: (props: IPipelineStepProps<T, U>) => JSX.Element
                /** Optional package-specific data supplied to this stage. */
                AdditionalProps?: U,
            }

            /** Defines file selection and processing stages for a bulk-upload pipeline. */
            export interface IPipeline<T, U = null> {
                /**
                * Determines whether a file is accepted by the pipeline.
                * @param mimeType - MIME type reported for the file.
                * @param fileExtension - File-name extension reported for the file.
                * @returns Whether the file is supported.
                */
                Select: (mimeType: string, fileExtension: string) => boolean;
                /** Ordered processing stages presented by the pipeline. */
                Steps: IPipelineSteps<T, U>[];
                /** Optional content displayed below the file input during the upload stage. */
                AdditionalUploadUI?: JSX.Element
            }

            /** Pairs a display label with its underlying value. */
            export interface ILabelValue<T> {
                /** Text displayed for the value. */
                Label: string,
                /** Underlying value represented by the label. */
                Value: T
            }

            /** Represents a promise-like operation that can optionally be cancelled. */
            export interface AbortablePromise<T> extends PromiseLike<T> {
                /** Cancels the pending operation when cancellation is supported. */
                abort?: () => void
            }

            /** Defines a selectable branch from a decision-tree node. */
            export interface IDecisionNodeOption {
                /** Text displayed for the branch option. */
                Label: string;
                /** Key of the node reached by selecting this option. */
                NextNodeKey: string;
            }

            /** Defines a prompt, its branch options, or a terminal recommendation. */
            export interface IDecisionTreeNode {
                /** Prompt displayed at this decision point. */
                Prompt: string | JSX.Element;
                /** Branch options; when absent or empty, the node is treated as a result. */
                Options?: IDecisionNodeOption[];
                /** Recommended value produced by a result node. */
                RecommendedValue?: any;
            }

            /** Defines the nodes and entry point of a decision tree. */
            export interface IDecisionTreeData {
                /** Nodes keyed by their unique identifiers. */
                Nodes: Record<string, IDecisionTreeNode>;
                /** Identifier of the first node in the tree. */
                RootId: string;
            }
            
            /** Defines display and export behavior for a record field. */
            export interface IRecordField<R> {
                /** Indicates whether users can sort by the field. */
                AllowSort: boolean,
                /** Indicates whether the field is included as a default column. */
                IsDefaultColumn: boolean,
                /** Optional column label displayed for the field. */
                Label?: string,
                /**
                * Renders the field content for a record.
                * @param item - Record whose field content is rendered.
                * @returns The rendered field content.
                */
                Content?: (item: R) => JSX.Element,
                /**
                * Converts the field value to text for export.
                * @param item - Record being exported.
                * @returns The exported field value.
                */
                ExportConverter?: (item: R) => string
            }

            /** Maps record keys to optional field display and export definitions. */
            export type IRecordFields<T> = {
                [K in keyof T]?: IRecordField<T>;
            };

        }
    }
}

export default Gemstone;
