// ******************************************************************************************************
//  UploadCSV.tsx - Gbtc
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
import { CheckBox, Select } from '@gpa-gemstone/react-forms';
import { ReactTable } from '@gpa-gemstone/react-table';
import { ConfigTable } from './index';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { Paging } from '@gpa-gemstone/react-table'
import ProgressBar from './ProgressBar';
import { Gemstone } from '@gpa-gemstone/application-typings';

interface IProps<T> {
    /**
     * Array of field definitions used to process and validate CSV data.
     * @type {ICSVField<T>[]}
     */
    Fields: Gemstone.TSX.Interfaces.ICSVField<T>[];
    /** 
    * Step to represent current stage of component
    * @type {'Upload' | 'Process' | 'Complete'}
    * */
    Step: 'Upload' | 'Process' | 'Complete'
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

const steps = [{ short: 'Upload', long: 'Upload', id: 'Upload' }, { short: 'Process', long: 'Process', id: 'Process' }, { short: 'Complete', long: 'Complete', id: 'Complete' }]

export default function UploadCSV<T>(props: IProps<T>) {
    const [headers, setHeaders] = React.useState<string[]>([]);
    const [data, setData] = React.useState<string[][]>([]);
    const [pagedData, setPagedData] = React.useState<string[][]>([]);

    const [dataHasHeaders, setDataHasHeaders] = React.useState<boolean>(false);
    const [headerMap, setHeaderMap] = React.useState<Map<string, string | undefined>>(new Map<string, string | undefined>());

    const [fileName, setFileName] = React.useState<string | null>(null);
    const [rawCSVContent, setRawCSVContent] = React.useState<string | null>(null);

    const [isFileCSV, setIsFileCSV] = React.useState<boolean>(true);
    const [isFileParseable, setIsFileParseable] = React.useState<boolean>(true);

    const [page, setPage] = React.useState<number>(0);
    const [totalPages, setTotalPages] = React.useState<number>(1);

    React.useEffect(() => {
        if (data.length > 0) {
            const pages = Math.ceil(data.length / 10);
            setTotalPages(pages);
            setPagedData(data.slice(page * 10, (page + 1) * 10));
        }
    }, [data, page]);

    React.useEffect(() => {
        const errors: string[] = [];
        if (fileName == null)
            errors.push('A file must be uploaded to continue')

        if (!isFileCSV)
            errors.push('File is not a CSV')

        if (!isFileParseable)
            errors.push('File could not be parsed')

        if (props.Step !== 'Upload')
            props.Fields.forEach(field => {
                const matchedHeader = Array.from(headerMap.entries()).find(([, value]) => value === field.Field)?.[0];
                if (matchedHeader == null) {
                    if (field.Required)
                        errors.push(`${field.Label} is required and must be mapped to a header.`);

                    return; // return early if the field was never mapped to a header
                }

                const fieldIndex = headers.indexOf(matchedHeader);
                const uniqueValues = new Set<string>();

                //Need to also make sure that all the fields that have the Required flag got mapped to a header...
                data.forEach(row => {
                    const value = row[fieldIndex + 1]; //+1 for row index value

                    // Check uniqueness
                    if (field.Unique) {
                        if (uniqueValues.has(value))
                            errors.push(`All ${field.Label} values must be unique.`);
                        else
                            uniqueValues.add(value);
                    }

                    // Check allowed emptiness
                    if (!field.AllowEmpty && (value == null || value.trim() === ""))
                        errors.push(`All ${field.Label} cannot be empty.`);

                    //Check validity
                    if(!field.Validate(value))
                        errors.push(`All ${field.Label} must contain valid values.`)

                });
            });

        props.SetErrors(errors);
    }, [data, headers, headerMap, isFileCSV, isFileParseable, props.Step]);

    React.useEffect(() => {
        if (props.Step === 'Upload' && rawCSVContent !== null) {
            let parsedData: { Headers: string[], Data: string[][] }
            try {
                parsedData = parseCSV(rawCSVContent, dataHasHeaders);
            }
            catch {
                setIsFileParseable(false)
                return
            }
            setIsFileParseable(true);
            setData(parsedData.Data);
            setHeaders(parsedData.Headers);
            setHeaderMap(autoMapHeaders(parsedData.Headers, props.Fields.map(field => field.Field as string), headerMap))
        }
    }, [props.Step, rawCSVContent, dataHasHeaders]);

    React.useEffect(() => {
        if (props.Step !== 'Complete') return;
        const mappedData: T[] = [];

        data.forEach((row) => {
            let record: T = {} as T;

            headers.forEach((header, index) => {
                const mappedField = headerMap.get(header);
                if (mappedField == null) return;

                const field = props.Fields.find(f => f.Field === mappedField);
                if (field == null) return;

                const value = row[index + 1];
                record = field.Process(value, record);
            });

            mappedData.push(record);
        });

        props.OnComplete(mappedData);
        resetStates();
    }, [props.Step, data, headers, headerMap, props.Fields, props.OnComplete]);

    const getFieldSelect = React.useCallback((header: string) => {
        if (props.Fields.length === 0) return

        const field = headerMap.get(header);

        const updateMap = (head: string, val: string | undefined) => setHeaderMap(new Map(headerMap).set(head, val));
        const matchedField: Gemstone.TSX.Interfaces.ICSVField<T> | undefined = props.Fields.find(f => f.Field === field);

        return <Select<{ Header: string, Value: string | undefined }> Record={{ Header: header, Value: field }} EmptyOption={true} Options={props.Fields.map(field => ({ Value: field.Field as string, Label: field.Label }))} Field="Value"
            Setter={(record) => updateMap(record.Header, record.Value)} Label={' '} Help={matchedField?.Help} />

    }, [props.Fields, headerMap])

    const handleValueChange = (rowIndex: number, colIndex: number, value: string) => {
        setData(prevData => {
            const newData = [...prevData];
            newData[rowIndex][colIndex] = value;
            return newData;
        });
    };

    const handleFileUpload = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (evt.target == null || evt.target.files == null || evt.target.files.length === 0) return;

        const file = evt.target.files[0];

        if (file.type !== 'text/csv') {
            setIsFileCSV(false);
            return;
        }

        setIsFileCSV(true);
        setFileName(file.name);

        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            if (e.target == null) return;
            if (rawCSVContent != null) //reset map if they change csv files
                setHeaderMap(new Map<string, string | undefined>());

            setRawCSVContent(e.target.result as string);
        };

        fileReader.readAsText(file);
    }

    const handleRowDelete = (rowIndex: number) => setData(prevData => prevData.filter((_, index) => index !== rowIndex));

    const getHeader = (header: string) => {
        const mappedField = headerMap.get(header);

        if (mappedField == null) return header

        const matchedField = props.Fields.find(field => field.Field === mappedField)
        if (matchedField == null) return header
        return null //return null since the select element will have a label attached to it 
    }

    const resetStates = () => {
        setHeaders([]);
        setData([]);
        setPagedData([]);
        setDataHasHeaders(false);
        setHeaderMap(new Map<string, string | undefined>());
        setFileName(null);
        setRawCSVContent(null);
        setIsFileCSV(true);
        setIsFileParseable(true);
        setPage(0);
        setTotalPages(1);
    }

    return (
        <>
            <div className="container-fluid d-flex flex-column p-0 h-100">
                <div className='row h-100'>
                    <div className='col-12 d-flex flex-column h-100'>
                        <div className='row'>
                            <div className='col-12'>
                                <ProgressBar steps={steps} activeStep={props.Step} />
                            </div>
                        </div>
                        {props.Step === 'Upload' ?
                            <>
                                <div className='row justify-content-center'>
                                    <div className='col-6'>
                                        <div className="custom-file">
                                            <input type="file" className="custom-file-input" id="inputGroupFile02" onChange={handleFileUpload} accept='.csv, text/csv' style={{ cursor: 'pointer' }} />
                                            <label className="custom-file-label" htmlFor="inputGroupFile02" aria-describedby="inputGroupFileAddon02">{fileName == null ? 'Upload CSV' : fileName}</label>
                                        </div>
                                    </div>
                                </div>
                                <div className='row justify-content-center'>
                                    <div className='col-6'>
                                        <CheckBox Record={{ HasHeaders: dataHasHeaders }} Field="HasHeaders" Setter={(record) => setDataHasHeaders(record.HasHeaders)} Label='My Data Has Headers' />
                                    </div>
                                </div>
                            </>
                            : null}
                        {pagedData.length !== 0 && props.Step === 'Process' ?
                            <>
                                <div className='row flex-grow-1'>
                                    <div className='col-12 h-100 '>
                                        <ConfigTable.Table<string[]>
                                            Data={pagedData}
                                            SortKey=''
                                            Ascending={false}
                                            OnSort={() => {/*no sort*/ }}
                                            KeySelector={data => data[0]}
                                            TheadStyle={{ width: 'auto', fontSize: 'auto', tableLayout: 'fixed', display: 'table', }}
                                            TbodyStyle={{ width: 'auto', display: 'block', flex: 1 }}
                                            TableClass='table'
                                            TableStyle={{ padding: 0, width: 'calc(100%)', height: '100%', tableLayout: 'fixed', display: 'flex', flexDirection: 'column', marginBottom: 0 }}
                                            RowStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%' }}

                                        >
                                            {headers.map((header, i) =>
                                                <ConfigTable.Configurable Key={header} Label={header} Default={true}>
                                                    <ReactTable.Column<string[]>
                                                        Key={header}
                                                        Field={i + 1}
                                                        AllowSort={false}
                                                        Content={({ item, field }) => {
                                                            const mappedField = headerMap.get(header);
                                                            const matchedField = props.Fields.find(f => f.Field === mappedField);
                                                            if (matchedField == null) return item[field as number];

                                                            const value = item[field as number];
                                                            const isValid = matchedField.Validate(value);
                                                            const feedback = matchedField.Feedback
                                                            return (
                                                                <matchedField.EditComponent
                                                                    Value={value}
                                                                    SetValue={(val: string) => handleValueChange(parseInt(item[0]), field as number, val)}
                                                                    Valid={isValid}
                                                                    Feedback={feedback}
                                                                />
                                                            );
                                                        }}
                                                    >
                                                        {getHeader(header)}
                                                        {getFieldSelect(header)}
                                                    </ReactTable.Column>
                                                </ConfigTable.Configurable>
                                            )}
                                            <ReactTable.Column<string[]>
                                                Key={'delete'}
                                                Field={0}
                                                AllowSort={false}
                                                RowStyle={{ textAlign: 'right' }}
                                                Content={({ item }) => {
                                                    return (
                                                        <button className='btn' onClick={() => handleRowDelete(parseInt(item[0]))}>
                                                            <ReactIcons.TrashCan Color="red" />
                                                        </button>
                                                    )
                                                }}
                                            >
                                                {''}
                                            </ReactTable.Column>
                                        </ConfigTable.Table>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12'>
                                        <Paging Current={page + 1} Total={totalPages} SetPage={(p) => setPage(p - 1)} />
                                    </div>
                                </div>
                            </>
                            : null}
                    </div>
                </div>
            </div>
        </>
    );
}


const autoMapHeaders = (headers: string[], fields: string[], headerMap: Map<string, string | undefined>) => {
    if (headers.length === 0 || fields.length === 0) return headerMap
    const map = new Map<string, string | undefined>(headerMap)

    headers.forEach(header => {
        const match = fields.find(field => field === header);
        if (match != null)
            map.set(match, match)
    })
    return map
}

const parseCSV = (csvContent: string, hasHeaders: boolean) => {
    const rows = csvContent.split('\n').map(row => row.trim()).filter(row => row.length > 0);
    let headers: string[] = [];
    let data: string[][] = [];

    if (hasHeaders) {
        headers = rows[0].split(',').map(header => header.trim());
        data = rows.slice(1).map((r, i) => (`${i},${r}`.split(',')));
    } else {
        const colCount = rows[0].split(',').length;

        for (let i = 0; i < colCount; i++) {
            headers.push(String.fromCharCode(65 + i)); // A, B, C, etc.
        }
        data = rows.map((r, i) => (`${i},${r}`.split(',')));
    }

    return { Headers: headers, Data: data };
};
