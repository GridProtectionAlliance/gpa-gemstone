// ******************************************************************************************************
//  PointNode.tsx - Gbtc
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
//  03/18/2021 - C Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

const MaxPoints = 20;

/**
 * 
 * Node in a tree.
 */
export class PointNode {
    minT: number;
    maxT: number;
    minV: number[];
    maxV: number[];
    sum: number[];
    count: number;
    // Count of all dimensions (including time)
    dim: number;

    private children: PointNode[] | null;
    private points: [...number[]][] | null;

    constructor(data: [...number[]][]) {
        this.dim = data[0].length;
        // That minimum time stamp that fits in this bucket
        this.minT = data[0][0];
        // The maximum time stamp that might fit in this bucket
        this.maxT = data[data.length - 1][0];
        // Intializing other vars
        this.sum = Array(this.dim-1).fill(0);
        this.count = 0;
        this.minV = Array(this.dim-1).fill(0);
        this.maxV = Array(this.dim-1).fill(0);
        this.children = null;
        this.points = null;

        if (data.length <= MaxPoints) {
            if (data.some(point => point.length != this.dim)) throw new TypeError(`Jagged data passed to PointNode. All points should all be ${this.dim} dimensions.`)
            this.points = data;

            for (let index = 1; index < this.dim; index++) {
                const values = data.filter(pt => !isNaN(pt[index])).map(pt => pt[index]);
                this.minV[index - 1] = Math.min(...values);
                this.maxV[index - 1] = Math.max(...values);
                this.sum[index - 1] = values.reduce((sum, val) => sum + val, 0);
            }
            this.count = data.length;
            return;
        }

        const nLevel = Math.floor((Math.log((data.length) / Math.log(MaxPoints)))) - 1;
        const blockSize = nLevel * MaxPoints;

        let index = 0;
        this.children = [];
        while (index < data.length) {
            this.children.push(new PointNode(data.slice(index, index + blockSize)));
            index = index + blockSize;
        }

        for (let index = 0; index < this.dim-1; index++){
            this.minV[index] = Math.min(...this.children.map(node => node.minV[index]));
            this.maxV[index] = Math.max(...this.children.map(node => node.maxV[index]));
            this.sum[index] = this.children.reduce((s,node) => s + node.sum[index], 0);
        }
        this.count = this.children.reduce((s,node) => s + node.count, 0);
    }

    public GetData(Tstart: number, Tend: number, IncludeEdges?: boolean): [...number[]][] {
        if (this.points != null && Tstart <= this.minT && Tend >= this.maxT)
            return this.points;
        if (this.points != null && IncludeEdges !== undefined && IncludeEdges)
            return this.points.filter((pt,i) => (pt[0] >= Tstart && pt[0] <= Tend) || 
                i < ((this.points?.length ?? 0) -1) && (this.points != null ? this.points[i+1][0] : 0) >= Tstart || 
                i > 0  && (this.points != null ? this.points[i-1][0] : 0)<= Tend);
        if (this.points != null)
            return this.points.filter(pt => pt[0] >= Tstart && pt[0] <= Tend );
        const result: [...number[]][] = [];
        return result.concat(...this.children!.filter(node => 
            (node.minT <= Tstart && node.maxT > Tstart) || 
            (node.maxT >= Tend && node.minT < Tend) || 
            (node.minT >= Tstart && node.maxT <= Tend)
            ).map(node => node.GetData(Tstart, Tend, IncludeEdges)));
    }


    public GetFullData(): [...number[]][] {
      return this.GetData(this.minT,this.maxT);
    }

    /**
     * Get Limits for all dimensions
     * @param Tstart start time of the timerange to be looked at
     * @param Tend end time of the timerange to be looked at
     * @returns The min and max value of the data in the given timerange
     */
    public GetAllLimits(Tstart: number, Tend: number): [number,number][] {
        const result: [number, number][] = Array(this.dim-1); 
        for(let index = 0; index < this.dim-1; index++)
            result[index] = this.GetLimits(Tstart, Tend, index);
        return result;
    }

    /**
     * Retrieves the limits of the data in the given timerange
     * @param Tstart start time of the timerange to be looked at
     * @param Tend end time of the timerange to be looked at
     * @param dimension dimension of the data to be retrieved (x,y,z) to get y use 0
     * @returns The min and max value of the data in the given timerange
     */
    // Note: Dimension indexing does not include time, I.E. in (x,y), y would be dimension 0;
    public GetLimits(Tstart: number, Tend: number, dimension?: number): [number,number] {
      const currentIndex = dimension ?? 0;
      let max = this.maxV[currentIndex];
      let min = this.minV[currentIndex];

      if (this.points == null && !(Tstart <= this.minT && Tend > this.maxT)) {
        // Array represents all limits of buckets
        const limits = this.children!.filter(n => n.maxT > Tstart && n.minT < Tend).map(n => n.GetLimits(Tstart,Tend,currentIndex));
        min = Math.min(...limits.map(pt => pt[0]));
        max = Math.max(...limits.map(pt => pt[1]));
      }
      if (this.points != null && !(Tstart <= this.minT && Tend > this.maxT)) {
        // Array represents all numbers within this bucket that fall in range
        const limits = this.points!.filter(pt => pt[0] > Tstart && pt[0] < Tend).map(pt => pt[currentIndex+1]);
        min = Math.min(...limits);
        max = Math.max(...limits);
      }

      return [min,max];
    }

    /**
     * Retrieves a point from the PointNode tree
     * @param {number} tVal - The time value of the point to retrieve from the tree.
     */
    public GetPoint(tVal: number): [...number[]] {
        return this.PointBinarySearch(tVal, 1)[0];
    }

    /**
     * Retrieves a specified number of points from the PointNode tree, centered around a point
     * @param {number} tVal - The time value of the center point of the point retrieval.
     * @param {number} pointsRetrieved - The number of points to retrieve
     */
    public GetPoints(tVal: number, pointsRetrieved = 1): [...number[]][] {
        return this.PointBinarySearch(tVal, pointsRetrieved);
    }

    private PointBinarySearch(tVal: number, pointsRetrieved = 1, bucketLowerNeighbor?: PointNode, bucketUpperNeighbor?: PointNode): [...number[]][] {
        if (pointsRetrieved <= 0) throw new RangeError(`Requested number of points must be positive value.`);
        // round tVal back to whole integer 

        if (this.points !== null) {
            // if the tVal is less than the minimum value of the subsection, return the first point
            if (tVal < this.minT) {
                const spillOver = pointsRetrieved - this.points.length;
                const spillOverPoints = (spillOver > 0 && bucketUpperNeighbor !== undefined) ? bucketUpperNeighbor.PointBinarySearch(tVal, spillOver, this, undefined) : [];
                return this.points.slice(0,pointsRetrieved).concat(spillOverPoints);
            }

            // if the tVal is greater than the largest value of the subsection, return the last point
            if (tVal > this.maxT) {
                const spillOver = pointsRetrieved - this.points.length;
                const spillOverPoints = (spillOver > 0 && bucketLowerNeighbor !== undefined) ? bucketLowerNeighbor.PointBinarySearch(tVal, spillOver, undefined, this) : [];
                return spillOverPoints.concat(this.points.slice(-pointsRetrieved));
            }

            // Otherwise, perform binary search
            let upper = this.points.length - 1;
            let lower = 0;

            let Tlower = this.minT;
            let Tupper = this.maxT;

            while (Tupper !== tVal && Tlower !== tVal && upper !== lower && Tupper !== Tlower) {
                const center = Math.round((upper + lower) / 2);
                const Tcenter = this.points[center][0];

                if (center === upper || center === lower)
                    break;
                if (Tcenter <= tVal)
                    lower = center;
                if (Tcenter > tVal)
                    upper = center;
                Tupper = this.points[upper][0];
                Tlower = this.points[lower][0];
            }

            let upperPoints = Math.floor(pointsRetrieved / 2);
            let lowerPoints = upperPoints;
            // Adjustment for even number of points
            const sidingAdjust = pointsRetrieved % 2 === 0 ? 1 : 0;
            let centerIndex: number;
            if (Math.abs(tVal - Tlower) < Math.abs(tVal - Tupper)) {
                centerIndex = lower;
                lowerPoints -= sidingAdjust;
            } else {
                centerIndex = upper;
                upperPoints -= sidingAdjust;
            }

            // Note: If we have spillover and no neighbor on the spillover side, then we discard the idea of spillover, and just return as many as we can on that side
            const upperSpillOver = centerIndex + upperPoints + 1 - this.points.length;
            const upperNeighborPoints = (upperSpillOver > 0 && bucketUpperNeighbor !== undefined) ? bucketUpperNeighbor.PointBinarySearch(tVal, upperSpillOver, this, undefined) : [];
            const lowerSpillOver = lowerPoints - centerIndex;
            const lowerNeighborPoints = (lowerSpillOver > 0 && bucketLowerNeighbor !== undefined) ? bucketLowerNeighbor.PointBinarySearch(tVal, lowerSpillOver, undefined, this) : [];

            return lowerNeighborPoints.concat(this.points.slice(Math.max(centerIndex - lowerPoints, 0), Math.min(centerIndex + upperPoints +1, this.points.length))).concat(upperNeighborPoints);

        }
        else if (this.children !== null) {
            let childIndex = -1;
            // if the subsection is null, and the tVal is less than the minimum value of the subsection, ??Start over again looking for the point in the first subsection??
            if (tVal < this.minT) childIndex = 0;
            else if (tVal > this.maxT) childIndex = this.children.length - 1;
            else childIndex = this.children.findIndex(n => n.maxT > tVal);

            if (childIndex === -1) throw new RangeError(`Could not find child bucket with point that has a time value of ${tVal}`);

            // Find neighbors
            const upperNeighbor = childIndex !== this.children.length - 1 ? this.children[childIndex + 1] : undefined;
            const lowerNeighbor = childIndex !== 0 ? this.children[childIndex - 1] : undefined;
            return this.children[childIndex].PointBinarySearch(tVal, pointsRetrieved, lowerNeighbor, upperNeighbor);
        }
        else throw new RangeError(`Both children and points are null for PointNode, unabled to find point with time value of ${tVal}`);
    }

     /**
     * Returns the size of the Tree below this PointNode
     */
    public GetTreeSize(): number {
        if (this.children == null) return 1;
        return 1 + this.children[0].GetTreeSize();
    }

    /**
     * Returns an aggregates data set for the given timerange
     * @param Tstart start time of the timerange to be looked at
     * @param Tend end time of the timerange to be looked at
     * @param numPoints The approximate number of points requested
     * @returns 
     */
    /* Note that this is broken left and right edge for now*/
    public AggregateData = (Tstart: number, Tend: number, numPoints: number): [...number[]] => {
        const center = ( Tstart + Tend ) / 2;
        return this.GetPoint(center);
    }
}
