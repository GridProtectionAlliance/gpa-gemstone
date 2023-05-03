// ******************************************************************************************************
//  Note.tsx - Gbtc
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
//  04/28/2021 - C. Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import { Select, TextArea } from '@gpa-gemstone/react-forms';
import Table, { Column } from '@gpa-gemstone/react-table';
import { CrossMark, Pencil, TrashCan } from '@gpa-gemstone/gpa-symbols';
import { Modal, ToolTip, ServerErrorIcon, LoadingScreen } from '@gpa-gemstone/react-interactive';
import { Application, OpenXDA } from '@gpa-gemstone/application-typings';
import moment = require('moment');
import { IGenericSlice } from './SliceInterfaces';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';

interface IProps {
	NoteTypes: OpenXDA.Types.NoteType[],
    NoteTags: OpenXDA.Types.NoteTag[],
	NoteApplications: OpenXDA.Types.NoteApplication[],
	MaxHeight: number,
	Title?: string,
	ReferenceTableID?: number,
	NoteSlice: IGenericSlice<OpenXDA.Types.Note>
	AllowEdit?: boolean,
	AllowRemove?: boolean,
	AllowAdd?: boolean,
	ShowCard?: boolean,
	DefaultApplication?: OpenXDA.Types.NoteApplication
}



function Note(props: IProps)  {
	const dispatch = useDispatch<Dispatch<any>>();
	const standardCollumns =  [
		{ key: 'Note', field: 'Note', label: 'Note', headerStyle: { width: '50%' }, rowStyle: { width: '50%' } },
		{ key: 'Timestamp', field: 'Timestamp', label: 'Time', headerStyle: { width: 'auto' }, rowStyle: { width: 'auto' }, content: (item) => moment.utc(item.Timestamp).format("MM/DD/YYYY HH:mm") },
		{ key: 'UserAccount', field: 'UserAccount', label: 'User', headerStyle: { width: 'auto' }, rowStyle: { width: 'auto' } },
		{
			key: 'buttons', label: '', headerStyle: { width: 'auto' }, rowStyle: { width: 'auto' }, content: (item) => <>
					{allowEdit? <button className="btn btn-sm" onClick={() => handleEdit(item)}><span> {Pencil} </span></button> : null }
					{allowRemove? <button className="btn btn-sm" onClick={() => dispatch(props.NoteSlice.DBAction({verb: 'DELETE', record: item}))}>
					<span> {TrashCan} </span></button> : null }
			</>
		}
	]

  	const [showEdit, setEdit] = React.useState<boolean>(false);
	const [hover, setHover] = React.useState<'add'|'clear'|'none'>('none')
	const [collumns, setCollumns] = React.useState<Column<OpenXDA.Types.Note>>(standardCollumns)

  	const data: OpenXDA.Types.Note[] = useSelector(props.NoteSlice.Data)
	const dataStatus: Application.Types.Status =  useSelector(props.NoteSlice.Status)
	const parentID: number|string|undefined = useSelector((props.NoteSlice.ParentID === undefined? (state: any) => props.ReferenceTableID : props.NoteSlice.ParentID))
	const sortField: keyof OpenXDA.Types.Note = useSelector(props.NoteSlice.SortField)
  	const ascending: boolean = useSelector(props.NoteSlice.Ascending)

	const [note, setNote] = React.useState<OpenXDA.Types.Note>(CreateNewNote());

	React.useEffect(() => {
					if (dataStatus === 'unintiated' || dataStatus === 'changed' || parentID !== props.ReferenceTableID)
						dispatch(props.NoteSlice.Fetch(props.ReferenceTableID));
		}, [props.ReferenceTableID, dispatch, dataStatus]);

	React.useEffect(() => {
		if (note.NoteTypeID > 0 || props.NoteTypes.length === 0)
			return;
		setNote((n) => ({...n, NoteTypeID: props.NoteTypes[0].ID}));
	},[props.NoteTypes]);

	React.useEffect(() => {
		if (note.NoteApplicationID > 0 || props.NoteApplications.length === 0)
			return;
			setNote((n) => ({...n, NoteApplicationID: props.NoteApplications[0].ID}));
	},[props.NoteApplications]);

	React.useEffect(() => {
		if (note.NoteTagID > 0 || props.NoteTags.length === 0)
			return;
		setNote((n) => ({...n, NoteTagID: props.NoteTags[0].ID}));
	},[props.NoteTags]);

	React.useEffect(() => {
		if (note.ReferenceTableID === undefined)
			return
		setNote((n) => ({...n, ReferenceTableID: props.ReferenceTableID !== undefined ? props.ReferenceTableID : -1}));
	},[props.ReferenceTableID]);

	React.useEffect(() => {
		const c = standardCollumns;
		if (props.NoteTags.length > 1)
			c.push({ key: 'NoteTagID', field: 'NoteTagID', label: 'Type', headerStyle: { width: 'auto' }, rowStyle: { width: 'auto' },
			 content: (n) => props.NoteTags.find(t => t.ID === n.NoteTagID)?.Name }
			);
		if (props.NoteApplications.length > 1)
			c.push({ key: 'NoteApplicationID', field: 'NoteApplicationID', label: 'Application', headerStyle: { width: 'auto' }, rowStyle: { width: 'auto' },
			 content: (n) => props.NoteApplications.find(t => t.ID === n.NoteApplicationID)?.Name }
			);
		setCollumns(c);
	}, [props.NoteTags,props.NoteApplications])
	
	const allowEdit = props.AllowEdit === undefined? true : props.AllowEdit;
	const allowRemove = props.AllowRemove === undefined? true : props.AllowRemove;
	const allowAdd = props.AllowAdd === undefined? true : props.AllowAdd;
	const useFixedApp = props.NoteApplications.length === 1 || props.DefaultApplication !== undefined;
	const defaultApplication = props.DefaultApplication !== undefined ? props.DefaultApplication : props.NoteApplications[0];
	const showCard = props.ShowCard === undefined || props.ShowCard;

  function CreateNewNote() {
		const newNote: OpenXDA.Types.Note = {ID: -1, ReferenceTableID: -1, NoteTagID: -1, NoteTypeID: -1, NoteApplicationID: -1, Timestamp: '', UserAccount: '', Note: '' }

		if (props.ReferenceTableID !== undefined)
			newNote.ReferenceTableID = props.ReferenceTableID;

	  if (props.NoteApplications.length > 0)
			newNote.NoteApplicationID = defaultApplication.ID;

		if (props.NoteTypes.length > 0)
			newNote.NoteTypeID = props.NoteTypes[0].ID;

		if (props.NoteTags.length > 0)
			newNote.NoteTagID = props.NoteTags[0].ID;

			return newNote;
	}

  function handleEdit(d: OpenXDA.Types.Note) {
			setNote(d);
      setEdit(true);
		}



	function handleAdd(d: OpenXDA.Types.Note) {
		dispatch(props.NoteSlice.DBAction({verb: 'POST', record: {...d, UserAccount: undefined, Timestamp: moment().format('MM/DD/YYYY HH:mm')}}))
		setNote(CreateNewNote());
	}

	function handleSaveEdit(confirm: boolean) {
        if (note.Note.length === 0 && confirm)
            return;
        setEdit(false);
        if (confirm && allowEdit)
					dispatch(props.NoteSlice.DBAction({verb: 'PATCH', record: note}));
      	setNote(CreateNewNote());

    }

	if (dataStatus === "error")
		return (<div style={{ width: '100%', height: '100%'}}>
						 <div style={{height: '40px', margin:'auto', marginTop: 'calc(50% - 20 px)'}}>
							 <ServerErrorIcon Show={true} Size={40} Label={'A Server Error Occured. Please Reload the Application'}/>
						 </div>
					 </div>)



	

    return (
				<div className={pshowCard? "card" : ""} style={{ marginBottom: 10, maxHeight: props.MaxHeight, width: '100%'}}>
				<LoadingScreen Show={dataStatus === 'loading'}/>
					<div className={props.ShowCard === undefined || props.ShowCard? "card-header" : ""}>
                <div className="row">
                    <div className="col">
                        <h4>{props.Title !== undefined? props.Title : 'Notes:'}</h4>
                    </div>
                </div>
            </div>
						<div className={showCard? "card-body" : ""} 
						style={{ maxHeight: props.MaxHeight - 100, overflowY: 'auto', width: '100%' }}>
						{allowAdd && !showCard?
						<>
							<NoteOptions 
							Record={note} Setter={(n) => setNote(n)} 
							NoteTags={props.NoteTags} NoteTypes={props.NoteTypes} 
							NoteApplications={props.NoteApplications}
							ShowApplications={!useFixedApp}
							/>
							
							<div className="btn-group mr-2">
							<button className={"btn btn-primary" + (note.Note === null ||note.Note.length === 0 ? ' disabled' : '')} onClick={() => { if (note.Note !== null && note.Note.length > 0) handleAdd(note); }} data-tooltip={"Add"} style={{ cursor: note.Note === null || note.Note.length === 0 ? 'not-allowed' : 'pointer' }} onMouseOver={() => setHover('add')} onMouseOut={() => setHover('none')}>Add Note</button>
							<ToolTip Show={hover === 'add' && ( note.Note === null || note.Note.length === 0 )} Position={'top'} Theme={'dark'} Target={"Add"}>
								<p>{CrossMark} A note needs to be entered. </p>
							</ToolTip>
						</div>
						<div className="btn-group mr-2">
							<button className={"btn btn-default" + (note.Note === null || note.Note.length === 0  ? ' disabled' : '')} onClick={() => setNote((n) => ({...n, Note: ''}))} style={{ cursor: note.Note === null || note.Note.length === 0 ? 'not-allowed' : 'pointer' }} data-tooltip={"Remove"} onMouseOver={() => setHover('clear')} onMouseOut={() => setHover('none')} >Clear</button>
							<ToolTip Show={hover === 'clear' && (note.Note === null || note.Note.length === 0)} Position={'top'} Theme={'dark'} Target={"Remove"}>
								<p>{CrossMark} The note field is already empty. </p>
							</ToolTip>
						</div>
						</> : null }
            <div>
							<Table<OpenXDA.Types.Note>
										cols={collumns}
										tableClass="table table-hover"
										data={data}
										sortKey={sortField}
										ascending={ascending}
										onSort={(d) => {
												if (d.colField === undefined)
														return;
												if (d.colField === sortField)
													dispatch(props.NoteSlice.Sort({SortField: sortField, Ascending: ascending}))
												else
													dispatch(props.NoteSlice.Sort({SortField: d.colField, Ascending: true}))

										}}
										onClick={() => { return;}}
										theadStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%' }}
										tbodyStyle={{ display: 'block', overflowY: 'scroll', maxHeight: props.MaxHeight - 300, width: '100%' }}
										rowStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%' }}
										selected={() => false}
								/>
            </div>
						{allowAdd && showCard?
							<NoteOptions 
							Record={note} Setter={(n) => setNote(n)} 
							NoteTags={props.NoteTags} NoteTypes={props.NoteTypes} 
							NoteApplications={props.NoteApplications}
							ShowApplications={!useFixedApp}
							/>
						 : null }
						 <Modal Show={showEdit} Title={'Edit Note'}
                    ShowCancel={true}
                    CallBack={handleSaveEdit}
                    DisableConfirm={note.Note == null || note.Note.length === 0}
                    ShowX={true}
                    ConfirmShowToolTip={note.Note == null || note.Note.length === 0}
                    ConfirmToolTipContent={
                        <p> {CrossMark} An empty Note can not be saved. </p>
                    }>
                    <NoteOptions Record={note} Setter={(n) => setNote(n)} NoteTags={props.NoteTags} NoteTypes={props.NoteTypes} NoteApplications={props.NoteApplications}/>
                </Modal>
						</div>
						  {allowAdd && showCard?
								<div className={"card-footer"} >
								<div className="btn-group mr-2">
                    <button className={"btn btn-primary" + (note.Note === null ||note.Note.length === 0 ? ' disabled' : '')} onClick={() => { if (note.Note !== null && note.Note.length > 0) handleAdd(note); }} data-tooltip={"Add"} style={{ cursor: note.Note === null || note.Note.length === 0 ? 'not-allowed' : 'pointer' }} onMouseOver={() => setHover('add')} onMouseOut={() => setHover('none')}>Add Note</button>
                    <ToolTip Show={hover === 'add' && ( note.Note === null || note.Note.length === 0 )} Position={'top'} Theme={'dark'} Target={"Add"}>
                        <p>{CrossMark} A note needs to be entered. </p>
                    </ToolTip>
                </div>
                <div className="btn-group mr-2">
                    <button className={"btn btn-default" + (note.Note === null || note.Note.length === 0  ? ' disabled' : '')} onClick={() => setNote((n) => ({...n, Note: ''}))} style={{ cursor: note.Note === null || note.Note.length === 0 ? 'not-allowed' : 'pointer' }} data-tooltip={"Remove"} onMouseOver={() => setHover('clear')} onMouseOut={() => setHover('none')} >Clear</button>
                    <ToolTip Show={hover === 'clear' && (note.Note === null || note.Note.length === 0)} Position={'top'} Theme={'dark'} Target={"Remove"}>
                        <p>{CrossMark} The note field is already empty. </p>
                    </ToolTip>
                </div>
            </div>
						: null}
						{!allowAdd && showCard? <div className={props.ShowCard === undefined || props.ShowCard? "card-footer" : ""}> </div> : null}
            </div>
        )
}

interface OptionProps {
	Record: OpenXDA.Types.Note,
	Setter: (d: OpenXDA.Types.Note) => void,
	NoteTypes: OpenXDA.Types.NoteType[],
	NoteTags: OpenXDA.Types.NoteTag[],
	NoteApplications: OpenXDA.Types.NoteApplication[],
	ShowApplications: boolean,
}

function NoteOptions(props: OptionProps) {

	const showOptions = props.NoteTags.length > 1 || props.NoteTypes.length > 1 || props.NoteApplications.length > 1;
	return (
	<div className="row">
		<div className={showOptions? "col-6" : 'col-12'}>
			<TextArea<OpenXDA.Types.Note> Record={props.Record} Rows={4} Field={'Note'} Setter={(n) => props.Setter(n)} Valid={() => props.Record.Note != null && props.Record.Note.length > 0} Label={''} />
		</div>
	{showOptions? <div className="col-6">
		{props.NoteTypes.length > 1? <Select<OpenXDA.Types.Note> Record={props.Record} Field={'NoteTypeID'} Label={'Note for: '} Options={props.NoteTypes.map(r => ({Value: r.ID.toString(), Label: r.Name }))} Setter={(record: OpenXDA.Types.Note) => props.Setter({...record, NoteTypeID: parseInt(record.NoteTypeID.toString(),10)})}/> : null}
		{props.NoteTags.length > 1? <Select<OpenXDA.Types.Note> Record={props.Record} Field={'NoteTagID'} Label={'Type: '} Options={props.NoteTags.map(r => ({Value: r.ID.toString(), Label: r.Name }))} Setter={(record: OpenXDA.Types.Note) => props.Setter({...record, NoteTagID: parseInt(record.NoteTagID.toString(),10)})}/>: null}
		{ShowApplication && props.NoteApplications.length > 1? <Select<OpenXDA.Types.Note> Record={props.Record} Field={'NoteApplicationID'} Label={'Application: '} Options={props.NoteApplications.map(r => ({Value: r.ID.toString(), Label: r.Name }))} Setter={(record: OpenXDA.Types.Note) => props.Setter({...record, NoteApplicationID: parseInt(record.NoteApplicationID.toString(),10)})}/>: null}
	</div> : null }
	</div>);

}

export default Note;
