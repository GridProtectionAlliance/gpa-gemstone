import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { GraphContext, IGraphContext } from '../GraphContext';
import HorizontalBar from '../HorizontalBar';
import Plot from '../Plot';

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
    const { container } = render(<BarHarness><HorizontalBar Value={5} BarOrigin={2} BarHeight={1} Color="blue" /></BarHarness>);

    expect(rectOf(container)).toEqual([0, 75, 50, 10]);
});

test('HorizontalBar with a negative value extends left of the start', () => {
    const { container } = render(<BarHarness><HorizontalBar Value={-3} BarStart={1} BarOrigin={4} BarHeight={0.5} Color="red" /></BarHarness>);

    expect(rectOf(container)).toEqual([-30, 57.5, 40, 5]);
});

test('HorizontalBar places BarOrigin at the bottom or top of the bar', () => {
    const bottom = render(<BarHarness><HorizontalBar Value={5} BarOrigin={2} BarHeight={1} YBarOrigin="bottom" Color="blue" /></BarHarness>);
    expect(rectOf(bottom.container)).toEqual([0, 70, 50, 10]);

    const top = render(<BarHarness><HorizontalBar Value={5} BarOrigin={2} BarHeight={1} YBarOrigin="top" Color="blue" /></BarHarness>);
    expect(rectOf(top.container)).toEqual([0, 80, 50, 10]);
});

test('HorizontalBar uses the Bar style defaults and overrides', () => {
    const plain = render(<BarHarness><HorizontalBar Value={5} BarOrigin={2} BarHeight={1} Color="blue" /></BarHarness>);
    const plainRect = plain.container.querySelector('rect')!;
    expect([plainRect.getAttribute('fill'), plainRect.getAttribute('opacity'), plainRect.getAttribute('stroke')]).toEqual(['blue', '0.5', 'black']);

    const hatched = render(<BarHarness><HorizontalBar Value={5} BarOrigin={2} BarHeight={1} Color="blue" BarStyle={{ Fill: 'Hatched', Opacity: 1 }} /></BarHarness>);
    const hatchedRect = hatched.container.querySelector('rect')!;
    expect(hatched.container.querySelector('pattern#bar-id_hatch')).not.toBeNull();
    expect([hatchedRect.getAttribute('fill'), hatchedRect.getAttribute('opacity')]).toEqual(['url(#bar-id_hatch)', '1']);
});

test('HorizontalBar is hidden when disabled', () => {
    const { container } = render(<BarHarness><HorizontalBar Value={5} BarOrigin={2} BarHeight={1} Color="blue" Enabled={false} /></BarHarness>);

    expect(container.querySelector('rect')).toBeNull();
});

test('HorizontalBar in a Plot with snapMouse handles mouse moves', () => {
    // jsdom has no SVG geometry, so map every mouse position to the origin
    const point = { x: 0, y: 0, matrixTransform: () => point };
    Object.defineProperty(SVGSVGElement.prototype, 'createSVGPoint', { configurable: true, value: () => point });
    Object.defineProperty(SVGSVGElement.prototype, 'getScreenCTM', { configurable: true, value: () => ({ inverse: () => ({}) }) });
    const frame = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => { callback(0); return 0; });
    const errors: unknown[] = [];
    const onError = (event: ErrorEvent) => { errors.push(event.error); event.preventDefault(); };
    window.addEventListener('error', onError);

    const { container } = render(<Plot defaultTdomain={[0, 10]} height={300} width={500} yDomain="AutoValue" legend="hidden" snapMouse={true}>
        <HorizontalBar Value={5} BarOrigin={1} BarHeight={1} Color="blue" />
    </Plot>);
    fireEvent.mouseMove(container.querySelector('svg')!.parentElement!, { clientX: 100, clientY: 100 });

    window.removeEventListener('error', onError);
    frame.mockRestore();
    expect(errors).toEqual([]);
});

test('Plot shows per-axis Yticks on the right axis of a HorizontalBar', async () => {
    render(<Plot defaultTdomain={[0, 10]} height={300} width={500} yDomain="AutoValue" legend="hidden"
        Yticks={[undefined, [{ Value: 1, Label: 'Right category' }]]}>
        <HorizontalBar Value={5} BarOrigin={1} BarHeight={1} Color="blue" Axis="right" />
    </Plot>);

    expect(await screen.findByText('Right category')).toBeTruthy();
});
