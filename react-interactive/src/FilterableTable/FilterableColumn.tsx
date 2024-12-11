// ******************************************************************************************************
//  FilterableColumn.tsx - Gbtc
//
//  Copyright © 2023, Grid Protection Alliance.  All Rights Reserved.
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
//  12/05/2024 - G. Santos
//       Generated original version of source code.
// ******************************************************************************************************

import { ReactTableProps } from '@gpa-gemstone/react-table';
import * as React from 'react';
import { Search } from '../SearchBar';
import { IUnit } from './NumberFilter';

interface IOptions { Value: string | number, Label: string }

export const IsFilterableColumnProps = (props: any) => (props?.['Key'] != null); 

interface IFilterableCollumn<T> extends ReactTableProps.IColumn<T> { 
    Type?: Search.FieldType, 
    Enum?: IOptions[],
    ExpandedLabel?: string,
    Unit?: IUnit[]
}

/**
 * Wrapper to make any column configurable
 */
export default function FilterableColumn<T>(props: React.PropsWithChildren<IFilterableCollumn<T>>) {
    return <>{props.children}</>
}