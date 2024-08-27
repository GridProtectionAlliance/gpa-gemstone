//******************************************************************************************************
//  Alert.tsx - Gbtc
//
//  Copyright © 2024, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA may license this file to you under the MIT License (MIT), the "License"; you may not use this
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
//  08/20/2024 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************
import * as React from 'react';

interface IProps {
    AlertColor?: 'alert-primary' | 'alert-secondary' | 'alert-success' | 'alert-danger' | 'alert-warning' | 'alert-info' | 'alert-light'
    Style?: React.CSSProperties,
}

const DismissibleAlert = (props: React.PropsWithChildren<IProps>) => {
    const [showAlert, setShowAlert] = React.useState<boolean>(true);

    return (
        <div className={`alert ${props.AlertColor ?? 'alert-dark'} alert-dismissible fade ${showAlert ? 'show' : 'd-none'}`} style={props.Style}>
            {props.children}
            <button type="button" className="close" onClick={() => setShowAlert(false)}> <span aria-hidden="true">&times;</span> </button>
        </div>
    )
}

export default DismissibleAlert;
