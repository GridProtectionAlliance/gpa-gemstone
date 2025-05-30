// ******************************************************************************************************
//  SideBarContent.tsx - Gbtc
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
//  02/13/2022 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import Page from "../Page";
import Section from '../Section';
import { useGetContainerPosition } from '@gpa-gemstone/helper-functions';

interface IProps {
    Collapsed: boolean,
    Version?: string,
    SidebarUI?: JSX.Element;
    HideSide: boolean,
    NavbarHeight: number
    SetSideBarWidth: React.Dispatch<React.SetStateAction<number>>
}

const SidebarNavStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,
    boxShadow: 'inset -1px 0 0 rgba(0,0,0,.1)'
};

const SidebarBodyStyle: React.CSSProperties = {
    position: 'sticky',
    overflowY: 'auto',
    overflowX: 'hidden'
};

const SideBarContent: React.FC<IProps> = (props) => {
    const sideBarRef = React.useRef<HTMLDivElement | null>(null);

    const additionalUIRef = React.useRef<HTMLDivElement | null>(null);
    const { height: additionalUIHeight } = useGetContainerPosition(additionalUIRef);

    const { width } = useGetContainerPosition(sideBarRef);
    const widthStyle = props.Collapsed ? 'auto' : 200;

    const heightToSubtract = React.useMemo(() => {
        const hasVersion = props.Version != null;
        const hasExtraUI = props.SidebarUI != null;

        if (!hasVersion && !hasExtraUI)
            return 0;

        if (hasVersion && hasExtraUI)
            return 35 + additionalUIHeight;

        if(hasExtraUI)
            return additionalUIHeight;

        return 35;
    }, [props.Version, props.SidebarUI, additionalUIHeight])

    React.useEffect(() => props.SetSideBarWidth(width), [width])

    return <>
        {props.HideSide ? null :
            <div className={"bg-light navbar-light navbar"} style={{ ...SidebarNavStyle, width: widthStyle, padding: `${props.NavbarHeight}px 1px 0px` }} ref={sideBarRef}>
                <div style={{ ...SidebarBodyStyle, height: `calc(100% - ${heightToSubtract}px)` }}>
                    <ul className="navbar-nav px-3">
                        {React.Children.map(props.children, (e) => {
                            if (!React.isValidElement(e))
                                return null;
                            if ((e as React.ReactElement<any>).type === Page)
                                return e;
                            return null
                        })}
                    </ul>
                    {React.Children.map(props.children, (e) => {
                        if (!React.isValidElement(e))
                            return null;
                        if ((e as React.ReactElement<any>).type === Section)
                            return e;
                        return null
                    })}
                </div>
                {props.Version !== undefined && !props.Collapsed ?
                    <div style={{ width: '100%', textAlign: 'center', height: 35 }}>
                        <span>Version {props.Version}</span>
                        <br />
                        <span></span>
                    </div> : null}

                {props.SidebarUI != null && !props.Collapsed ?
                    <div ref={additionalUIRef} style={{ width: '100%' }}>
                        {props.SidebarUI}
                    </div>
                    : null}
            </div>
        }
    </>
}

export default SideBarContent;