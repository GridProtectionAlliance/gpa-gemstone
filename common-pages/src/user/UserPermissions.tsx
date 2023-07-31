// ******************************************************************************************************
//  UserPermission.tsx - Gbtc
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
import { Application } from '@gpa-gemstone/application-typings';
import * as _ from 'lodash';
import { CheckBox } from '@gpa-gemstone/react-forms';
import { ISecurityRoleSlice } from '../SliceInterfaces';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';

interface IProps {
    UserID: string,
    RoleSlice: ISecurityRoleSlice
}

function UserPermission(props: IProps)  {
    const dispatch = useDispatch<Dispatch<any>>();

    const currentRoles: Application.Types.iApplicationRoleUserAccount[] = useSelector(props.RoleSlice.Roles);
    const allRoleStatus: Application.Types.Status = useSelector(props.RoleSlice.Status)
    const availableRoles: Application.Types.iApplicationRole<Application.Types.SecurityRoleName>[] = useSelector(props.RoleSlice.AvailableRoles)
    const currentRoleStatus: Application.Types.Status = useSelector(props.RoleSlice.CurrentRoleStatus)

    const [workingRoles, setWorkingRoles] = React.useState<Application.Types.iApplicationRole<Application.Types.SecurityRoleName>[]>([]);
    const [changed, setChanged] = React.useState<boolean>(false)

    React.useEffect(() => {
      if (allRoleStatus === 'unintiated' || allRoleStatus === 'changed')
            dispatch(props.RoleSlice.FetchRoles())
    }, [dispatch, allRoleStatus])

    React.useEffect(() => {
        if (currentRoleStatus === 'unintiated' || currentRoleStatus === 'changed')
            dispatch(props.RoleSlice.FetchUserRoles(props.UserID))
    }, [dispatch, currentRoleStatus, props.UserID])

    React.useEffect(() => {
        resetCurrentRoles(availableRoles, currentRoles)
 },[currentRoles, availableRoles]);

function resetCurrentRoles(avRoles: Application.Types.iApplicationRole<Application.Types.SecurityRoleName>[], currRoles: Application.Types.iApplicationRoleUserAccount[] ) {
    setChanged(false);
    setWorkingRoles(avRoles.map(src => {
         const upd = _.cloneDeep(src);
         upd.Assigned = currRoles.find(usrc => usrc.ApplicationRoleID === upd.ID) !== undefined;
         return upd;
 }))
}

    return (
        <div className="card" style={{ marginBottom: 10 }}>
            <div className="card-header">
                <div className="row">
                    <div className="col">
                        <h4>User Permissions:</h4>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col">
                        <fieldset className="border" style={{ padding: '10px', height: '100%' }}>
                            <legend className="w-auto" style={{ fontSize: 'large' }}>System Center:</legend>
                            <form>
                                {
                                    workingRoles.map((scr, i, array) => <CheckBox<Application.Types.iApplicationRole<Application.Types.SecurityRoleName>> key={scr.ID} Record={scr} Field='Assigned' Label={scr.Name} Setter={(record) => {
                                        scr.Assigned = record.Assigned;
                                        const newArray = _.clone(array);
                                        setWorkingRoles(newArray);
                                        setChanged(true);
                                    }} />)
                                }
                            </form>
                        </fieldset>
                    </div>
                    <div className="col">
                    </div>
                </div>
            </div>
            <div className="card-footer">
                <div className="btn-group mr-2">
                    <button className="btn btn-primary" onClick={() =>
                                            dispatch(props.RoleSlice.SetUserRoles({
                                                UserId: props.UserID,
                                                Roles: workingRoles.filter(scr => scr.Assigned).map(scr => ({ ID: '00000000-0000-0000-0000-000000000000', ApplicationRoleID: scr.ID, UserAccountID: props.UserID }))
                                            }))} disabled={!changed}>Update</button>
                </div>
                <div className="btn-group mr-2">
                    <button className="btn btn-default" onClick={() => resetCurrentRoles(availableRoles, currentRoles)} disabled={!changed}>Reset</button>
                </div>
            </div>
        </div>
    );


}

export default UserPermission;
