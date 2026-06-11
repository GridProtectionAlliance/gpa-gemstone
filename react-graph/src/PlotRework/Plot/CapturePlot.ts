//******************************************************************************************************
//  PlotCapture.ts - Gbtc
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
//  03/04/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import html2canvas from 'html2canvas';

export interface ICaptureOptions {
    /** Output filename without extension */
    Filename: string;
    /** Image format */
    Format: 'png' | 'jpg';
}

/**
 * Captures the plot container (SVG + legend) as a raster image.
 *
 * Uses html2canvas to render the entire container div, which includes both the SVG chart and any HTML legend elements.
 *
 * @param container - The outermost div element wrapping the plot.
 * @param options - capture settings.
 * @returns The image data URL if ReturnDataUrl is true, otherwise undefined.
 */
export async function capturePlot(container: HTMLDivElement, options: ICaptureOptions): Promise<string | undefined> {
    const mimeType = options.Format === 'jpg' ? 'image/jpeg' : 'image/png';

    // html2canvas renders the container DOM subtree onto a canvas.
    const canvas = await html2canvas(container);

    //convert canvas into a data URL
    const dataUrl = canvas.toDataURL(mimeType, 1);

    // Trigger a file download
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${options.Filename}.${options.Format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return undefined;
}