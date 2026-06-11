import * as React from 'react';
import { useDataSeriesContext } from '../../Legend/DataSeriesContext';
import DataSeriesGroup from '../../Legend/DataSeriesGroup';
import LineInternal from './InternalLine';
import { PointNode } from '../../../../PointNode';
import { LegendPosition } from '../../LayoutContext';

export interface ILineProps {
    /**
     * Data points as array of [x, y] tuples
     */
    Data: [number, number][];
    /**
     * Legend label. If provided and not already inside a DataSeriesGroup,
     * automatically wraps in one to produce a legend entry.
     */
    Label?: string;
    /**
     * Line color. Falls back to DataSeriesContext.Color, then 'black'.
     */
    Color?: string;
    /**
     * Line stroke width. Falls back to DataSeriesContext.StrokeWidth, then 2.
     */
    StrokeWidth?: number;
    /**
     * Line dash array (e.g., "5,5"). Falls back to DataSeriesContext.StrokeDasharray.
     */
    StrokeDasharray?: string;
    /**
     * Line opacity (0-1). Falls back to DataSeriesContext.Opacity, then 1.
     */
    Opacity?: number;
    /**
     * Whether to show points on the line
     */
    ShowPoints?: boolean;
    /**
     * Automatically show points when there are few data points visible
     */
    AutoShowPoints?: boolean;
    /**
     * When true, draws a highlighted circle at the nearest data point
     * to the current hover position.
     */
    HighlightHover?: boolean;
    /**
     * Called when the hover position changes with the nearest data point.
     * Only fires when HighlightHover is true.
     */
    OnHover?: (x: number, y: number) => void;
    /**
     * Optional ref to receive the internal PointNode for this line.
     */
    PointNodeRef?: React.MutableRefObject<PointNode | null>;
    /**
     * Optional value to force a re-render.
     */
    ReRender?: number;
    /**
     * Which legend to place this entry in. Falls back to Plot's LegendPosition.
     */
    LegendPosition?: LegendPosition;
}

/**
 * Public-facing Line component.
 * If Label is provided and we're not already inside a DataSeriesGroup, wraps in one so the legend entry and enabled state are handled by the group.
 */
const Line = (props: ILineProps) => {
    const series = useDataSeriesContext();
    const isInGroup = series != null;

    if (!isInGroup && props.Label != null) {
        return (
            <DataSeriesGroup
                Label={props.Label}
                Color={props.Color}
                StrokeWidth={props.StrokeWidth}
                StrokeDasharray={props.StrokeDasharray}
                Opacity={props.Opacity}
                LegendPosition={props.LegendPosition}
            >
                <LineInternal {...props} />
            </DataSeriesGroup>
        );
    }

    return <LineInternal {...props} />;
};

export default Line;
