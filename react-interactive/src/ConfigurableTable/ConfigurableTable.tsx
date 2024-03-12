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
import Modal from '../Modal';
import { ReactTable } from '@gpa-gemstone/react-table';
import { SVGIcons } from '@gpa-gemstone/gpa-symbols';
import {Portal} from 'react-portal';
import ToolTip from '../ToolTip';
import { CreateGuid } from '@gpa-gemstone/helper-functions';
import { CheckBox } from '@gpa-gemstone/react-forms';
import * as _ from 'lodash';
import ConfigurableColumn from './ConfigurableColumn';

interface TableProps<T> {
    /**
     * List of T objects used to generate rows
     */
    Data: T[];
    /**
     * Callback when the user clicks on a data entry
     * @param data contains the data including the columnKey
     * @param event the onClick Event to allow propagation as needed
     * @returns 
     */
    OnClick?: (data: { colKey: string; colField?: keyof T; row: T; data: T[keyof T] | null, index: number }, event: any) => void;
    /**
     * Key of the collumn to sort by
     */
    SortKey: string;
    /**
     * Boolen to indicate whether the sort is ascending or descending
     */
    Ascending: boolean;
    /**
     * Callback when the data should be sorted
     * @param data the information of the collumn including the Key of the collumn
     * @param event The onCLick event to allow Propagation as needed
     */
    OnSort(data: { colKey: string; colField?: keyof T; ascending: boolean }, event: any): void;
    /**
     * Class of the table component
     */
    TableClass?: string;
    /**
     * style of the table component
     */
    TableStyle?: React.CSSProperties;
    /**
     * style of the thead component
     */
    TheadStyle?: React.CSSProperties;
    /**
     * Class of the thead component
     */
    TheadClass?: string;
    /**
     * style of the tbody component
     */
    TbodyStyle?: React.CSSProperties;
    /**
     * Class of the tbody component
     */
    TbodyClass?: string;
    /**
     * determines if a row should be styled as selected
     * @param data the item to be checked
     * @returns true if the row should be styled as selected
     */
    Selected?: (data: T) => boolean;
    /**
     * 
     * @param data he information of the row including the item of the row
     * @param e the event triggering this
     * @returns 
     */
    OnDragStart?: (data: { colKey: string, colField?: keyof T, row: T, data: T[keyof T] | null, index: number }, e: any) => void;
    /**
     * The default style for the tr element
     */
    RowStyle?: React.CSSProperties;
    /**
     * a Function that retrieves a unique key used for React key properties
     * @param data the item to be turned into a key
     * @returns a unique Key
     */
    KeySelector: (data: T) => string|number;

    /**
     * Optional Element to display in the last row of the Table
     * use this for displaying warnings when the Table content gets cut off
     */
    LastRow?: string | React.ReactNode;
}

interface IProps<T> extends TableProps<T> {
    /** 
     * ID of the Portal used for tunneling Collumn settings
     */
    SettingsPortal?: string
    /**
     * Callback when Settings modal opens or closes
     */
    OnSettingsChange?: (open: boolean) => void
    /**
     * The key used to store columns in local storage
     */
    LocalStorageKey?: string
}

interface IColDesc {Default: boolean, Label: string, Enabled: boolean, Key: string}
/**
 * Table with modal to show and hide columns
 */
export default function ConfigurableTable<T>(props: React.PropsWithChildren<IProps<T>>) {

    const getKeyMappings: () => Map<string,IColDesc> = () => {
        const u = new Map<string,IColDesc>();
        React.Children.forEach(props.children,(element) => {
            if (!React.isValidElement(element))
                return
            if ((element as React.ReactElement<any>).type === ConfigurableColumn) {
                const c = {
                    Default: element.props.Default ?? false,
                    Label: element.props.Label ?? element.props.Key,
                    Enabled: false,
                    Key: element.props.Key
                };
                c.Enabled = isEnabled(c);
                u.set(c.Key,c)
            }
        })
        return u;
    }
    const [showSettings, setShowSettings] = React.useState<boolean>(false);
    const [columns, setColumns] = React.useState<Map<string,IColDesc>>(getKeyMappings())

    const [hover, setHover] = React.useState<boolean>(false);
    const [guid] = React.useState<string>(CreateGuid());

    React.useEffect(() => {
        if (props.OnSettingsChange !== undefined)
            props.OnSettingsChange(showSettings);
    }, [showSettings]);

    React.useEffect(() => {
        saveLocal();
    }, [columns]);

    function saveLocal() {
        if (props.LocalStorageKey === undefined)
            return;
        const currentState = localStorage.getItem(props.LocalStorageKey);
        let currentKeys: string[] = []
        if (currentState !== null)
            currentKeys = currentState.split(",");

        const allKeys = Array.from(columns.keys());
        currentKeys = currentKeys.filter(k => !allKeys.includes(k));
        const enabled = Array.from(columns.keys()).filter(k => columns.get(k)?.Enabled)
        currentKeys.push(...enabled);
        localStorage.setItem(props.LocalStorageKey, currentKeys.join(","));
    }


    function changeCollums(key: string) {

        setColumns((d) => {
            const u = _.cloneDeep(d);
            u.get(key)!.Enabled = !(u.get(key)?.Enabled ?? false);
            return u;
        });
    }

    function checkLocal(key: string|undefined): boolean {
        if (props.LocalStorageKey === undefined)
            return false;
        const keys = localStorage.getItem(props.LocalStorageKey);
        if (keys === null)
            return false;

        const activeKeys = keys.split(",");
        return activeKeys.includes(key ?? "")
    }

    /**
     *     * Determines if a column is enabled by default, required, or was saved in the users preferences
     *     * @param c Column to check
     *     * @param skipLocal If true, will return whether it is enabled as part of the default settings
     *     */
    function isEnabled(c: IColDesc|undefined, skipLocal = false) {
        const isSort = props.SortKey === c?.Key;
        const isLocal = checkLocal(c?.Key) && !skipLocal;
        return (c?.Default ?? false) || isSort || isLocal;
    }

    return (
        <>
            <ReactTable.Table  {...props} LastColumn={<div 
                style={{ marginLeft: -5, marginBottom: 12 }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                id={guid + '-tooltip'}
                onClick={() => setShowSettings(true)}
                >{SVGIcons.Settings}</div> }>
            {React.Children.map(props.children, (element) => {
                    if (!React.isValidElement(element))
                        return null
                    if ((element as React.ReactElement<any>).type === ConfigurableColumn) 
                        return (columns.get(element.props.Key)?.Enabled ?? false)? element.props.children : null;
                    return element
            })}
            </ReactTable.Table>
            <ToolTip Show={hover} Position={'bottom'} Theme={'dark'} Target={guid + '-tooltip'} Zindex={99999}>
                <p>Change Columns</p>
            </ToolTip>
            {props.SettingsPortal === undefined ?
                <Modal Title={'Table Columns'} Show={showSettings} ShowX={true} ShowCancel={false}
                    CallBack={(conf: boolean) => {
                        setShowSettings(false);
                        if (conf)
                            setColumns((d) => {
                                const u = _.cloneDeep(d)
                                Array.from(d.keys()).forEach((k) => {
                                    u.get(k)!.Enabled = isEnabled(u.get(k), true) ?? true
                                })
                                return u;
                            })
                    }}
                    ConfirmText={'Reset Defaults'}
                    ConfirmBtnClass={'btn-primary float-left'}
                >
                    {/*maxCollumns ? <div className="alert alert-primary">
                        Due to the size of the browser window only {Math.floor(tblWidth / minWidth)} columns can be displayed. Please remove some columns before adding more.
                </div> : null*/}
                    <ColumnSelection<T>
                        columns={Array.from(columns.values())}
                        onChange={changeCollums}
                        sortKey={props.SortKey}
                        disableAdd={false}
                    />
                </Modal>
                : (showSettings ? <Portal node={document.getElementById(props.SettingsPortal)}>
                    <div className="card">
                        <div className="card-header">
                            <h4 className="modal-title">Table Columns</h4>
                            <button type="button" className="close" onClick={() => setShowSettings(false)}>&times;</button>
                        </div>
                        <div className="card-body" style={{ maxHeight: 'calc(100% - 210px)', overflowY: 'auto' }}>
                            {/*maxCollumns ? <div className="alert alert-primary">
                                Due to the size of the browser window only {Math.floor(tblWidth / minWidth)} columns can be displayed. Please remove some columns before adding more.
            </div> : null*/}
                            <ColumnSelection<T>
                                columns={Array.from(columns.values())}
                                onChange={changeCollums}
                                sortKey={props.SortKey}
                                disableAdd={false}
                            />
                        </div>
                        <div className="card-footer">
                            <button type="button"
                                className={'btn btn-primary float-left'}
                                onClick={() => {
                                    setShowSettings(false);
                                    setColumns((d) => {
                                        const u = _.cloneDeep(d)
                                        Array.from(d.keys()).forEach((k) => {
                                            u.get(k)!.Enabled = isEnabled(u.get(k), true)?? true
                                        })
                                        return u;
                                    })
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
    columns: IColDesc[],
    onChange: (key: string) => void,
    sortKey: string,
    disableAdd: boolean
}

function ColumnSelection<T>(props: IColSelectionProps<T>) {

    return <>
        <div className='row'>
            <div className='col-4'>
                {props.columns.map((c, i) => (i % 3 == 0 ? <CheckBox
                    Label={c.Label}
                    Field={'Enabled'} Record={c} Setter={() => props.onChange(c.Key)} key={c.Key}
                    Disabled={c.Key == props.sortKey || (props.disableAdd && !c.Enabled)}
                    Help={c.Key == props.sortKey ? 'The Table is currently sorted by this column so it cannot be hidden.' : undefined}
                /> : null))}
            </div>
            <div className='col-4'>
                {props.columns.map((c, i) => (i % 3 == 1 ? <CheckBox
                    Label={c.Label}
                    Field={'Enabled'} Record={c} Setter={() => props.onChange(c.Key)} key={c.Key}
                    Disabled={c.Key == props.sortKey || (props.disableAdd && !c.Enabled)}
                    Help={c.Key == props.sortKey ? 'The Table is currently sorted by this column so it cannot be hidden.' : undefined}
                /> : null))}
            </div>
            <div className='col-4'>
                {props.columns.map((c, i) => (i % 3 == 2 ? <CheckBox
                    Label={c.Label}
                    Field={'Enabled'} Record={c} Setter={() => props.onChange(c.Key)} key={c.Key}
                    Disabled={c.Key == props.sortKey || (props.disableAdd && !c.Enabled)}
                    Help={c.Key == props.sortKey ? 'The Table is currently sorted by this column so it cannot be hidden.' : undefined}
                /> : null))}
            </div>
        </div>
    </>
}
