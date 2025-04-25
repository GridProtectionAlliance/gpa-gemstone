//******************************************************************************************************
//  useGetScreenSize.tsx - Gbtc
//
//  Copyright (c) 2024, Grid Protection Alliance.  All Rights Reserved.
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
//  04/04/2025 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************
import useMediaQuery from './useMediaQuery';
import { Gemstone } from '@gpa-gemstone/application-typings';

/**
 * Custom hook to return the current sreen size
 * @returns 'xs' | "sm" | 'md' | 'lg' | 'xl' - screen sizes according to bootstrap 4.6.2 documentation
 */
const useGetScreenSize = (): Gemstone.TSX.Types.ScreenSize => {
    const isSm = useMediaQuery('(min-width: 576px) and (max-width: 767.98px)');
    const isMd = useMediaQuery('(min-width: 768px) and (max-width: 991.98px)');
    const isLg = useMediaQuery('(min-width: 992px) and (max-width: 1199.98px)');
    const isXl = useMediaQuery('(min-width: 1200px)');

    if (isXl) return 'xl';
    if (isLg) return 'lg';
    if (isMd) return 'md';
    if (isSm) return 'sm';
    return 'xs';
};

export default useGetScreenSize;