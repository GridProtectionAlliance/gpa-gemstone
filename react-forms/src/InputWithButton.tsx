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
import { IsInteger, IsNumber } from '@gpa-gemstone/helper-functions'
import { Gemstone } from '@gpa-gemstone/application-typings';
import HelpIcon from './HelpIcon';

interface IProps<T> extends Gemstone.TSX.Interfaces.IBaseFormProps<T> {
    /**
     * Determines whether the edited field is valid.
     * @param field - Record field to validate.
     * @returns Whether the field is valid.
     */
    Valid: (field: keyof T) => boolean;
    /**
     * Optional message shown when the input is invalid.
     */
    Feedback?: string;
    /**
     * Optional flag that disables the input while leaving the button independently configurable, defaulting to false.
     */
    InputDisabled?: boolean;
    /**
     * Optional input value mode, defaulting to `text`.
     */
    Type?: 'number' | 'text' | 'password' | 'email' | 'color' | 'integer';
    /**
     * Optional help content displayed beside the input label.
     */
    Help?: string | JSX.Element;
    /**
     * Optional CSS styles applied to the surrounding form group.
     */
    InputStyle?: React.CSSProperties;
    /**
     * Optional flag that permits null values, defaulting to false.
     */
    AllowNull?: boolean;
    /**
     * Optional Bootstrap sizing applied to the input group.
     */
    Size?: 'small' | 'large',
    /**
     * Optional numeric value substituted when null is not allowed, defaulting to 0.
     */
    DefaultValue?: number,
    /**
     * Handles activation of the button beside the input.
     * @param evt - Mouse event produced by the button click.
     */
    OnBtnClick: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    /**
     * Text displayed inside the button.
     */
    BtnLabel: string;
    /**
     * Optional CSS class applied to the button, defaulting to `btn btn-outline-secondary`.
     */
    BtnClass?: string;
    /**
     * Optional flag that disables the button, defaulting to false.
     */
    BtnDisabled?: boolean;
    /**
     * Optional CSS styles applied to the button.
     */
    BtnStyle?: React.CSSProperties;
}


/**
 * Renders a validated record-bound input with an adjacent action button.
 * @param props - Input configuration and presentation or behavior for the action button.
 * @returns A labeled input group with validation feedback and a button.
 */
function InputWithButton<T>(props: IProps<T>) {
    const internal = React.useRef<boolean>(false);
    const [heldVal, setHeldVal] = React.useState<string>(''); // Need to buffer tha value because parseFloat will throw away trailing decimals or zeros

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
    const label = props.Label === undefined ? props.Field as string : props.Label;

    return (
        <div className={"form-group " + (props.Size === 'large' ? 'form-group-lg' : '') + (props.Size === 'small' ? 'form-group-sm' : '')} style={props.InputStyle}>
            {showLabel ?
                <label className="d-flex align-items-center">
                    <span>{showLabel ? label : ''}</span>
                    <HelpIcon Help={props.Help} />
                </label>
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
