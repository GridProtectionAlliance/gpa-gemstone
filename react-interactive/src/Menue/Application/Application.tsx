// ******************************************************************************************************
//  Application.tsx - Gbtc
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

import { Context, IContext } from "../Context";
import * as React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Page, { IProps as IPageProps } from "../Page";
import Section from '../Section';
import LoadingScreen from '../../LoadingScreen';
import ServerErrorIcon from '../../ServerErrorIcon';
import styled from "styled-components";
import { Application } from '@gpa-gemstone/application-typings';
import Content from "../Content";
import { useGetContainerPosition } from '@gpa-gemstone/helper-functions';
import SideBarContent from "./SideBarContent";
import HeaderContent from "./HeaderContent";

interface IProps {
    /** 
     * Root path prepended to every application route.
     */
    HomePath: string;

    /**
     * Default subpath opened when the user lands on `HomePath`.
     */
    DefaultPath: string;

    /** 
     * Optional logo URL displayed in the top navigation bar.
     */
    Logo?: string;

    /** 
     * Optional callback fired when the user clicks the sign-out link.
     */
    OnSignOut?: () => void;

    /** 
     * Optional version text displayed in the expanded sidebar footer.
     */
    Version?: string;

    /**
     * Optional custom content displayed in the expanded sidebar footer.
     */
    SidebarUI?: JSX.Element;
    /** 
     * Optional roles used for navigation and route access checks, defaulting to `Viewer`.
     */
    UserRoles?: Application.Types.SecurityRoleName[];

    /**
     * Optional flag that allows users to collapse and expand the sidebar, defaulting to false.
     */
    AllowCollapsed?: boolean;

    /**
     * Optional content rendered at the end of the top navigation bar.
     */
    NavBarContent?: React.ReactNode;

    /** 
     * Optional flag that hides the sidebar completely, defaulting to false.
     */
    HideSideBar?: boolean;

    /**
     * Optional flag that uses legacy navigation and layout, defaulting to false.
     */
    UseLegacyNavigation?: boolean;
    /**
     * Optional inline styles applied to the navigation bar.
     */
    NavBarStyle?: React.CSSProperties;
    /**
     * Optional inline styles applied to the navigation logo, defaulting to `{ maxHeight: 35, margin: -5 }`.
     */
    NavBarImgStyle?: React.CSSProperties
}

export interface IApplicationRefs {
    mainDiv: HTMLDivElement | null;
    navBarDiv: HTMLDivElement | null;
}

interface IMainDivProps {
    /**
     * Horizontal offset in pixels reserved for the sidebar.
     */
    left: number,
    /**
     * Vertical offset in pixels reserved for the navigation bar.
     */
    top: number
}

/**
 * Positions the application content beside the sidebar and beneath the navigation bar.
 * @param props - Supplies the measured sidebar and navigation offsets.
 * @returns The styled main-content container.
 */
const MainDiv = styled.div<IMainDivProps>`
& {
    top: ${props => props.top}px;
    position: absolute;
    width: calc(100% - ${props => props.left}px);
    height: calc(100% - ${props => props.top}px);
    overflow: hidden;
    left: ${props => props.left}px;
}
& svg {
    user-select: none;
 }`;

/**
 * Renders the application shell, responsive navigation, authorized routes, and page content.
 * @param props - Configures routing, navigation, access control, branding, and page children.
 * @param ref - Receives references to the main content and navigation elements.
 * @returns The modern routed shell or legacy application layout.
 */
const Applications: React.ForwardRefRenderFunction<IApplicationRefs, React.PropsWithChildren<IProps>> = (props, ref) => {
    const [collapsed, setCollapsed] = React.useState<boolean>(false)
    const navBarRef = React.useRef<HTMLDivElement>(null);
    const mainDivRef = React.useRef<HTMLDivElement>(null);
    const { width } = useGetContainerPosition(mainDivRef);

    const [activePageLabel, setActivePageLabel] = React.useState<string | null>(null);
    const originalTitle = React.useMemo(() => document.title, []);
    const pageTitle = React.useMemo(() => activePageLabel ?? originalTitle, [activePageLabel, originalTitle]);

    React.useEffect(() => {
        document.title = pageTitle;
    }, [pageTitle]);

    const [_ignored, forceUpdate] = React.useReducer((x: number) => x + 1, 0); // integer state for resize renders

    const [navBarHeight, setNavBarHeight] = React.useState<number>(40);
    const [sidebarWidth, setSideBarWidth] = React.useState<number>(50);

    const [shouldRemoveSideNav, setShouldRemoveSideNav] = React.useState<boolean>(false);
    const [shouldAddCollapseOptions, setShouldAddCollapseOptions] = React.useState<boolean>(false);
    const [activeSection, setActiveSection] = React.useState<string>('');

    const showOpen = (props.AllowCollapsed !== undefined && props.AllowCollapsed || shouldAddCollapseOptions) && collapsed;
    const showClose = (props.AllowCollapsed !== undefined && props.AllowCollapsed || shouldAddCollapseOptions) && !collapsed;
    const hideSide = (props.HideSideBar === undefined && !shouldRemoveSideNav) ? false : ((props.HideSideBar ?? false) || shouldRemoveSideNav);

    React.useLayoutEffect(() => {
        setNavBarHeight(navBarRef.current?.offsetHeight ?? 40)
    });

    // check to collapse or remove side nav
    React.useEffect(() => {

        // width will be 0 if the browser has not completely initialized
        if (width === 0) return;

        // may not be possible in desktop browsers, but may be possible on phones
        if (width <= 200) {
            setShouldRemoveSideNav(true);
            return
        }

        if (width <= 600) {
            if (props.AllowCollapsed ?? false) {
                setCollapsed(true)
                setShouldAddCollapseOptions(true)
                return
            }
            setShouldRemoveSideNav(true)
            return
        }

        setCollapsed(false)
        setShouldRemoveSideNav(false)

    }, [width, props.AllowCollapsed])

    // listen for resizing
    React.useEffect(() => {
        const listener = (evt: any) => forceUpdate();
        window.addEventListener('resize', listener);

        return () => window.removeEventListener('resize', listener);

    }, []);

    React.useImperativeHandle(ref, () => ({
        mainDiv: mainDivRef.current,
        navBarDiv: navBarRef.current,
    }));

    const context = React.useMemo(() => (
        {
            homePath: props.HomePath,
            userRoles: (props.UserRoles ?? ['Viewer']),
            collapsed,
            useSearchMatch: props.UseLegacyNavigation ?? false,
            activeSection,
            setActiveSection,
            setActivePageLabel
        }),
        [props.HomePath, props.UserRoles, collapsed, props.UseLegacyNavigation, activeSection]);

    function CreateRoute(element: React.ReactElement<React.PropsWithChildren<IPageProps>>): JSX.Element[] {
        const routes: JSX.Element[] = [];

        // Generate a route for the Name prop
        if (element.props.RequiredRoles !== undefined && element.props.RequiredRoles.filter((r: Application.Types.SecurityRoleName) => context.userRoles.findIndex(i => i === r) > -1).length === 0)
            routes.push(<Route path={`${props.HomePath}${element.props.Name}`} element={<ServerErrorIcon Show={true} Label={'You are not authorized to view this page.'} />} />);
        else
            routes.push(<Route path={`${props.HomePath}${element.props.Name}`} element={<Content>{element.props.children}</Content>} />);

        // Generate additional routes for Paths prop if it exists
        if ((element.props.Paths != null)) {
            for (const path of element.props.Paths) {
                const fullPath = `${props.HomePath}${element.props.Name}${path}`;
                if (element.props.RequiredRoles !== undefined && element.props.RequiredRoles.filter((r: Application.Types.SecurityRoleName) => context.userRoles.findIndex(i => i === r) > -1).length === 0)
                    routes.push(<Route path={fullPath} element={<ServerErrorIcon Show={true} Label={'You are not authorized to view this page.'} />} />);
                else
                    routes.push(<Route path={fullPath} element={<Content>{element.props.children}</Content>} />);
            }
        }

        return routes;
    }

    return (
        <Context.Provider value={context}>
            {props.UseLegacyNavigation === undefined || !props.UseLegacyNavigation ? <Router>
                <div ref={mainDivRef} style={{ width: '100%', height: '100%', position: "absolute" }}>
                    <HeaderContent
                        SetCollapsed={setCollapsed}
                        HomePath={props.HomePath}
                        Logo={props.Logo}
                        OnSignOut={props.OnSignOut}
                        ShowOpen={hideSide ? false : showOpen}
                        ShowClose={hideSide ? false : showClose}
                        NavBarContent={props.NavBarContent}
                        ref={navBarRef}
                        NavBarStyle={props.NavBarStyle}
                        ImgStyle={props.NavBarImgStyle}
                    />
                    <React.Suspense fallback={<LoadingScreen Show={true} />}>
                        <SideBarContent
                            Collapsed={collapsed}
                            HideSide={hideSide}
                            Version={props.Version}
                            SidebarUI={props.SidebarUI}
                            SetSideBarWidth={setSideBarWidth}
                            NavbarHeight={navBarHeight}
                        >
                            {props.children}
                        </SideBarContent>
                        <MainDiv left={hideSide ? 0 : (collapsed ? sidebarWidth : 200)} top={navBarHeight}>
                            <Routes>
                                <Route path={`${props.HomePath}`}>
                                    <Route index element={<Navigate to={`${props.HomePath}${props.DefaultPath}`} />} />
                                    {React.Children.map(props.children, (element) => {
                                        if (!React.isValidElement(element))
                                            return null;
                                        if ((element as React.ReactElement).type === Page && React.Children.count(element.props.children) > 0)
                                            return CreateRoute(element as React.ReactElement<React.PropsWithChildren<IPageProps>>)
                                        if ((element as React.ReactElement<any>).type === Section)
                                            return React.Children.map(element.props.children, (e) => {
                                                if (!React.isValidElement(e))
                                                    return null;
                                                if ((e as React.ReactElement<any>).type === Page && React.Children.count((e.props as any).children) > 0)
                                                    return CreateRoute(e as React.ReactElement<React.PropsWithChildren<IPageProps>>)
                                                return null;
                                            })
                                        return null;
                                    })}
                                </Route>
                            </Routes >
                        </MainDiv>
                    </React.Suspense>
                </div>
            </Router> :
                <div ref={mainDivRef} style={{ width: '100%', height: '100%', position: "absolute" }}>
                    <HeaderContent
                        SetCollapsed={setCollapsed}
                        HomePath={props.HomePath}
                        Logo={props.Logo}
                        OnSignOut={props.OnSignOut}
                        ShowOpen={showOpen}
                        ShowClose={showClose}
                        NavBarContent={props.NavBarContent}
                        ref={navBarRef}
                        NavBarStyle={props.NavBarStyle}
                        ImgStyle={props.NavBarImgStyle}
                    />
                    <SideBarContent
                        Collapsed={collapsed}
                        HideSide={hideSide}
                        Version={props.Version}
                        SetSideBarWidth={setSideBarWidth}
                        SidebarUI={props.SidebarUI}
                        NavbarHeight={navBarHeight}
                    >
                        {props.children}
                    </SideBarContent>
                    <MainDiv left={hideSide ? 0 : (collapsed ? sidebarWidth : 200)} top={navBarHeight}>
                        {React.Children.map(props.children, (element) => {
                            if (!React.isValidElement(element))
                                return null;
                            if ((element as React.ReactElement<any>).type === Page && React.Children.count(element.props.children) > 0)
                                return element.props.children;
                            if ((element as React.ReactElement<any>).type === Section)
                                return null;
                            return element;
                        })}
                    </MainDiv>
                </div>}
        </Context.Provider>
    )
};

export default React.forwardRef<IApplicationRefs, React.PropsWithChildren<IProps>>(Applications);