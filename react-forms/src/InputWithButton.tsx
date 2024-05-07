// ******************************************************************************************************
//  Input.tsx - Gbtc
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
//  0502/2024 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import HelperMessage from './HelperMessage';
import { CreateGuid, IsInteger, IsNumber } from '@gpa-gemstone/helper-functions'

interface IProps<T> {
    Record: T;
    Field: keyof T;
    Setter: (record: T) => void;
    Valid: (field: keyof T) => boolean;
    InputLabel?: string;
    InputFeedback?: string;
    InputDisabled?: boolean;
    InputType?: 'number' | 'text' | 'password' | 'email' | 'color' | 'integer';
    InputHelp?: string | JSX.Element;
    InputStyle?: React.CSSProperties;
    InputAllowNull?: boolean;
    InputSize?: 'small' | 'large',
    InputDefaultValue?: number,
    OnBtnClick: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    BtnLabel: string;
    BtnClass?: string;
    BtnDisabled?: boolean;
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
        const allowNull = props.InputAllowNull === undefined ? false : props.InputAllowNull;
        if (!allowNull && (props.InputType === 'number' || props.InputType === 'integer') && heldVal === '') {
            internal.current = false;
            props.Setter({ ...props.Record, [props.Field]: props.InputDefaultValue ?? 0 });
        }
    }

    function valueChange(value: string) {
        internal.current = true;

        const allowNull = props.InputAllowNull === undefined ? false : props.InputAllowNull;
        if (props.InputType === 'number') {
            const v = (value.length > 0 && value[0] === '.' ? ("0" + value) : value)
            if (IsNumber(v) || (v === '' && allowNull)) {
                props.Setter({ ...props.Record, [props.Field]: v !== '' ? parseFloat(v) : null });
                setHeldVal(v);
            }
            else if (v === '') {
                setHeldVal(v);
            }

        }
        else if (props.InputType === 'integer') {
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

    const showLabel = props.InputLabel !== "";
    const showHelpIcon = props.InputHelp !== undefined;
    const label = props.InputLabel === undefined ? props.Field : props.InputLabel;

    return (
        <div className={"form-group " + (props.InputSize === 'large' ? 'form-group-lg' : '') + (props.InputSize === 'small' ? 'form-group-sm' : '')} style={props.InputStyle}>
            {showHelpIcon || showLabel ?
                <label>{showLabel ? label : ''}
                    {showHelpIcon ? <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'inline-block', background: '#0D6EFD', marginLeft: 10, textAlign: 'center', fontWeight: 'bold' }} onMouseEnter={() => setShowHelp(true)} onMouseLeave={() => setShowHelp(false)}> ? </div> : null}
                </label> : null}
            {showHelpIcon ?
                <HelperMessage Show={showHelp} Target={guid}>
                    {props.InputHelp}
                </HelperMessage>
                : null}
            <div className="input-group">
                <input
                    data-help={guid}
                    type={props.InputType === undefined ? 'text' : props.InputType}
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
                    {props.InputFeedback == null ? props.Field.toString() + ' is a required field.' : props.InputFeedback}
                </div>
            </div>
        </div>
    );
}

export default React.memo(InputWithButton) as typeof InputWithButton;
