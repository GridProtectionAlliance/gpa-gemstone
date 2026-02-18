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

export interface IVariable {
  Start: number
  End: number
  Variable: string | null
}

export default function AutoCompleteInput<T>(props: IProps<T>) {
  const autoCompleteInput = React.useRef<HTMLDivElement>(null);
  const inputElement = React.useRef<HTMLInputElement>(null);
  const tableContainer = React.useRef<HTMLDivElement>(null);
  const selectTable = React.useRef<HTMLTableElement>(null);
  const [show, setShow] = React.useState<boolean>(false);
  const [suggestions, setSuggestions] = React.useState<Gemstone.TSX.Interfaces.ILabelValue<string>[]>([])
  const [position, setPosition] = React.useState<Gemstone.TSX.Interfaces.IElementPosition>({ Top: 0, Left: 0, Width: 0, Height: 0 });
  const [selection, setSelection] = React.useState<number>(0);
  const [variable, setVariable] = React.useState<IVariable>({Start: 0, End: 0, Variable: ""});
    
  const handleOptionClick = (option: Gemstone.TSX.Interfaces.ILabelValue<string>) => {
      if (inputElement.current == null) return;
      const currentPos = inputElement.current.selectionStart ?? 0;
      const optionLength = option.Value.length;
      props.Record[props.Field] = option.Value as any;
      props.Setter(props.Record);
      const textLength = inputElement.current.textContent?.length ?? 0;
      const newCaretPos = (optionLength > textLength ? textLength - 1 : optionLength + currentPos);
      inputElement.current?.focus();
      inputElement.current?.setSelectionRange(newCaretPos, newCaretPos);
      setSuggestions([]);
    }

  React.useLayoutEffect(() => {
    if (suggestions?.length == 0) {return}
    const updatePosition = _.debounce(() => {
      if (inputElement.current == null) {return}
      const rect = inputElement.current.getBoundingClientRect();
      setPosition({ Top: rect.bottom, Left: rect.left, Width: rect.width, Height: rect.height });
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

  }, [suggestions]);

  React.useEffect(() => {
    if (suggestions.length > 0) {
      if (position.Top == 0) {return}
      setShow(true);
    }
    else {
      setShow(false);
    }
  },  [suggestions, position])

  const updateCaretPosition = () => {
    if (inputElement.current !== null) {
      setSelection(inputElement.current.selectionStart ?? 0)
    }
  }

  React.useEffect(() => {
    const autoComplete = inputElement.current;
    if (autoComplete == null) return;
    
    autoComplete.addEventListener("keyup", updateCaretPosition);
    autoComplete.addEventListener("click", updateCaretPosition);

    return () => {
      autoComplete.removeEventListener("keyup", updateCaretPosition);
      autoComplete.removeEventListener("click", updateCaretPosition);
    };
  }, [])

  React.useEffect(() => {
    setVariable(getCurrentVariable(inputElement.current?.getAttribute('value') ?? "", selection));
  }, [selection])


  React.useEffect(() => {
    setSuggestions(getSuggestions(variable, inputElement.current?.getAttribute('value') ?? "", props.Options))
  }, [variable])



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
        InputRef={inputElement}
      />
      {!show ? null :
        <Portal>
          <div ref={tableContainer} className='popover'
            style={{
              maxHeight: window.innerHeight - position.Top,
              overflowY: 'auto',
              padding: '10 5',
              display: 'block',
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
                {suggestions.map((f, i) => (
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


export const getSuggestions = (variable: IVariable, text: string, options: string[]) => {
  if (!(variable.Variable != null)) {
    return [];
  }
  // if variable is valid option and hasEndBracket, assume it doesn't need autocompletion.
  if (options.includes(variable.Variable)) {
    return [];
  }

  if (text === "") {
    return [];
  }

  // Find suggestions for the variable
  const possibleVariables = options.filter(v => v.toLowerCase().includes((variable.Variable ?? "").toLowerCase()));

  const before = text.substring(0, (variable.Start) - 1);
  const after = text.substring(variable.End);
  const hasEndBracket = (text[variable.End] === '}');

  // Generate suggestions
  const suggestions = possibleVariables.map((pv) => {

    // Ensure we have braces around the variable and add closing '}' if it was missing
    const variableWithBraces = hasEndBracket ? `{${pv}` : `{${pv}}`;
    return { Label: `${variableWithBraces}${hasEndBracket ? '}' : ''}`, Value: `${before}${variableWithBraces}${after}` };
  });
return suggestions;
}



export const getCurrentVariable = (text: string, selection: number) => {
  const thisVariable = {
    Start: 0,
    End: 0,
    Variable: null 
  };

  if (text === "") {
    return thisVariable;
  }

    // easy returns if selection start could not have a curly bracket before it
  if (selection === null || selection < 0 || selection > text.length) {
    return thisVariable;
    }

  // check backwards from the caret to find the nearest open curly bracket or space
  let start = selection;
  while (start > 0) {
    // check for open curly bracket. if found, assign and break as start of valid variable expression
    if (/{/g.test(text[start - 1])) {
      break;
    }

    // if space is encountered first, return
    if (/[\s}]/g.test(text[start - 1])) {
      return thisVariable;
    }
    start--;
  }

  // if no variable found, return
  if (start == 0) {
    return thisVariable;
  }

  thisVariable.Start = start;

  // then, get the rest of the word.
  let end = start ?? 0;
  while (end < text.length) {
    if (/[}{\s}]/.test(text[end])) {
      break;
    }
    end++;
  }
  thisVariable.End = end;

  // get variable as substring of text
  const variable = text.substring(start, end);
  return {Start: thisVariable.Start, End: thisVariable.End, Variable: variable};
}