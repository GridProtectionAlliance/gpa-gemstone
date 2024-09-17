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
import * as React from 'react';

export interface IProps {
    Current: number,
    Total: number,
    SetPage: (p: number) => void
}

export default function (props: IProps) {
    const [pages, setPages] = React.useState<number[]>([]);

    const nPages = 7;
    const minPg = React.useMemo(() => {
        const min = Math.min(...pages);
        if (isFinite(min)) return min;
        else return 0;
    }, [pages]);
    const maxPg = React.useMemo(() => Math.max(...pages, 0), [pages]);

    React.useEffect(() => {
        const display = [];
        let p = Math.max(props.Current - Math.floor(nPages / 2), 1);
        if (props.Total - p < nPages)
            p = Math.max(props.Total - nPages + 1,1);

        while (p <= props.Total && display.length < nPages) {
            display.push(p);
            p = p + 1;
        }
        setPages(display);
    }, [props.Total, props.Current]);

    return <ul className="pagination justify-content-center">
        <li className={"page-item" + (minPg <= 1 ? ' disabled' : "")} key="previous">
            <a className="page-link" onClick={() => {
                if (minPg > 1)
                    props.SetPage(Math.max(props.Current - nPages,1))
            }}>Previous</a>
        </li>
        {minPg > 2 ? <>
            <li className={"page-item"} key={"1"}>
                <a className={"page-link"} onClick={() => props.SetPage(1)}>1</a>
            </li>
            <li className={"page-item disabled"} key={"skip-1"}>
                <a className={"page-link"}>...</a>
            </li>
        </> : null}
        {pages.map((p) => <li className={"page-item" + (p == props.Current ? " active" : "")} key={p}>
            <a className={"page-link"} onClick={() => props.SetPage(p)}>{p}</a>
        </li>)}
        {maxPg + 2 <= props.Total ? <>
            <li className={"page-item disabled"} key={"skip-2"}>
                <a className={"page-link"}>...</a>
            </li>
            <li className={"page-item"} key={props.Total}>
                <a className={"page-link"} onClick={() => props.SetPage(props.Total)}>{props.Total}</a>
            </li>
        </> : null}
        <li className={"page-item" + (maxPg == props.Total ? ' disabled' : "")} key={'next'}>
            <a className="page-link" onClick={() => {
                if (maxPg < props.Total)
                    props.SetPage(Math.min(props.Current + nPages, props.Total))
            }
            }>Next</a>
        </li>
    </ul>

}


