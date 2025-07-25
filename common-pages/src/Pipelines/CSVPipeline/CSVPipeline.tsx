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
import { Gemstone } from '@gpa-gemstone/application-typings';
import { CsvStringToArray } from '@gpa-gemstone/helper-functions';
import { Alert } from '@gpa-gemstone/react-interactive';
import { CheckBox, Select } from '@gpa-gemstone/react-forms';
import { Column, Table, Paging } from '@gpa-gemstone/react-table';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { isEqual } from 'lodash';
import ErrorBoundary from '../../ErrorBoundary';
import { CSVFieldEditContext } from './CSVFieldContext';

interface IAdditionalProps<T> {
    Fields: Gemstone.TSX.Interfaces.ICSVField<T>[],
    DataHasHeaders: boolean,
    Headers: string[],
    SetHeaders: (headers: string[]) => void,
    Data: string[][],
    SetData: (d: string[][]) => void,
    HeaderMap: Map<string, keyof T | undefined>,
    SetHeaderMap: (map: Map<string, keyof T | undefined>) => void
}

interface IAdditionalUIProps {
    HasHeaders: boolean,
    SetHasHeaders: (hasHeaders: boolean) => void
}

const AdditionalUploadUI = (props: IAdditionalUIProps) => {
    return (
        <div className='row justify-content-center'>
            <div className='col-6 p-0'>
                <CheckBox Record={{ HasHeaders: props.HasHeaders }} Field="HasHeaders" Setter={(record) => props.SetHasHeaders(record.HasHeaders)} Label='My Data Has Headers' />
            </div>
        </div>
    )
}

export function useCSVPipeline<T = unknown, U extends IAdditionalProps<T> = IAdditionalProps<T>>(csvFields: Gemstone.TSX.Interfaces.ICSVField<T>[], additionalSteps?: Gemstone.TSX.Interfaces.IPipelineSteps<T, U>[]): Gemstone.TSX.Interfaces.IPipeline<T, IAdditionalProps<T>> {
    const [hasHeaders, setHasHeaders] = React.useState<boolean>(false);

    //Define 
    const [headers, setHeaders] = React.useState<string[]>([]);
    const [headerMap, setHeaderMap] = React.useState<Map<string, keyof T | undefined>>(new Map<string, keyof T | undefined>());
    const [data, setData] = React.useState<string[][]>([]);

    const baseStep: Gemstone.TSX.Interfaces.IPipelineSteps<T, IAdditionalProps<T>> = {
        Label: 'Edit CSV',
        UI: CsvPipelineEditStep,
        AdditionalProps: {
            Fields: csvFields,
            DataHasHeaders: hasHeaders,
            Headers: headers,
            SetHeaders: setHeaders,
            Data: data,
            SetData: setData,
            HeaderMap: headerMap,
            SetHeaderMap: setHeaderMap
        }
    };
    const steps = additionalSteps == null ? [baseStep] : [baseStep, ...additionalSteps];

    return {
        Select: (mimeType: string, fileExt: string) => mimeType.toLowerCase() === 'text/csv' || fileExt === 'csv',
        Steps: steps as Gemstone.TSX.Interfaces.IPipelineSteps<T, IAdditionalProps<T>>[],
        AdditionalUploadUI: <AdditionalUploadUI HasHeaders={hasHeaders} SetHasHeaders={setHasHeaders} />
    }
}

function CsvPipelineEditStep<T>(props: Gemstone.TSX.Interfaces.IPipelineStepProps<T, IAdditionalProps<T>>) {
    const rawDataRef = React.useRef<string>();

    const [pagedData, setPagedData] = React.useState<string[][]>([]);
    const [page, setPage] = React.useState<number>(0);
    const [totalPages, setTotalPages] = React.useState<number>(1);

    const [isFileParseable, setIsFileParseable] = React.useState<boolean>(true);
    const [isCSVMissingHeadersCount, setIsCSVMissingHeadersCount] = React.useState<number>(0);
    const [isCSVMissingDataCellsCount, setIsCSVMissingDataCellsCount] = React.useState<number>(0);

    React.useEffect(() => {
        if (props.AdditionalProps?.Data.length === 0) return

        const pages = Math.ceil((props.AdditionalProps?.Data.length ?? 0) / 10);
        setTotalPages(pages);
        const Data = [...(props.AdditionalProps?.Data ?? [])]
        setPagedData(Data.slice(page * 10, (page + 1) * 10));

    }, [props.AdditionalProps?.Data, page]);

    React.useEffect(() => {
        let callback: () => void | undefined;

        async function runValidation() {
            const errors: string[] = [];
            if (props.AdditionalProps == null) return;
            const headerMap = props.AdditionalProps.HeaderMap as Map<string, keyof T | undefined>;

            for (const field of props.AdditionalProps.Fields) {
                const matchedHeader = Array.from(headerMap).find(([, value]) => value === field.Field)?.[0];
                if (matchedHeader == null) {
                    if (field.Required)
                        errors.push(`${field.Label} is required and must be mapped to a header.`);
                    continue; // return early if the field was never mapped to a header
                }

                const fieldIndex: number = props.AdditionalProps.Headers.indexOf(matchedHeader) as number;

                let foundDuplicate = false;
                let foundEmpty = false;
                let foundInvalid = false;
                const uniqueValues = new Set<string>();

                for (const row of props.AdditionalProps.Data) {
                    const value = row[fieldIndex + 1]; // +1 for row index value

                    // Unique check
                    if (field.Unique) {
                        if (uniqueValues.has(value))
                            foundDuplicate = true;
                        else
                            uniqueValues.add(value);
                    }

                    // Allowed emptiness
                    if (!field.AllowEmpty && (value == null || (value.trim() === '')))
                        foundEmpty = true;

                    const result = await Promise.resolve(field.Validate(value));
                    let isValid: boolean;
                    if (Array.isArray(result)) {
                        //[boolean, abortCallback]
                        [isValid] = result;
                        const abortCallback = result[1];
                        if (typeof abortCallback === 'function')
                            callback = abortCallback;

                    } else
                        isValid = result;

                    if (!isValid) {
                        foundInvalid = true;
                    }

                }

                if (field.Unique && foundDuplicate)
                    errors.push(`All ${field.Label} values must be unique.`);

                if (foundEmpty)
                    errors.push(`All ${field.Label} values cannot be empty.`);

                if (foundInvalid)
                    errors.push(`All ${field.Label} values must be valid.`);

                // Check for SameValueForAllRows 
                if (field.SameValueForAllRows ?? false) {
                    const allValues = props.AdditionalProps.Data.map(row => row[fieldIndex + 1] ?? '');
                    if (new Set(allValues).size > 1)
                        errors.push(`All rows must contain the same value for ${field.Label}.`);
                }
            }

            if (!isEqual(props.Errors.sort(), errors.sort()))
                props.SetErrors(errors);
        }

        runValidation();

        return () => {
            if (callback != null)
                callback();
        }

    }, [props.AdditionalProps?.Data, props.AdditionalProps?.Headers, props.AdditionalProps?.HeaderMap, isFileParseable, props.AdditionalProps?.Fields]);

    //Effect to parse rawfiledata initially
    React.useEffect(() => {
        if (props.RawFileData == null || props.AdditionalProps == null || rawDataRef.current === props.RawFileData || props.AdditionalProps.Data.length !== 0 || props.AdditionalProps.Headers.length !== 0) return

        let parsedData: { Headers: string[], Data: string[][], AddedMissingHeaders: boolean, AddedMissingDataValues: boolean }

        try {
            parsedData = parseCSV(props.RawFileData, props.AdditionalProps.DataHasHeaders, props.AdditionalProps.Fields.filter(field => field.Required).length);
        }
        catch {
            setIsFileParseable(false)
            return
        }

        setIsFileParseable(true);

        if (parsedData.AddedMissingDataValues)
            setIsCSVMissingDataCellsCount(p => p + 1);
        if (parsedData.AddedMissingHeaders)
            setIsCSVMissingHeadersCount(p => p + 1);

        props.AdditionalProps?.SetData(parsedData.Data);
        props.AdditionalProps.SetHeaders(parsedData.Headers);
        props.AdditionalProps?.SetHeaderMap(autoMapHeaders(parsedData.Headers, props.AdditionalProps.Fields.map(field => field.Field)))

        rawDataRef.current = props.RawFileData;
    }, [props.RawFileData, props.AdditionalProps]);

    //Effect to add additional columns for required fields during mapping process
    React.useEffect(() => {
        if (props.AdditionalProps?.Fields == null || props.AdditionalProps?.Fields.length === 0 || props.AdditionalProps?.Data.length === 0 || props.AdditionalProps.Headers == null)
            return;

        const requiredCount = props.AdditionalProps.Fields.filter(f => f.Required).length;
        const optionalFields = props.AdditionalProps.Fields.filter(f => !f.Required).map(f => f.Field);
        let mappedOptionalCount = 0;

        Array.from(props.AdditionalProps?.HeaderMap.values()).forEach(mappedField => {
            if (mappedField != null && optionalFields.includes(mappedField))
                mappedOptionalCount++;

        });

        const neededCols = requiredCount + mappedOptionalCount;

        if (props.AdditionalProps.Headers.length >= neededCols)
            return;

        // Extend headers (A, B, C, etc.) until we reach 'neededCols'
        const extendedHeaders = [...props.AdditionalProps.Headers];
        for (let i = props.AdditionalProps?.Headers.length; i < neededCols; i++) {
            extendedHeaders.push(String.fromCharCode(65 + i)); // 'A', 'B', ...
        }

        // Extend every row in 'data' accordingly
        const extendedData = props.AdditionalProps?.Data.map(row => {
            const currentCols = row.length - 1;  // minus the row index at row[0]
            if (currentCols < neededCols)
                return [...row, ...Array(neededCols - currentCols).fill('')];

            return row;
        });

        props.AdditionalProps?.SetHeaders(extendedHeaders);
        props.AdditionalProps.SetData(extendedData);

    }, [props.AdditionalProps?.Fields, props.AdditionalProps?.Headers, props.AdditionalProps?.Data, props.AdditionalProps?.HeaderMap]);


    //Effect to add additionalFields that cant be determined at build time
    React.useEffect(() => {
        if (props.AdditionalProps?.Fields == null || props.AdditionalProps?.Fields.length === 0 || props.AdditionalProps?.Data.length === 0 || props.AdditionalProps?.Headers == null) return;

        const requiredCount = props.AdditionalProps.Fields.filter(f => f.Required).length;

        // If we already have enough columns, do nothing
        if (props.AdditionalProps?.Headers.length >= requiredCount)
            return;

        // Extend 'headers' array (e.g., "A", "B", "C"...)
        const extendedHeaders = [...props.AdditionalProps.Headers];
        for (let i = props.AdditionalProps?.Headers.length; i < requiredCount; i++) {
            extendedHeaders.push(String.fromCharCode(65 + i)); // 'A', 'B', 'C', ...
        }

        // Extend each row in 'data' with blank strings for the new columns
        const extendedData = props.AdditionalProps?.Data.map(row => {
            // row already has an index at row[0], plus (headers.length - 1) columns
            const neededCols = requiredCount - (row.length - 1);
            if (neededCols > 0) {
                return [...row, ...Array(neededCols).fill('')];
            }
            return row;
        });

        props.AdditionalProps?.SetHeaders(extendedHeaders);
        props.AdditionalProps?.SetData(extendedData);

    }, [props.AdditionalProps?.Fields, props.AdditionalProps?.Headers, props.AdditionalProps?.Data]);

    React.useEffect(() => {
        if (props.AdditionalProps == null || props.Errors.length !== 0) return;
        const mappedData: T[] = [];

        props.AdditionalProps?.Data.forEach((row) => {
            let record: T = {} as T;

            props.AdditionalProps?.Headers.forEach((header, index) => {
                const mappedField = props.AdditionalProps?.HeaderMap.get(header);
                if (mappedField == null) return;

                const field = props.AdditionalProps?.Fields.find(f => f.Field === mappedField);
                if (field == null) return;

                const value = row[index + 1];
                record = field.Process(value, record, field.Field);
            });

            mappedData.push(record);
        });

        props.SetData(mappedData);
    }, [props.AdditionalProps?.Data, props.AdditionalProps?.Headers, props.AdditionalProps?.HeaderMap, props.AdditionalProps?.Fields, props.Errors]);

    const getFieldSelect = React.useCallback((header: string) => {
        if (props.AdditionalProps == null || props.AdditionalProps?.Fields.length === 0) return

        const field = props.AdditionalProps?.HeaderMap.get(header);
        const usedFields = Array.from(props.AdditionalProps?.HeaderMap.entries())
            .filter(([mappedHeader, mappedField]) => mappedHeader !== header && mappedField != null)
            .map(([, mappedField]) => mappedField);

        const selectOptions = props.AdditionalProps.Fields
            .filter(f => !usedFields.includes(f.Field) || f.Field === field)
            .map(f => ({ Value: f.Field as string, Label: f.Label }));

        const updateMap = (head: string, val: keyof T | undefined) => props.AdditionalProps?.SetHeaderMap(new Map(props.AdditionalProps?.HeaderMap).set(head, val));
        const matchedField: Gemstone.TSX.Interfaces.ICSVField<T> | undefined = props.AdditionalProps.Fields.find(f => f.Field === field);
        const help = matchedField?.Help != null ? matchedField?.Help : undefined

        return <Select<{ Header: string, Value: string | undefined }> Record={{ Header: header, Value: field as string }} EmptyOption={true} Label={' '} Help={help}
            Options={selectOptions} Field="Value" Setter={(record) => updateMap(record.Header, record.Value as keyof T)} />

    }, [props.AdditionalProps?.Fields, props.AdditionalProps?.HeaderMap])

    const handleValueChange = React.useCallback((rowIndex: number, colIndex: number, value: string) => {
        const data = [...(props.AdditionalProps?.Data ?? [])]
        data[rowIndex][colIndex] = value;
        props.AdditionalProps?.SetData(data)
    }, [props.AdditionalProps?.Data])

    const handleRowDelete = (rowIndex: number) => {
        const newData = [...(props.AdditionalProps?.Data ?? [])]
        newData.splice(rowIndex, 1)
        props.AdditionalProps?.SetData(newData)
    }

    const getHeader = (header: string) => {
        if (props.AdditionalProps == null) return
        const mappedField = props.AdditionalProps?.HeaderMap.get(header);

        if (mappedField == null) return header

        const matchedField = props.AdditionalProps.Fields.find(field => field.Field === mappedField)
        if (matchedField == null) return header
        return null //return null since the select element will have a label attached to it 
    }

    return (
        <>
            <div className="container-fluid d-flex flex-column p-0 h-100">
                <ErrorBoundary ClassName="row h-100" ErrorMessage='Error loading page.'>
                    <div className='row h-100'>
                        <div className='col-12 d-flex flex-column h-100'>
                            {pagedData.length !== 0 ?
                                <>
                                    {isCSVMissingDataCellsCount > 0 && isCSVMissingHeadersCount > 0 ? (
                                        <div className='row'>
                                            <div className='col-12'>
                                                <Alert Class='alert-info' ReTrigger={isCSVMissingDataCellsCount + isCSVMissingHeadersCount}>
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

                                    ) : isCSVMissingDataCellsCount > 0 || isCSVMissingHeadersCount > 0 ? (
                                        <div className='row'>
                                            <div className='col-12'>
                                                <Alert Class='alert-info' ReTrigger={isCSVMissingDataCellsCount > 0 ? isCSVMissingDataCellsCount : isCSVMissingHeadersCount}>
                                                    <p style={{ whiteSpace: 'nowrap' }}>
                                                        {isCSVMissingDataCellsCount > 0 ? 'Missing data cells were added to meet the number of required fields.' : 'Missing headers were added to meet the number of required fields.'}
                                                    </p>
                                                </Alert>
                                            </div>
                                        </div>
                                    ) : null}
                                    <div className='row flex-grow-1' style={{ overflowY: 'hidden' }}>
                                        <div className='col-12 h-100'>
                                            <Table<string[]>
                                                Data={pagedData}
                                                key={props.AdditionalProps?.Headers.join(',')}
                                                SortKey=''
                                                Ascending={false}
                                                OnSort={() => {/*no sort*/ }}
                                                KeySelector={data => data[0]}
                                                TableClass='table'
                                                TableStyle={{ height: '100%', width: (props.AdditionalProps?.Headers.length ?? 0) * 150 }}
                                            >
                                                {props.AdditionalProps?.Headers.map((header, i) =>
                                                    <Column<string[]>
                                                        Key={header}
                                                        Field={i + 1}
                                                        AllowSort={false}
                                                        Content={({ item, field }) => {
                                                            if (props.AdditionalProps == null) return
                                                            const mappedField = props.AdditionalProps?.HeaderMap.get(header);
                                                            const matchedField = props.AdditionalProps.Fields.find(f => f.Field === mappedField);
                                                            if (matchedField == null) return item[field as number];

                                                            const value = item[field as number];

                                                            const allValues: Partial<Record<keyof T, string>> = {};
                                                            props.AdditionalProps?.Headers.forEach((header, index) => {
                                                                const mappedField = props.AdditionalProps?.HeaderMap.get(header);
                                                                if (mappedField != null) {
                                                                    allValues[mappedField] = item[index + 1];
                                                                }
                                                            });

                                                            return (
                                                                <CSVFieldEditContext.Provider value={{
                                                                    Value: value,
                                                                    SetValue: (val) => handleValueChange(parseInt(item[0]), field as number, val),
                                                                    Validate: matchedField.Validate,
                                                                    Feedback: matchedField.Feedback,
                                                                    AllRecordValues: allValues,
                                                                    SelectOptions: matchedField.SelectOptions
                                                                }}>
                                                                    {matchedField.EditComponent}
                                                                </CSVFieldEditContext.Provider>
                                                            );
                                                        }}
                                                    >
                                                        {getHeader(header)}
                                                        {getFieldSelect(header)}
                                                    </Column>
                                                )}
                                                <Column<string[]>
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
                                                </Column>
                                            </Table>
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
                </ErrorBoundary>
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
        for (let headerIndex = 0; headerIndex < headers.length; headerIndex++) {
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
        }
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