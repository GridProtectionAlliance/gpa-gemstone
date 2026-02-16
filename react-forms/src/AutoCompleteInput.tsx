// ******************************************************************************************************
//  AutoCompleteInput.tsx - Gbtc
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
import { Gemstone } from '@gpa-gemstone/application-typings'
import Input, {IProps as IInputProps} from './Input'
import { Portal } from 'react-portal'
import * as _ from 'lodash'

interface IProps<T> extends Omit<IInputProps<T>, 'Type'> {
  Options: string[]
}

export default function AutoCompleteInput<T>(props: IProps<T>) {
  const autoCompleteInput = React.useRef<HTMLDivElement>(null);
  const tableContainer = React.useRef<HTMLDivElement>(null);
  const selectTable = React.useRef<HTMLTableElement>(null);
  const [show, setShow] = React.useState<boolean>(false);
  const [autoCompleteOptions, setAutoCompleteOptions] = React.useState<Gemstone.TSX.Interfaces.ILabelValue<string>[]>([])
  const [position, setPosition] = React.useState<Gemstone.TSX.Interfaces.IElementPosition>({ Top: 0, Left: 0, Width: 0, Height: 0 });
    
  const handleOptionClick = (option: Gemstone.TSX.Interfaces.ILabelValue<string>) => {
    props.Record[props.Field] = option.Value as any;
    props.Setter(props.Record)
    setShow(false)
  }
  React.useEffect(() => {
    if (autoCompleteOptions != null && autoCompleteOptions.length !== 0) {
      setShow(true);
      return
    }
    setShow(false);
  }, [autoCompleteOptions])
    
  React.useEffect(() => {
    const rawValue = props.Record[props.Field] == null ? '' : (props.Record[props.Field] as any).toString();
    handleAutoComplete(rawValue, props.Options, setAutoCompleteOptions);
  }, [props.Record[props.Field]])

  React.useLayoutEffect(() => {
    const updatePosition = _.debounce(() => {
    if (autoCompleteInput.current != null) {
      const rect = autoCompleteInput.current.getBoundingClientRect();
      setPosition({ Top: rect.bottom, Left: rect.left, Width: rect.width, Height: rect.height });
      }
    }, 200);

    const handleScroll = () => {
      if (tableContainer.current == null) return
      updatePosition()
      };

    updatePosition();

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updatePosition);
      updatePosition.cancel();
    }
  }, [autoCompleteOptions]);


  return (
    <div ref={autoCompleteInput}>
      <Input
        Valid={props.Valid}
        Record={props.Record}
        Setter={props.Setter}
        Field={props.Field}
        Feedback={props.Feedback}
        Style={props.Style}
        AllowNull={props.AllowNull}
        Size={props.Size}
        DefaultValue={props.DefaultValue}
      />
      {!show ? null :
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
                {autoCompleteOptions.map((f, i) => (
                  f.Value === props.Record[props.Field] ? null :
                    <tr key={i} onMouseDown={(_) => handleOptionClick(f)}>
                      <td>
                        {f.Label}
                      </td>
                    </tr>
                    )
                  )
                  }
              </tbody>
            </table>
          </div>
        </Portal> 
        }
      </div>
    )
}

export const handleAutoComplete = (inputString: string, autoCompletes: string[], autoCompleteSetter: React.Dispatch<React.SetStateAction<Gemstone.TSX.Interfaces.ILabelValue<string>[]>>) => {

  // Find all variables in the searchString
  const regex = /\{([^\s{}]*)/g;
  let match: RegExpExecArray | null;
  const variables: { name: string; start: number; end: number; hasClosingBrace: boolean }[] = [];

  while ((match = regex.exec(inputString)) !== null) {
    const variableName = match[1];
    const start = match.index;
    let end = regex.lastIndex;

    // Check if there is a closing '}'
    let hasClosingBrace = false;
    if (inputString[end] === '}') {
      hasClosingBrace = true;
      end++; // Include the closing '}'
    }

    variables.push({ name: variableName, start, end, hasClosingBrace });
  } // Find the first invalid variable
  const invalidVariable = variables.find((v) => !v.hasClosingBrace || !autoCompletes.some((cv) => cv.toLowerCase() === v.name.toLowerCase()));

  if (invalidVariable == null) {
    return([]);
  }

  // Find suggestions for the invalid variable
  const possibleVariables = autoCompletes.filter(v => v.toLowerCase().includes(invalidVariable.name.toLowerCase()));

  // Generate suggestions by replacing the FIRST invalid variable
  const suggestions = possibleVariables.map((pv) => {
  const before = inputString.substring(0, invalidVariable.start);
  const after = inputString.substring(invalidVariable.end);

  // Ensure we have braces around the variable and add closing '}' if it was missing
  const variableWithBraces = invalidVariable.hasClosingBrace ? `{${pv}}` : `{${pv}}`;
  return { Label: `${variableWithBraces}`, Value: `${before}${variableWithBraces}${after}` };
  });
  autoCompleteSetter(suggestions);
};
