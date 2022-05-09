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
import {IGraphContext, IDataSeries, GraphContext} from './GraphContext';
import {CreateGuid} from '@gpa-gemstone/helper-functions';
import {cloneDeep} from 'lodash';
import TimeAxis from './TimeAxis';
import ValueAxis from './ValueAxis';
import Legend from './Legend';
import LineWithThreshold from './LineWithThreshold';
import Line from './Line';
import Button from './Button';

export interface IProps {
    defaultTdomain: [number, number],
    height: number,
    width: number,

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
    onDataInspect?: (tDomain: [number,number]) => void
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

    // Constants
    const SVGHeight = props.height - (props.legend === 'bottom'? (props.legendHeight !== undefined? props.legendHeight : 50) : 0);
    const SVGWidth = props.width - (props.legend === 'right'? (props.legendWidth !== undefined? props.legendWidth : 100) : 0);

    React.useEffect(() => {
      setTdomain(props.defaultTdomain);
    }, [props.defaultTdomain])
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
     const yMin = Math.min(...[...data.values()].map(series => series.getMin(tDomain)));
     const yMax = Math.max(...[...data.values()].map(series => series.getMax(tDomain)));
     if (!isNaN(yMin) && !isNaN(yMax) && isFinite(yMin) && isFinite(yMax))
         setYdomain([yMin, yMax]);

   }, [tDomain, data]);

    // Adjust x axis
    React.useEffect(() => {
     const dT = tDomain[1] - tDomain[0];
      if (dT === 0)
        return;

      const scale = (SVGWidth - offsetLeft - offsetRight) / dT;
      setTscale(scale);
      setToffset(offsetLeft - tDomain[0] * scale );
    }, [tDomain, offsetLeft, offsetRight]);

    // Adjust y axis
    React.useEffect(() => {
      const dY = yDomain[1] - yDomain[0];

      const scale = (SVGHeight - offsetTop - offsetBottom) / (dY === 0? 0.00001 : dY);
      setYscale(-scale);
      setYoffset(SVGHeight - offsetBottom +(yDomain[0] - (dY ===0? 0.000005 : 0)) * scale);

    }, [yDomain, offsetTop, offsetBottom]);

    function Reset(): void {
        setTdomain(props.defaultTdomain);
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

    function GetContext(): IGraphContext {
      return {
          XDomain: tDomain,
          XScale: tScale,
          XOffset: tOffset,
          XHover: mouseIn? (mousePosition[0] - tOffset) / tScale : NaN,
          YDomain: yDomain,
          YScale: yScale,
          YOffset: yOffset,

          Data: data,
          AddData,
          RemoveData,
          UpdateData,
          SetLegend
      } as IGraphContext
    }

    function handleMouseWheel(evt: any) {
          if (props.zoom !== undefined && !props.zoom)
              return;
          if (!(selectedMode === 'zoom'))
              return;
          if (!mouseIn)
              return;

          evt.stopPropagation();
		      evt.preventDefault();

          let multiplier = 1.25;

          // event.deltaY positive is wheel down or out and negative is wheel up or in
          if (evt.deltaY < 0) multiplier = 0.75;

          let t0 = tDomain[0];
          let t1 = tDomain[1];

          if (mousePosition[0] < offsetLeft)
              t1 = multiplier * (t1 - t0) + t0;
          else if (mousePosition[0] > (SVGWidth - offsetRight))
              t0 = t1 - multiplier * (t1 - t0);
          else {
              const tcenter = (mousePosition[0] - tOffset) / tScale;
              t0 = tcenter - (tcenter - t0) * multiplier;
              t1 = tcenter + (t1 - tcenter) * multiplier;
          }

          if ((t1 - t0) > 10)
            setTdomain([t0, t1]);
      }

    function handleMouseMove(evt: any) {
      if (SVGref.current == null)
        return;
      const pt = SVGref.current!.createSVGPoint();
      pt.x = evt.clientX;
      pt.y = evt.clientY;
      const ptTransform = pt.matrixTransform(SVGref.current!.getScreenCTM().inverse());

        // Compute delta before getting new Mousposition
        const dX = mousePosition[0] - ptTransform.x;

        setMousePosition([ptTransform.x, ptTransform.y]);

        if (mouseMode === 'pan') {
            const dT = dX / tScale;
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
          props.onSelect((ptTransform.x - tOffset)/ tScale)
    }

    function handleMouseUp(_: any) {
        if (mouseMode === 'zoom') {

            if (Math.abs(mousePosition[0] - mouseClick[0]) < 10) {
                setMouseMode('none');
                return;
            }

            const t0 = (Math.min(mousePosition[0], mouseClick[0]) - tOffset) / tScale;
            const t1 = (Math.max(mousePosition[0], mouseClick[0]) - tOffset) / tScale;

            setTdomain((curr) => (Math.min(curr[1], t1) - Math.max(curr[0], t0)) > 10? [Math.max(curr[0], t0), Math.min(curr[1], t1)] : [curr[0],curr[1]]);
        }

        setMouseMode('none');
    }

    function handleMouseOut(_: any) {
        setMouseIn(false);
        if (mouseMode === 'pan')
            setMouseMode('none');
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
                      <TimeAxis label={props.Tlabel} offsetBottom={offsetBottom} offsetLeft={offsetLeft} offsetRight={offsetRight} width={SVGWidth} height={SVGHeight} setHeight={setHeightXLabel} heightAxis={heightXLabel}/>
                      <ValueAxis label={props.Ylabel} offsetTop={offsetTop} offsetLeft={offsetLeft} offsetBottom={offsetBottom}
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
                                    if ((element as React.ReactElement<any>).type === Line || (element as React.ReactElement<any>).type === LineWithThreshold)
                                        return element;
                                    return null;
                                })}
                          {props.showMouse === undefined || props.showMouse ?
                               <path stroke='black' style={{ strokeWidth: 2, opacity: mouseIn? 0.8: 0.0 }} d={`M ${mousePosition[0]} ${offsetTop} V ${SVGHeight - offsetBottom}`} />
                               : null}
                           {(props.zoom === undefined || props.zoom) && mouseMode === 'zoom' ?
                               <rect fillOpacity={0.8} fill={'black'} x={Math.min(mouseClick[0], mousePosition[0])} y={offsetTop} width={Math.abs(mouseClick[0] - mousePosition[0])} height={SVGHeight - offsetTop - offsetBottom} />
                               : null}
                       </g>
                        <InteractiveButtons showPan={(props.pan === undefined || props.pan)}
                         showZoom={props.zoom === undefined || props.zoom}
                         showReset={!(props.pan !== undefined && props.zoom !== undefined && !props.zoom && !props.pan)}
                         showSelect={props.onSelect !== undefined}
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
