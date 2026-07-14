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
import { GetNodeSize, useGetContainerPosition } from '@gpa-gemstone/helper-functions';
import styled from 'styled-components';

interface IProps {
    /**
     * Text displayed on the closed drawer handle.
     */
    Title: string
    /**
     * Initial open state of the drawer.
     */
    Open: boolean,
    /**
     * Edge of the target element where the drawer is positioned.
     */
    Location: 'left' | 'right' | 'top' | 'bottom',
    /**
     * Optional callback that exposes a function for opening or closing the drawer from its parent.
     * @param func - Function the parent can call with the desired open state.
     */
    GetOverride?: (func: (open: boolean) => void) => void,
    /**
     * Optional callback fired when the drawer's open state changes.
     * @param open - Whether the drawer is now open.
     */
    OnChange?: (open: boolean) => void,
    /**
     * Value of the target element's `data-drawer` attribute.
     */
    Target: string,
    /**
     * Optional flag that hides the closed drawer handle, defaulting to false.
     */
    HideHandle?: boolean
}

interface IClosedOverlayProps {
    /**
     * Edge that controls the handle's orientation and corner rounding.
     */
    Location: 'left' | 'right' | 'top' | 'bottom',
    /**
     * Horizontal viewport position in pixels.
     */
    Left: number,
    /**
     * Vertical viewport position in pixels.
     */
    Top: number,
    /**
     * Handle width in pixels.
     */
    Width: number,
    /**
     * Handle height in pixels.
     */
    Height: number,
}
/* top-left | top-right | bottom-right | bottom-left */
/**
 * Positions and styles the interactive handle shown while the overlay drawer is closed.
 * @param props - Supplies the target edge, viewport position, and handle dimensions.
 * @returns The styled closed-drawer handle.
 */
const ClosedOverlayDiv = styled.div<IClosedOverlayProps>`
  & {
    border-radius: ${props => props.Location === 'bottom' || props.Location === 'right' ? 4 : 0}px
    ${props => props.Location === 'bottom' || props.Location === 'left' ? 4 : 0}px
    ${props => props.Location === 'top' || props.Location === 'left' ? 4 : 0}px
    ${props => props.Location === 'top' || props.Location === 'right' ? 4 : 0}px;
    display: inline-block;
    font-size: 13px;
    position: fixed;
    z-index: 1050;
    color: #fff;
    background: rgba(34, 2, 0, 0.6);
    top: ${props => props.Location === 'top' ? Math.floor(props.Top) : Math.ceil(props.Top)}px;
    left: ${props => props.Location === 'left' ? Math.floor(props.Left) : Math.floor(props.Left)}px;
    height: ${props => props.Location === 'bottom' ? Math.ceil(props.Height) : Math.floor(props.Height)}px;
    width: ${props => props.Location === 'right' ? Math.ceil(props.Width) : Math.floor(props.Width)}px;
    writing-Mode: ${props => props.Location === 'bottom' || props.Location === 'top' ? 'horizontal-tb' : 'vertical-rl'};
    text-Orientation: upright;
    cursor: pointer;
    vertical-align: middle;
    text-align: center;
  }`

interface IOpenOverlayProps {
    /**
     * Edge associated with the open overlay.
     */
    Location: 'left' | 'right' | 'top' | 'bottom',
    /**
     * Horizontal viewport position in pixels.
     */
    Left: number,
    /**
     * Vertical viewport position in pixels.
     */
    Top: number,
    /**
     * Controls the overlay's opacity and pointer-event state.
     */
    Open: boolean,

}

/**
 * Positions and fades the drawer content over its target element.
 * @param props - Supplies the target edge, viewport position, and open state.
 * @returns The styled open-drawer overlay.
 */
const OpenOverlayDiv = styled.div<IOpenOverlayProps>`
  & {
    display: inline-block;
    position: fixed;
    transition: opacity 0.3s ease-out;
    z-index: 1050;
    color: #fff;
    background: rgba(34, 2, 0, 0.8);
    top: ${props => `${props.Top}px`};
    left: ${props => `${props.Left}px`};
    padding-left: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 10px;
    opacity: ${props => props.Open ? '1.0' : '0'};
    ${props => !props.Open ? 'pointer-events: none;' : ''}
  }`

/**
 * Renders content in an overlay drawer anchored to a matching `data-drawer` target.
 * @param props - Configures the target, edge, initial state, handle, callbacks, and content.
 * @returns The positioned drawer overlay and optional closed handle.
 */
const OverlayDrawer = (props: React.PropsWithChildren<IProps>) => {
    const divRef = React.useRef<any>(null);

    const [top, setTop] = React.useState<number>(0);
    const [left, setLeft] = React.useState<number>(0);
    const [width, setWidth] = React.useState<number>(0);
    const [height, setHeight] = React.useState<number>(0);

    const [open, setOpen] = React.useState<boolean>(props.Open);

    const { height: containerHeight, width: containerWidth } = useGetContainerPosition(divRef);
    const [containerTop, setContainerTop] = React.useState<number>(0);
    const [containerLeft, setContainerLeft] = React.useState<number>(0);

    const [targetLeft, setTargetLeft] = React.useState<number>(0);
    const [targetTop, setTargetTop] = React.useState<number>(0);
    const [targetWidth, setTargetWidth] = React.useState<number>(0);
    const [targetHeight, setTargetHeight] = React.useState<number>(0);

    React.useEffect(() => {
        let targetElement: HTMLElement | null = null;
        const selector = `[data-drawer${props.Target === undefined ? '' : `="${props.Target}"`}]`;

        const updateTargetSize = () => {
            const targets = document.querySelectorAll(selector);
            const target = targets.length === 0 ? null : targets[0] as HTMLElement;

            if (targetElement !== target) {
                if (targetElement != null)
                    resizeObserver?.unobserve(targetElement);

                targetElement = target;

                if (targetElement != null)
                    resizeObserver?.observe(targetElement);
            }

            if (targetElement == null) {
                setTargetHeight(0);
                setTargetWidth(0);
                setTargetLeft(-999);
                setTargetTop(-999);
                return;
            }

            const targetLocation = GetNodeSize(targetElement);
            setTargetHeight(targetLocation.height);
            setTargetWidth(targetLocation.width);
            setTargetLeft(targetLocation.left);
            setTargetTop(targetLocation.top);
        }

        //In older browsers ResizeObserver or MutationObserver might not be defined
        const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateTargetSize);
        const mutationObserver = typeof MutationObserver === 'undefined' ? null : new MutationObserver(updateTargetSize);
        
        updateTargetSize();
        resizeObserver?.observe(document.body);
        mutationObserver?.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-drawer', 'style'], childList: true, subtree: true });
        window.addEventListener('scroll', updateTargetSize, true);

        return () => {
            resizeObserver?.disconnect();
            mutationObserver?.disconnect();
            window.removeEventListener('scroll', updateTargetSize, true);
        };
    }, [props.Target])

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
    }, [props.Location, targetHeight, targetWidth, targetLeft, targetTop])

    React.useEffect(() => {
        if (props.GetOverride !== undefined)
            props.GetOverride(changeStatus);
    }, [props.GetOverride])

    React.useEffect(() => {
        let l = 0;

        if (props.Location === 'bottom' || props.Location === 'top')
            l = left + 0.5 * width - 0.5 * containerWidth;
        if (props.Location === 'right')
            l = left + width - containerWidth;
        if (props.Location === 'left')
            l = left;
        setContainerLeft(l);
    }, [props.Location, left, containerWidth, width])

    React.useEffect(() => {
        let t = 0;

        if (props.Location === 'right' || props.Location === 'left')
            t = top + 0.5 * height - 0.5 * containerHeight;
        if (props.Location === 'top')
            t = top;
        if (props.Location === 'bottom')
            t = top + height - containerHeight;
        setContainerTop(t);
    }, [props.Location, top, containerHeight, height])

    function changeStatus(o: boolean) {
        setOpen(o);
    }

    function UpdatePosition(): [number, number, number, number] | null {

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


        return [l, t, w, h]
    }

    return <>
        {!(props.HideHandle === undefined ? false : props.HideHandle) ? (!open ?
            <ClosedOverlayDiv
                onClick={() => {
                    setOpen(true);
                    if (props.OnChange !== undefined)
                        props.OnChange(true);
                }}
                Location={props.Location}
                Height={height}
                Left={left}
                Top={top}
                Width={width}
            >
                {props.Title}
            </ClosedOverlayDiv> :
            <ClosedOverlayDiv
                onClick={() => {
                    setOpen(false);
                    if (props.OnChange !== undefined)
                        props.OnChange(false);
                }}
                Location={props.Location}
                Height={(props.Location === 'top' || props.Location === 'bottom' ? height : containerHeight)}
                Left={(props.Location === 'top' || props.Location === 'bottom' ? containerLeft : containerLeft + (props.Location === 'left' ? containerWidth : -(width)))}
                Top={(props.Location === 'left' || props.Location === 'right' ? containerTop : containerTop + (props.Location === 'top' ? containerHeight : -(height)))}
                Width={(props.Location === 'left' || props.Location === 'right' ? width : containerWidth)}
            >
                {props.Title}
            </ClosedOverlayDiv>) : null}
        <OpenOverlayDiv
            Location={props.Location}
            Left={containerLeft}
            Top={containerTop}
            Open={open}
            ref={divRef}
            style={{ minHeight: height, minWidth: width }}
        >
            {props.children}
        </OpenOverlayDiv>
    </>
}

export default OverlayDrawer;
