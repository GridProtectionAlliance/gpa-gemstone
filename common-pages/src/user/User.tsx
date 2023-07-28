// ******************************************************************************************************
//  User.tsx - Gbtc
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
import { LoadingScreen, ServerErrorIcon, TabSelector, Warning } from '@gpa-gemstone/react-interactive';
import { Application, SystemCenter } from '@gpa-gemstone/application-typings';
import UserInfo from './UserInfo';
import UserPermissions from './UserPermissions';
import AdditionalField from './AdditionalField'
import { IAdditionalFieldSlice, IGenericSlice, ISecurityRoleSlice, IUserAccountSlice } from '../SliceInterfaces';
import { useDispatch, useSelector } from 'react-redux';
import { CheckBox } from '@gpa-gemstone/react-forms';
import { Dispatch } from '@reduxjs/toolkit';

interface IProps {
    UserID: string,
    OnDelete: () => void,
    SecurityRoleSlice: ISecurityRoleSlice,
    UserSlice: IUserAccountSlice,
    AdditionalFieldSlice: IAdditionalFieldSlice<Application.Types.iAdditionalUserField, Application.Types.iAdditionalUserFieldValue>,
    ValueListItemSlice: IGenericSlice<SystemCenter.Types.ValueListItem>,
    ValueListGroupSlice: IGenericSlice<SystemCenter.Types.ValueListGroup>
}

function User(props: IProps)  {
    const dispatch = useDispatch<Dispatch<any>>();

    const user: Application.Types.iUserAccount = useSelector(props.UserSlice.CurrentUser);
    const status: Application.Types.Status = useSelector(props.UserSlice.Status);

    const [tab, setTab] = React.useState<string>('userInfo')

    const [showWarning, setShowWarning] =  React.useState<boolean>(false);

    React.useEffect(() => {
        dispatch(props.UserSlice.LoadExistingUser(props.UserID))
    }, [dispatch, props.UserID])

    if (status === 'error')
        return <div style={{ width: '100%', height: '100%' }}>
            <ServerErrorIcon Show={true} Label={'A Server Error Occured. Please Reload the Application'}/>
        </div>;

    const Tabs = [
                     { Id: "userInfo", Label: "User Info" },
                     { Id: "permissions", Label: "Permissions" },
                     { Id: "additionalFields", Label: "Additional Fields" }
             ];

 return (
             <div style={{ width: '100%', height: window.innerHeight - 63, maxHeight: window.innerHeight - 63, overflow: 'hidden', padding: 15 }}>
                 <div className="row">
                     <div className="col">
                         <h2>{user != null ? `${user.FirstName} ${user.LastName}`  : ''}</h2>
                     </div>
                     <div className="col">
                         <button className="btn btn-danger pull-right" hidden={user == null} onClick={() => setShowWarning(true)}>Delete User</button>
                     </div>
                 </div>
                                <LoadingScreen Show={status === 'loading'}/>
                 <hr />
                 <TabSelector CurrentTab={tab} SetTab={(t) => setTab(t)} Tabs={Tabs} />
                 <div className="tab-content" style={{maxHeight: window.innerHeight - 235, overflow: 'hidden' }}>
                     <div className={"tab-pane " + (tab === "userInfo" ? " active" : "fade")}>
                         <UserInfo UserSlice={props.UserSlice}/>
                     </div>
                     <div className={"tab-pane " + (tab === "permissions" ? " active" : "fade")}>
                         {user == null? null : <UserPermissions UserID={user.ID} RoleSlice={props.SecurityRoleSlice} />}
                     </div>
                     <div className={"tab-pane " + (tab === "additionalFields" ? " active" : "fade")} style={{ maxHeight: window.innerHeight - 215 }}>
                         <AdditionalField<Application.Types.iAdditionalUserField, Application.Types.iAdditionalUserFieldValue>
                                                     Id={props.UserID}
                                                     AdditionalFieldSlice={props.AdditionalFieldSlice}
                                                     ValueListItemSlice={props.ValueListItemSlice}
                                                     ValueListGroupSlice={props.ValueListGroupSlice}
                                                     EmptyField={{ID: -1, IsSecure: false, FieldName: '', Type: 'string'}}
                                                     GetFieldValueIndex={(field, values) => values.findIndex(v => v.AdditionalUserFieldID === field.ID)}
                                                     GetFieldIndex={(value, fields) => fields.findIndex(f => f.ID === value.AdditionalUserFieldID)}
                                                     FieldKeySelector={(field) => (field.ID === -1? 'new' : field.ID.toString())}
                                                     ValidateField={() => []}
                                                     FieldUI={(fld, setter) => <CheckBox<Application.Types.iAdditionalUserField> Record={fld} Field='IsSecure' Label="Secure Data" Setter={setter} />}
                                                     CreateValue={(fld) => ({Value: '', ID: -1, UserAccountID: props.UserID, AdditionalUserFieldID: fld.ID})}
                                                 />
                     </div>

                 </div>
                                 <Warning Message={'This will permanently remove the User. Are you sure you want to continue?'} Title={'Warning'} Show={showWarning} CallBack={(c) => {
                                        setShowWarning(false);
                                    if (c) {
                                        dispatch(props.UserSlice.DBAction({verb: 'DELETE', record: user}));
                                        props.OnDelete();
                                    }
                                }}/>
             </div>
         )


}

export default User;
