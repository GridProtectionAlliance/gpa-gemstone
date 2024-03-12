// ******************************************************************************************************
//  Setting.tsx - Gbtc
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
//  04/28/2021 - C. Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import { Input } from '@gpa-gemstone/react-forms';
import Table from '@gpa-gemstone/react-table';
import { CrossMark } from '@gpa-gemstone/gpa-symbols';
import { SearchBar, Search, Modal, Warning, LoadingScreen, ServerErrorIcon } from '@gpa-gemstone/react-interactive';
import { ISearchableSlice } from './SliceInterfaces';
import { Application, SystemCenter } from '@gpa-gemstone/application-typings';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';

interface IProps {
  SettingsSlice: ISearchableSlice<SystemCenter.Types.Setting>
}



function Setting(props: IProps)  {
  const dispatch = useDispatch<Dispatch<any>>();

  const search: Search.IFilter<SystemCenter.Types.Setting>[] = useSelector(props.SettingsSlice.SearchFilters);
  const searchStatus: Application.Types.Status =  useSelector(props.SettingsSlice.SearchStatus);

  const data:  SystemCenter.Types.Setting[] =  useSelector(props.SettingsSlice.SearchResults);
  const allSettings: SystemCenter.Types.Setting[] =  useSelector(props.SettingsSlice.Data);
  const status: Application.Types.Status =  useSelector(props.SettingsSlice.Status);

  const [sortField, setSortField] = React.useState<keyof SystemCenter.Types.Setting>('Name');
  const [ascending, setAscending] = React.useState<boolean>(true);

  const emptySetting = {ID: 0, Name: '', Value: '', DefaultValue: ''}
  const [editnewSetting, setEditNewSetting] = React.useState<SystemCenter.Types.Setting>(emptySetting);
  const [editNew, setEditNew] = React.useState<Application.Types.NewEdit>('New');

  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [showWarning, setShowWarning] = React.useState<boolean>(false);
  const [hasChanged, setHasChanged] = React.useState<boolean>(false);

  const [errors, setErrors] = React.useState<string[]>([]);

  React.useEffect(() => {
      if (status === 'unintiated' || status === 'changed')
        dispatch(props.SettingsSlice.Fetch());
  }, [dispatch,status]);

  React.useEffect(() => {
      if (searchStatus === 'unintiated' || status === 'changed')
        dispatch(props.SettingsSlice.DBSearch({filter: search, sortField, ascending}));
  }, [dispatch,searchStatus, ascending, sortField, search]);

  React.useEffect(() => { setHasChanged(false) }, [showModal]);

  React.useEffect(() => {
    const e: string[] = [];
    if (editnewSetting.Name == null || editnewSetting.Name.length === 0)
      e.push('A Name is required')
    if (editnewSetting.Name != null && editnewSetting.Name.length > 0 && allSettings.findIndex(s => s.Name.toLowerCase() === editnewSetting.Name.toLowerCase() && s.ID !== editnewSetting.ID) > -1)
      e.push('A Settign with this Name already exists.')
    if (editnewSetting.Value == null || editnewSetting.Value.length === 0)
      e.push('A Value is required')
    setErrors(e)
  }, [editnewSetting])

  const searchFields: Search.IField<SystemCenter.Types.Setting>[] = [
      { key: 'Name', label: 'Name', type: 'string', isPivotField: false },
      { key: 'DefaultValue', label: 'Default Value', type: 'string', isPivotField: false },
      { key: 'Value', label: 'Value', type: 'string', isPivotField: false }
  ]

  if (status === 'error')
    return <div style={{ width: '100%', height: '100%' }}>
    <ServerErrorIcon Show={true} Label={'A Server Error Occured. Please Reload the Application'}/>
    </div>;

  return (
      <>
      <LoadingScreen Show={status === 'loading'} />
      <div style={{ width: '100%', height: '100%' }}>
        <SearchBar<SystemCenter.Types.Setting> CollumnList={searchFields} SetFilter={(flds) => dispatch(props.SettingsSlice.DBSearch({filter: flds, sortField, ascending}))}
          Direction={'left'} defaultCollumn={{ key: 'Name', label: 'Name', type: 'string', isPivotField: false}} Width={'50%'} Label={'Search'}
          ShowLoading={searchStatus === 'loading'} ResultNote={searchStatus === 'error' ? 'Could not complete Search' : 'Found ' + data.length + ' Settings'}
          GetEnum={() => {
            return () => {}
          }}
        >
          <li className="nav-item" style={{ width: '15%', paddingRight: 10 }}>
            <fieldset className="border" style={{ padding: '10px', height: '100%' }}>
              <legend className="w-auto" style={{ fontSize: 'large' }}>Actions:</legend>
              <form>
                <button className="btn btn-primary" onClick={(event) => { setEditNewSetting(emptySetting); setEditNew('New'); setShowModal(true); event.preventDefault()}}>Add Setting</button>
              </form>
            </fieldset>
          </li>
        </SearchBar>

        <div style={{ width: '100%', height: 'calc( 100% - 136px)' }}>
          <Table<SystemCenter.Types.Setting>
            cols={[
              { key: 'Name', field: 'Name', label: 'Setting Name', headerStyle: { width: '10%' }, rowStyle: { width: '10%' } },
              { key: 'Value', field: 'Value', label: 'Current Value', headerStyle: { width: '10%' }, rowStyle: { width: '10%' } },
              { key: 'DefaultValue', field: 'DefaultValue', label: 'Default Value', headerStyle: { width: '20%' }, rowStyle: { width: '20%' } },
              { key: 'scroll',  label: '', headerStyle: { width: 17, padding: 0 }, rowStyle: { width: 0, padding: 0 } },
            ]}
            tableClass="table table-hover"
            data={data}
            sortKey={sortField}
            ascending={ascending}
            onSort={(d) => {
              if (d.colKey === 'scroll' || d.colField  === undefined)
                return;
              if (d.colField === sortField)
                setAscending(!ascending);
              else {
                setAscending(true);
                setSortField(d.colField);
              }
              if (d.colField === sortField)
                dispatch(props.SettingsSlice.DBSearch({filter: search, sortField, ascending: true}));
              else
                dispatch(props.SettingsSlice.DBSearch({filter: search, sortField: d.colField, ascending}));
            }}
            onClick={(item) => { setEditNewSetting(item.row); setShowModal(true); setEditNew('Edit');}}
            theadStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%' }}
            tbodyStyle={{ display: 'block', overflowY: 'scroll', maxHeight: window.innerHeight - 300, width: '100%' }}
            rowStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%' }}
            selected={() => false}
          />
        </div>
      </div>
      <Modal Title={editNew === 'Edit' ? editnewSetting.Name + ' - Setting' : 'Add New Setting'}
        Show={showModal} ShowX={true} Size={'lg'} ShowCancel={editNew === 'Edit'} ConfirmText={'Save'} CancelText={'Delete'}
        CallBack={(conf, isBtn) => {
          if (conf && editNew === 'New')
            dispatch(props.SettingsSlice.DBAction({verb: 'POST', record: editnewSetting}))
          if (conf && editNew === 'Edit')
            dispatch(props.SettingsSlice.DBAction({verb: 'PATCH', record: editnewSetting}))
          if (!conf && (isBtn ?? false))
            setShowWarning(true);
          setShowModal(false);
        }}
        DisableConfirm={(editNew === 'Edit' && !hasChanged) || errors.length > 0}
        ConfirmShowToolTip={errors.length > 0}
        ConfirmToolTipContent={
          errors.map((t,i) => <p key={i}>{CrossMark} {t} </p>)
        }
        >
          <div className="row">
            <div className="col">
              <Input<SystemCenter.Types.Setting> Record={editnewSetting} Field={'Name'} Label='Setting Name' Feedback={'A unique Name is required.'}
                Valid={field => editnewSetting.Name != null && editnewSetting.Name.length > 0 && allSettings.findIndex(s => s.Name === editnewSetting.Name && s.ID !== editnewSetting.ID) < 0}
                Setter={(record) => { setEditNewSetting(record); setHasChanged(true); }}
              />
              <Input<SystemCenter.Types.Setting> Record={editnewSetting} Field={'Value'} Label='Value' Feedback={'Value is required.'}
                Valid={field => editnewSetting.Value != null && editnewSetting.Value.length > 0}
                Setter={(record) => { setEditNewSetting(record); setHasChanged(true); }}
              />
              <Input<SystemCenter.Types.Setting> Record={editnewSetting} Field={'DefaultValue'} Label='Default Value' Valid={field => true}
                Setter={(record) => { setEditNewSetting(record); setHasChanged(true); }}
              />
          </div>
        </div>
      </Modal>
      <Warning Title={'Delete Setting'} Message={'This will Delete this Setting from the System. This can have unintended consequences and cause the System to crash. Are you sure you want to continue?'}
          Show={showWarning} CallBack={(conf) => { if (conf) dispatch(props.SettingsSlice.DBAction({verb: 'DELETE', record: editnewSetting})); setShowWarning(false); }} />
    </>)
}

export default Setting;
