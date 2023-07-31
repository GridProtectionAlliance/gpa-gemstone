// ******************************************************************************************************
//  Group.tsx - Gbtc
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
//  07/04/2021 - C. Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import { SystemCenter, Application } from '@gpa-gemstone/application-typings';
import { ServerErrorIcon, TabSelector, Warning } from '@gpa-gemstone/react-interactive'
import InfoWindow from './GroupInfo';
import GroupItemsWindow from './GroupItem';
import { useDispatch, useSelector } from 'react-redux';
import { IGenericSlice } from '../SliceInterfaces';
import { Dispatch } from '@reduxjs/toolkit';

interface IProps {
    Id: number;
    ValueListSlice: IGenericSlice<SystemCenter.Types.ValueListGroup>;
    ValueListItemSlice: IGenericSlice<SystemCenter.Types.ValueListItem>;
    OnDelete: () => {};
}

    export default function ValueListGroup (props: IProps) {
            const dispatch = useDispatch<Dispatch<any>>();

        const record: SystemCenter.Types.ValueListGroup|undefined = useSelector((state) => props.ValueListSlice.Data(state).find(i => i.ID === props.Id))
            const recordStatus: Application.Types.Status = useSelector(props.ValueListSlice.Status)

            const [tab, setTab] = React.useState('items');
            const [showWarning, setShowWarning] =  React.useState<boolean>(false);

            React.useEffect(() => {

                if (recordStatus === 'unintiated' || recordStatus === 'changed')
                    dispatch(props.ValueListSlice.Fetch());
            }, [dispatch, recordStatus]);

            const Tabs = [
            { Id: "info", Label: "Value List Group Info" },
            { Id: "items", Label: "List Items" }
        ];


                if (recordStatus === 'error' )
                    return <div style={{ width: '100%', height: '100%' }}>
                    <ServerErrorIcon Show={true} Label={'A Server Error Occured. Please Reload the Application'}/>
                    </div>;

                if (record == null)
                    return null;

        return (
            <div style={{ width: '100%', height: window.innerHeight - 63, maxHeight: window.innerHeight - 63, overflow: 'hidden', padding: 15 }}>
                            <div className="row">
                    <div className="col">
                        <h2>{record.Name}</h2>
                    </div>
                    <div className="col">
                        <button className="btn btn-danger pull-right" hidden={record == null} onClick={() => setShowWarning(true)}>Delete Value List Group (Permanent)</button>
                    </div>
                </div>
                <hr />
                             <TabSelector CurrentTab={tab} SetTab={(t) => setTab(t)} Tabs={Tabs} />
                 <div className="tab-content" style={{maxHeight: window.innerHeight - 235, overflow: 'hidden' }}>
                    <div className={"tab-pane " + (tab === "info" ? " active" : "fade")} id="info">
                        <InfoWindow Record={record} Setter={(r) => {
                                                dispatch(props.ValueListSlice.DBAction({verb: 'PATCH', record: r}))
                                            }}/>
                    </div>
                    <div className={"tab-pane " + (tab === "items" ? " active" : "fade")} id="items">
                        <GroupItemsWindow Record={record} ValueListItemSlice={props.ValueListItemSlice} />
                    </div>
                </div>
                        <Warning Message={'This will permanently remove the ValueList Group. Are you sure you want to continue?'} Title={'Warning'} Show={showWarning} CallBack={(c) => {
                                setShowWarning(false);
                            if (c)
                            {
                                dispatch(props.ValueListSlice.DBAction({verb: 'DELETE', record}))
                                props.OnDelete();
                            }

                        }}/>
                     </div>
        )
    }
