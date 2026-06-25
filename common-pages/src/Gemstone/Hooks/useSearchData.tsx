//******************************************************************************************************
//  useSearchData.tsx - Gbtc
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
//  03/24/2025 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import { Application } from '@gpa-gemstone/application-typings';
import { Search } from '@gpa-gemstone/react-interactive';
import * as React from 'react';
import { ReadOnlyControllerFunctions } from '../ControllerFunctions';
import { Gemstone } from '../Gemstone';

/**
 * Custom hook to fetch and paginate searchable data from a read-only controller endpoint.
 * @typeParam T - The type of the records being searched.
 * @param page - The current page number to fetch.
 * @param sortField - The field to sort the results by.
 * @param searchFilter - The search filters to apply to the query.
 * @param ascending - Whether the results should be sorted in ascending order.
 * @param controllerPath - The path to the read-only controller endpoint.
 * @param ReFetchDataCounter - Optional counter that triggers a re-fetch whenever its value changes.
 * @returns An object containing the search results, the search status, the pagination status and the pagination info.
 */
const useSearchData = <T,>(
    page: number,
    sortField: keyof T,
    searchFilter: Search.IFilter<T>[],
    ascending: boolean,
    controllerPath: string,
    ReFetchDataCounter?: number
) => {
    const fetchHandle = React.useRef<JQuery.jqXHR<T[]> | null>(null);
    const paginationHandle = React.useRef<JQuery.jqXHR<Gemstone.Types.IPageInfo> | null>(null);
    const [results, setResults] = React.useState<T[]>([]);
    const [searchStatus, setSearchStatus] = React.useState<Application.Types.Status>('uninitiated');
    const [paginationStatus, setPaginationStatus] = React.useState<Application.Types.Status>('uninitiated');
    const [pageInfo, setPageInfo] = React.useState<Gemstone.Types.IPageInfo>({
        TotalCount: 0,
        PageCount: 0,
        PageSize: 0
    });

    const Queries = React.useMemo(() => new ReadOnlyControllerFunctions<T>(controllerPath), [controllerPath]);

    const stringifiedFilter = React.useMemo(() => JSON.stringify(searchFilter), [searchFilter]);

    // Memoize the searchFilter to avoid unnecessary re-fetches.
    const memoizedSearchFilter = React.useMemo(() => Gemstone.HelperFunctions.getSearchFilter(JSON.parse(stringifiedFilter) as Search.IFilter<T>[]), [stringifiedFilter]);

    const reFetchData = React.useCallback(() => {
        setSearchStatus('loading');
        setPaginationStatus('loading');

        fetchHandle.current = Queries.SearchPage(page, sortField, ascending, memoizedSearchFilter).done((data) => {
            setResults(data);
            setSearchStatus('idle');
        }).fail(() => setSearchStatus('error'))

        paginationHandle.current = Queries.GetPageInfo(memoizedSearchFilter).done((d: Gemstone.Types.IPageInfo) => {
            setPageInfo(d);
            setPaginationStatus('idle');
        }).fail(() => setPaginationStatus('error'));

        const cleanup = () => {
            if (fetchHandle.current?.abort != null) fetchHandle.current.abort();
            if (paginationHandle.current?.abort != null) paginationHandle.current.abort();
        };

        return {
            fetchHandle: fetchHandle.current,
            cleanup
        };
    }, [Queries, page, sortField, ascending, memoizedSearchFilter]);

    React.useEffect(() => {
        const { cleanup } = reFetchData();
        return cleanup;
    }, [reFetchData, ReFetchDataCounter]);

    return {
        SearchResults: results,
        SearchStatus: searchStatus,
        PaginationStatus: paginationStatus,
        PageInfo: pageInfo
    }
}

export default useSearchData;