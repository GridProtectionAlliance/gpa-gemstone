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
       /** Represents the facility data contract. */
       export interface Facility {
           /** Name displayed for the record. */
           Name: string,
           /** Voltage associated with the record. */
           Voltage: string,
           /** Utility Supply Voltage associated with the record. */
           UtilitySupplyVoltage: string,
           /** Path associated with the record. */
           Path: string,
           /** Address associated with the record. */
           Address: string
       }
       /** Represents the equipment data contract. */
       export interface Equipment {
           /** Facility associated with the record. */
           Facility: string,
           /** Area associated with the record. */
           Area: string,
           /** Section Title associated with the record. */
           SectionTitle: string,
           /** Section Rank associated with the record. */
           SectionRank: number,
           /** Component Model associated with the record. */
           ComponentModel: string,
           /** Manufacturer associated with the record. */
           Manufacturer: string,
           /** Series associated with the record. */
           Series: string,
           /** Component Type associated with the record. */
           ComponentType: string
       }
       /** Represents the address data contract. */
       export interface Address {
           /** Path associated with the record. */
           Path: string,
           /** Company associated with the record. */
           Company: string,
           /** Facilities associated with the record. */
           Facilities: string,
           /** Address Line1 associated with the record. */
           AddressLine1: string,
           /** Adress Line2 associated with the record. */
           AdressLine2: string,
           /** City associated with the record. */
           City: string,
           /** State Or Province associated with the record. */
           StateOrProvince: string,
           /** Postal Code associated with the record. */
           PostalCode: string,
           /** Country associated with the record. */
           Country: string,
           /** Primary associated with the record. */
           Primary: boolean
       }
       /** Represents the company data contract. */
       export interface Company {
           /** Addresses associated with the record. */
           Addresses: string,
           /** Path associated with the record. */
           Path: string,
           /** Type associated with the record. */
           Type: string,
           /** Name displayed for the record. */
           Name: string,
           /** Industry associated with the record. */
           Industry: string
       }
    }
    
    export namespace Lists{
    }

    export namespace Consts{
        export const DateTimeFormat = "M/D/YYYY";
    }
}

export default PQI;
