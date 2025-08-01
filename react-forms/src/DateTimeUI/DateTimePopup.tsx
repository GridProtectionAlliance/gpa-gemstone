// ******************************************************************************************************
//  DateTimePopup.tsx - Gbtc
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
//  05/15/2023 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import * as moment from 'moment';
import { Portal } from 'react-portal';
import styled from 'styled-components';
import Calender from './Calender';
import Clock from './Clock';
import { Gemstone } from '@gpa-gemstone/application-typings';
import { useGetContainerPosition } from '@gpa-gemstone/helper-functions';
import { TimeUnit } from './DateTimePicker';

interface IWrapperProps {
    Top: number,
    Left: number,
    Indicator: number
}

//TODO: this eventually should be moved into a css class
const WrapperDiv = styled.div<IWrapperProps>`
  & {
    border-radius: 3px;
    display: inline-block;
    font-size: 13px;
    padding: 8px 21px;
    position: fixed;
    transition: opacity 0.3s ease-out;
    z-index: 9999;
    opacity: 0.9;
    background: #222;
    top: ${props => `${props.Top}px`};
    left: ${props => `${props.Left}px`};
    border: 1px solid transparent;
  }
  &::before {
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #222;
    left: ${props => `${props.Indicator}%`};
    top: -6px;
    margin-left: -8px;
    content: "";
    width: 0px;
    height: 0px;
    position: absolute
  }`

interface IProps {
    DateTime: moment.Moment | undefined,
    Setter: (record: moment.Moment) => void,
    Type: TimeUnit,
    Show: boolean,
    Top: number,
    Center: number,
    Accuracy?: Gemstone.TSX.Types.Accuracy
}

//This is merely used to provide a class name for the popup for indentification purposes
const DateTimePopupClass = "gpa-gemstone-datetime-popup";

function DateTimePopup(props: IProps, ref: React.ForwardedRef<HTMLDivElement | null>) {
    const divRef = React.useRef<HTMLDivElement | null>(null);

    const [showTime, setShowTime] = React.useState<boolean>(props.Type !== 'date');
    const [showDate, setShowDate] = React.useState<boolean>(props.Type !== 'time');

    const refToUse = ref ?? divRef;

    const { width } = useGetContainerPosition(refToUse as any);

    const left = Math.max(props.Center - 0.5 * width, 0)

    React.useEffect(() => {
        setShowTime(props.Type !== 'date');
        setShowDate(props.Type !== 'time');
    }, [props.Type])

    if (!props.Show)
        return null;

    return (
        <Portal>
            <WrapperDiv Top={props.Top} Left={left} Indicator={50} ref={refToUse} className={DateTimePopupClass}>
                {showDate ? <Calender DateTime={props.DateTime} Setter={props.Setter} /> : null}
                {showTime ? <Clock DateTime={props.DateTime} Setter={props.Setter} Accuracy={props.Accuracy} /> : null}
            </WrapperDiv>
        </Portal>
    );
}

export default React.forwardRef<HTMLDivElement | null, IProps>(DateTimePopup);