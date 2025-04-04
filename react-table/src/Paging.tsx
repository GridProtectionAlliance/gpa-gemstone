//  ******************************************************************************************************
//  Paging.tsx - Gbtc
//
//  Copyright © 2023, Grid Protection Alliance.  All Rights Reserved.
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
//  08/01/2023 - C. Lackner
//       Generated original version of source code.
//
//  ******************************************************************************************************
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { useGetContainerPosition } from '@gpa-gemstone/helper-functions';
import * as React from 'react';

export interface IProps {
    Current: number,
    Total: number,
    SetPage: (p: number) => void,
}

const defaultMaxPagesToShow = 7;

const Paging = (props: IProps) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const { scrollWidth, width } = useGetContainerPosition(containerRef);

    const [pagesToShow, setPagesToShow] = React.useState<number[]>([]);
    const [maxPagesToShow, setMaxPagesToShow] = React.useState<number>(defaultMaxPagesToShow);

    const minPageToShow = React.useMemo(() => {
        const min = Math.min(...pagesToShow);
        if (!isFinite(min) || isNaN(min)) return 0;
        return min;
    }, [pagesToShow]);

    const maxPageToShow = React.useMemo(() => {
        const max = Math.max(...pagesToShow);
        if (!isFinite(max) || isNaN(max)) return 0;
        return max
    }, [pagesToShow]);

    React.useEffect(() => {
        const newPagesToShow = [];
        let startPage = Math.max(props.Current - Math.floor(maxPagesToShow / 2), 1);

        if (props.Total - startPage < maxPagesToShow)
            startPage = Math.max(props.Total - maxPagesToShow + 1, 1);

        while (startPage <= props.Total && newPagesToShow.length < maxPagesToShow) {
            newPagesToShow.push(startPage);
            startPage = startPage + 1;
        }

        setPagesToShow(newPagesToShow);
    }, [props.Total, props.Current, width, scrollWidth, maxPagesToShow]);

    //Effect to decrement maxPagesToShow if we are overflowing
    React.useLayoutEffect(() => {
        if (scrollWidth > width)
            setMaxPagesToShow(prev => Math.max(prev - 1, 1))

    }, [width, scrollWidth])

    //Effect to increment maxPagesToShow if we have enough space
    React.useLayoutEffect(() => {
        if (maxPagesToShow >= defaultMaxPagesToShow || containerRef.current == null) return

        const childArray = Array.from(containerRef.current.children);

        // Sum widths of all <li> elements
        const trueWidth = childArray.reduce((sum, child) => sum + (child as HTMLElement).offsetWidth, 0);
        const availableWidth = width - trueWidth;

        const estimatedButtonWidthWithTolerance = 50;

        if (availableWidth >= estimatedButtonWidthWithTolerance) 
            setMaxPagesToShow(prev => Math.min(defaultMaxPagesToShow, prev + 1));
        
    }, [width, maxPagesToShow]);


    const showLeftBlock = maxPagesToShow < defaultMaxPagesToShow
        ? minPageToShow !== 1
        : minPageToShow > 2;

    const showRightBlock = maxPagesToShow < defaultMaxPagesToShow
        ? maxPageToShow !== props.Total
        : maxPageToShow + 2 <= props.Total;

    return (
        <ul className="pagination justify-content-center" ref={containerRef as any}>

            <li className={"page-item" + (minPageToShow <= 1 ? ' disabled' : "")} key="previous" style={{ cursor: 'pointer' }}>
                <a className="page-link" onClick={() => {
                    if (minPageToShow > 1)
                        props.SetPage(Math.max(props.Current - defaultMaxPagesToShow, 1))
                }}>
                    <ReactIcons.DoubleChevronLeft Size={15} />
                </a>
            </li>

            <li className={"page-item" + (props.Current <= 1 ? ' disabled' : "")} key="step-previous" style={{ cursor: 'pointer' }}>
                <a className="page-link" onClick={() => {
                    if (props.Current > 1)
                        props.SetPage(props.Current - 1)
                }}>
                    <ReactIcons.ChevronLeft Size={15} />
                </a>
            </li>

            {showLeftBlock ? <>
                <li className={"page-item"} key={"1"} style={{ cursor: 'pointer' }}>
                    <a className={"page-link"} onClick={() => props.SetPage(1)}>
                        1
                    </a>
                </li>
                <li className={"page-item disabled"} key={"skip-1"} >
                    <a className={"page-link"}>...</a>
                </li>
            </> : null}

            {pagesToShow.map((p) =>
                <li className={"page-item" + (p == props.Current ? " active" : "")} key={p} style={{ cursor: 'pointer' }}>
                    <a className={"page-link"} onClick={() => props.SetPage(p)}>
                        {p}
                    </a>
                </li>)}

            {showRightBlock ? <>
                <li className={"page-item disabled"} key={"skip-2"}>
                    <a className={"page-link"}>...</a>
                </li>
                <li className={"page-item"} key={props.Total} style={{ cursor: 'pointer' }}>
                    <a className={"page-link"} onClick={() => props.SetPage(props.Total)}>
                        {props.Total}
                    </a>
                </li>
            </> : null}

            <li className={"page-item" + (props.Current >= props.Total ? ' disabled' : "")} key="step-next" style={{ cursor: 'pointer' }}>
                <a className="page-link" onClick={() => {
                    if (props.Current < props.Total)
                        props.SetPage(props.Current + 1)
                }}
                >
                    <ReactIcons.ChevronRight Size={15} />
                </a>
            </li>

            <li className={"page-item" + (maxPageToShow == props.Total ? ' disabled' : "")} key={'next'} style={{ cursor: 'pointer' }}>
                <a className="page-link" onClick={() => {
                    if (maxPageToShow < props.Total)
                        props.SetPage(Math.min(props.Current + defaultMaxPagesToShow, props.Total))
                }}
                >
                    <ReactIcons.DoubleChevronRight Size={15} />
                </a>
            </li>
        </ul>
    )

}

export default Paging;