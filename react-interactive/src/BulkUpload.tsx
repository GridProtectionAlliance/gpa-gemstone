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
import ProgressBar from './ProgressBar';
import { Gemstone } from '@gpa-gemstone/application-typings';

interface IProps<T> {
    /** 
    * Attribute used to control what type of files are filtered by default in file explorer
    * @type {string}
    * */
    FileTypeAttribute: string,
    /** 
    * Array of available pipelines to use
    * @type {IPipeline[]}
    * */
    Pipelines: Gemstone.TSX.Interfaces.IPipeline<T, any>[]
    /** 
    * React Component to be used in the Review Step
    * @type {React.FC<IReviewProps<T>>}
    * */
    ReviewUI: (props: { Data: T[] }) => JSX.Element
    /** 
    * React Component to be used in the Review Step
    * @type {React.FC<IReviewProps<T>>}
    * */
    CompleteUI?: JSX.Element
    /** 
    * Index of the steps array in the current pipline
    * @type {React.FC<IReviewProps<T>>}
    * */
    CurrentPipelineStep: number;
    /** 
    * Setter to pass into the pipeline UI Components
    * @type {React.FC<IReviewProps<T>>}
    * */
    SetCurrentPipelineStep: (step: number) => void;
    /** 
    * Step to represent current stage of component
    * @type {'Upload' | 'Process' | 'Review' | 'Complete'}
    * */
    Step: Gemstone.TSX.Types.BulkUploadStep
    /**
     * Callback function invoked when the Step prop is set to Complete.
     * @param {T[]} records - The processed records.
     */
    OnComplete: (records: T[]) => void;
    /**
     * Callback function to set errors encountered during CSV processing.
     * @param {string[]} errors - Array of error messages.
     */
    SetErrors: (errors: string[]) => void;
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
        return <pipeline.UI AdditionalProps={props.Pipelines[currentPipelineIndex].Steps[props.CurrentPipelineStep]?.AdditionalProps} RawFileData={rawFileContent} SetData={setData}
            SetPipelineStep={props.SetCurrentPipelineStep} CurrentPipelineStep={props.CurrentPipelineStep} Errors={pipelineErrors} SetErrors={setPipelineErrors} />
    }, [props.Step, currentPipelineIndex, rawFileContent, props.CurrentPipelineStep, props.Pipelines])

    const progressSteps = React.useMemo(() => {
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

        if (fileName == null)
            errors.push('A file must be uploaded to continue')

        if (rawFileContent == null || rawFileContent == '')
            errors.push('File content is empty')

        if (!isFileTypeValid)
            errors.push(`File must be of type ${props.FileTypeAttribute}`)

        props.SetErrors(errors);
    }, [rawFileContent, fileName, isFileTypeValid, pipelineErrors, props.Step]);

    React.useEffect(() => {
        if (props.Step !== 'Complete') return;
        props.OnComplete(data);
    }, [props.Step, data, props.OnComplete]);

    const handleFileUpload = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (evt.target == null || evt.target.files == null || evt.target.files.length === 0) return;

        const file = evt.target.files[0];

        const matchArray = file.name.match(fileExtRegex);
        const fileExtension = matchArray != null ? matchArray[0].substring(1) : ''

        const pipelineIndex = props.Pipelines.findIndex(pipe => pipe.Select(file.type, fileExtension))

        if (pipelineIndex == -1) {
            setIsFileTypeValid(false);
            return;
        }

        setCurrentPipelineIndex(pipelineIndex);
        setFileName(file.name);

        const fileReader = new FileReader();
        fileReader.readAsText(file);

        fileReader.onload = (e) => {
            if (e.target == null) return;

            setRawFileContent(e.target.result as string);
        };
    }

    return (
        <div className="container-fluid d-flex flex-column p-0 h-100">
            <div className='row h-100'>
                <div className='col-12 d-flex flex-column h-100'>
                    <div className='row'>
                        <div className='col-12'>
                            <ProgressBar steps={progressSteps} activeStep={activeProgressStep} />
                        </div>
                    </div>
                    {props.Step === 'Upload' ?
                        <>
                            <div className='row justify-content-center'>
                                <div className='col-6'>
                                    <div className="custom-file">
                                        <input type="file" className="custom-file-input" id="inputGroupFile02" onChange={handleFileUpload} accept={props.FileTypeAttribute} style={{ cursor: 'pointer' }} />
                                        <label className="custom-file-label" htmlFor="inputGroupFile02" aria-describedby="inputGroupFileAddon02">{fileName == null ? 'Upload File' : fileName}</label>
                                    </div>
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
