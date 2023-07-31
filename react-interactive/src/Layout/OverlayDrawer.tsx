// ******************************************************************************************************
//   OverlayDrawer.tsx - Gbtc
//
//  Copyright © 2023, Grid Protection Alliance.  All Rights Reserved.
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
//  12/25/2022 - Christoph Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import { GetNodeSize} from '@gpa-gemstone/helper-functions';
import styled from 'styled-components';

interface IProps {
    Title: string
    Open: boolean,
    Location: 'left'|'right'|'top'|'bottom',
    GetOverride?: (func: (open: boolean) => void) => void,
    OnChange?: (open: boolean) => void,
    Target: string,
    HideHandle?: boolean
}

interface IClosedOverlayProps {
    Location: 'left'|'right'|'top'|'bottom',
    Left: number,
    Top: number,
    Width: number,
    Height: number,
}
/* top-left | top-right | bottom-right | bottom-left */
const ClosedOverlayDiv = styled.div<IClosedOverlayProps>`
  & {
    border-radius: ${props => props.Location === 'bottom' || props.Location === 'right'? 4 : 0}px
    ${props => props.Location === 'bottom' || props.Location === 'left'? 4 : 0}px
    ${props => props.Location === 'top' || props.Location === 'left'? 4 : 0}px
    ${props => props.Location === 'top' || props.Location === 'right'? 4 : 0}px;
    display: inline-block;
    font-size: 13px;
    position: fixed;
    z-index: 999;
    color: #fff;
    background: rgba(34, 2, 0, 0.6);
    top: ${props => props.Location === 'top' ? Math.floor(props.Top) : Math.ceil(props.Top)}px;
    left: ${props => props.Location === 'left' ? Math.floor(props.Left) : Math.floor(props.Left)}px;
    height: ${props => props.Location === 'bottom' ? Math.ceil(props.Height) : Math.floor(props.Height)}px;
    width: ${props => props.Location === 'right' ? Math.ceil(props.Width) : Math.floor(props.Width)}px;
    writing-Mode: ${props => props.Location === 'bottom' || props.Location === 'top' ? 'horizontal-tb' : 'vertical-rl' };
    text-Orientation: upright;
    cursor: pointer;
    vertical-align: middle;
    text-align: center;
  }`

  interface IOpenOverlayProps {
    Location: 'left'|'right'|'top'|'bottom',
    Left: number,
    Top: number,
    Open: boolean,

}

  const OpenOverlayDiv = styled.div<IOpenOverlayProps>`
  & {
    display: inline-block;
    position: fixed;
    transition: opacity 0.3s ease-out;
    z-index: 999;
    color: #fff;
    background: rgba(34, 2, 0, 0.8);
    top: ${props => `${props.Top}px`};
    left: ${props => `${props.Left}px`};
    padding-left: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 10px;
    opacity: ${props => props.Open? '1.0' : '0'};
    ${props => !props.Open? 'pointer-events: none;' : ''}
  }`

// Props Description:
// Title: the string displayed when the drawer is closed but hovered over
// Open: indicates the initial state of the drawer
// Location: location of the drawer in the component refferenced
// Target: The data-drawer property of the target containing the drawer 
// GetOverride: This will be called with a callback to set the Drawer to open or closed form the parent
// OnChange: Callback when the Drawer changes 
const OverlayDrawer: React.FunctionComponent<React.PropsWithChildren<IProps>> = (props) => {
    const divRef = React.useRef<any>(null);
 
    const [top, setTop] = React.useState<number>(0);
    const [left, setLeft] = React.useState<number>(0);
    const [width, setWidth] = React.useState<number>(0);
    const [height, setHeight] = React.useState<number>(0);

    const [open, setOpen] = React.useState<boolean>(props.Open);    
    const [containerWidth, setContainerWidth] = React.useState<number>(0);
    const [containerHeight, setContainerHeight] = React.useState<number>(0);

    const [containerTop, setContainerTop] = React.useState<number>(0);
    const [containerLeft, setContainerLeft] = React.useState<number>(0);

    const [targetLeft, setTargetLeft] = React.useState<number>(0);
    const [targetTop, setTargetTop] = React.useState<number>(0);
    const [targetWidth, setTargetWidth] = React.useState<number>(0);
    const [targetHeight, setTargetHeight] = React.useState<number>(0);

    const [x,setX] = React.useState<boolean>(false);

    React.useEffect(() => {
        const target = document.querySelectorAll(`[data-drawer${ props.Target === undefined? '' : `="${props.Target}"`}]`);
    
        if (target.length === 0) {
          setTargetHeight(0);
          setTargetWidth(0);
          setTargetLeft(-999);
          setTargetTop(-999);
        }
        else {
          const targetLocation = GetNodeSize(target[0] as HTMLElement);
          setTargetHeight(targetLocation.height);
          setTargetWidth(targetLocation.width);
          setTargetLeft(targetLocation.left);
          setTargetTop(targetLocation.top);
        }
    
        const h = setTimeout(() => {
          setX((a) => !a)
        }, 500);
    
        return () => { if (h !== null) clearTimeout(h); };
    
      }, [x])

    React.useEffect(() => {
        const size = UpdatePosition();
        
        if (size == null) {
            setTop(0);
            setLeft(0);
            setWidth(0);
            setHeight(0);
            return;
        }

        setTop(size[1]);
        setLeft(size[0]);
        setWidth(size[2]);
        setHeight(size[3]);    
    }, [props.Location,targetHeight,targetWidth,targetLeft,targetTop])

    React.useEffect(() => { 
        if (props.GetOverride !== undefined)
            props.GetOverride(changeStatus);
    }, [props.GetOverride])

    React.useLayoutEffect(() => {
        setContainerWidth(divRef.current?.offsetWidth ?? width);
        setContainerHeight(divRef.current?.offsetHeight ?? height)
    })

    React.useEffect(() => {
        let l = 0;

        if (props.Location === 'bottom' || props.Location === 'top') 
            l = left + 0.5*width - 0.5*containerWidth;
        if (props.Location === 'right') 
           l = left + width - containerWidth;
        if (props.Location === 'left') 
           l = left;
        setContainerLeft(l);
    },[props.Location,left,containerWidth, width])

    React.useEffect(() => {
        let t = 0;

        if (props.Location === 'right' || props.Location === 'left') 
            t = top + 0.5*height - 0.5*containerHeight;
        if (props.Location === 'top') 
           t = top;
        if (props.Location === 'bottom') 
           t = top + height - containerHeight;
        setContainerTop(t);
    },[props.Location,top,containerHeight, height])

    function changeStatus(o: boolean) {
        setOpen(o);
    }

    function UpdatePosition(): [number,number,number,number]|null {

        let w = 0
        let h = 0
        let l = 0
        let t = 0

        if (props.Location === 'bottom' || props.Location === 'top') {
            w = targetWidth
            h = 15;
        }
        if (props.Location === 'left' || props.Location === 'right') {
            h = targetHeight
            w = 15;
        }

        if (props.Location === 'bottom' || props.Location === 'left' || props.Location === 'top') 
            l = targetLeft
        if (props.Location === 'right') 
           l = targetLeft + targetWidth - w;
        

        if (props.Location === 'right' || props.Location === 'left' || props.Location === 'top') 
            t = targetTop
        if (props.Location === 'bottom') 
           t = targetTop + targetHeight - h;
        

        return [l,t,w,h]
    }

return <>
        {!(props.HideHandle === undefined? false : props.HideHandle)? (!open? <ClosedOverlayDiv onClick={() => { 
            setOpen(true);
                if (props.OnChange !== undefined)
                    props.OnChange(true);
        }} Location={props.Location} Height={height} Left={left} Top={top} Width={width}>{props.Title}</ClosedOverlayDiv>: 
        <ClosedOverlayDiv onClick={() => { 
            setOpen(false);
                if (props.OnChange !== undefined)
                    props.OnChange(false);
        }} Location={props.Location}
         Height={(props.Location === 'top' || props.Location === 'bottom'? height : containerHeight)}
         Left={(props.Location === 'top' || props.Location === 'bottom'? containerLeft : containerLeft + (props.Location === 'left'? containerWidth : -(width)))}
         Top={(props.Location === 'left' || props.Location === 'right'? containerTop : containerTop + (props.Location === 'top'? containerHeight : -(height)))}
         Width={(props.Location === 'left' || props.Location === 'right'? width : containerWidth)}
          >{props.Title}</ClosedOverlayDiv>) : null}

        <OpenOverlayDiv Location={props.Location} Left={containerLeft} Top={containerTop} Open={open} ref={divRef} style={{minHeight: height, minWidth: width}}>{props.children}</OpenOverlayDiv>

    </>
}

export default OverlayDrawer;
