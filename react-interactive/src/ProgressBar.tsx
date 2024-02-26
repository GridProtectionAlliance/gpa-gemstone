// ******************************************************************************************************
//  Step.tsx - Gbtc
//
//  Copyright � 2020, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA licenses this file to you under the MIT License (MIT), the "License"; you may not use this
//  file except in compliance with the License. You may obtain a copy of the License at:
//
//      http://opensource.org/licenses/MIT
//
//  Unless agreed to in writing, the subject software distributed under the License is distributed on an
//  "AS-IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. Refer to the
//  License for the specific language governing permissions and limitations.
//
//  Code Modification History:
//  ----------------------------------------------------------------------------------------------------
//  12/13/2022 - A. Hagemeyer
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react'

/// Styles for all Circles
const circleStyle: React.CSSProperties = {
    height: '25px',
    width: '25px',
    borderRadius: '50%',
    borderWidth: '2px',
    borderStyle: 'solid',
    display: 'inline-block',
    backgroundColor: '#fff',
}

interface IStep {
    short: string,
    long: string,
    id: string | number
}
interface IProps {
    steps: IStep[],
    activeStep: string | number,
    height?: string | number,
    width?: string | number,
    onClick?: (currentStep: string|number, clickedStep: string|number) => void
}

function ProgressBar(props: IProps) {
    const [activeStep, setActiveStep] = React.useState<number>(0);

    React.useEffect(() => {
        if (props.steps.length < 2) {
            setActiveStep(0);
            return;
        }

        const index = props.steps.findIndex(s => s.id === props.activeStep);

        if (index === -1)
            setActiveStep(0);
        else
            setActiveStep(index);

    }, [props.activeStep, props.steps])

    const clickhandle = React.useCallback((step: number|string) => {
        if (props.onClick !== undefined)
            props.onClick(props.activeStep,step);
    },[props.activeStep, props.onClick]);

    /// Styles for overall div
    const stepsStyle: React.CSSProperties = {
        height: props.height === undefined ? '100%' : props.height,
        width: props.width === undefined ? '100%' : props.width,
        paddingTop: 17,
        minWidth: '210px',
        justifyContent: 'space-evenly',
    }

    /// Styles for gray bar
    const stepsContainerStyle: React.CSSProperties = {
        width: '100%',
        backgroundColor: '#DDD',
        height: '10px',
        top: '50%',
        borderRadius: '10px 0 0 10px'
    }

    const descriptionStyles: React.CSSProperties = {
        fontSize: '15px',
        fontStyle: 'italic',
        color: '#538897',
        width: '100%',
        display: 'inline-block'
    }

    return (
        <div id='steps' style={stepsStyle}>
            <div style={stepsContainerStyle} />
            <div style={{
                width: ((((activeStep===0? 0 : ((activeStep === (props.steps.length -1))? 1 : 0.5))) + activeStep) * (100.0 / props.steps.length)).toString() + '%',
                backgroundColor: '#5DC177',
                height: 10,
                top: '50%',
                borderRadius: '10px 0 0 10px',
                marginTop: -10
            }}></div>
            <div style={{
                height: '100px',
                width: '100%',
                top: '46%',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                {props.steps.map((x,i) => <div
                    
                    style={{
                        height: '60px',
                        width: 'calc(' + (100/props.steps.length).toString() + '%)',
                        marginTop: -17
                    }} key={x.id}>
                    <span onClick={() => clickhandle(x.id)}
                    style={{
                        ...circleStyle,
                        borderColor: i <= activeStep ? '#5DC177' : '#D3D3D3',
                        cursor: (i === activeStep || props.onClick === undefined) ? undefined : 'pointer',
                        marginLeft: (i === (props.steps.length-1) ? 'calc(100% - 25px)' : (i===0? undefined : 'calc(50% - 12px)')),
                        marginRight: (i === 0 ? 'calc(100% - 25px)' : (i === (props.steps.length - 1) ? undefined :'calc(50% - 12px)')),
                        
                    }} />
                    <span 
                        onClick={() => clickhandle(x.id)}
                    style={{
                        ...descriptionStyles,
                        cursor: (i === activeStep || props.onClick === undefined) ? undefined : 'pointer',
                        textAlign: (i === 0? 'left' : (i === (props.steps.length - 1) ? 'right' : 'center'))
                    }}>
                        {x.id === props.activeStep ? x.long : x.short}
                    </span>
                </div>)
}
            </div>
        </div>
    );

}

export default ProgressBar;