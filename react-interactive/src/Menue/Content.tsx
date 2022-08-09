// ******************************************************************************************************
//  Content.tsx - Gbtc
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
//  07/19/2022 - Gabriel Santos
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import { useParams } from 'react-router-dom';


const Content: React.FunctionComponent<{}> = (props) => {
    const params = useParams();

    return (
        <>
            {React.Children.map(props.children, (element) => {
                if (!React.isValidElement(element))
                    return null;
                return React.cloneElement(element, {useParams : params}, null);
            })}
        </>);
}

export default Content;