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
const MaxTotalPoints = 2000;

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
    private points: number[][] | null;

    constructor(data?: number[][]) {
        // The minimum/maximum time stamp that fits in this node
        this.minT = NaN;
        this.maxT = NaN;

        // Intializing other vars
        this.sum = [NaN];
        this.count = NaN;
        this.minV = [NaN];
        this.maxV = [NaN];
        this.children = null;
        this.points = null;
        this.dim = NaN;

        if (data === undefined) return;

        this.dim = data.length === 0 ? NaN : data[0].length;

        if (data.length !== 0 && data.some(point => point.length !== this.dim))
            throw new TypeError(`Jagged data passed to PointNode. All points should all be ${this.dim} dimensions.`);

        // Initialize normally
        this.initializeNode(data);
    }

    public static createNodeWithDesiredTreeSize(data: number[], desiredTreeSize: number): PointNode {
        const node = new PointNode();

        node.dim = data.length;
        node.minT = data[0];
        node.maxT = data[0];
        node.count = 1;
        node.sum = data.filter((_, i) => i != 0);
        node.minV = data.filter((_, i) => i != 0);
        node.maxV = data.filter((_, i) => i != 0);

        if (desiredTreeSize === 1)
            node.points = [data];
        else
            node.children = [PointNode.createNodeWithDesiredTreeSize(data, desiredTreeSize - 1)]

        return node
    }

    public static CreateCopy(oldNode: PointNode): PointNode {
        const node = new PointNode();

        node.dim = oldNode.dim;

        node.minT = oldNode.minT;
        node.maxT = oldNode.maxT;
        node.minV = [...oldNode.minV]
        node.maxV = [...oldNode.maxV]

        node.sum = [...oldNode.sum];
        node.count = oldNode.count;
        node.children = oldNode.children != null ? [...oldNode.children] : null;
        node.points = oldNode.points != null ? [...oldNode.points] : null;

        return node;
    }

    /**
     * Initializes the node with the provided data points.
     * Handles setting points or splitting into children based on the MaxPoints threshold.
     * @param data An array of points to initialize the node with.
     */
    private initializeNode(data: number[][]): void {

        if (data.length <= MaxPoints) {
            this.points = [...data];
            this.children = null;
        } else {
            // Split into children 
            this.children = PointNode.splitPoints(data);
        }

        this.RecalculateStats();
    }

    /**
     * Adds one set of points to the tree.
     * 
     * @param newPoints points to add, one array of size dim
     */
    public AddPoints(newPoints: number[]): void {
        if (Number.isNaN(this.dim))
            this.dim = newPoints.length

        if (newPoints.length === 0) throw new Error('No point to add');
        if (newPoints.length !== this.dim) throw new TypeError(`Jagged data passed to PointNode.Add(). Points should be ${this.dim} dimension.`);

        if (this.TryAddPoints(newPoints)) {
            if (this.count > MaxTotalPoints)
                this.trimTree();
            return;
        }

        const copiedNode = PointNode.CreateCopy(this);
        this.children = [copiedNode, PointNode.createNodeWithDesiredTreeSize(newPoints, this.GetTreeSize())]
        this.points = null;

        this.RecalculateStats();

        if (this.count > MaxTotalPoints)
            this.trimTree();
    }

    /**
     * Adds one set of points to the tree.
     * 
     * @param newPoints points to add, one array of size dim
     * @returns Success of add operation
     */
    private TryAddPoints(newPoints: number[]): boolean {
        //Step 1 find tree size
        const treeSize = this.GetTreeSize();

        // Step 2: If TreeSize > 1, find the right-most child and call TryAddPoints recursively
        if (treeSize > 1) {
            if (this.children !== null) {
                const rightMostChild = this.children[this.children.length - 1];
                const result = rightMostChild.TryAddPoints(newPoints);

                // Step 2a: If adding to the right-most child failed, check for node space and create a new child if possible
                if (!result && this.children.length < MaxPoints) {
                    const newChild = PointNode.createNodeWithDesiredTreeSize([...newPoints], treeSize - 1)
                    this.children.push(newChild);
                    this.IncrementStatsForNewChild(newChild);
                    return true;
                }

                //return result of adding to the right-most child
                if (result) this.RecalculateStats();

                return result;
            }
        }

        //Step 3: If treesize === 1, check for point space in this node
        if (this.points!.length < MaxPoints) {
            this.points!.push(newPoints);
            this.IncrementStatsForNewPoint(newPoints);
            return true
        }

        //Step 5: return results
        return false;
    }

    /**
     * Splits the given data points into child nodes based on the MaxPoints threshold.
     * @param data An array of sorted points to split into child nodes.
     */
    private static splitPoints(data: number[][]): PointNode[] {
        let nLevel = 1;

        while (Math.pow(MaxPoints, nLevel) < data.length) {
            nLevel++;
        }

        const childBlockSize = Math.pow(MaxPoints, nLevel - 1);
        const children: PointNode[] = [];

        let index = 0;
        while (index < data.length) {
            children.push(new PointNode(data.slice(index, index + childBlockSize)));
            index = index + childBlockSize;
        }

        return children;
    }

    private trimTree(): void {
        const fullData = this.GetFullData();
        if (fullData.length < MaxTotalPoints) return

        const halfIndex = Math.floor(fullData.length / 2);
        const trimmedData = fullData.slice(halfIndex);
        this.initializeNode(trimmedData);
    }

    /**
     * Updates the statistical properties of the node based on its current points or children.
     */
    private RecalculateStats(): void {
        if (this.points !== null) {
            this.CalculatePointStats();
        } else if (this.children !== null) {
            this.AggregateChildStats();
        }
    }

    /**
     * Updates statistics based on the current points.
     */
    private CalculatePointStats(): void {
        if (this.points === null || this.points.length === 0) return;

        this.count = this.points.length;
        this.minT = this.points?.[0]?.[0] ?? NaN;
        this.maxT = this.points?.[this.points.length - 1]?.[0] ?? NaN;
        this.dim = this.points?.[0]?.length ?? NaN;

        for (let index = 1; index < this.dim; index++) {
            const values = this.points.map(pt => pt[index]);
            this.minV[index - 1] = Math.min(...values);
            this.maxV[index - 1] = Math.max(...values);
            this.sum[index - 1] = values.reduce((acc, val) => acc + val, 0);
        }
    }

    /**
     * Updates statistics based on the current children.
     */
    private AggregateChildStats(): void {
        if (this.children === null || this.children.length === 0) return;

        this.minT = Math.min(...this.children.map(node => node.minT));
        this.maxT = Math.max(...this.children.map(node => node.maxT));

        for (let index = 0; index < this.dim - 1; index++) {
            this.minV[index] = Math.min(...this.children.map(node => node.minV[index]));
            this.maxV[index] = Math.max(...this.children.map(node => node.maxV[index]));
            this.sum[index] = this.children.reduce((s, node) => s + node.sum[index], 0);
        }
        this.count = this.children.reduce((acc, node) => acc + node.count, 0);
    }

    /**
     * Updates aggregated statistics for this node to include a newly added child node.
     * 
     * @param {PointNode} newChild - The new child node whose statistics will be merged into this node.
     */
    private IncrementStatsForNewChild(newChild: PointNode): void {
        // Update the time range
        this.minT = Math.min(this.minT, newChild.minT);
        this.maxT = Math.max(this.maxT, newChild.maxT);

        // Update value ranges and sums
        for (let i = 0; i < this.dim - 1; i++) {
            this.minV[i] = Math.min(this.minV[i], newChild.minV[i]);
            this.maxV[i] = Math.max(this.maxV[i], newChild.maxV[i]);
            this.sum[i] += newChild.sum[i];
        }

        this.count += newChild.count;
    }

    /**
     * Updates aggregated statistics for this node to include a newly added point.
     * 
     * @param {number[]} newPt - The new point
     */
    private IncrementStatsForNewPoint(newPt: number[]): void {
        // Initialize stats if it's NaN
        if (isNaN(this.count)) this.count = 0;
        if (isNaN(this.minT)) this.minT = newPt[0];
        if (isNaN(this.maxT)) this.maxT = newPt[0];

        this.count += 1;
        this.minT = Math.min(this.minT, newPt[0]);
        this.maxT = Math.max(this.maxT, newPt[0]);

        for (let i = 0; i < this.dim - 1; i++) {
            // Initialize stats if they are NaN
            if (isNaN(this.sum[i])) this.sum[i] = 0;
            if (isNaN(this.minV[i])) this.minV[i] = newPt[i + 1];
            if (isNaN(this.maxV[i])) this.maxV[i] = newPt[i + 1];

            const val = newPt[i + 1];

            // Update 'minV[i]', 'maxV[i]', and 'sum[i]' based on the condition
            if (this.points !== null && this.points.length === 1) {
                this.minV[i] = val;
                this.maxV[i] = val;
                this.sum[i] += val;
            } else {
                this.minV[i] = Math.min(this.minV[i], val);
                this.maxV[i] = Math.max(this.maxV[i], val);
                this.sum[i] += val;
            }
        }
    }

    /**
     * Retrieves data points within a specified time range.
     * @param Tstart Start time of the timerange to be looked at.
     * @param Tend End time of the timerange to be looked at.
     * @param IncludeEdges Optional parameter to include edge points.
     * @returns An array of points within the specified time range.
     */
    public GetData(Tstart: number, Tend: number, IncludeEdges?: boolean): number[][] {
        if (this.points != null && Tstart <= this.minT && Tend >= this.maxT)
            return this.points;
        if (this.points != null && IncludeEdges !== undefined && IncludeEdges)
            return this.points.filter((pt, i) => (pt[0] >= Tstart && pt[0] <= Tend) ||
                i < ((this.points?.length ?? 0) - 1) && (this.points != null ? this.points[i + 1][0] : 0) >= Tstart ||
                i > 0 && (this.points != null ? this.points[i - 1][0] : 0) <= Tend);
        if (this.points != null)
            return this.points.filter(pt => pt[0] >= Tstart && pt[0] <= Tend);
        const result: number[][] = [];
        return result.concat(...this.children!.filter(node =>
            (node.minT <= Tstart && node.maxT > Tstart) ||
            (node.maxT >= Tend && node.minT < Tend) ||
            (node.minT >= Tstart && node.maxT <= Tend)
        ).map(node => node.GetData(Tstart, Tend, IncludeEdges)));
    }

    /**
     * Retrieves all data points stored in the PointNode tree.
     * @returns An array of all points in the tre.
     */
    public GetFullData(): number[][] {
        return this.GetData(this.minT, this.maxT);
    }

    /**
     * Retrieves the count of data points within a specified time range.
     * @param Tstart Start time of the timerange to be looked at.
     * @param Tend End time of the timerange to be looked at.
     * @returns The number of points within the specified time range.
     */
    public GetCount(Tstart: number, Tend: number): number {
        // Case 1: Leaf Node with points
        if (this.points !== null) {
            // Entire node is within the range
            if (Tstart <= this.minT && Tend >= this.maxT)
                return this.count;

            // Standard range filtering
            return this.points.reduce((acc, pt) => acc + (pt[0] >= Tstart && pt[0] <= Tend ? 1 : 0), 0)
        }

        // Case 2: Internal Node with children
        if (this.children !== null)
            return this.children.reduce((acc, node) => acc + (node.minT <= Tend && node.maxT >= Tstart ? node.GetCount(Tstart, Tend) : 0), 0);

        // Case 3: No points or children match
        return 0;
    }

    /**
     * Get Limits for all dimensions
     * @param Tstart start time of the timerange to be looked at
     * @param Tend end time of the timerange to be looked at
     * @returns The min and max value of the data in the given timerange
     */
    public GetAllLimits(Tstart: number, Tend: number): [number, number][] {
        const result: [number, number][] = Array(this.dim - 1);
        for (let index = 0; index < this.dim - 1; index++)
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
    public GetLimits(Tstart: number, Tend: number, dimension?: number): [number, number] {
        const currentIndex = dimension ?? 0;
        let max = this.maxV[currentIndex];
        let min = this.minV[currentIndex];

        if (this.points == null && !(Tstart <= this.minT && Tend > this.maxT)) {
            // Array represents all limits o nodes
            const limits = this.children!.filter(n => n.maxT > Tstart && n.minT < Tend).map(n => n.GetLimits(Tstart, Tend, currentIndex));
            min = Math.min(...limits.map(pt => pt[0]));
            max = Math.max(...limits.map(pt => pt[1]));
        }
        if (this.points != null && !(Tstart <= this.minT && Tend > this.maxT)) {
            // Array represents all numbers within this node that fall in range
            const limits = this.points!.filter(pt => pt[0] > Tstart && pt[0] < Tend).map(pt => pt[currentIndex + 1]);
            min = Math.min(...limits);
            max = Math.max(...limits);
        }

        return [min, max];
    }

    /**
     * Retrieves a point from the PointNode tree
     * @param {number} tVal - The time value of the point to retrieve from the tree.
     */
    public GetPoint(tVal: number): number[] {
        return this.PointBinarySearch(tVal, 1)[0];
    }

    /**
     * Retrieves a specified number of points from the PointNode tree, centered around a point
     * @param {number} tVal - The time value of the center point of the point retrieval.
     * @param {number} pointsRetrieved - The number of points to retrieve
     */
    public GetPoints(tVal: number, pointsRetrieved = 1): number[][] {
        return this.PointBinarySearch(tVal, pointsRetrieved);
    }

    /**
     * Implements a binary search to locate points within the PointNode tree or across neighboring nodes based on the timestamp.
     * @param tVal The time value to search for.
     * @param pointsRetrieved The number of points to retrieve.
     * @param nodeLowerNeighbor Optional lower neighboring node for spillover.
     * @param nodeUpperNeighbor Optional upper neighboring node for spillover.
     * @returns An array of points matching the search criteria.
     */
    private PointBinarySearch(tVal: number, pointsRetrieved = 1, nodeLowerNeighbor?: PointNode, nodeUpperNeighbor?: PointNode): number[][] {
        if (pointsRetrieved <= 0) throw new RangeError(`Requested number of points must be positive value.`);
        // round tVal back to whole integer 

        if (this.points !== null) {
            if (this.points.length === 0) return [[NaN]] //points should only ever be empty when an empty array is passed into constructor

            // if the tVal is less than the minimum value of the subsection, return the first point
            if (tVal < this.minT) {
                const spillOver = pointsRetrieved - this.points.length;
                const spillOverPoints = (spillOver > 0 && nodeUpperNeighbor !== undefined) ? nodeUpperNeighbor.PointBinarySearch(tVal, spillOver, this, undefined) : [];
                return this.points.slice(0, pointsRetrieved).concat(spillOverPoints);
            }

            // if the tVal is greater than the largest value of the subsection, return the last point
            if (tVal > this.maxT) {
                const spillOver = pointsRetrieved - this.points.length;
                const spillOverPoints = (spillOver > 0 && nodeLowerNeighbor !== undefined) ? nodeLowerNeighbor.PointBinarySearch(tVal, spillOver, undefined, this) : [];
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
            const upperNeighborPoints = (upperSpillOver > 0 && nodeUpperNeighbor !== undefined) ? nodeUpperNeighbor.PointBinarySearch(tVal, upperSpillOver, this, undefined) : [];
            const lowerSpillOver = lowerPoints - centerIndex;
            const lowerNeighborPoints = (lowerSpillOver > 0 && nodeLowerNeighbor !== undefined) ? nodeLowerNeighbor.PointBinarySearch(tVal, lowerSpillOver, undefined, this) : [];

            return lowerNeighborPoints.concat(this.points.slice(Math.max(centerIndex - lowerPoints, 0), Math.min(centerIndex + upperPoints + 1, this.points.length))).concat(upperNeighborPoints);

        }
        else if (this.children !== null) {
            let childIndex = -1;
            // if the subsection is null, and the tVal is less than the minimum value of the subsection, ??Start over again looking for the point in the first subsection??
            if (tVal < this.minT)
                childIndex = 0;
            else if (tVal > this.maxT)
                childIndex = this.children.length - 1;
            else {
                childIndex = this.children.findIndex(n => n.maxT >= tVal);

                if (childIndex > 0 && this.children[childIndex].minT > tVal) {
                    const currentChildMinT = this.children[childIndex].minT;
                    const previousChildMaxT = this.children[childIndex - 1].maxT;

                    if (Math.abs(tVal - previousChildMaxT) < Math.abs(tVal - currentChildMinT))
                        childIndex--;

                }
            }

            if (childIndex === -1) throw new RangeError(`Could not find child node with point that has a time value of ${tVal}`);

            // Find neighbors
            const upperNeighbor = childIndex !== this.children.length - 1 ? this.children[childIndex + 1] : undefined;
            const lowerNeighbor = childIndex !== 0 ? this.children[childIndex - 1] : undefined;
            return this.children[childIndex].PointBinarySearch(tVal, pointsRetrieved, lowerNeighbor, upperNeighbor);
        }
        else throw new RangeError(`Both children and points are null for PointNode, unable to find point with time value of ${tVal}`);
    }

    /**
    * Returns the size of the Tree below this PointNode
    */
    public GetTreeSize(): number {
        if (this.children == null) return 1;
        return 1 + Math.max(...this.children.map((node) => node.GetTreeSize()));
    }

}