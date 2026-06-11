//******************************************************************************************************
//  StreamingLine.tsx - Gbtc
//
//  Copyright (c) 2026, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA may license this file to you under the MIT License (MIT), the "License"; you may not use this
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
//  02/23/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import InternalLine from './InternalLine';
import { ILineProps } from './Line';

export interface IProps extends ILineProps {
    /**
     * Interval to rerender line, in seconds
     */
    Interval: number
    /**
     * Determines if we should rerender internal line after interval timer completes
     * @returns boolean indicating whether to rerender
     */
    RerenderCallback?: () => boolean
}

const StreamingLine = (props: IProps) => {
    const { Interval, RerenderCallback } = props;

    const [rerender, setRerender] = React.useState<number>(0);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            if (RerenderCallback == null || RerenderCallback()) {
                setRerender(prev => prev + 1);
                return
            }

        }, Interval * 1000); // Convert seconds to milliseconds

        return () => clearInterval(intervalId);
    }, [Interval, RerenderCallback]);

    return <InternalLine {...props} PointNodeRef={props.PointNodeRef} ReRender={rerender} />
};

export default StreamingLine;
