// ******************************************************************************************************
//  StreamingLine.tsx - Gbtc
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
//  12/16/2024 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import { InternalLine } from './Line';
import { PointNode } from './PointNode';
import { IProps as ILineProps } from './Line';

interface IProps extends ILineProps {
    Interval: number // interval to rerender line
    RerenderCallback?: () => boolean //determines if we should rerender internal line after interval timer completes
}

const StreamingLine = React.forwardRef<PointNode | null, IProps>((props, ref) => {
    const [rerender, setRerender] = React.useState<number>(0);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            if (props.RerenderCallback == null) {
                setRerender(prev => prev + 1);
                return
            }

            if (props.RerenderCallback())
                setRerender(prev => prev + 1)

        }, props.Interval * 1000); // Convert seconds to milliseconds

        return () => clearInterval(intervalId);
    }, [props.Interval, props.RerenderCallback]);

    return <InternalLine {...props} ref={ref} reRender={rerender} />
});

export default StreamingLine;