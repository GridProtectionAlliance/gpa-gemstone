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
import ToolTip from './ToolTip';
import {CreateGuid} from '@gpa-gemstone/helper-functions';
import { Portal } from 'react-portal';

interface IProps {
    Title: string,
    ShowX?: boolean,
    CallBack: ((confirmed: boolean, isButton?: boolean) => void),
    Show: boolean,
    Size?: ('lg' | 'sm' | 'xlg'),
    ShowCancel?: boolean,
    ShowConfirm?: boolean,
    DisableConfirm?: boolean,
    DisableCancel?: boolean,
    CancelText?: string,
    ConfirmText?: string,
    ConfirmBtnClass?: string,
    CancelBtnClass?: string,
    ConfirmShowToolTip?: boolean,
    CancelShowToolTip?: boolean,
    ConfirmToolTipContent?: React.ReactNode,
    CancelToolTipContent?: React.ReactNode,
    BodyStyle?: React.CSSProperties;
    HeaderStyle?: React.CSSProperties;
}

// Props Description:
// Title => Title of The Modal
// ShowX => show or hide the X button (default true)
// CallBack => Function to be called when closing the Modal either through Cancel (confirmed=false) or Accept Button (confirmed=true)
// Show => Whether to show the modal
// Size => Size of the modal
// ShowCancel => Whether to show the cancel button
// ShowConfirm => Whether to show the confirm button
// DisableConfirm => Disables the Confirm button
// CancelText => Text on Cancel Button
// Confirm text => Text on Confirm button
// ConfirmBtnClass => Class of the Confirm Button
// CancelBtnClass =>> Class of the Cancel Button
const Modal: React.FunctionComponent<IProps> = (props) => {

    const [hover, setHover] = React.useState<'confirm'|'cancel'|'none'>('none');
    const [guid, setGuid] = React.useState<string>('')

    React.useEffect(() => {
        setGuid(CreateGuid());
    }, [])

    const confirmBtn = (props.ConfirmText === undefined ? 'Save' : props.ConfirmText);
    const cxnBtn = (props.CancelText === undefined ? 'Cancel' : props.CancelText);

    const cxnbtnCls = 'btn ' + (props.CancelBtnClass === undefined ? 'btn-danger' : props.CancelBtnClass);
    const confirmbtnCls = 'btn ' + (props.ConfirmBtnClass === undefined ? 'btn-primary' : props.ConfirmBtnClass);

    const showConfirmToolTip = (props.ConfirmShowToolTip !== undefined && props.ConfirmShowToolTip) && hover === 'confirm';
    const showCxnToolTip = (props.CancelShowToolTip !== undefined && props.CancelShowToolTip) && hover === 'cancel';

    const bodyStyle: React.CSSProperties = (props.BodyStyle === undefined ? { maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' } : props.BodyStyle);
    const headerStyle: React.CSSProperties = (props.HeaderStyle === undefined ? {} : props.HeaderStyle)

    return (
        <Portal>
        <div className={"modal" + (props.Show ? " show" : '')} style={props.Show ? {display: 'block', zIndex: 9990} : {}}>
            <div className={"modal-dialog" + (props.Size === undefined? '' : props.Size === 'xlg'? '' :(" modal-"  + props.Size))} style={props.Size === 'xlg'? {maxWidth: window.innerWidth - 100} : {}}>
                <div className="modal-content">
                    <div className="modal-header" style={headerStyle}>
                        <h4 className="modal-title">{props.Title}</h4>
                        {props.ShowX? <button type="button" className="close" onClick={() => props.CallBack(false,false) }>&times;</button> : null}
                    </div>
                    <div className="modal-body" style={bodyStyle}>
                        {props.Show? props.children : null}
                    </div>
                    <div className="modal-footer">
                        {props.ShowConfirm === undefined || props.ShowConfirm ?
                            <button type="button"
                                className={confirmbtnCls + (!(props.DisableConfirm === undefined || !props.DisableConfirm)? ' disabled' : '')}
                                data-tooltip={guid + '-confirm'}
                                onClick={() => { if (!(props.DisableConfirm === undefined || !props.DisableConfirm)) return; props.CallBack(true,true)}}
                                onMouseEnter={() => setHover('confirm')}
                                onMouseLeave={() => setHover('none')}
                            >{confirmBtn}</button>
                            : null}
                        {props.ShowCancel === undefined || props.ShowCancel ?
                            <button type="button"
                                className={cxnbtnCls  + (!(props.DisableCancel === undefined || !props.DisableCancel)? ' disabled' : '')}
                                data-tooltip={guid + '-cancel'}
                                onClick={() => { if (!(props.DisableCancel === undefined || !props.DisableCancel)) return; props.CallBack(false,true)}}
                                onMouseEnter={() => setHover('cancel') }
                                onMouseLeave={() => setHover('none')}
                            >{cxnBtn}</button>
                            : null}
                    </div>
                </div>
            </div>
            </div>
            <ToolTip Show={showConfirmToolTip} Position={'top'} Theme={'dark'} Target={guid + '-confirm'} Zindex={9999}>
                {props.ConfirmToolTipContent}
              </ToolTip>
              <ToolTip Show={showCxnToolTip} Position={'top'} Theme={'dark'} Target={guid + '-cancel'} Zindex={9999}>
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
