// ******************************************************************************************************
//  ToolTip.tsx - Gbtc
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
//  01/14/2021 - Christoph Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import styled from "styled-components";
import { GetNodeSize } from '@gpa-gemstone/helper-functions';
import { Portal } from 'react-portal';
import { isEqual } from 'lodash';
import { Gemstone } from '@gpa-gemstone/application-typings';

interface IProps {
  Show: boolean,
  Position?: Position,
  Target?: string,
  Zindex?: number,
  Class?: 'primary' | 'secondary' | 'success' | 'danger' | 'info'
}

// Props to style wrapper div around tooltip content.
interface IPopoverProps {
  Show: boolean,
  Top: number,
  Left: number,
  Zindex: number,
  BgColor: string,
  Color: string
}

// The styled tooltip wrapper component.
const PopoverDiv = styled.div<IPopoverProps>`
  & {
    display: inline-block;
    font-size: 13px;
    position: fixed;
    pointer-events: ${props => props.Show ? 'auto' : 'none'};
    transition: opacity 0.3s ease-out;
    z-index: ${props => props.Zindex};
    opacity: ${props => props.Show ? "0.9" : "0"};
    top: ${props => `${props.Top}px`};
    left: ${props => `${props.Left}px`};
    max-width: 100%;
    background-color: ${props => props.BgColor};
    color: ${props => props.Color};
    border: ${props => `1px solid ${props.Color}`};
    padding: 0.1em;
  }
`;

type Position = 'top' | 'bottom' | 'left' | 'right';

interface IArrowProps {
  BackgroundColor: string,
  Color: string
  Position: Position,
  ArrowPositionPercent: number
}

//Arrow needs to be a styled div as the arrow class has pseduo elements
const Arrow = styled.div<IArrowProps>`
  &.arrow {
    ${props => (props.Position === 'left' || props.Position === 'right')
    ? `top: calc(${props.ArrowPositionPercent}% - 1em);`
    : `left: calc(${props.ArrowPositionPercent}% - 1em);`
  }
    &::after {
      content: '';
      position: absolute;
      ${props => props.Position === 'top' && `border-top-color: ${props.BackgroundColor};`}
      ${props => props.Position === 'bottom' && `border-bottom-color:  ${props.BackgroundColor};`}
      ${props => props.Position === 'left' && `border-left-color: ${props.BackgroundColor};`}
      ${props => props.Position === 'right' && `border-right-color: ${props.BackgroundColor};`}
    }
  }
`;

const defaultTargetPosition = { Top: -999, Left: -999, Width: 0, Height: 0 }

// The other element needs to have data-tooltip attribute equal the target prop used for positioning
export const Tooltip = (props: React.PropsWithChildren<IProps>) => {
  const targetPosition = props.Position ?? 'top';

  const toolTip = React.useRef<HTMLDivElement | null>(null);

  const [isTooltipHovered, setIsTooltipHovered] = React.useState(false);

  const [activePosition, setActivePosition] = React.useState<'top' | 'bottom' | 'left' | 'right'>(targetPosition);

  const [top, setTop] = React.useState<number>(0);
  const [left, setLeft] = React.useState<number>(0);

  const [arrowPositionPercent, setArrowPositionPercent] = React.useState<number>(50);
  const [targetElementPosition, setTargetElementPosition] = React.useState<Gemstone.TSX.Interfaces.IElementPosition>(defaultTargetPosition)

  const alertRef = React.useRef<HTMLDivElement | null>(null);

  const [backgroundColor, setBackgroundColor] = React.useState<string>('green');
  const [color, setColor] = React.useState<string>('red');

  const alarmClass = React.useMemo(() => props.Class != null ? `alert-${props.Class} d-none` : 'popover d-none', [props.Class])

  const closeTimer = React.useRef<number>();
  const [delayedShow, setDelayedShow] = React.useState(props.Show);
  const shouldShow = delayedShow || isTooltipHovered;

  //Effect to handle mouse hover state
  React.useEffect(() => {
    if (toolTip.current == null) return;
    const tootipDiv = toolTip.current;

    function onMouseMoveInside() {
      clearTimeout(closeTimer.current);
      setIsTooltipHovered(true);
    }

    function onMouseLeave() {
      setIsTooltipHovered(false);
    }

    tootipDiv.addEventListener('mousemove', onMouseMoveInside);
    tootipDiv.addEventListener('mouseleave', onMouseLeave);

    return () => {
      tootipDiv.removeEventListener('mousemove', onMouseMoveInside);
      tootipDiv.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [props.Show]);

  // Effect to handle delayed hiding of tooltip to allow for hover logic
  React.useEffect(() => {
    if (props.Show) {
      clearTimeout(closeTimer.current);
      setDelayedShow(true);
    } else if (!isTooltipHovered) {
      //delay closing by a quarter of a second to allow for hover
      closeTimer.current = window.setTimeout(() => setDelayedShow(false), 250);
    }
  }, [props.Show, isTooltipHovered]);

  React.useLayoutEffect(() => {
    if (alertRef.current == null) return;

    const style = getComputedStyle(alertRef.current);
    setBackgroundColor(style.backgroundColor);
    setColor(style.color);
  });

  React.useEffect(() => {
    const target = document.querySelectorAll(`[data-tooltip${props.Target === undefined ? '' : `="${props.Target}"`}]`)
    if (target.length === 0) {
      setTargetElementPosition(defaultTargetPosition)
      return;
    }

    const targetLocation = GetNodeSize(target[0] as HTMLElement);
    const newPosition = { Height: targetLocation.height, Top: targetLocation.top, Left: targetLocation.left, Width: targetLocation.width }
    if (!isEqual(newPosition, targetElementPosition))
      setTargetElementPosition(newPosition)
  }, [shouldShow, props.Target, targetElementPosition]);

  React.useLayoutEffect(() => {
    const [t, l, arrowLeft, actPosition] = getPosition(toolTip, targetElementPosition, targetPosition);
    setTop(t);
    setLeft(l);
    setArrowPositionPercent(arrowLeft);
    setActivePosition(actPosition as Position);
  }, [targetElementPosition, props?.children, targetPosition]);

  const zIndex = (props.Zindex === undefined ? 9999 : props.Zindex);

  return (
    <>
      <div className={alarmClass} ref={alertRef} />
      <Portal>
        <PopoverDiv
          className={`popover bs-popover-${activePosition}`}
          Show={shouldShow}
          Top={top}
          Left={left}
          ref={toolTip}
          Zindex={zIndex}
          BgColor={backgroundColor}
          Color={color}
        >
          <Arrow
            className='arrow'
            Position={activePosition}
            ArrowPositionPercent={arrowPositionPercent}
            BackgroundColor={backgroundColor}
            Color={color}
          />
          <div className='popover-body' style={{ backgroundColor, color }}>
            {props.children}
          </div>
        </PopoverDiv>
      </Portal>
    </>
  )
}

//Helper function
const getPosition = (toolTip: React.MutableRefObject<HTMLDivElement | null>, targetPosition: Gemstone.TSX.Interfaces.IElementPosition, position: ('top' | 'bottom' | 'left' | 'right')) => {
  if (toolTip.current === null)
    return [-999, -999];

  const tipLocation = GetNodeSize(toolTip.current);
  const offset = 5;
  let top = 0;
  let left = 0;

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  let effectivePosition = position;

  if (position === 'left') {
    top = targetPosition.Top + 0.5 * targetPosition.Height - 0.5 * tipLocation.height;
    left = targetPosition.Left - tipLocation.width - offset;
  }
  else if (position === 'right') {
    top = targetPosition.Top + 0.5 * targetPosition.Height - 0.5 * tipLocation.height
    left = targetPosition.Left + targetPosition.Width + offset;
  }
  else if (position === 'top' || position === undefined) {
    // if not enough room above, flip to bottom
    if (targetPosition.Top >= tipLocation.height + offset) {
      effectivePosition = 'top';
      top = targetPosition.Top - tipLocation.height - offset;
    } else {
      effectivePosition = 'bottom';
      top = targetPosition.Top + targetPosition.Height + offset;
    }
    left = targetPosition.Left + 0.5 * targetPosition.Width - 0.5 * tipLocation.width;

    // If tooltip goes beyond right viewport boundary adjust left position to fit
    if (left + tipLocation.width > windowWidth)
      left = windowWidth - tipLocation.width - offset;

    // If tooltip goes beyond left viewport boundary adjust left position to fit
    if (left < 0)
      left = offset;
  }
  else if (position === 'bottom') {
    if (windowHeight - (targetPosition.Top + targetPosition.Height) >= tipLocation.height + offset) {
      effectivePosition = 'bottom';
      top = targetPosition.Top + targetPosition.Height + offset;
    } else {
      effectivePosition = 'top';
      top = targetPosition.Top - tipLocation.height - offset;
    }
    left = targetPosition.Left + 0.5 * targetPosition.Width - 0.5 * tipLocation.width;

    //If tooltip goes beyond right viewport boundary adjust left position to fit
    if (left + tipLocation.width >= windowWidth)
      left = windowWidth - tipLocation.width - offset;

    //If tooltip goes beyond left viewport boundary adjust left position to fit
    if (left <= 0)
      left = offset;
  }

  let arrowPositionPercent = 50; // Default to center

  if (position === 'top' || position === 'bottom') {
    const targetCenter = targetPosition.Left + 0.5 * targetPosition.Width;
    arrowPositionPercent = ((targetCenter - left) / tipLocation.width) * 100;
  } else if (position === 'left' || position === 'right') {
    const targetCenter = targetPosition.Top + 0.5 * targetPosition.Height;
    arrowPositionPercent = ((targetCenter - top) / tipLocation.height) * 100;
  }

  return [top, left, arrowPositionPercent, effectivePosition] as [number, number, number, 'top' | 'bottom' | 'left' | 'right'];
}

export default Tooltip;