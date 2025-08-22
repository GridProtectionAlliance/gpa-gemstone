// ******************************************************************************************************
//  ReactIcons.tsx - Gbtc
//
//  Copyright © 2024, Grid Protection Alliance.  All Rights Reserved.
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
//  05/07/2024 - C Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************
import * as React from 'react';

interface IProps {
    /**
    * Width and height of icon
    * @type {number | string}
    * @optional
   */
    Size?: number | string,
    /**
    * Color of the icon
    * @type {string}
    * @optional
   */
    Color?: string,
    /**
     * Optional style object to apply to the icon
     */
    Style?: React.CSSProperties
    /**
     * Optional Stroke Width to apply to the icon
    */
    StrokeWidth?: number | string
}

export namespace ReactIcons {

    export const DataContainer = (props: IProps) => <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file">
        <path d="M 3,4.5 a 9,4.5 0,0,0 18 3 a 9,4.5 0,0,0 -18 0 l 0,11 a 9,4.5 0,0,0 18 0 l 0,-11" />
    </svg>;

    export const Cube = (props: IProps) => <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file">
        <rect x="1" y="8" width="15" height="15" />
        <rect x="6" y="3" width="15" height="15" />
        <line x1="1" x2="6" y1="8" y2="3" />
        <line x1="16" x2="21" y1="8" y2="3" />
        <line x1="16" x2="21" y1="23" y2="18" />
        <line x1="1" x2="6" y1="23" y2="18" />
    </svg>

    export const House = (props: IProps) => <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-home">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>

    export const Document = (props: IProps) => <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>

    export const ArrowForward = (props: IProps) => <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill={props.Color ?? "currentColor"} stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <polygon points="6.23,20.23 8,22 18,12 8,2 6.23,3.77 14.46,12" />
    </svg>

    export const ArrowBackward = (props: IProps) => <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill={props.Color ?? "currentColor"} stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <polygon points="17.77,3.77 16,2 6,12 16,22 17.77,20.23 9.54,12" />
    </svg>

    export const ArrowDropUp = (props: IProps) => <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill={props.Color ?? "currentColor"} stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <path d="M7 14l5-5 5 5z" />
    </svg>

    export const ArrowDropDown = (props: IProps) => <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill={props.Color ?? "currentColor"} stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <path d="M7 10l5 5 5-5z" />
    </svg>

    export const Settings = (props: IProps) => <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
    </svg>

    export const Filter = (props: IProps) => <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <path d="M4.25,5.61C6.27,8.2,10,13,10,13v6c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-6c0,0,3.72-4.8,5.74-7.39 C20.25,4.95,19.78,4,18.95,4H5.04C4.21,4,3.74,4.95,4.25,5.61z" />
    </svg>

    export const Folder = (props: IProps) => <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <path d="M2.5,6.5H22.5V22.5H2.5V2.5 H 10.5 L 12.5,4.5" />
    </svg>

    export const AlertPerson = (props: IProps) => <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <path d="m21.43,11.36a3.71,3.71 0 1 1 -7.43,0a3.71,3.71 0 0 1 7.43,0zm-3.71,6.5a6.5,6.5 0 0 0 -6.5,6.5l13,0a6.5,6.5 0 0 0 -6.5,-6.5z" />
        <path d="m8.46,11.36l3.75,0l-1.06,-1.05a1.52,1.52 0 0 1 -0.44,-1.08l0,-2.37a4.5,4.5 0 0 0 -3,-4.25l0,-0.25a1.5,1.5 0 1 0 -3,0l0,0.25c-1.75,0.62 -3,2.29 -3,4.25l0,2.37c0,0.4 -0.16,0.79 -0.44,1.07l-1.06,1.06l3.75,0m4.5,0l0,0.75a2.25,2.25 0 1 1 -4.5,0l0,-0.75m4.5,0l-4.5,0" />
    </svg>

    export const AlertPeople = (props: IProps) => <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <path d="m23.25,22s0.75,0 0.75,-0.75s-0.75,-3 -3.75,-3s-3.75,2.25 -3.75,3s0.75,0.75 0.75,0.75l6,0zm-5.99,-0.75a0.2,0.2 0 0 1 -0.01,0c0,-0.2 0.13,-0.77 0.57,-1.29c0.41,-0.49 1.14,-0.96 2.43,-0.96c1.29,0 2.02,0.47 2.43,0.96c0.44,0.52 0.57,1.09 0.57,1.29l-0.01,0a0.2,0.2 0 0 1 -0.01,0l-5.97,0zm2.99,-4.5a1.5,1.5 0 1 0 0,-3a1.5,1.5 0 0 0 0,3zm2.25,-1.5a2.25,2.25 0 1 1 -4.5,0a2.25,2.25 0 0 1 4.5,0zm-5.29,3.21a4.41,4.41 0 0 0 -0.92,-0.19a5.51,5.51 0 0 0 -0.53,-0.02c-3,0 -3.75,2.25 -3.75,3c0,0.5 0.25,0.75 0.75,0.75l3.17,0a1.68,1.68 0 0 1 -0.17,-0.75c0,-0.76 0.29,-1.53 0.82,-2.18c0.18,-0.22 0.4,-0.43 0.64,-0.62l-0.01,0.01zm-1.52,0.54a4.12,4.12 0 0 0 -0.69,2.25l-2.25,0c0,-0.2 0.12,-0.77 0.57,-1.29c0.41,-0.48 1.12,-0.94 2.37,-0.96zm-2.57,-3.38a2.25,2.25 0 1 1 4.5,0a2.25,2.25 0 0 1 -4.5,0zm2.25,-1.5a1.5,1.5 0 1 0 0,3a1.5,1.5 0 0 0 0,-3z" />
        <path d="m8.46,11.36l3.75,0l-1.06,-1.05a1.52,1.52 0 0 1 -0.44,-1.08l0,-2.37a4.5,4.5 0 0 0 -3,-4.25l0,-0.25a1.5,1.5 0 1 0 -3,0l0,0.25c-1.75,0.62 -3,2.29 -3,4.25l0,2.37c0,0.4 -0.16,0.79 -0.44,1.07l-1.06,1.06l3.75,0m4.5,0l0,0.75a2.25,2.25 0 1 1 -4.5,0l0,-0.75m4.5,0l-4.5,0" />
    </svg>


    export const Alert = (props: IProps) => <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>

    export const TrashCan = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>

    export const CrossMark = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>

    export const CircledX = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-x-circle">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>

    export const Phone = (props: IProps) => <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file">
        <path d="m16.73442,2.78512l-9.40284,0c-0.29313,0 -0.53158,0.23844 -0.53158,0.53158l0,17.28407c0,0.29313 0.23848,0.53158 0.53158,0.53158l9.40284,0c0.29313,0 0.53158,-0.23848 0.53158,-0.53158l0,-17.28407c0,-0.29313 -0.23876,-0.53158 -0.53158,-0.53158zm-1.11059,0.89185c0.15403,0 0.27917,0.12515 0.27917,0.27948c0,0.154 -0.12513,0.27917 -0.27917,0.27917c-0.15428,0 -0.27945,-0.12513 -0.27945,-0.27917c-0.00003,-0.154 0.12545,-0.27948 0.27945,-0.27948zm-0.56653,0.15187c0.0705,0 0.12761,0.05711 0.12761,0.12761c0,0.07046 -0.05711,0.12758 -0.12761,0.12758c-0.07078,0 -0.12761,-0.05711 -0.12761,-0.12758c0,-0.0705 0.05711,-0.12761 0.12761,-0.12761zm-0.33749,0c0.0705,0 0.12761,0.05711 0.12761,0.12761c0,0.07046 -0.05711,0.12758 -0.12761,0.12758s-0.12758,-0.05711 -0.12758,-0.12758c-0.00032,-0.0705 0.0568,-0.12761 0.12758,-0.12761zm-3.73451,-0.15187l2.09509,0l0,0.55861l-2.09509,0l0,-0.55861zm2.09506,16.63767l-2.09509,0l0,-0.55864l2.09509,0l0,0.55864zm3.07656,-1.226l-8.24819,0l0,-14.20085l8.24819,0l0,14.20085z" stroke="null" />
    </svg>

    export const PhoneSettings = (props: IProps) => <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file">
        <path d="m10.72,16.17l-0.5,-0.09c-0.23,-0.05 -0.42,-0.2 -0.51,-0.42c-0.09,-0.22 -0.06,-0.46 0.09,-0.65l0.31,-0.43c0.1,-0.14 0.09,-0.33 -0.03,-0.45l-0.68,-0.68c-0.12,-0.12 -0.3,-0.14 -0.44,-0.04l-0.42,0.29c-0.11,0.08 -0.25,0.12 -0.38,0.12c-0.29,0 -0.62,-0.2 -0.68,-0.58l-0.08,-0.52c-0.02,-0.17 -0.17,-0.29 -0.34,-0.29l-0.96,0c-0.16,0 -0.31,0.12 -0.34,0.28l-0.12,0.65c-0.07,0.36 -0.39,0.55 -0.67,0.55c-0.14,0 -0.27,-0.04 -0.38,-0.12l-0.54,-0.37c-0.14,-0.09 -0.32,-0.08 -0.44,0.04l-0.68,0.68c-0.12,0.12 -0.14,0.31 -0.03,0.45l0.32,0.43c0.14,0.19 0.17,0.43 0.09,0.65c-0.09,0.22 -0.27,0.38 -0.51,0.42l-0.5,0.09c-0.16,0.03 -0.28,0.18 -0.28,0.34l0,0.96c0,0.17 0.12,0.32 0.29,0.34l0.52,0.08c0.24,0.03 0.43,0.18 0.52,0.4c0.1,0.22 0.07,0.46 -0.06,0.65l-0.29,0.42c-0.09,0.14 -0.08,0.32 0.04,0.44l0.68,0.68c0.12,0.12 0.31,0.14 0.45,0.03l0.43,-0.32c0.12,-0.09 0.26,-0.14 0.4,-0.14c0.28,0 0.6,0.19 0.68,0.56l0.09,0.5c0.03,0.16 0.18,0.28 0.34,0.28l0.96,0c0.17,0 0.32,-0.12 0.34,-0.29l0.06,-0.37c0.06,-0.38 0.38,-0.58 0.68,-0.58c0.15,0 0.28,0.05 0.4,0.14l0.3,0.22c0.14,0.1 0.33,0.09 0.45,-0.03l0.68,-0.68c0.12,-0.12 0.14,-0.3 0.04,-0.44l-0.29,-0.42c-0.13,-0.2 -0.16,-0.44 -0.06,-0.65c0.09,-0.22 0.28,-0.37 0.52,-0.4l0.52,-0.08c0.17,-0.03 0.29,-0.17 0.29,-0.34l0,-0.96c0,-0.17 -0.12,-0.31 -0.28,-0.34zm-0.41,1l-0.23,0.03c-0.47,0.07 -0.86,0.37 -1.05,0.81c-0.19,0.43 -0.15,0.93 0.12,1.32l0.12,0.19l-0.27,0.26l-0.06,-0.05c-0.24,-0.17 -0.52,-0.27 -0.81,-0.27c-0.68,0 -1.26,0.49 -1.36,1.17l-0.01,0.08l-0.38,0l-0.04,-0.22c-0.12,-0.65 -0.69,-1.12 -1.35,-1.12c-0.29,0 -0.57,0.09 -0.81,0.27l-0.19,0.14l-0.27,-0.26l0.12,-0.19c0.27,-0.39 0.31,-0.89 0.12,-1.32c-0.19,-0.44 -0.58,-0.74 -1.05,-0.81l-0.23,-0.03l0,-0.38l0.22,-0.04c0.47,-0.09 0.85,-0.41 1.02,-0.85c0.17,-0.44 0.11,-0.93 -0.17,-1.32l-0.14,-0.19l0.27,-0.27l0.3,0.21c0.23,0.16 0.5,0.24 0.77,0.24c0.66,0 1.23,-0.47 1.35,-1.12l0.07,-0.36l0.38,0l0.03,0.23c0.1,0.68 0.68,1.17 1.36,1.17c0.27,0 0.54,-0.08 0.77,-0.24l0.18,-0.12l0.27,0.27l-0.14,0.19c-0.28,0.38 -0.35,0.88 -0.17,1.32c0.17,0.44 0.56,0.76 1.02,0.85l0.22,0.04l0,0.38z" />
        <path d="m22.69,16.12c-0.71,-1.36 -3.15,-2.83 -3.26,-2.89c-0.32,-0.18 -0.64,-0.28 -0.95,-0.28c-0.46,0 -0.83,0.21 -1.06,0.6c-0.36,0.44 -0.8,0.94 -0.91,1.02c-0.83,0.58 -1.49,0.51 -2.21,-0.23l-4.04,-4.11c-0.72,-0.73 -0.78,-1.41 -0.22,-2.25c0.08,-0.11 0.58,-0.57 1.01,-0.93c0.27,-0.16 0.46,-0.41 0.54,-0.71c0.11,-0.4 0.03,-0.88 -0.23,-1.34c-0.06,-0.1 -1.51,-2.6 -2.84,-3.32c-0.25,-0.14 -0.53,-0.2 -0.81,-0.2c-0.46,0 -0.9,0.18 -1.23,0.52l-0.89,0.91c-1.41,1.43 -1.92,3.06 -1.52,4.84c0.26,1.12 0.88,2.29 1.86,3.5c0.06,-0.08 0.16,-0.13 0.26,-0.13l2.75,0c0.17,0 0.32,0.13 0.35,0.3l0.13,0.88l0.68,-0.47c0.14,-0.1 0.33,-0.08 0.44,0.04l1.95,1.98c0.12,0.13 0.14,0.32 0.04,0.47l-0.52,0.72l0.8,0.16c0.17,0.03 0.28,0.18 0.28,0.35l0,2.8c0,0.07 -0.02,0.13 -0.06,0.18c1.7,1.5 3.32,2.25 4.83,2.25c1.31,0 2.53,-0.57 3.62,-1.68l0.89,-0.91c0.54,-0.55 0.66,-1.38 0.31,-2.07z" fill="black" />
    </svg>

    export const AlertAdd = (props: IProps) => <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file">
        <path d="m8.46,11.36l3.75,0l-1.06,-1.05a1.52,1.52 0 0 1 -0.44,-1.08l0,-2.37a4.5,4.5 0 0 0 -3,-4.25l0,-0.25a1.5,1.5 0 1 0 -3,0l0,0.25c-1.75,0.62 -3,2.29 -3,4.25l0,2.37c0,0.4 -0.16,0.79 -0.44,1.07l-1.06,1.06l3.75,0m4.5,0l0,0.75a2.25,2.25 0 1 1 -4.5,0l0,-0.75m4.5,0l-4.5,0" />
        <path d="m15.77,11.17l0,3.69l-3.69,0c-0.65,0 -1.18,0.53 -1.18,1.18s0.53,1.18 1.18,1.18l3.69,0l0,3.69c0,0.65 0.53,1.18 1.18,1.18s1.17,-0.53 1.17,-1.18l0,-3.69l3.69,0c0.65,0 1.18,-0.53 1.18,-1.18s-0.53,-1.18 -1.18,-1.18l-3.69,0l0,-3.69c0,-0.65 -0.53,-1.18 -1.17,-1.18s-1.18,0.53 -1.18,1.18z" fill={'currentColor'} />
        <path d="m11.34,10.34c-1.51,1.51 -2.34,3.52 -2.34,5.66s0.83,4.15 2.34,5.66c1.51,1.51 3.52,2.34 5.66,2.34s4.15,-0.83 5.66,-2.34c1.51,-1.51 2.34,-3.52 2.34,-5.66s-0.83,-4.15 -2.34,-5.66c-1.51,-1.51 -3.52,-2.34 -5.66,-2.34c-2.14,0 -4.15,0.83 -5.66,2.34z" />
    </svg>

    export const ReportAdd = (props: IProps) => <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file">
        <path d="m 0 0 l 0 15 l 10 0 l 0 -15z" />
        <path d="m 2 2 l 6 0" />
        <path d="m 2 4 l 6 0" />
        <path d="m 2 6 l 6 0" />
        <path d="m 2 8 l 6 0" />
        <path d="m 2 10 l 6 0" />
        <path d="m 2 12 l 6 0" />
        <path d="m15.77,11.17l0,3.69l-3.69,0c-0.65,0 -1.18,0.53 -1.18,1.18s0.53,1.18 1.18,1.18l3.69,0l0,3.69c0,0.65 0.53,1.18 1.18,1.18s1.17,-0.53 1.17,-1.18l0,-3.69l3.69,0c0.65,0 1.18,-0.53 1.18,-1.18s-0.53,-1.18 -1.18,-1.18l-3.69,0l0,-3.69c0,-0.65 -0.53,-1.18 -1.17,-1.18s-1.18,0.53 -1.18,1.18z" fill={'currentColor'} />
        <path d="m11.34,10.34c-1.51,1.51 -2.34,3.52 -2.34,5.66s0.83,4.15 2.34,5.66c1.51,1.51 3.52,2.34 5.66,2.34s4.15,-0.83 5.66,-2.34c1.51,-1.51 2.34,-3.52 2.34,-5.66s-0.83,-4.15 -2.34,-5.66c-1.51,-1.51 -3.52,-2.34 -5.66,-2.34c-2.14,0 -4.15,0.83 -5.66,2.34z" />
    </svg>

    export const Pencil = (props: IProps) => <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>

    export const FloppyDisk = (props: IProps) => <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-save">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
    </svg>

    export const Download = (props: IProps) => <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-download">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>

    export const Minus = (props: IProps) => <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus">
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>

    export const Plus = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>

    export const Warning = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-triangle">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>

    export const CheckMark = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-check">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>

    export const CircleCheckMark = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>


    export const SpiningIcon = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-check">
            <radialGradient id="RGLoading" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)">
                <stop offset="0" stopColor={props.Color ?? "currentColor"} />
                <stop offset=".3" stopColor={props.Color ?? "currentColor"} stopOpacity=".9" />
                <stop offset=".6" stopColor={props.Color ?? "currentColor"} stopOpacity=".6" />
                <stop offset=".8" stopColor={props.Color ?? "currentColor"} stopOpacity=".3" />
                <stop offset="1" stopColor={props.Color ?? "currentColor"} stopOpacity="0" />
            </radialGradient>
            <circle transform-origin="center" fill="none" stroke="url(#RGLoading)" strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeDasharray="200 1000" strokeDashoffset="0" cx="12" cy="12" r="11">
                <animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite" />
            </circle>
            <circle transform-origin="center" fill="none" opacity=".2" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" cx="12" cy="12" r="11" />
        </svg>

    export const Copy = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-copy">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>

    export const ShareArrow = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-share">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
        </svg>

    export const ShareArrowDiagonal = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-share">
            <path d="M6.5,4 h-5 v18.5 h18.5 v-4" />
            <polyline points="14,1.5 22.5,1.5 22.5, 10" />
            <line x1="22" y1="2" x2="8" y2="16" />
        </svg>

    export const ShareNetwork = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-share-2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>

    export const UploadCloud = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-upload-cloud">
            <polyline points="16 16 12 12 8 16" />
            <line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
            <polyline points="16 16 12 12 8 16" />
        </svg>

    export const RSS = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-rss">
            <path d="M4 11a9 9 0 0 1 9 9"></path>
            <path d="M4 4a16 16 0 0 1 16 16"></path>
            <circle cx="5" cy="19" r="1"></circle>
        </svg>

    export const CirclePlus = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>

    export const HardDrive = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-hard-drive">
            <line x1="22" y1="12" x2="2" y2="12" />
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            <line x1="6" y1="16" x2="6.01" y2="16" />
            <line x1="10" y1="16" x2="10.01" y2="16" />
        </svg>

    export const Globe = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-globe">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>

    export const BarChart = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-bar-chart-2">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>

    export const LinearBarChart = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-bar-chart">
            <line x1="12" y1="20" x2="12" y2="10"></line>
            <line x1="18" y1="20" x2="18" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="16"></line>
        </svg>

    export const OpenBook = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-open">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>

    export const LineChart = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-activity">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>

    export const RightArrowCircled = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right-circle">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 16 16 12 12 8"></polyline>
            <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>

    export const LeftArrowCircled = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left-circle">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 8 8 12 12 16"></polyline>
            <line x1="16" y1="12" x2="8" y2="12"></line>
        </svg>

    export const BriefCase = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-briefcase">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>

    export const DollarSign = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-dollar-sign">
            <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>

    export const Grid = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-grid">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
        </svg>

    export const SmartPhone = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-smartphone">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>

    export const RadioSignal = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-radio">
            <circle cx="12" cy="12" r="2"></circle>
            <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>
        </svg>

    export const SmartPhoneDollarSign = (props: IProps) => (
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24, }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-smartphone-dollar-sign"
        >
            {/* SmartPhone Icon */}
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>

            {/* DollarSign Icon */}
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M14 8H10.5a2 2 0 0 0 0 4h2.5a2 2 0 0 1 0 4H8.5"></path>
        </svg>
    );

    export const MoveArrows = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24, }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-move">
            <polyline points="5 9 2 12 5 15"></polyline>
            <polyline points="9 5 12 2 15 5"></polyline>
            <polyline points="15 19 12 22 9 19"></polyline>
            <polyline points="19 9 22 12 19 15"></polyline>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <line x1="12" y1="2" x2="12" y2="22"></line>
        </svg>

    export const ChevronLeft = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24, }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left">
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>

    export const ChevronRight = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24, }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right">
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>

    export const DoubleChevronLeft = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24, }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevrons-left">
            <polyline points="11 17 6 12 11 7"></polyline>
            <polyline points="18 17 13 12 18 7"></polyline>
        </svg>

    export const DoubleChevronRight = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24, }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevrons-right">
            <polyline points="13 17 18 12 13 7"></polyline>
            <polyline points="6 17 11 12 6 7"></polyline>
        </svg>

    export const ChevronDown = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24, }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down">
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>

    export const ChevronUp = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24, }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-up">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>

    export const DoubleChevronUp = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24, }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevrons-up">
            <polyline points="17 11 12 6 7 11"></polyline>
            <polyline points="17 18 12 13 7 18"></polyline>
        </svg>

    export const QuestionMark = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24, }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-help-circle">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>

    export const Image = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24, }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-image">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
        </svg>

    export const Info = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24, }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-info">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>

    export const AlarmBell = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24, }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-bell">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

    export const Layers = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
        </svg>

    export const Flag = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-flag">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
        </svg>

    export const Grafana = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round">
            <path d="M22.999 10.626c-.043-.405-.106-.873-.234-1.384s-.341-1.065-.618-1.661c-.298-.575-.66-1.193-1.15-1.768-.192-.234-.405-.447-.618-.681.341-1.342-.405-2.513-.405-2.513-1.299-.085-2.108.405-2.406.618-.043-.021-.106-.043-.149-.064-.213-.085-.447-.17-.681-.256-.234-.064-.469-.149-.703-.192-.234-.064-.49-.106-.745-.149-.043 0-.085-.021-.128-.021C14.608.766 12.99 0 12.99 0c-1.853 1.193-2.215 2.79-2.215 2.79s0 .043-.021.085c-.106.021-.192.064-.298.085-.128.043-.277.085-.405.149s-.277.106-.405.17c-.277.128-.532.256-.809.405a8.52 8.52 0 0 0-.745.469c-.043-.021-.064-.043-.064-.043-2.492-.958-4.706.192-4.706.192-.192 2.662 1.001 4.323 1.235 4.621-.064.17-.106.319-.17.49a10.658 10.658 0 0 0-.405 1.853c-.021.085-.021.192-.043.277-2.3 1.129-2.981 3.471-2.981 3.471 1.917 2.215 4.174 2.343 4.174 2.343a9.61 9.61 0 0 0 .98 1.448c.149.192.319.362.49.554-.703 2.002.106 3.684.106 3.684 2.151.085 3.556-.937 3.854-1.171l.639.192c.66.17 1.342.277 2.002.298h.873c1.001 1.448 2.79 1.64 2.79 1.64 1.256-1.342 1.342-2.641 1.342-2.939v-.021-.043-.064c.256-.192.511-.383.767-.596.511-.447.937-.98 1.32-1.533.043-.043.064-.106.106-.149 1.427.085 2.428-.894 2.428-.894-.234-1.491-1.086-2.215-1.256-2.343l-.021-.021-.021-.021-.021-.021c0-.085.021-.17.021-.277.021-.17.021-.319.021-.49v-.213-.277-.128c0-.043 0-.085-.021-.128l-.043-.256c-.021-.17-.064-.319-.085-.49a6.327 6.327 0 0 0-.724-1.789 6.634 6.634 0 0 0-1.214-1.448 5.89 5.89 0 0 0-1.533-.98 5.368 5.368 0 0 0-1.682-.469c-.277-.043-.575-.043-.852-.043h-.128-.298c-.149.021-.298.043-.426.064-.575.106-1.107.319-1.576.596s-.873.639-1.214 1.043a4.284 4.284 0 0 0-.767 1.299c-.17.447-.277.937-.298 1.384v.511c0 .064 0 .106.021.17a3.642 3.642 0 0 0 .703 1.81c.256.341.532.596.852.809.319.213.639.362.98.469s.66.149.958.128h.446c.043 0 .085-.021.106-.021.043 0 .064-.021.106-.021.064-.021.149-.043.213-.064.128-.043.256-.106.383-.149.128-.064.234-.128.319-.192.021-.021.064-.043.085-.064a.24.24 0 0 0 .043-.341.298.298 0 0 0-.319-.064c-.021.021-.043.021-.085.043a1.43 1.43 0 0 1-.277.106c-.106.021-.213.064-.319.085-.064 0-.106.021-.17.021h-.361s-.021 0 0 0h-.086c-.022 0-.064 0-.085-.021-.234-.043-.49-.106-.724-.213s-.469-.256-.66-.447c-.213-.192-.383-.405-.532-.66s-.234-.532-.277-.809c-.021-.149-.043-.298-.021-.447v-.128c0 .021 0 0 0 0v-.043-.064c0-.085.021-.149.043-.234a3.114 3.114 0 0 1 .916-1.725c.128-.128.256-.234.405-.319.149-.106.298-.192.447-.256s.319-.128.49-.17c.17-.043.341-.085.511-.085.085 0 .17-.021.256-.021H15.228c.021 0 0 0 0 0h.085a4.046 4.046 0 0 1 1.619.49c.681.383 1.256.958 1.597 1.661.17.341.298.724.362 1.129.021.106.021.192.043.298v.554c0 .106-.021.213-.021.319-.021.106-.021.213-.043.319l-.064.319c-.021.106-.128.405-.192.618s-.362.788-.618 1.129a5.164 5.164 0 0 1-2.002 1.64c-.405.17-.809.319-1.235.383a3.221 3.221 0 0 1-.639.064h-.319c.021 0 0 0 0 0h-.021c-.106 0-.234 0-.341-.021-.469-.043-.916-.128-1.363-.256s-.873-.298-1.278-.511a6.956 6.956 0 0 1-2.108-1.746c-.277-.362-.532-.745-.745-1.15s-.362-.831-.49-1.256a5.489 5.489 0 0 1-.213-1.32v-.49-.17c0-.213.021-.447.064-.681.021-.234.064-.447.106-.681s.106-.447.17-.681.277-.873.469-1.278c.383-.809.873-1.533 1.448-2.108.149-.149.298-.277.469-.405.064-.064.213-.192.383-.298s.341-.213.532-.298c.085-.043.17-.085.277-.128.043-.021.085-.043.149-.064.043-.021.085-.043.149-.064.192-.085.383-.149.575-.213.043-.021.106-.021.149-.043s.106-.021.149-.043.192-.043.298-.085c.043-.021.106-.021.149-.043.043 0 .106-.021.149-.021s.106-.021.149-.021l.17-.043c.043 0 .106-.021.149-.021.064 0 .106-.021.17-.021.043 0 .128-.021.17-.021s.064 0 .106-.021h.149c.064 0 .106 0 .17-.021h.085s.021 0 0 0H15.033c.383.021.767.064 1.129.128a7.234 7.234 0 0 1 2.044.681 7.676 7.676 0 0 1 1.661 1.086c.021.021.064.043.085.085.021.021.064.043.085.085.064.043.106.106.17.149s.106.106.17.149c.043.064.106.106.149.17a7.88 7.88 0 0 1 1.406 1.98c.021.021.021.043.043.085.021.021.021.043.043.085s.043.106.085.149c.021.043.043.106.064.149s.043.106.064.149c.085.192.149.383.213.575.106.298.17.554.234.767a.204.204 0 0 0 .192.149c.106 0 .17-.085.17-.192-.021-.256-.021-.532-.043-.852z" />
        </svg>

    export const Clone = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-copy">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>

    export const Refresh = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-refresh-ccw">
            <polyline points="1 4 1 10 7 10"></polyline>
            <polyline points="23 20 23 14 17 14"></polyline>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
        </svg>

    export const Users = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth={props.StrokeWidth ?? '2'} strokeLinecap="round" strokeLinejoin="round" className="feather feather-users">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>

    export const Lock = (props: IProps) =>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ ...(props.Style ?? {}), width: props.Size ?? props.Style?.width ?? 24, height: props.Size ?? props.Style?.height ?? 24 }} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-lock">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
}