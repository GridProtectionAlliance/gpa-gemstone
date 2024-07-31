﻿//******************************************************************************************************
//  EventTypeFilter.tsx - Gbtc
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
//  02/02/2023 - C. Lackner
//       Generated original version of source code.
//  06/18/2024 - A. Karrar
//       Moved EventTypeFilter to GemStone
//
//******************************************************************************************************
import React from 'react';
import 'moment';
import _ from 'lodash';
import { OpenXDA } from '@gpa-gemstone/application-typings';


interface IProps {
    SetSelectedTypeIDs: (typeIDs: number[]) => void;
    Height?: number;
    EventTypes: OpenXDA.Types.EventType[];
    SelectedTypeID: number[];
}
interface ICategory { label: string, height: number }


const EventTypeFilter: React.FC<IProps> = (props: IProps) => {
    const [evtTypeCategories, setEvtTypeCategories] = React.useState<ICategory[]>([]);
    const [nCol, setnCol] = React.useState<number>(1);

    React.useEffect(() => setEvtTypeCategories(_.uniq(props.EventTypes.map(e => e.Category)).map(c => ({ label: c ?? '', height: 0 }))), [props.EventTypes]);
    React.useEffect(() => {
        if (props.Height == undefined){
            setnCol(1);
            return;
        }
        let navHeight = props.Height;
        const heights = evtTypeCategories.map(h => h.height);
        if (heights.some(h => h > navHeight)) {
            navHeight = Math.max(...heights);
        }

        let nCollumn = 0;
        heights.sort();

        while (heights.length > 0) {
            nCollumn = nCollumn + 1;
            let hc = heights[0];
            heights.splice(0, 1);

            let index = heights.findIndex(h => h <= (navHeight - hc));
            while (index >= 0 && heights[index] != 0) {
                hc = hc + heights[index];
                heights.splice(index, 1);
                index = heights.findIndex(h => h <= (navHeight - hc))
            }
        }
        setnCol(nCollumn);
    }, [evtTypeCategories, props.Height]);

    function generateCollumn(colIndex: number) {
        let flts: ICategory[] = [];      

        if (props.Height != undefined) {
            let navHeight = props.Height;
            if (evtTypeCategories.some(h => h.height > navHeight))
                navHeight = Math.max(...evtTypeCategories.map(h => h.height));

            const categories = _.orderBy(evtTypeCategories, (e) => e.height);

            let nCollumn = 0;
            while (categories.length > 0 && nCollumn <= colIndex) {
                nCollumn = nCollumn + 1;
                if (nCollumn == colIndex + 1)
                    flts.push(categories[0]);
                let hc = categories[0].height;
                categories.splice(0, 1);
                let index = categories.findIndex(h => h.height <= (navHeight - hc))
                while (index >= 0) {
                    hc = hc + categories[index].height;
                    if (nCollumn == colIndex + 1)
                        flts.push(categories[index]);
                    categories.splice(index, 1);
                    index = categories.findIndex(h => h.height <= (navHeight - hc))
                }
            }
        }
        else {
            flts = evtTypeCategories;
        }

        return <li className="nav-item"
            style={{ width: (100 / nCol).toFixed(0) + '%', height: evtTypeCategories.some(c => c.height == 0) ? 5 : '100%', overflow: 'hidden' }}>
            {flts.map(c => (<EventSearchTypeCategory key={c.label} Label={c.label} SelectedID={props.SelectedTypeID}
                SelectAll={(selected) => {
                    props.SetSelectedTypeIDs(
                        selected ? props.SelectedTypeID.filter(id => props.EventTypes.find(t => id == t.ID && (t.Category ?? '') == c.label) == null) 
                        : _.uniq([...props.SelectedTypeID, ...props.EventTypes.filter(t => (t.Category ?? '') == c.label).map(i => i.ID)])
                    );
                }}
                Data={props.EventTypes.filter(et => (et.Category ?? '') == c.label)}
                OnChange={(record, selected) => {
                    props.SetSelectedTypeIDs(
                        selected ? [...props.SelectedTypeID, record.ID] : props.SelectedTypeID.filter(t => t != record.ID)
                    );
                }}
                SetHeight={(h) => setHeight(c.label, h)} />))}
        </li> 
    }

    function setHeight(label: string, h: number) {
        const index = evtTypeCategories.findIndex(c => c.label == label)
        if (index > -1 && evtTypeCategories[index].height != h)
            setEvtTypeCategories((d) => {
                const u = _.cloneDeep(d);
                u[index].height = h;
                return u;
            })
    }
    return (
        <ul className="navbar-nav mr-auto" style={{width: "100%"}}>
            {Array.from({ length: nCol }, (_, i) => i).map(c => generateCollumn(c))}
        </ul>);
    
}

interface ICategoryProps {
    Label: string,
    SetHeight: (h: number) => void,
    Data: OpenXDA.Types.EventType[],
    SelectedID:number[],
    OnChange: (record: OpenXDA.Types.EventType, selected: boolean) => void
    SelectAll: (selected: boolean) => void
}

const EventSearchTypeCategory = (props: ICategoryProps) => {
    const formRef = React.useRef<HTMLFieldSetElement>(null);

    React.useLayoutEffect(() => props.SetHeight(formRef?.current?.offsetHeight ?? 0) )

    return <fieldset className="border" style={{ padding: '10px' }} ref={formRef}>
        <legend className="w-auto" style={{ fontSize: 'large' }}>{(props.Label != null && props.Label.length > 0 ? props.Label : 'Other Types')}:
            <a style={{ fontSize: 'small', color: '#0056b3', marginLeft: 2, cursor: 'pointer' }}
                onClick={() => {
                    const isSelected = props.Data.filter(item => props.SelectedID.find(i => i == item.ID) == null).length == 0;
                    props.SelectAll(isSelected);
                    
                }}>
                ({props.Data.filter(item => props.SelectedID.find(i => i == item.ID) == null).length == 0 ? 'un' : ''}select all)
            </a>
        </legend>
        <form>
            <ul style={{ listStyleType: 'none', padding: 0, position: 'relative', float: 'left' }}>
                {props.Data.map((item) => <li key={item.ID}>
                    <label>
                        <input type="checkbox"
                            onChange={(e) => {
                                props.OnChange(item, e.target.checked);
                            }} checked={props.SelectedID.find(i => i == item.ID) != null} />
                        {item.Description}
                    </label>
                </li>)}
            </ul>
        </form>
    </fieldset>
}

export default EventTypeFilter; 