//******************************************************************************************************
//  LayoutGrid.tsx - Gbtc
//
//  Copyright (c) 2020, Grid Protection Alliance.  All Rights Reserved.
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
//  License for the specific language `governing permissions and limitations.
//
//  Code Modification History:
//  ----------------------------------------------------------------------------------------------------
//  06/10/2024 - Collins Self
//       Generated original version of source code.
//
//******************************************************************************************************

import React from 'react'

interface IProps {
     /**
     * Maximum rows to display without scrolling
     */
    RowsPerPage: number
    /**
     * Optional maximum number of columns per row
     */
    ColMax?: number
}

interface IRow {
   /**
    * Number used to track the index of data to start at when displaying this row
    */
    StartIndex: number,
    /**
    * Number of columns in row
    */
    NumOfCols: number
}

const LayoutGrid = (props: React.PropsWithChildren<IProps>) => {
    const [rows, setRows] = React.useState<IRow[]>([]);
    const totalNumOfItems = React.Children.count(props.children);

    React.useEffect(() => { // Adds rows to array of IRow's
        const rowsOnGrid: IRow[] = [];
        const lowestSquare = Math.floor(Math.sqrt(totalNumOfItems));
        let numOfRows = lowestSquare; // Default values assumes a perfect square grid
        let rowsNeedingExtraItems = totalNumOfItems - lowestSquare**2; // Will add these overflow items to beginning rows 1:1

        if(props.ColMax !== undefined && props.ColMax <= lowestSquare) {
            rowsNeedingExtraItems = 0;
            const itemsInRow = props.ColMax;
            numOfRows = Math.ceil(totalNumOfItems / itemsInRow);
        }
    // Checks if items would overfill the perfect square grid plus another row, then adds that row if needed
        if(totalNumOfItems >= lowestSquare**2 + lowestSquare) {
            rowsNeedingExtraItems -= lowestSquare; // "extra" items taken from final cols
            numOfRows = lowestSquare + 1; // moving "extras" to another row
        }

        // Create rows, balanced with extra items
        let numOfItemsRemaining = totalNumOfItems;
        for(let i = 0; i < rowsNeedingExtraItems && numOfItemsRemaining >= 0; ++i) {
            const itemsInRow = lowestSquare + 1; // adding "extras" to another col
            const row = { StartIndex: totalNumOfItems - numOfItemsRemaining, NumOfCols: itemsInRow };
            numOfItemsRemaining -= itemsInRow;
            rowsOnGrid.push(row); // push a row onto array with appropriate number of items
        }
        for(let i = 0; i < numOfRows - rowsNeedingExtraItems && numOfItemsRemaining >= 0; ++i) {
            const itemsInRow = lowestSquare === props.ColMax ? props.ColMax : lowestSquare;
            const row = { StartIndex: totalNumOfItems - numOfItemsRemaining, NumOfCols: Math.min(numOfItemsRemaining, itemsInRow) };
            numOfItemsRemaining -= itemsInRow;
            rowsOnGrid.push(row); // push a row onto array with appropriate number of items
        }
        setRows(rowsOnGrid);
    }, [totalNumOfItems, props.ColMax]);

    function generateColumns(currentRow: IRow) {
        const ItemDivs: JSX.Element[] = [];
        for(let i = 0; i < currentRow.NumOfCols; ++i) {
            const padding = i === 0 ? 'pl-1 pr-1' : 'pr-1 pl-0';
            const ItemDiv =
                <div key={i} className={'col ' + padding} style={{ height:'100%', width: `${100 / currentRow.NumOfCols}%` }}>
                    { React.Children.toArray(props.children)[currentRow.StartIndex + i] }
                </div>
            ItemDivs.push(ItemDiv);
        }
        return ItemDivs;
    }

    return (
        <div className='container-fluid p-0 h-100' style={{ overflowY: 'auto' }}>
            {rows.map((row, i) => (
                <div key={i} className='row pb-1 m-0' style={{ height: `${100 / Math.min(rows.length, props.RowsPerPage)}%` }}>
                    { generateColumns(row) }
                </div>
            ))}
        </div>
    );
}

export default LayoutGrid;