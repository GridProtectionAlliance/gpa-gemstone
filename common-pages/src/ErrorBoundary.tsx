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

/** Describes an error captured by the boundary. */
interface IError {
    /** Name assigned to the captured error. */
    name: string,
    /** Message reported by the captured error. */
    message: string
}

/** Configures the content and presentation of an error boundary. */
interface IProps {
    /**
     * Optional message shown instead of the default error label when custom content is not provided.
     */
    ErrorMessage?: string,
    /**
     * Optional callback that renders custom error content instead of the default display.
     * @param props - Error captured by the boundary.
     * @returns Content displayed for the captured error.
     */
    ErrorContent?: (props: IError) => React.ReactNode,
    /**
     * Optional CSS styles applied to the error container.
     */
    Style?: CSSProperties,
    /**
     * Optional class name applied to the error container.
     */
    ClassName?: string,
    /**
     * Optional size applied to the default error icon, defaulting to 150 pixels.
     */
    ErrorIconSize?: number
}

/**
 * Catches rendering errors and displays either a default or caller-provided error view.
 */
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