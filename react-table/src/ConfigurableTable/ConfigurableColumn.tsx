// ******************************************************************************************************
//  ConfigurableColumn.tsx - Gbtc
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
//  11/18/2023 - Christoph Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';

/** Defines a configurable column's display and selection state. */
interface IProps {
    /**
     * Optional flag that shows the column when no saved configuration exists, defaulting to false.
     */
    Default?: boolean,
    /**
     * Optional label shown for the column in the settings dialog, defaulting to its key.
     */
    Label?: string,
    /**
     * Unique key used to identify and persist the configurable column.
     */
    Key: string
}

/**
 * Wrapper to make any column configurable
 */
export default function ConfigurableColumn(props: React.PropsWithChildren<IProps>) {
    return <>{props.children}</>
}
