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

interface IProps<T> extends TableProps<T> {
    /**
     * List of Column Keys shown by default.
     */
    defaultColumns: string[],
    /**
     * List of Column Keys that are always shown.
     */
    requiredColumns?: string[],
}

/**
 * Table with modal to show and hide collumns
 */
export default function ConfigurableTable<T>(props: IProps<T>) {
    const [showSettings, setShowSettings] = React.useState<boolean>(false);
    const [collumns, setCollumns] = React.useState<Column<T>[]>(props.cols);
    const [colKeys, setColKeys] = React.useState<string[]>(props.cols.map(d => d.key));
    const [colEnabled, setColEnabled] = React.useState<boolean[]>(props.cols.map(d => props.defaultColumns.findIndex(v => v === d.key) > -1 ||
        (props.requiredColumns !== undefined && props.requiredColumns.findIndex(v => v === d.key) > -1)
    ));

    React.useEffect(() => {
        if (props.cols.length !== colEnabled.length)
            setColEnabled(props.cols.map(d => props.defaultColumns.findIndex(v => v === d.key) > -1 || (props.requiredColumns !== undefined && props.requiredColumns.findIndex(v => v === d.key) > -1)));
    }, [props.cols])

    React.useEffect(() => {
        setColKeys(props.cols.map(d => d.key))
    }, [props.cols]);

    React.useEffect(() => {
        setCollumns(props.cols.filter((c, i) => colEnabled[i]));
    }, [colEnabled]);

    function changeCollums(index: number) {
        setColEnabled((d) => d.map((c, i) => (i === index ? !c : c)));
    }
    return (
        <>
            <Table
                cols={[...collumns, { key: 'SettingsCog', label: <div style={{marginLeft: -25}}>{SVGIcons.Settings}</div>, headerStyle: { width: 30, padding: 0, verticalAlign: 'middle', textAlign: 'right' }, rowStyle: { padding: 0, width: 30 } }]}
                data={props.data}
                onClick={props.onClick}
                sortKey={props.sortKey}
                ascending={props.ascending}
                onSort={(d,evt) => { if (d.colKey === 'SettingsCog') setShowSettings(true); else props.onSort(d, evt); }}
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
            <Modal Title={'Table Columns'} Show={showSettings} ShowX={true} ShowCancel={false}
                CallBack={(conf: boolean) => {
                    setShowSettings(false);
                    if (conf)
                        setColEnabled(
                            props.cols.map(d => props.defaultColumns.findIndex(v => v === d.key) > -1 ||
                                (props.requiredColumns !== undefined && props.requiredColumns.findIndex(v => v === d.key) > -1)
                            ));
                }
                }
                ConfirmText={'Reset Defaults'}>
                <div>
                    <form>
                        <ul style={{ listStyleType: 'none', padding: 0, width: '100%', position: 'relative', float: 'left' }}>
                            {colKeys.map((k, i) => (props.requiredColumns === undefined || props.requiredColumns.findIndex(v => v === k) === -1 ?
                                <li key={k}><label><input type="checkbox" onChange={() => changeCollums(i)} checked={colEnabled[i]} /> {k} </label></li> : null)
                            )}
                        </ul>
                    </form>
                </div>
            </Modal>
        </>
    );

}
