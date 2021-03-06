import * as React from 'react';
export default class DatePicker<T> extends React.Component<{
    Record: T;
    Field: keyof T;
    Setter: (record: T) => void;
    Label?: string;
    Disabled?: boolean;
}, {}, {}> {
    render(): JSX.Element;
}
