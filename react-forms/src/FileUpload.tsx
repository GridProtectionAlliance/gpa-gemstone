// ******************************************************************************************************
//  FileUpload.tsx - Gbtc
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
//  01/01/2025 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';

interface IProps {
    /** 
        * Callback function that will be called when a file is uploaded
    * */
    OnLoadHandler: (result: File) => void
    /** 
        * Callback function that will be called when clear button is clicked
    * */
    OnClearHandler: () => void,
    /** 
        * Attribute used to control what type of files are filtered by default in file explorer
        * @type {string}
    * */
    FileTypeAttribute: string
}


const FileUpload = (props: IProps) => {
    const [fileName, setFileName] = React.useState<string | null>(null);
    const [fileSize, setFileSize] = React.useState<number | null>(null);
    const [isFileUpload, setIsFileUploaded] = React.useState<boolean>(false);

    const handleFileUpload = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (evt.target == null || evt.target.files == null || evt.target.files.length === 0) return;

        const file = evt.target.files[0];
        setMetaData(file);
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer == null || e.dataTransfer.files == null || e.dataTransfer.files.length === 0)
            return

        const file = e.dataTransfer.files[0];
        setMetaData(file);

        // Clear drag data after handling
        e.dataTransfer.clearData();
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const handleOnClear = () => {
        setIsFileUploaded(false);
        setFileName(null);
        setFileSize(null);
        props.OnClearHandler();
    }

    const setMetaData = (file: File) => {
        setFileName(file.name);
        setFileSize(file.size);
        props.OnLoadHandler(file);
        setIsFileUploaded(true);
    }

    return (
        <>
            <div className='row'>
                <div className='col-auto mt-2'>
                    <label style={{ cursor: 'pointer' }}>
                        <ReactIcons.ShareArrow Color='var(--info)' />
                        <input type="file" onChange={handleFileUpload} accept={props.FileTypeAttribute} style={{ display: 'none' }} />
                    </label>
                </div>
                <div className='col-auto'>
                    <button className='btn' onClick={handleOnClear}>
                        <ReactIcons.CircledX Color='red' />
                    </button>
                </div>
            </div>
            {isFileUpload ?
                <>
                    <div className='row align-items-center justify-content-center' style={{ border: '2px dashed var(--secondary)' }}>
                        <div className='col-auto'>
                            File Name: {fileName ?? ''}
                        </div>
                        <div className='col-auto'>
                            File Size: {formatFileSize(fileSize)}
                        </div>
                    </div>
                </>
                :
                <div className='row' onDragOver={handleDragOver} onDrop={handleDrop} style={{ border: '2px dashed var(--secondary)' }}>
                    <div className='col-12 pt-3 pb-3 d-flex justify-content-center align-items-center' >
                        <ReactIcons.Image Size={100} />
                        <span>Drag and Drop</span>
                    </div>
                </div>
            }
        </>
    );
}

//Helper Functions
const formatFileSize = (size: number | null): string => {
    if (size === null) return '';
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB'];
    let index = 0;
    let fileSize = size;

    while (fileSize >= 1024 && index < units.length - 1) {
        fileSize /= 1024;
        index++;
    }

    return `${fileSize.toFixed(2)} ${units[index]}`;
};

export default FileUpload;