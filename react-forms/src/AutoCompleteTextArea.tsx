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
  const [show, setShow] = React.useState<boolean>(false);
  const [suggestions, setSuggestions] = React.useState<Gemstone.TSX.Interfaces.ILabelValue<string>[]>([])
  const [position, setPosition] = React.useState<Gemstone.TSX.Interfaces.IElementPosition>({ Top: 0, Left: 0, Width: 0, Height: 0 });
  const [selection, setSelection] = React.useState<number>(0);
  const [variable, setVariable] = React.useState<IVariable>({Start: 0, End: 0, Variable: ""});
    
  const handleOptionClick = (option: Gemstone.TSX.Interfaces.ILabelValue<string>) => {
    const currentPos = textAreaElement.current ? textAreaElement.current.selectionStart : 0;
    const optionLength = option.Value.length;
    props.Record[props.Field] = option.Value as any;
    props.Setter(props.Record);
    const textLength = textAreaElement.current ? textAreaElement.current.textContent?.length ?? 0 : 0;
    const newCaretPos = (optionLength > textLength ? textLength - 1 : optionLength + currentPos);
    textAreaElement.current?.focus();
    textAreaElement.current?.setSelectionRange(newCaretPos, newCaretPos);
    setSuggestions([]);
  }

  React.useEffect(() => {
    if (suggestions.length == 0) {
      setPosition({Top: 0, Left: 0, Width: 0, Height: 0});
    }
  }, [suggestions])

  React.useEffect(() => {
    if (suggestions.length > 0) {
      if (!tableContainer.current) {return}
      tableContainer.current.style.top = `${position.Top}px`;
      tableContainer.current.style.left = `${position.Left}px`;
      tableContainer.current.style.minWidth = `${position.Width}px`;
      if (tableContainer.current.style.top === '0px' && tableContainer.current.style.left === '0px') {return}
      setShow(true);
    }
    else {
      setShow(false);
    }
  },  [suggestions, position])

  const updateCaretPosition = () => {
    if (textAreaElement.current) {
      setSelection(textAreaElement.current.selectionStart)
    }
  }

  React.useEffect(() => {
    const autoComplete = textAreaElement.current;
    if (!autoComplete) return;
    
    autoComplete.addEventListener("keyup", updateCaretPosition);
    autoComplete.addEventListener("click", updateCaretPosition);

    return () => {
      autoComplete.removeEventListener("keyup", updateCaretPosition);
      autoComplete.removeEventListener("click", updateCaretPosition);
    };
  }, [])


  React.useLayoutEffect(() => {
    if (suggestions?.length == 0) {return}
    const updatePosition = _.debounce(() => {
    if (textAreaElement.current == null) {return}
    const rect = textAreaElement.current.getBoundingClientRect();
    const [ caret_X, caret_Y ] = getTextDimensions(textAreaElement, variable.Start - 1, "\n");
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

  }, [suggestions]);

  React.useEffect(() => {
    setVariable(getCurrentVariable(textAreaElement.current?.value ?? "", selection));
  }, [selection])


  React.useEffect(() => {
    setSuggestions(getSuggestions(variable, textAreaElement.current?.value ?? "", props.Options))
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
          <Portal>
            <div ref={tableContainer} className='popover'
            style={{
              maxHeight: window.innerHeight - position.Top,
              overflowY: 'auto',
              padding: '10 5',
              display: show ? 'block' : 'none',
              position: 'absolute',
              zIndex: 9999,
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
                  ))}
                </tbody>
              </table>
            </div>
          </Portal> 
    </div>
  )
}

const getTextDimensions = (textArea: React.RefObject<HTMLTextAreaElement>, selection: number, prefix?: string) => {
  if (!textArea.current) return [0, 0]
  const textarea = textArea.current;
  if (!textarea.parentNode) return [0,0];
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
  const caretX = span.offsetLeft - textarea.scrollLeft;
  const caretY = span.offsetTop - textarea.scrollTop;

  textarea.parentNode.removeChild(hiddenDiv);
  return [caretX, caretY];
}