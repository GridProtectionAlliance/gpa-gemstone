import * as React from 'react';
import { Gemstone } from '@gpa-gemstone/application-typings'
import TextArea from './TextArea'
import { Portal } from 'react-portal'
import * as _ from 'lodash'
import {IProps as ITextAreaProps} from './TextArea'

interface IAutoCompleteProps<T> extends ITextAreaProps<T> {
    Options: string[]
}

export default function AutoCompleteTextArea<T>(props: IAutoCompleteProps<T>) {
  const autoCompleteTextArea = React.useRef<HTMLDivElement>(null);
  const tableContainer = React.useRef<HTMLDivElement>(null);
  const selectTable = React.useRef<HTMLTableElement>(null);
  const textAreaElement = React.useRef<HTMLTextAreaElement>(null);
  const [show, setShow] = React.useState<boolean>(false);
  const [autoCompleteOptions, setAutoCompleteOptions] = React.useState<Gemstone.TSX.Interfaces.ILabelValue<string>[]>([])
  const [position, setPosition] = React.useState<Gemstone.TSX.Interfaces.IElementPosition>({ Top: 0, Left: 0, Width: 0, Height: 0 });
  const [selection, setSelection] = React.useState<number>(0);
  const [variable, setVariable] = React.useState<string|null>(null);
  const [varStart, setVarStart] = React.useState<number|null>(null);
  const [varEnd, setVarEnd] = React.useState<number|null>(null);
    
  const handleOptionClick = (option: Gemstone.TSX.Interfaces.ILabelValue<string>) => {
    const currentPos = textAreaElement.current ? textAreaElement.current.selectionStart : 0;
    const optionLength = option.Value.length;
    props.Record[props.Field] = option.Value as any;
    props.Setter(props.Record);
    const textLength = textAreaElement.current ? textAreaElement.current.textContent?.length ?? 0 : 0;
    const newCaretPos = (optionLength > textLength ? textLength - 1 : optionLength + currentPos);
    textAreaElement.current?.focus();
    textAreaElement.current?.setSelectionRange(newCaretPos, newCaretPos);
    setAutoCompleteOptions([]);
    console.log(`after all: ${textAreaElement.current?.selectionStart} can be set to newPos ${newCaretPos}`);
  }

  React.useEffect(() => {
    if (autoCompleteOptions?.length > 0) {
      setShow(true);
      return
    }
    setShow(false);
  },  [autoCompleteOptions])

  const getVariablePosition = () => {
    if (!textAreaElement.current) return [0, 0]
    const textarea = textAreaElement.current;
    if (!textarea.parentNode) return [0,0];
    const hiddenDiv = document.createElement('div')
    const style = getComputedStyle(textarea);

    Array.from(style).forEach((propertyName) => {
      const value = style.getPropertyValue(propertyName);
      hiddenDiv.style.setProperty(propertyName, value);
    })

    // Set text content up to caret
    const beforeCaret = textarea.value.substring(0, (varStart ?? 0 ));
    const toLastOpenBracket = "\n" + beforeCaret.split('{').slice(0, -1).join('{');
    const afterCaret = textarea.value.substring((varStart ?? 0)) ?? '.';

    hiddenDiv.textContent = toLastOpenBracket;

    // Create a span to mark caret position
    const span = document.createElement('span');
    span.textContent = afterCaret[0];
    hiddenDiv.appendChild(span);

    textarea.parentNode.appendChild(hiddenDiv);

    // Get caret's vertical position relative to textarea
    const caretX = span.offsetLeft - textarea.scrollLeft;
    const caretY = span.offsetTop - textarea.scrollTop;

    textarea.parentNode.removeChild(hiddenDiv);
    return [caretX, caretY];
  }
  const updateCaretPosition = () => {
    if (textAreaElement.current) {
      console.log('ok')
      setSelection(textAreaElement.current.selectionStart)
    }
  }

  React.useEffect(() => {
    const autoComplete = textAreaElement.current;
    if (!autoComplete) return;
    
    autoComplete.addEventListener("keyup", updateCaretPosition);
    autoComplete.addEventListener("click", updateCaretPosition);
    //autoComplete.addEventListener("input", updateCaretPosition);

    return () => {
      autoComplete.removeEventListener("keyup", updateCaretPosition);
      autoComplete.removeEventListener("click", updateCaretPosition);
      //autoComplete.removeEventListener("input", updateCaretPosition);
    };
  }, [])

  React.useLayoutEffect(() => {
    const updatePosition = _.debounce(() => {
    if (textAreaElement.current == null) {return}
    const rect = textAreaElement.current.getBoundingClientRect();
    const [ caret_X, caret_Y ] = getVariablePosition();
    // we want to offset the position based on the cursor position within the text area.
    setPosition({ Top: rect.top + caret_Y - rect.bottom, Left: rect.left + caret_X, Width: rect.width, Height: rect.height });
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

  const updateVariable = () => {
    const text = textAreaElement.current?.value;
    if (!text) {
      setVariable(null);
      //console.log('no text')
      return;
    }

      // easy returns if selection start could not have a curly bracket before it
    if (selection === null || selection < 0 || selection > text.length) {
      setVariable(null);
      //console.log('no text')
      return
      }

    // check backwards from the caret to find the nearest open curly bracket or space
    let start = selection;
    while (start > 0) {
      //console.log(`checking ${text[start - 1]} from ${text}`)
      // check for open curly bracket. if found, assign and break as start of valid variable expression
      if (/\{/g.test(text[start - 1])) {
        //console.log('open bracket encountered, moving on')
        break;
      }

      // if space is encountered first, return
      if (/[\s\}]/g.test(text[start - 1])) {
        setVariable(null);
        //console.log('space encountered, set variable to null')
        return
      }
      start--;
    }

    // if no variable found, return
    if (start == 0) {
      setVariable(null);
      //console.log('no variable found')
      return
    }
    setVarStart(start);

    // then, get the rest of the word.
    let end = start ?? 0;
    let hasEndBracket = false;
    while (end < text.length) {
      if (/\}/.test(text[end])) {
        hasEndBracket = true;
        //console.log('has end bracket')
        break;
      }
      if (/[\s]/.test(text[end])) {
        //console.log('finds the space')
        break;
      }
      end++;
    }
    setVarEnd(end);

    // get variable as substring of text
    const variable = text.substring(start, end);
    //console.log(`variable ${variable} from ${varStart} or ${start} to ${varEnd} or ${end}`)
    setVariable(variable);
  }

  React.useEffect(() => {
    updateVariable();
  }, [selection])

  const newhandleAutoComplete = () => {
    if (variable == null) {
      console.log(`no variable for autocomplete`);
      setAutoCompleteOptions([]);
      return;
    }
    // if variable is valid option and hasEndBracket, assume it doesn't need autocompletion.
    if (props.Options.includes(variable)) {
      console.log(`variable doesn't need autocomplete`);
      setAutoCompleteOptions([]);
    }

    const text = textAreaElement.current?.value;
    if (!text) {
      console.log(`no text`);
      setAutoCompleteOptions([]);
      return;
    }

    // Find suggestions for the variable
    const possibleVariables = props.Options.filter(v => v.toLowerCase().includes(variable.toLowerCase()));

    const before = text.substring(0, (varStart ?? 0) - 1);
    const after = text.substring(varEnd ?? 0);
    const hasEndBracket = (text[(varEnd ?? 0)] === '}')
    console.log(`b: ${before} a: ${after} hasbracket: ${hasEndBracket}`);

    // Generate suggestions
    const suggestions = possibleVariables.map((pv) => {

      // Ensure we have braces around the variable and add closing '}' if it was missing
      const variableWithBraces = hasEndBracket ? `{${pv}` : `{${pv}}`;
      return { Label: `${variableWithBraces}`, Value: `${before}${variableWithBraces}${after}` };
    });
  setAutoCompleteOptions(suggestions);
  }

  React.useEffect(() => {
    console.log('thank u son')
    newhandleAutoComplete()
  }, [variable])

  return (
    <div ref={autoCompleteTextArea}>
      <TextArea
        Valid={props.Valid}
        Record={props.Record}
        Setter={props.Setter}
        Field={props.Field}
        Rows={props.Rows}
        TextAreaRef={textAreaElement}
        SpellCheck={false}
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
                ))}
              </tbody>
            </table>
          </div>
          </Portal> 
        }
    </div>
  )
}