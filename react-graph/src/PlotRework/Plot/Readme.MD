# react-graph

![gemstone logo](https://raw.githubusercontent.com/gemstone/web/master/docs/img/gemstone-square-128.png)

The Gemstone Web Library organizes all Gemstone functionality related to web.

[![GitHub license](https://img.shields.io/github/license/gemstone/web?color=4CC61E)](https://github.com/gemstone/web/blob/master/LICENSE)
## Installation

```bash
npm install @gpa-gemstone/react-graph
```

## Quick Start

```tsx
import { Plot, ValueXAxis, ValueYAxis, Line } from '@gpa-gemstone/react-graph';

const BasicExample = () => (
    <Plot>
        <ValueXAxis Label="Day of Week">
            <ValueYAxis Label="Frequency (HZ)">
                <Line
                    Label="Channel A"
                    Color="steelblue"
                    Data={[
                        [1772829472339, 59.84],
                        [1772829472340, 59.57],
                        [1772829472341, 60.24],
                        [1772829472342, 59.13], 
                        [1772829472343, 60.51], 
                        [1772829472344, 60.12], 
                        [1772829472345, 59.94]
                    ]}
                />
            </ValueYAxis>
        </ValueXAxis>
    </Plot>
);
```

Data components are nested inside their axes. The nesting determines which X and Y axis each component binds to. If you omit `Width`/`Height`, the plot fills its parent container.

## Axes

| Component | Description |
|-----------|-------------|
| `ValueXAxis` | Linear numeric X axis with auto-ticking |
| `TimeXAxis` | Time-based X axis (ms since epoch) with adaptive tick formatting from milliseconds to decades |
| `LogXAxis` | Logarithmic X axis |
| `ValueYAxis` | Linear numeric Y axis, supports left/right positioning |
| `ValueYAxisGroup` | Groups multiple Y axes on the same side for stacked axis layouts |

All axes support `MinDomain`/`MaxDomain` props for fixed ranges. Omit them for auto-scaling based on registered data.

### Time Series Example

```tsx
import { Plot, TimeXAxis, ValueYAxis, Line } from '@gpa-gemstone/react-graph';
    <TimeXAxis Label="Duration" ShowGrid>
        <ValueYAxis Label="Voltage (V)" ShowGrid>
            <Line
                Label="Voltage"
                Color="red"
                Data={data}
                HighlightHover={true}
            />
        </ValueYAxis>
    </TimeXAxis>
</Plot>
```

### Multiple Y Axes

```tsx
import { Plot, ValueXAxis, ValueYAxis, ValueYAxisGroup, Line } from '@gpa-gemstone/react-graph';

<Plot Height={400} Width={800}>
    <ValueXAxis Label="Time">
        <ValueYAxisGroup Position="left">
            <ValueYAxis Label="Temperature (C)">
                <Line Label="Temp" Color="red" Data={tempData} />
            </ValueYAxis>
            <ValueYAxis Label="Pressure (kPa)">
                <Line Label="Pressure" Color="blue" Data={pressureData} />
            </ValueYAxis>
        </ValueYAxisGroup>
    </ValueXAxis>
</Plot>
```

## Data Components

| Component | Description |
|-----------|-------------|
| `Line` | Line plot with optional points and hover highlighting |
| `StreamingLine` | Line that re-renders on a timer interval for live data |
| `Circles` | Scatter plot (array of `[x, y]` points) |
| `Circle` | Single data point with optional text label |
| `AggregatingCircles` | Circles that cluster together based on a custom aggregation function |
| `Bar` | Stacked bar with per-segment style overrides |
| `HeatMap` | Colored rectangles where a z-value controls intensity |
| `Pill` | Rounded rectangle defined by X/Y data ranges, with optional text |

All data components auto-register with their parent axes for domain auto-scaling.

### Legend and Grouping

Data components that accept a `Label` prop automatically get a clickable legend entry. Click to toggle visibility. For a shared legend entry and shared styling across multiple data components, wrap them in a `DataSeriesGroup`:

```tsx
import { DataSeriesGroup, Line, Circles } from '@gpa-gemstone/react-graph';

<DataSeriesGroup Label="Sensor A" Color="green" StrokeDasharray="5,5">
    <Line Data={lineData} />
    <Circles Data={scatterData} />
</DataSeriesGroup>
```

Legend position is controlled at the `Plot` level via the `LegendPosition` prop (`'bottom'`, `'left'`, or `'right'`), or overridden per-series.

## Annotations

| Component | Description |
|-----------|-------------|
| `HorizontalMarker` | Horizontal line at a Y value (thresholds, limits) |
| `VerticalMarker` | Vertical line at an X value (events, cursors) |
| `OverlayBox` | Shaded rectangular region over an X range |
| `Infobox` | Arbitrary HTML anchored to a data-space coordinate, supports dragging |

```tsx
import { HorizontalMarker, VerticalMarker } from '@gpa-gemstone/react-graph';

<ValueYAxis Label="Value">
    <Line Label="Signal" Data={data} Color="steelblue" />
    <HorizontalMarker Value={75} Color="red" StrokeDasharray="5,5" />
    <VerticalMarker Value={1500} Color="orange" Width={1} />
</ValueYAxis>
```

## Interaction

The plot ships with built-in zoom (rectangle, X-only, Y-only), pan, scroll-wheel zoom, and crosshairs. Control visibility of interaction buttons via props on `Plot`:

```tsx
<Plot
    Height={400}
    Width={800}
    ShowZoom={true}
    ShowPan={true}
    ShowReset={true}
    ShowCapture={true}
    InteractionBtnsPosition="horizontal-right"
    KeepInteractionBtnsOpen={true}
>
    ...
</Plot>
```

Custom buttons can be added as direct children of `Plot`:

```tsx
import { Plot, InteractiveButton } from '@gpa-gemstone/react-graph';

<Plot Height={400} Width={800}>
    <InteractiveButton
        Icon={<circle cx="12" cy="12" r="6" />}
        OnClick={() => console.log('clicked')}
    />
    ...
</Plot>
```

### Select Mode

For custom click/drag interactions, register select handlers via the `InteractionContext` and set the mode to `'select'`. The `Infobox` component supports dragging out of the box when `Draggable` is set.

## Capture

Set `ShowCapture` on `Plot` to add a screenshot button to the interaction tray. Uses `html2canvas` to rasterize the entire plot (SVG + HTML legend) as PNG or JPG.

```tsx
<Plot ShowCapture={true} CaptureOptions={{ Filename: 'my-chart', Format: 'png' }}>
    ...
</Plot>
```