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
import styled, { keyframes} from "styled-components";

interface IProps {
    Size?: number,
    Color?: string
}

const spin = keyframes`
 0% { transform: rotate(0deg); }
 100% { transform: rotate(360deg); }
`;

export namespace ReactIcons {
        
    export const DataContainer: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file">
    <path d="M 3,4.5 a 9,4.5 0,0,0 18 3 a 9,4.5 0,0,0 -18 0 l 0,11 a 9,4.5 0,0,0 18 0 l 0,-11" />
    </svg>;

    export const Cube: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file">
        <rect x="1" y="8" width="15" height="15" />
        <rect x="6" y="3" width="15" height="15" />
        <line x1="1" x2="6" y1="8" y2="3" />
        <line x1="16" x2="21" y1="8" y2="3" />
        <line x1="16" x2="21" y1="23" y2="18" />
        <line x1="1" x2="6" y1="23" y2="18" />
    </svg>

    export const House: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"}  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>

    export const Document: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"}  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>

    export const ArrowForward: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill={props.Color ?? "currentColor"}  stroke={props.Color ?? "currentColor"}  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <polygon points="6.23,20.23 8,22 18,12 8,2 6.23,3.77 14.46,12" />
    </svg>

    export const ArrowBackward: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height="24" viewBox="0 0 24 24" fill={props.Color ?? "currentColor"}  stroke={props.Color ?? "currentColor"}  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <polygon points="17.77,3.77 16,2 6,12 16,22 17.77,20.23 9.54,12"/>
    </svg>

    export const ArrowDropUp: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill={props.Color ?? "currentColor"}  stroke={props.Color ?? "currentColor"}  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <path d="M7 14l5-5 5 5z"/>
    </svg>

    export const ArrowDropDown: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill={props.Color ?? "currentColor"}  stroke={props.Color ?? "currentColor"}  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <path d="M7 10l5 5 5-5z"/>
    </svg>

    export const Settings: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"}  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <path  d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
    </svg>

    export const Filter: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"}  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <path d="M4.25,5.61C6.27,8.2,10,13,10,13v6c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-6c0,0,3.72-4.8,5.74-7.39 C20.25,4.95,19.78,4,18.95,4H5.04C4.21,4,3.74,4.95,4.25,5.61z"/>
    </svg>

    export const Folder: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"}  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <path d="M2.5,6.5H22.5V22.5H2.5V2.5 H 10.5 L 12.5,4.5" />
    </svg>


    export const AlertPerson: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"}  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <path d="m21.43,11.36a3.71,3.71 0 1 1 -7.43,0a3.71,3.71 0 0 1 7.43,0zm-3.71,6.5a6.5,6.5 0 0 0 -6.5,6.5l13,0a6.5,6.5 0 0 0 -6.5,-6.5z" />
        <path d="m8.46,11.36l3.75,0l-1.06,-1.05a1.52,1.52 0 0 1 -0.44,-1.08l0,-2.37a4.5,4.5 0 0 0 -3,-4.25l0,-0.25a1.5,1.5 0 1 0 -3,0l0,0.25c-1.75,0.62 -3,2.29 -3,4.25l0,2.37c0,0.4 -0.16,0.79 -0.44,1.07l-1.06,1.06l3.75,0m4.5,0l0,0.75a2.25,2.25 0 1 1 -4.5,0l0,-0.75m4.5,0l-4.5,0" />
    </svg>

    export const AlertPeople: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"}  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <path d="m23.25,22s0.75,0 0.75,-0.75s-0.75,-3 -3.75,-3s-3.75,2.25 -3.75,3s0.75,0.75 0.75,0.75l6,0zm-5.99,-0.75a0.2,0.2 0 0 1 -0.01,0c0,-0.2 0.13,-0.77 0.57,-1.29c0.41,-0.49 1.14,-0.96 2.43,-0.96c1.29,0 2.02,0.47 2.43,0.96c0.44,0.52 0.57,1.09 0.57,1.29l-0.01,0a0.2,0.2 0 0 1 -0.01,0l-5.97,0zm2.99,-4.5a1.5,1.5 0 1 0 0,-3a1.5,1.5 0 0 0 0,3zm2.25,-1.5a2.25,2.25 0 1 1 -4.5,0a2.25,2.25 0 0 1 4.5,0zm-5.29,3.21a4.41,4.41 0 0 0 -0.92,-0.19a5.51,5.51 0 0 0 -0.53,-0.02c-3,0 -3.75,2.25 -3.75,3c0,0.5 0.25,0.75 0.75,0.75l3.17,0a1.68,1.68 0 0 1 -0.17,-0.75c0,-0.76 0.29,-1.53 0.82,-2.18c0.18,-0.22 0.4,-0.43 0.64,-0.62l-0.01,0.01zm-1.52,0.54a4.12,4.12 0 0 0 -0.69,2.25l-2.25,0c0,-0.2 0.12,-0.77 0.57,-1.29c0.41,-0.48 1.12,-0.94 2.37,-0.96zm-2.57,-3.38a2.25,2.25 0 1 1 4.5,0a2.25,2.25 0 0 1 -4.5,0zm2.25,-1.5a1.5,1.5 0 1 0 0,3a1.5,1.5 0 0 0 0,-3z" />
        <path d="m8.46,11.36l3.75,0l-1.06,-1.05a1.52,1.52 0 0 1 -0.44,-1.08l0,-2.37a4.5,4.5 0 0 0 -3,-4.25l0,-0.25a1.5,1.5 0 1 0 -3,0l0,0.25c-1.75,0.62 -3,2.29 -3,4.25l0,2.37c0,0.4 -0.16,0.79 -0.44,1.07l-1.06,1.06l3.75,0m4.5,0l0,0.75a2.25,2.25 0 1 1 -4.5,0l0,-0.75m4.5,0l-4.5,0" />
    </svg>


    export const Alert: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"}  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>

    export const TrashCan: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"}  strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 2.264 7.058 L 2.264 5.594 C 2.292 5.064 2.501 4.618 2.891 4.255 C 3.282 3.893 3.742 3.711 4.272 3.711 L 6.28 3.711 L 6.28 3.042 C 6.28 2.484 6.475 2.01 6.866 1.62 C 7.256 1.229 7.73 1.034 8.288 1.034 L 14.981 1.034 C 15.539 1.034 16.013 1.229 16.404 1.62 C 16.794 2.01 16.989 2.484 16.989 3.042 L 16.989 3.711 L 18.997 3.711 C 19.527 3.711 19.987 3.893 20.378 4.255 C 20.768 4.618 20.977 5.064 21.005 5.594 L 21.005 7.058 C 21.005 7.421 20.873 7.734 20.608 7.999 C 20.343 8.264 20.029 8.397 19.667 8.397 L 19.667 19.775 C 19.667 20.528 19.408 21.163 18.893 21.679 C 18.377 22.195 17.742 22.453 16.989 22.453 L 6.28 22.453 C 5.527 22.453 4.893 22.195 4.376 21.679 C 3.861 21.163 3.603 20.528 3.603 19.775 L 3.603 8.397 C 3.24 8.397 2.926 8.264 2.661 7.999 C 2.396 7.734 2.264 7.421 2.264 7.058 Z M 3.603 7.058 L 19.667 7.058 L 19.667 5.719 C 19.667 5.524 19.604 5.364 19.478 5.238 C 19.353 5.113 19.192 5.05 18.997 5.05 L 4.272 5.05 C 4.077 5.05 3.916 5.113 3.791 5.238 C 3.665 5.364 3.603 5.524 3.603 5.719 L 3.603 7.058 Z M 4.941 19.775 C 4.941 20.138 5.074 20.451 5.339 20.716 C 5.604 20.981 5.917 21.114 6.28 21.114 L 16.989 21.114 C 17.352 21.114 17.666 20.981 17.931 20.716 C 18.195 20.451 18.328 20.138 18.328 19.775 L 18.328 8.397 L 4.941 8.397 L 4.941 19.775 Z M 6.28 19.106 L 6.28 10.405 C 6.28 10.209 6.343 10.049 6.468 9.923 C 6.594 9.798 6.754 9.735 6.949 9.735 L 8.288 9.735 C 8.483 9.735 8.644 9.798 8.769 9.923 C 8.895 10.049 8.957 10.209 8.957 10.405 L 8.957 19.106 C 8.957 19.301 8.895 19.462 8.769 19.587 C 8.644 19.712 8.483 19.775 8.288 19.775 L 6.949 19.775 C 6.754 19.775 6.594 19.712 6.468 19.587 C 6.343 19.462 6.28 19.301 6.28 19.106 Z M 6.949 19.106 L 8.288 19.106 L 8.288 10.405 L 6.949 10.405 L 6.949 19.106 Z M 7.619 3.711 L 15.65 3.711 L 15.65 3.042 C 15.65 2.847 15.588 2.686 15.462 2.561 C 15.337 2.435 15.176 2.373 14.981 2.373 L 8.288 2.373 C 8.093 2.373 7.933 2.435 7.807 2.561 C 7.681 2.686 7.619 2.847 7.619 3.042 L 7.619 3.711 Z M 10.296 19.106 L 10.296 10.405 C 10.296 10.209 10.359 10.049 10.484 9.923 C 10.61 9.798 10.77 9.735 10.965 9.735 L 12.304 9.735 C 12.499 9.735 12.659 9.798 12.785 9.923 C 12.911 10.049 12.973 10.209 12.973 10.405 L 12.973 19.106 C 12.973 19.301 12.911 19.462 12.785 19.587 C 12.659 19.712 12.499 19.775 12.304 19.775 L 10.965 19.775 C 10.77 19.775 10.61 19.712 10.484 19.587 C 10.359 19.462 10.296 19.301 10.296 19.106 Z M 10.965 19.106 L 12.304 19.106 L 12.304 10.405 L 10.965 10.405 L 10.965 19.106 Z M 14.312 19.106 L 14.312 10.405 C 14.312 10.209 14.375 10.049 14.5 9.923 C 14.626 9.798 14.786 9.735 14.981 9.735 L 16.32 9.735 C 16.515 9.735 16.675 9.798 16.801 9.923 C 16.927 10.049 16.989 10.209 16.989 10.405 L 16.989 19.106 C 16.989 19.301 16.927 19.462 16.801 19.587 C 16.675 19.712 16.515 19.775 16.32 19.775 L 14.981 19.775 C 14.786 19.775 14.626 19.712 14.5 19.587 C 14.375 19.462 14.312 19.301 14.312 19.106 Z M 14.981 19.106 L 16.32 19.106 L 16.32 10.405 L 14.981 10.405 L 14.981 19.106 Z"/>
    </svg>

    export const CrossMark: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill={props.Color ?? "currentColor"} stroke={props.Color ?? "currentColor"}  strokeWidth="2" >
        <path d="M 2.2 23.197 L 0.387 21.384 L 10.356 11.415 L 0.387 1.446 L 2.2 -0.367 L 12.169 9.602 L 22.138 -0.367 L 23.951 1.446 L 13.982 11.415 L 23.951 21.384 L 22.138 23.197 L 12.169 13.228 L 2.2 23.197 Z" />
    </svg>

    export const CircledX: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill={props.Color ?? "currentColor"} stroke={props.Color ?? "currentColor"}  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <circle fill={'none'} cx="12" cy="12" r="11"/>
        <path strokeWidth={3} d="M 6 6 L 18 18" />
        <path strokeWidth={3} d="M 18 6 L 6 18" />
    </svg>

    export const CircleCheck: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill={props.Color ?? "currentColor"} stroke={props.Color ?? "currentColor"}  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
        <circle fill={'none'} cx="12" cy="12" r="11" />
        <path fill={'none'}  strokeWidth={3} d="M 5 15 L 10 20 L 18 5"/>
    </svg>

    export const Phone: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"}  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file">
        <path d="m16.73442,2.78512l-9.40284,0c-0.29313,0 -0.53158,0.23844 -0.53158,0.53158l0,17.28407c0,0.29313 0.23848,0.53158 0.53158,0.53158l9.40284,0c0.29313,0 0.53158,-0.23848 0.53158,-0.53158l0,-17.28407c0,-0.29313 -0.23876,-0.53158 -0.53158,-0.53158zm-1.11059,0.89185c0.15403,0 0.27917,0.12515 0.27917,0.27948c0,0.154 -0.12513,0.27917 -0.27917,0.27917c-0.15428,0 -0.27945,-0.12513 -0.27945,-0.27917c-0.00003,-0.154 0.12545,-0.27948 0.27945,-0.27948zm-0.56653,0.15187c0.0705,0 0.12761,0.05711 0.12761,0.12761c0,0.07046 -0.05711,0.12758 -0.12761,0.12758c-0.07078,0 -0.12761,-0.05711 -0.12761,-0.12758c0,-0.0705 0.05711,-0.12761 0.12761,-0.12761zm-0.33749,0c0.0705,0 0.12761,0.05711 0.12761,0.12761c0,0.07046 -0.05711,0.12758 -0.12761,0.12758s-0.12758,-0.05711 -0.12758,-0.12758c-0.00032,-0.0705 0.0568,-0.12761 0.12758,-0.12761zm-3.73451,-0.15187l2.09509,0l0,0.55861l-2.09509,0l0,-0.55861zm2.09506,16.63767l-2.09509,0l0,-0.55864l2.09509,0l0,0.55864zm3.07656,-1.226l-8.24819,0l0,-14.20085l8.24819,0l0,14.20085z" stroke="null"/>
    </svg>

    export const PhoneSettings: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file">
        <path d="m10.72,16.17l-0.5,-0.09c-0.23,-0.05 -0.42,-0.2 -0.51,-0.42c-0.09,-0.22 -0.06,-0.46 0.09,-0.65l0.31,-0.43c0.1,-0.14 0.09,-0.33 -0.03,-0.45l-0.68,-0.68c-0.12,-0.12 -0.3,-0.14 -0.44,-0.04l-0.42,0.29c-0.11,0.08 -0.25,0.12 -0.38,0.12c-0.29,0 -0.62,-0.2 -0.68,-0.58l-0.08,-0.52c-0.02,-0.17 -0.17,-0.29 -0.34,-0.29l-0.96,0c-0.16,0 -0.31,0.12 -0.34,0.28l-0.12,0.65c-0.07,0.36 -0.39,0.55 -0.67,0.55c-0.14,0 -0.27,-0.04 -0.38,-0.12l-0.54,-0.37c-0.14,-0.09 -0.32,-0.08 -0.44,0.04l-0.68,0.68c-0.12,0.12 -0.14,0.31 -0.03,0.45l0.32,0.43c0.14,0.19 0.17,0.43 0.09,0.65c-0.09,0.22 -0.27,0.38 -0.51,0.42l-0.5,0.09c-0.16,0.03 -0.28,0.18 -0.28,0.34l0,0.96c0,0.17 0.12,0.32 0.29,0.34l0.52,0.08c0.24,0.03 0.43,0.18 0.52,0.4c0.1,0.22 0.07,0.46 -0.06,0.65l-0.29,0.42c-0.09,0.14 -0.08,0.32 0.04,0.44l0.68,0.68c0.12,0.12 0.31,0.14 0.45,0.03l0.43,-0.32c0.12,-0.09 0.26,-0.14 0.4,-0.14c0.28,0 0.6,0.19 0.68,0.56l0.09,0.5c0.03,0.16 0.18,0.28 0.34,0.28l0.96,0c0.17,0 0.32,-0.12 0.34,-0.29l0.06,-0.37c0.06,-0.38 0.38,-0.58 0.68,-0.58c0.15,0 0.28,0.05 0.4,0.14l0.3,0.22c0.14,0.1 0.33,0.09 0.45,-0.03l0.68,-0.68c0.12,-0.12 0.14,-0.3 0.04,-0.44l-0.29,-0.42c-0.13,-0.2 -0.16,-0.44 -0.06,-0.65c0.09,-0.22 0.28,-0.37 0.52,-0.4l0.52,-0.08c0.17,-0.03 0.29,-0.17 0.29,-0.34l0,-0.96c0,-0.17 -0.12,-0.31 -0.28,-0.34zm-0.41,1l-0.23,0.03c-0.47,0.07 -0.86,0.37 -1.05,0.81c-0.19,0.43 -0.15,0.93 0.12,1.32l0.12,0.19l-0.27,0.26l-0.06,-0.05c-0.24,-0.17 -0.52,-0.27 -0.81,-0.27c-0.68,0 -1.26,0.49 -1.36,1.17l-0.01,0.08l-0.38,0l-0.04,-0.22c-0.12,-0.65 -0.69,-1.12 -1.35,-1.12c-0.29,0 -0.57,0.09 -0.81,0.27l-0.19,0.14l-0.27,-0.26l0.12,-0.19c0.27,-0.39 0.31,-0.89 0.12,-1.32c-0.19,-0.44 -0.58,-0.74 -1.05,-0.81l-0.23,-0.03l0,-0.38l0.22,-0.04c0.47,-0.09 0.85,-0.41 1.02,-0.85c0.17,-0.44 0.11,-0.93 -0.17,-1.32l-0.14,-0.19l0.27,-0.27l0.3,0.21c0.23,0.16 0.5,0.24 0.77,0.24c0.66,0 1.23,-0.47 1.35,-1.12l0.07,-0.36l0.38,0l0.03,0.23c0.1,0.68 0.68,1.17 1.36,1.17c0.27,0 0.54,-0.08 0.77,-0.24l0.18,-0.12l0.27,0.27l-0.14,0.19c-0.28,0.38 -0.35,0.88 -0.17,1.32c0.17,0.44 0.56,0.76 1.02,0.85l0.22,0.04l0,0.38z" />
        <path d="m22.69,16.12c-0.71,-1.36 -3.15,-2.83 -3.26,-2.89c-0.32,-0.18 -0.64,-0.28 -0.95,-0.28c-0.46,0 -0.83,0.21 -1.06,0.6c-0.36,0.44 -0.8,0.94 -0.91,1.02c-0.83,0.58 -1.49,0.51 -2.21,-0.23l-4.04,-4.11c-0.72,-0.73 -0.78,-1.41 -0.22,-2.25c0.08,-0.11 0.58,-0.57 1.01,-0.93c0.27,-0.16 0.46,-0.41 0.54,-0.71c0.11,-0.4 0.03,-0.88 -0.23,-1.34c-0.06,-0.1 -1.51,-2.6 -2.84,-3.32c-0.25,-0.14 -0.53,-0.2 -0.81,-0.2c-0.46,0 -0.9,0.18 -1.23,0.52l-0.89,0.91c-1.41,1.43 -1.92,3.06 -1.52,4.84c0.26,1.12 0.88,2.29 1.86,3.5c0.06,-0.08 0.16,-0.13 0.26,-0.13l2.75,0c0.17,0 0.32,0.13 0.35,0.3l0.13,0.88l0.68,-0.47c0.14,-0.1 0.33,-0.08 0.44,0.04l1.95,1.98c0.12,0.13 0.14,0.32 0.04,0.47l-0.52,0.72l0.8,0.16c0.17,0.03 0.28,0.18 0.28,0.35l0,2.8c0,0.07 -0.02,0.13 -0.06,0.18c1.7,1.5 3.32,2.25 4.83,2.25c1.31,0 2.53,-0.57 3.62,-1.68l0.89,-0.91c0.54,-0.55 0.66,-1.38 0.31,-2.07z" fill="black" />
    </svg>

    export const AlertAdd: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file">
        <path d="m8.46,11.36l3.75,0l-1.06,-1.05a1.52,1.52 0 0 1 -0.44,-1.08l0,-2.37a4.5,4.5 0 0 0 -3,-4.25l0,-0.25a1.5,1.5 0 1 0 -3,0l0,0.25c-1.75,0.62 -3,2.29 -3,4.25l0,2.37c0,0.4 -0.16,0.79 -0.44,1.07l-1.06,1.06l3.75,0m4.5,0l0,0.75a2.25,2.25 0 1 1 -4.5,0l0,-0.75m4.5,0l-4.5,0" />
        <path d="m15.77,11.17l0,3.69l-3.69,0c-0.65,0 -1.18,0.53 -1.18,1.18s0.53,1.18 1.18,1.18l3.69,0l0,3.69c0,0.65 0.53,1.18 1.18,1.18s1.17,-0.53 1.17,-1.18l0,-3.69l3.69,0c0.65,0 1.18,-0.53 1.18,-1.18s-0.53,-1.18 -1.18,-1.18l-3.69,0l0,-3.69c0,-0.65 -0.53,-1.18 -1.17,-1.18s-1.18,0.53 -1.18,1.18z" fill={'currentColor'} />
        <path d="m11.34,10.34c-1.51,1.51 -2.34,3.52 -2.34,5.66s0.83,4.15 2.34,5.66c1.51,1.51 3.52,2.34 5.66,2.34s4.15,-0.83 5.66,-2.34c1.51,-1.51 2.34,-3.52 2.34,-5.66s-0.83,-4.15 -2.34,-5.66c-1.51,-1.51 -3.52,-2.34 -5.66,-2.34c-2.14,0 -4.15,0.83 -5.66,2.34z" />
    </svg>

    export const ReportAdd: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file">
        <path d="m 0 0 l 0 15 l 10 0 l 0 -15z" />
        <path d="m 2 2 l 6 0"/>
        <path d="m 2 4 l 6 0"/>
        <path d="m 2 6 l 6 0"/>
        <path d="m 2 8 l 6 0"/>
        <path d="m 2 10 l 6 0"/>
        <path d="m 2 12 l 6 0"/>
        <path d="m15.77,11.17l0,3.69l-3.69,0c-0.65,0 -1.18,0.53 -1.18,1.18s0.53,1.18 1.18,1.18l3.69,0l0,3.69c0,0.65 0.53,1.18 1.18,1.18s1.17,-0.53 1.17,-1.18l0,-3.69l3.69,0c0.65,0 1.18,-0.53 1.18,-1.18s-0.53,-1.18 -1.18,-1.18l-3.69,0l0,-3.69c0,-0.65 -0.53,-1.18 -1.17,-1.18s-1.18,0.53 -1.18,1.18z" fill={'currentColor'} />
        <path d="m11.34,10.34c-1.51,1.51 -2.34,3.52 -2.34,5.66s0.83,4.15 2.34,5.66c1.51,1.51 3.52,2.34 5.66,2.34s4.15,-0.83 5.66,-2.34c1.51,-1.51 2.34,-3.52 2.34,-5.66s-0.83,-4.15 -2.34,-5.66c-1.51,-1.51 -3.52,-2.34 -5.66,-2.34c-2.14,0 -4.15,0.83 -5.66,2.34z" />
    </svg>

    export const Pencil: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>

    export const FloppyDisk: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-save">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
    </svg>

    export const Download: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-download">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>

    export const Minus: React.FC<IProps> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus">
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>

    export const Plus: React.FC<IProps> = (props) =>
        <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>

    export const Warning: React.FC<IProps> = (props) =>
        <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-triangle">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>

    export const CheckMark: React.FC<IProps> = (props) =>
        <svg xmlns="http://www.w3.org/2000/svg" width={props.Size ?? 24} height={props.Size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.Color ?? "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>

    export const SpiningIcon = styled.div<IconProps>`
        animation: ${spin} 1s linear infinite;
        border: ${props => props.size/5}px solid #f3f3f3;
        border-Top: ${props => props.size/5}px solid #555;
        border-Radius: 50%;
        width: ${props => props.size}px;
        height: ${props => props.size}px
    `;

    }