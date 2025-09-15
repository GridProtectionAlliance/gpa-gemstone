//******************************************************************************************************
//  ControllerFunctions.tsx - Gbtc
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
//  04/02/2024 - C. Lackner
//       Generated original version of source code.
//
//******************************************************************************************************

import $ from "jquery";
import { Gemstone } from "./Gemstone";

export class ReadOnlyControllerFunctions<T> {
    protected APIPath: string;

    constructor(APIPath: string) {
        this.APIPath = APIPath;
    }

    //Rename to GetPageInfo,
    public GetPagination: (filter?: Gemstone.Types.ISearchFilter<T>[], parentID?: string | number) => JQuery.jqXHR<Gemstone.Types.IPageInfo> = (filter, parentID?) => {
        const route = parentID == null ? `${this.APIPath}/PageInfo` : `${this.APIPath}/PageInfo/${parentID}`

        if (filter === undefined || filter.length === 0)
            return $.ajax({
                type: 'GET',
                url: `${route}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: false,
                async: true
            });

        return $.ajax({
            type: 'POST',
            url: `${route}`,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({ Searches: filter, OrderBy: '', Ascending: false }),
            cache: false,
            async: true
        });
    }

    GetOne: (id: string | number) => JQuery.jqXHR<T> = (id) => {
        return $.ajax({
            type: 'GET',
            url: `${this.APIPath}/One/${id}`,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            cache: false,
            async: true
        });
    }

    //this needs to be reworked so that the only required parameters is page.
    //all other paramerters are optional just create a simple helper func to get the route.
    GetPage: (page: number, sortField: keyof T, asc: boolean, parentID?: string | number) => JQuery.jqXHR<T[]> = (page, sortField, asc, parentID?) => {
        if (parentID != null)
            return $.ajax({
                type: 'GET',
                url: `${this.APIPath}/${page}/${parentID}/${sortField.toString()}/${asc}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: false,
                async: true
            });

        return $.ajax({
            type: 'GET',
            url: `${this.APIPath}/${page}/${sortField.toString()}/${asc}`,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            cache: false,
            async: true
        });
    }

    /**
     * Use with caution as this could be VERY network resource intensive.
     */
    public GetAll: (sortField: keyof T, asc: boolean, filter?: Gemstone.Types.ISearchFilter<T>[], parentID?: string | number) => JQuery.jqXHR<T[]> = (sortField, asc, filter, parentID) => {
        const deferred = $.Deferred<T[]>();
        const pending: JQuery.jqXHR<any>[] = [];

        // First, determine the number of pages.
        const pagReq = this.GetPagination(filter ?? [], parentID).done((pageInfo: Gemstone.Types.IPageInfo) => {
            const pageCount = pageInfo.PageCount;
            if (pageCount <= 0) {
                deferred.resolve([]);
                return;
            }

            // Build an array of page requests.
            const pageRequests: JQuery.jqXHR<T[]>[] = [];
            for (let i = 0; i < pageCount; i++) {
                const req = this.SearchPage(i, sortField, asc, filter ?? [], parentID);
                pageRequests.push(req);
                pending.push(req);
            }

            // Combine all page requests.
            $.when(...pageRequests).done(function (...results) {
                // If there's only one page, 'arguments' is not an array of arrays.
                const responses = pageRequests.length === 1 ? [results] : $.makeArray(results);
                const pages: T[][] = responses.map((result: any) => result[0]);
                const allData = ([] as T[]).concat(...pages);
                deferred.resolve(allData);
            }).fail((err) => deferred.reject(err));

        }).fail((err) => deferred.reject(err));

        pending.push(pagReq);

        // Attach an abort handler to cancel all pending requests.
        const promise = deferred.promise() as unknown as JQuery.jqXHR<T[]>;
        promise.abort = function () {
            pending.forEach(req => req.abort());
            deferred.reject('Aborted');
        };

        return promise;
    };

    SearchPage: (page: number, sortField: keyof T, asc: boolean, filter: Gemstone.Types.ISearchFilter<T>[], parentID?: number | string) => JQuery.jqXHR<T[]> = (page, sortField, asc, filter, parentID?) => {
        if (parentID != null)
            return $.ajax({
                type: 'POST',
                url: `${this.APIPath}/Search/${page}/${parentID}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: JSON.stringify({
                    Searches: filter,
                    OrderBy: sortField,
                    Ascending: asc
                }),
                cache: false,
                async: true
            });

        return $.ajax({
            type: 'POST',
            url: `${this.APIPath}/Search/${page}`,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({
                Searches: filter,
                OrderBy: sortField,
                Ascending: asc
            }),
            cache: false,
            async: true
        });
    }

    New: () => JQuery.jqXHR<T> = () => {
        return $.ajax({
            type: 'GET',
            url: `${this.APIPath}/New`,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            cache: false,
            async: true
        })
    }

    GetMaxValue: (fieldName: keyof T) => JQuery.jqXHR<number> = (fieldName) => {
        return $.ajax({
            type: 'GET',
            url: `${this.APIPath}/Max/${fieldName as string}`,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            cache: false,
            async: true
        })
    }
}

export class ReadWriteControllerFunctions<T> extends ReadOnlyControllerFunctions<T> {
    constructor(APIPath: string) {
        super(APIPath);
    }

    public Add: (record: T) => JQuery.jqXHR<T> = (record) => {
        return $.ajax({
            type: 'POST',
            url: `${this.APIPath}`,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(record),
            cache: false,
            async: true
        });
    }

    public Update: (record: T) => JQuery.jqXHR<T> = (record) => {
        return $.ajax({
            type: 'PATCH',
            url: `${this.APIPath}`,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(record),
            cache: false,
            async: true
        });
    }

    public Delete: (record: T) => JQuery.jqXHR<T> = (record) => {
        return $.ajax({
            type: 'DELETE',
            url: `${this.APIPath}`,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(record),
            cache: false,
            async: true
        });
    }

    public DeleteByID: (id: string | number) => JQuery.jqXHR<T> = (id) => {
        return $.ajax({
            type: 'DELETE',
            url: `${this.APIPath}/${id}`,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            cache: false,
            async: true
        });
    }
}