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
    showHorizontalZoom: boolean,
    showVerticalZoom: boolean,
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
    /* Callback that sets the neccesarry Width */
    setWidth: (w: number) => void,
    children: React.ReactNode
}

type ButtonType = SelectType | 'reset' | 'download' | 'capture' | 'collaspe' | 'custom';
type Cleanup = ((() => void) | void);
const heightPerButton = 25;

const InteractiveButtons = React.memo((props: IProps) => {
    const btnCleanup = React.useRef<Cleanup>(undefined);
    const [selectIcon, setSelectIcon] = React.useState<React.ReactElement>(<>{Point}</>);
    const [expand, setExpand] = React.useState<boolean>(props.holdOpen ?? false);
    const [currentSelect, setCurrentSelect] = React.useState<(ButtonType|undefined|string)>(undefined);

    const [nButtons, height, width] = React.useMemo(() => {
    let zoomCount = 0;
    if (props.showZoom) {
      zoomCount = 3;
    } else {
      zoomCount += (props.showHorizontalZoom ? 1 : 0);
      zoomCount += (props.showVerticalZoom   ? 1 : 0);
    }

    let nButtons =
      ((props.holdOpen ?? false) ? 1 : 0) +
      zoomCount +
      (props.showPan      ? 1 : 0) +
      (props.showReset    ? 1 : 0) +
      (props.showSelect   ? 1 : 0) +
      (props.showDownload ? 1 : 0) +
      (props.showCapture  ? 1 : 0) +
      ((props.children == null) ? 0 : React.Children.count(props.children));
      const buttonsAllowed = Math.floor((props.heightAvaliable - 20) / heightPerButton);
      const rows =  Math.ceil(nButtons/buttonsAllowed)
      const width = 20 * rows;
      nButtons = Math.min(nButtons, buttonsAllowed);
      return [nButtons, heightPerButton*(nButtons - 1), width];
    }, [props.holdOpen, props.showZoom, props.showPan, props.showReset, props.showSelect, props.showDownload, props.showCapture, props.children]);

    const setBtnAndSelect = React.useCallback((newIcon: React.ReactElement, id: ButtonType|string) => {
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

    React.useEffect(() => { if (expand) props.setWidth(width); else props.setWidth(20) }, [width, expand])
    
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

    const symbols = [[]] as React.ReactElement[][];
    const symbolNames = [[]] as (ButtonType|string)[][];
    if (props.holdOpen ?? false) {
     
      if (symbols[symbols.length-1].length < nButtons) {
        symbols[symbols.length-1].push(<Button onClick={() => setExpand(false)}>^</Button>)
        symbolNames[symbols.length-1].push('collaspe' as ButtonType);
      }
      else {
        symbols.push([<Button onClick={() => setExpand(false)}>^</Button>])
        symbolNames.push(['collaspe' as ButtonType]);
      }
    }
    if (props.showZoom) {
      // If showZoom is true, render all three zoom modes:
      if (symbols[symbols.length - 1].length < nButtons) {
        symbolNames[symbolNames.length - 1].push('zoom-rectangular');
        symbols[symbols.length - 1].push(
          <Button onClick={() => { props.setSelection('zoom-rectangular'); collaspeMenu(); }}>
            {MagnifyingGlass}
          </Button>
        );
      } else {
        symbolNames.push(['zoom-rectangular']);
        symbols.push([
          <Button onClick={() => { props.setSelection('zoom-rectangular'); collaspeMenu(); }}>
            {MagnifyingGlass}
          </Button>
        ]);
      }
    
      if (symbols[symbols.length - 1].length < nButtons) {
        symbolNames[symbolNames.length - 1].push('zoom-vertical');
        symbols[symbols.length - 1].push(
          <Button onClick={() => { props.setSelection('zoom-vertical'); collaspeMenu(); }}>
            {'\u2016'}
          </Button>
        );
      } else {
        symbolNames.push(['zoom-vertical']);
        symbols.push([
          <Button onClick={() => { props.setSelection('zoom-vertical'); collaspeMenu(); }}>
            {'\u2016'}
          </Button>
        ]);
      }
    
      if (symbols[symbols.length - 1].length < nButtons) {
        symbolNames[symbolNames.length - 1].push('zoom-horizontal');
        symbols[symbols.length - 1].push(
          <Button onClick={() => { props.setSelection('zoom-horizontal'); collaspeMenu(); }}>
            {'\u2550'}
          </Button>
        );
      } else {
        symbolNames.push(['zoom-horizontal']);
        symbols.push([
          <Button onClick={() => { props.setSelection('zoom-horizontal'); collaspeMenu(); }}>
            {'\u2550'}
          </Button>
        ]);
      }
    }
    else {
      // If showZoom is false, only render vertical or horizontal as requested
      if (props.showVerticalZoom) {
        if (symbols[symbols.length - 1].length < nButtons) {
          symbolNames[symbolNames.length - 1].push('zoom-vertical');
          symbols[symbols.length - 1].push(
            <Button onClick={() => { props.setSelection('zoom-vertical'); collaspeMenu(); }}>
              {'\u2016'}
            </Button>
          );
        } else {
          symbolNames.push(['zoom-vertical']);
          symbols.push([
            <Button onClick={() => { props.setSelection('zoom-vertical'); collaspeMenu(); }}>
              {'\u2016'}
            </Button>
          ]);
        }
      }
    
      if (props.showHorizontalZoom) {
        if (symbols[symbols.length - 1].length < nButtons) {
          symbolNames[symbolNames.length - 1].push('zoom-horizontal');
          symbols[symbols.length - 1].push(
            <Button onClick={() => { props.setSelection('zoom-horizontal'); collaspeMenu(); }}>
              {'\u2550'}
            </Button>
          );
        } else {
          symbolNames.push(['zoom-horizontal']);
          symbols.push([
            <Button onClick={() => { props.setSelection('zoom-horizontal'); collaspeMenu(); }}>
              {'\u2550'}
            </Button>
          ]);
        }
      }
    }
    if (props.showPan && symbols[symbols.length-1].length < nButtons) {
      symbolNames[symbols.length-1].push('pan');
      symbols[symbols.length-1].push(<Button onClick={() => {props.setSelection('pan'); collaspeMenu(); }}>{Pan}</Button>)
    } else if (props.showPan) {
      symbolNames.push(['pan']);
      symbols.push([<Button onClick={() => {props.setSelection('pan'); collaspeMenu(); }}>{Pan}</Button>])
    }
    if (props.showSelect && symbols[symbols.length-1].length < nButtons) {
      symbolNames[symbols.length-1].push('select');
      symbols[symbols.length-1].push(<Button isSelect={true} onClick={() => { setBtnAndSelect(<>{Point}</>, 'select'); }}>{Point}</Button>)
    } else if (props.showSelect) {
      symbolNames.push(['select']);
      symbols.push([<Button isSelect={true} onClick={() => { setBtnAndSelect(<>{Point}</>, 'select'); }}>{Point}</Button>])
    }
    if (props.showReset && symbols[symbols.length-1].length < nButtons) {
      symbolNames[symbols.length-1].push('reset');
      symbols[symbols.length-1].push(<Button onClick={() => {collaspeMenu(); props.setSelection('reset'); }}>{House}</Button>)
    } else if (props.showReset) {
      symbolNames.push(['reset']);
      symbols.push([<Button onClick={() => {collaspeMenu(); props.setSelection('reset'); }}>{House}</Button>])
    }
    if (props.showDownload && symbols[symbols.length-1].length < nButtons) {
      symbolNames[symbols.length-1].push('download');
      symbols[symbols.length-1].push(<Button onClick={() => {collaspeMenu(); props.setSelection('download');}}>{InputNumbers}</Button>)
    } else if (props.showDownload) {
      symbolNames.push(['download']);
      symbols.push([<Button onClick={() => {collaspeMenu(); props.setSelection('download');}}>{InputNumbers}</Button>])
    }
    if (props.showCapture && symbols[symbols.length-1].length < nButtons) {
      symbolNames[symbols.length-1].push('capture');
      symbols[symbols.length-1].push(<Button onClick={() => {collaspeMenu(); props.setSelection('capture');}}>{Scroll}</Button>)
    } else if (props.showCapture) {
      symbolNames.push(['capture']);
      symbols.push([<Button onClick={() => {collaspeMenu(); props.setSelection('capture');}}>{Scroll}</Button>])
    }

    const customButtonsIndex = symbols.length -1;
    React.Children.forEach(props.children, (element,index) => {
      if (symbols[symbols.length-1].length < nButtons && React.isValidElement(element) && (element as React.ReactElement<any>).type === Button) {
        symbols[symbols.length-1].push(element as React.ReactElement);
        symbolNames[symbols.length-1].push('custom-' + index);
      } else if (React.isValidElement(element) && (element as React.ReactElement<any>).type === Button) {
        symbols.push([element as React.ReactElement]);
        symbolNames.push(['custom-' + index]);
      }
    })

    const path = `M ${props.x-10} ${props.y} A 10 10 90 0 1 ${props.x} ${props.y-10} h ${width - 20} A 10 10 90 0 1 ${props.x+width - 10} ${props.y} v ${height} A 10 10 90 0 1 ${props.x + width - 20} ${props.y + height + 10} h ${-width+20} A 10 10 90 0 1 ${props.x-10} ${props.y+height} v ${-height}`
    return (
     <g style={{ cursor: 'default' }} data-html2canvas-ignore="true">
         <path d={path} style={{
             fill: '#1e90ff' }} />
          {symbols.map((r,j) => <> {r.map((s,i) => 
            <CircleButton key={i} selectId={symbolNames[j][i]}
              x={props.x + j*20} y={props.y + i*heightPerButton}
              active={i < customButtonsIndex ? (props.currentSelection === symbolNames[j][i] && (props.currentSelection !== 'select' || currentSelect === undefined)) :
              props.currentSelection === 'select' && currentSelect === symbolNames[j][i]}
              button={s} btnCleanup={btnCleanup} setSelectIcon={!symbolNames[j][i].startsWith('custom') ? undefined : setBtnAndSelect}
            />)}</>)}

         <path d={path} stroke={'black'} />
     </g>)

});

interface ICircleProps {
  button: React.ReactElement, 
  x: number,
  y: number, 
  active: boolean, 
  btnCleanup: React.MutableRefObject<Cleanup>, 
  selectId: ButtonType|string,
  setSelectIcon?: (children: React.ReactElement, id: ButtonType|string) => void
}

function CircleButton(props: ICircleProps) {
  return ( <>
    <circle r={10} cx={props.x} cy={props.y} style={{ fill: (props.active ? '#002eff' : '#1e90ff'), pointerEvents: 'all' }}
     onMouseDown={(evt) => evt.stopPropagation()}
     onClick={(evt) => { 
      evt.stopPropagation();
      if ((props.setSelectIcon !== undefined) && (props.button.props.isSelect as boolean ?? false)) props.setSelectIcon(props.button.props.children, props.selectId);
      if (props.btnCleanup.current !== undefined) props.btnCleanup.current();
      props.btnCleanup.current = props.button.props.onClick();
      }} onMouseUp={(evt) => evt.stopPropagation()}/>
    <text fill={'black'} style={{ fontSize: '1em', textAnchor: 'middle', dominantBaseline: 'middle' }} x={props.x} y={props.y}>
    {props.button}
    </text>
  </>)
}

export default InteractiveButtons;
