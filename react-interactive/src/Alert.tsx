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
    /**
     * Optional Bootstrap contextual class applied to the alert, defaulting to `alert-dark`.
     */
    Class?: 'alert-primary' | 'alert-secondary' | 'alert-success' | 'alert-danger' | 'alert-warning' | 'alert-info' | 'alert-light'
    /**
     * Optional inline styles applied to the alert container.
     */
    Style?: React.CSSProperties,
    /**
     * Optional flag that shows the dismiss button, defaulting to true.
     */
    ShowX?: boolean,
    /**
     * Optional value whose changes make a dismissed alert visible again.
     */
    ReTrigger?: unknown
    /**
     * Optional callback fired after the dismiss button is clicked.
     * @param e - Mouse event from the dismiss button.
     */
    OnClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

/**
 * Renders a dismissible Bootstrap alert that can be shown again when its trigger changes.
 * @param props - Configures the alert appearance, dismissal behavior, and content.
 * @returns The alert element in its current visibility state.
 */
const Alert = (props: React.PropsWithChildren<IProps>) => {
    const [show, setShow] = React.useState<boolean>(true);

    const handleOnClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setShow(false);
        if (props.OnClick != null)
            props.OnClick(e);
    }, [props.OnClick])

    //Effect to retrigger initial state
    React.useEffect(() => {
        setShow(true);
    }, [props.ReTrigger])

    return (
        <div className={`alert ${props.Class ?? 'alert-dark'} alert-dismissible fade ${show ? 'show' : 'd-none'}`} style={props.Style}>
            {props.children}

            {(props.ShowX ?? true) ?
                <button type="button" className="close" onClick={handleOnClick}>
                    <span aria-hidden="true">&times;</span>
                </button>
                : null}
        </div>
    )
}

export default Alert;
