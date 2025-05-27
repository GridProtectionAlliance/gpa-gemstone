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
import * as ReactTableProps from '../Table/Types';
import { Table } from '../Table/Table';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { Modal, Alert } from '@gpa-gemstone/react-interactive';
import { Portal } from 'react-portal';
import { CreateGuid } from '@gpa-gemstone/helper-functions';
import { CheckBox, ToolTip } from '@gpa-gemstone/react-forms';
import * as _ from 'lodash';
import ConfigurableColumn from './ConfigurableColumn';

interface ITableProps<T> extends ReactTableProps.ITable<T> {
    /**
     * Optional ZIndex for the configurable column modal
     */
    ModalZIndex?: number
    /**
    * ID of the Portal used for tunneling Collumn settings
    */
    SettingsPortal?: string;
    /**
    * Callback when Settings modal opens or closes
    */
    OnSettingsChange?: (open: boolean) => void;
    /**
    * The key used to store columns in local storage
    */
    LocalStorageKey?: string;
}

interface IColDesc {
    Default: boolean;
    Label: string;
    Enabled: boolean;
    Key: string;
}
/**
* Table with modal to show and hide columns
*/
export default function ConfigurableTable<T>(props: React.PropsWithChildren<ITableProps<T>>) {
    const getKeyMappings = () => {
        const updated = new Map<string, IColDesc>();
        const localKeys = localStorage.getItem(props.LocalStorageKey ?? '')?.split(',') ?? [];
        if (localKeys[0] == '') localKeys.pop(); // if localstorage is empty, set the array to an empty array. [''] by default

        React.Children.forEach(props.children, (element) => {
            if (!React.isValidElement(element)) return;
            if ((element as React.ReactElement).type === ConfigurableColumn) {
                const key = element.props.Key;

                const baseCol = {
                    Key: key,
                    Label: element.props.Label ?? key,
                    Default: element.props.Default ?? false,
                    Enabled: false,
                };          // use local if it has anything
                baseCol.Enabled = localKeys.length > 0 ? localKeys.includes(key) : isEnabled(baseCol);
                updated.set(key, baseCol);
            }
        });
        return updated;
    };

    const [showSettings, setShowSettings] = React.useState<boolean>(false);
    const [columns, setColumns] = React.useState<Map<string, IColDesc>>(() => getKeyMappings());
    const [hover, setHover] = React.useState<boolean>(false);
    const [guid] = React.useState<string>(CreateGuid());
    const [widthDisabledAdd, setWidthDisabledAdd] = React.useState<boolean>(false);

    const handleReduceWidthCallback = React.useCallback((hiddenKeys: string[]) => {
        if (hiddenKeys.length !== 0) {
            setWidthDisabledAdd(true);
        } else {
            setWidthDisabledAdd(false);
        }
    }, []);

    React.useEffect(() => {
        setColumns(() => getKeyMappings());
    }, [props.children]);

    React.useEffect(() => {
        if (props.OnSettingsChange !== undefined) props.OnSettingsChange(showSettings);
    }, [showSettings]);

    React.useEffect(() => {
        saveLocal();
    }, [columns]);

    function saveLocal() {
        if (props.LocalStorageKey === undefined) return;

        const currentState = localStorage.getItem(props.LocalStorageKey);
        const allKeys = Array.from(columns.keys());
        let currentKeys: string[] = [];

        if (currentState !== null) currentKeys = currentState.split(',');
        currentKeys = currentKeys.filter((k) => !allKeys.includes(k));

        const enabled = allKeys.filter((k) => columns.get(k)?.Enabled);

        currentKeys.push(...enabled);
        (currentState == null || currentState == '')
            ? localStorage.setItem(props.LocalStorageKey, enabled.join(','))
        : localStorage.setItem(props.LocalStorageKey, currentKeys.join(','));
    }

    function changeColumns(key: string) {
        setColumns((d) => {
            const u = _.cloneDeep(d);
            const mapRef = u.get(key);
            if (mapRef == null) {
                console.error("Could not find reference for column " + key);
            } else mapRef.Enabled = !(u.get(key)?.Enabled ?? false);
            return u;
        });
    }

    function checkLocal(key: string | undefined): boolean {
        if (props.LocalStorageKey === undefined) return false;
        const keys = localStorage.getItem(props.LocalStorageKey);
        if (keys === null) return false;

        const activeKeys = keys.split(',');
        return activeKeys.includes(key ?? '');
    }

    /**
    * Returns true if a column is enabled by default, required as sortKey, or was saved in the users preferences
    * @param c Column to check
    * @param useLocal If true, will not consider if key is in localstorage
    */
    function isEnabled(c: IColDesc | undefined, useLocal = true) {
        if (c == undefined) return false;

        const isDefault = c.Default === true;
        const isSortKey = props.SortKey === c.Key;
        const isInLocal = useLocal && checkLocal(c.Key);

        return isSortKey || isInLocal || isDefault;
    }

    return (
        <>
            <Table
                {...props}
                LastColumn={
                    <div
                        style={{ marginLeft: -5, marginBottom: 12, cursor: 'pointer' }}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        id={guid + '-tooltip'}
                        onClick={() => setShowSettings(true)}
                    >
                        <ReactIcons.Settings />
                    </div>
                }
                ReduceWidthCallback={handleReduceWidthCallback}
            >
                {React.Children.map(props.children, (element) => {
                    if (!React.isValidElement(element)) return null;
                    if ((element as React.ReactElement).type === ConfigurableColumn)
                        return columns.get(element.props.Key)?.Enabled ?? false ? element.props.children : null;
                    return element;
                })}
            </Table>
            <ToolTip Show={hover} Position={'bottom'} Target={guid + '-tooltip'} Zindex={99999}>
                <p>Change Columns</p>
            </ToolTip>
            {props.SettingsPortal === undefined ? (
                <Modal
                    Title={'Table Columns'}
                    Show={showSettings}
                    ShowX={true}
                    ShowCancel={false} ZIndex={props.ModalZIndex}
                    CallBack={(conf: boolean) => {
                        setShowSettings(false);
                        if (conf)
                            setColumns((d) => {
                                const u = _.cloneDeep(d);
                                Array.from(d.keys()).forEach((k) => {
                                    const ref = u.get(k);
                                    if (ref != null)
                                        ref.Enabled = isEnabled(u.get(k), false) ?? true;
                                });
                                return u;
                            });
                    }}
                    ConfirmText={'Reset Defaults'}
                    ConfirmBtnClass={'btn-warning float-left'}
                >
                    {/*maxCollumns ? <div className="alert alert-primary">
                Due to the size of the browser window only {Math.floor(tblWidth / minWidth)} columns can be displayed. Please remove some columns before adding more.
                </div> : null*/}
                    <ColumnSelection
                        columns={Array.from(columns.values())}
                        onChange={changeColumns}
                        sortKey={props.SortKey}
                        disableAdd={widthDisabledAdd}
                    />
                </Modal>
            ) : showSettings ? (
                <Portal node={document?.getElementById(props.SettingsPortal)}>
                    <div className="card">
                        <div className="card-header">
                            <h4 className="modal-title">Table Columns</h4>
                            <button type="button" className="close" onClick={() => setShowSettings(false)}>
                                &times;
                            </button>
                        </div>
                        <div className="card-body" style={{ maxHeight: 'calc(100% - 210px)', overflowY: 'auto' }}>
                            {/*maxCollumns ? <div className="alert alert-primary">
                    Due to the size of the browser window only {Math.floor(tblWidth / minWidth)} columns can be displayed. Please remove some columns before adding more.
                    </div> : null*/}
                            <ColumnSelection
                                columns={Array.from(columns.values())}
                                onChange={changeColumns}
                                sortKey={props.SortKey}
                                disableAdd={widthDisabledAdd}
                            />
                        </div>
                        <div className="card-footer">
                            <button
                                type="button"
                                className={'btn btn-primary float-left'}
                                onClick={() => {
                                    setShowSettings(false);
                                    setColumns((d) => {
                                        const u = _.cloneDeep(d);
                                        Array.from(d.keys()).forEach((k) => {
                                            const ref = u.get(k);
                                            if (ref != null)
                                                ref.Enabled = isEnabled(u.get(k), true) ?? true;
                                        });
                                        return u;
                                    });
                                }}
                            >
                                Reset Defaults
                            </button>
                        </div>
                    </div>
                </Portal>
            ) : null}
        </>
    );
}
interface IColSelectionProps<> {
    requiredColumns?: string[];
    columns: IColDesc[];
    onChange: (key: string) => void;
    sortKey: string;
    disableAdd: boolean;
}

function ColumnSelection(props: IColSelectionProps) {
    const [showAlert, setShowAlert] = React.useState<boolean>(true);
    const enabledCols = props.columns.filter((column) => column.Enabled);
    const isOnlyOneEnabled = enabledCols.length === 1;

    return (
        <>
            <div className="row">
                <div className="col-4">
                    {props.columns.map((c: IColDesc, i: number) =>
                        i % 3 == 0 ? (
                            <CheckBox
                                Label={c.Label}
                                Field={'Enabled'}
                                Record={c}
                                Setter={() => props.onChange(c.Key)}
                                key={c.Key}
                                Disabled={
                                    c.Key === props.sortKey ||
                                    (props.disableAdd && !c.Enabled) ||
                                    (isOnlyOneEnabled && c.Enabled)
                                }
                                Help={
                                    c.Key === props.sortKey
                                        ? 'The Table is currently sorted by this column so it cannot be hidden.'
                                    : isOnlyOneEnabled && c.Enabled
                                        ? 'Table must have one column visible at all times.'
                                    : undefined
                                }
                            />
                        ) : null,
                    )}
                </div>
                <div className="col-4">
                    {props.columns.map((c: IColDesc, i: number) =>
                        i % 3 == 1 ? (
                            <CheckBox
                                Label={c.Label}
                                Field={'Enabled'}
                                Record={c}
                                Setter={() => props.onChange(c.Key)}
                                key={c.Key}
                                Disabled={
                                    c.Key === props.sortKey ||
                                    (props.disableAdd && !c.Enabled) ||
                                    (isOnlyOneEnabled && c.Enabled)
                                }
                                Help={
                                    c.Key === props.sortKey
                                        ? 'The Table is currently sorted by this column so it cannot be hidden.'
                                        : isOnlyOneEnabled && c.Enabled
                                            ? 'Table must have one column visible at all times.'
                                            : undefined
                                }
                            />
                        ) : null,
                    )}
                </div>
                <div className="col-4">
                    {props.columns.map((c: IColDesc, i: number) =>
                        i % 3 == 2 ? (
                            <CheckBox
                                Label={c.Label}
                                Field={'Enabled'}
                                Record={c}
                                Setter={() => props.onChange(c.Key)}
                                key={c.Key}
                                Disabled={
                                    c.Key === props.sortKey ||
                                    (props.disableAdd && !c.Enabled) ||
                                    (isOnlyOneEnabled && c.Enabled)
                                }
                                Help={
                                    c.Key === props.sortKey
                                        ? 'The Table is currently sorted by this column so it cannot be hidden.'
                                        : isOnlyOneEnabled && c.Enabled
                                            ? 'Table must have one column visible at all times.'
                                            : undefined
                                }
                            />
                        ) : null,
                    )}
                </div>
            </div>
            {props.disableAdd ?
                <Alert Class='alert-primary' Style={{ marginBottom: 0, marginTop: '0.5em' }}>Additional columns disabled due to table size.</Alert>
                : null}
        </>
    );
}
