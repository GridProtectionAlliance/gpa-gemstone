import * as React from 'react';
import { Gemstone } from '@gpa-gemstone/application-typings'
import TextArea from './TextArea'
import { Portal } from 'react-portal'
import * as _ from 'lodash'
import {IProps as ITextAreaProps} from './TextArea'
import {IVariable, getSuggestions, getCurrentVariable} from './AutoCompleteInput'

interface IAutoCompleteProps<T> extends ITextAreaProps<T> {
    Options: string[]
}

export default function AutoCompleteTextArea<T>(props: IAutoCompleteProps<T>) {
  const autoCompleteTextArea = React.useRef<HTMLDivElement>(null);
  const tableContainer = React.useRef<HTMLDivElement>(null);
  const selectTable = React.useRef<HTMLTableElement>(null);
  const textAreaElement = React.useRef<HTMLTextAreaElement>(null);
  const [suggestions, setSuggestions] = React.useState<Gemstone.TSX.Interfaces.ILabelValue<string>[]>([])
  const [position, setPosition] = React.useState<Gemstone.TSX.Interfaces.IElementPosition|null>(null);
  const [variable, setVariable] = React.useState<IVariable>({Start: 0, End: 0, Variable: ""});
  const [show, setShow] = React.useState<boolean>(true);

    // Handle showing and hiding of the dropdown.
  const HandleShow = React.useCallback((evt: React.MouseEvent<HTMLButtonElement, MouseEvent> | MouseEvent) => {
    // Ignore if disabled or not a mousedown event
    if (
      (props.Disabled === undefined ? false : props.Disabled) 
      || evt.type !== 'mousedown' 
    ) {
      return
    }

    //ignore the click if it was inside the table or table container
    if ((selectTable.current != null && selectTable.current.contains(evt.target as Node)) || (tableContainer.current != null && tableContainer.current.contains(evt.target as Node))) {
      return
    }

    if (!textAreaElement.current?.contains(evt.target as Node)) { 
      setShow(false)
    }
    else {
      setShow(true)
    }
  }, [props.Disabled])
  
  // add listeners to follow caret
  React.useEffect(() => {
    const autoComplete = textAreaElement.current;
    if (autoComplete == null) return;
    
    autoComplete.addEventListener("keyup", handleCaretPosition);
    autoComplete.addEventListener("click", handleCaretPosition);

    return () => {
      autoComplete.removeEventListener("keyup", handleCaretPosition);
      autoComplete.removeEventListener("click", handleCaretPosition);
    };
  }, [])

  // set position of the suggestion dropdown
  React.useLayoutEffect(() => {
    if (suggestions?.length == 0) {
      setPosition(null);
      return
    }
    const updatePosition = _.debounce(() => {
      if (textAreaElement.current == null) {return}
      const rect = textAreaElement.current.getBoundingClientRect();
      const [ caret_X, caret_Y ] = getTextDimensions(textAreaElement, variable.Start - 1, "\n");
      setPosition({ Top: rect.top + caret_Y, Left: rect.left + caret_X, Width: rect.width, Height: rect.height });
    }, 200);

    const handleScroll = () => {
      if (tableContainer.current == null) return
      updatePosition()
    };

    updatePosition();

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('mousedown', HandleShow, false);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('mousedown', HandleShow, false);
      updatePosition.cancel();
    }
  }, [suggestions, HandleShow]);

  // update variable and suggestions when caret position changes
  const handleCaretPosition = () => {
    if (textAreaElement.current !== null) {
      const selection = textAreaElement.current.selectionStart;
      const variable = getCurrentVariable(textAreaElement.current?.value ?? "", selection);
      setVariable(variable);
      const suggests = getSuggestions(variable, textAreaElement.current?.value ?? "", props.Options)
      setSuggestions(suggests);
    }
  }
  
  // edit text area contents with selected suggestion
  const handleOptionClick = (option: Gemstone.TSX.Interfaces.ILabelValue<string>) => {
    const currentPos = textAreaElement.current !== null ? textAreaElement.current.selectionStart : 0;
    const optionLength = option.Value.length;
    props.Record[props.Field] = option.Value as any;
    props.Setter(props.Record);
    const textLength = textAreaElement.current !== null ? textAreaElement.current.textContent?.length ?? 0 : 0;
    const newCaretPos = (optionLength > textLength ? textLength - 1 : optionLength + currentPos);
    textAreaElement.current?.focus();
    textAreaElement.current?.setSelectionRange(newCaretPos, newCaretPos);
    setSuggestions([]);
  }

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
      {position == null || !show ? <></> : 
          <Portal>
            <div ref={tableContainer} className='popover'
            style={{
              maxHeight: window.innerHeight - position.Top,
              overflowY: 'auto',
              padding: '10 5',
              display: 'block',
              position: 'absolute',
              zIndex: 9999,
              maxWidth: '100%',
              top: `${position.Top}px`,
              left: `${position.Left}px`,
              minWidth: `${position.Width}px`
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
                  ))}
                </tbody>
              </table>
            </div>
          </Portal> 
    }
    </div>
  )
}

const getTextDimensions = (textArea: React.RefObject<HTMLTextAreaElement>, selection: number, prefix?: string) => {
  if (textArea.current == null) return [0, 0]
  const textarea = textArea.current;
  if (textarea.parentNode == null) return [0,0];
  const hiddenDiv = document.createElement('div')
  const style = getComputedStyle(textarea);

  Array.from(style).forEach((propertyName) => {
    const value = style.getPropertyValue(propertyName);
    hiddenDiv.style.setProperty(propertyName, value);
  })

  // Set text content up to caret
  const beforeSelection = textarea.value.substring(0, selection);
  const afterSelection = textarea.value.substring(selection) ?? '.';

  hiddenDiv.textContent = (prefix ?? "") + beforeSelection;

  // Create a span to mark caret position
  const span = document.createElement('span');
  span.textContent = afterSelection[0];
  hiddenDiv.appendChild(span);

  textarea.parentNode.appendChild(hiddenDiv);

  // Get caret's vertical position relative to textarea
  const caretX = span.offsetLeft - hiddenDiv.offsetLeft - hiddenDiv.scrollLeft;
  const caretY = span.offsetTop - hiddenDiv.offsetTop - textarea.scrollTop;

  textarea.parentNode.removeChild(hiddenDiv);
  return [caretX, caretY];
}