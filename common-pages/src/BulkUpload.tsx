// ******************************************************************************************************
//  BulkUpload.tsx - Gbtc
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
//  07/24/2024 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import { ProgressBar } from '@gpa-gemstone/react-interactive';
import { Gemstone } from '@gpa-gemstone/application-typings';
import { FileUpload } from '@gpa-gemstone/react-forms';

/** Configures the bulk upload workflow and its processing pipelines. */
interface IProps<T> {
    /**
     * File type accepted by the system file picker.
     */
    FileTypeAttribute: string,
    /**
     * Processing pipelines available for the uploaded file.
     */
    Pipelines: Gemstone.TSX.Interfaces.IPipeline<T, any>[]
    /**
     * Renders the processed records during the review step.
     * @param props - Data made available to the review UI.
     */
    ReviewUI: (props: { Data: T[] }) => JSX.Element
    /**
     * Optional content rendered during the complete step.
     */
    CompleteUI?: JSX.Element
    /**
     * Index of the active step within the selected pipeline.
     */
    CurrentPipelineStep: number;
    /**
     * Updates the active step within the selected pipeline.
     * @param step - Index of the pipeline step to activate.
     */
    SetCurrentPipelineStep: (step: number) => void;
    /**
     * Stage currently displayed by the bulk upload workflow.
     */
    Step: Gemstone.TSX.Types.BulkUploadStep
    /**
     * Handles completion of the upload workflow.
     * @param records - Processed records produced by the selected pipeline.
     */
    OnComplete: (records: T[]) => void;
    /**
     * Updates validation errors reported by the upload workflow.
     * @param errors - Error messages to display.
     */
    SetErrors: (errors: string[]) => void;
    /**
     * Optional progress indicator rendered instead of the built-in progress bar.
     */
    ProgressBar?: JSX.Element,
    /**
     * Optional flag that completes the workflow upon reaching the review step, defaulting to false.
     */
    CompleteOnReview?: boolean
}
const steps = [{ short: 'Upload', long: 'Upload', id: 'Upload' }, { short: 'Process', long: 'Process', id: 'Process' }, { short: "Review", id: 'Review', long: 'Review' }, { short: 'Complete', long: 'Complete', id: 'Complete' }]
const fileExtRegex = /(\.[^.]+)$/;

/**
 * Guides an uploaded file through selection, processing, review, and completion steps.
 * @param props - Pipeline configuration and state for the bulk upload workflow.
 * @returns Bulk upload workflow UI for the active step.
 */
export default function BulkUpload<T>(props: IProps<T>) {
    const [data, setData] = React.useState<T[]>([]);

    const [pipelineErrors, setPipelineErrors] = React.useState<string[]>([]);

    const [fileName, setFileName] = React.useState<string | null>(null);
    const [rawFileContent, setRawFileContent] = React.useState<string | null>(null);

    const [currentPipelineIndex, setCurrentPipelineIndex] = React.useState<number | null>(null);
    const [isFileTypeValid, setIsFileTypeValid] = React.useState<boolean>(true);

    const [activeProgressStep, setActiveProgressStep] = React.useState<string | number>('Upload');

    const pipelineUI = React.useMemo(() => {
        if (props.Step === 'Upload' || props.Step === 'Complete' || currentPipelineIndex == null || currentPipelineIndex > props.Pipelines.length - 1 || props.CurrentPipelineStep > props.Pipelines?.[currentPipelineIndex]?.Steps?.length - 1) return <></>
        const pipeline = props.Pipelines[currentPipelineIndex].Steps[props.CurrentPipelineStep]
        return <pipeline.UI AdditionalProps={props.Pipelines[currentPipelineIndex].Steps[props.CurrentPipelineStep]?.AdditionalProps} RawFileData={rawFileContent} SetData={setData} Data={data}
            SetPipelineStep={props.SetCurrentPipelineStep} CurrentPipelineStep={props.CurrentPipelineStep} Errors={pipelineErrors} SetErrors={setPipelineErrors} />
    }, [props.Step, currentPipelineIndex, rawFileContent, props.CurrentPipelineStep, props.Pipelines])

    const progressSteps = React.useMemo(() => {
        if (props.ProgressBar != null) return []
        if (currentPipelineIndex == null || currentPipelineIndex > props.Pipelines.length - 1 || props.CurrentPipelineStep > props.Pipelines?.[currentPipelineIndex]?.Steps?.length - 1) return steps

        const pipelineSteps = props.Pipelines[currentPipelineIndex].Steps.map((step, i) => ({ short: step.Label, long: step.Label, id: i }))
        const uploadIndex = steps.findIndex(step => step.short === 'Upload')
        const progressIndex = steps.findIndex(step => step.short === 'Process')
        const remainingSteps = steps.slice(progressIndex + 1);

        return [steps[uploadIndex]].concat(pipelineSteps as any, remainingSteps)
    }, [currentPipelineIndex, props.Pipelines])

    React.useEffect(() => {
        if (props.Step !== 'Process') {
            setActiveProgressStep(props.Step);
            return
        }

        if (currentPipelineIndex == null || currentPipelineIndex > props.Pipelines.length - 1 || props.CurrentPipelineStep > props.Pipelines?.[currentPipelineIndex]?.Steps?.length - 1) return
        setActiveProgressStep(props.CurrentPipelineStep); //ids for conditional progressSteps are index of the pipeline steps
    }, [props.CurrentPipelineStep, currentPipelineIndex, props.Step])

    React.useEffect(() => {
        const pipelineErrs = props.Step == 'Process' ? pipelineErrors : [];
        const errors: string[] = [...pipelineErrs];

        if (props.Step === 'Upload') {
            if (fileName == null)
                errors.push('A file must be uploaded to continue');

            if (rawFileContent == null || rawFileContent == '')
                errors.push('File content is empty');

            if (!isFileTypeValid)
                errors.push(`File must be of type ${props.FileTypeAttribute}`);
        }

        props.SetErrors(errors);
    }, [rawFileContent, fileName, isFileTypeValid, pipelineErrors, props.Step]);

    React.useEffect(() => {
        if ((props.Step === 'Review' && (props.CompleteOnReview ?? false)) || props.Step === 'Complete')
            props.OnComplete(data);
    }, [props.Step, props.CompleteOnReview, data]);

    const handleFileUpload = (file: File) => {
        return new Promise<void>((resolve, reject) => {
            try {
                if(file == null){
                    reject();
                    return;
                }
                const matchArray = file.name.match(fileExtRegex);
                const fileExtension = matchArray != null ? matchArray[0].substring(1) : ''

                const pipelineIndex = props.Pipelines.findIndex(pipe => pipe.Select(file.type, fileExtension))

                if (pipelineIndex == -1) {
                    setIsFileTypeValid(false);
                    reject();
                    return;
                }

                setCurrentPipelineIndex(pipelineIndex);
                setFileName(file.name);

                const fileReader = new FileReader();
                fileReader.readAsText(file);

                fileReader.onload = (e) => {
                    if (e.target == null){
                        reject();
                        return;
                    }

                    setRawFileContent(e.target.result as string);
                    resolve()
                };

                fileReader.onerror = () => reject();
            }
            catch {
                reject();
            }
        })

    }

    const handleFileOnClear = () => {
        setIsFileTypeValid(true);
        setCurrentPipelineIndex(null);
        setFileName(null);
        setRawFileContent(null);
    }

    return (
        <div className="container-fluid d-flex flex-column p-0 h-100">
            <div className='row h-100'>
                <div className='col-12 d-flex flex-column h-100'>
                    <div className='row'>
                        <div className='col-12'>
                            {props.ProgressBar != null ? props.ProgressBar :
                                <ProgressBar steps={progressSteps} activeStep={activeProgressStep} />
                            }
                        </div>
                    </div>
                    {props.Step === 'Upload' ?
                        <>
                            <div className='row justify-content-center'>
                                <div className='col-6'>
                                    <FileUpload OnLoadHandler={handleFileUpload} OnClearHandler={handleFileOnClear} FileTypeAttribute={props.FileTypeAttribute} />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-12 h-100'>
                                    {currentPipelineIndex != null && props.Pipelines[currentPipelineIndex]?.AdditionalUploadUI != null ? props.Pipelines[currentPipelineIndex]?.AdditionalUploadUI : null}
                                </div>
                            </div>
                        </>
                        : null}
                    <div className={`${props.Step !== 'Process' ? 'd-none' : 'row flex-grow-1'}`} style={{ overflowY: 'hidden' }}>
                        <div className='col-12 h-100'>
                            {pipelineUI}
                        </div>
                    </div>

                    {props.Step === 'Review' || (props.Step === 'Complete' && props.CompleteUI != null) ?
                        <div className='row flex-grow-1' style={{ overflowY: 'hidden' }}>
                            <div className='col-12 h-100'>
                                {props.Step == 'Review' ? <props.ReviewUI Data={data} /> : props.Step === 'Complete' ? props.CompleteUI : null}
                            </div>
                        </div> : null}
                </div>
            </div>
        </div>
    );
}
