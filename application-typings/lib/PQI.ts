// ******************************************************************************************************
//  PQI.ts - Gbtc
//
//  Copyright © 2022, Grid Protection Alliance.  All Rights Reserved.
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
//  07/18/2022 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************
namespace PQI {
    export namespace Types {
       // Types

       // Tables
       export interface Facility { Name: string, Voltage: string, UtilitySupplyVoltage: string, Path: string }; 
       export interface Equipment { Facility: string, Area: string, SectionTitle: string, SectionRank: number, ComponentModel: string, Manufacturer: string, Series: string, ComponentType: string }
       export interface Address { Path: string, Company: string, Facilities: string, AddressLine1: string, AdressLine2: string, City: string, StateOrProvince: string, PostalCode: string, Country: string, Primary: boolean}
       export interface Company { Addresses: string, Path: string, Type: string, Name: string, Industry: string }
    }
    
    export namespace Lists{
    }
}

export default PQI;
