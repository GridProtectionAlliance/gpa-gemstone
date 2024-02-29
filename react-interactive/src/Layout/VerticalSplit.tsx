// ******************************************************************************************************
//  VerticalSplit.tsx - Gbtc
//
//  Copyright © 2022, Grid Protection Alliance.  All Rights Reserved.
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
//  12/25/2022 - Christoph Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import { SVGIcons } from '@gpa-gemstone/gpa-symbols';
import { CreateGuid, GetTextWidth } from '@gpa-gemstone/helper-functions';
import _ = require('lodash');
import * as React from 'react';
import ToolTip from '../ToolTip';
import SplitDrawer from './SplitDrawer';
import SplitSection from './SplitSection';


interface IProps {
    style?: any,
    sliderStyle?: any,
}


interface ISection {
    Width: number,
    MinWidth: number,
    MaxWidth: number,
    Open?: boolean,
    Index: number,
    IsDrawer: boolean
    ShowClosed: boolean,
    Percentage: number,
    Label: string,
    Order: number,
    GetOverride?: (func: (open: boolean) => void) => void,
}
// Props Description:
// style => style of the encompasing div

const VerticalSplit: React.FunctionComponent<IProps> = (props) => {
    const divRef = React.useRef<any>(null);

    const [currentWidth, setCurrentWidth] = React.useState<number>(0);

    const [sections, setSections] = React.useState<React.ReactElement<any>[]>([]);
    const [drawer, setDrawer] = React.useState<React.ReactElement<any>[]>([]);
    const [elements, setElements] = React.useState<ISection[]>([]);

    const [totalPercent, setTotalPercent] = React.useState<number>(100);
    const [availableWidth, setAvailableWidth] = React.useState<number>(0);

    const [activeSlider, setActiveSlider] = React.useState<number>(-1);
    const [sliderOriginal, setSliderOriginal] = React.useState<number>(0);

    React.useLayoutEffect(() => {
        setCurrentWidth(divRef.current.offsetWidth ?? 0);
    })

    React.useEffect(() => {
        const p = elements.filter(e => !e.IsDrawer || e.Open).reduce((s,e) => s + e.Percentage,0)
        if (p > 0)
            setTotalPercent(p);
        else
            setTotalPercent(100);
    }, [elements]);


    // comute available width
    React.useEffect(() => {
        const nDividers = elements.reduce((s,e) => s + ((!e.IsDrawer || e.Open)? 1 : 0), 0) -1;

        let drawerMargin = 0;
        if (drawer.some((d) => d.props.ShowClosed === undefined || d.props.ShowClosed))
            drawerMargin = 35;

        drawerMargin = drawerMargin + elements.reduce((s,e) => s + (e.IsDrawer && e.Open? 35 : 0), 0);

        setAvailableWidth(currentWidth - drawerMargin - nDividers*5);
    },[currentWidth, elements])


    React.useEffect(() => {

        setSections(React.Children.map(props.children,(child) => {
            if (!React.isValidElement(child))
                return null;
            if ((child as React.ReactElement<any>).type === SplitSection)
                return (child as React.ReactElement<any>)
            else
                return null

        })?.filter(item => item !== null) ?? []);

        setDrawer(React.Children.map(props.children,(child) => {
            if (!React.isValidElement(child))
                return null;
            if ((child as React.ReactElement<any>).type === SplitDrawer)
                return (child as React.ReactElement<any>)
            else
                return null

        })?.filter(item => item !== null) ?? []);

    }, [props.children])

    React.useEffect(() => {
        let updated = [...elements]
        let hasChanged = false;
        drawer.forEach((item,index) => {
            const e = updated.find(uItem => uItem.Index === index && uItem.IsDrawer);
            const p: ISection = {
                Width: item.props.Width,
                MinWidth: item.props.MinWidth,
                MaxWidth: item.props.MaxWidth,
                Open: item.props.Open,
                Index: index,
                IsDrawer: true,
                ShowClosed: item.props.ShowClosed,
                Percentage: item.props.Width,
                Label: item.props.Title,
                Order: index - drawer.length,
                GetOverride: item.props.GetOverride
            }
            if (e === undefined) {
                hasChanged = true;
                updated.push(p);
                return;
            }
            if (!CompareElements(e,p)) {
                e.Label = p.Label;
                e.MaxWidth = p.MaxWidth;
                e.MinWidth = p.MinWidth;
                e.Percentage = p.Width;
                e.ShowClosed = p.ShowClosed;
                e.GetOverride = p.GetOverride;
                if (e.Width > p.MaxWidth)
                    e.Width = p.MaxWidth;
                if (e.Width < p.MinWidth)
                    e.Width = p.MinWidth;
                hasChanged = true;
            }
        });

        sections.forEach((item,index) => {
            const e = updated.find(uItem => uItem.Index === index && !uItem.IsDrawer);
            const p: ISection = {
                Width: item.props.Width,
                MinWidth: item.props.MinWidth,
                MaxWidth: item.props.MaxWidth,
                Open: undefined,
                Index: index,
                IsDrawer: false,
                ShowClosed: false,
                Percentage: item.props.Width,
                Label: '',
                Order: index
            }
            if (e === undefined) {
                hasChanged = true;
                updated.push(p);
                return;
            }
            if (!CompareElements(e,p)) {
                e.MaxWidth = p.MaxWidth;
                e.MinWidth = p.MinWidth;
                e.Percentage = p.Width;
                if (e.Width > p.MaxWidth)
                    e.Width = p.MaxWidth;
                if (e.Width < p.MinWidth)
                    e.Width = p.MinWidth;
                hasChanged = true;
            }
        });

        if (updated.some(e => (e.IsDrawer && e.Index >= drawer.length) || (!e.IsDrawer && e.Index >= sections.length))){
            hasChanged = true;
            updated = updated.filter(e  => !((e.IsDrawer && e.Index >= drawer.length) || (!e.IsDrawer && e.Index >= sections.length)));
        }
        if (hasChanged)
            setElements(updated)

    },[ drawer, sections ])

    React.useEffect(() => {
        elements.forEach((e,i) => {
            if (e.GetOverride !== undefined)
                e.GetOverride((open: boolean) => { if (open !== e.Open) ToggleDrawer(e.Index)});
        })

    }, [elements])
    function CompareElements(one: ISection, two: ISection) {
        return one.Label === two.Label && one.MaxWidth === two.MaxWidth && one.MinWidth === two.MinWidth && one.Percentage === two.Percentage && one.ShowClosed === two.ShowClosed;
    }

    function CreateSegments() {
        const result: any[] = [];

        const scaling = availableWidth/totalPercent;

        let i = 0;
        _.orderBy(elements,(e) => e.Order).forEach((e,index) => {
            const w = Math.floor(scaling * e.Width);
            if (e.IsDrawer && !e.Open)
                    return;
            if (e.IsDrawer)
                result.push(<div style={{ width: isNaN(w) ? 0 : w, float: 'left', minHeight: 1, height: '100%' }} key={'draw-'+ drawer[e.Index].key}>{drawer[e.Index]}</div>)
            else
                result.push(<div style={{ width: isNaN(w) ? 0 : w, float: 'left', minHeight: 1, height: '100%' }} key={'sec-'+ sections[e.Index].key}>{sections[e.Index]}</div>)

            if (e.IsDrawer)
                result.push(
                    <div style={{ width: 35, float: 'left', minHeight: 1, height: '100%' }} key={drawer[e.Index].key}>
                        <DrawerHeader
                            title={e.Label} symbol={(e.ShowClosed === undefined || e.ShowClosed)? 'Close' : 'X'}
                            onClick={() => ToggleDrawer(e.Index)} showTooltip={false}
                        />
                    </div>
                    );

            // need to rescope otherwhise i will be max at time of callback.
            const scopedI = i*1;
            result.push(<VerticalSplitDivider style={props.sliderStyle}
                onClick={(x) => { setSliderOriginal(x); setActiveSlider(scopedI)}}
                key={'split-' + (e.IsDrawer? drawer[e.Index].key : sections[e.Index].key)} />);

            i = i+1;
        });

        if (result.length > 1)
            result.pop();

        return result;
    }

    function MouseMove(evt: any)  {

        if (activeSlider < 0)
            return;

        // compute ammount moved
        const deltaX = evt.clientX - sliderOriginal;
        const scale = availableWidth/totalPercent;
        let deltaP = deltaX /scale;

        if (deltaX < 10 && deltaX > -10)
            return;

        setSliderOriginal(evt.clientX);
        const currentElements = _.orderBy(elements,(e) => e.Order).filter((e) => !e.IsDrawer || e.Open);
        const updatedElements = [...elements];

        // ensure we don't go past boundaries...
        const lowerMinBoundary = currentElements.reduce((s,e,j) => s + (j <= activeSlider? e.MinWidth : 0), 0)
        const lowerMaxBoundary = currentElements.reduce((s,e,j) => s + (j <= activeSlider? e.MaxWidth : 0), 0)
        const lowerCurrentValue = currentElements.reduce((s,e,j) => s + (j <= activeSlider? e.Width : 0), 0)

        const upperMinBoundary = currentElements.reduce((s,e,j) => s + (j <= activeSlider? 0 : e.MinWidth), 0)
        const upperMaxBoundary = currentElements.reduce((s,e,j) => s + (j <= activeSlider? 0: e.MaxWidth), 0)
        const upperCurrentValue = currentElements.reduce((s,e,j) => s + (j <= activeSlider? 0: e.Width), 0)

        if (lowerCurrentValue + deltaP < lowerMinBoundary)
            deltaP = lowerMinBoundary - lowerCurrentValue;
        if (lowerCurrentValue + deltaP > lowerMaxBoundary)
            deltaP = lowerMaxBoundary - lowerCurrentValue;

        if (upperCurrentValue - deltaP < upperMinBoundary)
            deltaP = upperCurrentValue - upperMinBoundary;
        if (upperCurrentValue - deltaP > upperMaxBoundary)
            deltaP = upperCurrentValue - upperMaxBoundary;

        let totalChange = deltaP;
        let i = activeSlider;

        while (totalChange !== 0 && i >= 0){
            const e = updatedElements.find(f => f.Index === currentElements[i].Index && f.IsDrawer === currentElements[i].IsDrawer)
            i = i - 1;
            if (e === undefined)
                continue;
            if (e.Width + totalChange < e.MinWidth) {
                totalChange = totalChange + (e.Width - e.MinWidth);
                e.Width = e.MinWidth;
            }
            else if (e.Width + totalChange > e.MaxWidth) {
                totalChange = totalChange - (e.MaxWidth - e.Width);
                e.Width = e.MaxWidth;
            }
            else {
                e.Width = e.Width + totalChange;
                totalChange = 0;
            }
        }

        totalChange =  -(deltaP - totalChange);
        i = activeSlider + 1;
        while (totalChange !== 0 && i < currentElements.length){
            const e = updatedElements.find(f => f.Index === currentElements[i].Index && f.IsDrawer === currentElements[i].IsDrawer)
            i = i  + 1;
            if (e === undefined)
                continue;
            if (e.Width + totalChange < e.MinWidth) {
                totalChange = totalChange + (e.Width - e.MinWidth);
                e.Width = e.MinWidth;
            }
            else if  (e.Width + totalChange > e.MaxWidth) {
                totalChange = totalChange - (e.MaxWidth - e.Width);
                e.Width = e.MaxWidth;
            }
            else {
                e.Width = e.Width + totalChange;
                totalChange = 0;
            }
        }

        setElements(updatedElements);

    }

    function ToggleDrawer(index: number) {

        const elementIndex = elements.findIndex(e => e.Index === index && e.IsDrawer);

        if (elementIndex < 0)
            return;

        setElements((element) => {
            const updated = [...element];
            if (drawer[index].props.OnChange !== undefined)
                drawer[index].props.OnChange(!updated[elementIndex].Open)
            updated[elementIndex].Open = !updated[elementIndex].Open;
            if ( updated[elementIndex].Open)
                updated[elementIndex].Order = Math.min(...updated.map(item => item.Order)) - 1;
            return updated;
        })
    }

    const hasDrawerLabels = elements.some(e => e.IsDrawer && (e.ShowClosed === undefined || e.ShowClosed));
    return (
        <div className="d-flex" style={{ ...props.style }} ref={divRef} onMouseUp={() => setActiveSlider(-1)} onMouseMove={MouseMove} onMouseLeave={() => setActiveSlider(-1)}>
            {hasDrawerLabels ? <div style={{ width: 35, float: 'left', minHeight: 1, height: '100%', display: 'flex', flexDirection: 'column' }} >
                {elements.map((e) => e.IsDrawer && (e.ShowClosed === undefined || e.ShowClosed) ? <DrawerHeader
                    showTooltip={!e.Open}
                    title={e.Label} symbol={e.Open ? 'Close' : 'Open'}
                    onClick={() => ToggleDrawer(e.Index)} key={drawer[e.Index].key}
                /> : null)}
                    </div>: null}
            {CreateSegments()}
        </div>
    )
}

export default VerticalSplit;

interface IDividerProps {
    style?: any,
    onClick: (position: number) => void
}
const VerticalSplitDivider: React.FunctionComponent<IDividerProps> = (props) => {

    const style = props.style === undefined? {float: 'left', background: '#6c757d', cursor: 'col-resize'} : props.style;

    return <div
     style={{width: 5, height: '100%', userSelect: 'none', MozUserSelect: 'none', WebkitUserSelect: 'none', ...style}}
        onMouseDown={(evt: any) => props.onClick(evt.clientX)}
    ></div>
}

interface IDrawerHeaderProps {
    title: string,
    onClick: () => void,
    symbol: 'Open'|'Close'|'X',
    showTooltip: boolean
}
const DrawerHeader: React.FunctionComponent<IDrawerHeaderProps> = (props) => {
    const [hover, setHover] = React.useState<boolean>(false);
    const [guid, setGuid] = React.useState<string>(CreateGuid());
    return <>
        <div style={{ background: '#f8f9fa', cursor: 'pointer', zIndex: 1000, width: '100%', overflow: 'hidden', flex: 1}}
            data-tooltip={guid + '-tooltip'}
            onMouseDown={() => {props.onClick();}}
            onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <div style={{height: 24, width: 35, paddingLeft: 5}}>
                {props.symbol === 'Open' ? SVGIcons.ArrowForward : null}
                {props.symbol === 'Close' ? SVGIcons.ArrowBackward : null}
                {props.symbol === 'X' ? SVGIcons.CrossMark : null}
            </div>
            <span style={{ margin: 'auto', writingMode: 'vertical-rl', textOrientation: 'sideways', fontSize: 25, paddingTop: '5px'}}>
                {props.title}
            </span>
        </div>
        {props.showTooltip ? <ToolTip Show={hover} Position={'right'} Theme={'dark'} Target={guid + '-tooltip'} Zindex={9999}>
            {props.title}
        </ToolTip> : null}
    </>
}
