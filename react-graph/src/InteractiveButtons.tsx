// ******************************************************************************************************
//  InteractiveButtons.tsx - Gbtc
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
//  03/18/2021 - C Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import {MagnifyingGlass, House, Pan, InputNumbers, Point} from '@gpa-gemstone/gpa-symbols'
import Button from './Button'

interface IProps {
    showZoom: boolean,
    showPan: boolean,
    showReset: boolean,
    showSelect: boolean,
    showDownload: boolean,
    currentSelection: 'zoom'|'pan'|'select',
    setSelection: (selection: ButtonType) => void,
    x: number,
    y: number
}

type ButtonType = ('zoom' | 'pan' | 'reset' | 'select' | 'download');

const InteractiveButtons: React.FunctionComponent<IProps> = (props) => {
    /*
      Used to select Zoom, Drag or Reset
    */
    const [expand, setExpand] = React.useState<boolean>(false);

    const nChildren = (props.children == null) ? 0 : React.Children.count(props.children);
    const nButtons = (props.showZoom? 1 : 0) + (props.showPan? 1 : 0) + (props.showReset? 1 : 0) + (props.showSelect? 1 : 0) + (props.showDownload? 1 : 0) + nChildren;

    function openTray(evt: React.MouseEvent): void {
      evt.stopPropagation();
      setExpand(true);
    }

    if (nButtons === 0)
      return null;

    if (nButtons === 1 || !expand)
      return (
        <g>
          <circle stroke={'black'}
            onClick={openTray}
            r={10} cx={props.x} cy={props.y}
            style={{ fill: '#002eff', pointerEvents: 'all' }}
            onMouseDown={(evt) => evt.stopPropagation()}
            onMouseUp={(evt) => evt.stopPropagation()} />
          <text fill={'black'} style={{ fontSize: '1em', textAnchor: 'middle', dominantBaseline: 'middle' }} x={props.x} y={props.y}>
            {props.currentSelection === 'zoom' ? MagnifyingGlass : props.currentSelection === 'pan'? Pan : Point}
          </text>
        </g>)

    const width = 25*nButtons - 25;
    const symbols = [] as React.ReactElement[];
    const symbolNames = [] as ButtonType[];
    if (props.showZoom) {
      symbolNames.push('zoom' as ButtonType);
      symbols.push(<Button onClick={() => {props.setSelection('zoom'); setExpand(false) }}>{MagnifyingGlass}</Button>)
    }
    if (props.showPan) {
      symbolNames.push('pan' as ButtonType);
      symbols.push(<Button onClick={() => {props.setSelection('pan'); setExpand(false) }}>{Pan}</Button>)
    }
    if (props.showSelect) {
        symbolNames.push('select' as ButtonType);
        symbols.push(<Button onClick={() => {props.setSelection('select'); setExpand(false) }}>{Point}</Button>)
    }
    if (props.showReset) {
      symbolNames.push('reset' as ButtonType);
      symbols.push(<Button onClick={() => {setExpand(false); props.setSelection('reset'); }}>{House}</Button>)
    }
    if (props.showDownload) {
      symbolNames.push('download' as ButtonType);
      symbols.push(<Button onClick={() => {setExpand(false); props.setSelection('download');}}>{InputNumbers}</Button>)
    }

    return (
     <g>
         <path d={`M ${props.x} ${props.y - 10} A 10 10 180 0 1 ${props.x} ${props.y + 10} h -${width} A 10 10 180 0 1 ${props.x - width} ${props.y - 10} h ${width}`} style={{
             fill: '#1e90ff'}} />
          {symbols.map((s,i) => <CircleButton key={i} x={props.x - i*25} y={props.y} active={props.currentSelection === symbolNames[i]} button={s} />)}

          {React.Children.map(props.children, (element, i) => {
                                    if (!React.isValidElement(element))
                                        return null;
                                    if ((element as React.ReactElement<any>).type === Button)
                                        return <CircleButton active={false} x={props.x - (i+symbols.length)*25} y={props.y} button={element} />;
                                    return null;
                                })}

         <path d={`M ${props.x} ${props.y - 10} A 10 10 180 0 1 ${props.x} ${props.y + 10} h -${width} A 10 10 180 0 1 ${props.x - width} ${props.y - 10} h ${width}`} stroke={'black'} />
     </g>)

}

function CircleButton(props: {button: React.ReactElement, x: number, y: number, active: boolean}) {
  return ( <>
    <circle r={10} cx={props.x} cy={props.y} style={{ fill: (props.active ? '#002eff' : '#1e90ff'), pointerEvents: 'all' }}
     onMouseDown={(evt) => evt.stopPropagation()}
     onClick={(evt) => { evt.stopPropagation(); props.button.props.onClick()}} onMouseUp={(evt) => evt.stopPropagation()}/>
    <text fill={'black'} style={{ fontSize: '1em', textAnchor: 'middle', dominantBaseline: 'middle' }} x={props.x} y={props.y}>
    {props.button}
    </text>
  </>)
}

export default InteractiveButtons;
