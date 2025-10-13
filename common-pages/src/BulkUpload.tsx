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

interface IProps<T> {
    /** 
    * Attribute used to control what type of files are filtered by default in file explorer
    * */
    FileTypeAttribute: string,
    /** 
    * Array of available pipelines to use
    * */
    Pipelines: Gemstone.TSX.Interfaces.IPipeline<T, any>[]
    /** 
    * React Component to be used in the Review Step
    * */
    ReviewUI: (props: { Data: T[] }) => JSX.Element
    /** 
    * React Component to be used in the Complete Step
    * */
    CompleteUI?: JSX.Element
    /** 
    * Index of the steps array in the current pipline
    * */
    CurrentPipelineStep: number;
    /** 
    * Setter to pass into the pipeline UI Components
    * */
    SetCurrentPipelineStep: (step: number) => void;
    /** 
    * Step to represent current stage of component
    * */
    Step: Gemstone.TSX.Types.BulkUploadStep
    /**
     * Callback function invoked when the Step prop is set to Complete.
     * @param {T[]} records - The processed records.
     */
    OnComplete: (records: T[]) => void;
    /**
     * Callback function to set validation errors during processing.
     * @param {string[]} errors - Array of error messages.
     */
    SetErrors: (errors: string[]) => void;
    /**
     * Optional Progress Bar component to replace internal Progress Bar. 
     */
    ProgressBar?: JSX.Element,
    /**
     * Optional flag to call OnComplete handler when the review step is hit.
     */
    CompleteOnReview?: boolean
}
const steps = [{ short: 'Upload', long: 'Upload', id: 'Upload' }, { short: 'Process', long: 'Process', id: 'Process' }, { short: "Review", id: 'Review', long: 'Review' }, { short: 'Complete', long: 'Complete', id: 'Complete' }]
const fileExtRegex = /(\.[^.]+)$/;

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
