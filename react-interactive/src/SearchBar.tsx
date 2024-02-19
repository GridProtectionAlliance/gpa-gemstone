// ******************************************************************************************************
//  SearchBar.tsx - Gbtc
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
//  01/06/2020 - Christoph Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import Modal from './Modal';
import LoadingIcon from './LoadingIcon';
import { Select } from '@gpa-gemstone/react-forms';
import {TrashCan, Pencil} from '@gpa-gemstone/gpa-symbols';

interface IProps<T> {
    CollumnList: Search.IField<T>[],
    SetFilter: (filters: Search.IFilter<T>[]) => void,
    defaultCollumn?: Search.IField<T>,
    Direction?: 'left' | 'right',
    Width?: string|number,
    Label?: string,
    children: React.ReactNode,
    GetEnum?: EnumSetter<T>,
    ShowLoading?: boolean,
      ResultNote?: string,
    StorageID?: string
  }

interface IOptions {Value: string, Label: string}
type EnumSetter<T> = (setOptions: (options: IOptions[]) => void, field: Search.IField<T>) => () => void

export namespace Search {
  export type FieldType = ('string' | 'number' | 'enum' | 'integer' | 'datetime' | 'boolean' | 'date' | 'time' | "query")
  export interface IField<T> { label: string, key: string, type: FieldType, enum?: IOptions[], isPivotField: boolean}
  export type OperatorType = ('=' | '<>' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'NOT LIKE' | 'IN' | 'NOT IN')
  export interface IFilter<T> { FieldName: string, SearchText: string, Operator: Search.OperatorType, Type: Search.FieldType, IsPivotColumn: boolean }
}

export default function SearchBar<T> (props: IProps<T>)  {
  const [hover, setHover] = React.useState<boolean>(false);
  const [show, setShow] = React.useState<boolean>(false);

  const [isNew, setIsNew] = React.useState<boolean>(false);

  const [filters, setFilters] = React.useState<Search.IFilter<T>[]>([]);
  const [filter, setFilter] = React.useState<Search.IFilter<T>>({ FieldName: props.CollumnList[0].key, SearchText: '', Operator: props.CollumnList[0].type === 'string'? 'LIKE' : '=', Type: props.CollumnList[0].type, IsPivotColumn: props.CollumnList[0].isPivotField});

  const [search, setSearch] = React.useState<string>("");
  const [searchFilter, setSearchFilter] = React.useState<Search.IFilter<T>|null>(null);

  const isFirstRender = React.useRef(true);
  
  // Handling filter storage between sessions if a storageID exists
  React.useEffect(() => {
    if (props.StorageID !== undefined) {
      const storedFilters = JSON.parse(localStorage.getItem(props.StorageID) as string) ?? [];
      setFilters(storedFilters);
      props.SetFilter(storedFilters);
    }
  }, []);

  React.useEffect(() => {
    if (props.StorageID !== undefined)
      localStorage.setItem(props.StorageID, JSON.stringify(filters));
  }, [filters]);

  // Update SearchFilter if there are any Character and only do it every 500ms to avoid hammering the server while typing
  React.useEffect(() => {
      let handle: any = null;
      if (search.length > 0 && props.defaultCollumn !== undefined)
          handle = setTimeout(() => {
              if (props.defaultCollumn !== undefined) setSearchFilter({ FieldName: props.defaultCollumn.key, Operator: 'LIKE', Type: props.defaultCollumn.type, SearchText: ('*' + search + '*'), IsPivotColumn: props.defaultCollumn.isPivotField });
          }, 500);
      else
          handle = setTimeout(() => {
              setSearchFilter(null)
          }, 500);

      return () => { if (handle !== null) clearTimeout(handle); };
  }, [search]);

  React.useEffect(() => {
    if (searchFilter !== null)
      props.SetFilter([...filters, searchFilter]);
    if (searchFilter === null && !(isFirstRender.current && props.StorageID !== undefined)) // We need to skip the first render call or we will get a race condition with the props.setFilter in the blank useEffect
      props.SetFilter(filters);
    isFirstRender.current = false;
  }, [searchFilter])

  function deleteFilter(f: Search.IFilter<T>) {
      const index = filters.findIndex(fs => fs === f);
      const filts = [...filters];
      filts.splice(index, 1);
      setFilters(filts);
      setHover(false);
      if (props.defaultCollumn !== undefined && searchFilter !== null)
          props.SetFilter([...filts, searchFilter]);
      else
          props.SetFilter(filts);
  }

  function addFilter() {
      const oldFilters = [...filters];
      const adjustedFilter = {...filter};
      if (adjustedFilter.Type === 'string' && (adjustedFilter.Operator === 'LIKE' || adjustedFilter.Operator === 'NOT LIKE') )
        adjustedFilter.SearchText = '*' + adjustedFilter.SearchText + '*';
      oldFilters.push(adjustedFilter);

      setFilters(oldFilters);
      setFilter({ FieldName: props.CollumnList[0].key, SearchText: '', Operator: props.CollumnList[0].type === 'string'? 'LIKE': '=', Type: props.CollumnList[0].type,IsPivotColumn: props.CollumnList[0].isPivotField });
      if (props.defaultCollumn !== undefined && searchFilter !== null)
          props.SetFilter([...oldFilters, searchFilter]);
      else
          props.SetFilter(oldFilters);
  }

  function editFilter(index: number) {
      setIsNew(false);
      const oldFilters = [...filters];
      const filt = {...oldFilters[index]};
      oldFilters.splice(index,1);
      if (filt.Type === 'string' && (filt.Operator === 'LIKE' || filt.Operator === 'NOT LIKE'))
        filt.SearchText = filt.SearchText.substr(1,filt.SearchText.length -2);
      setShow(true);
      setFilters(oldFilters);
      setFilter(filt);
      if (props.defaultCollumn !== undefined && searchFilter !== null)
          props.SetFilter([...oldFilters, searchFilter]);
      else
          props.SetFilter(oldFilters);
  }

  function createFilter() {
    setShow(!show);
    setIsNew(true);
    setFilter({ FieldName: props.CollumnList[0].key, SearchText: '', Operator: props.CollumnList[0].type === 'string'? 'LIKE': '=', Type: props.CollumnList[0].type, IsPivotColumn: props.CollumnList[0].isPivotField });
  }

  const content = (
    <>
    <form>
    <div className="row">
    {props.defaultCollumn !== undefined ?
        <div className="col">
        <div className="input-group">
          <input className="form-control mr-sm-2" type="search" placeholder={"Search " + props.defaultCollumn.label} onChange={(event) => setSearch(event.target.value as string)} />
          {props.ShowLoading!== undefined && props.ShowLoading? <div className="input-group-append"> <LoadingIcon Show={true}/> </div>: null}
        </div>
      <p style={{marginTop: 2, marginBottom: 2}}>{props.ResultNote}</p>
        </div> : null}
      <div style={{ position: 'relative', display: 'inline-block' }} className='col'>
          <button className={"btn btn-" + (filters.length > 0? "warning" : "primary")} onClick={(evt) => { evt.preventDefault(); createFilter(); }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>Add Filter{filters.length > 0 ? ("(" + filters.length + ")") : ""}</button>
          <div style={{ width: window.innerWidth / 3, display: hover ? 'block' : 'none', position: 'absolute', backgroundColor: '#f1f1f1', boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)', zIndex: 1, right: (props.Direction === 'right' ? 0 : undefined), left: (props.Direction === 'left' ? 0: undefined) }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
              <table className='table'>
                  <thead>
                      <tr><th>Column</th><th>Operator</th><th>Search Text</th><th>Edit</th><th>Remove</th></tr>
                  </thead>
                  <tbody>
                      {filters.map((f, i) => <FilterRow Filter={f} Edit={() => editFilter(i)} Delete={() => deleteFilter(f)} key={i} Collumns={props.CollumnList}/> )}
                  </tbody>
              </table>
          </div>

      </div>
    </div>
    </form>
  </>)

  return (
      <div style={{ width: '100%' }}>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <div className="collapse navbar-collapse" style={{ width: '100%' }}>
                  <ul className="navbar-nav mr-auto" style={{ width: '100%' }}>
                      {props.Direction === 'right' ? props.children : null }
                      {props.Label !== undefined?
                      <li className="nav-item" style={{ minWidth: (props.Width === undefined? '150px' : undefined), width: props.Width, paddingRight: 10 }}>
                        <fieldset className="border" style={{ padding: '10px', height: '100%' }}>
                        <legend className="w-auto" style={{ fontSize: 'large' }}>{props.Label}:</legend>
                        {content}
                        </fieldset>
                        </li>:
                        <li className="nav-item" style={{ minWidth: (props.Width === undefined? '150px' : undefined), width: props.Width, paddingRight: 10 }}>
                          {content}
                        </li>}
                      {props.Direction === 'left' ? props.children : null }
                  </ul>
              </div>
          </nav>

          <Modal Title={'Add Filter'} Show={show} CallBack={(conf: boolean) => { if (conf) addFilter(); setShow(false)}} ConfirmText={isNew? 'Add' : 'Save'} CancelText={isNew? 'Close' : 'Delete'}>
            <Select<Search.IFilter<T>> Record={filter} Field='FieldName' Options={props.CollumnList.map(fl => ({ Value: fl.key as string, Label: fl.label }))} Setter={(record) => {
                let operator = "IN" as any;
                const column = props.CollumnList.find(fl => fl.key === record.FieldName);

                if (column !== undefined && column.type === 'string')
                    operator = "LIKE";
                if (column !== undefined && (column.type === 'number' || column.type === 'integer' || column.type === 'boolean'))
                    operator = '=';
                if (column !== undefined && column.type === 'datetime')
                    operator = '>';

                  setFilter((prevFilter) => ({ ...prevFilter, FieldName: record.FieldName, SearchText: '', Operator: operator, Type: (column !== undefined ? column.type : 'string'), IsPivotColumn: (column !== undefined ? column.isPivotField : true)  }))
            }} Label='Column' />
            <FilterCreator Filter={filter} Field={props.CollumnList.find(fl => fl.key === filter.FieldName)} Setter={(record) => setFilter(record)} Enum={(props.GetEnum === undefined? undefined : props.GetEnum)}/>
          </Modal>
      </div>
  );

}

interface IPropsFilterCreator<T> { Filter: Search.IFilter<T>, Setter: (filter: React.SetStateAction<Search.IFilter<T>>) => void, Field: Search.IField<T>|undefined, Enum?: EnumSetter<T> }

function FilterCreator<T>(props: IPropsFilterCreator<T> ) {
    const [options, setOptions] = React.useState<IOptions[]>([]);

    React.useEffect(() => {
        if (props.Field === undefined)
            return;
        if (props.Field.enum !== undefined)
            setOptions(props.Field.enum);
        if (props.Enum !== undefined)
            return props.Enum(setOptions,props.Field);
        if (props.Field.enum === undefined)
        setOptions([]);
    },[props.Field, props.Enum]);

    if (props.Field === undefined)
        return null;
    if (props.Field.type === "string") {
        return (
            <>
                <label>Column type is string. Wildcard (*) can be used with 'LIKE' and 'NOT LIKE'</label>
                <div className='row'>
                    <div className='col-4'>
                        <select className='form-control' value={props.Filter.Operator} onChange={(evt) => {
                            const value = evt.target.value as 'LIKE' | 'NOT LIKE' | '=';
                            props.Setter((prevState) => ({ ...prevState, Operator: value }));
                        }}>
                            <option value='LIKE'>LIKE</option>
                            <option value='='>=</option>
                            <option value='NOT LIKE'>NOT LIKE</option>
                        </select>
                    </div>
                    <div className='col'>
                        <input className='form-control' value={props.Filter.SearchText.replace('$_', '_')} onChange={(evt) => {
                            const value = evt.target.value as string;
                            props.Setter((prevState) => ({ ...prevState, SearchText: value.replace('_', '$_')}));
                        }} />
                    </div>

                </div>
            </>
        );
    }
    else if (props.Field.type === "integer" || props.Field.type === "number") {
        return (
            <>
                <label>Column type is {props.Field.type}.</label>
                <div className='row'>
                    <div className='col-4'>
                        <select className='form-control' value={props.Filter.Operator} onChange={(evt) => {
                            const value = evt.target.value as '=' | '<>' | '>' | '<' | '>=' | '<=';
                            props.Setter((prevState) => ({ ...prevState, Operator: value }));
                        }}>
                            <option value='='>=</option>
                            <option value='<>'>{`<>`}</option>
                            <option value='>'>{`>`}</option>
                            <option value='>='>{`>=`}</option>
                            <option value='<'>{`<`}</option>
                            <option value='<='>{`<=`}</option>
                        </select>
                    </div>
                    <div className='col'>
                        <input type={'number'}className='form-control' value={props.Filter.SearchText} onChange={(evt) => {
                            const value = evt.target.value as string;
                            props.Setter((prevState) => ({ ...prevState, SearchText: value }));
                        }} />
                    </div>

                </div>
            </>
        );
    }
    else if (props.Field.type === "datetime") {
        return (
            <>
                <label>Column type is {props.Field.type}.</label>
                <div className='row'>
                    <div className='col-4'>
                        <select className='form-control' value={props.Filter.Operator} onChange={(evt) => {
                            const value = evt.target.value as '=' | '<>' | '>' | '<' | '>=' | '<=';
                            props.Setter((prevState) => ({ ...prevState, Operator: value }));
                        }}>
                            {/*<option value='='>=</option>*/}
                            {/*<option value='<>'>{`<>`}</option>*/}
                            <option value='>'>{`>`}</option>
                            <option value='>='>{`>=`}</option>
                            <option value='<'>{`<`}</option>
                            <option value='<='>{`<=`}</option>
                        </select>
                    </div>
                    <div className='col'>
                        <input type={'date'} className='form-control' value={props.Filter.SearchText.split(' ')[0]} onChange={(evt) => {
                            const value = evt.target.value as string;
                            props.Setter((prevState) => ({ ...prevState, SearchText: (value + ' ' + (prevState.SearchText.split(' ').length > 1? prevState.SearchText.split(' ')[1]: '0:00')) }));
                        }} />
                        <input type={'time'}className='form-control' value={props.Filter.SearchText.split(' ').length > 1? props.Filter.SearchText.split(' ')[1]: '0:00'} onChange={(evt) => {
                            const value = evt.target.value as string;
                            props.Setter((prevState) => ({ ...prevState, SearchText: (prevState.SearchText.split(' ')[0] + ' ' + value) }));
                        }} />
                    </div>

                </div>
            </>
        );
    }
    else if (props.Field.type === "boolean") {
        return <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input"
          style={{ zIndex: 1 }}
          onChange={(evt) => {
            props.Setter((prevFilter) => ({ ...prevFilter, Operator: '=', SearchText: evt.target.checked ? "1" : "0"}));
          }}
          value={props.Filter.SearchText === "1" ? 'on' : 'off'}
          checked={props.Filter.SearchText === "1" ? true : false}
        />
        <label className="form-check-label">Column type is boolean. Yes/On is checked.</label>
      </div>
    }
    else {
        const stripParenthesisAndSplit = (str : string) => {
            return (str.match(/^\(.*\)$/) != null ? str.slice(1,-1) : str).split(',');
        };
        return (
            <>
                <label>Column type is enumerable. Select from below.</label>
                <ul style={{ listStyle: 'none' }}>
                    <li ><div className="form-check">
                        <input type="checkbox" className="form-check-input" style={{ zIndex: 1 }} onChange={(evt) => {
                            if (evt.target.checked)
                                props.Setter(prevSetter => ({ ...prevSetter, SearchText: `(${options.map(x => x.Value).join(',')})` }));
                            else
                                props.Setter(prevSetter => ({ ...prevSetter, SearchText: '' }));
                        }} defaultValue='off' />
                        <label className="form-check-label" >Select All</label>

                    </div></li>
                    {options.map((vli,index) => <li key={index} ><div className="form-check">
                        <input type="checkbox" className="form-check-input" style={{ zIndex: 1 }} onChange={(evt) => {
                            if (evt.target.checked) {
                                
                                let list = stripParenthesisAndSplit(props.Filter.SearchText)
                                list = list.filter(x => x !== "")
                                list.push(vli.Value)
                                const text = `(${list.join(',')})`;
                                props.Setter(prevSetter => ({ ...prevSetter, SearchText: text }));
                            }
                            else {
                                let list = stripParenthesisAndSplit(props.Filter.SearchText);
                                list = list.filter(x => x !== "")
                                list = list.filter(x => x !== vli.Value)
                                const text = `(${list.join(',')})`;
                                props.Setter(prevSetter => ({ ...prevSetter, SearchText: text }));
                            }

                        }} value={props.Filter.SearchText.indexOf(vli.Value) >= 0 ? 'on' : 'off'} checked={stripParenthesisAndSplit(props.Filter.SearchText).indexOf(vli.Value) >= 0} />
                        <label className="form-check-label" >{vli.Label}</label>

                    </div></li>)}
                </ul>
            </>
        );
    }
}

interface IFilterRowProps<T> {
    Filter: Search.IFilter<T>, 
    Edit: () => void,
    Delete: () => void,
    Collumns: Search.IField<T>[]
}
function FilterRow<T>(props: IFilterRowProps<T>) {
    
    const column = props.Collumns.find(c => c.key === props.Filter.FieldName);
    return <tr>
        <td>{column === undefined ? props.Filter.FieldName : column.label }</td>
        <td>{props.Filter.Operator}</td>
        <td>{props.Filter.SearchText}</td>
        <td>
            <button type='button' className="btn btn-sm" onClick={(e) => props.Edit()}><span>{Pencil}</span></button>
        </td>
        <td>
            <button type='button' className="btn btn-sm" onClick={(e) => props.Delete()}><span>{TrashCan}</span></button>
        </td>
    </tr>;
}