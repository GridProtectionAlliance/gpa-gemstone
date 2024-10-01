// ******************************************************************************************************
//  useGetContainerPosition.tsx - Gbtc
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
//  09/24/2024 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************
import * as React from 'react'
import * as _ from 'lodash';

export const useGetContainerPosition = (containerRef: React.MutableRefObject<HTMLDivElement | null>) => {
    const [containerPosition, setContainerSize] = React.useState<DOMRect>({ top: 0, left: 0, height: 0, width: 0, x: 0, y: 0, bottom: 0, right: 0, toJSON: () => {} });

    React.useLayoutEffect(() => {
        if (containerRef.current == null) return

        const handleResize = () => {
            if (containerRef.current == null) return
            const newSize = containerRef.current.getBoundingClientRect()
            if (!_.isEqual(newSize, containerPosition)) {
                setContainerSize(newSize)
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    })

    return containerPosition
}