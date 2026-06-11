//******************************************************************************************************
//  Plot.tsx - Gbtc
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
import { LayoutContext, ILayoutContext, PortalIds, GetPortalID, LegendPosition } from './LayoutContext';
import { InteractionContext, IInteractionContext, InteractionMode, ISelectHandler } from './Interaction/InteractionContext';
import { ViewportRegistryContext, IViewportRegistryContext, IRegisteredXViewport, IRegisteredYViewport } from './ViewportContext/ViewportRegistryContext';
import InteractionOverlay from './Interaction/InteractionOverlay';
import InteractiveButtons, { ButtonTrayPosition, TRAY_PAD } from './Interaction/InteractiveButtons';
import InteractiveButton, { BUTTON_R, IInteractiveButtonProps } from './Interaction/InteractiveButton';
import { CreateGuid, useGetContainerPosition } from '@gpa-gemstone/helper-functions';
import { capturePlot, ICaptureOptions } from './CapturePlot';
import { usePlotGroupContext } from './PlotGroupContext';

export interface IPlotProps {
    /** Total width in pixels. If omitted, fills the parent container's width. */
    Width?: number;
    /** Total height in pixels. If omitted, fills the parent container's height. */
    Height?: number;
    /** Default interaction mode */
    InitialInteractionMode?: InteractionMode;
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
    /** Show select button. Default: false. */
    ShowSelect?: boolean;
    /** Where to place the legend. Default: 'bottom'. */
    LegendPosition?: LegendPosition;
    /** Keep interaction buttons open. Default: false. */
    KeepInteractionBtnsOpen?: boolean;
    /**
     * Where to place the interaction button tray. Default: 'vertical-right'.
     * 'vertical-left' / 'vertical-right': tray runs vertically, placed outside the left/right axis at the top.
     * 'horizontal-left' / 'horizontal-right': tray runs horizontally, placed above the data area on the left/right side.
     */
    InteractionBtnsPosition?: ButtonTrayPosition;
    /** Show capture/screenshot button in the interaction tray. Default: false. */
    ShowCapture?: boolean;
    /** Default capture options used by the tray button. Can be overridden via the ref method. */
    CaptureOptions?: ICaptureOptions;
    /**
     * When true, the mouse crosshair and select handler coordinates snap to
     * the nearest data point across all registered data series.
     */
    SnapMouse?: boolean;
}

const TICK_OVERHANG = 8;
const LEGEND_MAX_FRACTION = 0.25;

const Plot = (props: React.PropsWithChildren<IPlotProps>) => {
    const {
        Width: propWidth, Height: propHeight, InitialInteractionMode, children,
        ShowZoom, ShowVerticalZoom, ShowHorizontalZoom, ShowPan, ShowReset, ShowSelect,
        LegendPosition: propLegendPosition = 'bottom',
        ShowCapture = false, CaptureOptions, SnapMouse = false,
    } = props;

    const btnPosition = props.InteractionBtnsPosition ?? 'vertical-right';
    const btnIsHorizontal = btnPosition === 'horizontal-left' || btnPosition === 'horizontal-right';
    const btnIsLeft = btnPosition === 'vertical-left' || btnPosition === 'horizontal-left';

    const plotId = React.useMemo(() => CreateGuid(), []);

    const { IsGrouped, LegendPosition: groupLegendPosition, RegisterLegendWidth, RegisterLegendHeight, Unregister, LegendHeight: groupedHeight, LegendWidth: groupedWidth } = usePlotGroupContext();
    const LegendPosition = IsGrouped ? groupLegendPosition : propLegendPosition;

    // Container measurement for auto-sizing
    const containerRef = React.useRef<HTMLDivElement>(null);
    const containerSize = useGetContainerPosition(containerRef);

    // Use prop values if provided, otherwise use measured container size
    const Width = propWidth ?? containerSize.width;
    const Height = propHeight ?? containerSize.height;

    // Dynamic legend caps: 25% of the relevant plot dimension.
    // Stored in refs so the stable measureLayout callback can read them.
    const maxLegendHeightRef = React.useRef(Height * LEGEND_MAX_FRACTION);
    maxLegendHeightRef.current = Height * LEGEND_MAX_FRACTION;
    const maxLegendWidthRef = React.useRef(Width * LEGEND_MAX_FRACTION);
    maxLegendWidthRef.current = Width * LEGEND_MAX_FRACTION;

    // Axis portal refs for measuring
    const leftAxisRef = React.useRef<SVGGElement>(null);
    const rightAxisRef = React.useRef<SVGGElement>(null);
    const bottomAxisRef = React.useRef<SVGGElement>(null);
    const topAxisRef = React.useRef<SVGGElement>(null);

    const [leftAxisWidth, setLeftAxisWidth] = React.useState(0);
    const [rightAxisWidth, setRightAxisWidth] = React.useState(0);
    const [bottomAxisHeight, setBottomAxisHeight] = React.useState(0);
    const [topAxisHeight, setTopAxisHeight] = React.useState(0);

    // Button tray measurement
    const buttonTrayRef = React.useRef<SVGGElement>(null);
    const [buttonTrayWidth, setButtonTrayWidth] = React.useState(0);
    const [buttonTrayHeight, setButtonTrayHeight] = React.useState(0);

    // Legend measurement
    const legendRef = React.useRef<HTMLDivElement>(null);
    const [legendHeight, setLegendHeight] = React.useState(0);

    const leftLegendRef = React.useRef<HTMLDivElement>(null);
    const rightLegendRef = React.useRef<HTMLDivElement>(null);
    const [leftLegendWidth, setLeftLegendWidth] = React.useState(0);
    const [rightLegendWidth, setRightLegendWidth] = React.useState(0);

    // Interaction states
    const [currentMode, setCurrentMode] = React.useState<InteractionMode>(InitialInteractionMode ?? 'zoom');

    // Viewport registration maps
    const xViewports = React.useRef<Map<string, IRegisteredXViewport>>(new Map());
    const yViewports = React.useRef<Map<string, IRegisteredYViewport>>(new Map());

    // Select handler registration map
    const selectHandlers = React.useRef<Map<string, ISelectHandler>>(new Map());

    const registerXViewport = React.useCallback((vp: IRegisteredXViewport): string => {
        const id = CreateGuid();
        xViewports.current.set(id, vp);
        return id;
    }, []);

    const unregisterXViewport = React.useCallback((id: string) => {
        xViewports.current.delete(id);
    }, []);

    const registerYViewport = React.useCallback((vp: IRegisteredYViewport): string => {
        const id = CreateGuid();
        yViewports.current.set(id, vp);
        return id;
    }, []);

    const unregisterYViewport = React.useCallback((id: string) => {
        yViewports.current.delete(id);
    }, []);

    const getXViewports = React.useCallback((): IRegisteredXViewport[] => {
        return [...xViewports.current.values()];
    }, []);

    const getYViewports = React.useCallback((): IRegisteredYViewport[] => {
        return [...yViewports.current.values()];
    }, []);

    const reset = React.useCallback(() => {
        xViewports.current.forEach((vp) => vp.Reset());
        yViewports.current.forEach((vp) => vp.Reset());
    }, []);

    const registerSelectHandler = React.useCallback((handler: ISelectHandler): string => {
        const id = CreateGuid();
        selectHandlers.current.set(id, handler);
        return id;
    }, []);

    const unregisterSelectHandler = React.useCallback((id: string) => {
        selectHandlers.current.delete(id);
    }, []);

    const getSelectHandlers = React.useCallback((): ISelectHandler[] => {
        return [...selectHandlers.current.values()];
    }, []);

    const { customButtons, otherChildren } = React.useMemo(() => {
        const customButtons: React.ReactElement<IInteractiveButtonProps>[] = [];
        const otherChildren: React.ReactNode[] = [];

        React.Children.forEach(children, (child) => {
            if (child == null) return;

            if (React.isValidElement(child) && child.type === InteractiveButton) {
                customButtons.push(child as React.ReactElement<IInteractiveButtonProps>);
            } else {
                otherChildren.push(child);
            }
        });

        return { customButtons, otherChildren };
    }, [children]);

    // Stable func to measure portaled components by reading their bounding boxes.
    const measureLayout = React.useCallback(() => {
        if (leftAxisRef.current != null) {
            const bbox = leftAxisRef.current.getBBox();
            const w = bbox.width > 0 ? bbox.width : 0;
            setLeftAxisWidth(prev => Math.abs(w - prev) > 0.5 ? w : prev);
        }

        if (rightAxisRef.current != null) {
            const bbox = rightAxisRef.current.getBBox();
            const w = bbox.width > 0 ? bbox.width : 0;
            setRightAxisWidth(prev => Math.abs(w - prev) > 0.5 ? w : prev);
        }

        if (bottomAxisRef.current != null) {
            const bbox = bottomAxisRef.current.getBBox();
            const h = bbox.height > 0 ? bbox.height : 0;
            setBottomAxisHeight(prev => Math.abs(h - prev) > 0.5 ? h : prev);
        }

        if (topAxisRef.current != null) {
            const bbox = topAxisRef.current.getBBox();
            const h = bbox.height > 0 ? bbox.height : 0;
            setTopAxisHeight(prev => Math.abs(h - prev) > 0.5 ? h : prev);
        }

        if (buttonTrayRef.current != null) {
            const bbox = buttonTrayRef.current.getBBox();
            const w = bbox.width > 0 ? bbox.width : 0;
            const h = bbox.height > 0 ? bbox.height : 0;
            setButtonTrayWidth(prev => Math.abs(w - prev) > 0.5 ? w : prev);
            setButtonTrayHeight(prev => Math.abs(h - prev) > 0.5 ? h : prev);
        } else {
            setButtonTrayWidth(prev => prev !== 0 ? 0 : prev);
            setButtonTrayHeight(prev => prev !== 0 ? 0 : prev);
        }

        if (legendRef.current != null) {
            const h = Math.min(legendRef.current.scrollHeight, maxLegendHeightRef.current);
            setLegendHeight(prev => Math.abs(h - prev) > 0.5 ? h : prev);
        } else {
            setLegendHeight(prev => prev !== 0 ? 0 : prev);
        }

        if (leftLegendRef.current != null) {
            const w = Math.min(leftLegendRef.current.scrollWidth, maxLegendWidthRef.current);
            setLeftLegendWidth(prev => Math.abs(w - prev) > 0.5 ? w : prev);
        } else {
            setLeftLegendWidth(prev => prev !== 0 ? 0 : prev);
        }

        if (rightLegendRef.current != null) {
            const w = Math.min(rightLegendRef.current.scrollWidth, maxLegendWidthRef.current);
            setRightLegendWidth(prev => Math.abs(w - prev) > 0.5 ? w : prev);
        } else {
            setRightLegendWidth(prev => prev !== 0 ? 0 : prev);
        }

        if (IsGrouped) {
            if (LegendPosition === 'left')
                RegisterLegendWidth(plotId, leftLegendRef.current?.scrollWidth ?? 0);
            else if (LegendPosition === 'right')
                RegisterLegendWidth(plotId, rightLegendRef.current?.scrollWidth ?? 0);
            else if (LegendPosition === 'bottom')
                RegisterLegendHeight(plotId, legendRef.current?.scrollHeight ?? 0);
        }
    }, [IsGrouped, LegendPosition, RegisterLegendWidth, RegisterLegendHeight, plotId]);

    // Single observer setup for all layout-affecting elements
    React.useEffect(() => {
        const svgTargets: SVGGElement[] = [];
        if (leftAxisRef.current != null) svgTargets.push(leftAxisRef.current);
        if (rightAxisRef.current != null) svgTargets.push(rightAxisRef.current);
        if (bottomAxisRef.current != null) svgTargets.push(bottomAxisRef.current);
        if (topAxisRef.current != null) svgTargets.push(topAxisRef.current);
        if (buttonTrayRef.current != null) svgTargets.push(buttonTrayRef.current);

        const mutationObserver = new MutationObserver(() => measureLayout());
        for (const target of svgTargets)
            mutationObserver.observe(target, { childList: true, subtree: true, attributes: true, characterData: true });

        const resizeObserver = new ResizeObserver(() => measureLayout());
        const legendTargets = [legendRef.current, leftLegendRef.current, rightLegendRef.current];
        for (const target of legendTargets) {
            if (target != null) resizeObserver.observe(target);
        }

        measureLayout();

        return () => {
            mutationObserver.disconnect();
            resizeObserver.disconnect();
        };
    }, [measureLayout]);

    // Unregister from the group on unmount
    React.useEffect(() => {
        if (!IsGrouped) return;
        return () => Unregister(plotId);
    }, [IsGrouped, Unregister, plotId]);

    // When grouped, use the group's synced legend dimensions for layout.
    // Otherwise fall back to this Plot's own measured values.
    const effectiveLegendWidth = IsGrouped
        ? groupedWidth
        : (LegendPosition === 'left' ? leftLegendWidth : rightLegendWidth);

    const effectiveLegendHeight = IsGrouped
        ? groupedHeight
        : legendHeight;

    // SVG dimensions
    const svgWidth = Width - ((LegendPosition === 'left' || LegendPosition === 'right') ? effectiveLegendWidth : 0);
    const svgHeight = Height - (LegendPosition === 'bottom' ? effectiveLegendHeight : 0);

    // Space the button tray claims on each edge.
    // Vertical trays consume width on their side, horizontal trays consume height above.
    // Small padding added so rounded pill edges don't get clipped by the SVG boundary.
    const BTN_TRAY_MARGIN = 2;
    const collapsedSize = (BUTTON_R + TRAY_PAD) * 2 + BTN_TRAY_MARGIN;
    const btnTrayLeft = (!btnIsHorizontal && btnIsLeft) ? Math.max(buttonTrayWidth + BTN_TRAY_MARGIN, collapsedSize) : 0;
    const btnTrayRight = (!btnIsHorizontal && !btnIsLeft) ? Math.max(buttonTrayWidth + BTN_TRAY_MARGIN, collapsedSize) : 0;
    const btnTrayTop = btnIsHorizontal ? Math.max(buttonTrayHeight + BTN_TRAY_MARGIN, collapsedSize) : 0;

    // DataArea size computation
    const dataArea = React.useMemo(() => {
        const marginTop = 10;
        const marginRight = 0;
        const marginBottom = 0;
        const marginLeft = 0;

        const top = Math.max(topAxisHeight, TICK_OVERHANG) + marginTop + btnTrayTop;
        const left = leftAxisWidth + marginLeft + btnTrayLeft;
        const availableWidth = svgWidth - left - rightAxisWidth - marginRight - btnTrayRight;
        const availableHeight = svgHeight - top - bottomAxisHeight - marginBottom;

        return {
            Left: left,
            Top: top,
            Width: Math.max(0, availableWidth),
            Height: Math.max(0, availableHeight),
        };
    }, [svgWidth, svgHeight, leftAxisWidth, rightAxisWidth, topAxisHeight, bottomAxisHeight, btnTrayLeft, btnTrayRight, btnTrayTop]);

    // Position the button tray g element based on the combined position prop.
    // All placements anchor to the top corner of their respective side.
    const buttonTrayTransform = React.useMemo(() => {
        switch (btnPosition) {
            case 'horizontal-left': {
                const x = dataArea.Left;
                const y = dataArea.Top - btnTrayTop;
                return `translate(${x}, ${y})`;
            }
            case 'horizontal-right': {
                const x = dataArea.Left + dataArea.Width - buttonTrayWidth;
                const y = dataArea.Top - btnTrayTop;
                return `translate(${x}, ${y})`;
            }
            case 'vertical-left': {
                const x = dataArea.Left - leftAxisWidth - buttonTrayWidth;
                const y = dataArea.Top;
                return `translate(${x}, ${y})`;
            }
            case 'vertical-right':
            default: {
                const x = dataArea.Left + dataArea.Width + rightAxisWidth;
                const y = dataArea.Top;
                return `translate(${x}, ${y})`;
            }
        }
    }, [btnPosition, dataArea, leftAxisWidth, rightAxisWidth, buttonTrayWidth, btnTrayTop]);

    const layoutContextValue: ILayoutContext = React.useMemo(() => ({
        TotalWidth: Width,
        TotalHeight: Height,
        DataArea: dataArea,
        PlotID: plotId,
        LegendPosition: LegendPosition,
    }), [Width, Height, dataArea, plotId, LegendPosition]);

    const viewportRegistryValue: IViewportRegistryContext = React.useMemo(() => ({
        RegisterXViewport: registerXViewport,
        UnregisterXViewport: unregisterXViewport,
        RegisterYViewport: registerYViewport,
        UnregisterYViewport: unregisterYViewport,
        GetXViewports: getXViewports,
        GetYViewports: getYViewports,
        Reset: reset,
    }), [
        registerXViewport, unregisterXViewport,
        registerYViewport, unregisterYViewport,
        getXViewports, getYViewports,
        reset,
    ]);

    const interactionContextValue: IInteractionContext = React.useMemo(() => ({
        InteractionMode: currentMode,
        SetInteractionMode: setCurrentMode,
        RegisterSelectHandler: registerSelectHandler,
        UnregisterSelectHandler: unregisterSelectHandler,
        GetSelectHandlers: getSelectHandlers,
    }), [
        currentMode,
        registerSelectHandler, unregisterSelectHandler, getSelectHandlers,
    ]);

    // Capture the plot container as a raster image
    const handleCapture = React.useCallback(async (): Promise<string | undefined> => {
        if (containerRef.current == null) return undefined;

        const options = CaptureOptions ?? { Filename: 'plot-capture', Format: 'png' };

        await capturePlot(containerRef.current, options);
    }, [CaptureOptions]);

    return (
        <LayoutContext.Provider value={layoutContextValue}>
            <ViewportRegistryContext.Provider value={viewportRegistryValue}>
                <InteractionContext.Provider value={interactionContextValue}>
                    {/* Suppress browser focus outlines on all elements inside the plot */}
                    <style>{`#plot-${plotId} *:focus { outline: none; }`}</style>
                    {/* Outer div: sized by props or 100%. Only used for measurement when auto-sizing. */}
                    <div
                        id={`plot-${plotId}`}
                        ref={containerRef}
                        style={{
                            width: propWidth ?? '100%',
                            height: propHeight ?? '100%',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Inner div: always uses resolved pixel dimensions so content changes don't feed back into measurement */}
                        <div
                            style={{
                                width: Width,
                                height: Height,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: 0 }}>
                                {LegendPosition === 'left' ? (
                                    <div
                                        ref={leftLegendRef}
                                        id={GetPortalID(plotId, PortalIds.LEFT_LEGEND)}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            flexWrap: 'wrap',
                                            alignItems: 'flex-start',
                                            justifyContent: 'space-evenly',
                                            overflow: 'hidden',
                                            maxWidth: Width * LEGEND_MAX_FRACTION,
                                            height: svgHeight,
                                            flexShrink: 0,
                                        }}
                                    />
                                ) : null}

                                <svg
                                    width={svgWidth}
                                    height={svgHeight}
                                    style={{ display: 'block', flexShrink: 0 }}
                                >
                                    {/* Clip path for the data area */}
                                    <defs>
                                        <clipPath id={`${plotId}-data-clip`}>
                                            <rect x={0} y={0} width={dataArea.Width} height={dataArea.Height} />
                                        </clipPath>
                                    </defs>

                                    {/* Left axis portal */}
                                    <g
                                        ref={leftAxisRef}
                                        id={GetPortalID(plotId, PortalIds.LEFT_AXIS)}
                                        transform={`translate(${dataArea.Left}, ${dataArea.Top})`}
                                    />

                                    {/* Right axis portal */}
                                    <g
                                        ref={rightAxisRef}
                                        id={GetPortalID(plotId, PortalIds.RIGHT_AXIS)}
                                        transform={`translate(${dataArea.Left + dataArea.Width}, ${dataArea.Top})`}
                                    />

                                    {/* Bottom axis portal */}
                                    <g
                                        ref={bottomAxisRef}
                                        id={GetPortalID(plotId, PortalIds.BOTTOM_AXIS)}
                                        transform={`translate(${dataArea.Left}, ${dataArea.Top + dataArea.Height})`}
                                    />

                                    {/* Data area portal -- clipped */}
                                    <g
                                        id={GetPortalID(plotId, PortalIds.DATA)}
                                        transform={`translate(${dataArea.Left}, ${dataArea.Top})`}
                                        clipPath={`url(#${plotId}-data-clip)`}
                                    />

                                    {/* Overlay portal -- same position as data but in a separate subtree
                                        so crosshair repaints don't force the browser to repaint all line paths */}
                                    <g
                                        id={GetPortalID(plotId, PortalIds.OVERLAY)}
                                        transform={`translate(${dataArea.Left}, ${dataArea.Top})`}
                                        clipPath={`url(#${plotId}-data-clip)`}
                                    />

                                    {/* Button tray portal -- positioned outside the data area */}
                                    <g
                                        ref={buttonTrayRef}
                                        id={GetPortalID(plotId, PortalIds.BUTTON_TRAY)}
                                        transform={buttonTrayTransform}
                                    />

                                    {/* Button tray component -- portals into the g above */}
                                    <InteractiveButtons
                                        ShowZoom={ShowZoom}
                                        ShowVerticalZoom={ShowVerticalZoom}
                                        ShowHorizontalZoom={ShowHorizontalZoom}
                                        ShowPan={ShowPan}
                                        ShowReset={ShowReset}
                                        ShowCapture={ShowCapture}
                                        ShowSelect={ShowSelect}
                                        OnCapture={handleCapture}
                                        CustomButtons={customButtons}
                                        KeepTrayOpen={props.KeepInteractionBtnsOpen}
                                        Position={btnPosition}
                                    />

                                    {/* User-provided children (axes, data components, etc.) minus InteractiveButtons */}
                                    {otherChildren}
                                </svg>

                                {/* Right legend portal (HTML beside SVG) */}
                                {LegendPosition === 'right' ? (
                                    <div
                                        ref={rightLegendRef}
                                        id={GetPortalID(plotId, PortalIds.RIGHT_LEGEND)}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            flexWrap: 'wrap',
                                            alignItems: 'flex-start',
                                            justifyContent: 'space-evenly',
                                            overflow: 'hidden',
                                            maxWidth: Width * LEGEND_MAX_FRACTION,
                                            height: svgHeight,
                                            flexShrink: 0,
                                        }}
                                    />
                                ) : null}
                            </div>

                            {/* Bottom legend portal (HTML below SVG) */}
                            {LegendPosition === 'bottom' ? (
                                <div
                                    ref={legendRef}
                                    id={GetPortalID(plotId, PortalIds.LEGEND)}
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        alignItems: 'center',
                                        justifyContent: 'space-evenly',
                                        overflow: 'hidden',
                                        maxHeight: Height * LEGEND_MAX_FRACTION,
                                        width: Width,
                                    }}
                                />
                            ) : null}
                        </div>
                    </div>

                    <InteractionOverlay SnapMouse={SnapMouse} />
                </InteractionContext.Provider>
            </ViewportRegistryContext.Provider>
        </LayoutContext.Provider>
    );
};

export default Plot;