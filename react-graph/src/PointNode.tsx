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
    avgV: number[];
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
        this.avgV = Array(this.dim-1).fill(0);
        this.minV = Array(this.dim-1).fill(0);
        this.maxV = Array(this.dim-1).fill(0);
        this.children = null;
        this.points = null;

        if (data.length <= MaxPoints) {
            if (data.some((point)=> point.length != this.dim)) throw new TypeError(`Jagged data passed to PointNode. All points should all be ${this.dim} dimensions.`)
            this.points = data;
            for (let index = 1; index < this.dim; index++) this.minV[index-1] = Math.min(...data.filter(pt => !isNaN(pt[index])).map(pt => pt[index]));
            for (let index = 1; index < this.dim; index++) this.maxV[index-1] = Math.max(...data.filter(pt => !isNaN(pt[index])).map(pt => pt[index]));
            return;
        }

        const nLevel = Math.floor(Math.pow(data.length, 1 / MaxPoints));
        const blockSize = nLevel * MaxPoints;

        let index = 0;
        this.children = [];
        while (index < data.length) {
            this.children.push(new PointNode(data.slice(index, index + blockSize)));
            index = index + blockSize;
        }
        for (let index = 0; index < this.dim-1; index++) this.minV[index] = Math.min(...this.children.map(node => node.minV[index]));
        for (let index = 0; index < this.dim-1; index++) this.maxV[index] = Math.max(...this.children.map(node => node.maxV[index]));
            }

    public GetData(Tstart: number, Tend: number, IncludeEdges?: boolean): [...number[]][] {
        if (this.points != null && Tstart <= this.minT && Tend >= this.maxT)
            return this.points;
        if (this.points != null && IncludeEdges !== undefined && IncludeEdges)
            return this.points.filter((pt,i) => (pt[0] >= Tstart && pt[0] <= Tend) || 
                i < ((this.points?.length ?? 0) -1) && (this.points?[i+1][0] : 0) >= Tstart || 
                i > 0  && (this.points?[i-1][0] : 0)<= Tend);
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

    public GetAllLimits(Tstart: number, Tend: number): [number,number][] {
        const result: [number, number][] = Array(this.dim-1); 
        for(let index = 0; index < this.dim-1; index++)
            result[index] = this.GetLimits(Tstart, Tend, index);
        return result;
    }

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
     * @param {number} point - The point to retrieve from the tree
     */
    public GetPoint(point: number): [...number[]] {
        // round point back to whole integer 
        point = Math.round(point);

        // if the point is less than the minimum value of the subsection, return the first point
        if (point < this.minT && this.points !== null)
            return this.points[0];

        // if the point is greater than the largest value of the subsection, return the last point
        if (point > this.maxT && this.points !== null)
          return this.points[this.points.length - 1];

        // if the subsection is null, and the point is less than the minimum value of the subsection, ??Start over again lookign for the point in the first subsection??
        if (point < this.minT && this.points === null)
          return this.children![0].GetPoint(point);
        else if (point > this.maxT && this.points === null)
            return this.children![this.children!.length - 1].GetPoint(point);


        if (this.points != null) {
            let upper = this.points.length - 1;
            let lower = 0;

            let Tlower = this.minT;
            let Tupper = this.maxT;

            while (Tupper !== point && Tlower !== point && upper !== lower && Tupper !== Tlower) {
                const center = Math.round((upper + lower) / 2);
                const Tcenter = this.points[center][0];

                if (center === upper || center === lower)
                    break;
                if (Tcenter <= point)
                    lower = center;
                if (Tcenter > point)
                    upper = center;
                Tupper = this.points[upper][0];
                Tlower = this.points[lower][0];
            }
            if (Math.abs(point - Tlower) < Math.abs(point - Tupper))
                return this.points[lower];

            return this.points[upper];

        }
        else {
            const child = this.children!.find(n => /*n.minT <= point &&*/ n.maxT > point);
            return child!.GetPoint(point);
        }

    }
}
