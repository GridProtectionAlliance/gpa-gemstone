//******************************************************************************************************
//  RecordTable.tsx - Gbtc
//
//  Copyright (c) 2024, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA may license this file to you under the MIT License (MIT), the "License"; you may not use this
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
//  08/26/2024 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************
import * as React from 'react';
import { Column } from './Table/Column';
import * as moment from 'moment';
import { Gemstone } from '@gpa-gemstone/application-typings';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import ConfigurableColumn from './ConfigurableTable/ConfigurableColumn';

const getTypedEntries = <T,>(obj: T): Array<[keyof T, T[keyof T]]> => {
    return Object.entries(obj as object) as Array<[keyof T, T[keyof T]]>;
}

export const GetConfigurableColumnsFromTypeEntries = <T,>(recordFields: Gemstone.TSX.Interfaces.IRecordFields<T>, timeFormat: string, configurable = true) => {
    return getTypedEntries(recordFields)
        .map(([key, value]) => {
            if (value == null) return null
            if (configurable)
                return (
                    <ConfigurableColumn key={key as string} Key={key as string} Label={value.Label ?? key as string} Default={value.IsDefaultColumn}>
                        <Column<T>
                            Key={key as string}
                            AllowSort={value.AllowSort}
                            Field={key as keyof T}
                            Content={({ item }) => getContent(item, key as keyof T, value, timeFormat)}
                        >
                            {(value.Label ?? key) as string}
                        </Column>
                    </ConfigurableColumn>
                )
            return (
                <Column<T>
                    Key={key as string}
                    AllowSort={value.AllowSort}
                    Field={key as keyof T}
                    Content={({ item }) => getContent(item, key as keyof T, value, timeFormat)}
                >
                    {(value.Label ?? key) as string}
                </Column>
            )
        })
}

const getContent = <T,>(record: T, field: keyof T, recordValue: Gemstone.TSX.Interfaces.IRecordField<T>, timeFormat: string): React.ReactNode => {
    if (field === 'CreatedOn' || field == 'UpdatedOn')
        return moment.utc(record[field] as string).format(timeFormat);

    if (typeof record[field] === 'boolean')
        return record[field] ? <ReactIcons.CheckMark Color='green' /> : <ReactIcons.CrossMark Color='red' />

    if (recordValue.Content == null) return record[field] as React.ReactNode;

    return recordValue.Content(record);
};