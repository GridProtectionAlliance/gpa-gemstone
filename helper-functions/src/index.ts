// ******************************************************************************************************
//  index.ts - Gbtc
//
//  Copyright � 2021, Grid Protection Alliance.  All Rights Reserved.
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
//  https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
//
//  Code Modification History:
//  ----------------------------------------------------------------------------------------------------
//  01/04/2021 - Billy Ernest
//       Generated original version of source code.
//
// ******************************************************************************************************

import { CreateGuid } from './CreateGuid';
import { GetTextWidth } from './GetTextWidth';
import { GetTextHeight } from './GetTextHeight';
import { GetNodeSize } from './GetNodeSize';
import { RandomColor } from './RandomColor';
import { IsNumber } from './IsNumber';
import { IsInteger } from './IsInteger';
import { IsCron } from './IsCron';
import { SpacedColor } from './SpacedColor';
import { HsvToHex } from "./HsvToHex";
import { HexToHsv } from "./HexToHsv";
import { useEffectWithPrevious } from './React/useEffectWithPrevious';
import { findLastIndex } from './FindLastIndex'
import { IsRegex } from './IsRegex';
import { CsvStringToArray } from './CSVStringToArray';
import { useGetContainerPosition } from './React/useGetContainerPosition';
import GetScrollbarWidth from './GetScrollBarWidth';
import useMediaQuery from './React/useMediaQuery';
import useGetScreenSize from './React/useGetScreenSize';
import { ParseKeyValuePairs } from './ParseKeyValuePairs';
import { JoinKeyValuePairs } from './JoinKeyValuePairs';
import { IsBool } from './IsBool';
import { ReplaceAll } from './ReplaceAll';
import { RegexEncode } from './RegexEncode';
import { ComputeMax } from './ComputeMax';
import { ComputeMin } from './ComputeMin';
import { FormatDuration } from './DisplayDur';
import { GetColor } from './GetColor';

export {
    CreateGuid,
    GetTextWidth,
    GetNodeSize,
    GetColor,
    RandomColor,
    GetTextHeight,
    IsNumber,
    IsInteger,
    IsCron,
    SpacedColor,
    HsvToHex,
    HexToHsv,
    findLastIndex,
    useEffectWithPrevious,
    IsRegex,
    CsvStringToArray,
    useGetContainerPosition,
    GetScrollbarWidth,
    useMediaQuery,
    useGetScreenSize,
    ParseKeyValuePairs,
    JoinKeyValuePairs,
    IsBool,
    ReplaceAll,
    RegexEncode,
    ComputeMax,
    ComputeMin,
    FormatDuration
}
