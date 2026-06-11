//******************************************************************************************************
//  InteractiveButtons.tsx - Gbtc
//
//  Copyright (c) 2026, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA may license this file to you under the MIT License (MIT), the "License"; you may not use this
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
//  02/13/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import { Portal } from 'react-portal';
import { useInteractionContext } from './InteractionContext';
import { useViewportRegistryContext } from '../ViewportContext/ViewportRegistryContext';
import { PortalIds, useLayoutContext, GetPortalID } from '../LayoutContext';
import InteractiveButton, { IInteractiveButtonProps, BUTTON_R, BUTTON_SPACING } from './InteractiveButton';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';

export type ButtonTrayPosition = 'horizontal-left' | 'horizontal-right' | 'vertical-left' | 'vertical-right';

export interface IInteractiveButtonsProps {
    /** Optional flag to control whether the button tray is expanded at all times */
    KeepTrayOpen?: boolean;
    /** Where to place the button tray relative to the data area. Default: 'vertical-right'. */
    Position?: ButtonTrayPosition;
    /** Show zoom-rectangular button. Default: true. */
    ShowZoom?: boolean;
    /** Show zoom-vertical (X only) button. Default: true. */
    ShowVerticalZoom?: boolean;
    /** Show zoom-horizontal (Y only) button. Default: true. */
    ShowHorizontalZoom?: boolean;
    /** Show pan button. Default: true. */
    ShowPan?: boolean;
    /** Show reset button. Default: true. */
    ShowReset?: boolean;
    /** Show capture/screenshot button. Default: false. */
    ShowCapture?: boolean;
    /** Show select button. Default: false. */
    ShowSelect?: boolean;
    /** Callback to trigger a plot capture. Provided by Plot. */
    OnCapture?: () => Promise<string | undefined>;
    /** Custom InteractiveButton elements extracted from Plot children */
    CustomButtons?: React.ReactElement<IInteractiveButtonProps>[];
}

export const TRAY_PAD = 6;
const ICON_COLOR = 'white';
const ICON_STROKEWIDTH = 1.5;

const InteractiveButtons = (props: IInteractiveButtonsProps) => {
    const { ShowZoom = true, ShowVerticalZoom = true, ShowHorizontalZoom = true, ShowPan = true, ShowReset = true, ShowCapture = false, ShowSelect = false, OnCapture, CustomButtons = [], KeepTrayOpen, Position = 'vertical-right' } = props;

    const { InteractionMode, SetInteractionMode } = useInteractionContext();
    const { Reset } = useViewportRegistryContext();
    const { PlotID } = useLayoutContext();

    const [expanded, setExpanded] = React.useState(KeepTrayOpen ?? false);

    const isHorizontal = Position === 'horizontal-left' || Position === 'horizontal-right';

    const handleBtnClick = React.useCallback((action: () => void) => {
        action();
        setExpanded(KeepTrayOpen ?? false);
    }, [KeepTrayOpen]);

    // Build default buttons based on props
    const defaultButtons = React.useMemo(() => {
        const list: React.ReactElement<IInteractiveButtonProps>[] = [];
        if (ShowZoom)
            list.push(<InteractiveButton key="zoom" Icon={<ReactIcons.Maximize Color={ICON_COLOR} StrokeWidth={ICON_STROKEWIDTH} />} IsActive={InteractionMode === 'zoom'} OnClick={() => handleBtnClick(() => SetInteractionMode('zoom'))} />);
        if (ShowVerticalZoom)
            list.push(<InteractiveButton key="zoom-x" Icon={<ReactIcons.HorizontalResize Color={ICON_COLOR} StrokeWidth={ICON_STROKEWIDTH} />} IsActive={InteractionMode === 'zoom-x'} OnClick={() => handleBtnClick(() => SetInteractionMode('zoom-x'))} />);
        if (ShowHorizontalZoom)
            list.push(<InteractiveButton key="zoom-y" Icon={<ReactIcons.VeriticalResize Color={ICON_COLOR} StrokeWidth={ICON_STROKEWIDTH} />} IsActive={InteractionMode === 'zoom-y'} OnClick={() => handleBtnClick(() => SetInteractionMode('zoom-y'))} />);
        if (ShowPan)
            list.push(<InteractiveButton key="pan" Icon={<ReactIcons.PanHand Color={ICON_COLOR} StrokeWidth={ICON_STROKEWIDTH} />} IsActive={InteractionMode === 'pan'} OnClick={() => handleBtnClick(() => SetInteractionMode('pan'))} />);
        if (ShowReset)
            list.push(<InteractiveButton key="reset" Icon={<ReactIcons.Refresh Color={ICON_COLOR} StrokeWidth={ICON_STROKEWIDTH} />} OnClick={() => handleBtnClick(() => Reset())} />);
        if(ShowSelect)
            list.push(<InteractiveButton key="select" Icon={<ReactIcons.FingerSelect Color={ICON_COLOR} StrokeWidth={ICON_STROKEWIDTH} />} IsActive={InteractionMode === 'select'} OnClick={() => handleBtnClick(() => SetInteractionMode('select'))} />);

        if (ShowCapture && OnCapture != null)
            list.push(<InteractiveButton key="capture" Icon={<ReactIcons.Camera Color={ICON_COLOR} StrokeWidth={ICON_STROKEWIDTH} />} OnClick={() => handleBtnClick(() => { OnCapture(); })} />);
        return list;
    }, [ShowZoom, ShowVerticalZoom, ShowHorizontalZoom, ShowPan, ShowReset, ShowCapture, OnCapture, InteractionMode, SetInteractionMode, Reset, handleBtnClick]);

    // All buttons: defaults first, then custom
    const allButtons = React.useMemo(() => [...defaultButtons, ...CustomButtons], [defaultButtons, CustomButtons]);

    // Get icon for the current active mode (used in collapsed state)
    const currentIcon = React.useMemo(() => {
        const match = allButtons.find((btn) => btn.props.IsActive);
        return match?.props.Icon ?? <ReactIcons.Maximize Color={ICON_COLOR} StrokeWidth={ICON_STROKEWIDTH} />;
    }, [allButtons]);

    // Local anchors everything renders relative to the portal g origin
    const anchorX = BUTTON_R + TRAY_PAD;
    const anchorY = BUTTON_R + TRAY_PAD;

    const stopPropagation = React.useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    const portalNode = document.getElementById(GetPortalID(PlotID, PortalIds.BUTTON_TRAY));
    if (allButtons.length === 0 || portalNode == null) return null;

    // Collapsed -- single button showing current mode
    if (!expanded && allButtons.length > 1) {
        return (
            <Portal node={portalNode}>
                <g
                    onMouseDown={stopPropagation}
                    onMouseUp={stopPropagation}
                    onMouseMove={stopPropagation}
                >
                    <circle
                        cx={anchorX}
                        cy={anchorY}
                        r={BUTTON_R}
                        fill="var(--primary)"
                        stroke="var(--primary)"
                        strokeWidth={1}
                        style={{ cursor: 'pointer', pointerEvents: 'all' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpanded(true);
                        }}
                    />
                    {RenderButtonIcon(currentIcon, anchorX, anchorY)}
                </g>
            </Portal>
        );
    }

    // Expanded: tray of buttons
    const trayLength = (allButtons.length - (KeepTrayOpen ?? false ? 1 : 0)) * BUTTON_SPACING;

    const bgX = anchorX - BUTTON_R - TRAY_PAD;
    const bgY = anchorY - BUTTON_R - TRAY_PAD;
    const bgW = isHorizontal ? trayLength + (BUTTON_R + TRAY_PAD) * 2 : (BUTTON_R + TRAY_PAD) * 2;
    const bgH = isHorizontal ? (BUTTON_R + TRAY_PAD) * 2 : trayLength + (BUTTON_R + TRAY_PAD) * 2;
    const bgR = BUTTON_R + TRAY_PAD;

    return (
        <Portal node={portalNode}>
            <g
                onMouseDown={stopPropagation}
                onMouseUp={stopPropagation}
                onMouseMove={stopPropagation}
                data-html2canvas-ignore="true"
            >
                {/* Background pill */}
                <rect
                    x={bgX}
                    y={bgY}
                    width={bgW}
                    height={bgH}
                    rx={bgR}
                    ry={bgR}
                    fill="var(--primary)"
                    style={{ pointerEvents: 'all' }}
                />

                {/* Render all buttons with position props */}
                {allButtons.map((btn, i) => {
                    const x = isHorizontal ? anchorX + i * BUTTON_SPACING : anchorX;
                    const y = isHorizontal ? anchorY : anchorY + i * BUTTON_SPACING;
                    return React.cloneElement(btn, {
                        key: btn.key ?? `btn-${i}`,
                        X: x,
                        Y: y,
                    } as unknown as IInteractiveButtonProps);
                })}

                {/* Collapse button */}
                {(KeepTrayOpen ?? false) ? null :
                    <g>
                        {/* Separator line beside/above collapse button */}
                        {isHorizontal ?
                            <line
                                x1={anchorX + allButtons.length * BUTTON_SPACING - BUTTON_R - (TRAY_PAD / 2)}
                                y1={anchorY - BUTTON_R}
                                x2={anchorX + allButtons.length * BUTTON_SPACING - BUTTON_R - (TRAY_PAD / 2)}
                                y2={anchorY + BUTTON_R}
                                stroke={ICON_COLOR}
                                strokeWidth={1.2}
                            />
                            :
                            <line
                                x1={anchorX - BUTTON_R}
                                y1={anchorY + allButtons.length * BUTTON_SPACING - BUTTON_R - (TRAY_PAD / 2)}
                                x2={anchorX + BUTTON_R}
                                y2={anchorY + allButtons.length * BUTTON_SPACING - BUTTON_R - (TRAY_PAD / 2)}
                                stroke={ICON_COLOR}
                                strokeWidth={1.2}
                            />
                        }
                        <circle
                            cx={isHorizontal ? anchorX + allButtons.length * BUTTON_SPACING : anchorX}
                            cy={isHorizontal ? anchorY : anchorY + allButtons.length * BUTTON_SPACING}
                            r={BUTTON_R}
                            fill={'var(--primary)'}
                            style={{ cursor: 'pointer', pointerEvents: 'all' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (KeepTrayOpen ?? false)
                                    return;

                                setExpanded(false);
                            }}
                        />
                        {RenderButtonIcon(<ReactIcons.ChevronUp Color={ICON_COLOR} StrokeWidth={ICON_STROKEWIDTH} />, isHorizontal ? anchorX + allButtons.length * BUTTON_SPACING : anchorX, isHorizontal ? anchorY : anchorY + allButtons.length * BUTTON_SPACING)}
                    </g>
                }
            </g>
        </Portal>
    );
};

const SVG_TAGS = new Set([
    'g', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon',
    'text', 'tspan', 'ellipse', 'image', 'use', 'defs', 'clipPath',
    'mask', 'pattern', 'symbol', 'marker', 'linearGradient', 'radialGradient',
    'stop', 'filter', 'feBlend', 'feColorMatrix', 'feFlood', 'feGaussianBlur',
    'feOffset', 'feMerge', 'feMergeNode', 'svg',
]);

/**
 * Checks whether a React node is SVG-compatible content that can be placed
 * directly inside an `<svg>` element. React components (function/class types)
 * are assumed to produce SVG output; string-typed elements are checked against
 * a set of known SVG tag names.
 */
const isSvgContent = (node: React.ReactNode): boolean => {
    if (!React.isValidElement(node)) return false;

    // React component (function / class) — we assume it renders SVG internals
    if (typeof node.type !== 'string') return true;

    return SVG_TAGS.has(node.type);
};

/**
 * Renders SVG icon content centered at a given position within an SVG context.
 * The icon is placed inside a nested `<svg>` element with viewBox="0 0 24 24".
 * If the Icon is not valid SVG content (e.g. a string, number, or HTML element),
 * it is wrapped in a `<foreignObject>` so it still renders correctly.
 *
 * @param Icon - React content to render as the icon
 * @param X - Center X position in the parent SVG coordinate space
 * @param Y - Center Y position in the parent SVG coordinate space
 */
export const RenderButtonIcon = (Icon: React.ReactNode, X: number, Y: number) => {
    const ICON_SIZE = 20;

    const content = isSvgContent(Icon) ? Icon : (
        <foreignObject x={0} y={0} width={24} height={24}>
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 'bold',
                    lineHeight: 1,
                    userSelect: 'none',
                }}
            >
                {Icon}
            </div>
        </foreignObject>
    );

    return (
        <svg
            x={X - ICON_SIZE / 2}
            y={Y - ICON_SIZE / 2}
            width={ICON_SIZE}
            height={ICON_SIZE}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pointerEvents: 'none', overflow: 'visible' }}
        >
            {content}
        </svg>
    );
};

export default InteractiveButtons;