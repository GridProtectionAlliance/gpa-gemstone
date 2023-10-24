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
}

/**
 * Table with modal to show and hide columns
 */
export default function ConfigurableTable<T>(props: IProps<T>) {
    const [showSettings, setShowSettings] = React.useState<boolean>(false);
    const [columns, setColumns] = React.useState<Column<T>[]>(props.cols);
    const [colKeys, setColKeys] = React.useState<string[]>(props.cols.map(d => d.key));
    const [colEnabled, setColEnabled] = React.useState<boolean[]>(props.cols.map(d => props.defaultColumns.findIndex(v => v === d.key) > -1 ||
        (props.requiredColumns !== undefined && props.requiredColumns.findIndex(v => v === d.key) > -1) || (props.sortKey === d.key) ||
        checkLocal(d.key)
    ));
    const [hover,setHover] = React.useState<boolean>(false);
    const [guid] = React.useState<string>(CreateGuid());

    React.useEffect(() => {
        if (props.cols.length !== colEnabled.length) {
            setColEnabled(props.cols.map(d => props.defaultColumns.findIndex(v => v === d.key) > -1 ||
                (props.requiredColumns !== undefined && props.requiredColumns.findIndex(v => v === d.key) > -1) || (props.sortKey === d.key) ||
                checkLocal(d.key)));
        } else {
            // We need to redo this set collumn here to capture function changes within columns
            setColumns(props.cols.filter((c, i) => colEnabled[i]));
        }
    }, [props.cols, colEnabled]);

    React.useEffect(() => {
        setColKeys(props.cols.map(d => d.key));
    }, [props.cols]);

    React.useEffect(() => {
        if (props.onSettingsChange !== undefined)
            props.onSettingsChange(showSettings);
    }, [showSettings]);

    React.useEffect(() => {
        saveLocal();
    }, [colEnabled]);

    function saveLocal() {
        if (props.localStorageKey === undefined)
            return;
        const currentState = localStorage.getItem(props.localStorageKey);
        let currentKeys: string[] = []
        if (currentState !== null)
            currentKeys = currentState.split(",");

        currentKeys = currentKeys.filter(k => !colKeys.includes(k));
        currentKeys.push(...colKeys.filter((k,i) => colEnabled[i]));
        localStorage.setItem(props.localStorageKey, currentKeys.join(","));
    }

    function changeCollums(index: number, key: string) {
        setColEnabled((d) => d.map((c, i) => (i === index ? !c : c)));
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
    return (
        <>
            <Table<T>
                cols={[...columns,
                {
                        key: 'SettingsCog', label: <div style={{marginLeft: -25}} 
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        id={guid + '-tooltip'}
                    >{SVGIcons.Settings}</div>,
                    headerStyle: { width: 30, padding: 0, verticalAlign: 'middle', textAlign: 'right' },
                    rowStyle: { padding: 0, width: 30 }
                }
                ]}
                data={props.data}
                onClick={props.onClick}
                sortKey={props.sortKey}
                ascending={props.ascending}
                onSort={(d,evt) => { if (d.colKey === 'SettingsCog') setShowSettings(true); else props.onSort(d, evt); }}
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
            />
            <ToolTip Show={hover} Position={'bottom'} Theme={'dark'} Target={guid + '-tooltip'} Zindex={9999}>
                <p>Change Columns</p>
            </ToolTip>
            {props.settingsPortal === undefined?
                <Modal Title={'Table Columns'} Show={showSettings} ShowX={true} ShowCancel={false}
                    CallBack={(conf: boolean) => {
                        setShowSettings(false);
                        if (conf)
                            setColEnabled(
                                props.cols.map(d => props.defaultColumns.findIndex(v => v === d.key) > -1 ||
                                    (props.requiredColumns !== undefined && props.requiredColumns.findIndex(v => v === d.key) > -1) || (props.sortKey === d.key)
                                ));
                    }
                    }
                    ConfirmText={'Reset Defaults'}
                    ConfirmBtnClass={'btn-primary float-left'}
                >
                <ColumnSelection<T> requiredColumns={props.requiredColumns} columns={props.cols} onChange={changeCollums} isChecked={(i) => colEnabled[i]} sortKey={props.sortKey}/>
                </Modal>
            : (showSettings? <Portal node={document && document.getElementById(props.settingsPortal)}>
                    <div className="card">
                        <div className="card-header">
                            <h4 className="modal-title">Table Columns</h4>
                        <button type="button" className="close" onClick={() => setShowSettings(false) }>&times;</button>
                        </div>
                        <div className="card-body" style={{ maxHeight: 'calc(100% - 210px)', overflowY: 'auto' }}>
                        <ColumnSelection<T> requiredColumns={props.requiredColumns} columns={props.cols} onChange={changeCollums} isChecked={(i) => colEnabled[i]} sortKey={props.sortKey}/>
                        </div>
                        <div className="card-footer">
                            <button type="button"
                                className={'btn btn-primary float-left'}
                                onClick={() => {
                                    setShowSettings(false);
                                    setColEnabled(
                                        props.cols.map(d => props.defaultColumns.findIndex(v => v === d.key) > -1 ||
                                            (props.requiredColumns !== undefined && props.requiredColumns.findIndex(v => v === d.key) > -1) || (props.sortKey === d.key)
                                        ));

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
    columns: Column<T>[],
    onChange: (index: number, key: string) => void,
    isChecked: (index: number) => boolean,
    sortKey: string
}

function ColumnSelection<T>(props: IColSelectionProps<T>) {

    const [showHelp, setShowHelp] = React.useState<boolean>(false);
    const [guid, setGuid] = React.useState<string>(CreateGuid());

    function createColumns(){
        let j = 0;
        const set: [JSX.Element[], JSX.Element[], JSX.Element[]] = [[], [], []];

        props.columns.forEach((k,i) => {
            if (props.requiredColumns === undefined || props.requiredColumns.findIndex(v => v === k.key) > -1)
                return;
            set[j%3].push(<li key={k.key} className='form-check form-check-inline'>
                <input type="checkbox" onChange={() => { if (k.key === props.sortKey) return; props.onChange(i, k.key); }}
                    checked={props.isChecked(i) || k.key === props.sortKey} className='form-checked-input' disabled={k.key === props.sortKey} />
                <label className="form-check-label" style={{marginLeft: 8}}>
                    {k.label}
                    {k.key === props.sortKey? <div style={{ 
                        width: '1.5em',
                        height: '1.5em',
                        borderRadius: '50%',
                        display: 'inline-block',
                        background: '#0D6EFD',
                        marginLeft: 10,
                        textAlign: 'center',
                        fontWeight: 'bold'
                    }}
                        onMouseEnter={() => setShowHelp(true)}
                        onMouseLeave={() => setShowHelp(false)}
                        data-tooltip={guid}
                    > ? </div> : null}
                </label>
                {<ToolTip Show={showHelp} Target={guid} Zindex={9999}>
                    The Table is currently sorted by this Column so it cannot be hidden.
                </ToolTip>}
            </li>);
            j = j + 1;
        })

        return set.map(c => (
            <div className='col'>
                <form>
                    <ul style={{ listStyleType: 'none', padding: 0, width: '100%', position: 'relative', float: 'left' }}>
                        {c}
                    </ul>
                </form>
            </div>
        ));
    }

    return <>
        <div className='row'>
            {createColumns()}
        </div>
    </>
}