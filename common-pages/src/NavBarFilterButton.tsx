//******************************************************************************************************
//  NavBarFilterButton.tsx - Gbtc
//
//  Copyright © 2019, Grid Protection Alliance.  All Rights Reserved.
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
//  08/07/2024 - G. Santos
//       Generated original version of source code.
//
//******************************************************************************************************
import React from 'react';
import 'moment';
import { OpenXDA, SystemCenter } from '@gpa-gemstone/application-typings';

type S = SystemCenter.Types.DetailedMeter|SystemCenter.Types.DetailedAsset|SystemCenter.Types.DetailedLocation|OpenXDA.Types.AssetGroup;
interface IProps<S> {
    Data: S[],
    Type: ('Meter' | 'Asset' | 'AssetGroup' | 'Station'),
    OnClick: () => void,
    AlternateColors?: { normal: string, selected: string }
}

function NavbarFilterButton(props: IProps<S>) {
    const [hover, setHover] = React.useState<boolean>(false);
    const [rows, setRows] = React.useState<JSX.Element[]>([]);
    const [header, setHeader] = React.useState<JSX.Element|null>(null);
    const [buttonStyle, setButtonStyle] = React.useState<React.CSSProperties>({ marginBottom: 5 });

    React.useEffect(() => {
        switch (props.Type) {
            case ('Meter'):
                setHeader(< tr ><th>Name</th><th>Key</th><th>Substation</th><th>Make</th><th>Model</th></tr >);
                break;
            case ('Asset'):
                setHeader(<tr><th>Key</th><th>Name</th><th>Asset Type</th><th>Voltage (kV)</th></tr>);
                break;
            case ('AssetGroup'):
                setHeader(<tr><th>Name</th><th>Assets</th><th>Meters</th></tr>);
                break;
            default:
                setHeader(<tr><th>Name</th><th>Key</th><th>Meters</th><th>Assets</th></tr>);
        }
    }, [props.Type]);

    React.useEffect(() => {
        setButtonStyle({ ...buttonStyle, backgroundColor: (props.Data.length > 0 ? props.AlternateColors?.selected : props.AlternateColors?.normal) });
    }, [props.AlternateColors, props.Data.length]);

    React.useEffect(() => {
        switch (props.Type) {
            case ('Meter'):
                setRows(props.Data.filter((v, i) => i < 10).map((d) => <tr key={d.ID}>
                    <td>{(d as unknown as SystemCenter.Types.DetailedMeter)['Name']}</td>
                    <td>{(d as unknown as SystemCenter.Types.DetailedMeter)['AssetKey']}</td>
                    <td>{(d as unknown as SystemCenter.Types.DetailedMeter)['Location']}</td>
                    <td>{(d as unknown as SystemCenter.Types.DetailedMeter)['Make']}</td>
                    <td>{(d as unknown as SystemCenter.Types.DetailedMeter)['Model']}</td>
                </tr>));
                break;
            case ('Asset'):
                setRows(props.Data.filter((v, i) => i < 10).map((d) => <tr key={d.ID}>
                    <td>{(d as unknown as SystemCenter.Types.DetailedAsset)['AssetKey']}</td>
                    <td>{(d as unknown as SystemCenter.Types.DetailedAsset)['AssetName']}</td>
                    <td>{(d as unknown as SystemCenter.Types.DetailedAsset)['AssetType']}</td>
                    <td>{(d as unknown as SystemCenter.Types.DetailedAsset)['VoltageKV']}</td>
                </tr>));
                break;
            case ('AssetGroup'):
                setRows(props.Data.filter((v, i) => i < 10).map((d) => <tr key={d.ID}>
                    <td>{(d as unknown as OpenXDA.Types.AssetGroup)['Name']}</td>
                    <td>{(d as unknown as OpenXDA.Types.AssetGroup)['Assets']}</td>
                    <td>{(d as unknown as OpenXDA.Types.AssetGroup)['Meters']}</td>
                </tr>));
                break;
            case ('Station'):
                setRows(props.Data.filter((v, i) => i < 10).map((d) => <tr key={d.ID}>
                    <td>{(d as unknown as SystemCenter.Types.DetailedLocation)['Name']}</td>
                    <td>{(d as unknown as SystemCenter.Types.DetailedLocation)['LocationKey']}</td>
                    <td>{(d as unknown as SystemCenter.Types.DetailedLocation)['Meters']}</td>
                    <td>{(d as unknown as SystemCenter.Types.DetailedLocation)['Assets']}</td>
                </tr>));
                break;
            default:
                setRows([]);
                break;
        }
        
    }, [props.Data, props.Type])
    
    return (
        <>
            <button className={"btn btn-block btn-sm btn-" + (props.Data.length > 0 ? "warning" : "primary")} style={buttonStyle} onClick={(evt) => { evt.preventDefault(); props.OnClick(); }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                {typeToString(props.Type)} {props.Data.length > 0 ? ('(' + props.Data.length + ')') : ''}
            </button>
            <div style={{ width: window.innerWidth / 3, display: hover ? 'block' : 'none', position: 'absolute', backgroundColor: '#f1f1f1', boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)', zIndex: 1, right: 0 }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                <table className='table'>
                    <thead>
                        {header}
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>

                </table>
            </div>
        </>
    );
}
function typeToString(Type: 'Meter' | 'Asset' | 'AssetGroup' | 'Station'): string {
    switch (Type) {
        case 'Meter':
            return 'Meter';
        case 'Asset':
            return 'Asset';
        case 'AssetGroup':
            return 'Asset Group';
        case 'Station':
            return 'Substation';
        default:
            return Type;
    }
}

export default NavbarFilterButton;