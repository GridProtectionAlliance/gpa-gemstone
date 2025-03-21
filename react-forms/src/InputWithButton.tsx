// ******************************************************************************************************
//  InputWithButton.tsx - Gbtc
//
//  Copyright © 2024, Grid Protection Alliance.  All Rights Reserved.
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
//  05/02/2024 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import ToolTip from './ToolTip';
import { CreateGuid, IsInteger, IsNumber } from '@gpa-gemstone/helper-functions'
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { Gemstone } from '@gpa-gemstone/application-typings';

interface IProps<T> extends Gemstone.TSX.Interfaces.IBaseFormProps<T> {
    /**
      * Function to determine the validity of a field
      * @param field - Field of the record to check
      * @returns {boolean}
    */
    Valid: (field: keyof T) => boolean;
    /**
      * Feedback message to show when input is invalid
      * @type {string}
      * @optional
    */
    Feedback?: string;
    /**
    * Flag to disable the input element
    * @type {boolean}
    * @optional
    */
    InputDisabled?: boolean;
    /**
    * Type of the input field
    * @type {'number' | 'text' | 'password' | 'email' | 'color' | 'integer'}
    * @optional
   */
    Type?: 'number' | 'text' | 'password' | 'email' | 'color' | 'integer';
    /**
    * Help message or element to display
    * @type {string | JSX.Element}
    * @optional
   */
    Help?: string | JSX.Element;
    /**
    * CSS styles to apply to the input group
    * @type {React.CSSProperties}
    * @optional
    */
    InputStyle?: React.CSSProperties;
    /**
    * Flag to allow null values
    * @type {boolean}
    * @optional
   */
    AllowNull?: boolean;
    /**
    * Size of the input field
    * @type {'small' | 'large'}
    * @optional
    */
    Size?: 'small' | 'large',
    /**
    * Default value for the input field if it's null
    * @type {number}
    * @optional
    */
    DefaultValue?: number,
    /**
    * Function to handle button click event
    * @param evt - React mouse event
    * @returns {void}
    */
    OnBtnClick: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    /**
    * Label for the button
    * @type {string}
    */
    BtnLabel: string;
    /**
    * CSS class for the button
    * @type {string}
    * @optional
   */
    BtnClass?: string;
    /**
    * Flag to disable the button
    * @type {boolean}
    * @optional
    */
    BtnDisabled?: boolean;
    /**
    * CSS styles to apply to the button
    * @type {React.CSSProperties}
    * @optional
   */
    BtnStyle?: React.CSSProperties;
}


function InputWithButton<T>(props: IProps<T>) {
    const internal = React.useRef<boolean>(false);
    const [guid, setGuid] = React.useState<string>("");
    const [showHelp, setShowHelp] = React.useState<boolean>(false);
    const [heldVal, setHeldVal] = React.useState<string>(''); // Need to buffer tha value because parseFloat will throw away trailing decimals or zeros

    React.useEffect(() => {
        setGuid(CreateGuid());
    }, []);

    React.useEffect(() => {
        if (!internal.current) {
            setHeldVal(props.Record[props.Field] == null ? '' : (props.Record[props.Field] as any).toString());
        }
        internal.current = false;
    }, [props.Record[props.Field]]);

    function onBlur() {
        const allowNull = props.AllowNull === undefined ? false : props.AllowNull;
        if (!allowNull && (props.Type === 'number' || props.Type === 'integer') && heldVal === '') {
            internal.current = false;
            props.Setter({ ...props.Record, [props.Field]: props.DefaultValue ?? 0 });
        }
    }

    function valueChange(value: string) {
        internal.current = true;

        const allowNull = props.AllowNull === undefined ? false : props.AllowNull;
        if (props.Type === 'number') {
            const v = (value.length > 0 && value[0] === '.' ? ("0" + value) : value)
            if (IsNumber(v) || (v === '' && allowNull)) {
                props.Setter({ ...props.Record, [props.Field]: v !== '' ? parseFloat(v) : null });
                setHeldVal(v);
            }
            else if (v === '') {
                setHeldVal(v);
            }

        }
        else if (props.Type === 'integer') {
            if (IsInteger(value) || (value === '' && allowNull)) {
                props.Setter({ ...props.Record, [props.Field]: value !== '' ? parseFloat(value) : null });
                setHeldVal(value);
            }
            else if (value === '') {
                setHeldVal(value);
            }
        }
        else {
            props.Setter({ ...props.Record, [props.Field]: value !== '' ? value : null });
            setHeldVal(value);
        }
    }

    const showLabel = props.Label !== "";
    const showHelpIcon = props.Help !== undefined;
    const label = props.Label === undefined ? props.Field : props.Label;

    return (
        <div className={"form-group " + (props.Size === 'large' ? 'form-group-lg' : '') + (props.Size === 'small' ? 'form-group-sm' : '')} style={props.InputStyle}>
            {showHelpIcon || showLabel ?
                <label className='d-flex align-items-center'>{showLabel ? label : ''}
                    {showHelpIcon ?
                        <button className='btn mb-1 pt-0 pb-0' onMouseEnter={() => setShowHelp(true)} onMouseLeave={() => setShowHelp(false)} data-tooltip={guid}>
                            <ReactIcons.QuestionMark Color='var(--info)' Size={20} />
                        </button> : null}
                </label> : null}
            {showHelpIcon ?
                <ToolTip Show={showHelp} Target={guid} Class="info" Position="bottom">
                    {props.Help}
                </ToolTip>
                : null}
            <div className="input-group">
                <input
                    type={props.Type === undefined ? 'text' : props.Type}
                    className={props.Valid(props.Field) ? 'form-control' : 'form-control is-invalid'}
                    onChange={(evt) => valueChange(evt.target.value)}
                    value={heldVal}
                    disabled={props.InputDisabled == null ? false : props.InputDisabled}
                    onBlur={onBlur}
                    step='any'
                />
                <div className="input-group-prepend">
                    <button className={props.BtnClass != null ? props.BtnClass : "btn btn-outline-secondary"} style={props.BtnStyle} disabled={props.BtnDisabled == null ? false : props.BtnDisabled} type="button" onClick={(evt) => props.OnBtnClick(evt)}>{props.BtnLabel}</button>
                </div>
                <div className="invalid-feedback">
                    {props.Feedback == null ? props.Field.toString() + ' is a required field.' : props.Feedback}
                </div>
            </div>
        </div>
    );
}

export default InputWithButton;
