// ******************************************************************************************************
//  AdditionalField.tsx - Gbtc
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
//  07/14/2021 - C. Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import Table from '@gpa-gemstone/react-table';
import { CrossMark, HeavyCheckMark, Warning } from '@gpa-gemstone/gpa-symbols';
import {  Modal, ToolTip, ServerErrorIcon, Warning as WarningModal } from '@gpa-gemstone/react-interactive';
import { SystemCenter, Application } from '@gpa-gemstone/application-typings';
import { CheckBox, Input, Select } from '@gpa-gemstone/react-forms';
import {IAdditionalFieldSlice, IGenericSlice} from '../SliceInterfaces';
import { useDispatch, useSelector } from 'react-redux';
import { IsInteger, IsNumber } from '@gpa-gemstone/helper-functions';
import { Dispatch } from '@reduxjs/toolkit';

interface IField {
    FieldName: string,
    Type: string,
}

interface IValue {
    Value: string| number,
    ID: number
}

interface IProps<Field extends IField, Value extends IValue> {
    Id: string|number,
  AdditionalFieldSlice: IAdditionalFieldSlice<Field, Value>,
    ValueListItemSlice: IGenericSlice<SystemCenter.Types.ValueListItem>
    ValueListGroupSlice: IGenericSlice<SystemCenter.Types.ValueListGroup>,
    EmptyField: Field
    GetFieldValueIndex: (field: Field, values: Value[]) => number,
    GetFieldIndex: (value: Value, fields: Field[]) => number,
    FieldKeySelector: (field: Field) => string,
    ValidateField: (field: Field) => string[],
    CreateValue: (field: Field) => Value,
    FieldUI: (field: Field, setField: (field: Field) => void) => JSX.Element
}

function AdditionalField<Field extends IField, Value extends IValue>(props: IProps<Field, Value>)  {
    const dispatch = useDispatch<Dispatch<any>>();

    const valueListItems: SystemCenter.Types.ValueListItem[]  = useSelector(props.ValueListItemSlice.Data);
    const valueListItemStatus: Application.Types.Status = useSelector(props.ValueListItemSlice.Status);

    const valueListGroups: SystemCenter.Types.ValueListGroup[]  = useSelector(props.ValueListGroupSlice.Data);
    const valueListGroupStatus: Application.Types.Status = useSelector(props.ValueListGroupSlice.Status);

  const fields: Field[] = useSelector(props.AdditionalFieldSlice.Fields);
    const values: Value[] = useSelector(props.AdditionalFieldSlice.Values);
    const fieldStatus:  Application.Types.Status = useSelector(props.AdditionalFieldSlice.FieldStatus);
    const valueStatus:  Application.Types.Status = useSelector(props.AdditionalFieldSlice.ValueStatus);
    const valueParentID:  number|string = useSelector(props.AdditionalFieldSlice.ValueParentId);

    const [pageStatus,setPageStatus] = React.useState<Application.Types.Status>('unintiated');

    const [editValues, setEditValues] = React.useState<Value[]>([]);

  const sortField: keyof Field = useSelector(props.AdditionalFieldSlice.SortField);
  const ascending: boolean = useSelector(props.AdditionalFieldSlice.Ascending);

    const [newField, setNewField] = React.useState<Field>(props.EmptyField);
  const [showWarning, setShowWarning] = React.useState<boolean>(false);
  const [showEdit, setShowEdit] = React.useState<boolean>(false);

  const [hover, setHover] = React.useState<('None' | 'Save' | 'New' | 'View' | 'Clear')>('None');

    const [mode, setMode] = React.useState<'Edit'|'View'>('View')

    const [changedFields, setChangedFields] = React.useState<string[]>([]);
    const [errorFields, setErrorFields] = React.useState<string[]>([]);
    const [fieldErrors, setFieldErrors] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (fieldStatus === 'error' || valueStatus === 'error' || valueListGroupStatus === 'error' || valueListItemStatus=== 'error')
            setPageStatus('error')
        else if (fieldStatus === 'loading' || valueStatus === 'loading' || valueListGroupStatus === 'loading' || valueListItemStatus=== 'loading')
                setPageStatus('loading')
        else
            setPageStatus('idle');
    }, [fieldStatus, valueStatus, valueListGroupStatus, valueListItemStatus ])

    React.useEffect(() => {
      if (fieldStatus === 'unintiated' || fieldStatus === 'changed')
                dispatch(props.AdditionalFieldSlice.FetchField());
  }, [dispatch,fieldStatus]);

    React.useEffect(() => {
      if (valueStatus === 'unintiated' || valueStatus === 'changed' || props.Id !== valueParentID)
                dispatch(props.AdditionalFieldSlice.FetchValues(props.Id));
  }, [dispatch,valueStatus,props.Id, valueParentID]);

    React.useEffect(() => {
      if (valueListItemStatus === 'unintiated' || valueListItemStatus === 'changed')
                dispatch(props.ValueListItemSlice.Fetch());
  }, [dispatch,valueListItemStatus]);

    React.useEffect(() => {
      if (valueListGroupStatus === 'unintiated' || valueListGroupStatus === 'changed')
                dispatch(props.ValueListGroupSlice.Fetch());
  }, [dispatch,valueListGroupStatus]);

  React.useEffect(() => { setEditValues(values) }, [values])

    const typeOptions = [{ Value: 'string', Label: 'string' }, { Value: 'integer', Label: 'integer' }, { Value: 'number', Label: 'number' }].concat(valueListGroups.map(x => { return { Value: x.Name, Label: x.Name } }));

    React.useEffect(() => {
        const e = props.ValidateField(newField);
        if (newField.FieldName == null || newField.FieldName.length === 0)
            e.push('A FieldName is required')
        else if (fields.findIndex(f => f.FieldName.toLowerCase() === newField.FieldName.toLowerCase() && props.FieldKeySelector(f) !== props.FieldKeySelector(newField)) > -1)
            e.push('A Field with this FieldName already exists')
        setFieldErrors(e);
    }, [newField])

    React.useEffect(() => {
        const c: string[] = [];
        const e: string[] = [];

        editValues.forEach(v => {
            const eIndex = values.findIndex(val => val.ID === v.ID);
            const fldIndex = props.GetFieldIndex(v,fields);
            if (eIndex === -1 && fldIndex > -1)
                c.push(fields[fldIndex].FieldName);
            else if (fldIndex > -1 && v.Value !== values[eIndex].Value)
                c.push(fields[fldIndex].FieldName);

            if (fldIndex > -1 && fields[fldIndex].Type === 'integer' && !IsInteger(v.Value))
                e.push("'" + fields[fldIndex].FieldName + "' has to be a valid integer")
            if (fldIndex > -1 && fields[fldIndex].Type === 'number' && !IsNumber(v.Value))
                e.push("'" + fields[fldIndex].FieldName + "' has to be a valid number")
        })

        setErrorFields(e);
        setChangedFields(c)
    }, [values,editValues])

        if (pageStatus === 'error')
         return <div className="card" style={{ marginBottom: 10, maxHeight: window.innerHeight - 215 }}>
                 <div className="card-header">
                         <div className="row">
                                 <div className="col">
                                         <h4>Additional Fields:</h4>
                                 </div>
                         </div>
                 </div>
                 <div className="card-body" style={{ maxHeight: window.innerHeight - 315, overflowY: 'auto' }}>
                         <div style={{ width: '100%', height: '200px' }}>
                                 <div style={{ height: '40px', marginLeft: 'auto', marginRight: 'auto', marginTop: 'calc(50% - 20 px)' }}>
                                         <ServerErrorIcon Show={true} Size={40} Label={'A Server Error Occurred. Please Reload the Application'} />
                                 </div>
                         </div>
                 </div>
         </div>

     return (
        <div className="card" style={{ marginBottom: 10, maxHeight: window.innerHeight - 215 }}>
            <div className="card-header">
                <div className="row">
                    <div className="col">
                        <h4>Additional Fields:</h4>
                    </div>
                    <div className="col">
                        {(mode === 'Edit') ?
                            <button className="btn btn-default pull-right" data-tooltip='View' onClick={() => { setMode('View'); setEditValues(values) }} onMouseEnter={() => setHover('View')} onMouseLeave={() => setHover('None')}>View</button> :
                            <button className="btn btn-primary pull-right" onClick={() => setMode('Edit')}>Edit</button>}
                        <ToolTip Show={hover === 'View' && changedFields.length > 0} Position={'left'} Theme={'dark'} Target={"View"}>
                            {changedFields.map((fld,i) => <p key={i}>{Warning} Changes to '{fld}' will be lost. </p>)}
                        </ToolTip>
                    </div>
                </div>

            </div>
            <div className="card-body" style={{ maxHeight: window.innerHeight - 315, overflowY: 'auto' }}>
                <Table<Field>
                  cols={[
                      { key: 'FieldName', field: 'FieldName', label: 'Field', headerStyle: { width: 'auto' }, rowStyle: { width: 'auto' } },
                      { key: 'Type', field: 'Type', label: 'Type', headerStyle: { width: 'auto' }, rowStyle: { width: 'auto' } },
                      {
                          key: 'Value', label: 'Value', headerStyle: { width: 'auto' }, rowStyle: { width: 'auto' }, content: (item) => {
                                                        let valueListgrpId = valueListGroups.findIndex(g => g.Name === item.Type);
                                                        valueListgrpId = (valueListgrpId > -1? valueListGroups[valueListgrpId].ID : -1);
                                                        const vList = valueListItems.filter(i => i.GroupID === valueListgrpId);
                                                        const valIdx = props.GetFieldValueIndex(item,editValues);
                                                        if (valIdx > -1)
                                return <ValueDisplay Mode={mode} Type={item.Type} ValueListItems={vList}  Value={editValues[valIdx]} Setter={(val: Value) => setEditValues((d) => {const u = [...d]; u[valIdx] = val; return u;})} />
                                                        return <ValueDisplay Mode={mode} Type={item.Type} ValueListItems={vList}  Value={props.CreateValue(item)} Setter={(val: Value) => setEditValues((d) => {const u = [...d]; u.push(val); return u;})} />
                                                    }
                      },
                  { key: 'EditButton', label: '', headerStyle: { width: 40, paddingRight: 0, paddingLeft: 10 }, rowStyle: { width: 40, paddingRight: 0, paddingLeft: 10, paddingTop: 36 }, content: (item) => (mode === 'Edit' ? <button className="btn btn-sm" onClick={() => { setNewField(item); setShowEdit(true); }}><span><i className="fa fa-pencil"></i></span></button> : '') },
                  { key: 'DeleteButton', label: '', headerStyle: { width: 40, paddingLeft: 0, paddingRight: 10 }, rowStyle: { width: 40, paddingLeft: 0, paddingTop: 36, paddingRight: 10 }, content: (item) => (mode === 'Edit' ? <button className="btn btn-sm" onClick={() => { setNewField(item); setShowWarning(true); }}><span><i className="fa fa-times"></i></span></button> : '') },

                  ]}
                  tableClass="table table-hover"
                  data={fields}
                  sortKey={sortField as string}
                  ascending={ascending}
                  onSort={(d) => {
                      if (d.colField === undefined)
                          return;
                      if (d.colKey === sortField)
                          dispatch(props.AdditionalFieldSlice.Sort({SortField: d.colField, Ascending: !ascending}))
                      else
                                                dispatch(props.AdditionalFieldSlice.Sort({SortField: d.colField, Ascending: true}))
                  }}
                  onClick={() => { }}
                  theadStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%' }}
                  tbodyStyle={{ display: 'block', overflowY: 'scroll', maxHeight: window.innerHeight - 455,}}
                  rowStyle={{display: 'table', tableLayout: 'fixed', width: '100%' }}
                  selected={() => false}
                                    keySelector={props.FieldKeySelector}
                />
            </div>
            <div className="card-footer">
                <div className="btn-group mr-2">
                    <button className={"btn btn-primary" + (mode === 'View' ? ' disabled' : '')} onMouseEnter={() => setHover('New')} onMouseLeave={() => setHover('None')}
                        onClick={() => { if (mode === 'Edit') { setShowEdit(true); setNewField(props.EmptyField) } }} data-tooltip={'New'} >Add Field</button>
                </div>
                <ToolTip Show={hover === 'New' && mode === 'View'} Position={'top'} Theme={'dark'} Target={"New"}>
                    <p> To add a new Field switch to Edit mode by clicking on the Edit Button on the upper right corner.</p>
                </ToolTip>
                <div className="btn-group mr-2">
                    <button className={"btn btn-primary" + (changedFields.length === 0 || mode==='View' || errorFields.length > 0 ? ' disabled' : '')} onClick={() => { if (errorFields.length === 0  && changedFields.length > 0  && mode === 'Edit') dispatch(props.AdditionalFieldSlice.UpdateValues({ParentID: props.Id, Values: editValues})); }}
                        onMouseEnter={() => setHover('Save')} onMouseLeave={() => setHover('None')} data-tooltip={'SaveValues'}>Save Changes</button>
                </div>
                <ToolTip Show={hover === 'Save' && (mode === 'View' || changedFields.length > 0)} Position={'top'} Theme={'dark'} Target={"SaveValues"}>
                    {mode==='View' ? <p> To change any Fields switch to Edit mode by clicking on the Edit Button on the upper right corner.</p> : null}
                    {changedFields.length > 0 && errorFields.length === 0 ? changedFields.map((fld,i) => <p key={i}> {HeavyCheckMark } Changes to '{fld}' are valid.</p>) : null}
                    {changedFields.length > 0 && errorFields.length > 0 ? errorFields.map((t,i) =><p key={i}> {CrossMark} {t}.</p> ) : null}
                </ToolTip>
                <div className="btn-group mr-2">
                    <button className={"btn btn-default" + (changedFields.length === 0 || mode === 'View' ? ' disabled' : '')}
                                         onClick={() => {
                                             if (changedFields.length > 0 && mode === 'Edit')
                                                 setEditValues(values);
                                             }}
                                         onMouseEnter={() => setHover('Clear')}
                    onMouseLeave={() => setHover('None')} data-tooltip={'Reset'}>Reset</button>
                </div>
                <ToolTip Show={hover === 'Clear' && (mode === 'View' || changedFields.length > 0)} Position={'top'} Theme={'dark'} Target={'Reset'}>
                    {mode === 'View'? <p> To change any Fields switch to Edit mode by clicking on the Edit Button on the upper right corner.</p> : null}
                    {changedFields.length > 0? changedFields.map((fld,i) => <p key={i}>{Warning} Changes to '{fld}' will be lost. </p>) : null }
                </ToolTip>
            </div>
            <WarningModal Show={showWarning} Title={'Delete ' + newField.FieldName}
                Message={"This will delete all instances of '" + newField.FieldName + "' and will also delete all information assigned to these fields."}
                CallBack={(confirm: boolean) => { if (confirm) dispatch(props.AdditionalFieldSlice.FieldAction({Verb: 'DELETE', Record: newField})); setShowWarning(false) }} />

            <Modal
                Title={'Additional Field'} ConfirmText={'Save'} ShowX={true} ShowCancel={false}
                ConfirmBtnClass={'btn-primary' + (fieldErrors.length > 0 ? ' disabled' : '')}
                Show={showEdit} Size={'lg'}
                CallBack={(confirmation) => {
                    if (confirmation) {
                        if (props.FieldKeySelector(newField) === "new")
                          dispatch(props.AdditionalFieldSlice.FieldAction({Verb: "POST", Record: newField}))
                        else
                          dispatch(props.AdditionalFieldSlice.FieldAction({Verb: "PATCH", Record: newField}))
                    }

                    setShowEdit(false);
                }}
                ConfirmShowToolTip={fieldErrors.length > 0}
                ConfirmToolTipContent={fieldErrors.map((t,i) => <p key={i}>{CrossMark} {t} </p>)}
                >
                <Input<Field> Record={newField} Field='FieldName' Valid={(field) =>
                                    newField.FieldName != null && newField.FieldName.length > 0
                                     && fields.findIndex(f => f.FieldName.toLowerCase() === newField.FieldName.toLowerCase() && props.FieldKeySelector(f) !== props.FieldKeySelector(newField)) < 0}
                              Label="Field Name" Setter={setNewField} Feedback={'The additional field needs to have a unique Field Name'} />
                <Select<Field> Record={newField} Field='Type' Options={typeOptions} Label="Field Type" Setter={setNewField} />
                {props.FieldUI !== undefined? props.FieldUI(newField,setNewField) : null}
            </Modal>
        </div>

    );

}

export default AdditionalField;

interface IValueDisplayProps<V extends IValue> {
    Type: string,
    ValueListItems: SystemCenter.Types.ValueListItem[],
    Value: V,
    Setter: (val: V) => void,
    Mode: 'Edit'|'View'
}

function ValueDisplay<V extends IValue> (props: IValueDisplayProps<V>) {

    React.useEffect(() => {
        if (props.Type === 'integer' || props.Type === 'number' || props.Type === 'string')
            return;
        else if (props.Type !== 'boolean' &&
         props.ValueListItems.findIndex(i => i.Value.toLowerCase() === props.Value.Value.toString().toLowerCase()) < 0
         && props.ValueListItems.length > 0)
            props.Setter({...props.Value, Value: props.ValueListItems[0].Value})
    }, [props.Type, props.Value, props.ValueListItems])

  if (props.Mode === 'View') {
        if (props.Type === 'boolean')
            return <span>{props.Value.Value.toString().toLowerCase() === "true" ? "true" : "false"}</span>
        else
            return <span>{props.Value.Value}</span>;
    }

        if (props.Type === 'number')
             return <Input<V> Record={props.Value} Field={'Value'} Valid={() => IsInteger(props.Value.Value)} Label={''} Type={'number'} Setter={props.Setter} Feedback={'Thi Field is a numeric field.'} />
     if (props.Type === 'integer')
             return <Input<V> Record={props.Value} Field={'Value'} Valid={() => IsNumber(props.Value.Value)} Label={''} Type={'number'} Setter={props.Setter} Feedback={'Thi Field is an integer field.'} />
     else if (props.Type === 'string')
             return <Input<V> Record={props.Value} Field={'Value'} Valid={() => true} Label={''} Type={'text'} Setter={props.Setter} />
     else if (props.Type === 'boolean')
             return <CheckBox<V> Record={props.Value} Field={'Value'} Label={''} Setter={props.Setter} />
     else
             return <Select<V> EmptyOption={true} Record={props.Value} Field={'Value'} Label={''} Setter={props.Setter}
             Options={props.ValueListItems.map(x => ({ Value: x.ID.toString(), Label: x.Value }))}/>

  }
