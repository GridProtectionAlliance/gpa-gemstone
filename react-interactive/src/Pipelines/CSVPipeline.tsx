// ******************************************************************************************************
//  CSVPipeline.tsx - Gbtc
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
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { Paging } from '@gpa-gemstone/react-table';
import ConfigurableColumn from '../ConfigurableTable/ConfigurableColumn'
import ConfigurableTable from '../ConfigurableTable/ConfigurableTable';
import Alert from '../Alert';
import { Gemstone } from '@gpa-gemstone/application-typings';
import { CsvStringToArray } from '@gpa-gemstone/helper-functions';
import * as _ from 'lodash';

interface IAdditionalProps<T> {
    Fields: Gemstone.TSX.Interfaces.ICSVField<T>[],
    DataHasHeaders: boolean,
}

interface IAdditionalUIProps {
    HasHeaders: boolean,
    SetHasHeaders: (hasHeaders: boolean) => void
}

const AdditionalUploadUI = (props: IAdditionalUIProps) => {
    return (
        <div className='row justify-content-center m-0'>
            <div className='col-6 p-0'>
                <CheckBox Record={{ HasHeaders: props.HasHeaders }} Field="HasHeaders" Setter={(record) => props.SetHasHeaders(record.HasHeaders)} Label='My Data Has Headers' />
            </div>
        </div>
    )
}

export function useCSVPipeline<T = unknown>(csvFields: Gemstone.TSX.Interfaces.ICSVField<T>[]): Gemstone.TSX.Interfaces.IPipeline<T, IAdditionalProps<T>> {
    const [hasHeaders, setHasHeaders] = React.useState<boolean>(false);
    return {
        Select: (mimeType: string, fileExt: string) => mimeType.toLowerCase() === 'text/csv' || fileExt === 'csv',
        Steps: [{ Label: 'Edit CSV', UI: CsvPipelineEditStep, AdditionalProps: { Fields: csvFields, DataHasHeaders: hasHeaders } }],
        AdditionalUploadUI: <AdditionalUploadUI HasHeaders={hasHeaders} SetHasHeaders={setHasHeaders} />
    }
}

function CsvPipelineEditStep<T>(props: Gemstone.TSX.Interfaces.IPipelineStepProps<T, IAdditionalProps<T>>) {
    const rawDataRef = React.useRef<string>();

    const [headers, setHeaders] = React.useState<string[]>([]);
    const [headerMap, setHeaderMap] = React.useState<Map<string, keyof T | undefined>>(new Map<string, keyof T | undefined>());

    const [data, setData] = React.useState<string[][]>([]);
    const [pagedData, setPagedData] = React.useState<string[][]>([]);


    const [isFileParseable, setIsFileParseable] = React.useState<boolean>(true);
    const [isCSVMissingHeaders, setIsCSVMissingHeaders] = React.useState<boolean>(false);
    const [isCSVMissingDataCells, setIsCSVMissingDataCells] = React.useState<boolean>(false);


    const [page, setPage] = React.useState<number>(0);
    const [totalPages, setTotalPages] = React.useState<number>(1);

    const [showDataHeaderAlert, setShowDataHeaderAlert] = React.useState<boolean>(true);
    const [showDataOrHeaderAlert, setShowDataOrHeaderAlert] = React.useState<boolean>(true);

    React.useEffect(() => {
        if (data.length === 0) return

        const pages = Math.ceil(data.length / 10);
        setTotalPages(pages);
        const Data = [...data]
        setPagedData(Data.slice(page * 10, (page + 1) * 10));

    }, [data, page]);

    React.useEffect(() => {
        const errors: string[] = [];
        if (props.AdditionalProps == null) return

        props.AdditionalProps.Fields.forEach(field => {
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
                if (!field.AllowEmpty && (value == null || (value ?? '').trim() === ""))
                    errors.push(`All ${field.Label} cannot be empty.`);

                //Check validity
                if (!field.Validate(value))
                    errors.push(`All ${field.Label} must contain valid values.`)

            });
        });

        props.SetErrors(errors);
    }, [data, headers, headerMap, isFileParseable]);

    React.useEffect(() => {
        if (props.RawFileData == null || props.AdditionalProps == null || rawDataRef.current === props.RawFileData) return
        let parsedData: { Headers: string[], Data: string[][], AddedMissingHeaders: boolean, AddedMissingDataValues: boolean }
        try {
            parsedData = parseCSV(props.RawFileData, props.AdditionalProps.DataHasHeaders, props.AdditionalProps.Fields.filter(field => field.Required).length);
        }
        catch {
            setIsFileParseable(false)
            return
        }
        setIsFileParseable(true);
        setIsCSVMissingDataCells(parsedData.AddedMissingDataValues);
        setIsCSVMissingHeaders(parsedData.AddedMissingHeaders);
        setData(parsedData.Data);
        setHeaders(parsedData.Headers);
        setHeaderMap(autoMapHeaders(parsedData.Headers, props.AdditionalProps.Fields.map(field => field.Field)))
        rawDataRef.current = props.RawFileData;

    }, [props.RawFileData, props.AdditionalProps]);

    React.useEffect(() => {
        if (props.AdditionalProps == null || props.Errors.length !== 0) return;
        const mappedData: T[] = [];

        data.forEach((row) => {
            let record: T = {} as T;

            headers.forEach((header, index) => {
                const mappedField = headerMap.get(header);
                if (mappedField == null) return;

                const field = props.AdditionalProps?.Fields.find(f => f.Field === mappedField);
                if (field == null) return;

                const value = row[index + 1];
                record = field.Process(value, record);
            });

            mappedData.push(record);
        });

        props.SetData(mappedData);
    }, [data, headers, headerMap, props.AdditionalProps?.Fields, props.Errors]);

    const getFieldSelect = React.useCallback((header: string) => {
        if (props.AdditionalProps == null || props.AdditionalProps?.Fields.length === 0) return

        const field = headerMap.get(header);

        const updateMap = (head: string, val: keyof T | undefined) => setHeaderMap(new Map(headerMap).set(head, val));
        const matchedField: Gemstone.TSX.Interfaces.ICSVField<T> | undefined = props.AdditionalProps.Fields.find(f => f.Field === field);
        const help = matchedField?.Help != null ? <p style={{ whiteSpace: 'nowrap' }}>={matchedField?.Help}</p> : undefined

        return <Select<{ Header: string, Value: string | undefined }> Record={{ Header: header, Value: field as string }} EmptyOption={true} Options={props.AdditionalProps.Fields.map(field => ({ Value: field.Field as string, Label: field.Label }))} Field="Value"
            Setter={(record) => updateMap(record.Header, record.Value as keyof T)} Label={' '} Help={help} />

    }, [props.AdditionalProps?.Fields, headerMap])

    const handleValueChange = (rowIndex: number, colIndex: number, value: string) => {
        setData(prevData => {
            const newData = [...prevData];
            newData[rowIndex][colIndex] = value;
            return newData;
        });
    };

    const handleRowDelete = (rowIndex: number) => {
        const newData = [...data]
        newData.splice(rowIndex, 1)
        setData(newData)
    }

    const getHeader = (header: string) => {
        if (props.AdditionalProps == null) return
        const mappedField = headerMap.get(header);

        if (mappedField == null) return header

        const matchedField = props.AdditionalProps.Fields.find(field => field.Field === mappedField)
        if (matchedField == null) return header
        return null //return null since the select element will have a label attached to it 
    }

    return (
        <>
            <div className="container-fluid d-flex flex-column p-0 h-100">
                <div className='row h-100'>
                    <div className='col-12 d-flex flex-column h-100'>
                        {pagedData.length !== 0 ?
                            <>
                                {isCSVMissingDataCells && isCSVMissingHeaders ? (
                                    <div className='row'>
                                        <div className='col-12'>
                                            <Alert AlertColor='alert-info' Show={showDataHeaderAlert} SetShow={setShowDataHeaderAlert}>
                                                <p style={{ whiteSpace: 'nowrap' }}>
                                                    Missing data cells were added to meet the number of required fields.
                                                </p>
                                                <hr />
                                                <p style={{ whiteSpace: 'nowrap' }}>
                                                    Missing headers were added to meet the number of required fields.
                                                </p>
                                            </Alert>
                                        </div>
                                    </div>

                                ) : isCSVMissingDataCells || isCSVMissingHeaders ? (
                                    <div className='row'>
                                        <div className='col-12'>
                                            <Alert AlertColor='alert-info' Show={showDataOrHeaderAlert} SetShow={setShowDataOrHeaderAlert}>
                                                <p style={{ whiteSpace: 'nowrap' }}>
                                                    {isCSVMissingDataCells ? 'Missing data cells were added to meet the number of required fields.' : 'Missing headers were added to meet the number of required fields.'}
                                                </p>
                                            </Alert>
                                        </div>
                                    </div>
                                ) : null}
                                <div className='row flex-grow-1' style={{overflowY: 'hidden'}}>
                                    <div className='col-12 h-100'>
                                        <ConfigurableTable<string[]>
                                            Data={pagedData}
                                            SortKey=''
                                            Ascending={false}
                                            OnSort={() => {/*no sort*/ }}
                                            KeySelector={data => data[0]}
                                            TheadStyle={{ width: '100%', display: 'table-header-group', }}
                                            TbodyStyle={{ width: '100%', display: 'block', height: '100%' }}
                                            RowStyle={{ display: 'table-row', width: '100%', height: 'auto' }}
                                            TableStyle={{ width: '100%', height: '100%', tableLayout: 'fixed', marginBottom: 0, display: 'block' }}
                                            TableClass='table'
                                            ModalZIndex={9995}
                                        >
                                            {headers.map((header, i) =>
                                                <ConfigurableColumn Key={header} Label={header} Default={true}>
                                                    <ReactTable.Column<string[]>
                                                        Key={header}
                                                        Field={i + 1}
                                                        AllowSort={false}
                                                        Content={({ item, field }) => {
                                                            if (props.AdditionalProps == null) return
                                                            const mappedField = headerMap.get(header);
                                                            const matchedField = props.AdditionalProps.Fields.find(f => f.Field === mappedField);
                                                            if (matchedField == null) return item[field as number];

                                                            const value = item[field as number];
                                                            const isValid = matchedField.Validate(value);
                                                            const feedback = matchedField.Feedback

                                                            const allValues: Partial<Record<keyof T, string>> = {};
                                                            headers.forEach((header, index) => {
                                                                const mappedField = headerMap.get(header);
                                                                if (mappedField != null) {
                                                                    allValues[mappedField] = item[index + 1];
                                                                }
                                                            });

                                                            return (
                                                                <matchedField.EditComponent
                                                                    Value={value}
                                                                    SetValue={(val: string) => handleValueChange(parseInt(item[0]), field as number, val)}
                                                                    Valid={isValid}
                                                                    Feedback={feedback}
                                                                    AllRecordValues={allValues}
                                                                />
                                                            );
                                                        }}
                                                    >
                                                        {getHeader(header)}
                                                        {getFieldSelect(header)}
                                                    </ReactTable.Column>
                                                </ConfigurableColumn>
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
                                        </ConfigurableTable>
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

//Helper functions
function autoMapHeaders<T>(headers: string[], fields: (Array<keyof T>)) {
    if (headers.length === 0 || fields.length === 0) return new Map<string, keyof T | undefined>()
    const map = new Map<string, keyof T | undefined>()
    headers.forEach(header => {
        const match = fields.find(field => field === header);
        if (match != null)
            map.set(match.toString(), match)
    })
    return map
}

const parseCSV = (csvContent: string, hasHeaders: boolean, numOfRequiredFields: number) => {
    const rows: string[][] = CsvStringToArray(csvContent);
    const headers: string[] = hasHeaders ? rows[0] : [];
    let data: string[][] = hasHeaders ? rows.slice(1) : rows;
    data = data.map((row, index) => [(index).toString(), ...row]); // Add index at the beginning of row

    let missingHeaders = false;
    let missingData = false;

    if (hasHeaders) {
        // Adjust headers to match numOfRequiredFields
        if (headers.length < numOfRequiredFields) {
            missingHeaders = true;
            while (headers.length < numOfRequiredFields) {
                headers.push(String.fromCharCode(65 + headers.length)); // A, B, C, etc.
            }
        }
        // Fix headers so no duplicates
        for (let headerIndex = 0; headerIndex < headers.length; headerIndex ++) {
            let count = 1;
            for (let index = 0; index < headerIndex; index++) {
                if (headers[headerIndex] === headers[index]) {
                    // Change header and restart loop to look for another duplicate
                    headers[headerIndex] += `_${count}`;
                    count++;
                    index = -1;
                    continue;
                }
            }
        };
    }
    else {
        const colCount = rows[0].length - 1 < numOfRequiredFields ? numOfRequiredFields : rows[0].length - 1;
        missingData = rows[0].length - 1 < numOfRequiredFields
        for (let i = 0; i < colCount; i++) {
            headers.push(String.fromCharCode(65 + i)); // A, B, C, etc.
        }
    }

    if (data.some(d => d.length - 1 < numOfRequiredFields)) {
        data = data.map(row => {
            if (row.length - 1 < numOfRequiredFields) {
                missingData = true;
                const missingDataVals = Array(numOfRequiredFields - (row.length - 1)).fill('');
                return [...row, ...missingDataVals];
            }
            return row
        });
    }

    return { Headers: headers, Data: data, AddedMissingHeaders: missingHeaders, AddedMissingDataValues: missingData };
};