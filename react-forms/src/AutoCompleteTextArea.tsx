import * as React from 'react';
import { Gemstone } from '@gpa-gemstone/application-typings'
import TextArea from './TextArea'
import { Portal } from 'react-portal'
import * as _ from 'lodash'

interface ILabelValue {
    Label: string
    Value: string
}

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

  AutoCompletes: string[]
}

export default function AutoCompleteTextArea<T>(props: IProps<T>) {
    
    const autoCompleteTextArea = React.useRef<HTMLDivElement>(null);
    const tableContainer = React.useRef<HTMLDivElement>(null);
    const selectTable = React.useRef<HTMLTableElement>(null);
    const textAreaElement = React.useRef<HTMLTextAreaElement | null>(null);
    const [show, setShow] = React.useState<boolean>(false);
    const [autoCompleteOptions, setAutoCompleteOptions] = React.useState<ILabelValue[]>([])
    const [position, setPosition] = React.useState<Gemstone.TSX.Interfaces.IElementPosition>({ Top: 0, Left: 0, Width: 0, Height: 0 });
    
    const handleOptionClick = (evt: React.MouseEvent<HTMLTableRowElement, MouseEvent>, option: ILabelValue) => {
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
        handleAutoComplete(rawValue, props.AutoCompletes, setAutoCompleteOptions);
    },
    [props.Record[props.Field]]
    )

    React.useLayoutEffect(() => {
     const updatePosition = _.debounce(() => {
      if (autoCompleteTextArea.current != null) {
        if (textAreaElement.current == null) {
            const textAreaComponent = autoCompleteTextArea.current.firstChild;
            if (textAreaComponent == null) {return}
            textAreaComponent.childNodes.forEach((element) => element.nodeName === 'TEXTAREA' ? textAreaElement.current = element as HTMLTextAreaElement : null)
        }
        if (textAreaElement.current == null) {return}
        const rect = textAreaElement.current.getBoundingClientRect();
        const [ caret_X, caret_Y ] = getCaretPosition(textAreaElement.current);
        console.log(caret_X, caret_Y, rect.top, rect.left)
        // we want to offset the position based on the cursor position within the text area.
        setPosition({ Top: rect.top + caret_Y - rect.bottom, Left: rect.left + caret_X, Width: rect.width, Height: rect.height });
      }
    }, 200);

    const handleScroll = (event: Event) => {
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
                        <tr key={i} onMouseDown={(evt) => handleOptionClick(evt, f)}>
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

export const handleAutoComplete = (inputString: string, autoCompletes: string[], autoCompleteSetter: React.Dispatch<React.SetStateAction<ILabelValue[]>>) => {

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
    console.log(`text area: ${textarea.scrollLeft}, ${textarea.scrollTop}`);
    console.log(`span: ${span.offsetLeft}, ${span.offsetTop}`)
    const caretX = span.offsetLeft - textarea.scrollLeft;
    const caretY = span.offsetTop - textarea.scrollTop;

    textarea.parentNode.removeChild(hiddenDiv);
    return [caretX, caretY];
}
    