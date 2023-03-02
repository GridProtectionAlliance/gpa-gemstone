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
import InteractiveButtons from './InteractiveButtons';
import {IGraphContext, IDataSeries, GraphContext, IHandlers} from './GraphContext';
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

// A ZoomMode of AutoValue means it will zoom on time, and auto Adjust the Value to fit the data.
export interface IProps {
    defaultTdomain: [number, number],
    defaultYdomain?: [number,number],
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
    Ylabel?: string,
    legend?: 'hidden'| 'bottom' | 'right',
    showMouse: boolean,
    legendHeight?: number,
    legendWidth?: number,
    useMetricFactors?: boolean,
    onSelect?: (t:number) => void,
    onDataInspect?: (tDomain: [number,number]) => void,
    Ymin?: number,
    Ymax?: number,
    zoomMode?: 'Time'|'Rect'|'AutoValue'
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

const Plot: React.FunctionComponent<IProps> = (props) => {
    /*
      Actual plot that will handle Axis etc.
    */
    const SVGref = React.useRef<any>(null);
    const guid = React.useMemo(() => CreateGuid(),[]);
    const [data, setData] = React.useState<Map<string, IDataSeries>>(new Map<string, IDataSeries>());
    const [handlers, setHandlers] = React.useState<Map<string,IHandlers>>(new Map<string, IHandlers>());

    const [tDomain, setTdomain] = React.useState<[number,number]>(props.defaultTdomain);
    const [tOffset, setToffset] = React.useState<number>(0);
    const [tScale, setTscale] = React.useState<number>(1);

    const [yDomain, setYdomain] = React.useState<[number,number]>([0,0]);
    const [yOffset, setYoffset] = React.useState<number>(0);
    const [yScale, setYscale] = React.useState<number>(1);

    const [mouseMode, setMouseMode] = React.useState<'none' | 'zoom' | 'pan' | 'select'>('none');
    const [selectedMode, setSelectedMode] = React.useState<'pan' | 'zoom' | 'select'>('zoom');
    const [mouseIn, setMouseIn] = React.useState<boolean>(false);
    const [mousePosition, setMousePosition] = React.useState<[number, number]>([0, 0]);
    const [mouseClick, setMouseClick] = React.useState<[number, number]>([0, 0]);

    const [offsetTop, setOffsetTop] = React.useState<number>(10);
    const [offsetBottom, setOffsetBottom] = React.useState<number>(10);
    const [offsetLeft, setOffsetLeft] = React.useState<number>(5);
    const [offsetRight, setOffsetRight] = React.useState<number>(5);

    const [heightYFactor, setHeightYFactor] = React.useState<number>(0);
    const [heightXLabel, setHeightXLabel] = React.useState<number>(0);
    const [heightYLabel, setHeightYLabel] = React.useState<number>(0);

    // States for Props to avoid change notification on ref change
    const [defaultTdomain, setDefaultTdomain]= React.useState<[number, number]>(props.defaultTdomain);
    const [defaultYdomain, setDefaultYdomain] = React.useState<[number,number]| undefined>(props.defaultYdomain);
    // Constants
    const SVGHeight = props.height - (props.legend === 'bottom'? (props.legendHeight !== undefined? props.legendHeight : 50) : 0);
    const SVGWidth = props.width - (props.legend === 'right'? (props.legendWidth !== undefined? props.legendWidth : 100) : 0);

    const zoomMode = props.zoomMode === undefined? 'AutoValue' : props.zoomMode;

    // enforce T limits
    React.useEffect(() => {
      if (props.Tmin !== undefined && tDomain[0] < props.Tmin)
        setTdomain((t) => ([props.Tmin ?? 0, t[1]]));
      if (props.Tmax !== undefined && tDomain[1] > props.Tmax)
        setTdomain((t) => ([t[0], props.Tmax ?? 0]));
    }, [tDomain])

    // enforce Y limits
    React.useEffect(() => {
      if (props.Ymin !== undefined && yDomain[0] < props.Ymin)
        setYdomain((y) => ([props.Ymin ?? 0, y[1]]));
      if (props.Ymax !== undefined && yDomain[1] > props.Ymax)
        setYdomain((y) => ([y[0], props.Ymax ?? 0]));
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
      if (defaultYdomain !== undefined && zoomMode != 'AutoValue')
        setYdomain(defaultYdomain)
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

    // Adjust Left and Right Offset
    React.useEffect(() => {
      const left = heightYLabel + 10;
      const right =  10;
      if (offsetLeft !== left)
        setOffsetLeft(left);
      if (offsetRight !== right)
        setOffsetRight(right);
    }, [heightYLabel]);

    // Adjust Y domain
    React.useEffect(() => {
    if (zoomMode == 'AutoValue') {
     const yMin = Math.min(...[...data.values()].map(series => series.getMin(tDomain)));
     const yMax = Math.max(...[...data.values()].map(series => series.getMax(tDomain)));
     if (!isNaN(yMin) && !isNaN(yMax) && isFinite(yMin) && isFinite(yMax))
         setYdomain([yMin, yMax]);
    }
   }, [tDomain, data]);

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

      const scale = (SVGWidth - offsetLeft - offsetRight) / dT;
      
      setTscale(scale);
      setToffset(offsetLeft - dTmin * scale );
    }, [tDomain, offsetLeft, offsetRight, props.XAxisType]);

    // Adjust y axis
    React.useEffect(() => {
      const dY = yDomain[1] - yDomain[0];

      const scale = (SVGHeight - offsetTop - offsetBottom) / (dY === 0? 0.00001 : dY);
      setYscale(-scale);
      setYoffset(SVGHeight - offsetBottom + yDomain[0] * scale);
    }, [yDomain, offsetTop, offsetBottom]);

    // transforms from pixels into x value. result passed into onClick function 
    function XInverseTransform(p: number): number {
      let xT = (p - tOffset) / tScale;
      if (props.XAxisType === 'log')
        xT = Math.pow(10, (p - tOffset) / tScale);
      return xT;
    }

    // transforms from pixels into y value. result passed into onClick function
    function YInverseTransform(p: number): number {
      return (p - yOffset) / yScale;
    }

    function Reset(): void {
        setTdomain(defaultTdomain);
        if (defaultYdomain !== undefined && zoomMode != 'AutoValue')
          setYdomain(defaultYdomain)
    }

    // new X transformation from x value into Pixels
    function XTransformation(value: number): number {
      let xT = value * tScale + tOffset;
      if (props.XAxisType === 'log')
        xT = Math.log10(value) * tScale + tOffset;
      return xT;
    }

    // new Y transformation from y value into Pixels
    function YTransformation(value: number): number {
      return value * yScale + yOffset;
    }

    function AddData(d: IDataSeries): string {
      const key = CreateGuid();
      setData((fld) => { const updated = cloneDeep(fld); updated.set(key, d); return updated; });
      return key;
    }

    function UpdateData(key: string, d: IDataSeries): void {
      setData((fld) => { const updated = cloneDeep(fld); updated.set(key, d); return updated; });
    }

    function RemoveData(d: string): void {
        setData((fld) => { const updated = cloneDeep(fld); updated.delete(d); return updated;})
    }

    function SetLegend(key: string, legend: JSX.Element|undefined): void {
        setData((fld) => {
          const updated = cloneDeep(fld);
          const series = updated.get(key);
          series!.legend = legend;
          updated.set(key, series!);
          return updated;
        });
    }

    function RegisterSelect(handler: IHandlers): string {
      const key = CreateGuid();
      setHandlers((fld) => { const updated = cloneDeep(fld); updated.set(key,handler); return updated; });
      return key;
    }

    function RemoveSelect(key: string) {
      setHandlers((fld) => { const updated = cloneDeep(fld); updated.delete(key); return updated;})
    }
    
    function UpdateSelect(key: string,handler: IHandlers) {
      setHandlers((fld) => { const updated = cloneDeep(fld); updated.set(key, handler); return updated; });
    }

    function GetContext(): IGraphContext {
      return {
          XDomain: tDomain,
          XHover: mouseIn? setXHover(mousePosition[0]) : NaN,
          YHover: mouseIn? YTransformation(mousePosition[1]) : NaN,
          YDomain: yDomain,
          CurrentMode: selectedMode,
          Data: data,
          XTransformation,
          YTransformation,
          AddData,
          RemoveData,
          UpdateData,
          SetLegend,
          RegisterSelect,
          RemoveSelect,
          UpdateSelect
      } as IGraphContext
    }

    function setXHover(x: number): number {
      return XInverseTransform(x);
    }

    function handleMouseWheel(evt: any) {
          if (props.zoom !== undefined && !props.zoom)
              return;
          if (!(selectedMode === 'zoom'))
              return;
          if (!mouseIn)
              return;

          evt.stopPropagation();
		      evt.preventDefault({ passive: false });

          let multiplier = 1.25;

          // event.deltaY positive is wheel down or out and negative is wheel up or in
          if (evt.deltaY < 0) multiplier = 0.75;

          let t0 = tDomain[0];
          let t1 = tDomain[1];

          if (mousePosition[0] < offsetLeft) {
            if (props.XAxisType === 'log') 
              t1 = Math.pow(10,multiplier * (Math.log10(t1) - Math.log10(t0)) + Math.log10(t0));
            else
              t1 = multiplier * (t1 - t0) + t0;
          }
              
          else if (mousePosition[0] > (SVGWidth - offsetRight)) {
            if (props.XAxisType === 'log') 
              t0 = Math.pow(10, Math.log10(t1) - multiplier * (Math.log10(t1) - Math.log10(t0)));
            else
              t0 = t1 - multiplier * (t1 - t0);
          }
              
          else {
              const tcenter = XTransformation(mousePosition[0]);
              if (props.XAxisType === 'log') {
                t0 = tcenter - Math.pow(10, (Math.log10(tcenter) - Math.log10(t0)) * multiplier);
                t1 = tcenter + Math.pow(10, (Math.log10(t1) - Math.log10(tcenter)) * multiplier);
              }
              else {
                t0 = tcenter - (tcenter - t0) * multiplier;
                t1 = tcenter + (t1 - tcenter) * multiplier;
              }
            
          }

          if (props.XAxisType === 'log' && (t1 - t0) > 0.00000000000000001)
            setTdomain([t0, t1]);
          else if ((t1 - t0) > 10)
            setTdomain([t0, t1]);
      }

    function handleMouseMove(evt: any) {
      if (SVGref.current == null)
        return;
      const pt = SVGref.current!.createSVGPoint();
      pt.x = evt.clientX;
      pt.y = evt.clientY;
      const ptTransform = pt.matrixTransform(SVGref.current!.getScreenCTM().inverse());

      let dX = mousePosition[0] - ptTransform.x;

      setMousePosition([ptTransform.x, ptTransform.y])

        if (mouseMode === 'pan') {
            const dT = XInverseTransform(mousePosition[0]) - XInverseTransform(ptTransform.X);
            setTdomain([tDomain[0] + dT, tDomain[1] + dT]);
        }
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
        if (selectedMode === 'pan' && (props.pan === undefined || props.pan))
            setMouseMode('pan');
        if (selectedMode === 'select' && props.onSelect !== undefined)
          props.onSelect(XInverseTransform(ptTransform.x))
        if (handlers.size > 0 && selectedMode === 'select')
          handlers.forEach((v) => (v.onClick !== undefined? v.onClick(XInverseTransform(ptTransform.x), YInverseTransform(ptTransform.y)) : null));

    }

    function handleMouseUp(_: any) {
        if (mouseMode === 'zoom') {

            if (Math.abs(mousePosition[0] - mouseClick[0]) < 10) {
                setMouseMode('none');
                return;
            }

            const t0 = XInverseTransform(Math.min(mousePosition[0], mouseClick[0]));
            const t1 = XInverseTransform(Math.max(mousePosition[0], mouseClick[0]));

            setTdomain((curr) =>  [Math.max(curr[0], t0), Math.min(curr[1], t1)]);

            if (zoomMode === 'Rect') {
              const y0 = YInverseTransform(Math.min(mousePosition[1], mouseClick[1]));
              const y1 = YInverseTransform(Math.max(mousePosition[1], mouseClick[1]));
              setYdomain((curr) =>  [Math.max(curr[0], y0), Math.min(curr[1], y1)])
            }
        }
        setMouseMode('none');

        if (handlers.size > 0 && selectedMode === 'select')
          handlers.forEach((v) => (v.onRelease !== undefined? v.onRelease(XTransformation(mousePosition[0]), YTransformation(mousePosition[1])) : null));

    }

    function handleMouseOut(_: any) {
        setMouseIn(false);
        if (mouseMode === 'pan')
            setMouseMode('none');

        if (handlers.size > 0 && selectedMode === 'select')
          handlers.forEach((v) => (v.onPlotLeave !== undefined? v.onPlotLeave(XTransformation(mousePosition[0]), YTransformation(mousePosition[1])) : null));
  
    }

    function handleMouseIn(_: any) {
        setMouseIn(true);
    }

    return (
      <GraphContext.Provider value={GetContext()}>
          <div style={{ height: props.height, width: props.width, position: 'relative' }}>
              <div style={{ height: SVGHeight, width: SVGWidth, position: 'absolute' }}
                  onWheel={handleMouseWheel} onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseOut} onMouseEnter={handleMouseIn} >
                  <svg ref={SVGref} width={SVGWidth} height={SVGHeight} style={SvgStyle} viewBox={`0 0 ${SVGWidth} ${SVGHeight}`}>
                     {props.showBorder !== undefined && props.showBorder ? < path stroke='black' d={`M ${offsetLeft} ${offsetTop} H ${SVGWidth- offsetRight} V ${SVGWidth - offsetBottom} H ${offsetLeft} Z`} /> : null}
                     { props.XAxisType === 'time' || props.XAxisType === undefined ?
                     <TimeAxis label={props.Tlabel} offsetBottom={offsetBottom} offsetLeft={offsetLeft} offsetRight={offsetRight} width={SVGWidth} height={SVGHeight} setHeight={setHeightXLabel} heightAxis={heightXLabel}/> :
                     <LogAxis offsetTop={offsetTop} showGrid={props.showGrid} label={props.Tlabel} offsetBottom={offsetBottom} offsetLeft={offsetLeft} offsetRight={offsetRight} width={SVGWidth} height={SVGHeight} setHeight={setHeightXLabel} heightAxis={heightXLabel}/> }
                     <ValueAxis offsetRight={offsetRight} showGrid={props.showGrid} label={props.Ylabel} offsetTop={offsetTop} offsetLeft={offsetLeft} offsetBottom={offsetBottom}
                       witdh={SVGWidth} height={SVGHeight} setWidthAxis={setHeightYLabel} setHeightFactor={setHeightYFactor}
                       hAxis={heightYLabel} hFactor={heightYFactor} useFactor={props.useMetricFactors === undefined? true: props.useMetricFactors}/>
                      <defs>
                          <clipPath id={"cp-" + guid}>
                              <path stroke={'none'} fill={'none'} d={` M ${offsetLeft},${offsetTop - 5} H  ${SVGWidth - offsetRight + 5} V ${SVGHeight - offsetBottom} H ${offsetLeft} Z`} />
                          </clipPath>
                      </defs>

                      <g clipPath={'url(#cp-' + guid + ')' }>
                         {React.Children.map(props.children, (element) => {
                                   if (!React.isValidElement(element))
                                       return null;
                                   if ((element as React.ReactElement<any>).type === Line || (element as React.ReactElement<any>).type === LineWithThreshold ||
                                   (element as React.ReactElement<any>).type === HorizontalMarker || (element as React.ReactElement<any>).type === VerticalMarker
                                    )
                                       return element;
                                   return null;
                               })}
                         {props.showMouse === undefined || props.showMouse ?
                              <path stroke='black' style={{ strokeWidth: 2, opacity: mouseIn? 0.8: 0.0 }} d={`M ${mousePosition[0]} ${offsetTop} V ${SVGHeight - offsetBottom}`} />
                              : null}
                          {(props.zoom === undefined || props.zoom) && mouseMode === 'zoom' ?
                              <rect fillOpacity={0.8} fill={'black'} x={Math.min(mouseClick[0], mousePosition[0])}
                               y={zoomMode == 'Rect'? Math.min(mouseClick[1], mousePosition[1]) : offsetTop} 
                               width={Math.abs(mouseClick[0] - mousePosition[0])}
                               height={zoomMode == 'Rect'?  Math.abs(mouseClick[1] - mousePosition[1]) : (SVGHeight - offsetTop - offsetBottom)} />
                              : null}
                      </g>
                       <InteractiveButtons showPan={(props.pan === undefined || props.pan)}
                        showZoom={props.zoom === undefined || props.zoom}
                        showReset={!(props.pan !== undefined && props.zoom !== undefined && !props.zoom && !props.pan)}
                        showSelect={props.onSelect !== undefined || handlers.size > 0}
                        showDownload={props.onDataInspect !== undefined}
                        currentSelection={selectedMode}
                        setSelection={(s) => {
                          if (s === "reset") Reset();
                          else if (s === "download") props.onDataInspect!(tDomain);
                          else setSelectedMode(s as ('zoom'|'pan'|'select'))}}
                        x={SVGWidth - offsetRight - 12}
                        y={22} > 
                        {React.Children.map(props.children, (element) => {
                                   if (!React.isValidElement(element))
                                       return null;
                                   if ((element as React.ReactElement<any>).type === Button)
                                       return element;
                                   return null;
                               })} 
                        </InteractiveButtons>

                  </svg>
              </div>
            {props.legend  !== undefined && props.legend !== 'hidden' ? <Legend location={props.legend} height={props.legendHeight !== undefined? props.legendHeight : 50} width={props.legendWidth !== undefined? props.legendWidth : 100} graphWidth={SVGWidth} graphHeight={SVGHeight} /> : null}
           </div>
      </GraphContext.Provider>
  )

}


export default Plot;
