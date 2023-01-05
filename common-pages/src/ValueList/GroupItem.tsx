// ******************************************************************************************************
//  GroupItem.tsx - Gbtc
//
//  Copyright © 2021, Grid Protection Alliance.  All Rights Reserved.
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
//  07/04/2021 - C. Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import { SystemCenter, Application } from '@gpa-gemstone/application-typings';
import ItemForm from './ItemForm';
import { Modal } from '@gpa-gemstone/react-interactive';
import { SearchableTable } from '@gpa-gemstone/react-table';
import { CrossMark } from '@gpa-gemstone/gpa-symbols';
import { useDispatch, useSelector } from 'react-redux';
import { IGenericSlice } from '../SliceInterfaces';
import { Dispatch } from '@reduxjs/toolkit';

interface IProps {
		Record: SystemCenter.Types.ValueListGroup
		ValueListItemSlice: IGenericSlice<SystemCenter.Types.ValueListItem>;
	}


export default function GroupItemsWindow(props: IProps) {
	const dispatch = useDispatch<Dispatch<any>>();

	const recordStatus: Application.Types.Status = useSelector(props.ValueListItemSlice.Status);
	const data: SystemCenter.Types.ValueListItem[] = useSelector(props.ValueListItemSlice.Data);
	const parentID: number|string = useSelector((props.ValueListItemSlice.ParentID === undefined? (state: any) => -1 : props.ValueListItemSlice.ParentID));
  const [sortField, setSortField] = React.useState<keyof SystemCenter.Types.ValueListItem>('Value');
	const [ascending,setAscending] = React.useState<boolean>(false);

  const emptyRecord: SystemCenter.Types.ValueListItem = { ID: 0, GroupID: props.Record.ID, Value: '', AltValue: '', SortOrder: 0 };
  const [record, setRecord] = React.useState<SystemCenter.Types.ValueListItem>(emptyRecord);

	const [showNew, setShowNew] = React.useState<boolean>(false);
	const [newErrors, setNewErrors] = React.useState<string[]>([]);

	const [validValue, setValidValue] = React.useState<boolean>(true);

	React.useEffect(() => {
			if (recordStatus === 'unintiated' || recordStatus === 'changed' || parentID !== props.Record.ID)
				dispatch(props.ValueListItemSlice.Fetch(props.Record.ID))
	}, [recordStatus,dispatch]);

	React.useEffect(() => {
		dispatch(props.ValueListItemSlice.Sort({Ascending: ascending, SortField: sortField}));
	}, [sortField, ascending])

	React.useEffect(() => {
		if (record.Value === null)
			setValidValue(true)
		if (data.findIndex((d) => d.Value.toLowerCase() === record.Value.toLowerCase()) > -1 )
			setValidValue(false)
		else
			setValidValue(true)
	}, [record, data])

    return (
        <div className="card" style={{ marginBottom: 10 }}>
            <div className="card-header">
                <div className="row">
                    <div className="col">
                        <h4>List Items:</h4>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <div className="row">
                    <div style={{ width: '100%', height: window.innerHeight - 421, maxHeight: window.innerHeight - 421, padding: 0, overflowY: 'auto' }}>
												<SearchableTable<SystemCenter.Types.ValueListItem>
													cols={[
		                        { key: 'Value', field: 'Value', label: 'Value', headerStyle: { width: 'auto' }, rowStyle: { width: 'auto' } },
		                        { key: 'AltValue', field: 'AltValue', label: 'Alternate Value', headerStyle: { width: 'auto' }, rowStyle: { width: 'auto' } },
		                        { key: 'SortOrder', field: 'SortOrder', label: 'Sort Order', headerStyle: { width: 'auto' }, rowStyle: { width: 'auto' } },
		                        { key: 'remove', label: '', headerStyle: { width: '10%' }, rowStyle: { width: '10%' }, content: (item) => <button className="btn btn-sm" onClick={(e) => {
																e.preventDefault();
																dispatch(props.ValueListItemSlice.DBAction({verb: 'DELETE', record: item}));
														}}><span><i className="fa fa-times"></i></span></button>
													 },
		                        { key: 'scroll', label: '', headerStyle: { width: 17, padding: 0 }, rowStyle: { width: 0, padding: 0 } },
			                    ]}
			                    tableClass="table table-hover"
													data={data}
													sortKey={sortField}
													onSort={(d) => {
														if (d.colKey === 'remove' || d.colKey === 'scroll' || d.colField === undefined)
															return;
														setSortField(d.colField);
														if (d.colField === sortField)
															setAscending((asc) => !asc)
														else
															setAscending(true)
													}}
													ascending
													onClick={() => {}}
												 	theadStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%' }}
												 	tbodyStyle={{ display: 'block', overflowY: 'scroll', maxHeight: window.innerHeight - 300, width: '100%' }}
												 	rowStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%' }}
												 	selected={(item) => false}
													matchSearch={(item,search) => item.Value.toLowerCase().indexOf(search.toLowerCase()) > -1}
												/>
                    </div>
                </div>
            </div>
            <div className="card-footer">
                <div className="btn-group mr-2">
                    <button className="btn btn-primary pull-right" data-toggle="modal" data-target="#exampleModal" onClick={() => {setRecord({ ...emptyRecord, GroupID: props.Record.ID }); setShowNew(true);} }>Add Item</button>
                </div>
            </div>
						<Modal Title={'Add new List Item'} Show={showNew} Size={'lg'} ShowX={true} ShowCancel={false} DisableConfirm={newErrors.length > 0 || !validValue} ConfirmShowToolTip={newErrors.length > 0 || !validValue}
						ConfirmToolTipContent={ <>
							{newErrors.map((t,i) => <p key={i}> {CrossMark} {t}</p>)}
							{!validValue? <p> {CrossMark} A Value has to be unique in a given Item List.</p> : null}
						</>}
						CallBack={(c) => {
							setShowNew(false);
							if (c)
								dispatch(props.ValueListItemSlice.DBAction({verb: 'POST', record}))
						}}
						>
							<ItemForm Record={record} Setter={setRecord} ErrorSetter={setNewErrors} />
						</Modal>

        </div>

    );

}
