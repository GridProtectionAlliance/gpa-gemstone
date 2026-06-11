//******************************************************************************************************
//  InteractionOverlay.tsx - Gbtc
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
import { PortalIds, useLayoutContext, GetPortalID } from '../LayoutContext';
import { useInteractionContext } from './InteractionContext';
import { useViewportRegistryContext } from '../ViewportContext/ViewportRegistryContext';

interface IInteractionOverlayProps {
    SnapMouse?: boolean;
}

const InteractionOverlay = (props: IInteractionOverlayProps) => {
    const { SnapMouse = false } = props;
    const { DataArea, PlotID } = useLayoutContext();
    const { InteractionMode, GetSelectHandlers } = useInteractionContext();
    const { GetYViewports, GetXViewports } = useViewportRegistryContext();

    // Mouse states
    const [mouseInPlot, setMouseInPlot] = React.useState(false);
    const [mousePosition, setMousePosition] = React.useState<[number, number]>([0, 0]);

    // Ref mirror so wheel handler always reads latest position without a stale closure
    const mousePosRef = React.useRef<[number, number]>([0, 0]);
    const mouseInPlotRef = React.useRef(false);

    // Local drag state
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragStart, setDragStart] = React.useState<[number, number]>([0, 0]);
    const [dragCurrent, setDragCurrent] = React.useState<[number, number]>([0, 0]);

    // For pan: track previous position to compute deltas
    const lastPanPos = React.useRef<[number, number]>([0, 0]);

    // Wheel-scroll lock
    const wheelLock = React.useRef<{ timeout?: ReturnType<typeof setTimeout>; locked: boolean }>({ locked: false, });

    // Effect to Prevent default scrolling when wheel-zooming
    React.useEffect(() => {
        const cancel = (e: WheelEvent) => {
            if (wheelLock.current.locked)
                e.preventDefault();
        };

        document.body.addEventListener('wheel', cancel, { passive: false });

        return () => document.body.removeEventListener('wheel', cancel);
    }, []);

    // Snap: finds the closest data point across all Y viewports and returns its pixel position.
    const snapToClosestSeries = React.useCallback((pixelPos: [number, number]): [number, number] => {
        const xvps = GetXViewports();
        if (xvps.length === 0) return pixelPos;

        const xVal = xvps[0].InverseXTransform(pixelPos[0]);
        let bestPt: [number, number] = pixelPos;
        let bestDistSq: number | undefined;

        for (const yvp of GetYViewports()) {
            for (const series of yvp.GetDataSeries()) {
                if (!series.Enabled || series.GetPoints == null) continue;
                const points = series.GetPoints(xVal, 7);
                if (points == null) continue;

                for (const pt of points) {
                    const px = xvps[0].XTransform(pt[0]);
                    const py = yvp.YTransform(pt[1]);
                    const distSq = (px - pixelPos[0]) ** 2 + (py - pixelPos[1]) ** 2;
                    if (bestDistSq == null || distSq < bestDistSq) {
                        bestDistSq = distSq;
                        bestPt = [px, py];
                    }
                }
            }
        }

        return bestPt;
    }, [GetXViewports, GetYViewports]);

    // Zoom: drag-release
    const applyZoomFromDrag = React.useCallback((start: [number, number], end: [number, number]) => {
        const minDrag = 10;

        if (Math.abs(end[0] - start[0]) < minDrag && Math.abs(end[1] - start[1]) < minDrag)
            return;

        // Compute new X domain first (needed for Y constraining)
        let newXDomain: [number, number] | null = null;
        if (InteractionMode !== 'zoom-y') {
            const x0 = Math.min(start[0], end[0]);
            const x1 = Math.max(start[0], end[0]);
            GetXViewports().forEach((vp) => {
                const d0 = vp.InverseXTransform(x0);
                const d1 = vp.InverseXTransform(x1);
                newXDomain = [Math.max(vp.MinDomain, Math.min(d0, d1)), Math.min(vp.MaxDomain, Math.max(d0, d1))];
                vp.SetMinDomain(newXDomain[0]);
                vp.SetMaxDomain(newXDomain[1]);
            });
        }

        if (InteractionMode !== 'zoom-x') {
            // Rectangle or Y-only zoom
            const y0 = Math.min(start[1], end[1]);
            const y1 = Math.max(start[1], end[1]);
            GetYViewports().forEach((vp) => {
                // Auto-Y viewports always constrain to fit data in visible X range
                if (vp.ConstrainToXDomain != null && newXDomain != null) {
                    const constrained = vp.ConstrainToXDomain(newXDomain);
                    if (constrained != null) {
                        vp.SetMinDomain(constrained[0]);
                        vp.SetMaxDomain(constrained[1]);
                        return;
                    }
                }
                // Manual-Y viewports use the drag rectangle Y directly
                const d0 = vp.InverseYTransform(y0);
                const d1 = vp.InverseYTransform(y1);
                vp.SetMinDomain(Math.max(vp.MinDomain, Math.min(d0, d1)));
                vp.SetMaxDomain(Math.min(vp.MaxDomain, Math.max(d0, d1)));
            });
        } else if (newXDomain != null) {
            // X-only zoom: constrain auto-Y viewports to fit data in new X range
            GetYViewports().forEach((vp) => {
                if (vp.ConstrainToXDomain != null) {
                    if (newXDomain == null) return;
                    const constrained = vp.ConstrainToXDomain(newXDomain);
                    if (constrained != null) {
                        vp.SetMinDomain(constrained[0]);
                        vp.SetMaxDomain(constrained[1]);
                    }
                }
            });
        }
    }, [InteractionMode, GetXViewports, GetYViewports]);

    // Zoom: scroll-wheel
    const handleWheel = React.useCallback((e: React.WheelEvent<SVGRectElement>) => {
        if (!InteractionMode.startsWith('zoom') || !mouseInPlotRef.current) return;

        if (wheelLock.current?.timeout != null)
            clearTimeout(wheelLock.current.timeout);

        wheelLock.current.locked = true;
        wheelLock.current.timeout = setTimeout(() => { wheelLock.current.locked = false; }, 200);

        const multiplier = e.deltaY > 0 ? 1.25 : 0.75;
        const [px, py] = mousePosRef.current;

        let newXDomain: [number, number] | null = null;
        if (InteractionMode !== 'zoom-y') {
            GetXViewports().forEach((vp) => {
                const x0px = vp.XTransform(vp.MinDomain);
                const x1px = vp.XTransform(vp.MaxDomain);
                const newX0 = px - (px - x0px) * multiplier;
                const newX1 = px + (x1px - px) * multiplier;
                if (Math.abs(newX1 - newX0) > 10) {
                    newXDomain = [vp.InverseXTransform(newX0), vp.InverseXTransform(newX1)];
                    vp.SetMinDomain(newXDomain[0]);
                    vp.SetMaxDomain(newXDomain[1]);
                }
            });
        }

        if (InteractionMode !== 'zoom-x') {
            // Y is being wheel-zoomed directly
            GetYViewports().forEach((vp) => {
                // Auto-Y viewports always constrain to fit data in visible X range
                if (vp.ConstrainToXDomain != null && newXDomain != null) {
                    const constrained = vp.ConstrainToXDomain(newXDomain);
                    if (constrained != null) {
                        vp.SetMinDomain(constrained[0]);
                        vp.SetMaxDomain(constrained[1]);
                        return;
                    }
                }

                // Manual-Y viewports zoom normally
                const y0px = vp.YTransform(vp.MinDomain);
                const y1px = vp.YTransform(vp.MaxDomain);

                const newY0 = py - (py - y0px) * multiplier;
                const newY1 = py + (y1px - py) * multiplier;
                if (Math.abs(newY1 - newY0) > 10) {
                    vp.SetMinDomain(vp.InverseYTransform(newY0));
                    vp.SetMaxDomain(vp.InverseYTransform(newY1));
                }
            });
        } else if (newXDomain != null) {
            // X-only wheel zoom: constrain auto-Y viewports
            GetYViewports().forEach((vp) => {
                if (vp.ConstrainToXDomain != null) {
                    if (newXDomain == null) return;
                    const constrained = vp.ConstrainToXDomain(newXDomain);
                    if (constrained != null) {
                        vp.SetMinDomain(constrained[0]);
                        vp.SetMaxDomain(constrained[1]);
                    }
                }
            });
        }
    }, [InteractionMode, GetXViewports, GetYViewports]);

    // Pan
    const applyPan = React.useCallback((current: [number, number]) => {
        const [prevX, prevY] = lastPanPos.current;
        const dx = current[0] - prevX;
        const dy = current[1] - prevY;
        lastPanPos.current = current;

        let newXDomain: [number, number] | null = null;
        GetXViewports().forEach((vp) => {
            const shift = vp.InverseXTransform(-dx) - vp.InverseXTransform(0);
            newXDomain = [vp.MinDomain + shift, vp.MaxDomain + shift];
            vp.SetMinDomain(newXDomain[0]);
            vp.SetMaxDomain(newXDomain[1]);
        });

        GetYViewports().forEach((vp) => {
            // pan Y normally, regardless of whether it's auto or manual. Constraining on pan would be awkward UX
            const shift = vp.InverseYTransform(-dy) - vp.InverseYTransform(0);
            vp.SetMinDomain(vp.MinDomain + shift);
            vp.SetMaxDomain(vp.MaxDomain + shift);
        });
    }, [GetXViewports, GetYViewports]);

    // Select helpers
    const fireSelect = React.useCallback((pos: [number, number], method: 'onClick' | 'onRelease' | 'onMove' | 'onPlotLeave') => {
        const xvps = GetXViewports();
        const yvps = GetYViewports();
        const handlers = GetSelectHandlers();
        if (xvps.length === 0 || handlers.length === 0) return;

        const xData = xvps[0].InverseXTransform(pos[0]);

        if (yvps.length === 0) {
            handlers.forEach((h) => h[method]?.(xData, pos[1]));
        } else {
            yvps.forEach((yvp) => {
                const yData = yvp.InverseYTransform(pos[1]);
                handlers.forEach((h) => h[method]?.(xData, yData));
            });
        }
    }, [GetSelectHandlers, GetXViewports, GetYViewports]);

    // Mouse event handlers
    const handleMouseDown = React.useCallback((e: React.MouseEvent<SVGRectElement>) => {
        const pos = getLocalPos(e, DataArea.Width, DataArea.Height);
        setMouseInPlot(true);
        mouseInPlotRef.current = true;

        if (InteractionMode.startsWith('zoom')) {
            setIsDragging(true);
            setDragStart(pos);
            setDragCurrent(pos);
        } else if (InteractionMode === 'pan') {
            setIsDragging(true);
            lastPanPos.current = pos;
        } else if (InteractionMode === 'select') {
            const snapped = SnapMouse ? snapToClosestSeries(pos) : pos;
            fireSelect(snapped, 'onClick');
        }
    }, [InteractionMode, fireSelect, DataArea.Width, DataArea.Height, SnapMouse, snapToClosestSeries]);

    const handleMouseMove = React.useCallback((e: React.MouseEvent<SVGRectElement>) => {
        const pos = getLocalPos(e, DataArea.Width, DataArea.Height);

        setMousePosition(pos);
        mousePosRef.current = pos;

        // Push the raw (unsnapped) hover position to X viewports.
        // Line highlight circles subscribe to this and should track the
        // raw mouse, matching the old library. The snapped position is
        // used for select handler coordinates only.
        const xvps = GetXViewports();
        for (const vp of xvps)
            vp.SetHoverValue(vp.InverseXTransform(pos[0]));

        if (isDragging) {
            if (InteractionMode.startsWith('zoom')) {
                setDragCurrent(pos);
            } else if (InteractionMode === 'pan') {
                applyPan(pos);
            }
        }

        if (InteractionMode === 'select') {
            const snapped = SnapMouse ? snapToClosestSeries(pos) : pos;
            fireSelect(snapped, 'onMove');
        }

    }, [isDragging, InteractionMode, applyPan, fireSelect, GetXViewports, DataArea.Width, DataArea.Height, SnapMouse, snapToClosestSeries]);

    const handleMouseUp = React.useCallback((e: React.MouseEvent<SVGRectElement>) => {
        const pos = getLocalPos(e, DataArea.Width, DataArea.Height);

        if (isDragging && InteractionMode.startsWith('zoom'))
            applyZoomFromDrag(dragStart, pos);

        if (InteractionMode === 'select') {
            const snapped = SnapMouse ? snapToClosestSeries(pos) : pos;
            fireSelect(snapped, 'onRelease');
        }

        setIsDragging(false);
    }, [isDragging, InteractionMode, applyZoomFromDrag, dragStart, fireSelect, DataArea.Width, DataArea.Height, SnapMouse, snapToClosestSeries]);

    const handleMouseLeave = React.useCallback(() => {
        setMouseInPlot(false);
        mouseInPlotRef.current = false;

        // Clear hover value on all X viewports
        const xvps = GetXViewports();
        for (const vp of xvps)
            vp.SetHoverValue(null);

        if (isDragging && InteractionMode === 'pan')
            setIsDragging(false);

        if (InteractionMode === 'select') {
            const snapped = SnapMouse ? snapToClosestSeries(mousePosition) : mousePosition;
            fireSelect(snapped, 'onPlotLeave');
        }

    }, [isDragging, InteractionMode, fireSelect, GetXViewports, mousePosition, SnapMouse, snapToClosestSeries]);

    const handleMouseEnter = React.useCallback(() => {
        setMouseInPlot(true);
        mouseInPlotRef.current = true;
    }, []);

    // Cursor style
    const cursorStyle = React.useMemo(() => {
        if (isDragging && InteractionMode === 'pan') return 'grabbing';

        switch (InteractionMode) {
            case 'pan': return 'grab';
            case 'select': return 'pointer';
            default: return 'crosshair';
        }
    }, [InteractionMode, isDragging]);

    //  Zoom rect dimensions
    const zoomRectangle = React.useMemo(() => {
        if (!isDragging || !InteractionMode.startsWith('zoom')) return null;
        return {
            x: InteractionMode !== 'zoom-y' ? Math.min(dragStart[0], dragCurrent[0]) : 0,
            y: InteractionMode !== 'zoom-x' ? Math.min(dragStart[1], dragCurrent[1]) : 0,
            width: InteractionMode !== 'zoom-y' ? Math.abs(dragCurrent[0] - dragStart[0]) : DataArea.Width,
            height: InteractionMode !== 'zoom-x' ? Math.abs(dragCurrent[1] - dragStart[1]) : DataArea.Height,
        };
    }, [isDragging, InteractionMode, dragStart, dragCurrent, DataArea.Width, DataArea.Height]);

    return (
        <Portal node={document.getElementById(GetPortalID(PlotID, PortalIds.OVERLAY))}>
            <g>
                {/* Crosshair */}
                {mouseInPlot && !isDragging ? (
                    <g style={{ pointerEvents: 'none' }}>
                        <line
                            x1={mousePosition[0]} y1={0}
                            x2={mousePosition[0]} y2={DataArea.Height}
                            stroke="currentColor" strokeWidth={1} opacity={0.6}
                        />
                        <line
                            x1={0} y1={mousePosition[1]}
                            x2={DataArea.Width} y2={mousePosition[1]}
                            stroke="currentColor" strokeWidth={1} opacity={0.6}
                        />
                    </g>
                ) : null}

                {/* Zoom selection rectangle */}
                {zoomRectangle != null ? (
                    <rect
                        x={zoomRectangle.x}
                        y={zoomRectangle.y}
                        width={zoomRectangle.width}
                        height={zoomRectangle.height}
                        fill="currentColor"
                        fillOpacity={0.25}
                        stroke="currentColor"
                        strokeWidth={1}
                        strokeOpacity={0.4}
                        style={{ pointerEvents: 'none' }}
                    />
                ) : null}

                {/*interaction surface*/}
                <rect
                    x={0} y={0}
                    width={DataArea.Width} height={DataArea.Height}
                    fill="transparent"
                    style={{ cursor: cursorStyle, pointerEvents: 'all' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onWheel={handleWheel}
                />
            </g>
        </Portal>
    );
};

//Helper Functions 

const clamp = (v: number, max: number) => Math.max(0, Math.min(v, max));

const getLocalPos = (e: React.MouseEvent<SVGRectElement>, dataAreaWidth: number, dataAreaHeight: number): [number, number] => {
    const rect = e.currentTarget.getBoundingClientRect();
    return [
        clamp(e.clientX - rect.left, dataAreaWidth),
        clamp(e.clientY - rect.top, dataAreaHeight),
    ];
};

export default InteractionOverlay;