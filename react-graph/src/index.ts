import Plot from './Plot';
import Line from './Line';
import HeatMapChart from './HeatMapChart';
import LineWithThreshold from './LineWithThreshold';
import HorizontalMarker from './HorizontalMarker';
import VerticalMarker from './VerticalMarker';
import SymbolicMarker from './SymbolicMarker';
import Button from './Button';
import AggregatingCircles from './AggregatingCircles';
import Circle from './Circle';
import Infobox from './Infobox';
import Pill from './Pill';
import { AxisMap } from './GraphContext';
import HighlightBox from './HighlightBox';
import { PointNode } from './PointNode';
import StreamingLine from './StreamingLine';
import PlotGroup from './PlotGroup';
import LegendEntry from './LegendEntry';
import Legend from './Legend';
import DataLegend from './DataLegend';
import Bar from './Bar';
import BarAggregate from './BarAggregate';
import CircleGroup from './CircleGroups';

import NewPlotPlot from './PlotRework/Plot/Plot';
import NewPlotGroup from './PlotRework/Plot/PlotGroup';
import NewValueXAxis from './PlotRework/Plot/Axis/ValueXAxis';
import NewTimeXAxis from './PlotRework/Plot/Axis/TimeXAxis';
import NewLogXAxis from './PlotRework/Plot/Axis/LogXAxis';
import NewValueYAxis from './PlotRework/Plot/Axis/ValueYAxis';
import NewValueYAxisGroup from './PlotRework/Plot/Axis/ValueYAxisGroup';
import NewLine from './PlotRework/Plot/DataComponents/Line/Line';
import NewStreamingLine from './PlotRework/Plot/DataComponents/Line/StreamingLine';
import NewCircles from './PlotRework/Plot/DataComponents/Circles/Circles';
import NewCircle from './PlotRework/Plot/DataComponents/Circles/Circle';
import NewAggregatingCircles from './PlotRework/Plot/DataComponents/Circles/AggregatingCircles';
import NewBar from './PlotRework/Plot/DataComponents/Bar/Bar';
import NewBarAggregate from './PlotRework/Plot/DataComponents/Bar/BarAggregate';
import NewHeatMap from './PlotRework/Plot/DataComponents/HeatMap';
import NewPill from './PlotRework/Plot/DataComponents/Pill';
import NewDataSeriesGroup from './PlotRework/Plot/Legend/DataSeriesGroup';
import NewHorizontalMarker from './PlotRework/Plot/Annotations/HorizontalMarker';
import NewVerticalMarker from './PlotRework/Plot/Annotations/VerticalMarker';
import NewOverlayBox from './PlotRework/Plot/Annotations/OverlayBox';
import NewInfobox from './PlotRework/Plot/Annotations/Infobox';
import NewInteractiveButton from './PlotRework/Plot/Interaction/InteractiveButton';

const NewPlot = {
    Plot: NewPlotPlot,
    PlotGroup: NewPlotGroup,
    ValueXAxis: NewValueXAxis,
    TimeXAxis: NewTimeXAxis,
    LogXAxis: NewLogXAxis,
    ValueYAxis: NewValueYAxis,
    ValueYAxisGroup: NewValueYAxisGroup,
    Line: NewLine,
    StreamingLine: NewStreamingLine,
    Circles: NewCircles,
    Circle: NewCircle,
    AggregatingCircles: NewAggregatingCircles,
    Bar: NewBar,
    BarAggregate: NewBarAggregate,
    HeatMap: NewHeatMap,
    Pill: NewPill,
    DataSeriesGroup: NewDataSeriesGroup,
    HorizontalMarker: NewHorizontalMarker,
    VerticalMarker: NewVerticalMarker,
    OverlayBox: NewOverlayBox,
    Infobox: NewInfobox,
    InteractiveButton: NewInteractiveButton
};

export { 
    NewPlot,
    Plot,
    PlotGroup,
    Line,
    HeatMapChart,
    LineWithThreshold,
    Button,
    HorizontalMarker,
    VerticalMarker,
    SymbolicMarker,
    Circle,
    Pill,
    AggregatingCircles,
    Infobox,
    AxisMap,
    HighlightBox,
    PointNode,
    StreamingLine,
    LegendEntry,
    Legend,
    DataLegend,
    Bar,
    BarAggregate,
    CircleGroup
 };
