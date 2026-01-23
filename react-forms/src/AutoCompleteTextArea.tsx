import * as React from 'react';
import { Gemstone } from '@gpa-gemstone/application-typings'
import TextArea from './Input'
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
        const rect = autoCompleteTextArea.current.getBoundingClientRect();
        setPosition({ Top: rect.bottom, Left: rect.left, Width: rect.width, Height: rect.height });
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
