// ******************************************************************************************************
//  TabSelector.tsx - Gbtc
//
//  Copyright © 2021, Grid Protection Alliance.  All Rights Reserved.
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
//  05/20/2021 - Christoph Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import { CreateGuid, GetNodeSize, GetTextWidth } from '@gpa-gemstone/helper-functions';

interface ITab {
    Label: string,
    Id: string,
}

interface IProps {
    Tabs: ITab[],
    SetTab: (t: string) => void,
    CurrentTab: string,
}

/**
 * Component for rendering a dropdown tab selector.
 * @param props - configures and manages tab selector.
 */
const TabSelector = (props: IProps) => {

    // State to manage things like visible tabs and container width.
    const [nVisible, setNVisible] = React.useState<number>(1);
    const [width, setWidth] = React.useState<number>(100);
    const guid = React.useRef<HTMLDivElement | null>(null);
    const [dropDownOpen, setDropDownOpen] = React.useState<boolean>(false);

    // Resets dropdown state with the CurrentTab changes.
    React.useEffect(() => {
        setDropDownOpen(false);
    }, [props.CurrentTab]);

    // Dynamically calculates number of visible tabs.
    React.useEffect(() => {
        let Wtext = 40;

        let Ntext = 0;
        while (Ntext < props.Tabs.length) {
            const w = 2 * 17 + GetTextWidth("Segoe UI", '14px', props.Tabs[Ntext].Label) + 1
            if (Wtext + w > (width - 2))
                break;
            Wtext = Wtext + w;
            Ntext = Ntext + 1;
        }
        setNVisible(Ntext);
    }, [width, props.Tabs]);

    React.useEffect(() => {
        const target = guid.current;
        if (target != null) {
            const observer = new ResizeObserver(entries => {
                for (const entry of entries) {
                    const newWidth = entry.contentRect.width;
                    if (newWidth !== width) {
                        setWidth(newWidth);
                    }
                }
            });
            observer.observe(target);
            return () => observer.unobserve(target);
        }
    }, [guid]);

    // Determines if there are more tabs to show in dropdown option.
    const showExp = nVisible < props.Tabs.length;

    if (width < 50)
        return <div style={{ width: '100%' }} ref={guid}> </div>

    return <div style={{ width: '100%' }} ref={guid}>
        <ul className="nav nav-tabs" style={{ maxHeight: 38 }}>
            {props.Tabs.map((t, i) => i > (nVisible - 1) ? null :
                <li className="nav-item" key={i} style={{ cursor: 'pointer' }}>
                    <a className={"nav-link" + (props.CurrentTab === t.Id ? " active" : "")} onClick={() => props.SetTab(t.Id)}>{t.Label}</a>
                </li>
            )}
            {showExp ?
                <li className={`nav-item dropdown ${dropDownOpen ? ' show' : ''}`} style={{ zIndex: 1040 }}>
                    <a className="nav-link dropdown-toggle" onClick={() => setDropDownOpen(s => !s)} >...</a>
                    <div className={`dropdown-menu dropdown-menu-right ${dropDownOpen ? ' show' : ''}`}>
                        {props.Tabs.map((t, i) => i > (nVisible - 1) ?
                            <a className={`dropdown-item ${props.CurrentTab === t.Id ? ' active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => props.SetTab(t.Id)} key={i}>{t.Label}</a> : null)
                        }
                    </div>
                </li> : null}
        </ul>
    </div>

}


export default TabSelector;