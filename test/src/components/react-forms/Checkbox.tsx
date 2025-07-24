//******************************************************************************************************
//  Checkbox.tsx - Gbtc
//
//  Copyright (c) 2025, Grid Protection Alliance.  All Rights Reserved.
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
//  05/05/2025 - Collins Self
//       Generated original version of source code.
//
//******************************************************************************************************

import { CheckBox } from "@gpa-gemstone/react-forms";
import React from "react";

export const CHECKBOX_TEST_ID = 'checkbox-test-text';

const CheckBoxTestComponent = () => {
    type FormType = {
        FormData: string,
        FormBoolean: boolean
    }

    const RecordForm: FormType = {
        FormData: 'Example form Data.',
        FormBoolean: false,
    }

    const [record, setRecord] = React.useState<FormType>(RecordForm);

    return (
    <>
        <div id={CHECKBOX_TEST_ID}>This Record's boolean value is {record.FormBoolean.toString()}</div>
        <CheckBox
            Label={'Form Boolean'}  // Optional: Defaults to Field string
            Disabled={false}        // Optional: Defaults to false
            Record={record}         // record to be set
            Field={'FormBoolean'}   // field within the record to be set
            Setter={setRecord}      // fn that sets the record
        />
        <CheckBox
            Label={'Disabled Form Boolean'}
            Disabled={true}
            Record={record}
            Field={'FormBoolean'}
            Setter={setRecord}
        />
        
    </>
    );
}

export default CheckBoxTestComponent;