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

import { Context, IContext } from "./Context";
import * as React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Page from "./Page";
import Section from './Section';
import LoadingScreen from '../LoadingScreen';
import ServerErrorIcon from '../ServerErrorIcon';
import styled from "styled-components";
import { SVGIcons } from "@gpa-gemstone/gpa-symbols";
import { Application } from '@gpa-gemstone/application-typings';
import Content from "./Content";

interface IProps {
    HomePath: string,
    DefaultPath: string,
    Logo?: string,
    OnSignOut?: () => void,
    Version?: string,
    UserRoles?: Application.Types.SecurityRoleName[]
    AllowCollapsed?: boolean
    NavBarContent?: React.ReactNode,
    HideSideBar?: boolean,
    UseLegacyNavigation?: boolean
}

interface INavProps { collapsed: boolean }
interface IMainDivProps {w: number}
const SidebarNav = styled.nav <INavProps>`
  & {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    padding: 48px 0 0;
    box-shadow: inset -1px 0 0 rgba(0,0,0,.1);
    width: ${props => props.collapsed? 50 : 200}px;
  }`;

const SidebarDiv = styled.div`
  & {
    position: -webkit-sticky;
    position: sticky;
    height: calc( 100% - 35px);
  }`;

const MainDiv = styled.div<IMainDivProps>`
& {
    top: 40px;
    position: absolute;
    width: calc(100% - ${props => props.w}px);
    height: calc(100% - 48px);
    overflow: hidden;
    left: ${props => props.w}px;
}
& svg {
    user-select: none;
 }`;

const Applications: React.FunctionComponent<IProps> = (props) => {

    const [collapsed, setCollapsed] = React.useState<boolean>(false)

    const showOpen = props.AllowCollapsed !== undefined && props.AllowCollapsed && collapsed;
    const showClose = props.AllowCollapsed !== undefined && props.AllowCollapsed && !collapsed;

    const [ignored, forceUpdate] = React.useReducer((x: number) => x + 1, 0); // integer state for resize renders

    React.useEffect(() => {
        const listener = (evt: any) => forceUpdate();
        window.addEventListener('resize', listener);

        return () => window.removeEventListener('resize', listener);
    
    }, []);

    function GetContext(): IContext {
        return {
            homePath: props.HomePath,
            userRoles: (props.UserRoles ?? ['Viewer']),
            collapsed
        } as IContext
    }

    function CreateRoute(element: React.ReactElement) {
        if (element.props.RequiredRoles !== undefined && element.props.RequiredRoles.filter((r: Application.Types.SecurityRoleName) => GetContext().userRoles.findIndex(i => i === r) > -1).length === 0)
            return <Route path={`${props.HomePath}${element.props.Name}`} element={<ServerErrorIcon Show={true} Label={'You are not authorized to view this page'} />} />;
        return <Route path={`${props.HomePath}${element.props.Name}`} element={<Content>{element.props.children}</Content>} />
    }

    const hideSide = props.HideSideBar === undefined? false : props.HideSideBar;

    return <React.Suspense fallback={<LoadingScreen Show={true} />}>
        <Context.Provider value={GetContext()}>
        {props.UseLegacyNavigation === undefined || !props.UseLegacyNavigation? <Router>
            <div style={{ width: window.innerWidth, height: window.innerHeight, position: "absolute" }}>
                    <HeaderContent 
                        Collapsed={collapsed}
                        SetCollapsed = {setCollapsed}
                        HomePath={props.HomePath}
                        Logo={props.Logo}
                        OnSignOut={props.OnSignOut}
                        Version={props.Version}
                        ShowOpen={showOpen}
                        ShowClose={showClose}
                        HideSide={hideSide}
                        NavBarContent={props.NavBarContent}        
                    >
                        {props.children}
                    </HeaderContent>
                    <MainDiv w={hideSide? 0 : (collapsed ? 50 : 200)}>
                        <Routes>
                            <Route path={`${props.HomePath}`}>
                                <Route index element={<Navigate to={`${props.HomePath}${props.DefaultPath}`} />} />
                                {React.Children.map(props.children, (element) => {
                                    if (!React.isValidElement(element))
                                        return null;
                                    if ((element as React.ReactElement<any>).type === Page && React.Children.count(element.props.children) > 0)
                                        return CreateRoute(element)
                                    if ((element as React.ReactElement<any>).type === Section)
                                        return React.Children.map(element.props.children, (e) => {
                                            if (!React.isValidElement(e))
                                                return null;
                                            if ((e as React.ReactElement<any>).type === Page && React.Children.count((e.props as any).children) > 0)
                                                return CreateRoute(e)
                                            return null;
                                        })
                                    return null;
                                })}
                            </Route>
                        </Routes >
                   
                    </MainDiv>
            </div>
        </Router> : 
        <div style={{ width: window.innerWidth, height: window.innerHeight, position: "absolute" }}>
        <HeaderContent 
            Collapsed={collapsed}
            SetCollapsed = {setCollapsed}
            HomePath={props.HomePath}
            Logo={props.Logo}
            OnSignOut={props.OnSignOut}
            Version={props.Version}
            ShowOpen={showOpen}
            ShowClose={showClose}
            HideSide={hideSide}
            NavBarContent={props.NavBarContent}
        >
            {props.children}
        </HeaderContent>
        <MainDiv w={hideSide? 0 : (collapsed ? 50 : 200)}>
            {props.children}
        </MainDiv>
</div>}
        </Context.Provider>
    </React.Suspense>;
}

export default Applications;

interface IHeaderProps {
    Collapsed: boolean,
    SetCollapsed: (c: boolean) => void,
    HomePath: string,
    Logo?: string,
    OnSignOut?: () => void,
    Version?: string,
    ShowOpen: boolean,
    ShowClose: boolean,
    HideSide: boolean,
    NavBarContent?: React.ReactNode
}

const HeaderContent: React.FunctionComponent<IHeaderProps> = (props) => {

    return <>
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                {props.ShowOpen ? <a style={{ color: '#f8f9fa', marginLeft: 15 }} onClick={() => props.SetCollapsed(false)} >
                    {SVGIcons.ArrowForward}
                </a> : null}
                {props.ShowClose ? <a style={{ color: '#f8f9fa', marginLeft: 15 }} onClick={() => props.SetCollapsed(true)}>
                    {SVGIcons.ArrowBackward}
                </a> : null}
            {props.Logo !== undefined ?
                < a className="navbar-brand col-sm-3 col-md-2 mr-0 mr-auto" href={props.HomePath} ><img style={{ maxHeight: 35, margin: -5 }} src={props.Logo} /></a> : null}
            <ul className="navbar-nav px-3 ml-auto">
                <li className="nav-item text-nowrap">
                    {props.OnSignOut !== undefined ? <a className="nav-link" onClick={props.OnSignOut} >Sign out</a> : null}
                </li>
            </ul>
            {props.NavBarContent}
        </nav>
            {props.HideSide? null : <SidebarNav className={"bg-light"} collapsed={props.Collapsed}>
                <SidebarDiv>
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
                </SidebarDiv>
                {props.Version !== undefined && !props.Collapsed ?
                    <div style={{ width: '100%', textAlign: 'center', height: 35 }}>
                        <span>Version {props.Version}</span>
                        <br />
                        <span></span>
                    </div> : null}
            </SidebarNav>}
</>

}
