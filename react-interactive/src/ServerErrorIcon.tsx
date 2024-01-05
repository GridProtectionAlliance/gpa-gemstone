// ******************************************************************************************************
//  ServerErrorIcon.tsx - Gbtc
//
//  Copyright © 2021, Grid Protection Alliance.  All Rights Reserved.
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
//  06/19/2021 - Christoph Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';

interface IProps {
    Show: boolean,
    Label?: string,
    Size?: number,
}

/**
 * Component for rendering the icon that appears during server error.
 * @param props renders and manages the details of the server error icon.
 * @returns a center aligned dark red server error icon.
 */
function ServerErrorIcon(props: IProps) {
	const h = (props.Size === undefined? 25 : props.Size);
	return <div>
          <div style={{ width: (props.Label === undefined? h : undefined), margin: 'auto', display: 'flex', alignItems: 'center' }} hidden={!props.Show}>
              <svg style={{fill: 'darkred', height: h}} viewBox={'0 0 20 20'}><path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path></svg>
              <div style={{ fontSize: `${h/2}px`}}>{props.Label !== undefined? props.Label : 'A Server Error Occurred. Please Reload the Application.'} </div> 
          </div>
      </div>
}


export default ServerErrorIcon;