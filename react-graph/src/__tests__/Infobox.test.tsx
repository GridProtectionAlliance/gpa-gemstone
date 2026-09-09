import * as React from 'react';
import { render } from '@testing-library/react';
import { GraphContext, IGraphContext } from '../GraphContext';
import Infobox from '../Infobox';

beforeEach(() => {
    jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(60);
    jest.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(40);
});

afterEach(() => jest.restoreAllMocks());

/** Renders a measured infobox in a plot bounded by x=20..220 and y=10..110. */
const renderBox = (x: number, y: number, origin?: React.ComponentProps<typeof Infobox>['origin']) => {
    const context = {
        XDomain: [0, 200],
        YDomain: [[0, 100]],
        XTransformation: (value: number) => value + 20,
        YTransformation: (value: number) => 110 - value,
        RegisterSelect: () => 'box',
        UpdateSelect: () => undefined,
        RemoveSelect: () => undefined,
        CurrentMode: 'select',
        XHover: 0,
        YHover: [0],
        XHoverSnap: 0,
        YHoverSnap: [0]
    } as unknown as IGraphContext;
    const { container } = render(
        <svg><GraphContext.Provider value={context}>
            <Infobox
                x={x}
                y={y}
                origin={origin}
                offset={15}
                childId="info"
                disallowSnapping={true}
                setPosition={() => undefined}
            >
                <div id="info">Marker</div>
            </Infobox>
        </GraphContext.Provider></svg>
    );
    const box = container.querySelector('foreignObject')!;
    return { x: Number(box.getAttribute('x')), y: Number(box.getAttribute('y')) };
};

test.each([
    [100, 70, 90, 55],
    [100, 0, 90, 55],
    [0, 100, 35, 25],
    [200, 100, 145, 25],
    [0, 0, 35, 55],
    [200, 0, 145, 55],
    [100, 50, 90, 10]
])('auto positions anchor (%s, %s) inside the plot', (x, y, expectedX, expectedY) => {
    const box = renderBox(x, y, 'auto');
    expect([box.x, box.y]).toEqual([expectedX, expectedY]);
});

test.each([
    ['upper-center' as const, 90, 125],
    ['lower-center' as const, 90, 55]
])('preserves origin %s', (origin, x, y) => {
    const box = renderBox(100, 0, origin);
    expect([box.x, box.y]).toEqual([x, y]);
});

test('defaults an undefined origin to auto', () => {
    const box = renderBox(100, 0);
    expect([box.x, box.y]).toEqual([90, 55]);
});
