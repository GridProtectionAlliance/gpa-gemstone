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
import {Gemstone} from '@gpa-gemstone/application-typings';
import * as React from 'react'

export const useGetContainerPosition = (containerRef: React.MutableRefObject<HTMLDivElement | null>) => {
    const [containerPosition, setContainerSize] = React.useState<Gemstone.TSX.Interfaces.IElementPosition>({ Top: 0, Left: 0, Height: 0, Width: 0 });

    React.useLayoutEffect(() => {
        if (containerRef.current == null) return

        const handleResize = () => {
            if (containerRef.current == null) return
            const newSize = containerRef.current.getBoundingClientRect()
            if (newSize.top !== containerPosition.Top || newSize.left !== containerPosition.Left || newSize.height !== containerPosition.Height || newSize.width !== containerPosition.Width) {
                setContainerSize({ Height: newSize.height, Top: newSize.top, Left: newSize.left, Width: newSize.width })
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