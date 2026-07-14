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

		/** Represents the by Component data contract. */
		export interface iByComponent {
			/** Invokes the by Component contract. */
			(props: { Roles: Array<SecurityRoleName> }): any;
		}

		/** Represents the application Role data contract. */
		export interface iApplicationRole<T> {
			/** Unique identifier for the record. */
			ID: string,
			/** Name displayed for the record. */
			Name: T,
			/** Description of the record. */
			Description: string,
			/** Identifier of the associated node. */
			NodeID: string,
			/** Created On associated with the record. */
			CreatedOn: Date,
			/** Created By associated with the record. */
			CreatedBy: string,
			/** Updated On associated with the record. */
			UpdatedOn: Date,
			/** Updated By associated with the record. */
			UpdatedBy: string,
			/** Indicates whether the record is assigned. */
			Assigned?: boolean
		}

		/** Represents the application Role User Account data contract. */
		export interface iApplicationRoleUserAccount {
			/** Unique identifier for the record. */
			ID: string,
			/** Identifier of the associated application Role. */
			ApplicationRoleID: string,
			/** Identifier of the associated user Account. */
			UserAccountID: string
		}

		/** Represents the security Group data contract. */
		export interface iSecurityGroup {
			/** Unique identifier for the record. */
			ID: string,
			/** Name displayed for the record. */
			Name: string,
			/** Description of the record. */
			Description: string,
			/** Created On associated with the record. */
			CreatedOn: Date,
			/** Created By associated with the record. */
			CreatedBy: string,
			/** Updated On associated with the record. */
			UpdatedOn: Date
		}
		/** Represents the application Role Security Group data contract. */
		export interface iApplicationRoleSecurityGroup {
			/** Unique identifier for the record. */
			ID: string,
			/** Identifier of the associated application Role. */
			ApplicationRoleID: string,
			/** Identifier of the associated security Group. */
			SecurityGroupID: string
		}
		/** Represents the user Account data contract. */
		export interface iUserAccount {
			/** Unique identifier for the record. */
			ID: string,
			/** Name displayed for the record. */
			Name: string,
			/** Password associated with the record. */
			Password: string,
			/** First Name associated with the record. */
			FirstName: string,
			/** Last Name associated with the record. */
			LastName: string,
			/** Identifier of the associated default Node. */
			DefaultNodeID?: string,
			/** Phone associated with the record. */
			Phone: string,
			/** Phone Confirmed associated with the record. */
			PhoneConfirmed: boolean,
			/** Email associated with the record. */
			Email: string,
			/** Email Confirmed associated with the record. */
			EmailConfirmed: boolean,
			/** Indicates whether the record is locked Out. */
			LockedOut: boolean,
			/** Indicates whether the record is approved. */
			Approved: boolean,
			/** Use AD Authentication associated with the record. */
			UseADAuthentication: boolean,
			/** Change Password On associated with the record. */
			ChangePasswordOn: string,
			/** Optional account Name. */
			AccountName?: string
		}
		/** Represents the additional User Field Value data contract. */
		export interface iAdditionalUserFieldValue {
			/** Unique identifier for the record. */
			ID: number,
			/** Identifier of the associated user Account. */
			UserAccountID: string,
			/** Identifier of the associated additional User Field. */
			AdditionalUserFieldID: number,
			/** Value associated with the record. */
			Value: string
		}
		/** Represents the additional User Field data contract. */
		export interface iAdditionalUserField {
			/** Unique identifier for the record. */
			ID: number,
			/** Field Name associated with the record. */
			FieldName: string,
			/** Type associated with the record. */
			Type: string,
			/** Indicates whether secure. */
			IsSecure: boolean
		}

		/** Represents the application Node data contract. */
		export interface iApplicationNode
		{
			/** Unique identifier for the record. */
			ID: string,
			/** Name displayed for the record. */
			Name: string
		}

		/** Defines the supported status values. */
		export type Status = 'loading' | 'idle' | 'error' | 'changed' | 'uninitiated';
		/** Defines the supported new Edit values. */
		export type NewEdit = 'New' | 'Edit'

		/** Defines the supported security Role Name values. */
		export type SecurityRoleName = 'Administrator' | 'Transmission SME' | 'PQ Data Viewer' | 'DataPusher' | 'Developer' | 'Viewer' | 'Engineer';
		/** Defines the supported attached Databases values. */
		export type AttachedDatabases = 'SystemCenter' | 'OpenXDA' | 'MiMD'
	}

	export namespace Lists{
	}
}


export default Application;
