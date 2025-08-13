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
import * as React from 'react';

interface IProps {
    /** The decision tree data */
    Data: Gemstone.TSX.Interfaces.IDecisionTreeData;
    /** Fallback UI in the case where a node isn't found*/
    FallbackHelp?: JSX.Element;
    /** Optional Value to reset to root node when it changes */
    ResetToRoot?: any;
    /**Optional Func to call when a leaf node is reached */
    OnComplete?: (value: any) => void; //figure out how to type value,
}

/**
 * A generic decision-tree walker.
 * Renders one node at a time and advances on button click.
 */
const DecisionHelpTree = (props: IProps) => {
    const [currentId, setCurrentId] = React.useState<string>(props.Data.RootId);
    const node = props.Data.Nodes[currentId];

    //Effect to call OnComplete when leaf node is reached
    React.useEffect(() => {
        if (isLeaf(node) && props.OnComplete != null)
            props.OnComplete(node.RecommendedValue);
    }, [node])

    //Effect to reset to root node when prop changes
    React.useEffect(() => {
        setCurrentId(props.Data.RootId);
    }, [props.ResetToRoot])

    if (node == null)
        return props.FallbackHelp ?? <></>

    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
            {typeof node.Prompt === 'string' ?
                <p className="mb-2">
                    {node.Prompt}
                </p> : node.Prompt
            }

            {isLeaf(node) ? null
                :
                <div className="mb-2">
                    {(node.Options ?? []).map(opt => (
                        <button
                            key={opt.NextNodeKey}
                            className="btn btn-primary mr-2"
                            onClick={() => setCurrentId(opt.NextNodeKey)}
                        >
                            {opt.Label}
                        </button>
                    ))}
                </div>
            }
        </div>
    );
};

// If no options are present, this is a leaf node
const isLeaf = (node: Gemstone.TSX.Interfaces.IDecisionTreeNode) => {
    return node.Options == null || node.Options.length === 0;
}

export default DecisionHelpTree;