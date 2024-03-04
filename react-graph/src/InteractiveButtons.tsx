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
import {SelectType} from './GraphContext'
import Button from './Button'

interface IProps {
    showZoom: boolean,
    showPan: boolean,
    showReset: boolean,
    showSelect: boolean,
    showDownload: boolean,
    showCapture: boolean,
    currentSelection: SelectType,
    setSelection: (selection: ButtonType) => void,
    x: number,
    y: number,
    holdOpen?: boolean,
    heightAvaliable: number,
    children: React.ReactNode
}

type ButtonType = SelectType | 'reset' | 'download' | 'capture' | 'collaspe' | 'custom';
type Cleanup = ((() => void) | void);
const heightPerButton = 25;

const InteractiveButtons = React.memo((props: IProps) => {
    const btnCleanup = React.useRef<Cleanup>(undefined);
    const [selectIcon, setSelectIcon] = React.useState<React.ReactElement>(<>{Point}</>);
    const [expand, setExpand] = React.useState<boolean>(props.holdOpen ?? false);
    const [currentSelect, setCurrentSelect] = React.useState<number>(-1);

    const [nButtons, height] = React.useMemo(() => {
      let nButtons = (props.holdOpen? 1 : 0) + 
      (props.showZoom? 3 : 0) + 
      (props.showPan? 1 : 0) + 
      (props.showReset? 1 : 0) + 
      (props.showSelect? 1 : 0) + 
      (props.showDownload? 1 : 0) + 
      (props.showCapture? 1 : 0) + 
      ((props.children == null) ? 0 : React.Children.count(props.children));
      const buttonsAllowed = Math.floor((props.heightAvaliable - 20) / heightPerButton);
      nButtons = Math.min(nButtons, buttonsAllowed)
      return [nButtons, heightPerButton*(nButtons - 1)];
    }, [props.holdOpen, props.showZoom, props.showPan, props.showReset, props.showSelect, props.showDownload, props.showCapture, props.children]);

    const setBtnAndSelect = React.useCallback((newIcon: React.ReactElement, id: number) => {
      setSelectIcon(newIcon);
      setCurrentSelect(id);
      props.setSelection('select');
      collaspeMenu(); 
    }, [props.setSelection]);

    const openTray = React.useCallback((evt: React.MouseEvent) => {
      evt.stopPropagation();
      setExpand(true);
    }, [setExpand]);

    const collaspeMenu = React.useCallback(() => {
      if (!(props.holdOpen ?? false))
        setExpand(false);
    }, [props.holdOpen]);

    const displayIcon = React.useMemo(()=>{
      switch(props.currentSelection){
        default:
        case 'pan': return Pan;
        case 'zoom-rectangular': return MagnifyingGlass;
        case 'zoom-vertical': return "\u2016";
        case 'zoom-horizontal': return "\u2550";
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
            {displayIcon}
          </text>
        </g>);

    const symbols = [] as React.ReactElement[];
    const symbolNames = [] as ButtonType[];
    if (props.holdOpen ?? false) {
      symbolNames.push('collaspe' as ButtonType);
      symbols.push(<Button onClick={() => setExpand(false)}>^</Button>)
    }
    if (props.showZoom) {
      if (nButtons > symbols.length) {
        symbolNames.push('zoom-rectangular');
        symbols.push(<Button onClick={() => {props.setSelection('zoom-rectangular'); collaspeMenu(); }}>{MagnifyingGlass}</Button>);
      }
      if (nButtons > symbols.length) {
        symbolNames.push('zoom-vertical');
        symbols.push(<Button onClick={() => {props.setSelection('zoom-vertical'); collaspeMenu(); }}>{"\u2016"}</Button>);
      }
      if (nButtons > symbols.length) {
        symbolNames.push('zoom-horizontal');
        symbols.push(<Button onClick={() => {props.setSelection('zoom-horizontal'); collaspeMenu(); }}>{"\u2550"}</Button>);
      }
    }
    if (props.showPan && nButtons > symbols.length) {
      symbolNames.push('pan');
      symbols.push(<Button onClick={() => {props.setSelection('pan'); collaspeMenu(); }}>{Pan}</Button>)
    }
    if (props.showSelect && nButtons > symbols.length) {
      symbolNames.push('select');
      symbols.push(<Button isSelect={true} onClick={() => { setBtnAndSelect(<>{Point}</>, -1); }}>{Point}</Button>)
    }
    if (props.showReset && nButtons > symbols.length) {
      symbolNames.push('reset');
      symbols.push(<Button onClick={() => {collaspeMenu(); props.setSelection('reset'); }}>{House}</Button>)
    }
    if (props.showDownload && nButtons > symbols.length) {
      symbolNames.push('download');
      symbols.push(<Button onClick={() => {collaspeMenu(); props.setSelection('download');}}>{InputNumbers}</Button>)
    }
    if (props.showCapture && nButtons > symbols.length) {
      symbolNames.push('capture');
      symbols.push(<Button onClick={() => {collaspeMenu(); props.setSelection('capture');}}>{Scroll}</Button>)
    }

    const customButtonsIndex = symbols.length -1;
    React.Children.forEach(props.children, (element) => {
      if (nButtons > symbols.length && React.isValidElement(element) && (element as React.ReactElement<any>).type === Button) {
        symbols.push(element as React.ReactElement);
        symbolNames.push('custom');
      }
    })

    return (
     <g style={{ cursor: 'default' }} data-html2canvas-ignore="true">
         <path d={`M ${props.x-10} ${props.y} A 10 10 180 0 1 ${props.x+10} ${props.y} v ${height} A 10 10 180 0 1 ${props.x-10} ${props.y+height} v ${-height}`} style={{
             fill: '#1e90ff' }} />
          {symbols.map((s,i) => 
            <CircleButton key={i} selectId={i}
              x={props.x} y={props.y + i*heightPerButton}
              active={i < customButtonsIndex ? (props.currentSelection === symbolNames[i] && (props.currentSelection !== 'select' || currentSelect === -1)) :
              props.currentSelection === 'select' && currentSelect === i}
              button={s} btnCleanup={btnCleanup} setSelectIcon={i < customButtonsIndex ? undefined : setBtnAndSelect}
            />)}

         <path d={`M ${props.x-10} ${props.y} A 10 10 180 0 1 ${props.x+10} ${props.y} v ${height} A 10 10 180 0 1 ${props.x-10} ${props.y+height} v ${-height}`} stroke={'black'} />
     </g>)

});

interface ICircleProps {
  button: React.ReactElement, 
  x: number,
  y: number, 
  active: boolean, 
  btnCleanup: React.MutableRefObject<Cleanup>, 
  selectId: number,
  setSelectIcon?: (children: React.ReactElement, id: number) => void
}

function CircleButton(props: ICircleProps) {
  return ( <>
    <circle r={10} cx={props.x} cy={props.y} style={{ fill: (props.active ? '#002eff' : '#1e90ff'), pointerEvents: 'all' }}
     onMouseDown={(evt) => evt.stopPropagation()}
     onClick={(evt) => { 
      evt.stopPropagation();
      if ((props.setSelectIcon !== undefined) && (props.button.props.isSelect ?? false)) props.setSelectIcon(props.button.props.children, props.selectId);
      if (props.btnCleanup.current !== undefined) props.btnCleanup.current();
      props.btnCleanup.current = props.button.props.onClick();
      }} onMouseUp={(evt) => evt.stopPropagation()}/>
    <text fill={'black'} style={{ fontSize: '1em', textAnchor: 'middle', dominantBaseline: 'middle' }} x={props.x} y={props.y}>
    {props.button}
    </text>
  </>)
}

export default InteractiveButtons;
