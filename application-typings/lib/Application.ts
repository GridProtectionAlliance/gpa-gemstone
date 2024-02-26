// ******************************************************************************************************
//  Application.ts - Gbtc
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
//  06/222/2021 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************
namespace Application{
    export namespace Types{

        export interface iByComponent {
            (props: { Roles: Array<SecurityRoleName> }): any;
        }

        export interface iApplicationRole<T> {
    			ID: string,
    			Name: T,
    			Description: string,
    			NodeID: string,
    			CreatedOn: Date,
    			CreatedBy: string,
    			UpdatedOn: Date,
    			UpdatedBy: string,
    			Assigned?: boolean
    		}

		export interface iApplicationRoleUserAccount {
			ID: string,
			ApplicationRoleID: string,
			UserAccountID: string
		}

		export interface iSecurityGroup {
			ID: string,
			Name: string,
			Description: string,
			CreatedOn: Date,
			CreatedBy: string,
			UpdatedOn: Date
		}
		export interface iApplicationRoleSecurityGroup {
			ID: string,
			ApplicationRoleID: string,
			SecurityGroupID: string
		}
    export interface iUserAccount {
			ID: string,
      Name: string,
      Password: string,
      FirstName: string,
      LastName: string,
      DefaultNodeID?: string,
      Phone: string,
      PhoneConfirmed: boolean,
      Email: string,
      EmailConfirmed: boolean,
      LockedOut: boolean,
      Approved: boolean,
      UseADAuthentication: boolean,
      ChangePasswordOn: string,
      AccountName?: string
		}
    export interface iAdditionalUserFieldValue {
        ID: number,
        UserAccountID: string,
        AdditionalUserFieldID: number,
        Value: string
    }
    export interface iAdditionalUserField {
      ID: number,
      FieldName: string,
      Type: string,
      IsSecure: boolean
    }

    export interface iApplicationNode
    {
        ID: string,
        Name: string
    }

    export type Status = 'loading' | 'idle' | 'error' | 'changed' | 'unintiated';
		export type NewEdit = 'New' | 'Edit'

		export type SecurityRoleName = 'Administrator' | 'Transmission SME' | 'PQ Data Viewer' | 'DataPusher' | 'Developer' | 'Viewer' | 'Engineer';
		export type AttachedDatabases = 'SystemCenter' | 'OpenXDA' | 'MiMD'
    }

    export namespace Lists{


    }
}


export default Application;
