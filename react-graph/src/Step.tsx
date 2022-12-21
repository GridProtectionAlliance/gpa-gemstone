// ******************************************************************************************************
//  Step.tsx - Gbtc
//
//  Copyright © 2020, Grid Protection Alliance.  All Rights Reserved.
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

interface IProps {
    steps:
    {
        short: string,
        long: string,
        id: string | number
    }[],
    activeStep: string | number,
    height: number,
    width: number
}

function Step(props: IProps) {
    let met = false;
    const divs: JSX.Element[] = [];
    let stepBar: JSX.Element = <div></div>;

    /// Styles for overall div
    const stepsStyle: React.CSSProperties = {
        height: props.height,
        minHeight: '210px',
        width: props.width,
        position: 'absolute',
        justifyContent: 'space-evenly'
    }

    /// Styles for gray bar
    const stepsContainerStyle: React.CSSProperties = {
        width: '100%',
        backgroundColor: '#DDD',
        maxHeight: '10px',
        height: '10%',
        position: 'absolute',
        top: '50%',
        borderRadius: '10px 0 0 10px'
    }

    /// Create each circle and description
    function getSteps() {
        props.steps.forEach((x) => {

            /// Past steps
            if (!met && x.id !== props.activeStep) {
                let div = <div style={{ height: '60px', width: '25px', alignContent: 'center' }}>
                    <span style={{ height: '25px', width: '25px', backgroundColor: '#fff', borderRadius: '50%', borderWidth: '2px', borderStyle: 'solid', borderColor: '#5DC177', display: 'inline-block' }}></span>
                    <span style={{ fontSize: '15px', fontStyle: 'italic', color: '#538897', alignContent: 'center', display: 'inline-block' }}>{x.short}</span>
                </div>
                divs.push(div);
            }

            /// Current active step
            if (x.id === props.activeStep) {
                met = true;
                let div = <div style={{ height: '60px', width: '25px', alignContent: 'center' }}>
                    <span className='active_circle' style={{ height: '25px', width: '25px', backgroundColor: '#fff', borderRadius: '50%', borderWidth: '2px', borderStyle: 'solid', borderColor: '#5DC177', display: 'inline-block' }}></span>
                    <span className='active_name' style={{ fontSize: '15px', fontStyle: 'italic', color: '#538897', alignContent: 'center', display: 'inline-block' }}>{x.long}</span>
                </div>
                stepBar = <div style={{ width: (props.steps.indexOf(x) / (props.steps.length - 1)) * props.width, backgroundColor: '#5DC177', maxHeight: '10px', height: '10%', position: 'absolute', top: '50%', borderRadius: '10px 0 0 10px' }}></div>
                divs.push(div);
            }

            /// Future steps
            if (met && x.id !== props.activeStep) {
                let div = <div style={{ height: '60px', width: '25px', alignContent: 'center' }}>
                    <span style={{ height: '25px', width: '25px', backgroundColor: '#fff', borderRadius: '50%', borderWidth: '2px', borderStyle: 'solid', borderColor: '#D3D3D3', display: 'inline-block' }}></span>
                    <span style={{ fontSize: '15px', fontStyle: 'italic', color: '#538897', alignContent: 'center', display: 'inline-block' }}>{x.short}</span>
                </div>
                divs.push(div);
            }
        });

    }

    { getSteps() }
    return (
        <div style={stepsStyle}>
            <div style={stepsContainerStyle}></div>
            {stepBar}
            <div style={{ height: '100px', width: '100%', top: '46%', position: 'absolute', display: 'flex', justifyContent: 'space-between' }}>
                {divs}
            </div>
        </div>
    );

}

export default Step;