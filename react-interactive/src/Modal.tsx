// ******************************************************************************************************
//  Modal.tsx - Gbtc
//
//  Copyright © 2020, Grid Protection Alliance.  All Rights Reserved.
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
//  12/29/2020 - Christoph Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import { ToolTip } from '@gpa-gemstone/react-forms';
import {CreateGuid} from '@gpa-gemstone/helper-functions';
import { Portal } from 'react-portal';

interface IProps {
    /**
     * Title of the modal
     */
    Title: string,
    /**
     * Show or hide the X button (default true)
     */
    ShowX?: boolean,
    /**
     * Callback function used when the modal is closed or a button is clicked.
     * @param confirmed - true if Confirm was clicked
     * @param isButton - true if closed via a button (not by clicking X)
     * @param tertiary - true if the Tertiary button was clicked
     */
    CallBack: ((confirmed: boolean, isButton: boolean, tertiary: boolean) => void),
    /**
     * Flag to show modal
     */
    Show: boolean,
    /**
     * Size of the modal
     */
    Size?: ('lg' | 'sm' | 'xlg'),
    /**
     * Optional style to be used on the modal body
     */
    BodyStyle?: React.CSSProperties,
    /**
     * Optional style to be used on the modal header
     */
    HeaderStyle?: React.CSSProperties,


    /**
     * Optional flag to show confirm button in modal footer, defaulting to true
     */
    ShowConfirm?: boolean,
    /**
     * Optional flag to disable the confirm button
     */
    DisableConfirm?: boolean,
    /**
     * Optional text to be used inside the confirm button, defaulting to 'Save'
     */
    ConfirmText?: string,
    /**
     * Optional class to be used on the confirm button, defaulting to btn-primary
     */
    ConfirmBtnClass?: string,
    /**
     * Optional flag to show tooltip on confirm button
     */
    ConfirmShowToolTip?: boolean,
    /**
     * Optional content to render inside of the confirm button's tooltip
     */
    ConfirmToolTipContent?: React.ReactNode,

    /**
     * Optional flag to show cancel button in modal footer, defaulting to true
     */
    ShowCancel?: boolean,
    /**
     * Optional flag to disable the cancel button
     */
    DisableCancel?: boolean,
    /**
     * Optional text to be used in cancel button, defaulting to 'Cancel'
     */
    CancelText?: string,
    /**
     * Optional class to be used on the cancel button, defaulting to 'btn-danger'
     */
    CancelBtnClass?: string,
    /**
     * Optional flag to show tooltip on the cancel button
     */
    CancelShowToolTip?: boolean,
    /**
     * Optional content to render inside of cancel button's tooltip
     */
    CancelToolTipContent?: React.ReactNode,


    /**
     * Optional flag to show a third action button
     */
    ShowTertiary?: boolean,
    /**
     * Optional flag to disable the third button
     */
    DisableTertiary?: boolean,
    /**
     * Optional text to be used in the third button
     */
    TertiaryText?: string,
    /**
     * Optional class to be used on the third button, defaulting to btn-secondary
     */
    TertiaryBtnClass?: string,
    /**
     * Optional flag to show tooltip on the third button
     */
    TertiaryShowToolTip?: boolean,
    /**
     * Optional content to render inside the third button's tooltip
     */
    TertiaryToolTipContent?: React.ReactNode,

    
    /**
     * Optional z-index of the modal, defaulting to 9990
     */
    ZIndex?: number
}

// Props Description:
// ShowCancel => Whether to show the cancel button
// ShowConfirm => Whether to show the confirm button
// DisableConfirm => Disables the Confirm button
// CancelText => Text on Cancel Button
// Confirm text => Text on Confirm button
// ConfirmBtnClass => Class of the Confirm Button
// CancelBtnClass =>> Class of the Cancel Button
const Modal: React.FunctionComponent<IProps> = (props) => {
    const [hover, setHover] = React.useState<'confirm'|'cancel'|'tertiary'|'none'>('none');
    const [guid, setGuid] = React.useState<string>('');

    React.useEffect(() => {
        setGuid(CreateGuid());
    }, []);

    return (
        <Portal>
            <div className={"modal" + (props.Show ? " show" : '')} style={props.Show ? {display: 'block', zIndex: props.ZIndex ?? 9990} : {}}>
                <div className={"modal-dialog" + (props.Size === undefined? '' : props.Size === 'xlg'? '' :(" modal-"  + props.Size))} style={props.Size === 'xlg'? {maxWidth: window.innerWidth - 100} : {}}>
                    <div className="modal-content">
                        <div className="modal-header" style={(props.HeaderStyle ?? {})}>
                            <h4 className="modal-title">{props.Title}</h4>
                            {(props.ShowX ?? false) ? <button type="button" className="close" onClick={() => props.CallBack(false,false,false) }>&times;</button> : null}
                        </div>
                        <div className="modal-body" style={props.BodyStyle ?? { maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
                            {props.Show? props.children : null}
                        </div>
                        {(props.ShowConfirm != undefined && !(props.ShowConfirm))
                         && (props.ShowCancel != undefined && !(props.ShowCancel))
                         && (props.ShowTertiary != undefined && !(props.ShowTertiary)) ?
                            null
                            : <div className="modal-footer">
                                {props.ShowConfirm === undefined || props.ShowConfirm ?
                                    <button type="button"
                                        className={`btn ${(props.ConfirmBtnClass ?? 'btn-primary')} ${((props.DisableConfirm ?? false) ? 'disabled' : '')}`}
                                        data-tooltip={guid + '-confirm'}
                                        onClick={() => { if (!(props.DisableConfirm === undefined || !props.DisableConfirm)) return; props.CallBack(true,true,false)}}
                                        onMouseEnter={() => setHover('confirm')}
                                        onMouseLeave={() => setHover('none')}
                                    >{(props.ConfirmText ?? 'Save')}</button>
                                : null}
                                {(props.ShowTertiary ?? false) ?
                                    <button type="button"
                                        className={`btn ${(props.TertiaryBtnClass ?? 'btn-secondary')} ${((props.DisableTertiary ?? false) ? 'disabled' : '')}`}
                                        data-tooltip={guid + '-tertiary'}
                                        onClick={() => { if (props.DisableTertiary ?? false) return; props.CallBack(false,true,true)}}
                                        onMouseEnter={() => setHover('tertiary')}
                                        onMouseLeave={() => setHover('none')}
                                    >{(props.TertiaryText ?? 'Action')}</button>
                                : null}
                                {props.ShowCancel === undefined || props.ShowCancel ?
                                    <button type="button"
                                        className={`btn ${(props.CancelBtnClass ?? 'btn-danger')} ${((props.DisableCancel ?? false) ? 'disabled' : '')}`}
                                        data-tooltip={guid + '-cancel'}
                                        onClick={() => { if (!(props.DisableCancel === undefined || !props.DisableCancel)) return; props.CallBack(false,true,false)}}
                                        onMouseEnter={() => setHover('cancel') }
                                        onMouseLeave={() => setHover('none')}
                                    >{(props.CancelText ?? 'Cancel')}</button>
                                : null}
                            </div>
                        }
                    </div>
                </div>
            </div>
            <ToolTip Show={(props.ConfirmShowToolTip ?? false) && hover === 'confirm'} Position={'top'}  Target={guid + '-confirm'} Zindex={9999}>
                {props.ConfirmToolTipContent}
            </ToolTip>
            <ToolTip Show={(props.TertiaryShowToolTip ?? false) && hover === 'tertiary'} Position={'top'} Target={guid + '-tertiary'} Zindex={9999}>
                {props.TertiaryToolTipContent}
            </ToolTip>
            <ToolTip Show={(props.CancelShowToolTip ?? false) && hover === 'cancel'} Position={'top'} Target={guid + '-cancel'} Zindex={9999}>
                {props.CancelToolTipContent}
            </ToolTip>
            {props.Show ? < div style={{
                width: '100%',
                height: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                opacity: 0.5,
                backgroundColor: '#ffffff',
                zIndex: 9980,
                }}></div> : null}
        </Portal>
    )
}

export default Modal;