import { Alert } from '@gpa-gemstone/react-interactive';
import * as React from 'react';

const AlertTestComponent: React.FC  = ()=> {
    return (<>
        <Alert
            Class='alert-primary'
            ShowX={true}
            OnClick={() => alert('Closing Alert')}
        >
            Alert component with X
        </Alert>
        <Alert
            Class='alert-primary'
            ShowX={false}
            OnClick={() => alert('Closing Alert')}
        >
            Alert component without X
        </Alert>
    </>)
}

export default AlertTestComponent;