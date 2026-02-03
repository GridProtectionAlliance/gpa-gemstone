import * as React from 'react';
import { Gemstone } from '@gpa-gemstone/application-typings'
import TextArea from './TextArea'
import { Portal } from 'react-portal'
import * as _ from 'lodash'
import { handleAutoComplete } from './AutoCompleteInput';

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
    * Autocomplete options
    * @type {string}
  */
    Options: string[]
}

export default function AutoCompleteTextArea<T>(props: IProps<T>) {
  const autoCompleteTextArea = React.useRef<HTMLDivElement>(null);
  const tableContainer = React.useRef<HTMLDivElement>(null);
  const selectTable = React.useRef<HTMLTableElement>(null);
  const textAreaElement = React.useRef<HTMLTextAreaElement>(null);
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
  },  [autoCompleteOptions])
    
  React.useEffect(() => {
    const rawValue = props.Record[props.Field] == null ? '' : (props.Record[props.Field] as any).toString();
    handleAutoComplete(rawValue, props.Options, setAutoCompleteOptions);
  },  [props.Record[props.Field]])

  React.useLayoutEffect(() => {
    const updatePosition = _.debounce(() => {
    if (textAreaElement.current == null) {return}
    const rect = textAreaElement.current.getBoundingClientRect();
    const [ caret_X, caret_Y ] = getCaretPosition(textAreaElement.current);
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


  return (
    <div ref={autoCompleteTextArea}>
      <TextArea
        Valid={props.Valid}
        Record={props.Record}
        Setter={props.Setter}
        Field={props.Field}
        Rows={props.Rows}
        TextAreaRef={textAreaElement}
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

function getCaretPosition(textarea: HTMLTextAreaElement) {
  if (textarea.parentNode == null) {return [0, 0]}
  const { selectionStart } = textarea;
  const hiddenDiv = document.createElement('div')
  const style = getComputedStyle(textarea);

  Array.from(style).forEach((propertyName) => {
    const value = style.getPropertyValue(propertyName);
    hiddenDiv.style.setProperty(propertyName, value);
  })

  // Set text content up to caret
  const beforeCaret = textarea.value.substring(0, selectionStart);
  const toLastOpenBracket = "\n" + beforeCaret.split('{').slice(0, -1).join('{');
  const afterCaret = textarea.value.substring(selectionStart) ?? '.';

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
    