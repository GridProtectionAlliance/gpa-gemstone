// ******************************************************************************************************
//  GenericController.tsx - Gbtc
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
//  04/05/2024 - C. Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as _ from 'lodash';
import * as $ from 'jquery';
import { Search } from './SearchBar';

interface IPagedResult<T> {
    Data: T[],
    NumberOfPages: number,
    TotalRecords: number,
    RecordsPerPage: number
}


export default class GenericController<T> {

    APIPath = "";
    DefaultSort: keyof T;
    Ascending: boolean;
    Fetch: (parentID: (void | number | string| null), sortField?: keyof T, ascending?: boolean) => JQuery.jqXHR<T[]>;
    DBAction: (verb: 'POST' | 'DELETE' | 'PATCH', record: T) => JQuery.jqXHR;
    DBSearch: (filter: Search.IFilter<T>[], sortField?: keyof T, ascending?: boolean, parentID?: (number | string)) => JQuery.jqXHR<T[]>;
    PagedSearch: (filter: Search.IFilter<T>[], sortField?: keyof T, ascending?: boolean, page?: number,  parentID?: (number | string)) => JQuery.jqXHR<IPagedResult<T>>;

    /**
     * Creates a new Controler of type T, which can be used to perform basic CRUD operations against
     * a specified web api. without the Reduxstore associated with GenericSlice
     * @typeParam T - Model of Generic Slice
     * @param {string} apiPath - string containing relative path to web api
     * @returns a new GenericController<T>
     */
    constructor(apiPath: string, defaultSort: keyof T, ascending = true) {
        
        this.APIPath = apiPath;
        this.DefaultSort = defaultSort;
        this.Ascending = ascending;
    

    const fetch = (parentID:number | void | string | null, sortField?: keyof T, ascending?: boolean,) => {
        let sort = sortField;
        let asc = ascending;

        sort = sort === undefined ? this.DefaultSort : sort;
        asc = asc === undefined ? this.Ascending : asc;
        const handle = this.GetRecords(asc, sort, parentID ?? undefined);

        return handle.then(function (d) { 
            return $.Deferred().resolve(JSON.parse(d.toString())as T[]).promise();
          }).promise(handle);
    };

    const dBAction = (verb: 'POST' | 'DELETE' | 'PATCH', record: T) => {
        const handle = this.Action(verb, record);
        return handle
    };

    const dBSearch = (filter:  Search.IFilter<T>[], sortField?: keyof T, ascending?: boolean, parentID?: number | string ) => {

        let sort = sortField;
        let asc = ascending;

        sort = sort === undefined ? this.DefaultSort : sort;
        asc = asc === undefined ? this.Ascending : asc;

        const handle = this.Search(filter, asc,sort, parentID);
    
        return handle.then(function (d) { 
            return $.Deferred().resolve(JSON.parse(d)as T[]).promise();
          }).promise(handle);
    };

   
    const dBPage = (filter:  Search.IFilter<T>[], sortField?: keyof T, ascending?: boolean, page?: number, parentID?: number | string) => {

        let sort = sortField;
        let asc = ascending;
        const pg = page ?? 0;

        sort = sort === undefined ? this.DefaultSort : sort;
        asc = asc === undefined ? this.Ascending : asc;

        const handle = this.FetchPage(filter, asc,sort, pg, parentID);
       
        return handle.done((d) => ({NumberOfPages: d.NumberOfPages, Data: JSON.parse(d.Data), RecordsPerPage: d.RecordsPerPage, TotalRecords: d.TotalRecords} as IPagedResult<T>));
    };

        this.Fetch = fetch;
        this.DBAction = dBAction;
        this.DBSearch = dBSearch;
        this.PagedSearch = dBPage;
    }


    private GetRecords(ascending: (boolean | undefined), sortField: keyof T, parentID: number | void | string,): JQuery.jqXHR<T[]> {
        return $.ajax({
            type: "GET",
            url: `${this.APIPath}${(parentID != null ? '/' + parentID : '')}/${sortField.toString()}/${(ascending ?? false)? '1' : '0'}`,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            cache: true,
            async: true
        });
    }

    private Action(verb: 'POST' | 'DELETE' | 'PATCH', record: T): JQuery.jqXHR<T> {
        let action = '';
        if (verb === 'POST') action = 'Add';
        else if (verb === 'DELETE') action = 'Delete';
        else if (verb === 'PATCH') action = 'Update';

        return $.ajax({
            type: verb,
            url: `${this.APIPath}/${action}`,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({ ...record }),
            cache: false,
            async: true
        });
    }

    private Search(filter: Search.IFilter<T>[], ascending: (boolean | undefined), sortField: keyof T, parentID?: number | string | null): JQuery.jqXHR<any> {
        return $.ajax({
            type: 'POST',
            url: `${this.APIPath}/${parentID != null ? `${parentID}/` : ''}SearchableList`,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({ Searches: filter, OrderBy: sortField, Ascending: ascending }),
            cache: false,
            async: true
        });
    }

    private FetchPage(filter: Search.IFilter<T>[], ascending: (boolean | undefined), sortField: keyof T, page: number, parentID?: number | string | null): JQuery.jqXHR<any> {
        return $.ajax({
            type: 'POST',
            url: `${this.APIPath}/${parentID != null ? `${parentID}/` : ''}PagedList/${page}`,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({ Searches: filter, OrderBy: sortField, Ascending: ascending }),
            cache: false,
            async: true
        });
    }
}
