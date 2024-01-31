// ******************************************************************************************************
//  KDNode.tsx - Gbtc
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
//  01/25/2024 - G Santos
//       Generated original version of source code.
//
// ******************************************************************************************************


import * as _ from 'lodash';

interface ITransformationFunc {
    (arg: number): number;
}

interface INNResult{
    pt: [...number[]],
    distSq: number
}

export class KDNode {
    left?: KDNode;
    right?: KDNode;
    point: [...number[]];
    dim: number;

    constructor(dataPoints: [...number[]][], dims: number, isOrderedAscending: boolean = false, cuttingDim: number = 0){
        this.dim = dims;
        if (dataPoints.length === 0) throw new TypeError(`No data passed to KDNode construction.`)
        else {
            let points;
            // Sorting and picking out medians allows for faster searching, since the tree will be more balanced
            if (isOrderedAscending) points = dataPoints;
            else points = _.sortBy(dataPoints, cuttingDim)
            const medianIndex = Math.floor(points.length / 2);
            this.point = points[medianIndex];
            if (points.length > 1) this.left = new KDNode(points.slice(0, medianIndex), dims, false, (cuttingDim + 1) % dims);
            if (points.length > 2) this.right =  new KDNode(points.slice(medianIndex + 1, points.length), dims, false, (cuttingDim + 1) % dims);
        }
    }

    // Unused at the moment, but may be helpful for other applications
    public insertPoint(point: [...number[]], dim: number, currentDim: number = 0) {
        // left path
        if (point[currentDim] < this.point[currentDim]) {
            if (this.left == null) this.left = new KDNode([point], dim, true, currentDim);
            else this.left.insertPoint(point, dim,  (currentDim + 1) % dim);
        }
        // right path
        else {
            if (this.right == null) this.right = new KDNode([point], dim, true, currentDim);
            else this.right.insertPoint(point, dim,  (currentDim + 1) % dim);
        }
    }
    
    // Assumption: Transformation functions are linear
    public findNearest(point: [...number[]], transformationFunc?: ITransformationFunc[]): INNResult{
        return this.searchTreeNN(point, 0, undefined, transformationFunc);
    }

    private searchTreeNN(point: [...number[]], currentDim: number, lastResult?: INNResult, transformationFunc?: ITransformationFunc[]): INNResult {
        // Calculate distances
        let currentResult = { pt: this.point, distSq: this.distanceSq(point, transformationFunc) };
        const distToCuttingPlaneSq = this.distanceSqToPlane(point, currentDim, transformationFunc);
        // Compare distances and re-assign if necessary
        if (lastResult != null && lastResult.distSq < currentResult.distSq) currentResult = lastResult;
        // left path
        if (this.left != null && point[currentDim] < this.point[currentDim]) {
            currentResult = this.left.searchTreeNN(point, (currentDim + 1) % this.dim, currentResult, transformationFunc);
            if (this.right != null && currentResult.distSq > distToCuttingPlaneSq)
                currentResult = this.right?.searchTreeNN(point, (currentDim + 1) % this.dim, currentResult, transformationFunc);
        }
        // right path
        else if (this.right != null) {
            currentResult = this.right.searchTreeNN(point, (currentDim + 1) % this.dim, currentResult, transformationFunc);
            if (this.left != null && currentResult.distSq > distToCuttingPlaneSq)
                currentResult = this.left.searchTreeNN(point, (currentDim + 1) % this.dim, currentResult, transformationFunc);
        }
        return currentResult;
    }

    private distanceSq(point: [...number[]], transformationFunc?: ITransformationFunc[]): number {
        let distSq = 0;
        for (let index: number = 0; index < this.dim; index++){
            if (transformationFunc != null)
                distSq += (transformationFunc[index](point[index]) - transformationFunc[index](this.point[index])) **2;
            else
                distSq += (point[index] - this.point[index]) **2;
        }
        return distSq;
    }

    private distanceSqToPlane(point: [...number[]], cuttingDim: number, transformationFunc?: ITransformationFunc[]): number {
        if (transformationFunc != null)
            return (transformationFunc[cuttingDim](point[cuttingDim]) - transformationFunc[cuttingDim](this.point[cuttingDim])) **2;
        else
            return (point[cuttingDim] - this.point[cuttingDim]) **2;

    }
}