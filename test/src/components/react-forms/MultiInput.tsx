//******************************************************************************************************
//  MultiInput.tsx - Gbtc
//
//  Copyright (c) 2026, Grid Protection Alliance.  All Rights Reserved.
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
//  03/11/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import { MultiInput } from '@gpa-gemstone/react-forms'
import React from 'react'

interface IExampleRecord {
    Values: string[]
}

export const MultiInputEmptyID = "MultiInputEmptyID"
export const MultiInputPopulatedID = "MultiInputPopulatedID"

const MultiInputTestComponent = () => {
    const [emptyRecord, setEmptyRecord] = React.useState<IExampleRecord>({ Values: [] })
    const [populatedRecord, setPopulatedRecord] = React.useState<IExampleRecord>({ Values: ['Alpha', 'Beta'] })

    return (
        <>
            <div id={MultiInputEmptyID}>
                <MultiInput<IExampleRecord>
                    Record={emptyRecord}
                    Field={'Values'}
                    Label={'Empty Multi Input'}
                    DefaultValue={''}
                    Setter={(r) => setEmptyRecord(r)}
                    Type={'text'}
                />
            </div>
            <div id={MultiInputPopulatedID}>
                <MultiInput<IExampleRecord>
                    Record={populatedRecord}
                    Field={'Values'}
                    Label={'Populated Multi Input'}
                    DefaultValue={''}
                    Setter={(r) => setPopulatedRecord(r)}
                    Type={'text'}
                />
            </div>
        </>
    )
}

export default MultiInputTestComponent;