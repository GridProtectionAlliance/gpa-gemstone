import { Alert } from '@gpa-gemstone/react-interactive';
import * as React from 'react';

const AlertTestComponent: React.FC  = ()=> {
    const [retriggerFlag, setRetriggerFlag] = React.useState<number>(0);
    const [alertGone, setAlertGone] = React.useState<boolean>(false);
    const triggerClick = () => {
        setRetriggerFlag(x => x + 1);
        setAlertGone(false);
    }

    return (<div className="row">
        <div className="align-items-start">
            <div className="col-md">
                <Alert
                    Class="alert-primary"
                    ShowX={true}
                    OnClick={() => { alert('Closing Alert'); setAlertGone(true); }}
                    ReTrigger={retriggerFlag}
                >
                    Alert component with X
                </Alert>
            </div>
            <div className={`col-auto ${alertGone ? 'd-block' : 'd-none'}`}>
                <button type="button" className="btn btn-secondary btn-block mb-3" onClick={triggerClick}>
                    Bring Back Closed Alert
                </button>
            </div>
        </div>

        {/* Second Row */}
        <div className="">
            <div className="col">
                <Alert
                    Class="alert-primary"
                    ShowX={false}
                    OnClick={() => alert('Closing Alert')}
                >
                    Alert component without X
                </Alert>
            </div>
        </div>
    </div>)
}

export default AlertTestComponent;