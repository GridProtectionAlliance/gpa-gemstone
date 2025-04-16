// ******************************************************************************************************
//  Plot.tsx - Gbtc
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
//  03/18/2021 - C Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************


import * as React from 'react';
import * as _ from 'lodash';
import InteractiveButtons from './InteractiveButtons';
import { IDataSeries, IHandlers, ContextWrapper, IActionFunctions, AxisIdentifier, AxisMap, SelectType } from './GraphContext';
import { CreateGuid } from '@gpa-gemstone/helper-functions';
import { isEqual } from 'lodash';
import TimeAxis from './TimeAxis';
import LogAxis from './LogAxis';
import YValueAxis from './YValueAxis';
import Legend from './Legend';
import LineWithThreshold from './LineWithThreshold';
import Line from './Line';
import Button from './Button';
import HorizontalMarker from './HorizontalMarker';
import VerticalMarker from './VerticalMarker';
import SymbolicMarker from './SymbolicMarker';
import Circle from './Circle';
import Oval from './Oval'
import AggregatingCircles from './AggregatingCircles';
import Infobox from './Infobox';
import HeatMapChart from './HeatMapChart';
import * as _html2canvas from "html2canvas";
import HighlightBox from './HighlightBox';
import XValueAxis from './XValueAxis';
import StreamingLine from './StreamingLine';
import PlotGroupContext from './PlotGroupContext';
const html2canvas: any = _html2canvas;

// A ZoomMode of AutoValue means it will zoom on time, and auto Adjust the Value to fit the data.
// HalfAutoValue is the same as AutoValue except it "pins" either max or min at zero
// divCaptureId allows the div to be captured to be external to this plot
export interface IProps {
  defaultTdomain: [number, number],
  defaultYdomain?: [number, number] | [number, number][],
  defaultMouseMode?: SelectType,
  yDomain?: 'Manual' | 'AutoValue' | 'HalfAutoValue',
  hideYAxis?: boolean
  limitZoom?: boolean
  height: number,
  width: number,

  showGrid?: boolean,
  XAxisType?: 'time' | 'log' | 'value',
  zoom?: boolean,
  pan?: boolean,
  Tmin?: number,
  Tmax?: number,
  showBorder?: boolean,
  Tlabel?: string,
  Ylabel?: string | string[],
  holdMenuOpen?: boolean,
  menuLocation?: 'left' | 'right' | 'hide',
  legend?: 'hidden' | 'bottom' | 'right',
  // Boolean arguements deprecated
  showMouse?: boolean | 'horizontal' | 'vertical' | 'none',
  legendHeight?: number,
  legendWidth?: number,
  useMetricFactors?: boolean,
  showDateOnTimeAxis?: boolean,
  cursorOverride?: string,
  onSelect?: (x: number, y: number[], actions: IActionFunctions) => void,
  onCapture?: (legendHeightRequired: number) => string | undefined,
  onCaptureComplete?: () => void,
  onDataInspect?: (tDomain: [number, number]) => void,
  Ymin?: number | number[],
  Ymax?: number | number[],
  snapMouse?: boolean
}

const SvgStyle: React.CSSProperties = {
  fill: 'none',
  userSelect: 'none',
  WebkitTouchCallout: 'none',
  WebkitUserSelect: 'none',
  KhtmlUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  pointerEvents: 'none',
};

const defaultLegendHeight = 50;
const defaultLegendWidth = 100;

const Plot: React.FunctionComponent<IProps> = (props) => {
  // Type correcting functions to convert props into something usable
  const typeCorrect: <T>(arg: T | T[] | undefined, arrayIndex: number) => T | undefined = React.useCallback((arg, arrayIndex) => {
    if (arg == null) return undefined;
    if (!(arg instanceof Object) || !Object.prototype.hasOwnProperty.call(arg, 'length')) return (arrayIndex === 0 ? arg : undefined);
    return (arg as any)[arrayIndex];
  }, []);
  const typeCorrectDomain = React.useCallback((arg: [number, number] | [number, number][] | undefined): [number, number][] => {
    if (arg === undefined || arg.length === 0) return [[0, 1], [0, 1]];
    if (typeof (arg[0]) === 'number') return [arg, [0, 1]] as [number, number][];
    return (arg as [number, number][]);
  }, []);
  /*
    Actual plot that will handle Axis etc.
  */
  const SVGref = React.useRef<any>(null);
  const handlers = React.useRef<Map<string, IHandlers>>(new Map<string, IHandlers>());
  const wheelTimeout = React.useRef<{ timeout?: NodeJS.Timeout, stopScroll: boolean }>({ timeout: undefined, stopScroll: false });
  const heightChange = React.useRef<{ timeout?: NodeJS.Timeout, extraNeeded: number, captureID?: string }>(
    { timeout: undefined, extraNeeded: 0, captureID: undefined });

  const guid = React.useMemo(() => CreateGuid(), []);

  const data = React.useRef<Map<string, IDataSeries>>(new Map<string, IDataSeries>())
  const [dataGuid, setDataGuid] = React.useState<string>("");

  const [tDomain, setTdomain] = React.useState<[number, number]>(props.defaultTdomain);
  const [tOffset, setToffset] = React.useState<number>(0);
  const [tScale, setTscale] = React.useState<number>(1);

  const [yDomain, setYdomain] = React.useState<[number, number][]>(Array(AxisMap.size).fill([0, 0]));
  const [yOffset, setYoffset] = React.useState<number[]>(Array(AxisMap.size).fill(0));
  const [yScale, setYscale] = React.useState<number[]>(Array(AxisMap.size).fill(1));
  // ToDo: This is hardset to two because it's tied to display, 'left' and 'right'
  const [yHasData, setYHasData] = React.useState<boolean[]>(Array(2).fill(0));

  const [mouseMode, setMouseMode] = React.useState<'none' | SelectType>('none');
  const [selectedMode, setSelectedMode] = React.useState<SelectType>(props.defaultMouseMode ?? 'zoom-rectangular');

  const [mouseIn, setMouseIn] = React.useState<boolean>(false);
  const [mousePosition, setMousePosition] = React.useState<[number, number]>([0, 0]);
  const [mousePositionSnap, setMousePositionSnap] = React.useState<[number, number]>([0, 0]);
  const [mouseClick, setMouseClick] = React.useState<[number, number]>([0, 0]);
  const [mouseStyle, setMouseStyle] = React.useState<string>("default");
  const moveRequested = React.useRef<boolean>(false);

  const [photoReady, setPhotoReady] = React.useState<boolean>(false);

  const [offsetTop, setOffsetTop] = React.useState<number>(10);
  const [offsetBottom, setOffsetBottom] = React.useState<number>(10);
  const [offsetLeft, setOffsetLeft] = React.useState<number>(5);
  const [offsetRight, setOffsetRight] = React.useState<number>(5);

  const [heightYFactor, setHeightYFactor] = React.useState<number>(0);
  const [heightXLabel, setHeightXLabel] = React.useState<number>(0);
  const [heightLeftYLabel, setHeightLeftYLabel] = React.useState<number>(0);
  const [heightRightYLabel, setHeightRightYLabel] = React.useState<number>(0);

  // States for Props to avoid change notification on ref change
  const [defaultTdomain, setDefaultTdomain] = React.useState<[number, number]>(props.defaultTdomain);
  const [defaultYdomain, setDefaultYdomain] = React.useState<[number, number][]>(typeCorrectDomain(props.defaultYdomain));
  const [updateFlag, setUpdateFlag] = React.useState<number>(0);

  const [legendHeight, setLegendHeight] = React.useState<number>(props.legendHeight ?? defaultLegendHeight);
  const [legendWidth, setLegendWidth] = React.useState<number>(props.legendWidth ?? defaultLegendWidth);
  const [svgHeight, setSVGheight] = React.useState<number>(props.height);
  const [svgWidth, setSVGwidth] = React.useState<number>(props.width);
  const [menueWidth, setMenueWidth] = React.useState<number>(28);

  const groupContext = React.useContext(PlotGroupContext);

  const legendWidthToUse = React.useMemo(() => {
    return groupContext.HasConsumer ? groupContext.LegendWidth : legendWidth
  }, [groupContext.HasConsumer, legendWidth, groupContext.LegendWidth])

  React.useEffect(() => {
    if (!groupContext.HasConsumer) return

    groupContext.RegisterLegendWidth(guid, legendWidth)

  }, [legendWidth, groupContext.RegisterLegendWidth, groupContext.HasConsumer, guid])

  React.useEffect(() => {
    if (!groupContext.HasConsumer) return

    return () => {
      groupContext.UnRegisterLegendWidth(guid)
    }
  }, [guid, groupContext.HasConsumer, groupContext.UnRegisterLegendWidth])

  const applyToYDomain = React.useCallback((predicate: (domain: [number, number], axis: number, allDomains: [number, number][]) => boolean): void => {
    const newDomain = [...yDomain];
    let apply = false;
    newDomain.forEach((d, i, a) => {
      // Note: Apply MUST be after predicate, or it short-circuits it
      apply = predicate(d, i, a) || apply;
    })
    if (apply) {
      setYdomain(newDomain);
    }
  }, [yDomain]);

  // Effect to Reset the legend width/height
  React.useEffect(() => {
    if (props.legendHeight !== undefined) setLegendHeight(props.legendHeight);
  }, [props.legendHeight]);

  React.useEffect(() => {
    if (props.legendWidth !== undefined) setLegendWidth(props.legendWidth);
  }, [props.legendWidth]);

  // Recompute height and width
  React.useEffect(() => {
    setSVGheight(props.height - (props.legend === 'bottom' ? legendHeight : 0));
  }, [props.height, props.legend, legendHeight]);

  React.useEffect(() => {
    setSVGwidth(props.width - (props.legend === 'right' ? legendWidthToUse : 0));
  }, [props.width, props.legend, legendWidthToUse]);

  // enforce T limits
  React.useEffect(() => {
    if (props.Tmin !== undefined && tDomain[0] < props.Tmin)
      setTdomain((t) => ([props.Tmin ?? 0, t[1]]));
    if (props.Tmax !== undefined && tDomain[1] > props.Tmax)
      setTdomain((t) => ([t[0], props.Tmax ?? 0]));
  }, [tDomain]);

  // enforce Y limits
  React.useEffect(() => {
    const mutateDomain = (domain: [number, number], axis: number, allDomains: [number, number][]): boolean => {
      let hasApplied = false;
      // Need to type correct our arguements
      const propMin: number | undefined = typeCorrect<number>(props.Ymin, axis);
      const propMax: number | undefined = typeCorrect<number>(props.Ymax, axis);
      if (propMin !== undefined && domain[0] < propMin) {
        allDomains[axis] = [propMin, domain[1]];
        hasApplied = true;
      }
      if (propMax !== undefined && domain[1] > propMax) {
        allDomains[axis] = [domain[0], propMax];
        hasApplied = true;
      }
      return hasApplied;
    }
    applyToYDomain(mutateDomain);
  }, [yDomain])

  React.useEffect(() => {
    if (!isEqual(defaultTdomain, props.defaultTdomain))
      setDefaultTdomain(props.defaultTdomain);
  }, [props.defaultTdomain])

  React.useEffect(() => {
    if (!isEqual(defaultYdomain, props.defaultYdomain))
      setDefaultYdomain(typeCorrectDomain(props.defaultYdomain));
  }, [props.defaultYdomain])

  React.useEffect(() => {
    setTdomain(defaultTdomain);
  }, [defaultTdomain])

  React.useEffect(() => {
    setYdomain(defaultYdomain);
  }, [defaultYdomain])

  // Adjust top and bottom Offset
  React.useEffect(() => {
    const top = heightYFactor + 10;
    const bottom = heightXLabel;
    if (offsetTop !== top)
      setOffsetTop(top);
    if (offsetBottom !== bottom)
      setOffsetBottom(bottom);
  }, [heightXLabel, heightYFactor])

  // Adjust Left Offset
  React.useEffect(() => {
    const left = heightLeftYLabel + (props.menuLocation === 'left' ? (menueWidth + 2) : 10);
    setOffsetLeft(left);
  }, [heightLeftYLabel, props.menuLocation, menueWidth]);

  // Adjust Right Offset
  React.useEffect(() => {
    const right = heightRightYLabel + ((props.menuLocation === 'right' || props.menuLocation === undefined) ? (menueWidth + 2) : 10);
    setOffsetRight(right);
  }, [heightRightYLabel, props.menuLocation, menueWidth]);

  // Adjust Y domain defaults
  React.useEffect(() => {
    if (props.yDomain !== 'AutoValue' && props.yDomain !== 'HalfAutoValue') return;

    const dataReducerFunc = (result: number[], series: IDataSeries, func: (tDomain: [number, number]) => number | undefined, axis: number) => {
      // This part of the data may not belong to the axis we care about at the moment
      const dataAxis = AxisMap.get(series.axis);
      if (axis === dataAxis) {
        const value = func([Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]);
        if (value !== undefined) result.push(value);
      }
      return result;
    }

    const newDefaultDomain: [number, number][] = defaultYdomain.map((yDomain, axis) => {
      const yMin = Math.min(...[...data.current.values()].reduce((result: number[], series: IDataSeries) => dataReducerFunc(result, series, series.getMin, axis), []));
      const yMax = Math.max(...[...data.current.values()].reduce((result: number[], series: IDataSeries) => dataReducerFunc(result, series, series.getMax, axis), []));
      if (!isNaN(yMin) && !isNaN(yMax) && isFinite(yMin) && isFinite(yMax)) {
        if (props.yDomain === 'AutoValue') return [yMin, yMax];
        // If this condition is satisfied, it means our series is mostly positive range
        else if (Math.abs(yMax) >= Math.abs(yMin)) return [0, yMax];
        else return [yMin, 0];
      }
      return [0, 1];
    });

    if (!_.isEqual(newDefaultDomain, defaultYdomain)) setDefaultYdomain(newDefaultDomain);
  }, [dataGuid, props.yDomain]);

  React.useEffect(() => {
    const newHasData: boolean[] = Array<boolean>(2);
    const hasFunc = (axis: AxisIdentifier) => [...data.current.values()].some(series => AxisMap.get(axis) === AxisMap.get(series.axis));
    newHasData[0] = hasFunc('left');
    newHasData[1] = hasFunc('right');
    setYHasData(newHasData);
  }, [dataGuid]);

  // Adjust x axis
  React.useEffect(() => {
    let dT = tDomain[1] - tDomain[0];
    let dTmin = tDomain[0];

    if (dT === 0)
      return;

    if (props.XAxisType === 'log') {
      dT = Math.log10(tDomain[1]) - Math.log10(tDomain[0]);
      dTmin = Math.log10(tDomain[0]);
    }

    const scale = (svgWidth - offsetLeft - offsetRight) / dT;

    setTscale(scale);
    setToffset(offsetLeft - dTmin * scale);
  }, [tDomain, offsetLeft, offsetRight, props.XAxisType, svgWidth]);

  // Adjust y axis
  React.useEffect(() => {
    const mutateFunction = (scaleArray: number[], offsetArray: number[], axis: number) => {
      const dY = yDomain[axis][1] - yDomain[axis][0];
      const scale = (svgHeight - offsetTop - offsetBottom) / (dY === 0 ? 0.00001 : dY);
      scaleArray[axis] = -scale;
      offsetArray[axis] = svgHeight - offsetBottom + yDomain[axis][0] * scale;
    }
    // Update every axis
    const newScale = [...yScale];
    const newOffset = [...yOffset];
    for (const axis of AxisMap.values())
      mutateFunction(newScale, newOffset, axis);
    setYscale(newScale);
    setYoffset(newOffset);

  }, [yDomain, offsetTop, offsetBottom, svgHeight]);

  React.useEffect(() => { setUpdateFlag((x) => x + 1) }, [tScale, tOffset, yScale, yOffset])

  // Change mouse cursor
  React.useEffect(() => {
    let newCursor;
    if (props.cursorOverride == null) {
      switch (selectedMode) {
        case 'pan':
          newCursor = 'grab';
          break;
        case 'select':
          newCursor = 'pointer';
          break;
        default:
          newCursor = 'crosshair';
      }
    } else newCursor = props.cursorOverride;
    setMouseStyle(newCursor);
  }, [selectedMode, props.cursorOverride])

  // Stop scrolling while zooming
  React.useEffect(() => {
    const cancelWheel = (e: WheelEvent) => { if (wheelTimeout.current.stopScroll) e.preventDefault() }
    document.body.addEventListener('wheel', cancelWheel, { passive: false });
    return () => document.body.removeEventListener('wheel', cancelWheel);
  }, []);

  // Execute Plot Capture and leave photo mode
  React.useEffect(() => {
    // ToDo: We can clean this up some and improve performance using html2canvas options (but the biggest hurdle is the legend, which we don't have a lot of options for...)
    if (!photoReady) return;
    // we can't immediately complete the request, since some layout things may still be changing...
    clearTimeout(heightChange.current.timeout);
    // timeout to set if we don't see any more changes within 0.05 seconds
    heightChange.current.timeout = setTimeout(() => {
      const id = heightChange.current.captureID ?? guid;
      const element = document.getElementById(id);
      if (element == null) {
        console.error(`Could not find document element with id ${id}`);
      } else {
        html2canvas(element).then((canvas: HTMLCanvasElement) => {
          document.body.appendChild(canvas);
          const imageData = canvas.toDataURL("image/png").replace(/^data:image\/png/, "data:application/octet-stream");
          const anchorElement = document.createElement(`a`);
          anchorElement.href = imageData;
          anchorElement.download = `${id}.png`;
          document.body.appendChild(anchorElement);
          anchorElement.click();
          // Removing children created/cleanup
          window.URL.revokeObjectURL(imageData);
          document.body.removeChild(anchorElement);
          document.body.removeChild(canvas);
        });
      }
      setPhotoReady(false);
      if (props.onCaptureComplete !== undefined) props.onCaptureComplete();
    }, 50);
  });

  // requests new legend height/width upto a defined maximum set by props
  const requestLegendHeightChange = React.useCallback((newHeight: number) => {
    const heightLimit = props.legend !== 'bottom' ? svgHeight : (props.legendHeight ?? defaultLegendHeight);
    if (!photoReady) heightChange.current.extraNeeded = Math.max(newHeight - heightLimit, 0);
    if (props.legend !== 'bottom') return;
    const limitedHeight = Math.min(newHeight, heightLimit);
    if (legendHeight !== limitedHeight) setLegendHeight(limitedHeight);
  }, [props.legendHeight, legendHeight, props.legend, photoReady]);

  const requestLegendWidthChange = React.useCallback((newWidth: number) => {
    if (newWidth < 0) return;
    if (props.legend !== 'right') return;
    const limitedWidth = Math.min(newWidth, props.legendWidth ?? defaultLegendWidth);
    if (legendWidth !== limitedWidth) setLegendWidth(limitedWidth);
  }, [props.legendWidth, legendWidth, props.legend]);

  // transforms from pixels into x value. result passed into onClick function 
  const xInvTransform = React.useCallback((p: number) => {
    let xT = (p - tOffset) / tScale;
    if (props.XAxisType === 'log')
      xT = Math.pow(10, (p - tOffset) / tScale);
    return xT;
  }, [tOffset, tScale, props.XAxisType]);

  // transforms from pixels into y value. result passed into onClick function
  const yInvTransform = React.useCallback((p: number, a: AxisIdentifier | number) => {
    const axis = (typeof (a) !== 'number') ? AxisMap.get(a) : a;
    return (p - yOffset[axis]) / yScale[axis];
  }, [yOffset, yScale]);

  const Reset = React.useCallback(() => {
    setTdomain(defaultTdomain);
    setYdomain(defaultYdomain);
  }, [defaultYdomain, defaultTdomain]);

  // new X transformation from x value into Pixels
  const xTransform = React.useCallback((value: number) => {
    let xT = value * tScale + tOffset;
    if (props.XAxisType === 'log') {
      const v = (value === 0 ? tDomain[0] * 0.01 : value);
      xT = Math.log10(v) * tScale + tOffset;
    }
    return xT;
  }, [tScale, tOffset, props.XAxisType, tDomain])

  // new Y transformation from y value into Pixels
  const yTransform = React.useCallback((value: number, a: AxisIdentifier | number) => {
    const axis = (typeof (a) !== 'number') ? AxisMap.get(a) : a;
    return value * yScale[axis] + yOffset[axis];
  }, [yScale, yOffset]);

  // applies offset and contraints to x Pixel value to get something that is plotable
  const xApplyOffset = React.useCallback((value: number) => {
    if (value >= 0)
      return Math.min(value + offsetLeft, svgWidth - offsetRight);
    else
      return Math.max(offsetLeft, svgWidth - offsetRight + value);
  }, [offsetLeft, offsetRight, svgWidth]);

  // applies offset and contraints to y Pixel value to get something that is plotable
  const yApplyOffset = React.useCallback((value: number) => {
    if (value >= 0)
      return Math.min(value + offsetTop, svgHeight - offsetBottom);
    else
      return Math.max(offsetTop, svgHeight - offsetBottom + value);
  }, [offsetTop, offsetBottom, svgHeight]);

  const setData = React.useCallback((key: string, d?: IDataSeries) => {
    setDataGuid(CreateGuid());
    if (d != null)
      data.current.set(key, d)
    else
      data.current.delete(key)
  }, [])

  const addData = React.useCallback((d: IDataSeries) => {
    const key = CreateGuid();
    setData(key, d);
    return key;
  }, []);

  const setLegend = React.useCallback((key: string, legend?: React.ReactElement) => {
    const series = data.current.get(key);
    if (series === undefined)
      return;

    series.legend = legend;
    data.current.set(key, series);
  }, []);

  function snapMouseToClosestSeries(pixelPt: { x: number, y: number }): { x: number, y: number } {
    const xVal = xInvTransform(pixelPt.x);
    const findClosestPoint = (result: { pt: { x: number, y: number }, distSq: number | undefined }, series: IDataSeries) => {
      const pointArray = series.getPoints(xVal, 7);
      if (pointArray === undefined) return result;
      const ptArrayResult = pointArray.reduce((result: { pt: { x: number, y: number }, distSq: number | undefined }, pt) => {
        const point = [xTransform(pt[0]), yTransform(pt[1], AxisMap.get(series.axis))];
        const newDistSq = (point[0] - pixelPt.x) ** 2 + (point[1] - pixelPt.y) ** 2;
        if (result.distSq === undefined || newDistSq < result.distSq) return { pt: { x: point[0], y: point[1] }, distSq: newDistSq };
        return result;

      }, { pt: { x: 0, y: 0 }, distSq: undefined });
      if (ptArrayResult.distSq !== undefined && (result.distSq === undefined || ptArrayResult.distSq < result.distSq)) return ptArrayResult;
      return result;
    }

    return [...data.current.values()].reduce((result: { pt: { x: number, y: number }, distSq: number | undefined }, series) => findClosestPoint(result, series), { pt: { x: 0, y: 0 }, distSq: undefined }).pt;
  }

  const registerSelect = React.useCallback((handler: IHandlers) => {
    const key = CreateGuid();
    handlers.current.set(key, handler)
    return key;
  }, []);

  const removeSelect = React.useCallback((key: string) => {
    handlers.current.delete(key)
  }, []);

  const updateSelect = React.useCallback((key: string, handler: IHandlers) => {
    handlers.current.set(key, handler)
  }, []);

  const setSelection = React.useCallback((s: string) => {
    if (s === "reset") Reset();
    else if (s === "download") { if (props.onDataInspect !== undefined) props.onDataInspect(tDomain); }
    else if (s === "capture") {
      setPhotoReady(true);
      if (props.onCapture !== undefined) heightChange.current.captureID = props.onCapture(heightChange.current.extraNeeded);
    }
    else setSelectedMode(s as ('zoom-rectangular' | 'zoom-vertical' | 'zoom-horizontal' | 'pan' | 'select'))
  }, [tDomain, Reset, props.onDataInspect]);

  const getConstrainedYDomain = React.useCallback((newTDomain: [number, number]): [number, number][] => {
    const dataReducerFunc = (result: number[], series: IDataSeries, func: (tDomain: [number, number]) => number | undefined, axis: number) => {
      // This part of the data may not belong to the axis we care about at the moment
      const dataAxis = AxisMap.get(series.axis);
      if (axis === dataAxis) {
        const value = func(newTDomain);
        if (value !== undefined) result.push(value);
      }
      return result;
    }
    return yDomain.map((oldDomain, axis) => {
      const yMin = Math.min(...[...data.current.values()].reduce((result: number[], series: IDataSeries) => dataReducerFunc(result, series, series.getMin, axis), []));
      const yMax = Math.max(...[...data.current.values()].reduce((result: number[], series: IDataSeries) => dataReducerFunc(result, series, series.getMax, axis), []));
      if (!isNaN(yMin) && !isNaN(yMax) && isFinite(yMin) && isFinite(yMax)) return [yMin, yMax];
      return yDomain[axis];
    });
  }, [dataGuid, yDomain]);

  function handleMouseWheel(evt: any) {
    if (props.zoom !== undefined && !props.zoom)
      return;
    if (!selectedMode.includes('zoom'))
      return;
    if (!mouseIn)
      return;

    // while wheel is moving, do not release the lock
    clearTimeout(wheelTimeout.current.timeout);
    wheelTimeout.current.stopScroll = true;

    // flag indicating to lock page scrolling
    wheelTimeout.current.timeout = setTimeout(() => {
      wheelTimeout.current.stopScroll = false;
    }, 200);

    let multiplier = 1.25;

    // event.deltaY positive is wheel down or out and negative is wheel up or in
    if (evt.deltaY < 0) multiplier = 0.75;

    if (selectedMode !== 'zoom-horizontal') {
      let x0 = xTransform(tDomain[0]);
      let x1 = xTransform(tDomain[1]);
      if (mousePosition[0] < offsetLeft)
        x1 = multiplier * (x1 - x0) + x0;
      else if (mousePosition[0] > (svgWidth - offsetRight))
        x0 = x1 - multiplier * (x1 - x0);
      else {
        const Xcenter = mousePosition[0];
        x0 = Xcenter - (Xcenter - x0) * multiplier;
        x1 = Xcenter + (x1 - Xcenter) * multiplier;
      }
      if ((x1 - x0) > 10) {
        let newTDomain: [number, number];
        if (props.limitZoom ?? false) newTDomain = [Math.max(defaultTdomain[0], xInvTransform(x0)), Math.min(defaultTdomain[1], xInvTransform(x1))]
        else newTDomain = [xInvTransform(x0), xInvTransform(x1)];
        if (selectedMode === 'zoom-vertical') {
          const newYDomain = getConstrainedYDomain(newTDomain);
          if (!_.isEqual(newYDomain, yDomain)) setYdomain(newYDomain);
        }
        setTdomain(newTDomain);
      }
    }

    if (selectedMode !== 'zoom-vertical') {
      const newYDomain = yDomain.map((domain: [number, number], axis: number, allDomains: [number, number][]): [number, number] => {
        let y0 = yTransform(domain[0], axis);
        let y1 = yTransform(domain[1], axis);

        if (mousePosition[1] < offsetTop)
          y1 = multiplier * (y1 - y0) + y0;

        else if (mousePosition[1] > (svgHeight - offsetBottom))
          y0 = y1 - multiplier * (y1 - y0);

        else {
          const Ycenter = mousePosition[1];
          y0 = Ycenter - (Ycenter - y0) * multiplier;
          y1 = Ycenter + (y1 - Ycenter) * multiplier;
        }

        if (Math.abs(y1 - y0) > 10) {
          if (props.limitZoom ?? false) return [Math.max(defaultYdomain[axis][0], yInvTransform(y0, axis)), Math.min(defaultYdomain[axis][1], yInvTransform(y1, axis))];
          return [yInvTransform(y0, axis), yInvTransform(y1, axis)];
        }
        return domain;
      });
      if (!_.isEqual(newYDomain, yDomain)) {
        // todo: added contraint to t domain when mode is zoom-horizontal
        setYdomain(newYDomain);
      }
    }
  }

  function handleMouseMove(evt: any) {
    if (!moveRequested.current)
      requestAnimationFrame(() => mouseMoveEvent(evt));
    moveRequested.current = true;
  }

  function mouseMoveEvent(evt: any) {
    moveRequested.current = false;
    if (SVGref.current == null)
      return;
    const pt = SVGref.current!.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const ptTransform = pt.matrixTransform(SVGref.current!.getScreenCTM().inverse());

    if (mouseMode === 'pan') {
      const dP = mousePosition[0] - ptTransform.x;
      const Plower = xTransform(tDomain[0]);
      const Pupper = xTransform(tDomain[1])
      const Tmin = xInvTransform(Plower + dP);
      const Tmax = xInvTransform(Pupper + dP);
      if (
        (props.Tmin === undefined || Tmin > props.Tmin) &&
        (props.Tmax === undefined || Tmax < props.Tmax))
        setTdomain([Tmin, Tmax]);

      const zoomYAxis = (domain: [number, number], axis: number, allDomains: [number, number][]): boolean => {
        const dY = yInvTransform(mousePosition[1], axis) - yInvTransform(ptTransform.y, axis);
        // Need to type correct our arguements
        const propMin: number | undefined = typeCorrect<number>(props.Ymin, axis);
        const propMax: number | undefined = typeCorrect<number>(props.Ymax, axis);
        if (
          (propMin === undefined || domain[0] + dY > propMin) &&
          (propMax === undefined || domain[1] + dY < propMax)) {
          allDomains[axis] = [domain[0] + dY, domain[1] + dY];
          return true;
        }
        return false;
      }
      applyToYDomain(zoomYAxis);
    }
    setMousePosition([ptTransform.x, ptTransform.y]);
    // Here on mouse is snapped (if neccessary)
    let ptFinal: { x: number, y: number };
    if (props.snapMouse ?? false) ptFinal = snapMouseToClosestSeries(ptTransform);
    else ptFinal = ptTransform;
    setMousePositionSnap([ptFinal.x, ptFinal.y]);
    if (handlers.current.size > 0)
      handlers.current.forEach((v) => (v.onMove !== undefined ? v.onMove(xInvTransform(v.allowSnapping ? ptFinal.x : ptTransform.x), yInvTransform(v.allowSnapping ? ptFinal.y : ptTransform.y, v.axis)) : null));
  }

  function handleMouseDown(evt: any) {
    if (SVGref.current == null)
      return;

    const pt = SVGref.current!.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const ptTransform = pt.matrixTransform(SVGref.current!.getScreenCTM().inverse())
    setMouseClick([ptTransform.x, ptTransform.y]);
    if (selectedMode.includes('zoom') && (props.zoom === undefined || props.zoom))
      setMouseMode(selectedMode);
    if (selectedMode === 'pan' && (props.pan === undefined || props.pan)) {
      setMouseMode('pan');
      setMouseStyle('grabbing');
    }

    // Todo: Review question: can we just use mousePosition and mousePositionSnap here? 
    // Here on mouse is snapped (if neccessary)
    let ptFinal: { x: number, y: number };
    if (props.snapMouse ?? false) ptFinal = snapMouseToClosestSeries(ptTransform);
    else ptFinal = ptTransform;
    if (selectedMode === 'select' && props.onSelect !== undefined)
      props.onSelect(
        xInvTransform(ptFinal.x),
        [...AxisMap.values()].map(axis => yInvTransform(ptFinal.y, axis)),
        {
          setTDomain: updateXDomain as React.SetStateAction<[number, number]>,
          setYDomain: updateYDomain as React.SetStateAction<[number, number][]>
        });
    if (handlers.current.size > 0 && selectedMode === 'select')
      handlers.current.forEach((v) => (v.onClick !== undefined ? v.onClick(xInvTransform(v.allowSnapping ? ptFinal.x : ptTransform.x), yInvTransform(v.allowSnapping ? ptFinal.y : ptTransform.y, v.axis)) : null));
  }

  function handleMouseUp() {
    if (selectedMode === 'pan' && (props.pan === undefined || props.pan))
      setMouseStyle('grab');
    if (mouseMode.includes('zoom')) {

      if ((Math.abs(mousePosition[0] - mouseClick[0]) < 10) && (Math.abs(mousePosition[1] - mouseClick[1]) < 10)) {
        setMouseMode('none');
        return;
      }

      if (mouseMode !== 'zoom-horizontal') {
        const t0 = Math.min(xInvTransform(mousePosition[0]), xInvTransform(mouseClick[0]));
        const t1 = Math.max(xInvTransform(mousePosition[0]), xInvTransform(mouseClick[0]));
        const newTDomain: [number, number] = [Math.max(tDomain[0], t0), Math.min(tDomain[1], t1)];
        if (selectedMode === 'zoom-vertical') {
          const newYDomain = getConstrainedYDomain(newTDomain);
          if (!_.isEqual(newYDomain, yDomain)) setYdomain(newYDomain);
        }
        setTdomain(newTDomain);
      }

      if (mouseMode !== 'zoom-vertical') {
        const newYDomain = yDomain.map((domain: [number, number], axis: number, allDomains: [number, number][]): [number, number] => {
          const y0 = Math.min(yInvTransform(mousePosition[1], axis), yInvTransform(mouseClick[1], axis));
          const y1 = Math.max(yInvTransform(mousePosition[1], axis), yInvTransform(mouseClick[1], axis));
          return [Math.max(domain[0], y0), Math.min(domain[1], y1)];
        });
        if (!_.isEqual(newYDomain, yDomain)) {
          // todo: added contraint to t domain when mode is zoom-horizontal
          setYdomain(newYDomain);
        }
      }
    }
    setMouseMode('none');

    if (handlers.current.size > 0 && selectedMode === 'select')
      handlers.current.forEach((v) => (v.onRelease !== undefined ? v.onRelease(xInvTransform(v.allowSnapping ? mousePositionSnap[0] : mousePosition[0]), yInvTransform(v.allowSnapping ? mousePositionSnap[1] : mousePosition[1], v.axis)) : null));
  }

  function handleMouseOut(_: any) {
    setMouseIn(false);
    if (mouseMode === 'pan')
      setMouseMode('none');

    if (handlers.current.size > 0 && selectedMode === 'select')
      handlers.current.forEach((v) => (v.onPlotLeave !== undefined ? v.onPlotLeave(xInvTransform(v.allowSnapping ? mousePositionSnap[0] : mousePosition[0]), yInvTransform(v.allowSnapping ? mousePositionSnap[1] : mousePosition[1], v.axis)) : null));

  }

  function handleMouseIn(_: any) {
    setMouseIn(true);
  }

  function updateXDomain(x: [number, number]) {
    if (x[0] === tDomain[0] && x[1] === tDomain[1])
      return;

    if (x[0] < x[1])
      setTdomain(x);
    else
      setTdomain([x[1], x[0]]);
  }

  function updateYDomain(y: [number, number][]) {
    const correctFunction = (domain: [number, number], axis: number, allDomains: [number, number][]): boolean => {
      if (y[axis][0] === domain[0] && y[axis][1] === domain[1])
        return false;

      if (y[0] < y[1])
        allDomains[axis] = y[axis];
      else
        allDomains[axis] = [y[axis][1], y[axis][0]];
      return true;
    }
    applyToYDomain(correctFunction);
  }

  return (
    <ContextWrapper
      XDomain={tDomain}
      MousePosition={mousePosition}
      MousePositionSnap={mousePositionSnap}
      YDomain={yDomain}
      CurrentMode={selectedMode}
      MouseIn={mouseIn}
      UpdateFlag={updateFlag}
      Data={data}
      DataGuid={dataGuid}
      XApplyPixelOffset={xApplyOffset}
      YApplyPixelOffset={yApplyOffset}
      XTransform={xTransform}
      YTransform={yTransform}
      XInvTransform={xInvTransform}
      YInvTransform={yInvTransform}
      SetXDomain={updateXDomain}
      SetYDomain={updateYDomain}
      AddData={addData}
      RemoveData={setData}
      UpdateData={setData}
      SetLegend={setLegend}
      RegisterSelect={registerSelect}
      RemoveSelect={removeSelect}
      UpdateSelect={updateSelect}
    >
      <div id={guid} style={{ height: props.height, width: props.width, position: 'relative' }}>
        <div style={{ height: svgHeight, width: svgWidth, position: 'absolute', cursor: mouseStyle }}
          onWheel={handleMouseWheel} onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseOut} onMouseEnter={handleMouseIn} >
          <svg ref={SVGref} width={svgWidth < 0 ? 0 : svgWidth} height={svgHeight < 0 ? 0 : svgHeight}
            style={SvgStyle} viewBox={`0 0 ${svgWidth < 0 ? 0 : svgWidth} ${svgHeight < 0 ? 0 : svgHeight}`}>
            {props.showBorder !== undefined && props.showBorder ? < path stroke='currentColor' d={`M ${offsetLeft} ${offsetTop} H ${svgWidth - offsetRight} V ${svgHeight - offsetBottom} H ${offsetLeft} Z`} /> : null}
            {props.XAxisType === 'time' || props.XAxisType === undefined ?
              <TimeAxis label={props.Tlabel} offsetBottom={offsetBottom} offsetLeft={offsetLeft} offsetRight={offsetRight} width={svgWidth} height={svgHeight} setHeight={setHeightXLabel}
                heightAxis={heightXLabel} showLeftMostTick={!yHasData[0]} showRightMostTick={!yHasData[1]} showDate={props.showDateOnTimeAxis} /> :
              props.XAxisType === 'value' ? <XValueAxis offsetBottom={offsetBottom} offsetLeft={offsetLeft} offsetRight={offsetRight} width={svgWidth} height={svgHeight} setHeight={setHeightXLabel} heightAxis={heightXLabel}
                label={props.Tlabel} showLeftMostTick={!yHasData[0]} showRightMostTick={!yHasData[1]} /> :
                <LogAxis offsetTop={offsetTop} showGrid={props.showGrid} label={props.Tlabel} offsetBottom={offsetBottom} offsetLeft={offsetLeft} offsetRight={offsetRight} width={svgWidth}
                  height={svgHeight} setHeight={setHeightXLabel} heightAxis={heightXLabel} showLeftMostTick={!yHasData[0]} showRightMostTick={!yHasData[1]} />}
            {(props.hideYAxis ?? false) ? null : (
              <>
                {yHasData[0] ? (
                  <YValueAxis
                    offsetRight={offsetRight}
                    showGrid={props.showGrid}
                    label={typeCorrect<string>(props.Ylabel, 0)}
                    offsetTop={offsetTop}
                    offsetLeft={offsetLeft}
                    offsetBottom={offsetBottom}
                    width={svgWidth}
                    height={svgHeight}
                    setWidthAxis={setHeightLeftYLabel}
                    setHeightFactor={setHeightYFactor}
                    axis={'left'}
                    hAxis={heightLeftYLabel}
                    hFactor={heightYFactor}
                    useFactor={props.useMetricFactors === undefined ? true : props.useMetricFactors}
                  />
                ) : null}

                {yHasData[1] ? (
                  <YValueAxis
                    offsetRight={offsetRight}
                    showGrid={props.showGrid}
                    label={typeCorrect<string>(props.Ylabel, 1)}
                    offsetTop={offsetTop}
                    offsetLeft={offsetLeft}
                    offsetBottom={offsetBottom}
                    width={svgWidth}
                    height={svgHeight}
                    setWidthAxis={setHeightRightYLabel}
                    setHeightFactor={setHeightYFactor}
                    axis={'right'}
                    hAxis={heightRightYLabel}
                    hFactor={heightYFactor}
                    useFactor={props.useMetricFactors === undefined ? true : props.useMetricFactors}
                  />
                ) : null}
              </>
            )}
            <defs>
              <clipPath id={"cp-" + guid}>
                <path stroke={'none'} fill={'none'} d={` M ${offsetLeft},${offsetTop - 5} H  ${svgWidth - offsetRight + 5} V ${svgHeight - offsetBottom} H ${offsetLeft} Z`} />
              </clipPath>
            </defs>

            <g clipPath={'url(#cp-' + guid + ')'}>
              {React.Children.map(props.children, (element) => {
                if (!React.isValidElement(element))
                  return null;
                if ((element as React.ReactElement<any>).type === Line || (element as React.ReactElement<any>).type === LineWithThreshold || (element as React.ReactElement<any>).type === Infobox ||
                  (element as React.ReactElement<any>).type === HorizontalMarker || (element as React.ReactElement<any>).type === VerticalMarker || (element as React.ReactElement<any>).type === SymbolicMarker
                  || (element as React.ReactElement<any>).type === Circle || (element as React.ReactElement<any>).type === AggregatingCircles || (element as React.ReactElement<any>).type === HeatMapChart ||
                  (element as React.ReactElement<any>).type === Oval || (element as React.ReactElement<any>).type === HighlightBox || (element as React.ReactElement<any>).type === StreamingLine)
                  return element;
                return null;
              })}
              {!photoReady && (props.showMouse === undefined || (props.showMouse !== 'none' && props.showMouse !== false)) ?
                <path stroke='currentColor' style={{ strokeWidth: 2, opacity: mouseIn ? 0.8 : 0.0 }} d={(props.showMouse !== 'horizontal' ?
                  `M ${mousePosition[0]} ${offsetTop} V ${svgHeight - offsetBottom}` :
                  `M ${offsetLeft} ${mousePosition[1]} H ${svgWidth - offsetRight}`)
                } />
                : null}
              {(props.zoom === undefined || props.zoom) && mouseMode.includes('zoom') ?
                <rect fillOpacity={0.8} fill={'currentColor'}
                  x={mouseMode !== 'zoom-horizontal' ? Math.min(mouseClick[0], mousePosition[0]) : offsetLeft}
                  y={mouseMode !== 'zoom-vertical' ? Math.min(mouseClick[1], mousePosition[1]) : offsetTop}
                  width={mouseMode !== 'zoom-horizontal' ? Math.abs(mouseClick[0] - mousePosition[0]) : (svgWidth - offsetLeft - offsetRight)}
                  height={mouseMode !== 'zoom-vertical' ? Math.abs(mouseClick[1] - mousePosition[1]) : (svgHeight - offsetTop - offsetBottom)} />
                : null}
            </g>
            {(photoReady || props.menuLocation === 'hide') ? <></> :
              <InteractiveButtons showPan={(props.pan === undefined || props.pan)}
                showZoom={props.zoom === undefined || props.zoom}
                showReset={!(props.pan !== undefined && props.zoom !== undefined && !props.zoom && !props.pan)}
                showSelect={props.onSelect !== undefined || handlers.current.size > 0}
                showDownload={props.onDataInspect !== undefined}
                showCapture={props.onCapture !== undefined}
                currentSelection={selectedMode}
                setSelection={setSelection}
                holdOpen={props.holdMenuOpen}
                heightAvaliable={svgHeight - 22}
                setWidth={setMenueWidth}
                x={(props.menuLocation === 'left' ? 14 : (svgWidth - 14 - menueWidth + 20))}
                y={22} data-html2canvas-ignore="true">
                {React.Children.map(props.children, (element) => {
                  if (!React.isValidElement(element))
                    return null;
                  if ((element as React.ReactElement<any>).type === Button)
                    return element;
                  return null;
                })}
              </InteractiveButtons>
            }
          </svg>
        </div>
        {props.legend !== undefined && props.legend !== 'hidden' ?
          <Legend
            location={props.legend}
            height={legendHeight}
            width={legendWidthToUse}
            graphWidth={svgWidth}
            graphHeight={svgHeight}
            RequestLegendWidth={requestLegendWidthChange}
            RequestLegendHeight={requestLegendHeightChange}
            HideDisabled={photoReady}
          />
          : null}
      </div>
    </ContextWrapper>
  )

}

export default Plot;
