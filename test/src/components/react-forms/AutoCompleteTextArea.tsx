//******************************************************************************************************
//  AutoCompleteTextArea.tsx - Gbtc
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
//  02/17/2026 - Natalie Beatty
//       Generated original version of source code.
//
//******************************************************************************************************

import { AutoCompleteTextArea } from '@gpa-gemstone/react-forms'
import React from 'react'

interface IExampleRecord {
    Name: string
}

const ExampleOptions = ["Emerson", "Thoreau", "Descartes", "Kierkegaard", "deNavarre", "Porete"]
export const AutoCompleteTextAreaID = "autoCompleteTextAreaTest"

const AutoCompleteTextAreaTestComponent = () => {

    const [exampleRecord, setExampleRecord] = React.useState<IExampleRecord>({Name: ""})

    return (
        <div id={AutoCompleteTextAreaID}>
            <AutoCompleteTextArea<IExampleRecord>
                Record={exampleRecord}
                Field={'Name'}
                Rows={5}
                Valid={() => true}
                Setter={(record) => setExampleRecord(record)}
                Options={ExampleOptions}
            />
        </div>
    )
}

export default AutoCompleteTextAreaTestComponent;