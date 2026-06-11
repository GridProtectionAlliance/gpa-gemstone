import * as React from 'react';
import { PointNode } from '../../../../PointNode';
import { useXViewportContext, IXDataSeries, useHoverValue } from '../../ViewportContext/XViewportContext';
import { useYViewportContext, IYDataSeries } from '../../ViewportContext/YViewportContext';
import { Portal } from 'react-portal';
import { GetPortalID, PortalIds, useLayoutContext } from '../../LayoutContext';
import { useDataSeriesContext } from '../../Legend/DataSeriesContext';
import { ILineProps } from './Line';
import { CreateGuid } from '@gpa-gemstone/helper-functions';

/**
 * Component that renders the line and points for a Line data series.
 * This is seperate from the public Line component to isolate the rendering logic from the legend/grouping logic.
*/
const LineInternal = (props: ILineProps) => {
    const { Data, ShowPoints = false, AutoShowPoints = true, HighlightHover = false, OnHover, PointNodeRef, ReRender, Color, StrokeWidth, StrokeDasharray, Opacity } = props;

    const regId = React.useRef(CreateGuid());

    const series = useDataSeriesContext();
    const { PlotID, DataArea } = useLayoutContext();

    // Style resolution
    const color = Color ?? series?.Color ?? 'black';
    const strokeWidth = StrokeWidth ?? series?.StrokeWidth ?? 2;
    const strokeDasharray = StrokeDasharray ?? series?.StrokeDasharray;
    const opacity = Opacity ?? series?.Opacity ?? 1;
    const enabled = series?.Enabled ?? true;

    const [pointNode, setPointNode] = React.useState<PointNode | null>(null);

    const { MinDomain: minXDomain, MaxDomain: maxXDomain, RegisterData: xRegisterData, UnregisterData: xUnregisterData, XTransform } = useXViewportContext();
    const { RegisterData: yRegisterData, UnregisterData: yUnregisterData, YTransform } = useYViewportContext();

    // Only subscribe to hover updates when this line actually highlights on hover.
    // Lines without HighlightHover never re-render on mousemove.
    const HoverValue = useHoverValue(HighlightHover);

    // Effect to update
    React.useEffect(() => {
        if (PointNodeRef == null)
            return;

        //pointNode will only update whenever its reference changes
        PointNodeRef.current = pointNode;
    }, [pointNode, PointNodeRef])

    // Update PointNode when data changes
    React.useEffect(() => {
        if (Data == null || Data.length === 0)
            setPointNode(null);
        else
            setPointNode(new PointNode(Data));
    }, [Data]);

    // Find the nearest data point to the current hover X position
    const highlightPoint = React.useMemo<[number, number] | null>(() => {
        if (!HighlightHover || pointNode == null || HoverValue == null)
            return null;

        try {
            const pt = pointNode.GetPoint(HoverValue);
            if (pt != null)
                return pt as [number, number];
        } catch {
            // GetPoint can throw for edge cases
        }

        return null;
    }, [HighlightHover, pointNode, HoverValue]);

    // Fire the OnHover callback when the highlight point changes
    React.useEffect(() => {
        if (highlightPoint == null || OnHover == null) return;
        OnHover(highlightPoint[0], highlightPoint[1]);
    }, [highlightPoint, OnHover]);

    // Determine if we should show points (auto-show when few points visible)
    const showPoints = React.useMemo(() => {
        if (ShowPoints) return true;

        if (!AutoShowPoints || pointNode == null) return false;

        const visibleCount = pointNode.GetCount(minXDomain, maxXDomain);
        return visibleCount <= 100;
    }, [ShowPoints, AutoShowPoints, pointNode, minXDomain, maxXDomain]);

    // Get visible points from PointNode
    const visiblePoints = React.useMemo(() => {
        if (pointNode == null) return [];

        return pointNode.GetData(minXDomain, maxXDomain, true);
    }, [pointNode, minXDomain, maxXDomain]);

    // Downsample to 2 points per pixel when there are more points than the plot can display
    const renderPoints = React.useMemo(() => {
        if (visiblePoints.length === 0) return [];

        // Calculate the maximum number of points worth rendering based on the plot's pixel width.
        // Beyond 2 points per pixel, additional points are indistinguishable to the human eye.
        const maxPoints = Math.max(Math.floor(DataArea.Width * 2), 2);

        // If we already have fewer points than the limit, no downsampling is needed — use them all.
        if (visiblePoints.length <= maxPoints) return visiblePoints;

        // We divide the data into evenly-sized "buckets" (groups of consecutive points).
        // Each bucket will contribute at most 2 representative points (its min and max Y values).
        // This preserves the visual shape of the line — peaks and valleys are kept, 
        // while redundant mid-range points are discarded.
        const bucketCount = Math.floor(maxPoints / 2);
        const bucketSize = visiblePoints.length / bucketCount;
        const result: number[][] = [];

        // Always include the very first point so the line starts at the correct position.
        result.push(visiblePoints[0]);

        for (let i = 0; i < bucketCount; i++) {
            // Determine the index range of points that fall into this bucket.
            const start = Math.floor(i * bucketSize);
            const end = Math.min(Math.floor((i + 1) * bucketSize), visiblePoints.length);

            // Scan the bucket to find which point has the smallest Y and which has the largest Y.
            let minIdx = start;
            let maxIdx = start;

            for (let j = start; j < end; j++) {
                if (visiblePoints[j][1] < visiblePoints[minIdx][1])
                    minIdx = j;
                if (visiblePoints[j][1] > visiblePoints[maxIdx][1])
                    maxIdx = j;
            }

            // Add the min and max points in their original left-to-right order.
            // This ensures the line is drawn in the correct direction through each bucket, preventing artificial zig-zag artifacts.
            if (minIdx <= maxIdx) {
                result.push(visiblePoints[minIdx]);
                if (minIdx !== maxIdx)
                    result.push(visiblePoints[maxIdx]);
            } else {
                result.push(visiblePoints[maxIdx]);
                if (minIdx !== maxIdx)
                    result.push(visiblePoints[minIdx]);
            }
        }

        // Always include the very last point so the line ends at the correct position.
        result.push(visiblePoints[visiblePoints.length - 1]);

        return result;
    }, [visiblePoints, DataArea.Width]);

    React.useEffect(() => {
        console.log(`Using ${renderPoints.length} points to render line (out of ${visiblePoints.length} visible)`);
    },[visiblePoints, renderPoints])

    // Stable data series objects for axis registration
    const xDataSeries = React.useMemo<IXDataSeries>(() => {
        void ReRender; // Intentional dependency to force re-creation of the data series object
        return {
            GetMin: () => {
                if (pointNode == null) return undefined;
                return pointNode.minT;
            },
            GetMax: () => {
                if (pointNode == null) return undefined;
                return pointNode.maxT;
            },
            Enabled: enabled
        };
    }, [pointNode, enabled, ReRender]);

    // Y data series with dynamic limits based on current X domain
    const yDataSeries = React.useMemo<IYDataSeries>(() => {
        void ReRender; // Intentional dependency to force re-creation of the data series object
        return {
            GetMin: (xDomain: [number, number]) => {
                if (pointNode == null) return undefined;
                const limits = pointNode.GetLimits(xDomain[0], xDomain[1]);
                return limits[0];
            },
            GetMax: (xDomain: [number, number]) => {
                if (pointNode == null) return undefined;
                const limits = pointNode.GetLimits(xDomain[0], xDomain[1]);
                return limits[1];
            },
            GetPoints: (xValue: number, pointsAround = 1) => {
                if (pointNode == null) return undefined;
                return pointNode.GetPoints(xValue, pointsAround) as [number, number][];
            },
            Enabled: enabled
        }
    }, [pointNode, enabled, ReRender]);

    // Register with axes for auto-scaling
    React.useEffect(() => {
        const id = regId.current;
        const xRegisterDataFunc = xRegisterData.current;
        const yRegisterDataFunc = yRegisterData.current;
        const xUnregisterDataFunc = xUnregisterData.current;
        const yUnregisterDataFunc = yUnregisterData.current;

        xRegisterDataFunc(id, xDataSeries);
        yRegisterDataFunc(id, yDataSeries);

        return () => {
            xUnregisterDataFunc(id);
            yUnregisterDataFunc(id);
        };
    }, [xDataSeries, yDataSeries, xRegisterData, yRegisterData, xUnregisterData, yUnregisterData]);

    // Build SVG path from visible points
    const pathD = React.useMemo(() => {
        if (renderPoints.length === 0) return '';

        const parts: string[] = [];
        for (const [xVal, yVal] of renderPoints) {
            if (isNaN(xVal) || isNaN(yVal)) continue;
            const px = XTransform(xVal);
            const py = YTransform(yVal);
            parts.push(`${px},${py}`);
        }

        if (parts.length === 0) return '';
        return `M ${parts.join(' L ')}`;
    }, [renderPoints, XTransform, YTransform]);

    if (!enabled || pointNode == null) return null;

    return (
        <Portal node={document.getElementById(GetPortalID(PlotID, PortalIds.DATA))}>
            <g style={{ pointerEvents: 'none' }}>
                <path
                    d={pathD}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    opacity={opacity}
                />
                {showPoints && renderPoints.map((pt, i) => {
                    if (isNaN(pt[0]) || isNaN(pt[1])) return null;
                    return (
                        <circle
                            key={i}
                            r={3}
                            cx={XTransform(pt[0])}
                            cy={YTransform(pt[1])}
                            fill={color}
                            stroke="currentColor"
                            style={{ opacity: 0.8 }}
                        />
                    );
                })}
                {highlightPoint != null && (
                    <circle
                        r={5}
                        cx={XTransform(highlightPoint[0])}
                        cy={YTransform(highlightPoint[1])}
                        fill={color}
                        stroke="currentColor"
                        style={{ opacity: 0.8 }}
                    />
                )}
            </g>
        </Portal>
    );
};

export default LineInternal;
