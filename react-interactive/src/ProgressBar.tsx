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
    height?: string | number,
    width?: string | number
}

function ProgressBar(props: IProps) {
    let met = false;
    let metIndex = 0;
    const divs: JSX.Element[] = [];

    /// Styles for overall div
    const stepsStyle: React.CSSProperties = {
        height: props.height === undefined ? '100%' : props.height,
        minHeight: '210px',
        width: props.width === undefined ? '100%' : props.width,
        minWidth: '210px',
        position: 'absolute',
        justifyContent: 'space-evenly',

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

    /// Styles for past/current circles
    const activeCircleStyle: React.CSSProperties = {
        height: '25px',
        width: '25px',
        backgroundColor: '#fff',
        borderRadius: '50%',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#5DC177',
        display: 'inline-block'
    }

    /// Styles for unactivated circles
    const inactiveCircleStyle: React.CSSProperties = {
        height: '25px',
        width: '25px',
        backgroundColor: '#fff',
        borderRadius: '50%',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#D3D3D3',
        display: 'inline-block'
    }

    const descriptionStyles: React.CSSProperties = {
        fontSize: '15px',
        fontStyle: 'italic',
        color: '#538897',
        alignContent: 'center',
        display: 'inline-block'
    }

    /// Create each circle and description
    function getSteps() {
        props.steps.forEach((x) => {

            if (x.id === props.activeStep) {
                met = true;
                metIndex = props.steps.indexOf(x);
            }

            divs.push(
                <div style={{ height: '60px', width: '25px', alignContent: 'center' }}><span style={x.id === props.activeStep || !met ? activeCircleStyle : inactiveCircleStyle}></span><span style={descriptionStyles}>{x.id === props.activeStep ? x.long : x.short}</span></div>
            );


        });

    }

    { getSteps() }
    return (
        <div  id='steps' style={stepsStyle}>
            <div style={stepsContainerStyle}></div>
            <div style={{ width: ((metIndex / (props.steps.length - 1)) * 100).toString() + '%', backgroundColor: '#5DC177', maxHeight: '10px', height: '10%', position: 'absolute', top: '50%', borderRadius: '10px 0 0 10px' }}></div>
            <div style={{ height: '100px', width: '100%', top: '46%', position: 'absolute', display: 'flex', justifyContent: 'space-between' }}>
                {divs}
            </div>
        </div>
    );

}

export default ProgressBar;