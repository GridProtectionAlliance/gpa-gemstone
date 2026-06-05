//******************************************************************************************************
//  OverlayDrawer.tsx - Gbtc
//
//  Copyright (c) 2025, Grid Protection Alliance.  All Rights Reserved.
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
//  06/01/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import { OverlayDrawer } from '@gpa-gemstone/react-interactive';
import * as React from 'react';

export const OVERLAY_DRAWER_ID = 'overlay-drawer-test';

// data-drawer values identifying each target
export const DOM_TARGET = 'overlay-dom';
export const SCROLL_TARGET = 'overlay-scroll';
export const RESIZE_TARGET = 'overlay-resize';

// Targets the drawers align themselves to
export const DOM_TARGET_ID = 'overlay-dom-target';
export const SCROLL_TARGET_ID = 'overlay-scroll-target';
export const RESIZE_TARGET_ID = 'overlay-resize-target';

// Wrappers that contain ONLY an OverlayDrawer. The drawer handle is the first
// child div of the wrapper, so tests can locate it via `#${wrapperId} > div`.
export const DOM_WRAPPER_ID = 'overlay-dom-wrapper';
export const SCROLL_WRAPPER_ID = 'overlay-scroll-wrapper';
export const RESIZE_WRAPPER_ID = 'overlay-resize-wrapper';

// Controls
export const INSERT_BTN_ID = 'overlay-insert-btn';
export const SCROLL_CONTAINER_ID = 'overlay-scroll-container';

const OverlayDrawerTestComponent = () => {
    const [inserted, setInserted] = React.useState<boolean>(false);

    return (
        <div id={OVERLAY_DRAWER_ID} style={{ padding: 20 }}>

            {/* Scenario 1: inserting an element into the DOM shifts the target,
                and the drawer should follow via its MutationObserver. */}
            <button id={INSERT_BTN_ID} onClick={() => setInserted(s => !s)}>
                Insert
            </button>
            <div>
                {inserted ? <div id="overlay-dom-spacer" style={{ height: 120 }} /> : null}
                <div
                    data-drawer={DOM_TARGET}
                    id={DOM_TARGET_ID}
                    style={{ height: 150, width: 300, border: '1px solid #000' }}
                >
                    DOM target
                </div>
            </div>
            <div id={DOM_WRAPPER_ID}>
                <OverlayDrawer Title="DOM" Open={false} Location="left" Target={DOM_TARGET}>
                    <div>DOM drawer content</div>
                </OverlayDrawer>
            </div>

            {/* Scenario 2: scrolling the container the target lives in should
                realign the drawer via its scroll listener. */}
            <div
                id={SCROLL_CONTAINER_ID}
                style={{ height: 200, width: 320, overflow: 'auto', border: '1px solid #000', marginTop: 20 }}
            >
                <div style={{ height: 100 }} />
                <div
                    data-drawer={SCROLL_TARGET}
                    id={SCROLL_TARGET_ID}
                    style={{ height: 150, width: 280, border: '1px solid #00f' }}
                >
                    Scroll target
                </div>
                <div style={{ height: 400 }} />
            </div>
            <div id={SCROLL_WRAPPER_ID}>
                <OverlayDrawer Title="SCROLL" Open={false} Location="left" Target={SCROLL_TARGET}>
                    <div>Scroll drawer content</div>
                </OverlayDrawer>
            </div>

            {/* Scenario 3: resizing the window moves the right-aligned target,
                and the drawer should realign via its resize listener. */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                <div
                    data-drawer={RESIZE_TARGET}
                    id={RESIZE_TARGET_ID}
                    style={{ height: 150, width: 200, border: '1px solid #0a0' }}
                >
                    Resize target
                </div>
            </div>
            <div id={RESIZE_WRAPPER_ID}>
                <OverlayDrawer Title="RESIZE" Open={false} Location="left" Target={RESIZE_TARGET}>
                    <div>Resize drawer content</div>
                </OverlayDrawer>
            </div>

        </div>
    );
};

export default OverlayDrawerTestComponent;
