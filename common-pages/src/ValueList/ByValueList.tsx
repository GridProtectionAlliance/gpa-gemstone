// ******************************************************************************************************
//  ValueList.tsx - Gbtc
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
//  07/10/2021 - C. Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import Table from '@gpa-gemstone/react-table';
import { CrossMark } from '@gpa-gemstone/gpa-symbols';
import { SearchBar, Search, Modal } from '@gpa-gemstone/react-interactive';
import { SystemCenter, Application } from '@gpa-gemstone/application-typings';
import GroupForm  from './GroupForm';
import { useDispatch, useSelector } from 'react-redux';
import { IGenericSlice, ISearchableSlice } from '../SliceInterfaces';
import { Dispatch } from '@reduxjs/toolkit';

interface IProps {
    OnValueListSelect: (id: number) => void,
    ValueListSlice: ISearchableSlice<SystemCenter.Types.ValueListGroup>;
    ValueListItemSlice: IGenericSlice<SystemCenter.Types.ValueListItem>;
}

function ByValueListGroup(props: IProps)  {
    const dispatch = useDispatch<Dispatch<any>>();

    const data: SystemCenter.Types.ValueListGroup[] = useSelector(props.ValueListSlice.SearchResults);
  const dataStatus: Application.Types.Status = useSelector(props.ValueListSlice.SearchStatus);

    const groups: SystemCenter.Types.ValueListGroup[] = useSelector(props.ValueListSlice.Data);
  const groupStatus: Application.Types.Status = useSelector(props.ValueListSlice.Status);

  const [sortKey,setSortKey] = React.useState<keyof SystemCenter.Types.ValueListGroup>('Name');
  const [asc,setASC] = React.useState<boolean>(false);

  const emptyRecord: SystemCenter.Types.ValueListGroup = {ID: 0, Name: '', Description: ''};

    const [showNew, setShowNew] = React.useState<boolean>(false);
  const [record, setRecord] = React.useState<SystemCenter.Types.ValueListGroup>(emptyRecord);

    const items: SystemCenter.Types.ValueListItem[] = useSelector(props.ValueListItemSlice.Data);
  const itemStatus: Application.Types.Status = useSelector(props.ValueListItemSlice.Status);

  const [search, setSearch] = React.useState<Search.IFilter<SystemCenter.Types.ValueListGroup>[]>([]);
    const [newErrors, setNewErrors] = React.useState<string[]>([]);
    const [validName, setValidName] = React.useState<boolean>(true);

    React.useEffect(() => {
        if (dataStatus === 'unintiated' || dataStatus === 'changed')
            dispatch(props.ValueListSlice.DBSearch({filter: search, sortField: sortKey, ascending: asc}));

}, [dispatch]);

    React.useEffect(() => {
        dispatch(props.ValueListSlice.DBSearch({filter: search, sortField: sortKey, ascending: asc}));
     },[search,asc,sortKey]
    );

    React.useEffect(() => {
        if (itemStatus === 'unintiated' || itemStatus === 'changed')
            dispatch(props.ValueListItemSlice.Fetch());

}, [dispatch]);

    React.useEffect(() => {
        if (groupStatus === 'unintiated' || groupStatus === 'changed')
            dispatch(props.ValueListSlice.Fetch());
    }, [dispatch]);

    React.useEffect(() => {
            if (record.Name == null)
                setValidName(true)
            else
                setValidName(groups.findIndex(g => g.Name.toLowerCase() === record.Name.toLowerCase()) < 0)
    }, [record])

 return (
       <div style={{ width: '100%', height: '100%' }}>
           <SearchBar< SystemCenter.Types.ValueListGroup> CollumnList={[{ label: 'Name', key: 'Name', type: 'string', isPivotField: false }]} SetFilter={(flds) => setSearch(flds)} Direction={'left'} defaultCollumn={{ label: 'Name', key: 'Name', type: 'string', isPivotField: false }} Width={'50%'} Label={'Search'}
               ShowLoading={dataStatus === 'loading' || itemStatus === 'loading'} ResultNote={dataStatus === 'error' || itemStatus === 'error' ? 'Could not complete Search' : 'Found ' + data.length + ' Groups'}
               GetEnum={() => { return () => { }; }}
           >
               <li className="nav-item" style={{ width: '15%', paddingRight: 10 }}>
                   <fieldset className="border" style={{ padding: '10px', height: '100%' }}>
                       <legend className="w-auto" style={{ fontSize: 'large' }}>Actions:</legend>
                       <form>
                           <button className="btn btn-primary" onClick={(evt) => { evt.preventDefault(); setRecord({ ...emptyRecord }); setShowNew(true) }}>Add Group</button>
                       </form>
                   </fieldset>
               </li>
           </SearchBar>

           <div style={{ width: '100%', height: 'calc( 100% - 136px)' }}>
               <Table< SystemCenter.Types.ValueListGroup>
                   cols={[
                       { key: 'Name', field: 'Name', label: 'Name', headerStyle: { width: '15%' }, rowStyle: { width: '15%' } },
                       { key: 'Description', field: 'Description', label: 'Description/Comments', headerStyle: { width: 'auto' }, rowStyle: { width: 'auto' } },
                       { key: 'Items', field: 'Items', label: 'Items', headerStyle: { width: '10%' }, rowStyle: { width: '10%' }, content: (item) => items.filter(i => i.GroupID === item.ID).length },
                       { key: 'Scroll', label: '', headerStyle: { width: 17, padding: 0 }, rowStyle: { width: 0, padding: 0 } },
                   ]}
                   tableClass="table table-hover"
                   data={data}
                   sortKey={sortKey}
                   ascending={asc}
                   onSort={(d) => {
                                         if (d.colKey === 'remove' || d.colKey === 'scroll' || d.colField === undefined)
                                             return;
                                         setSortKey(d.colField);
                                         if (d.colField === sortKey)
                                             setASC((b) => !b)
                                         else
                                             setASC(true)
                   }}
                   onClick={(d) => props.OnValueListSelect(d.row.ID)}
                   theadStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%' }}
                   tbodyStyle={{ display: 'block', overflowY: 'scroll', maxHeight: window.innerHeight - 300, width: '100%'  }}
                   rowStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%' }}
                   selected={(item) => false}
               />
           </div>

                    <Modal Show={showNew} Title={'Add new Value List'} ShowX={true} ShowCancel={false} DisableConfirm={newErrors.length > 0 || !validName} ConfirmShowToolTip={newErrors.length > 0 || !validName}
                    ConfirmToolTipContent={
                        <>
                        {newErrors.map((t,i) => <p key={i}> {CrossMark} {t}</p>)}
                        {!validName? <p>{CrossMark} The Name has to be unique.</p> : null}
                        </>
                        }
                     CallBack={(c)=>{
                            setShowNew(false);
                            if (c)
                                dispatch(props.ValueListSlice.DBAction({verb: 'POST', record}))

                    }}>
                        <GroupForm Record={record} Setter={setRecord} ErrorSetter={setNewErrors} />
                    </Modal>
       </div>
   )
}

export default ByValueListGroup;
