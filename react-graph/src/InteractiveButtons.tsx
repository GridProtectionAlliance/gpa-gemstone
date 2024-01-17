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
import {MagnifyingGlass, House, Pan, InputNumbers, Point, Scroll} from '@gpa-gemstone/gpa-symbols'
import Button from './Button'

interface IProps {
    showZoom: boolean,
    showPan: boolean,
    showReset: boolean,
    showSelect: boolean,
    showDownload: boolean,
    showCapture: boolean,
    currentSelection: 'zoom'|'pan'|'select',
    setSelection: (selection: ButtonType) => void,
    x: number,
    y: number,
    openTowardsRight: boolean,
    holdOpen?: boolean
}

type ButtonType = ('zoom' | 'pan' | 'reset' | 'select' | 'download' | 'capture');
type Cleanup = ((() => void) | void);

const InteractiveButtons: React.FunctionComponent<IProps> = (props) => {
    const btnCleanup = React.useRef<Cleanup>(undefined);
    const [selectIcon, setSelectIcon] = React.useState<React.ReactElement>(<>{Point}</>);
    const [expand, setExpand] = React.useState<boolean>(props.holdOpen ?? false);
    const [currentSelect, setCurrentSelect] = React.useState<string>('regular');

    const nButtons = React.useMemo(() =>
      (props.holdOpen? 1 : 0) + 
      (props.showZoom? 1 : 0) + 
      (props.showPan? 1 : 0) + 
      (props.showReset? 1 : 0) + 
      (props.showSelect? 1 : 0) + 
      (props.showDownload? 1 : 0) + 
      (props.showCapture? 1 : 0) + 
      ((props.children == null) ? 0 : React.Children.count(props.children))
      , [props.holdOpen, props.showZoom, props.showPan, props.showReset, props.showSelect, props.showDownload, props.showCapture, props.children]);

    const direction = React.useMemo<number>(() => {return props.openTowardsRight ? 1 : -1}, [props.openTowardsRight]);

    const setBtnAndSelect = React.useCallback((newIcon: React.ReactElement, id?: string) => {
      setSelectIcon(newIcon);
      setCurrentSelect(id ?? 'regular');
      props.setSelection('select');
      collaspeMenu(); 
    }, [props.setSelection, setSelectIcon, setExpand]);

    const openTray = React.useCallback((evt: React.MouseEvent) => {
      evt.stopPropagation();
      setExpand(true);
    }, [setExpand]);

    const collaspeMenu = React.useCallback(() => {
      if (!(props.holdOpen ?? false))
        setExpand(false);
    }, [setExpand, props.holdOpen])

    const displayIcon = React.useCallback(()=>{
      switch(props.currentSelection){
        default:
        case 'pan': return Pan;
        case 'zoom': return MagnifyingGlass;
        case 'select': return selectIcon;
      } 
    },[selectIcon, props.currentSelection]);

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
            {displayIcon()}
          </text>
        </g>)

    const width = 25*nButtons - 25;
    const symbols = [] as React.ReactElement[];
    const symbolNames = [] as ButtonType[];
    if (props.holdOpen ?? false) {
      symbolNames.push('collaspe' as ButtonType);
      symbols.push(<Button onClick={() => setExpand(false)}>{(props.openTowardsRight ?? false) ? "<" : ">"}</Button>)
    }
    if (props.showZoom) {
      symbolNames.push('zoom' as ButtonType);
      symbols.push(<Button onClick={() => {props.setSelection('zoom'); collaspeMenu(); }}>{MagnifyingGlass}</Button>)
    }
    if (props.showPan) {
      symbolNames.push('pan' as ButtonType);
      symbols.push(<Button onClick={() => {props.setSelection('pan'); collaspeMenu(); }}>{Pan}</Button>)
    }
    if (props.showSelect) {
        symbolNames.push('select' as ButtonType);
        symbols.push(<Button isSelect={true} onClick={() => {props.setSelection('select'); setCurrentSelect('regular'); collaspeMenu(); }}>{Point}</Button>)
    }
    if (props.showReset) {
      symbolNames.push('reset' as ButtonType);
      symbols.push(<Button onClick={() => {collaspeMenu(); props.setSelection('reset'); }}>{House}</Button>)
    }
    if (props.showDownload) {
      symbolNames.push('download' as ButtonType);
      symbols.push(<Button onClick={() => {collaspeMenu(); props.setSelection('download');}}>{InputNumbers}</Button>)
    }
    if (props.showCapture) {
      symbolNames.push('capture' as ButtonType);
      symbols.push(<Button onClick={() => {collaspeMenu(); props.setSelection('capture');}}>{Scroll}</Button>)
    }

    return (
     <g>
         <path d={`M ${props.x} ${props.y + 10 * direction} A 10 10 180 0 1 ${props.x} ${props.y - 10 * direction} h ${width * direction} A 10 10 180 0 1 ${props.x + width * direction} ${props.y + 10 * direction} h ${-width * direction}`} style={{
             fill: '#1e90ff'}} />
          {symbols.map((s,i) => <CircleButton key={i} x={props.x + i*25*direction} 
            y={props.y} active={props.currentSelection === symbolNames[i] && (props.currentSelection !== 'select' || currentSelect === 'regular')} button={s}
            btnCleanup={btnCleanup} setSelectIcon={setSelectIcon}
          />)}

          {React.Children.map(props.children, (element, i) => {
                                    if (!React.isValidElement(element))
                                        return null;
                                    if ((element as React.ReactElement<any>).type === Button) {
                                        const id = `custom_${i}`;
                                        return <CircleButton key={id} active={props.currentSelection === 'select' && currentSelect === id}
                                          x={props.x + (i+symbols.length)*25*direction} y={props.y}
                                          button={element} setSelectIcon={setBtnAndSelect} selectName={id}
                                          btnCleanup={btnCleanup} />
                                        }
                                    return null;
                                })}

         <path d={`M ${props.x} ${props.y + 10 * direction} A 10 10 180 0 1 ${props.x} ${props.y - 10 * direction} h ${width * direction} A 10 10 180 0 1 ${props.x + width * direction} ${props.y + 10 * direction} h ${-width * direction}`} stroke={'black'} />
     </g>)

}

function CircleButton(props: {button: React.ReactElement, x: number, y: number, active: boolean, btnCleanup: React.MutableRefObject<Cleanup>, selectName?: string, setSelectIcon?: (children: React.ReactElement, id?: string) => void}) {
  return ( <>
    <circle r={10} cx={props.x} cy={props.y} style={{ fill: (props.active ? '#002eff' : '#1e90ff'), pointerEvents: 'all' }}
     onMouseDown={(evt) => evt.stopPropagation()}
     onClick={(evt) => { 
      evt.stopPropagation();
      if ((props.setSelectIcon !== undefined) && (props.button.props.isSelect ?? false)) props.setSelectIcon(props.button.props.children, props.selectName);
      if (props.btnCleanup.current !== undefined) props.btnCleanup.current();
      props.btnCleanup.current = props.button.props.onClick();
      }} onMouseUp={(evt) => evt.stopPropagation()}/>
    <text fill={'black'} style={{ fontSize: '1em', textAnchor: 'middle', dominantBaseline: 'middle' }} x={props.x} y={props.y}>
    {props.button}
    </text>
  </>)
}

export default InteractiveButtons;
