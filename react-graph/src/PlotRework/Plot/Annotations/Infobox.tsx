//******************************************************************************************************
//  Overlay.tsx - Gbtc
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
//  03/04/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import { Portal } from 'react-portal';
import { useXViewportContext } from '../ViewportContext/XViewportContext';
import { useYViewportContext } from '../ViewportContext/YViewportContext';
import { GetPortalID, PortalIds, useLayoutContext } from '../LayoutContext';
import { useInteractionContext, ISelectHandler } from '../Interaction/InteractionContext';

type Origin =
    | 'upper-left' | 'upper-center' | 'upper-right'
    | 'middle-left' | 'center' | 'middle-right'
    | 'lower-left' | 'lower-center' | 'lower-right';

export interface IOverlayProps {
    /** X position in data units. */
    X: number;
    /** Y position in data units. */
    Y: number;
    /** Which point of the box is anchored to (X, Y). Default: 'center'. */
    Origin?: Origin;
    /** Pixel offset away from the anchor point. Default: 0. */
    Offset?: number;
    /**
     * Fixed pixel size. When provided, children render in a Width x Height box centered per Origin.
     * When omitted, the box auto-sizes to fit its children.
     */
    Width?: number;
    /** Fixed pixel height. Used with Width for fixed sizing. */
    Height?: number;
    /** Whether to draw a border outline. Default: false. */
    ShowBorder?: boolean;
    /** Border stroke color. Default: 'currentColor'. */
    BorderColor?: string;
    /** Opacity of the overlay. Default: 1. */
    Opacity?: number;
    /** Whether the overlay can be dragged in select mode. Default: false. */
    Draggable?: boolean;
    /** Called when released at a new position (data units). */
    OnPositionChange?: (x: number, y: number) => void;
    /** Called on mouse move while in select mode. */
    OnMouseMove?: (x: number, y: number) => void;
    /** Optional CSS styles applied to the foreignObject content wrapper. */
    Style?: React.CSSProperties;
}

/**
 * Renders arbitrary HTML content anchored to a data-space coordinate.
 */
const Overlay = (props: React.PropsWithChildren<IOverlayProps>) => {
    const {
        X, Y, Origin = 'center', Offset = 0, Width: fixedWidth, Height: fixedHeight,
        ShowBorder = false, BorderColor = 'currentColor', Opacity = 1,
        Draggable = false, OnPositionChange, OnMouseMove, Style, children
    } = props;

    const isFixedSize = fixedWidth != null && fixedHeight != null;

    const { PlotID } = useLayoutContext();
    const {XTransform} = useXViewportContext();
    const {YTransform} = useYViewportContext();
    const interaction = useInteractionContext();

    const contentRef = React.useRef<HTMLDivElement>(null);
    const [autoSize, setAutoSize] = React.useState<{ width: number; height: number }>({ width: 0, height: 0 });
    const [isSelected, setIsSelected] = React.useState(false);
    const [position, setPosition] = React.useState<{ x: number; y: number }>({ x: X, y: Y });

    const width = isFixedSize ? fixedWidth : autoSize.width;
    const height = isFixedSize ? fixedHeight : autoSize.height;

    // Sync position when props change
    React.useEffect(() => {
        setPosition({ x: X, y: Y });
    }, [X, Y]);

    // Auto-measure children when not fixed size
    React.useEffect(() => {
        if (isFixedSize || contentRef.current == null) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const w = Math.ceil(entry.contentRect.width);
                const h = Math.ceil(entry.contentRect.height);
                setAutoSize(prev => (prev.width === w && prev.height === h) ? prev : { width: w, height: h });
            }
        });

        observer.observe(contentRef.current);
        return () => observer.disconnect();
    }, [isFixedSize]);

    // Compute pixel position from data coords + origin + offset
    const computePixelPos = React.useCallback((xData: number, yData: number): { px: number; py: number } => {
        let px = XTransform(xData);
        let py = YTransform(yData);

        switch (Origin) {
            case 'upper-right': case 'middle-right': case 'lower-right':
                px -= width + Offset; break;
            case 'upper-center': case 'center': case 'lower-center':
                px -= Math.floor(width / 2); break;
            default:
                px += Offset; break;
        }

        switch (Origin) {
            case 'lower-left': case 'lower-right': case 'lower-center':
                py -= height + Offset; break;
            case 'middle-left': case 'center': case 'middle-right':
                py -= Math.floor(height / 2); break;
            default:
                py += Offset; break;
        }

        return { px, py };
    }, [XTransform, YTransform, Origin, Offset, width, height]);

    // Select handler for drag support
    React.useEffect(() => {
        if (!Draggable) return;

        const handler: ISelectHandler = {
            onClick: (xData: number, yData: number) => {
                const { px, py } = computePixelPos(position.x, position.y);
                const clickPx = XTransform(xData);
                const clickPy = YTransform(yData);

                if (clickPx >= px && clickPx <= px + width && clickPy >= py && clickPy <= py + height)
                    setIsSelected(true);
            },
            onRelease: () => {
                if (isSelected) {
                    setIsSelected(false);
                    if (OnPositionChange != null && (position.x !== X || position.y !== Y))
                        OnPositionChange(position.x, position.y);
                }
            },
            onMove: (xData: number, yData: number) => {
                if (isSelected)
                    setPosition({ x: xData, y: yData });

                OnMouseMove?.(xData, yData);
            },
            onPlotLeave: () => {
                setIsSelected(false);
            },
        };

        const id = interaction.RegisterSelectHandler(handler);
        return () => interaction.UnregisterSelectHandler(id);
    }, [Draggable, isSelected, position, X, Y, width, height, computePixelPos, XTransform, YTransform, OnPositionChange, OnMouseMove, interaction]);

    // Deselect when mode changes away from select
    React.useEffect(() => {
        if (interaction.InteractionMode !== 'select')
            setIsSelected(false);
    }, [interaction.InteractionMode]);

    const { px, py } = computePixelPos(position.x, position.y);

    if (!isFinite(px) || !isFinite(py)) return null;

    return (
        <Portal node={document.getElementById(GetPortalID(PlotID, PortalIds.DATA))}>
            <g>
                {ShowBorder ? (
                    <path
                        d={`M ${px} ${py} h ${width} v ${height} h -${width} Z`}
                        stroke={BorderColor}
                        fill="none"
                        style={{ opacity: Opacity, pointerEvents: 'none' }}
                    />
                ) : null}
                <foreignObject x={px} y={py} width={width} height={height} style={{ pointerEvents: 'none', overflow: 'visible' }}>
                    <div ref={!isFixedSize ? contentRef : undefined} style={{ display: 'inline-block', opacity: Opacity, ...Style }}>
                        {children}
                    </div>
                </foreignObject>
            </g>
        </Portal>
    );
};

export default Overlay;