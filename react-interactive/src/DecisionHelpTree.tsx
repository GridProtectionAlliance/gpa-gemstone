 // ******************************************************************************************************
//  DecisionHelpTree.tsx - Gbtc
//
//  Copyright © 2025, Grid Protection Alliance.  All Rights Reserved.
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
//  08/06/2025 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

import { Gemstone } from '@gpa-gemstone/application-typings';
import React, { useState } from 'react';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';

interface IProps {
    /** The decision tree data */
    Data: Gemstone.TSX.Interfaces.IDecisionTreeData;
    /** Fallback UI in the case where a node isn't found*/
    FallbackHelp?: JSX.Element;
}

/**
 * A generic decision-tree walker.
 * Renders one node at a time and advances on button click.
 */
const DecisionHelpTree = (props: IProps) => {
    const [currentId, setCurrentId] = useState<string>(props.Data.RootId);
    const node = props.Data.Nodes[currentId];

    if (node == null)
        return props.FallbackHelp ?? <></>

    // If no options, treat as leaf/result node
    const isLeaf = node.Options == null || node.Options.length === 0;

    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
            <p className="mb-2">
                {node.Prompt}
            </p>

            <div className="mb-2">
                {isLeaf ?
                    <div className="d-flex flex-column align-items-center">
                        <div className="mb-2">
                            {node.Result}
                        </div>
                        <button className="btn" onClick={() => setCurrentId(props.Data.RootId)}>
                            <ReactIcons.Refresh />
                        </button>
                    </div>
                    :
                    (node.Options ?? []).map(opt => (
                        <button
                            key={opt.NextNodeKey}
                            className="btn btn-primary mr-2"
                            onClick={() => setCurrentId(opt.NextNodeKey)}
                        >
                            {opt.Label}
                        </button>
                    ))}
            </div>

        </div>
    );
};

export default DecisionHelpTree;

// --- Example Usage ---
//const Tree: Gemstone.TSX.Interfaces.IDecisionTreeData = {
//    RootId: 'isServerClockSyncedWithGps',
//    Nodes: {
//        // Decision: is local clock synced?
//        isServerClockSyncedWithGps: {
//            Prompt:
//                'Is your server clock (i.e., local system time) synchronized with a GPS clock?',
//            Options: [
//                { Label: 'Yes', NextNodeKey: 'result_true' },
//                { Label: 'No', NextNodeKey: 'result_false' }
//            ]
//        },
//
//        // True branch - Use local clock as real-time
//        result_true: {
//            Prompt: 'Result(LeadTime will be set to the tolerance of timestamps that arrive in the future compared to the local clock in seconds (can be sub-second))',
//            Result:
//                'UseLocalClockAsRealTime should be true.'
//        },
//
//        // False branch - Do not use local clock as real-time
//        result_false: {
//            Prompt: 'Result(As long as the timestamp reasonability check is being performed, LeadTime will be set to the confidence in accuracy of the local clock to GPS in seconds (can be sub-second).)',
//            Result:
//                'UseLocalClockAsRealTime should be false'
//        }
//    }
//};

// <DecisionTree Data={Tree} FallbackHelp={<>Help message</>} />