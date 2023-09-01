// ******************************************************************************************************
//  UserForm.tsx - Gbtc
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
import {Input, DatePicker, CheckBox} from '@gpa-gemstone/react-forms'
import * as _ from 'lodash';
import { IUserAccountSlice, UserValidation } from '../SliceInterfaces';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';

interface IProps {
    UserAccount: Application.Types.iUserAccount,
    Setter: (record: Application.Types.iUserAccount) => void,
    Edit: boolean,
    SetErrors?: (e: string[]) => void
    UserSlice: IUserAccountSlice,
    }

function UserForm(props: IProps)  {
    const dispatch = useDispatch<Dispatch<any>>();

  const [updatedAD, setUpdatedAD] = React.useState<boolean>(false);
    const userValidation: UserValidation = useSelector(props.UserSlice.ADValidation);

  const [userError, setUserError] = React.useState<string[]>([]);

  React.useEffect(() => {
      if (userValidation === 'Valid' && !props.Edit && updatedAD === false)
          dispatch(props.UserSlice.ADUpdate());
  }, [userValidation, updatedAD])

    React.useEffect(() => {
        if (props.SetErrors !== undefined)
            props.SetErrors(userError);
    }, [userError, props.SetErrors]);

    React.useEffect(() => {
            if (props.UserAccount == null)
                return
        const e = [];
        if (props.UserAccount.Name == null || props.UserAccount.Name.length === 0)
            e.push('An AccountName is required.')
        if (props.UserAccount.UseADAuthentication && userValidation !== 'Valid')
            e.push('The user could not be validated by the AD.')

        setUserError(e);
    }, [props.UserAccount, userValidation])

        function validUserAccountField(user: Application.Types.iUserAccount,field: keyof (Application.Types.iUserAccount)): boolean {
    if (field === 'Name')
        return user.Name != null && user.Name.length > 0 && user.Name.length <= 200;
    else if (field === 'Password')
        return user.Password == null || user.Password.length <= 200;
    else if (field === 'FirstName')
        return user.FirstName == null || user.FirstName.length <= 200;
    else if (field === 'LastName')
        return user.LastName == null || user.LastName.length <= 200;
    else if (field === 'Phone')
        return user.Phone == null || user.Phone.length <= 200;
    else if (field === 'Email')
        return user.Email == null || user.Email.length <= 200;
    else if (field === "ChangePasswordOn")
        return user.ChangePasswordOn == null;    
    return false;

}


    if (props.UserAccount == null) return null;

    return (
        <>
        <form>
            <div className="row">
                <div className="col">
                        <Input<Application.Types.iUserAccount> Record={props.UserAccount} Disabled={props.Edit} Field={'Name'} Feedback={'A Name of less than 200 characters is required.'} Valid={field => validUserAccountField(props.UserAccount, field)} Setter={(record) => {
                            setUpdatedAD(false);
                                props.Setter(record);
                        }} />

                        <div className="row" style={{ position: 'absolute', top: 0, left: 100 }} hidden={!props.UserAccount.UseADAuthentication}>
                            <span id="resolvingAccount" hidden={userValidation !== 'Resolving'}><i style={{ height: 10, width: 10, color: 'grey' }} className="fa fa fa-spin fa-refresh"></i>&nbsp;<em className="small">Resolving account details...</em></span>
                            <span id="accountValid" hidden={userValidation !== 'Valid'}><i style={{ height: 20, width: 20, color: 'green' }} className="fa fa-check-circle"></i>&nbsp;<em className="small">Resolved account name </em></span>
                            <span id="accountInvalid" hidden={userValidation !== 'Invalid'}><i style={{ height: 20, width: 20, color: 'red' }} className="fa fa-times-circle"></i>&nbsp;<em className="small">Cannot resolve account name</em></span>
                            <span id="accountUnknown" hidden={userValidation !== 'Unknown'}><i style={{ height: 20, width: 20, color: 'orange' }} className="fa fa-exclamation-circle"></i>&nbsp;<em className="small">Valid account name is not a user or Active Directory access is limited</em></span>
                        </div>

                        <button style={{ marginBottom: 10 }} type="button" className="btn btn-primary btn-sm" onClick={(evt) => { evt.preventDefault(); dispatch(props.UserSlice.ADUpdate()); }} hidden={userValidation !== 'Valid' || !props.Edit}>Load Information from AD</button>

                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-xs-4">
                                    <div className="form-check-inline">
                                            <label className="form-check-label"><input disabled={props.Edit} className='form-check-input' type='radio' checked={props.UserAccount.UseADAuthentication} onChange={(e) => {
                                            const record: Application.Types.iUserAccount = _.clone(props.UserAccount);
                                            record.UseADAuthentication = e.target.checked;
                                            props.Setter(record);
                                        }} />Active Directory User</label>
                                    </div>
                                </div>
                                <div className="col-xs-4">
                                    <div className="form-check-inline">
                                            <label className="form-check-label"><input disabled={props.Edit} className='form-check-input' type='radio' checked={!props.UserAccount.UseADAuthentication} onChange={(e) => {
                                            const record: Application.Types.iUserAccount = _.clone(props.UserAccount);
                                            record.UseADAuthentication = !e.target.checked;
                                            props.Setter(record);
                                        }} />Database User</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body" hidden={!props.UserAccount.UseADAuthentication}>
                            <div className="row">
                                <div className="col">
                                    <Input<Application.Types.iUserAccount> Record={props.UserAccount} Field={'FirstName'} Label='First Name' Feedback={'First Name must be less than 200 characters.'} Valid={field => validUserAccountField(props.UserAccount, field)} Setter={props.Setter} />
                                    <Input<Application.Types.iUserAccount> Record={props.UserAccount} Field={'LastName'} Label='Last Name' Feedback={'Last Name must be less than 200 characters.'} Valid={field => validUserAccountField(props.UserAccount, field)} Setter={props.Setter} />
                                </div>
                                <div className="col">
                                    <Input<Application.Types.iUserAccount> Record={props.UserAccount} Field={'Phone'} Feedback={'Phone must be less than 200 characters.'} Valid={field => validUserAccountField(props.UserAccount, field)} Setter={props.Setter} />
                                    <Input<Application.Types.iUserAccount> Record={props.UserAccount} Field={'Email'} Feedback={'Email must be less than 200 characters.'} Valid={field => validUserAccountField(props.UserAccount, field)} Setter={props.Setter} />
                                </div>
                            </div>
                        </div>
                        <div className="card-body" hidden={props.UserAccount.UseADAuthentication}>
                            <div className="row">
                                <div className="col">
                                    <Input<Application.Types.iUserAccount> Record={props.UserAccount} Field={'Password'} Feedback={'Password must be less than 200 characters.'} Type={'password'} Valid={field => validUserAccountField(props.UserAccount, field)} Setter={props.Setter} />
                                    <Input<Application.Types.iUserAccount> Record={props.UserAccount} Field={'FirstName'} Label='First Name' Feedback={'First Name must be less than 200 characters.'} Valid={field => validUserAccountField(props.UserAccount, field)} Setter={props.Setter} />
                                    <Input<Application.Types.iUserAccount> Record={props.UserAccount} Field={'LastName'} Label='Last Name' Feedback={'Last Name must be less than 200 characters.'} Valid={field => validUserAccountField(props.UserAccount, field)} Setter={props.Setter} />
                                </div>
                                <div className="col">
                                    <Input<Application.Types.iUserAccount> Record={props.UserAccount} Field={'Phone'} Feedback={'Password must be less than 200 characters.'} Valid={field => validUserAccountField(props.UserAccount, field)} Setter={props.Setter} />
                                    <Input<Application.Types.iUserAccount> Record={props.UserAccount} Field={'Email'} Feedback={'Password must be less than 200 characters.'} Valid={field => validUserAccountField(props.UserAccount, field)} Setter={props.Setter} />
                                    <DatePicker<Application.Types.iUserAccount> Record={props.UserAccount} Field={'ChangePasswordOn'} Label='Change Password On' Setter={props.Setter} Valid={field => validUserAccountField(props.UserAccount, field)} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                                <div className="col" style={{margin: 10}}>
                                    <CheckBox<Application.Types.iUserAccount> Record={props.UserAccount} Label='Locked Out' Field='LockedOut' Setter={props.Setter} />
                                    <CheckBox<Application.Types.iUserAccount> Record={props.UserAccount} Field='Approved' Setter={props.Setter} />
                                </div>
                            <div className="col-lg-6">
                                <CheckBox<Application.Types.iUserAccount> Record={props.UserAccount} Label='Phone Confirmed' Field='PhoneConfirmed' Setter={props.Setter} />
                                <CheckBox<Application.Types.iUserAccount> Record={props.UserAccount} Label='Email Confirmed' Field='EmailConfirmed' Setter={props.Setter} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </form>
            </>
    );
}

export default UserForm;
