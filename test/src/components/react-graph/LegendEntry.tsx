import * as React from "react";
import { Plot, LegendEntry, Line } from "@gpa-gemstone/react-graph";

export const LegendEntry_ID = `legend-entry-test-id`;
export const LegendEntry_Label = `Test Legend Entry`; //This is needed as a way to identify the component in testing

const LegendEntryTestComponent = () => {

    return (
        <div className="container-fluid h-100 p-0 d-flex flex-column">
            <div className="row h-100">
                <div className="col-12" id={LegendEntry_ID}>
                    <Plot
                        defaultTdomain={[0, 10]}
                        defaultYdomain={[0, 10]}
                        height={500}
                        width={500}
                        legend={'right'}
                    >
                        <LegendEntry
                            Label={LegendEntry_Label}
                            OnClick={() => {}}
                        />
                    </Plot>
                </div>
            </div>
        </div>
    )

}

export default LegendEntryTestComponent;