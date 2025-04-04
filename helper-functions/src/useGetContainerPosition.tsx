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

/**
 * 
 * @param {React.MutableRefObject<HTMLDivElement | null>} containerRef - A mutable reference object to the container element.
 * @returns {{ top: number, left: number, height: number, width: number, x: number, y: number, bottom: number, right: number }} - 
 * - `top`: Distance from the top of the viewport to the top of the container.
 * - `left`: Distance from the left of the viewport to the left of the container.
 * - `height`: Height of the container.
 * - `width`: Width of the container.
 * - `scrollWidth`: Scroll Width of the container.
 * - `x`: Horizontal position of the container relative to the viewport.
 * - `y`: Vertical position of the container relative to the viewport.
 * - `bottom`: Distance from the top of the viewport to the bottom of the container.
 * - `right`: Distance from the left of the viewport to the right of the container.
 */

export const useGetContainerPosition = (containerRef: React.MutableRefObject<HTMLDivElement | null>) => {
    const [top, setTop] = React.useState<number>(0);
    const [left, setLeft] = React.useState<number>(0);
    const [height, setHeight] = React.useState<number>(0);

    const [width, setWidth] = React.useState<number>(0);
    const [scrollWidth, setScrollWidth] = React.useState<number>(0);

    const [x, setX] = React.useState<number>(0);
    const [y, setY] = React.useState<number>(0);
    const [bottom, setBottom] = React.useState<number>(0);
    const [right, setRight] = React.useState<number>(0);

    React.useLayoutEffect(() => {
        if (containerRef.current == null) return

        const handleResize = () => {
            if (containerRef.current == null) return
            const newSize = containerRef.current.getBoundingClientRect()
            const newScrollWidth = containerRef.current.scrollWidth;
            if (newSize.top !== top) setTop(newSize.top);
            if (newSize.left !== left) setLeft(newSize.left);
            if (newSize.height !== height) setHeight(newSize.height);
            if (newSize.width !== width) setWidth(newSize.width);
            if (newScrollWidth !== scrollWidth) setScrollWidth(newScrollWidth);
            if (newSize.x !== x) setX(newSize.x);
            if (newSize.y !== y) setY(newSize.y);
            if (newSize.bottom !== bottom) setBottom(newSize.bottom);
            if (newSize.right !== right) setRight(newSize.right);
        }

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(containerRef.current);

        handleResize();

        return () => {
            resizeObserver.disconnect();
        };
    })

    return { top, left, height, width, x, y, bottom, right, scrollWidth }
}