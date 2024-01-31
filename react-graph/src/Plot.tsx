﻿// ******************************************************************************************************
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
import {IDataSeries, IHandlers, ContextWrapper, IActionFunctions, AxisIdentifier, AxisMap} from './GraphContext';
import {CreateGuid} from '@gpa-gemstone/helper-functions';
import {cloneDeep, isEqual} from 'lodash';
import TimeAxis from './TimeAxis';
import LogAxis from './LogAxis'; 
import ValueAxis from './ValueAxis';
import Legend from './Legend';
import LineWithThreshold from './LineWithThreshold';
import Line from './Line';
import Button from './Button';
import HorizontalMarker from './HorizontalMarker';
import VerticalMarker from './VerticalMarker';
import SymbolicMarker from './SymbolicMarker';
import Circle from './Circle';
import AggregatingCircles from './AggregatingCircles';
import Infobox from './Infobox';
import HeatMapChart from './HeatMapChart';
import * as _html2canvas from "html2canvas";
import { KDNode } from './KDNode';
const html2canvas: any = _html2canvas;

// A ZoomMode of AutoValue means it will zoom on time, and auto Adjust the Value to fit the data.
// HalfAutoValue is the same as AutoValue except it "pins" either max or min at zero
// divCaptureId allows the div to be captured to be external to this plot
export interface IProps {
    defaultTdomain: [number, number],
    defaultYdomain?: [number,number] | [number,number][],
    height: number,
    width: number,

    showGrid?: boolean,
    XAxisType?: 'time' | 'log',
    zoom?: boolean,
    pan?: boolean,
    Tmin?: number,
    Tmax?: number,
    showBorder?: boolean,
    Tlabel?: string,
    Ylabel?: string|string[],
    holdMenuOpen?: boolean,
    moveMenuLeft?: boolean,
    legend?: 'hidden'| 'bottom' | 'right',
    // Boolean arguements deprecated
    showMouse?: boolean | 'horizontal' | 'vertical' | 'none',
    legendHeight?: number,
    legendWidth?: number,
    useMetricFactors?: boolean,
    showDateOnTimeAxis?: boolean,
    cursorOverride?: string,
    onSelect?: (x: number, y: number[], actions: IActionFunctions) => void,
    showDivCapture?: boolean,
    divCaptureId?: string,
    onDataInspect?: (tDomain: [number,number]) => void,
    Ymin?: number | number[],
    Ymax?: number | number[],
    zoomMode?: 'Time'|'Rect'|'AutoValue'|'HalfAutoValue',
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
    /*
      Actual plot that will handle Axis etc.
    */
    const SVGref = React.useRef<any>(null);
    const handlers = React.useRef<Map<string,IHandlers>>(new Map<string, IHandlers>());
    const wheelTimeout = React.useRef<{timeout?: NodeJS.Timeout, stopScroll: boolean}>({timeout: undefined, stopScroll: false});
    const widthTimeout = React.useRef<{timeout?: NodeJS.Timeout, requesterMap: Map<string,number>}>({timeout: undefined, requesterMap: new Map<string,number>()});
    const nodeTree = React.useRef<{dataGuids: Map<string, { dataId: string, axis: number}>, trees: (KDNode|null)[]}>({ dataGuids: new Map<string, { dataId: string, axis: number}>(), trees: Array(AxisMap.size).fill(null)});
    
    const guid = React.useMemo(() => CreateGuid(),[]);
    const [data, setData] = React.useState<Map<string, IDataSeries>>(new Map<string, IDataSeries>());

    const [tDomain, setTdomain] = React.useState<[number,number]>(props.defaultTdomain);
    const [tOffset, setToffset] = React.useState<number>(0);
    const [tScale, setTscale] = React.useState<number>(1);

    const [yDomain, setYdomain] = React.useState<[number,number][]>(Array(AxisMap.size).fill([0,0]));
    const [yOffset, setYoffset] = React.useState<number[]>(Array(AxisMap.size).fill(0));
    const [yScale, setYscale] = React.useState<number[]>(Array(AxisMap.size).fill(1));
    // ToDo: This is hardset to two because it's tied to display, 'left' and 'right'
    const [yHasData, setYHasData] = React.useState<boolean[]>(Array(2).fill(0));

    const [mouseMode, setMouseMode] = React.useState<'none' | 'zoom' | 'pan' | 'select'>('none');
    const [selectedMode, setSelectedMode] = React.useState<'pan' | 'zoom' | 'select'>('zoom');
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
    const [defaultTdomain, setDefaultTdomain]= React.useState<[number,number]>(props.defaultTdomain);
    const [defaultYdomain, setDefaultYdomain] = React.useState<[number,number]|[number,number][]|undefined>(props.defaultYdomain);
    const [updateFlag, setUpdateFlag] = React.useState<number>(0);

    const [legendHeight, setLegendHeight] = React.useState<number>(props.legendHeight ?? defaultLegendHeight);
    const [legendWidth, setLegendWidth] = React.useState<number>(props.legendWidth ?? defaultLegendWidth);
    const [svgHeight, setSVGheight] = React.useState<number>(props.height);
    const [svgWidth, setSVGwidth] = React.useState<number>(props.width);
    
    const zoomMode = React.useMemo(() => props.zoomMode === undefined? 'AutoValue' : props.zoomMode, [props.zoomMode]);

    // Type correcting functions to convert props into something usable
    const typeCorrect: <T>(arg: T | T[] | undefined, arrayIndex: number) => T|undefined = (arg, arrayIndex) => {
      if (arg == null) return undefined;
      if (!Object.prototype.hasOwnProperty.call(arg, 'length')) return (arrayIndex === 0 ? arg : undefined);
      return (arg as any)[arrayIndex];
    }
    const typeCorrectDomain = (arg: [number, number] | [number, number][] | undefined, arrayIndex: number): [number,number] | undefined => {
      if (arg === undefined || arg.length === 0) return undefined;
      if (typeof(arg[0]) === 'number') return (arrayIndex === 0 ? arg as [number, number] : undefined);
      return (arg as [number, number][])[arrayIndex];
    }
    const applyToYDomain = (predicate: (domain: [number,number], axis: number, allDomains: [number, number][]) => boolean): void => {
      const newDomain = [...yDomain];
      let apply = false;
      newDomain.forEach((d,i,a) => {
        // Note: Apply MUST be after predicate, or it short-circuits it
        apply = predicate(d,i,a) || apply;
      })
      if (apply){
        setYdomain(newDomain);
      }
    }

    // Effect to Reset the legend width/height
    React.useEffect(() => {
      if (props.legendHeight !== undefined) setLegendHeight(props.legendHeight);
    }, [props.legendHeight]);

    React.useEffect(()=>{
      if (props.legendWidth !== undefined) setLegendWidth(props.legendWidth);
    }, [props.legendWidth]);
    
    // Recompute height and width
    React.useEffect(() => {
      setSVGheight(props.height - (props.legend === 'bottom'? legendHeight : 0));
    }, [props.height, props.legend, legendHeight]);

    React.useEffect(()=>{
      setSVGwidth(props.width - (props.legend === 'right'? legendWidth : 0));
    }, [props.width, props.legend, legendWidth]);

    // enforce T limits
    React.useEffect(() => {
      if (props.Tmin !== undefined && tDomain[0] < props.Tmin)
        setTdomain((t) => ([props.Tmin?? 0, t[1]]));
      if (props.Tmax !== undefined && tDomain[1] > props.Tmax)
        setTdomain((t) => ([t[0], props.Tmax?? 0]));
    }, [tDomain])

    // enforce Y limits
    React.useEffect(() => {
      const mutateDomain = (domain: [number,number], axis: number, allDomains: [number, number][]): boolean => {
        let hasApplied = false;
        // Need to type correct our arguements
        const propMin: number | undefined = typeCorrect<number>(props.Ymin, axis);
        const propMax: number | undefined = typeCorrect<number>(props.Ymax, axis);
        if (propMin !== undefined && domain[0] < propMin){
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
        setDefaultYdomain(props.defaultYdomain);
    }, [props.defaultYdomain])
    

    React.useEffect(() => {
      setTdomain(defaultTdomain);
    }, [defaultTdomain])

    React.useEffect(() => {
      ResetYDomain();
    }, [defaultYdomain])

    // Adjust top and bottom Offset
    React.useEffect(() => {
      const top = heightYFactor + 10;
      const bottom = heightXLabel + 10;
      if (offsetTop !== top)
        setOffsetTop(top);
      if (offsetBottom !== bottom)
        setOffsetBottom(bottom);
    },[heightXLabel,heightYFactor])

    // Adjust Left Offset
    React.useEffect(() => {
      const left = heightLeftYLabel + 10;
      if (offsetLeft !== left)
        setOffsetLeft(left);
    }, [heightLeftYLabel]);

    // Adjust Right Offset
    React.useEffect(() => {
      const right = heightRightYLabel + 10;
      if (offsetRight !== right)
        setOffsetRight(right);
    }, [heightRightYLabel]);

    // Adjust Y domain
    React.useEffect(() => {
      const mutateDomain = (domain: [number,number], axis: number, allDomains: [number, number][]): boolean => {
        if (zoomMode === 'AutoValue' || zoomMode === 'HalfAutoValue') {
          const dataReducerFunc = (result: number[], series: IDataSeries, func: (tDomain: [number, number]) => number|undefined) => {
            // This part of the data may not belong to the axis we care about at the moment
            const dataAxis = AxisMap.get(series.axis);
            if (axis === dataAxis) {
              const value =  func(tDomain);
              if (value !== undefined) result.push(value);
            }
            return result;
          }
          const yMin = Math.min(...[...data.values()].reduce((result: number[], series: IDataSeries) => dataReducerFunc(result, series, series.getMin), []));
          const yMax = Math.max(...[...data.values()].reduce((result: number[], series: IDataSeries) => dataReducerFunc(result, series, series.getMax), []));
          if (!isNaN(yMin) && !isNaN(yMax) && isFinite(yMin) && isFinite(yMax)) {
            if (zoomMode === 'AutoValue') allDomains[axis] = [yMin, yMax];
            // If this condition is satisfied, it means our series is mostly positive range
            else if (Math.abs(yMax) >= Math.abs(yMin)) allDomains[axis] = [0, yMax];
            else allDomains[axis] = [yMin, 0];
            return true;
          }
        }
        return false;
      }
      applyToYDomain(mutateDomain);
    }, [tDomain, data]);

    React.useEffect(() => {
      const newHasData: boolean[] = Array<boolean>(2);
      const hasFunc = (axis: AxisIdentifier) => [...data.values()].some(series => AxisMap.get(axis) === AxisMap.get(series.axis));
      newHasData[0] = hasFunc('left');
      newHasData[1] = hasFunc('right');
      setYHasData(newHasData);
    }, [data]);

    // Todo: Assumption that dims are 2
    React.useEffect(() => {
      // Don't need if we're not snapping
      if (!props.snapMouse) return;

      // Build map of all guids in data (mapping series key => data key, axis)
      const guidMap = new Map<string, { dataId: string, axis: number}>();
      for(const seriesKey of data.keys()){
        const dataSeries = data.get(seriesKey);
        if (dataSeries == null || dataSeries.dataId == null || dataSeries.dataId === "") continue;
        guidMap.set(seriesKey, { dataId: dataSeries.dataId, axis: AxisMap.get(dataSeries.axis) });
      }
      // If everything is all equivlant, then data has not changed and we can skip the operation
      if (nodeTree.current.dataGuids.size === guidMap.size && 
        [...guidMap.keys()].every(seriesKey => {
          const currentInfo = nodeTree.current.dataGuids.get(seriesKey);
          const newInfo = guidMap.get(seriesKey);
          if (currentInfo == null || newInfo == null) return false;
          return (currentInfo.axis === newInfo.axis && currentInfo.dataId === newInfo.dataId);
        })) return;
      // Construct the node tree(s)
      const newNodes: KDNode[] = Array(AxisMap.size);
      for(const axis of AxisMap.values()){
        let allData: [...number[]][] = []; 
        for(const seriesKey of guidMap.keys()){
          const dataSeries = data.get(seriesKey);
          const dataGuid = guidMap.get(seriesKey);
          if (dataGuid != null && dataSeries != null && dataGuid.axis === axis)
            allData = allData.concat(dataSeries.getData([Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]));
        }
        if (allData.length !== 0) newNodes[axis] = new KDNode(allData, 2, false, 0);
      }
      nodeTree.current = {dataGuids: guidMap, trees: newNodes };
    }, [data, props.snapMouse]);

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
      setToffset(offsetLeft - dTmin * scale );
    }, [tDomain, offsetLeft, offsetRight, props.XAxisType,svgWidth]);

    // Adjust y axis
    React.useEffect(() => {
      const mutateFunction = (scaleArray: number[], offsetArray: number[], axis: number) => {
        const dY = yDomain[axis][1] - yDomain[axis][0];
        const scale = (svgHeight - offsetTop - offsetBottom) / (dY === 0? 0.00001 : dY);
        scaleArray[axis] = -scale;
        offsetArray[axis] = svgHeight - offsetBottom + yDomain[axis][0] * scale;
      }
      // Update every axis
      const newScale = [...yScale];
      const newOffset = [...yOffset];
      for(const axis of AxisMap.values())
        mutateFunction(newScale, newOffset, axis);
      setYscale(newScale);
      setYoffset(newOffset);

    }, [yDomain, offsetTop, offsetBottom, svgHeight]);

    React.useEffect(() => { setUpdateFlag((x) => x+1) }, [tScale,tOffset,yScale,yOffset])
    
    // Change mouse cursor
    React.useEffect(() => {
      let newCursor;
      if (props.cursorOverride == null) {
        switch (selectedMode){
          case 'pan':
            newCursor = 'grab';
            break;
          case 'select':
            newCursor = 'pointer';
            break;
          default:
            newCursor = 'default';
        }
      } else newCursor = props.cursorOverride;
      setMouseStyle(newCursor);
    }, [selectedMode, props.cursorOverride])

    // Stop scrolling while zooming
    React.useEffect(() => {
      const cancelWheel = (e: WheelEvent) => { if (wheelTimeout.current.stopScroll) e.preventDefault() }
      document.body.addEventListener('wheel', cancelWheel, {passive:false});
      return () => document.body.removeEventListener('wheel', cancelWheel);
  }, []);

  // Execute Plot Capture and leave photo mode
  React.useEffect(() => {
    if (photoReady){
      const id = props.divCaptureId ?? guid;
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
    }
  }, [photoReady]);

  // requests new legend height/width upto a defined maximum set by props
  const requestLegendHeightChange = React.useCallback((newHeight: number) =>  {
    if (props.legend !== 'bottom') return;
    const limitedHeight = Math.min(newHeight, props.legendHeight ?? defaultLegendHeight);
    if (legendHeight !== limitedHeight) setLegendHeight(limitedHeight);
  },[props.legendHeight, setLegendHeight, legendHeight, props.legend]);

  const requestLegendWidthChange = React.useCallback((newWidth: number, requesterID: string) =>  {
    if (newWidth < 0) {
      widthTimeout.current.requesterMap.delete(requesterID);
      return;
    }
    if (props.legend !== 'right') return;
    const limitedWidth = Math.min(newWidth, props.legendWidth ?? defaultLegendWidth);
    // we can't immediately complete the request, since there are multiple legend items trying to adjust this at a time sometimes
    clearTimeout(widthTimeout.current.timeout);
    widthTimeout.current.requesterMap.set(requesterID, limitedWidth);

    // timeout to set if we don't see any more requests within 0.05 seconds
    widthTimeout.current.timeout = setTimeout(() => {
      const largestRequested = Math.max(...widthTimeout.current.requesterMap.values());
      if (legendWidth !== largestRequested) setLegendWidth(largestRequested);
    }, 50);
  },[props.legendWidth, setLegendWidth, legendWidth, props.legend]);

    // transforms from pixels into x value. result passed into onClick function 
    const xInvTransform = React.useCallback((p: number) =>  {
      let xT = (p - tOffset) / tScale;
      if (props.XAxisType === 'log')
        xT = Math.pow(10, (p - tOffset) / tScale);
      return xT;
    },[tOffset,tScale,props.XAxisType]);

    // transforms from pixels into y value. result passed into onClick function
    const yInvTransform = React.useCallback((p: number, a: AxisIdentifier | number) =>  {
      const axis = (typeof(a) !== 'number') ? AxisMap.get(a) : a;
      return (p - yOffset[axis]) / yScale[axis];
    },[yOffset,yScale]);

    function Reset(): void {
      setTdomain(defaultTdomain);
      ResetYDomain();
    }

    function ResetYDomain(): void {
      const mutateDomain = (domain: [number,number], axis: number, allDomains: [number, number][]): boolean => {
        // Need to type correct our arguements
        const defaults: [number, number] | undefined = typeCorrectDomain(defaultYdomain, axis);
        if (defaults !== undefined && zoomMode !== 'AutoValue' && zoomMode !== 'HalfAutoValue') {
          allDomains[axis] = defaults;
          return true;
        }
        return false;
      }
      applyToYDomain(mutateDomain);
    }

    // new X transformation from x value into Pixels
    const xTransform = React.useCallback((value: number) => {
      let xT = value * tScale + tOffset;
      if (props.XAxisType === 'log') {
        const v = (value === 0? tDomain[0]*0.01 : value);
        xT = Math.log10(v) * tScale + tOffset;
      }
      return xT;
    }, [tScale,tOffset,props.XAxisType, tDomain])

    // new Y transformation from y value into Pixels
    const yTransform = React.useCallback((value: number, a: AxisIdentifier|number) => {
      const axis = (typeof(a) !== 'number') ? AxisMap.get(a) : a;
      return value * yScale[axis] + yOffset[axis];
    }, [yScale,yOffset]);

    // applies offset and contraints to x Pixel value to get something that is plotable
    const xApplyOffset = React.useCallback((value: number) => {
      if (value >= 0)
        return Math.min(value + offsetLeft, svgWidth - offsetRight);
      else
        return Math.max(offsetLeft, svgWidth - offsetRight + value);
    }, [offsetLeft,offsetRight,svgWidth]);

    // applies offset and contraints to y Pixel value to get something that is plotable
    const yApplyOffset = React.useCallback((value: number) => {
      if (value >= 0)
        return Math.min(value + offsetTop, svgHeight - offsetBottom);
      else
        return Math.max(offsetTop, svgHeight - offsetBottom + value);
    }, [offsetTop,offsetBottom,svgHeight]);

    const addData = React.useCallback((d: IDataSeries) => {
      const key = CreateGuid();
      setData((fld) => { const updated = cloneDeep(fld); updated.set(key, d); return updated; });
      return key;
    }, []);

    const updateData = React.useCallback((key: string, d: IDataSeries) => {
      setData((fld) => { const updated = cloneDeep(fld); updated.set(key, d); return updated; });
    }, []);

    const removeData = React.useCallback((d: string) => {
        setData((fld) => { const updated = cloneDeep(fld); updated.delete(d); return updated;})
    },[]);

    const setLegend = React.useCallback((key: string, legend?:  HTMLElement| React.ReactElement| JSX.Element) =>  {
        setData((fld) => {
          const updated = cloneDeep(fld);
          const series = updated.get(key);
          if (series === undefined)
            return updated;
          series.legend = legend;
          updated.set(key, series!);
          return updated;
        });
    }, []);

    function snapMouseToClosestSeries(pixelPt: {x:number, y:number}): {x:number, y:number} {
      const findClosestPoint = (result: { pt: {x:number, y:number}, distSq: number|undefined }, axis: number) => {
        if (nodeTree.current.trees[axis] == null) return result;
        // Todo: We might be able to make NN return the transformed point if the transform function is provided, instead of doing it ourselves
        const nnResult = nodeTree.current.trees[axis]!.findNearest([xInvTransform(pixelPt.x), yInvTransform(pixelPt.y, axis)], [xTransform, (n)=>yTransform(n,axis)]);
        const newResult = { pt: { x: xTransform(nnResult.pt[0]), y: yTransform(nnResult.pt[1], axis)}, distSq: nnResult.distSq }
        if (result.distSq === undefined || newResult.distSq < result.distSq)
          return newResult;
        return result;
      }
      
      return [...AxisMap.values()].reduce((result: { pt: {x:number, y:number}, distSq: number|undefined}, axis) => findClosestPoint(result, axis), { pt: {x:0, y:0}, distSq: undefined }).pt;
    }

    const registerSelect = React.useCallback((handler: IHandlers) => {
      const key = CreateGuid();
      handlers.current.set(key,handler)
      return key;
    },[]);

    const removeSelect = React.useCallback((key: string) => {
      handlers.current.delete(key)
    },[]);
    
    const updateSelect = React.useCallback((key: string,handler: IHandlers) => {
      handlers.current.set(key,handler)
    },[]);

    const setSelection = React.useCallback((s: string) => {
      if (s === "reset") Reset();
      else if (s === "download") { if (props.onDataInspect !== undefined) props.onDataInspect(tDomain); }
      else if (s === "capture") setPhotoReady(true);
      else setSelectedMode(s as ('zoom'|'pan'|'select'))
    }, [tDomain, Reset, props.onDataInspect]);

    function handleMouseWheel(evt: any) {
          if (props.zoom !== undefined && !props.zoom)
              return;
          if (!(selectedMode === 'zoom'))
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

          if ((x1-x0) > 10)
            setTdomain([xInvTransform(x0), xInvTransform(x1)])
        
          if (zoomMode === 'Rect') {
            const zoomYAxis = (domain: [number,number], axis: number, allDomains: [number, number][]): boolean => {
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
  
              if (Math.abs(y1-y0) > 10) {
                allDomains[axis] = [yInvTransform(y0, axis), yInvTransform(y1, axis)];
                return true;
              }
              return false;
            }
            applyToYDomain(zoomYAxis);
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
            (props.Tmin === undefined || Tmin >  props.Tmin) && 
            (props.Tmax === undefined || Tmax < props.Tmax))
            setTdomain([Tmin, Tmax]);

        if (zoomMode === 'Rect') {
          const zoomYAxis = (domain: [number,number], axis: number, allDomains: [number, number][]): boolean => {
            const dY = yInvTransform(mousePosition[1], axis) - yInvTransform(ptTransform.y, axis);
            // Need to type correct our arguements
            const propMin: number | undefined = typeCorrect<number>(props.Ymin, axis);
            const propMax: number | undefined = typeCorrect<number>(props.Ymax, axis);
            if (
              (propMin === undefined || domain[0] + dY >  propMin) && 
              (propMax === undefined || domain[1] + dY < propMax)) {
                allDomains[axis] = [domain[0] + dY, domain[1] + dY];
                return true;
              }
            return false;
          }
          applyToYDomain(zoomYAxis);
        }
      }
      setMousePosition([ptTransform.x, ptTransform.y]);
      // Here on mouse is snapped (if neccessary)
      let ptFinal: {x: number, y: number};
      if (props.snapMouse ?? false) ptFinal = snapMouseToClosestSeries(ptTransform);
      else ptFinal = ptTransform;
      setMousePositionSnap([ptFinal.x, ptFinal.y]);
      if (handlers.current.size > 0)
        handlers.current.forEach((v) => (v.onMove !== undefined? v.onMove(xInvTransform(v.allowSnapping ? ptFinal.x : ptTransform.x), yInvTransform(v.allowSnapping ? ptFinal.y : ptTransform.y, v.axis)) : null));
    }

    function handleMouseDown(evt: any) {
      if (SVGref.current == null)
        return;

        const pt = SVGref.current!.createSVGPoint();
        pt.x = evt.clientX;
        pt.y = evt.clientY;
        const ptTransform = pt.matrixTransform(SVGref.current!.getScreenCTM().inverse())
        setMouseClick([ptTransform.x, ptTransform.y]);
        if (selectedMode === 'zoom' && (props.zoom === undefined || props.zoom))
            setMouseMode('zoom');
        if (selectedMode === 'pan' && (props.pan === undefined || props.pan)) {
            setMouseMode('pan');
            setMouseStyle('grabbing');
        }

        // Todo: Review question: can we just use mousePosition and mousePositionSnap here? 
        // Here on mouse is snapped (if neccessary)
        let ptFinal: {x: number, y: number};
        if (props.snapMouse ?? false) ptFinal = snapMouseToClosestSeries(ptTransform);
        else ptFinal = ptTransform;
        if (selectedMode === 'select' && props.onSelect !== undefined)
          props.onSelect(
            xInvTransform(ptFinal.x),
            [...AxisMap.values()].map(axis => yInvTransform(ptFinal.y, axis)),
            {
            setTDomain: updateXDomain as React.SetStateAction<[number,number]>, 
            setYDomain: updateYDomain as React.SetStateAction<[number,number][]>
            });
        if (handlers.current.size > 0 && selectedMode === 'select')
          handlers.current.forEach((v) => (v.onClick !== undefined? v.onClick(xInvTransform(v.allowSnapping ? ptFinal.x : ptTransform.x), yInvTransform(v.allowSnapping ? ptFinal.y : ptTransform.y, v.axis)) : null));
    }

    function handleMouseUp(_: any) {
      if (selectedMode === 'pan' && (props.pan === undefined || props.pan))
          setMouseStyle('grab');
      if (mouseMode === 'zoom') {

          if (Math.abs(mousePosition[0] - mouseClick[0]) < 10) {
              setMouseMode('none');
              return;
          }

          const t0 = Math.min(xInvTransform(mousePosition[0]), xInvTransform(mouseClick[0]));
          const t1 = Math.max(xInvTransform(mousePosition[0]), xInvTransform(mouseClick[0]));

          setTdomain((curr) =>  [Math.max(curr[0], t0), Math.min(curr[1], t1)]);

          if (zoomMode === 'Rect') {
            const zoomYAxis = (domain: [number,number], axis: number, allDomains: [number, number][]): boolean => {
              const y0 = Math.min(yInvTransform(mousePosition[1], axis), yInvTransform(mouseClick[1], axis));
              const y1 = Math.max(yInvTransform(mousePosition[1], axis), yInvTransform(mouseClick[1], axis));
              allDomains[axis] = [Math.max(domain[0], y0), Math.min(domain[1], y1)];
              return true;
            }
            applyToYDomain(zoomYAxis);
          }
      }
      setMouseMode('none');

      if (handlers.current.size > 0 && selectedMode === 'select')
        handlers.current.forEach((v) => (v.onRelease !== undefined? v.onRelease(xInvTransform(v.allowSnapping ? mousePositionSnap[0] : mousePosition[0]), yInvTransform(v.allowSnapping ? mousePositionSnap[1] : mousePosition[1], v.axis)) : null));
    }

    function handleMouseOut(_: any) {
        setMouseIn(false);
        if (mouseMode === 'pan')
            setMouseMode('none');

        if (handlers.current.size > 0 && selectedMode === 'select')
          handlers.current.forEach((v) => (v.onPlotLeave !== undefined? v.onPlotLeave(xInvTransform(v.allowSnapping ? mousePositionSnap[0] : mousePosition[0]), yInvTransform(v.allowSnapping ? mousePositionSnap[1] : mousePosition[1], v.axis)) : null));
  
    }

    function handleMouseIn(_: any) {
        setMouseIn(true);
    }

    function updateXDomain(x: [number,number]) {
      if (x[0] === tDomain[0] && x[1] === tDomain[1])
        return;

      if (x[0] < x[1])
        setTdomain(x);
      else
        setTdomain([x[1],x[0]]);
    }

    function updateYDomain(y: [number,number][]) {
      const correctFunction = (domain: [number,number], axis: number, allDomains: [number, number][]): boolean => {
        if (y[axis][0] === domain[0] && y[axis][1] === domain[1])
          return false;
        
        if (y[0] < y[1])
          allDomains[axis] = y[axis];
        else
          allDomains[axis] = [y[axis][1],y[axis][0]];
        return true;
      }
      applyToYDomain(correctFunction);
    }

    return (
      <ContextWrapper 
        XDomain ={tDomain}
        MousePosition={mousePosition}
        MousePositionSnap={mousePositionSnap}
        YDomain={yDomain}
        CurrentMode={selectedMode}
        MouseIn={mouseIn}
        UpdateFlag={updateFlag}
        Data={data}
        XApplyPixelOffset={xApplyOffset}
        YApplyPixelOffset={yApplyOffset}
        XTransform={xTransform}
        YTransform={yTransform}
        XInvTransform={xInvTransform}
        YInvTransform={yInvTransform}
        SetXDomain={updateXDomain}
        SetYDomain={updateYDomain}
        AddData={addData}
        RemoveData={removeData}
        UpdateData={updateData}
        SetLegend={setLegend}
        RegisterSelect={registerSelect}
        RemoveSelect={removeSelect}
        UpdateSelect={updateSelect}
        RequestLegendWidth={requestLegendWidthChange}
        RequestLegendHeight={requestLegendHeightChange}
      >
          <div id={guid} style={{ height: props.height, width: props.width, position: 'relative' }}>
              <div style={{ height: svgHeight, width: svgWidth, position: 'absolute', cursor: mouseStyle }}
                  onWheel={handleMouseWheel} onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseOut} onMouseEnter={handleMouseIn} >
                  <svg ref={SVGref} width={svgWidth < 0? 0 : svgWidth} height={svgHeight < 0 ? 0 : svgHeight}
                   style={SvgStyle} viewBox={`0 0 ${svgWidth < 0? 0 : svgWidth} ${svgHeight < 0 ? 0 : svgHeight}`}>
                      { props.showBorder !== undefined && props.showBorder ? < path stroke='black' d={`M ${offsetLeft} ${offsetTop} H ${svgWidth- offsetRight} V ${svgHeight - offsetBottom} H ${offsetLeft} Z`} /> : null}
                      { props.XAxisType === 'time' || props.XAxisType === undefined ?
                      <TimeAxis label={props.Tlabel} offsetBottom={offsetBottom} offsetLeft={offsetLeft} offsetRight={offsetRight} width={svgWidth} height={svgHeight} setHeight={setHeightXLabel} 
                        heightAxis={heightXLabel} showLeftMostTick={!yHasData[0]}  showRightMostTick={!yHasData[1]} showDate={props.showDateOnTimeAxis} /> :
                      <LogAxis offsetTop={offsetTop} showGrid={props.showGrid} label={props.Tlabel} offsetBottom={offsetBottom} offsetLeft={offsetLeft} offsetRight={offsetRight} width={svgWidth} 
                        height={svgHeight} setHeight={setHeightXLabel} heightAxis={heightXLabel} showLeftMostTick={!yHasData[0]}  showRightMostTick={!yHasData[1]} /> }
                      {yHasData[0] ? <ValueAxis offsetRight={offsetRight} showGrid={props.showGrid} label={typeCorrect<string>(props.Ylabel, 0)} offsetTop={offsetTop} offsetLeft={offsetLeft} offsetBottom={offsetBottom}
                        width={svgWidth} height={svgHeight} setWidthAxis={setHeightLeftYLabel} setHeightFactor={setHeightYFactor} axis={'left'}
                        hAxis={heightLeftYLabel} hFactor={heightYFactor} useFactor={props.useMetricFactors === undefined? true: props.useMetricFactors}/> : null}
                      {yHasData[1] ? <ValueAxis offsetRight={offsetRight} showGrid={props.showGrid} label={typeCorrect<string>(props.Ylabel, 1)} offsetTop={offsetTop} offsetLeft={offsetLeft} offsetBottom={offsetBottom}
                        width={svgWidth} height={svgHeight} setWidthAxis={setHeightRightYLabel} setHeightFactor={setHeightYFactor} axis={'right'}
                        hAxis={heightRightYLabel} hFactor={heightYFactor} useFactor={props.useMetricFactors === undefined? true: props.useMetricFactors}/> : null}
                      <defs>
                          <clipPath id={"cp-" + guid}>
                              <path stroke={'none'} fill={'none'} d={` M ${offsetLeft},${offsetTop - 5} H  ${svgWidth - offsetRight + 5} V ${svgHeight - offsetBottom} H ${offsetLeft} Z`} />
                          </clipPath>
                      </defs>

                      <g clipPath={'url(#cp-' + guid + ')' }>
                         {React.Children.map(props.children, (element) => {
                                   if (!React.isValidElement(element))
                                       return null;
                                   if ((element as React.ReactElement<any>).type === Line || (element as React.ReactElement<any>).type === LineWithThreshold || (element as React.ReactElement<any>).type === Infobox ||
                                   (element as React.ReactElement<any>).type === HorizontalMarker || (element as React.ReactElement<any>).type === VerticalMarker || (element as React.ReactElement<any>).type === SymbolicMarker
                                   || (element as React.ReactElement<any>).type === Circle || (element as React.ReactElement<any>).type === AggregatingCircles || (element as React.ReactElement<any>).type === HeatMapChart
                                    )
                                       return element;
                                   return null;
                               })}
                         {!photoReady && (props.showMouse === undefined || (props.showMouse !== 'none' && props.showMouse !== false)) ?
                              <path stroke='black' style={{ strokeWidth: 2, opacity: mouseIn? 0.8: 0.0 }} d={(props.showMouse !== 'horizontal' ? 
                                `M ${mousePosition[0]} ${offsetTop} V ${svgHeight - offsetBottom}` :
                                `M ${offsetLeft} ${mousePosition[1]} H ${svgWidth - offsetRight}`)
                              } />
                              : null}
                          {(props.zoom === undefined || props.zoom) && mouseMode === 'zoom' ?
                              <rect fillOpacity={0.8} fill={'black'} x={Math.min(mouseClick[0], mousePosition[0])}
                               y={zoomMode === 'Rect'? Math.min(mouseClick[1], mousePosition[1]) : offsetTop} 
                               width={Math.abs(mouseClick[0] - mousePosition[0])}
                               height={zoomMode === 'Rect'?  Math.abs(mouseClick[1] - mousePosition[1]) : (svgHeight - offsetTop - offsetBottom)} />
                              : null}
                      </g>
                      {(photoReady) ? <></> :
                       <InteractiveButtons showPan={(props.pan === undefined || props.pan)}
                        showZoom={props.zoom === undefined || props.zoom}
                        showReset={!(props.pan !== undefined && props.zoom !== undefined && !props.zoom && !props.pan)}
                        showSelect={props.onSelect !== undefined || handlers.current.size > 0}
                        showDownload={props.onDataInspect !== undefined}
                        showCapture={props.showDivCapture ?? false}
                        currentSelection={selectedMode}
                        setSelection={setSelection}
                        holdOpen={props.holdMenuOpen}
                        openTowardsRight={props.moveMenuLeft ?? false}
                        x={(props.moveMenuLeft ?? false) ? (offsetLeft + 12) : (svgWidth - offsetRight - 12)}
                        y={22} > 
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
            {props.legend  !== undefined && props.legend !== 'hidden' ? <Legend location={props.legend} height={legendHeight} width={legendWidth} graphWidth={svgWidth} graphHeight={svgHeight} /> : null}
           </div>
      </ContextWrapper>
  )

}

export default Plot;
