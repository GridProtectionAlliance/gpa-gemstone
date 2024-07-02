//******************************************************************************************************
//  EventCharacteristicFilter.tsx - Gbtc
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
//  04/24/2019 - Billy Ernest
//       Generated original version of source code.
//  08/22/2019 - Christoph Lackner
//       Added Filter for Events with TCE.
//  06/20/2024 - Ali Karrar
//      Moved EventCharacteristicFilter from SEBrowser to gemstone
//
//******************************************************************************************************
import React from 'react';
import _ from 'lodash';
import { Input, Select, MultiCheckBoxSelect } from '@gpa-gemstone/react-forms';
import { OpenXDA } from '@gpa-gemstone/application-typings';


interface IProps {
    setFilter?: (types: number[]) => void,
    setHeight: (h: number) => void,
    eventTypes: OpenXDA.Types.EventType[]
    eventCharacteristicFilter: IEventCharacteristicFilters,
    magDurCurves: OpenXDA.Types.MagDurCurve[],
    eventTypeFilter: number[],
    validMinMax: (field: keyof IEventCharacteristicFilters) => boolean
    
}

interface IPhaseFilters { AN: boolean, BN: boolean, CN: boolean, AB: boolean, BC: boolean, CA: boolean, ABG: boolean, BCG: boolean, ABC: boolean, ABCG: boolean }

interface IEventCharacteristicFilters {
    durationMin: number, durationMax: number,
    phases: IPhaseFilters,
    transientMin?: number, transientMax?: number, transientType: ('LL'|'LN'|'both'),
    sagMin?: number, sagMax?: number, sagType: ('LL' | 'LN' | 'both'),
    swellMin?: number, swellMax?: number, swellType: ('LL' | 'LN' | 'both'),
    curveID: number, curveInside: boolean, curveOutside: boolean
}

const EventCharacteristicFilter = (props: IProps) => {
    const navRef = React.useRef<HTMLDivElement>(null);

    const [newEventCharacteristicFilter, setNewEventCharacteristicFilter] = React.useState<IEventCharacteristicFilters>(props.eventCharacteristicFilter);
    
    const [height, setHeight] = React.useState<number>(0);

    const [newTypeFilter, setNewTypeFilter] = React.useState<number[]>([]);

    const [newPhases, setNewPhases] = React.useState<{ Value: number, Text: string, Selected: boolean }[]>([]);


    React.useLayoutEffect(() => setHeight(navRef?.current?.offsetHeight ?? 0))
    React.useEffect(() => props.setHeight(height), [height])

    React.useEffect(() => { setNewTypeFilter(props.eventTypeFilter) }, [props.eventTypeFilter])
    React.useEffect(() => { setNewEventCharacteristicFilter(props.eventCharacteristicFilter) }, [props.eventCharacteristicFilter])



    React.useEffect(() => {
        setNewEventCharacteristicFilter(props.eventCharacteristicFilter);
        setNewTypeFilter(props.eventTypeFilter);
        const setupPhases: { Value: number, Text: string, Selected: boolean }[] = [];
        Object.keys(props.eventCharacteristicFilter.phases).forEach((key, index) => setupPhases.push({ Value: index, Text: key, Selected: props.eventCharacteristicFilter.phases[key as keyof IPhaseFilters] }));
        setNewPhases(setupPhases);
    }, []);

    const sagsSelected = newTypeFilter.find(i => i == props.eventTypes.find(item => item.Name == 'Sag')?.ID ?? -1) != null;
    const swellsSelected = newTypeFilter.find(i => i == props.eventTypes.find(item => item.Name == 'Swell')?.ID ?? -1) != null;
    const transientsSelected = newTypeFilter.find(i => i == props.eventTypes.find(item => item.Name == 'Transient')?.ID ?? -1) != null;

    return (
                    <fieldset className="border" style={{ padding: '10px', height: '100%' }}>
                        <legend className="w-auto" style={{ fontSize: 'large' }}>Event Characteristics:</legend>
                        <div className="row">
                            
                            <div className={"col-4"}>
                                <form>
                                    <div className="form-group">
                                        <div className='input-group input-group-sm' style={{ width: '100%' }}>
                                            <Select<IEventCharacteristicFilters> Record={newEventCharacteristicFilter} Label='Mag-Dur:' Field='curveID' Setter={setNewEventCharacteristicFilter}
                                                Options={props.magDurCurves.map((v) => ({ Value: v.ID.toString(), Label: v.Name }))} />
                                        </div>
                                        <div className='form-check form-check-inline'>
                                                <input className="form-check-input" type="radio" onChange={() => {
                                                    setNewEventCharacteristicFilter({ ...newEventCharacteristicFilter, curveInside: true, curveOutside: false });
                                                }} checked={newEventCharacteristicFilter.curveInside && !props.eventCharacteristicFilter.curveOutside} />
                                            <label className="form-check-label">Inside</label>
                                        </div>
                                        <div className='form-check form-check-inline'>
                                                <input className="form-check-input" type="radio" onChange={() => {
                                                    setNewEventCharacteristicFilter({ ...newEventCharacteristicFilter, curveOutside: true, curveInside: false });
                                                }} checked={newEventCharacteristicFilter.curveOutside && !newEventCharacteristicFilter.curveInside} />
                                            <label className="form-check-label">Outside</label>
                                            </div>
                                            <div className='form-check form-check-inline'>
                                                <input className="form-check-input" type="radio" onChange={() => {
                                                    setNewEventCharacteristicFilter({ ...newEventCharacteristicFilter, curveOutside: true, curveInside: true });
                                                }} checked={newEventCharacteristicFilter.curveOutside && newEventCharacteristicFilter.curveInside} />
                                                <label className="form-check-label">Both</label>
                                            </div>
                                    </div>
                                    </form>
                                </div>
                                <div className={"col-4"}>
                                <form>
                                    <label style={{ margin: 0 }}>Duration (cycle):</label>
                                    <div className="form-group">
                                            <div className='input-group input-group-sm'>
                                                <div className='col' style={{ width: '45%', paddingRight: 0, paddingLeft: 0 }}>
                                                    <Input<IEventCharacteristicFilters>
                                                        Record={newEventCharacteristicFilter}
                                                        Label='' Field='durationMin'
                                                        Setter={setNewEventCharacteristicFilter}
                                                        Valid={props.validMinMax}
                                                        Feedback={'Invalid Min'}
                                                        Type='number'
                                                        Size={'small'}
                                                        AllowNull={true}
                                                    />
                                            </div>
                                            <div className="input-group-append" style={{ height: '37px'}}>
                                                <span className="input-group-text"> to </span>
                                                </div>
                                                <div className='col' style={{ width: '45%', paddingLeft: 0, paddingRight: 0 }}>
                                                    <Input<IEventCharacteristicFilters>
                                                        Record={newEventCharacteristicFilter}
                                                        Label='' Field='durationMax'
                                                        Setter={setNewEventCharacteristicFilter}
                                                        Valid={props.validMinMax}
                                                        Feedback={'Invalid Max'}
                                                        Type='number'
                                                        Size={'small'}
                                                        AllowNull={true}
                                                    />
                                            </div>
                                        </div>
                                        </div>
                                    </form>
                            </div>
                            <div className={"col-4"}>
                                    <form>
                                        <label style={{ margin: 0 }}>Sags (p.u.):</label>
                                        <div className="form-group">
                                            <div className="row" style={{ width: '100%' }}>
                                            <div className='input-group input-group-sm'>
                                                <div className='col' style={{ width: '45%', paddingLeft: 0, paddingRight: 0 }}>
                                                    <Input<IEventCharacteristicFilters>
                                                        Record={newEventCharacteristicFilter}
                                                        Label='' Disabled={!sagsSelected}
                                                        Field='sagMin'
                                                        Setter={setNewEventCharacteristicFilter}
                                                        Valid={props.validMinMax}
                                                        Feedback={'Invalid Min'}
                                                        Type='number'
                                                        Size={'small'}
                                                        AllowNull={true}
                                                    />
                                                </div>
                                                <div className="input-group-append" style={{ height: '37px' }}>
                                                    <span className="input-group-text"> to </span>
                                                </div>
                                                <div className='col' style={{ width: '45%', paddingLeft: 0, paddingRight: 0 }}>
                                                    <Input<IEventCharacteristicFilters>
                                                        Record={newEventCharacteristicFilter}
                                                        Label=''
                                                        Disabled={!sagsSelected}
                                                        Field='sagMax'
                                                        Setter={setNewEventCharacteristicFilter}
                                                        Valid={props.validMinMax}
                                                        Feedback={'Invalid Max'}
                                                        Type='number'
                                                        Size={'small'}
                                                        AllowNull={true}
                                                    />
                                                </div>
                                                </div>
                                            </div>
                                            <div className="row justify-content-md-center">
                                            <div className='form-check form-check-inline'>
                                                <input className="form-check-input" type="radio" onChange={() => {
                                                    setNewEventCharacteristicFilter({ ...newEventCharacteristicFilter, sagType: 'LL' });
                                                }} checked={newEventCharacteristicFilter.sagType == 'LL'} />
                                                <label className="form-check-label">LL</label>
                                            </div>
                                            <div className='form-check form-check-inline'>
                                                <input className="form-check-input" type="radio" onChange={() => {
                                                    setNewEventCharacteristicFilter({ ...newEventCharacteristicFilter, sagType: 'LN' });
                                                }} checked={newEventCharacteristicFilter.sagType  == 'LN'} />
                                                <label className="form-check-label">LN</label>
                                            </div>
                                            <div className='form-check form-check-inline'>
                                                <input className="form-check-input" type="radio" onChange={() => {
                                                    setNewEventCharacteristicFilter({ ...newEventCharacteristicFilter, sagType: 'both' });
                                                }} checked={newEventCharacteristicFilter.sagType == 'both'} />
                                                <label className="form-check-label">Both</label>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className={"col-4"}>
                                    <MultiCheckBoxSelect
                                        Options={newPhases}
                                        Label={'Phases'}
                                        ItemTooltip={'dark'}
                                        OnChange={
                                            (evt, Options: { Value: string | number; Text: string; Selected: boolean; }[]) => { 
                                                const phaseList: React.SetStateAction<{ Value: number; Text: string; Selected: boolean; }[]> = [];
                                                const phaseFilter: IPhaseFilters = { ...newEventCharacteristicFilter.phases };
                                                newPhases.forEach(phase => {
                                                    const phaseSelected: boolean = phase.Selected != (Options.findIndex(option => phase.Value === option.Value) > -1);
                                                    phaseList.push({ ...phase, Selected: phaseSelected });
                                                    phaseFilter[phase.Text as keyof IPhaseFilters] = phaseSelected;
                                                })
                                                setNewPhases(phaseList);
                                                setNewEventCharacteristicFilter({ ...newEventCharacteristicFilter, phases: phaseFilter });
                                            }
                                        }
                                    /> 
                                </div>
                                
                            <div className={"col-4"}>
                                <form>
                                    <label style={{ margin: 0 }}>Transients (p.u.):</label>
                                    <div className="form-group">
                                            <div className='input-group input-group-sm'>
                                                <div className="row" style={{ width: '100%' }}>
                                                <div className='col' style={{ width: '45%', paddingLeft: 0, paddingRight: 0 }}>
                                                    <Input<IEventCharacteristicFilters>
                                                        Record={newEventCharacteristicFilter} Label=''
                                                        Disabled={!transientsSelected} Field='transientMin'
                                                        Setter={setNewEventCharacteristicFilter}
                                                        Valid={props.validMinMax}
                                                        Feedback={'Invalid Min'}
                                                        Type='number'
                                                        Size={'small'}
                                                        AllowNull={true}
                                                    />
                                            </div>
                                            <div className="input-group-append" style={{ height: '37px'}}>
                                                <span className="input-group-text"> to </span>
                                            </div>
                                                <div className='col' style={{ width: '45%', paddingLeft: 0, paddingRight: 0 }}>
                                                    <Input<IEventCharacteristicFilters>
                                                        Record={newEventCharacteristicFilter}
                                                        Label=''
                                                        Disabled={!transientsSelected}
                                                        Field='transientMax'
                                                        Setter={setNewEventCharacteristicFilter}
                                                        Valid={props.validMinMax}
                                                        Feedback={'Invalid Max'}
                                                        Size={'small'}
                                                        AllowNull={true}
                                                        Type='number' />
                                                    </div>
                                            </div>
                                        </div>
                                            <div className="row justify-content-md-center">
                                                <div className='form-check form-check-inline'>
                                                    <input className="form-check-input" type="radio" onChange={() => {
                                                        setNewEventCharacteristicFilter({ ...newEventCharacteristicFilter, transientType: 'LL' });
                                                    }} checked={newEventCharacteristicFilter.transientType == 'LL'} />
                                                    <label className="form-check-label">LL</label>
                                                </div>
                                                <div className='form-check form-check-inline'>
                                                    <input className="form-check-input" type="radio" onChange={() => {
                                                        setNewEventCharacteristicFilter({ ...newEventCharacteristicFilter, transientType: 'LN' });
                                                    }} checked={newEventCharacteristicFilter.transientType == 'LN'} />
                                                    <label className="form-check-label">LN</label>
                                                </div>
                                                <div className='form-check form-check-inline'>
                                                    <input className="form-check-input" type="radio" onChange={() => {
                                                        setNewEventCharacteristicFilter({ ...newEventCharacteristicFilter, transientType: 'both' });
                                                    }} checked={newEventCharacteristicFilter.transientType == 'both'} />
                                                    <label className="form-check-label">Both</label>
                                                </div>
                                            </div>
                                        </div>
                                </form>
                            </div>
                            <div className="col-4">
                                    <form>

                                    <label style={{ margin: 0 }}>Swells (p.u.):</label>
                                        <div className="form-group">
                                            <div className="row" style={{ width: '100%' }}>
                                        <div className='input-group input-group-sm'>
                                                <div className='col' style={{ width: '45%', paddingLeft: 0, paddingRight: 0 }}>
                                                    <Input<IEventCharacteristicFilters>
                                                        Record={newEventCharacteristicFilter}
                                                        Label='' Disabled={!swellsSelected}
                                                        Field='swellMin'
                                                        Setter={setNewEventCharacteristicFilter}
                                                        Valid={props.validMinMax}
                                                        Feedback={'Invalid Min'}
                                                        Type='number'
                                                        Size={'small'}
                                                        AllowNull={true}
                                                    />
                                            </div>
                                            <div className="input-group-append" style={{ height: '37px'}}>
                                                <span className="input-group-text"> to </span>
                                            </div>
                                                <div className='col' style={{ width: '45%', paddingLeft: 0, paddingRight: 0 }}>
                                                    <Input<IEventCharacteristicFilters>
                                                        Record={newEventCharacteristicFilter}
                                                        Label='' Disabled={!swellsSelected}
                                                        Field='swellMax'
                                                        Setter={setNewEventCharacteristicFilter}
                                                        Valid={props.validMinMax}
                                                        Feedback={'Invalid Max'}
                                                        Type='number'
                                                        Size={'small'}
                                                        AllowNull={true}
                                                    />
                                            </div>
                                                </div>
                                        </div>
                                            <div className="row justify-content-md-center">
                                                <div className='form-check form-check-inline'>
                                                    <input className="form-check-input" type="radio" onChange={() => {
                                                        setNewEventCharacteristicFilter({ ...newEventCharacteristicFilter, swellType: 'LL' });
                                                    }} checked={newEventCharacteristicFilter.swellType == 'LL'} />
                                                    <label className="form-check-label">LL</label>
                                                </div>
                                                <div className='form-check form-check-inline'>
                                                    <input className="form-check-input" type="radio" onChange={() => {
                                                        setNewEventCharacteristicFilter({ ...newEventCharacteristicFilter, swellType: 'LN' });
                                                    }} checked={newEventCharacteristicFilter.swellType == 'LN'} />
                                                    <label className="form-check-label">LN</label>
                                                </div>
                                                <div className='form-check form-check-inline'>
                                                    <input className="form-check-input" type="radio" onChange={() => {
                                                        setNewEventCharacteristicFilter({ ...newEventCharacteristicFilter, swellType: 'both' });
                                                    }} checked={newEventCharacteristicFilter.swellType == 'both'} />
                                                    <label className="form-check-label">Both</label>
                                                </div>
                                            </div>
                                        </div>
                                </form>
                            </div>
                        </div>
                    </fieldset>
    );
}
export default EventCharacteristicFilter;