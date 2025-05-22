import { Gemstone } from '@gpa-gemstone/application-typings';
import * as React from 'react';

/**
 * React context providing ICSVFieldEditContext to edit components.
 */
export const CSVFieldEditContext = React.createContext<Gemstone.TSX.Interfaces.ICSVFieldEditContext<any>>({
    Value: '',
    SetValue: (_) => { /*do nothing */ },
    Validate: (_) => true,
    AllRecordValues: {},
    Feedback: '',
    SelectOptions: []
});

/**
 * Hook to consume CSVFieldEditContext .
 */
export const useCSVFieldEditContext = <T = any,>(): Gemstone.TSX.Interfaces.ICSVFieldEditContext<T> => {
    const context = React.useContext<Gemstone.TSX.Interfaces.ICSVFieldEditContext<T>>(CSVFieldEditContext);
    return context;
}
