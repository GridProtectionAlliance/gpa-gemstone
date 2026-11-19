import * as React from 'react';
import { render } from '@testing-library/react';
import { GraphContext, IGraphContext } from '../GraphContext';
import YValueAxis, { IAxisTick } from '../YValueAxis';

// 10 pixels per unit; Y pixels grow downward from 100
const renderAxis = (customTicks: IAxisTick[], yDomain: [number, number]) => {
    const AxisHarness = () => {
        const baseContext = React.useContext(GraphContext);
        const context = React.useMemo(() => ({
            ...baseContext,
            YDomain: [yDomain],
            YTransformation: (y: number) => 100 - y * 10
        } as IGraphContext), []);

        return <GraphContext.Provider value={context}>
            <svg>
                <YValueAxis hAxis={0} hFactor={0} setHeightFactor={() => undefined} setWidthAxis={() => undefined}
                    offsetTop={0} offsetBottom={0} offsetLeft={50} offsetRight={0} height={100} width={200} useFactor={true}
                    customTicks={customTicks} />
            </svg>
        </GraphContext.Provider>;
    };

    const { container } = render(<AxisHarness />);
    return Array.from(container.querySelectorAll('text')).map(text => [text.textContent, Number(text.getAttribute('y'))]);
};

test('YValueAxis shows custom tick labels at their values', () => {
    const labels = renderAxis([{ Value: 2, Label: 'A1' }, { Value: 1, Label: 'A11' }, { Value: 0, Label: 'A12' }], [0, 10]);

    expect(labels).toEqual([['A1', 80], ['A11', 90], ['A12', 100]]);
});

test('YValueAxis leaves out custom ticks outside the visible domain', () => {
    const labels = renderAxis([{ Value: 0, Label: 'Below' }, { Value: 4, Label: 'Inside' }, { Value: 9, Label: 'Above' }], [3, 5]);

    expect(labels).toEqual([['Inside', 60]]);
});
