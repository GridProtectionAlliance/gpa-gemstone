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
import ToolTip from './ToolTip';
import { Accuracy } from './DateTimeUI/Clock'
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { Gemstone } from '@gpa-gemstone/application-typings';

export type TimeUnit = ('datetime-local' | 'date' | 'time');

interface IProps<T> extends Gemstone.TSX.Interfaces.IBaseFormProps<T> {
    Valid: (field: keyof T) => boolean;
    Feedback?: string;
    Format?: string;
    Type?: TimeUnit; // Default to date
    AllowEmpty?: boolean,
    Accuracy?: Accuracy, //Default to second
    MinDate?: moment.Moment // Default to 01/01/1753 (SQL Database limit)
}

/**
 * Component that allows a user to pick a date or datetime.
*/
export default function DateTimePicker<T>(props: IProps<T>) {
    // Formats for displaying dates in the input box and storing in the record.
    const boxFormat = getBoxFormat(props.Type, props.Accuracy)
    const recordFormat = props.Format !== undefined ? props.Format : "YYYY-MM-DD" + (props.Type === undefined || props.Type === 'date' ? "" : "[T]HH:mm:ss.SSS[Z]");

    // Parse the date from the record.
    const parse = (r: T) => moment(props.Record[props.Field] as any, recordFormat);

    // State and ref declarations.
    const divRef = React.useRef<any | null>(null);

    const [guid] = React.useState<string>(CreateGuid());
    const [showHelp, setShowHelp] = React.useState<boolean>(false);

    // Adds a buffer between the outside props and what the box is reading to prevent box overwriting every render with a keystroke
    const [boxRecord, setBoxRecord] = React.useState<string>(parse(props.Record).format(boxFormat));
    const [pickerRecord, setPickerRecord] = React.useState<moment.Moment | undefined>(parse(props.Record));

    const [feedbackMessage, setFeedbackMessage] = React.useState("");

    const [showOverlay, setShowOverlay] = React.useState<boolean>(false);

    const [top, setTop] = React.useState<number>(0);
    const [left, setLeft] = React.useState<number>(0);

    const allowNull = React.useMemo(() => props.AllowEmpty ?? false, [props.AllowEmpty]);

    React.useEffect(() => {
        if (props.Record[props.Field] as any !== null) {
            setPickerRecord(parse(props.Record));
            setBoxRecord(parse(props.Record).format(boxFormat));
        }
        else {
            setPickerRecord(undefined);
            setBoxRecord('');
        }
    }, [props.Record]);

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

    //Effect to set top and left on a scroll event
    React.useEffect(() => {
        function updatePosition() {
            if (divRef.current != null) {
                const node = GetNodeSize(divRef.current);
                setLeft(node.left + 0.5 * node.width);
                setTop(node.top + node.height + 10);
            }
        }

        document.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);

        updatePosition(); // Initial update
 
        return () => {
            document.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, []);

    //Effect to handle click events on the window
    React.useEffect(() => {
        if (showOverlay) {
            window.addEventListener('click', onWindowClick);
            return () => { window.removeEventListener('click', onWindowClick); }
        }
    }, [props.Record, props.Field, boxFormat, showOverlay]);

    function setPickerAndRecord(arg: moment.Moment | undefined) {
        setPickerRecord(arg);

        if (allowNull && arg === undefined && props.Record[props.Field] !== null)
            props.Setter({ ...props.Record, [props.Field]: null });
        else if (
            (arg != undefined && validateDate(arg)) &&
            (props.Record[props.Field] as any).toString() !== arg.format(recordFormat)
        ) props.Setter({ ...props.Record, [props.Field]: arg.format(recordFormat) });
    }

    // Handle clicks outside the component.
    function onWindowClick(evt: any) {
        if (evt.target.closest(`.gpa-gemstone-datetime`) == null) {
            setShowOverlay(false);
            if (props.Record[props.Field] as any !== null) {
                setPickerAndRecord(parse(props.Record));
                setBoxRecord(parse(props.Record).format(boxFormat));
            }
            else {
                setPickerAndRecord(undefined);
                setBoxRecord('');
            }
        }
    }

    function getBoxFormat(type?: TimeUnit, accuracy?: Accuracy) {
        const dateTime = type ?? 'date'
        const timeUnit = accuracy ?? 'second'

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

    function getFeedbackMessage() {
        if (feedbackMessage.length != 0) {
            return feedbackMessage;
        } else if (props.Feedback == null || props.Feedback.length == 0) {
            return `${props.Field.toString()} is a required field.`;
        } else {
            return props.Feedback;
        }
    }

    function validateDate(date?: moment.Moment) {
        const minStartDate = props.MinDate != null ? props.MinDate.startOf('day') : moment("1753-01-01", "YYYY-MM-DD").startOf('day');

        if (allowNull && date == null) {
            setFeedbackMessage("");
            return true;
        }
        else if (date == null || !date.isValid()) {
            setFeedbackMessage(`Please enter a valid date.`);
            return false;
        }
        else if (date.clone().startOf('day').isBefore(minStartDate)) {
            setFeedbackMessage(`Date must be on or after ${minStartDate.format("MM-DD-YYYY")}`);
            return false;
        }
        else {
            setFeedbackMessage("");
            return true;
        }
    }


    // Variables for rendering labels and help icons.
    const showLabel = props.Label !== "";
    const showHelpIcon = props.Help !== undefined;
    const label = props.Label === undefined ? props.Field : props.Label;
    const step = props.Accuracy === 'millisecond' ? '0.001' : (props.Accuracy === 'minute' ? '60' : '1');

    const IsValid = () => {
        if (feedbackMessage.length > 0) return false;

        return props.Valid(props.Field);
    }


    function valueChange(value: string) {
        const date = (value === '') ? undefined : moment(value, boxFormat);
        const validDate = validateDate(date);

        if (allowNull && value === '') {
            props.Setter({ ...props.Record, [props.Field]: null });
            setPickerAndRecord(undefined);
        }
        else if (validDate) {
            props.Setter({ ...props.Record, [props.Field]: moment(value, boxFormat).format(recordFormat) });
            setPickerAndRecord(moment(value, boxFormat));
        }
        else {
            setPickerAndRecord(undefined);
        }
        setBoxRecord(value);
    }

    return (
        <div className="form-group" ref={divRef}>
            {/* Label and help icon */}
            {showHelpIcon || showLabel ?
                <label className='d-flex align-items-center'>{showLabel ? label : ''}
                    {showHelpIcon ? <button className='btn mb-1 pt-0 pb-0' onMouseEnter={() => setShowHelp(true)} onMouseLeave={() => setShowHelp(false)} data-tooltip={guid}>
                        <ReactIcons.QuestionMark Color='var(--info)' Size={20} />
                    </button> : null}
                </label> : null}
            {showHelpIcon ?
                <ToolTip Show={showHelp} Target={guid} Class="info" Position="bottom">
                    {props.Help}
                </ToolTip>
                : null}
            <input
                className={`gpa-gemstone-datetime form-control ${IsValid() ? '' : 'is-invalid'}`}
                type={props.Type === undefined ? 'date' : props.Type}
                onChange={(evt) => {
                    valueChange(evt.target.value);
                }}
                onFocus={() => { setShowOverlay(true) }}
                value={boxRecord}
                disabled={props.Disabled === undefined ? false : props.Disabled}
                onClick={(e) => { e.preventDefault() }}
                step={step}
            />
            <div className="invalid-feedback">
                {getFeedbackMessage()}
            </div>
            <DateTimePopup
                Setter={(d) => {
                    setPickerAndRecord(d);
                    if (props.Type === 'date') setShowOverlay(false);
                }}
                Show={showOverlay}
                DateTime={pickerRecord}
                Valid={props.Valid(props.Field)}
                Top={top}
                Center={left}
                Type={props.Type === undefined ? 'date' : props.Type}
                Accuracy={props.Accuracy}
            />
        </div>
    );
}



