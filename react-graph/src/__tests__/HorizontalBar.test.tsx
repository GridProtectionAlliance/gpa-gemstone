import * as React from 'react';
import { render } from '@testing-library/react';
import { GraphContext, IGraphContext } from '../GraphContext';
import HorizontalBar from '../HorizontalBar';
import YValueAxis from '../YValueAxis';

// 10 pixels per unit on both axes; Y pixels grow downward from 100
const BarHarness = (props: { children: React.ReactNode }) => {
    const baseContext = React.useContext(GraphContext);
    const context = React.useMemo(() => ({
        ...baseContext,
        AddData: () => 'bar-id',
        YDomain: [[0, 10]],
        XTransformation: (x: number) => x * 10,
        YTransformation: (y: number) => 100 - y * 10
    } as IGraphContext), []);

    return <GraphContext.Provider value={context}>
        <svg>{props.children}</svg>
    </GraphContext.Provider>;
};

const rectOf = (container: HTMLElement) => {
    const rect = container.querySelector('rect');
    expect(rect).not.toBeNull();
    return ['x', 'y', 'width', 'height'].map(name => Number(rect!.getAttribute(name)));
};

test('HorizontalBar spans from the start to the value across its band', () => {
    const { container } = render(<BarHarness><HorizontalBar Value={5} Position={2} BarHeight={1} Color="blue" /></BarHarness>);

    expect(rectOf(container)).toEqual([0, 75, 50, 10]);
});

test('HorizontalBar with a negative value extends left of the start', () => {
    const { container } = render(<BarHarness><HorizontalBar Value={-3} BarStart={1} Position={4} BarHeight={0.5} Color="red" /></BarHarness>);

    expect(rectOf(container)).toEqual([-30, 57.5, 40, 5]);
});

test('HorizontalBar is hidden when disabled', () => {
    const { container } = render(<BarHarness><HorizontalBar Value={5} Position={2} BarHeight={1} Color="blue" Enabled={false} /></BarHarness>);

    expect(container.querySelector('rect')).toBeNull();
});

test('YValueAxis shows custom tick labels at their values', () => {
    const { container } = render(<BarHarness>
        <YValueAxis hAxis={0} hFactor={0} setHeightFactor={() => undefined} setWidthAxis={() => undefined}
            offsetTop={0} offsetBottom={0} offsetLeft={50} offsetRight={0} height={100} width={200} useFactor={true}
            customTicks={[{ Value: 2, Label: 'A1' }, { Value: 1, Label: 'A11' }, { Value: 0, Label: 'A12' }]} />
    </BarHarness>);

    const labels = Array.from(container.querySelectorAll('text')).map(text => [text.textContent, Number(text.getAttribute('y'))]);
    expect(labels).toEqual([['A1', 80], ['A11', 90], ['A12', 100]]);
});
