// ******************************************************************************************************
//  ConfigurableTable.tsx - Gbtc
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
//  09/15/2021 - Christoph Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import Modal from './Modal';
import Table, { TableProps, Column } from '@gpa-gemstone/react-table';
import { SVGIcons } from '@gpa-gemstone/gpa-symbols';
import {Portal} from 'react-portal';
import ToolTip from './ToolTip';
import { CreateGuid } from '@gpa-gemstone/helper-functions';
import { CheckBox } from '@gpa-gemstone/react-forms';
import * as _ from 'lodash';

interface IProps<T> extends TableProps<T> {
    /**
     * List of Column Keys shown by default.
     */
    defaultColumns: string[],
    /**
     * List of Column Keys that are always shown.
     */
    requiredColumns?: string[],
    /** 
     * ID of the Portal used for tunneling Collumn settings
     */
    settingsPortal?: string
    /**
     * Callback when Settings modal opens or closes
     */
    onSettingsChange?: (open: boolean) => void
    /**
     * The key used to store columns in local storage
     */
    localStorageKey?: string
    /**
     * The minimum CollumnWidth used when cols are resizable
     */
    minimumColumnWidth?: number
}

interface ISelecteableCollumn<T> extends Column<T> {
    selected?: boolean,
    sortOrder: number
}


/**
 * Table with modal to show and hide columns
 */
export default function ConfigurableTable<T>(props: IProps<T>) {
    const [showSettings, setShowSettings] = React.useState<boolean>(false);
    const [columns, setColumns] = React.useState<ISelecteableCollumn<T>[]>(props.cols.map((c) => ({
        ...c,
        selected: isEnabled(c),
        sortOrder: 0
    })));

    const [hover, setHover] = React.useState<boolean>(false);
    const [maxCollumns, setMaxCollumns] = React.useState<boolean>(false);
    const [tblWidth, setTblWidth] = React.useState<number>(0);
    const [guid] = React.useState<string>(CreateGuid());

    const minWidth = props.MinColWidth ?? 100;

    React.useEffect(() => {
        setColumns(props.cols.map((c) => ({
            ...c,
            selected: isEnabled(c),
            sortOrder: 0
        })))
    }, [props.cols]);

    React.useEffect(() => {
        if (props.onSettingsChange !== undefined)
            props.onSettingsChange(showSettings);
    }, [showSettings]);

    React.useEffect(() => {
        saveLocal();
    }, [columns]);

    React.useEffect(() => {
        if (tblWidth == 0) return;
        const n = tblWidth / minWidth;

        if (n <= columns.filter(c => c.selected).length)
            setMaxCollumns(true);
        else
            setMaxCollumns(false);

    }, [tblWidth, columns])

    const tblRows: Column<T>[] = React.useMemo(() => (columns.filter(c => c.selected) as Column<T>[]).concat({
        key: 'SettingsCog', label: <div style={{ marginLeft: -25 }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            id={guid + '-tooltip'}
        >{SVGIcons.Settings}</div>,
        headerStyle: { width: 30, padding: 0, verticalAlign: 'middle', textAlign: 'right' },
        rowStyle: { padding: 0, width: 30 },
        allowResize: false
    }), [columns]);

    function saveLocal() {
        if (props.localStorageKey === undefined)
            return;
        const currentState = localStorage.getItem(props.localStorageKey);
        let currentKeys: string[] = []
        if (currentState !== null)
            currentKeys = currentState.split(",");

        const allKeys = columns.map((c) => c.key); 
        currentKeys = currentKeys.filter(k => !allKeys.includes(k));
        currentKeys.push(...columns.filter((c) => c.selected).map(c => c.key));
        localStorage.setItem(props.localStorageKey, currentKeys.join(","));
    }

    function changeCollums(index: number) {
        setColumns((d) => { const u = _.cloneDeep(d); u[index].selected = !u[index].selected; return u; });
    }

    function checkLocal(key: string): boolean {
        if (props.localStorageKey === undefined)
            return false;
        const keys = localStorage.getItem(props.localStorageKey);
        if (keys === null)
            return false;

        const activeKeys = keys.split(",");
        return activeKeys.includes(key)
    }

    /**
     *     * Determines if a column is enabled by default, required, or was saved in the users preferences
     *     * @param c Column to check
     *     * @param skipLocal If true, will return whether it is enabled as part of the default settings
     *     */
    function isEnabled(c: Column<T>, skipLocal = false) {
        const isDefault = props.defaultColumns.findIndex(v => v === c.key) > -1;
        const isRequired = props.requiredColumns !== undefined && props.requiredColumns.findIndex(v => v === c.key) > -1;
        const isSort = props.sortKey === c.key;
        const isLocal = checkLocal(c.key) && !skipLocal;
        return isDefault || isRequired || isSort || isLocal;
    }

    return (
        <>
            <Table<T>
                cols={tblRows}
                data={props.data}
                onClick={props.onClick}
                sortKey={props.sortKey}
                ascending={props.ascending}
                onSort={(d, evt) => { if (d.colKey === 'SettingsCog') setShowSettings(true); else props.onSort(d, evt); }}
                onDragStart={props.onDragStart}
                tableClass={props.tableClass}
                tableStyle={props.tableStyle}
                theadStyle={props.theadStyle}
                theadClass={props.theadClass}
                tbodyStyle={props.tbodyStyle}
                tbodyClass={props.tbodyClass}
                selected={props.selected}
                rowStyle={props.rowStyle}
                keySelector={props.keySelector}
                allowResize={true}
                MinColWidth={props.minimumColumnWidth}
                UpdateWidth={setTblWidth}
            />
            <ToolTip Show={hover} Position={'bottom'} Theme={'dark'} Target={guid + '-tooltip'} Zindex={99999}>
                <p>Change Columns</p>
            </ToolTip>
            {props.settingsPortal === undefined ?
                <Modal Title={'Table Columns'} Show={showSettings} ShowX={true} ShowCancel={false}
                    CallBack={(conf: boolean) => {
                        setShowSettings(false);
                        if (conf)
                            setColumns((d) => d.map((c) => ({ ...c, selected: isEnabled(c,true) })))
                    }
                    }
                    ConfirmText={'Reset Defaults'}
                    ConfirmBtnClass={'btn-primary float-left'}
                >
                    {maxCollumns ? <div className="alert alert-primary">
                        Due to the size of the browser window only {Math.floor(tblWidth / minWidth)} columns can be displayed. Please remove some columns before adding more.
                    </div> : null}
                    <ColumnSelection<T> requiredColumns={props.requiredColumns}
                        columns={columns}
                        onChange={changeCollums}
                        sortKey={props.sortKey}
                        disableAdd={maxCollumns}
                    />
                </Modal>
                : (showSettings ? <Portal node={document && document.getElementById(props.settingsPortal)}>
                    <div className="card">
                        <div className="card-header">
                            <h4 className="modal-title">Table Columns</h4>
                            <button type="button" className="close" onClick={() => setShowSettings(false)}>&times;</button>
                        </div>
                        <div className="card-body" style={{ maxHeight: 'calc(100% - 210px)', overflowY: 'auto' }}>
                            {maxCollumns ? <div className="alert alert-primary">
                                Due to the size of the browser window only {Math.floor(tblWidth / minWidth)} columns can be displayed. Please remove some columns before adding more.
                            </div> : null}
                            <ColumnSelection<T>
                                requiredColumns={props.requiredColumns}
                                columns={columns}
                                onChange={changeCollums}
                                sortKey={props.sortKey}
                                disableAdd={maxCollumns}
                            />
                        </div>
                        <div className="card-footer">
                            <button type="button"
                                className={'btn btn-primary float-left'}
                                onClick={() => {
                                    setShowSettings(false);
                                    setColumns((d) => d.map((c) => ({ ...c, selected: isEnabled(c, true) })))
                                }}>
                                Reset Defaults
                            </button>
                        </div>
                    </div>
                </Portal> : null)}
        </>
    );

}


interface IColSelectionProps<T> {
    requiredColumns?: string[],
    columns: ISelecteableCollumn<T>[],
    onChange: (index: number) => void,
    sortKey: string,
    disableAdd: boolean
}

function ColumnSelection<T>(props: IColSelectionProps<T>) {
    const cols = React.useMemo(() => props.columns.filter((c) => (!props.requiredColumns?.includes(c.key) ?? true) && c.key !== 'SettingsCog'), [props.columns]);

    return <>
        <div className='row'>
            <div className='col-4'>
                {cols.map((c, i) => (i%3 ==0? <CheckBox
                    Label={c.label?.toString() ?? c.field?.toString()}
                    Field={'selected'} Record={c} Setter={(r) => props.onChange(i)} key={c.key}
                    Disabled={c.key == props.sortKey || (props.disableAdd && !c.selected)}
                    Help={c.key == props.sortKey ? 'The Table is currently sorted by this column so it cannot be hidden.' : undefined}
                /> : null))}
            </div>
            <div className='col-4'>
                {cols.map((c, i) => (i % 3 == 1 ? <CheckBox
                    Label={c.label?.toString() ?? c.field?.toString()}
                    Field={'selected'} Record={c} Setter={(r) => props.onChange(i)} key={c.key}
                    Disabled={c.key == props.sortKey || (props.disableAdd && !c.selected)}
                    Help={c.key == props.sortKey ? 'The Table is currently sorted by this column so it cannot be hidden.' : undefined}
                /> : null))}
            </div>
            <div className='col-4'>
                {cols.map((c, i) => (i % 3 == 2 ? <CheckBox
                    Label={c.label?.toString() ?? c.field?.toString()}
                    Field={'selected'} Record={c} Setter={(r) => props.onChange(i)} key={c.key}
                    Disabled={c.key == props.sortKey || (props.disableAdd && !c.selected)}
                    Help={c.key == props.sortKey ? 'The Table is currently sorted by this column so it cannot be hidden.' : undefined}
                /> : null))}
            </div>
        </div>
    </>
}
