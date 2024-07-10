// ******************************************************************************************************
//  BarGroup.tsx - Gbtc
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
//  06/18/2024 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import Bar, { ContexlessBar } from './Bar';
import { IDataSeries, GraphContext, IGraphContext, AxisIdentifier, AxisMap } from '../GraphContext';
import Infobox from '../Infobox';
import { CreateGuid } from '@gpa-gemstone/helper-functions';
import { ReactTable } from '@gpa-gemstone/react-table';

interface IProps {
    /**
     * Flag to determine if infobox is shown when hovering a stacked bar.
    */
    ShowHoverInfoBox?: boolean,
    /**
     * Background color of the hoverable infobox table. 
     */
    HoverColor?: string,
}

interface IContextData {
    getPoint?: (xVal: number) => number[] | undefined,
    enabled: boolean,
    legendName?: string
}

interface IHoverData {
    Name?: string,
    Value: number
}

export interface IBarContext extends IGraphContext {
    GetYPosition?: (xVal: number, barGuid: string, axis: AxisIdentifier | undefined) => number,
    AddData: (d: IBarDataSeries, legendName?: string) => string,
    UpdateData: (key: string, d: IBarDataSeries, legendName?: string) => void,
}

export interface IBarDataSeries extends IDataSeries {
    getPoint?: (xVal: number) => number[] | undefined
}

/**
    Wraps bar components to vertically stacks bars with matching x values. 
*/
const BarGroup: React.FC<IProps> = (props) => {
    const context = React.useContext(GraphContext);

    const guid = React.useRef<string>(CreateGuid());
    const hoverRef = React.useRef<HTMLDivElement | null>(null);
    const map = React.useRef<Map<string, IContextData>>(new Map());

    const [barGuids, setBarGuids] = React.useState<string[]>([]);
    const [hoverData, setHoverData] = React.useState<IHoverData[] | null>(null);

    const GetYPosition = (xVal: number, barGuid: string, axis: AxisIdentifier): number | undefined => {
        const matchedGUID = barGuids.find(uid => uid === barGuid);
        if (matchedGUID == null) return;

        const dataSeries = map.current.get(barGuid);
        if (dataSeries == null || dataSeries.getPoint == null) return;
        let data = dataSeries.getPoint(xVal)

        if (data == null) return;

        //Not supporting negative values for now
        const yValue = data[1]
        if (yValue < 0) return;

        const baseY = context.YTransformation(0, AxisMap.get(axis));
        const height = baseY - context.YTransformation(yValue, AxisMap.get(axis))
        let totalHeight = 0;

        for (let index = 0; index < barGuids.length; index++) {
            const guid = barGuids[index];

            if (matchedGUID === guid)
                break;

            const dataSeries = map.current.get(guid);
            if (dataSeries == null || !dataSeries.enabled || dataSeries?.getPoint == null) continue;

            let data = dataSeries.getPoint(xVal);
            if (data == null) continue;

            const yVal = context.YTransformation(data[1], AxisMap.get(axis));
            const height = baseY - yVal;

            totalHeight += height;
        }

        const yPosition = baseY - totalHeight - height
        if (isNaN(yPosition))
            return;

        return baseY - totalHeight - height
    };

    //Effect to set hoverData
    React.useEffect(() => {
        if ((props.ShowHoverInfoBox ?? false) === false) return;
        if (barGuids.length === 0 || isNaN(context.XHover) || context.XHover > context.XDomain[1] || context.XHover < context.XDomain[0]) {
            setHoverData(null);
            return;
        }
        const points: IHoverData[] = [];

        barGuids.forEach(guid => {
            const contextData = map.current.get(guid);
            if (contextData == null || contextData?.getPoint == null) return;
            let point = contextData.getPoint(context.XHover);
            if (point == null) return;
            points.push({ Name: contextData.legendName, Value: point[1] })
        })

        if (points.length === 0) {
            setHoverData(null);
            return;
        }

        setHoverData(points)
    }, [context.XHover, context.YHover])

    const hoverContent = React.useMemo(() => {
        if (hoverData == null || hoverData.length === 0) return <></>
        return (
            <div ref={hoverRef} style={{ backgroundColor: props.HoverColor ?? 'lightgray', opacity: 0.75 }}>
                <ReactTable.Table<IHoverData>
                    Data={hoverData}
                    SortKey=''
                    Ascending={false}
                    OnSort={() => {/* nothing */ }}
                    KeySelector={row => row.Name ?? row.Value}
                    RowStyle={{ whiteSpace: 'nowrap' }}
                >
                    <ReactTable.Column<IHoverData>
                        Key={`Name`}
                        Field={'Name'}
                        AllowSort={false}
                    >
                        {'\u200B'}
                    </ReactTable.Column>
                    <ReactTable.Column<IHoverData>
                        Key={`Value`}
                        Field={`Value`}
                        AllowSort={false}
                        RowStyle={{ textAlign: 'right' }}
                    >
                        {'\u200B'}
                    </ReactTable.Column>
                </ReactTable.Table>
            </div>
        )
    }, [hoverData])

    const addData = (d: IBarDataSeries, legendName?: string): string => {
        const guid = context.AddData(d);
        map.current.set(guid, { enabled: d.enabled, legendName, getPoint: d.getPoint });
        setBarGuids(guids => [...guids, guid])
        return guid;
    }

    const updateData = (guid: string, d: IBarDataSeries, legendName?: string) => {
        context.UpdateData(guid, d);
        map.current.set(guid, { enabled: d.enabled, legendName, getPoint: d.getPoint })
    }

    const barContext = React.useMemo(() => {
        return {
            ...context,
            GetYPosition: GetYPosition,
            AddData: addData,
            UpdateData: updateData
        } as IBarContext;
    }, [context]);

    return (
        <g>
            {React.Children.map(props.children, (element) => {
                if (!React.isValidElement(element)) return null;

                if (element.type === Bar) {
                    return (
                        <ContexlessBar
                            key={element.key}
                            BarProps={element.props}
                            Context={barContext}
                        />
                    );
                }
            })}
            {hoverData != null ?
                <Infobox ChildID={guid.current} X={context.XHover} Y={getYHoverPosition(hoverRef.current, context)} Origin={getOrigin(hoverRef.current, context)} Offset={5}>
                    <div id={guid.current}>{hoverContent}</div>
                </Infobox>
                : null}
        </g>
    );
}

const getOrigin = (hoverRef: HTMLDivElement | null,context: IBarContext) => {
    if(hoverRef == null) return 'upper-left';

    const middleOfXDomain = (context.XDomain[0] + context.XDomain[1]) / 2
    if(context.XHover > middleOfXDomain)
        return 'upper-right'
    return 'upper-left'
}

const getYHoverPosition = (hoverRef: HTMLDivElement | null, context: IBarContext): number => {
    if(hoverRef == null) return context.YHover[0];
    const middleOfPlot = (context.YDomain[0][0] + context.YDomain [0][1]) / 2;
    return middleOfPlot
}

export default BarGroup;
