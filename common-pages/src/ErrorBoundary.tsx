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
import { CSSProperties } from 'styled-components';

interface IError {
    name: string,
    message: string
}

interface IProps {
    /**
     * If provided, this message will be shown instead of the default error message. This is useful for providing a more user-friendly message or additional context about the error. NOTE: This will only be applied if ErrorContent is not provided, as ErrorContent is expected to provide its own error display.
     */
    ErrorMessage?: string,
    /**
     * If provided, this content will be shown instead of the default error content. This is useful for providing a more customized error display. NOTE: This will take precedence over ErrorMessage and ErrorIconSize, as it is expected to provide its own error display.
     */
    ErrorContent?: (props: IError) => React.ReactNode,
    /**
     * If provided, this style will be applied to the error container. This is useful for customizing the appearance of the error display.
     */
    Style?: CSSProperties,
    /**
     * If provided, this class name will be applied to the error container. This is useful for applying custom styles to the error display.
     */
    ClassName?: string,
    /**
     * If provided, this size will be applied to the error icon. This is useful for customizing the appearance of the error display. NOTE: This will only be applied if ErrorContent is not provided, as ErrorContent is expected to provide its own error display.
     */
    ErrorIconSize?: number
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<IProps>, IError> {
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
            if (this.props.ErrorContent != null) {
                return (
                    <div className={this.props.ClassName} style={this.props.Style}>
                        {this.props.ErrorContent(this.state)}
                    </div>
                );
            }
            return (
                <div className={this.props.ClassName} style={this.props.Style}>
                    <ServerErrorIcon Show={true} Label={this.props.ErrorMessage ?? "An error occurred"} Size={this.props.ErrorIconSize ?? 150} />
                </div>
            );
        } else
            return <>{this.props.children}</>;
    }
}