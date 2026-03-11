//******************************************************************************************************
//  MultiSearchableSelect.tsx - Gbtc
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

import { MultiSearchableSelect } from '@gpa-gemstone/react-forms'
import React from 'react'

interface IExampleRecord {
    Selections: number[]
}

const ExampleOptions = [
    { Label: 'Alpha', Value: 1 },
    { Label: 'Beta', Value: 2 },
    { Label: 'Gamma', Value: 3 },
    { Label: 'Delta', Value: 4 },
]

const searchFn = (search: string) => Promise.resolve(
    ExampleOptions.filter(o => o.Label.toLowerCase().includes(search.toLowerCase()))
)

export const MultiSearchableSelectEmptyID = "MultiSearchableSelectEmptyID"
export const MultiSearchableSelectPopulatedID = "MultiSearchableSelectPopulatedID"

const MultiSearchableSelectTestComponent = () => {
    const [emptyRecord, setEmptyRecord] = React.useState<IExampleRecord>({ Selections: [] })
    const [populatedRecord, setPopulatedRecord] = React.useState<IExampleRecord>({ Selections: [1, 2] })

    return (
        <>
            <div id={MultiSearchableSelectEmptyID}>
                <MultiSearchableSelect<IExampleRecord>
                    Record={emptyRecord}
                    Field={'Selections'}
                    Label={'Empty Multi Select'}
                    DefaultValue={1}
                    Setter={(r) => setEmptyRecord(r)}
                    Search={searchFn}
                />
            </div>
            <div id={MultiSearchableSelectPopulatedID}>
                <MultiSearchableSelect<IExampleRecord>
                    Record={populatedRecord}
                    Field={'Selections'}
                    Label={'Populated Multi Select'}
                    DefaultValue={1}
                    Setter={(r) => setPopulatedRecord(r)}
                    Search={searchFn}
                />
            </div>
        </>
    )
}

export default MultiSearchableSelectTestComponent;