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
//  06/12/2024 - Collins Self
//       Generated original version of source code.
//
//******************************************************************************************************

import React from 'react'

interface IProps {
    rowsPerPage: number
    colMax?: number
}

interface IRow {
    start: number,
    numOfCols: number
}

const LayoutGrid: React.FC<React.PropsWithChildren<IProps>> = (props) => {
    const [rows, setRows] = React.useState<IRow[]>([]);
    const totalNumOfItems = React.Children.count(props.children);

    React.useEffect(() => { // Adds rows to array of IRow's
        const rowsOnGrid: IRow[] = [];
        const lowestSquare = Math.floor(Math.sqrt(totalNumOfItems));
        let numOfRows = lowestSquare; // Default values assumes a perfect square grid
        let rowsNeedingExtraItems = totalNumOfItems - lowestSquare**2; // Adds these overflow items to beginning rows 1:1
        
        if(props.colMax !== undefined && props.colMax <= lowestSquare) {
            rowsNeedingExtraItems = 0;
            const itemsInRow = props.colMax;
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
            const row = { start: totalNumOfItems - numOfItemsRemaining, numOfCols: itemsInRow };
            numOfItemsRemaining -= itemsInRow;
            rowsOnGrid.push(row);
        }
        for(let i = 0; i < numOfRows - rowsNeedingExtraItems && numOfItemsRemaining >= 0; ++i) {
            const itemsInRow = lowestSquare === props.colMax ? lowestSquare : lowestSquare;
            const row = { start: totalNumOfItems - numOfItemsRemaining, numOfCols: Math.min(numOfItemsRemaining, itemsInRow) };
            numOfItemsRemaining -= itemsInRow;
            rowsOnGrid.push(row);
        }
        setRows(rowsOnGrid);
    }, [totalNumOfItems]);

    function generateColumns(currentRow: IRow) {
        const ItemDivs: JSX.Element[] = [];
        for(let i = 0; i < currentRow.numOfCols; ++i) {
            const padding = i === 0 ? 'pl-3 pr-3' : 'pr-3 pl-0';
            ItemDivs.push(
                <div className={'col ' + padding} style={{ height:'100%', width: `${100 / currentRow.numOfCols}%` }}>
                    { React.Children.toArray(props.children)[currentRow.start + i] }
                </div>)
        }
        return ItemDivs;
    }

    return ( 
            <div className='container-fluid p-0 h-100' style={{ overflowY: 'auto' }}>
                {rows.map((row) => (
                    <div className='row pb-3 m-0' style={{ height: `${100 / Math.min(rows.length, props.rowsPerPage)}%` }}>
                        { generateColumns(row) }
                    </div>
                ))}
            </div>
        );
}

export default LayoutGrid;