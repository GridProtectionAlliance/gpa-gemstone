// ******************************************************************************************************
//  DatePicker.tsx - Gbtc
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
//  02/05/2020 - Billy Ernest
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import * as moment from 'moment';
import DateTimePopup from './DateTimeUI/DateTimePopup';
import { CreateGuid, GetNodeSize } from '@gpa-gemstone/helper-functions';
import HelperMessage from './HelperMessage';
import { Accuracy } from './DateTimeUI/Clock'

export type TimeUnit = ('datetime-local' | 'date' | 'time');

interface IProps<T> {
    Record: T;
    Field: keyof T;
    Setter: (record: T) => void;
    Valid: (field: keyof T) => boolean;
    Label?: string;
    Disabled?: boolean;
    Feedback?: string;
    Format?: string;
    Type?: TimeUnit; // Default to date
    Help?: string | JSX.Element;
    AllowEmpty?: boolean,
    Accuracy?: Accuracy //Default to second
}

export default function DateTimePicker<T>(props: IProps<T>) {
    // Formats that will be used for dateBoxes
    const boxFormat = getBoxFormat(props.Type, props.Accuracy)
    const recordFormat = props.Format !== undefined ? props.Format : "YYYY-MM-DD" + (props.Type === undefined || props.Type === 'date' ? "" : "[T]HH:mm:ss.SSS[Z]");
    const parse = (r: T) => moment(props.Record[props.Field] as any, recordFormat);
    const divRef = React.useRef<any | null>(null);
    const recordChange = React.useRef<boolean>(false);

    const [guid, setGuid] = React.useState<string>("");
    const [showHelp, setShowHelp] = React.useState<boolean>(false);

    // Adds a buffer between the outside props and what the box is reading to prevent box overwriting every render with a keystroke
    const [boxRecord, setBoxRecord] = React.useState<string>(parse(props.Record).format(boxFormat));
    const [pickerRecord, setPickerRecord] = React.useState<moment.Moment>(parse(props.Record));

    const [feedbackMessage, setFeedbackMessage] = React.useState("");

    const [showOverlay, setShowOverlay] = React.useState<boolean>(false);

    const [top, setTop] = React.useState<number>(0);
    const [left, setLeft] = React.useState<number>(0);

    React.useEffect(() => {
        setGuid(CreateGuid());
    }, []);

    React.useEffect(() => {
        setPickerRecord(parse(props.Record));
        setBoxRecord(parse(props.Record).format(boxFormat));
        recordChange.current = false;
    }, [props.Record]);

    React.useEffect(() => {
        if (!recordChange.current) return;
        const date = moment(boxRecord, boxFormat);
        const validStartDate = moment("1753-01-01", "YYYY-MM-DD");

        let valid = true;

        // Invalid date format
        if (!date.isValid()) {
            setFeedbackMessage("Invalid Date Format MM-DD-YYYY");
            valid = false;
        }
        // Date before 1753
        else if (date.isBefore(validStartDate)) {
            setFeedbackMessage("Date cannot be before 01-01-1753");
            valid = false;
        }
        else {
            setFeedbackMessage("");
        }

        if ((props.AllowEmpty ?? false) && boxRecord.length === 0 && !valid && props.Record !== null)
            props.Setter({ ...props.Record, [props.Field]: null });

        if (valid && parse(props.Record).format(boxFormat) !== boxRecord)
            props.Setter({ ...props.Record, [props.Field]: moment(boxRecord, boxFormat).format(recordFormat) });
    }, [boxRecord])

    React.useEffect(() => {
        if (!recordChange.current) return;

        if (pickerRecord.format(recordFormat) !== parse(props.Record).format(recordFormat))
            props.Setter({ ...props.Record, [props.Field]: pickerRecord.format(recordFormat) });
    }, [pickerRecord]);

    React.useLayoutEffect(() => {
        const node = (divRef.current !== null ? GetNodeSize(divRef.current) : { top, left, height: 0, width: 0 });
        if (node.height === 0 && node.width === 0) {
            setLeft(0)
            setTop(-9999)
            return;
        }
        setLeft(node.left + 0.5 * node.width);
        setTop(node.top + node.height + 10);
    })

    React.useEffect(() => {
        window.addEventListener('click', onWindowClick);
        return () => { window.removeEventListener('click', onWindowClick); }

    }, []);

    function onWindowClick(evt: any) {
        if (evt.target.closest(`.gpa-gemstone-datetime`) == null)
            setShowOverlay(false);
    }
   
    function getBoxFormat(type?: TimeUnit, accuracy?: Accuracy) {
        let timeUnit;
        let dateTime;

        if (!type)
            dateTime = 'date'
        else 
            dateTime = type

        if (!accuracy)
            timeUnit = 'second'
        else
            timeUnit = accuracy

        if (dateTime === 'time') {
            if (timeUnit === 'minute') {
                return "HH:mm";
            } else if (timeUnit === 'second') {
                return "HH:mm:ss";
            } else {
                return "HH:mm:ss.SSS";
            }
        } else if (dateTime === 'datetime-local') {
            if (timeUnit === 'minute') {
                return "YYYY-MM-DD[T]HH:mm";
            } else if (timeUnit === 'second') {
                return "YYYY-MM-DD[T]HH:mm:ss";
            } else {
                return "YYYY-MM-DD[T]HH:mm:ss.SSS";
            }
        } else {
            return "YYYY-MM-DD";
        }
    }

    const showLabel = props.Label !== "";
    const showHelpIcon = props.Help !== undefined;
    const label = props.Label === undefined ? props.Field : props.Label;
    const step = props.Accuracy === 'millisecond' ? '0.001' : (props.Accuracy === 'minute' ? '60' : '1');

    const IsValid = () => {
        if (feedbackMessage.length > 0) return false;

        return props.Valid(props.Field);
    }



    return (
        <div className="form-group" ref={divRef}>
            {showHelpIcon || showLabel ?
                <label>{showLabel ? label : ''}
                    {showHelpIcon ? <div
                        style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            display: 'inline-block',
                            background: '#0D6EFD',
                            marginLeft: 10,
                            textAlign: 'center',
                            fontWeight: 'bold'
                        }}
                        onMouseEnter={() => setShowHelp(true)}
                        onMouseLeave={() => setShowHelp(false)}> ? </div> : null}
                </label> : null}
            {showHelpIcon ?
                <HelperMessage Show={showHelp} Target={guid}>
                    {props.Help}
                </HelperMessage>
                : null}

            <input
                data-help={guid}
                className={`gpa-gemstone-datetime form-control ${IsValid() ? '' : 'is-invalid'}`}
                type={props.Type === undefined ? 'date' : props.Type}
                onChange={(evt) => {
                    setBoxRecord(evt.target.value ?? "");
                    recordChange.current = true;
                }}
                onFocus={() => { setShowOverlay(true) }}
                value={boxRecord}
                disabled={props.Disabled === undefined ? false : props.Disabled}
                onClick={(e) => { e.preventDefault() }}
                step={step}
            />
            <div className="invalid-feedback">
                {feedbackMessage || props.Feedback || `${props.Field.toString()} is a required field.`}
            </div>
            <DateTimePopup
                Setter={(d) => { setPickerRecord(d); recordChange.current = true; if (props.Type === 'date') setShowOverlay(false); }}
                Show={showOverlay}
                DateTime={pickerRecord}
                Valid={props.Valid(props.Field)}
                Top={top} Center={left}
                Type={props.Type === undefined ? 'date' : props.Type}
                Accuracy={props.Accuracy}
            />
        </div>
    );
}



