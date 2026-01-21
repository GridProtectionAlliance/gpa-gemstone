// ******************************************************************************************************
//  AutoCompleteTextArea.tsx - Gbtc
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
//  01/21/2026 - Natalie Beatty
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import TextArea from './TextArea'
import { Gemstone } from '@gpa-gemstone/application-typings'
import { CreateGuid } from '@gpa-gemstone/helper-functions'
import { Portal } from 'react-portal'
import * as _ from 'lodash';

interface IProps<T> extends Gemstone.TSX.Interfaces.IBaseFormProps<T> {
    /**
    * Number of rows for the textarea
    * @type {number}
    */
     Rows: number;
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
    * Help message or element to display
    * @type {string | JSX.Element}
    * @optional
     */
    Help?: string | JSX.Element;
    /**
    * Options for the select dropdown
    * @type {{  Value: any, Element: React.ReactElement<any> }[]}
    */
    Variables: string[];   
}

interface ILabelOption {
    Value: any
    Element: React.ReactElement<any> | string
    Label: string
}

export default function AutoCompleteTextArea<T>(props: IProps<T>) {
    
    const autoCompleteTextArea = React.useRef<HTMLDivElement>(null);
    const tableContainer = React.useRef<HTMLDivElement>(null);
    const [position, setPosition] = React.useState<Gemstone.TSX.Interfaces.IElementPosition>({ Top: 0, Left: 0, Width: 0, Height: 0 });
    const selectTable = React.useRef<HTMLTableElement>(null);
    const [guid, setGuid] = React.useState<string>("");
    const [selected, setSelected] = React.useState<React.ReactElement<any> | string>(props.Variables[0]);
    const [show, setShow] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [autoCompleteOptions, setAutoCompleteOptions] = React.useState<ILabelOption[]>([])

    React.useEffect(() => {
        handleOptionSearch(props.Record[props.Field] as string).then((result) => {
            console.log('please please please let me let me let me let me get what i want this time')
            setAutoCompleteOptions(result.map(o => ({ Value: o.Value, Element: o.Label, Label: o.Label })));
            setShow(true)
            setLoading(false);
        }, () => {
            setLoading(false);
        }
        )

    }, [props.Record[props.Field]]);

    const handleOptionSearch = (searchString: string) => {
        const promise = new Promise<Gemstone.TSX.Interfaces.ILabelValue<string>[]>((resolve) => {
            console.log('we are doing it hunny')
            if (searchString === "" || searchString == null) {
                resolve(props.Variables.map(v => ({ Label: `{${v}}`, Value: `{${v}}` })))
                return;
            }

            // Find all variables in the searchString
            const regex = /\{([^\s{}]*)/g;
            let match: RegExpExecArray | null;
            const variables: { name: string; start: number; end: number; hasClosingBrace: boolean }[] = [];

            while ((match = regex.exec(searchString)) !== null) {
                const variableName = match[1];
                const start = match.index;
                let end = regex.lastIndex;

                // Check if there is a closing '}'
                let hasClosingBrace = false;
                if (searchString[end] === '}') {
                    hasClosingBrace = true;
                    end++; // Include the closing '}'
                }

                variables.push({ name: variableName, start, end, hasClosingBrace });
            }

            // Find the first invalid variable
            const invalidVariable = variables.find((v) => !v.hasClosingBrace || !(props.Variables.some((o) => o.toLowerCase() === v.name.toLowerCase())));

            if (invalidVariable == null) {
                resolve([]);
                return;
            }

            // Find suggestions for the invalid variable
            const possibleVariables = (props.Variables.filter(o => o.toLowerCase().includes(invalidVariable.name.toLowerCase())));

            // Generate suggestions by replacing the FIRST invalid variable
            const suggestions = possibleVariables.map((pv) => {
                const before = searchString.substring(0, invalidVariable.start);
                const after = searchString.substring(invalidVariable.end);

                // Ensure we have braces around the variable and add closing '}' if it was missing
                const variableWithBraces = invalidVariable.hasClosingBrace ? `{${pv}}` : `{${pv}}`;
                return { Label: `${before}${variableWithBraces}${after}`, Value: `${before}${variableWithBraces}${after}` };
            });
            resolve(suggestions);
        });
        return promise;
    };

    React.useLayoutEffect(() => {
        const updatePosition = _.debounce(() => {
            if (autoCompleteTextArea.current != null) {
                const rect = autoCompleteTextArea.current.getBoundingClientRect();
                setPosition({ Top: rect.bottom, Left: rect.left, Width: rect.width, Height: rect.height });
            }
        }, 200);

    const handleScroll = (event: Event) => {
        if (tableContainer.current == null) return

        if (event.type === 'scroll' && !tableContainer.current.contains(event.target as Node))
            setShow(false);
        updatePosition()
    };

    if (show) {
        updatePosition();

        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', updatePosition);

        return () => {
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', updatePosition);
            updatePosition.cancel();
        };
    }

    }, [show]);

    function SetRecord(selectedOption: string) {
        setSelected(selectedOption);
        const record: T = { ...props.Record };
        if (selectedOption !== '') record[props.Field] = selectedOption as any;
        else record[props.Field] = null as any;
        props.Setter(record);
    }

    const handleOptionClick = (evt: React.MouseEvent<HTMLTableRowElement, MouseEvent>, option: string) => {
        SetRecord(option);
        setShow(false);
    }

     // Handle showing and hiding of the dropdown.
    const HandleShow = React.useCallback((evt: React.MouseEvent<HTMLButtonElement, MouseEvent> | MouseEvent) => {
        // Ignore if disabled or not a mousedown event
        if ((props.Disabled === undefined ? false : props.Disabled) || evt.type !== 'mousedown' || autoCompleteTextArea.current == null) return;

        // if we’re about to OPEN it, measure right now
        if (!show && autoCompleteTextArea.current != null) {
        const rect = autoCompleteTextArea.current.getBoundingClientRect();
        setPosition({
            Top: rect.bottom,
            Left: rect.left,
            Width: rect.width,
            Height: rect.height
        });
        }

    // Effect for initial setup and event listeners.
    React.useEffect(() => {
        setGuid(CreateGuid());
        document.addEventListener('mousedown', HandleShow, false);
        return () => {
          document.removeEventListener('mousedown', HandleShow, false);
        };
     }, [HandleShow]);

    //ignore the click if it was inside the table or table container
    if ((selectTable.current != null && selectTable.current.contains(evt.target as Node)) || (tableContainer.current != null && tableContainer.current.contains(evt.target as Node)))
      return

    if (!autoCompleteTextArea.current.contains(evt.target as Node)) setShow(false);
    else setShow(!show);
    }, [props.Disabled, show])

    
    // Effect to handle changes to the record's field value.
    React.useEffect(() => {
        const element: string | undefined = props.Variables.find(e => _.isEqual(e, props.Record[props.Field] as any));
        setSelected(element !== undefined ? element : <div />);
    }, [props.Record, props.Variables]);


    return (
        <div ref={autoCompleteTextArea} className={"form-group"}>
        <TextArea
            Rows={props.Rows}
            Valid={props.Valid}
            Feedback={props.Feedback}
            Help={props.Help}
            Record={props.Record}
            Setter={props.Setter}
            Field={props.Field}
        />
    {/* Invalid feedback message */}
    <div className="invalid-feedback">
        {props.Feedback == null ? props.Field.toString() + ' is a required field.' : props.Feedback}
    </div>

    {/* Dropdown menu with options */}
        <Portal>
        <div ref={tableContainer} className='popover'
          style={{
            maxHeight: window.innerHeight - position.Top,
            overflowY: 'auto',
            padding: '10 5',
            display: show ? 'block' : 'none',
            position: 'absolute',
            zIndex: 9999,
            top: `${position.Top}px`,
            left: `${position.Left}px`,
            minWidth: `${position.Width}px`,
            maxWidth: '100%'
        }}
        >
            <table className="table table-hover" style={{ margin: 0 }} ref={selectTable}>
                <tbody>
                    {props.Variables.map((v, i) => (
                        v === props.Record[props.Field] ? null :
                        <tr key={i} onMouseDown={(evt) => handleOptionClick(evt, v)}>
                            <td>
                            {v}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </Portal>
        </div>
    )
}
