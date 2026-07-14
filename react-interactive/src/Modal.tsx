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

/** Configures modal content, visibility, sizing, and actions. */
interface IProps {
    /**
     * Text displayed in the modal header.
     */
    Title: string,
    /**
     * Optional flag that shows the header close button, defaulting to false.
     */
    ShowX?: boolean,
    /**
     * Callback fired when the close control or a footer action is clicked.
     * @param confirmed - Whether the confirm button triggered the callback.
     * @param isButton - Whether a footer button, rather than the header close control, triggered the callback.
     * @param tertiary - Whether the tertiary button triggered the callback.
     */
    CallBack: ((confirmed: boolean, isButton: boolean, tertiary: boolean) => void),
    /**
     * Controls whether the modal and backdrop are visible.
     */
    Show: boolean,
    /**
     * Optional modal width preset, defaulting to the standard dialog width.
     */
    Size?: ('lg' | 'sm' | 'xlg'),
    /**
     * Optional inline styles applied to the modal body, defaulting to a viewport-limited scrolling body.
     */
    BodyStyle?: React.CSSProperties,
    /**
     * Optional inline styles applied to the modal header.
     */
    HeaderStyle?: React.CSSProperties,


    /**
     * Optional flag that shows the confirm button, defaulting to true.
     */
    ShowConfirm?: boolean,
    /**
     * Optional flag that prevents the confirm action, defaulting to false.
     */
    DisableConfirm?: boolean,
    /**
     * Optional confirm button text, defaulting to `Save`.
     */
    ConfirmText?: string,
    /**
     * Optional class applied to the confirm button, defaulting to `btn-primary`.
     */
    ConfirmBtnClass?: string,
    /**
     * Optional flag that shows the confirm tooltip while hovering, defaulting to false.
     */
    ConfirmShowToolTip?: boolean,
    /**
     * Optional content displayed in the confirm button tooltip.
     */
    ConfirmToolTipContent?: React.ReactNode,

    /**
     * Optional flag that shows the cancel button, defaulting to true.
     */
    ShowCancel?: boolean,
    /**
     * Optional flag that prevents the cancel action, defaulting to false.
     */
    DisableCancel?: boolean,
    /**
     * Optional cancel button text, defaulting to `Cancel`.
     */
    CancelText?: string,
    /**
     * Optional class applied to the cancel button, defaulting to `btn-danger`.
     */
    CancelBtnClass?: string,
    /**
     * Optional flag that shows the cancel tooltip while hovering, defaulting to false.
     */
    CancelShowToolTip?: boolean,
    /**
     * Optional content displayed in the cancel button tooltip.
     */
    CancelToolTipContent?: React.ReactNode,


    /**
     * Optional flag that shows the tertiary action button, defaulting to false.
     */
    ShowTertiary?: boolean,
    /**
     * Optional flag that prevents the tertiary action, defaulting to false.
     */
    DisableTertiary?: boolean,
    /**
     * Optional tertiary button text, defaulting to `Action`.
     */
    TertiaryText?: string,
    /**
     * Optional class applied to the tertiary button, defaulting to `btn-secondary`.
     */
    TertiaryBtnClass?: string,
    /**
     * Optional flag that shows the tertiary tooltip while hovering, defaulting to false.
     */
    TertiaryShowToolTip?: boolean,
    /**
     * Optional content displayed in the tertiary button tooltip.
     */
    TertiaryToolTipContent?: React.ReactNode,

    
    /**
     * Optional stacking order applied to the modal, defaulting to 9990.
     */
    ZIndex?: number
}

/**
 * Renders a portal-based modal with configurable confirm, cancel, and tertiary actions.
 * @param props - Configures modal visibility, content, styling, actions, and tooltips.
 * @returns The modal, action tooltips, and backdrop.
 */
const Modal = (props: React.PropsWithChildren<IProps>) => {
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