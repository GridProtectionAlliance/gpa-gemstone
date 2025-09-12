//******************************************************************************************************
//  Gemstone.tsx - Gbtc
//
//  Copyright (c) 2025, Grid Protection Alliance.  All Rights Reserved.
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
//  09/12/2025 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import { Search } from "@gpa-gemstone/react-interactive";
import { ReadOnlyControllerFunctions, ReadWriteControllerFunctions } from "./ControllerFunctions";
import useInitializeWithFetch from "./GenericSlices/useInitializeData";

export namespace Gemstone {
    export namespace Types {
        export interface ISearchFilter<T> {
            FieldName: keyof T,
            SearchParameter: string | boolean | number | string[] | number[] | boolean[],
            Operator: Search.OperatorType
        }

        export interface IPageInfo {
            /* Number of Models per Page */
            PageSize: number;
            /* Total Number of Pages */
            PageCount: number
            /* Number of Models */
            TotalCount: number
        }

    }

    export namespace HelperFunctions {
        export const getSearchFilter = <T,>(searchFilter: Search.IFilter<T>[]) => {
            return searchFilter.map(s => {
                let searchText: string | string[] = s.SearchText;

                if (s.Operator === 'IN' || s.Operator === 'NOT IN') {
                    if (searchText.startsWith('(') && searchText.endsWith(')'))
                        searchText = searchText.slice(1, -1).split(',').map(v => v.trim())

                }
                return { FieldName: s.FieldName, SearchParameter: searchText, Operator: s.Operator };
            }) as Types.ISearchFilter<T>[];
        }
    }

    export namespace Utilities {
        export const ControllerFunctions = {
            ReadOnly: ReadOnlyControllerFunctions,
            ReadWrite: ReadWriteControllerFunctions
        }

        export const Slices = {
            ReadOnly: ReadOnlyControllerFunctions,
            ReadWrite: ReadWriteControllerFunctions,
            useInitializeWithFetch
        }

    }
}