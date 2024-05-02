//******************************************************************************************************
//  ErrorBoundary.tsx - Gbtc
//
//  Copyright (c) 2024, Grid Protection Alliance.  All Rights Reserved.
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
//  05/02/2024 - Preton Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import { ServerErrorIcon } from '@gpa-gemstone/react-interactive';

interface IError {
    name: string,
    message: string
}

interface IProps {
    HeaderErrorMessage: string,
    BodyErrorMessage: string,
    Height: number | string, 
    Width: number | string
}

export default class ErrorBoundary extends React.Component<IProps, IError> {
    constructor(props: IProps) {
        super(props);
        this.state = { name: "", message: "" };
    }

    componentDidCatch(error: IError) {
        this.setState({
            name: error.name,
            message: error.message
        });
        console.warn(error);
    }

    render() {
        if (this.state.name.length > 0) {
            return (
                <div className="card" style={{ width: this.props.Width, height: this.props.Height }}>
                    <div className="card-header">
                        {this.props.HeaderErrorMessage} 
                    </div>
                    <div className="card-body">
                        <ServerErrorIcon Show={true} Label={this.props.BodyErrorMessage} Size={150} />
                    </div>
                </div>
            );
        } else
            return <>{this.props.children}</>;

    }
}