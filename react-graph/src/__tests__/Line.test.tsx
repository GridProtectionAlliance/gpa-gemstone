import * as React from 'react';
import { act, create, ReactTestInstance, ReactTestRenderer } from 'react-test-renderer';
import DataLegend from '../DataLegend';
import { GraphContext, IGraphContext } from '../GraphContext';
import Line from '../Line';

const data: [number, number][] = [[0, 1], [1, 2]];

interface IHarnessProps {
    enabled?: boolean,
    setEnabled?: React.Dispatch<React.SetStateAction<boolean>>,
    command?: IGraphContext['MassEnableCommand']
}

const LineHarness = (props: IHarnessProps) => {
    const [legend, setLegend] = React.useState<React.ReactElement>();
    const baseContext = React.useContext(GraphContext);
    const context = React.useMemo(() => ({
        ...baseContext,
        AddData: () => 'line-id',
        SetLegend: (_: string, nextLegend?: React.ReactElement) => setLegend(nextLegend),
        MassEnableCommand: props.command ?? { requester: '', command: 'none' }
    } as IGraphContext), [props.command]);

    return <GraphContext.Provider value={context}>
        <Line
            color="red"
            data={data}
            enabled={props.enabled}
            legend="Test line"
            lineStyle="solid"
            setEnabled={props.setEnabled}
        />
        {legend}
    </GraphContext.Provider>;
};

const clickLegend = (renderer: ReactTestRenderer) => {
    const legend = renderer.root.findByType(DataLegend);
    const clickTarget = legend.findAll((node: ReactTestInstance) => typeof node.props.onClick === 'function')[0];
    act(() => clickTarget.props.onClick({ ctrlKey: false }));
};

test('Line legend remains internally controlled when enabled props are omitted', () => {
    let renderer!: ReactTestRenderer;
    act(() => { renderer = create(<LineHarness />); });

    expect(renderer.root.findAllByType('path')).toHaveLength(1);
    clickLegend(renderer);
    expect(renderer.root.findAllByType('path')).toHaveLength(0);
});

test('Line ignores a controlled enabled value when setEnabled is omitted', () => {
    let renderer!: ReactTestRenderer;
    act(() => { renderer = create(<LineHarness enabled={false} />); });

    expect(renderer.root.findAllByType('path')).toHaveLength(1);
    clickLegend(renderer);
    expect(renderer.root.findAllByType('path')).toHaveLength(0);
});

test('controlled Line reports regular and bulk legend commands', () => {
    const setEnabled = jest.fn();
    let renderer!: ReactTestRenderer;
    act(() => { renderer = create(<LineHarness enabled={true} setEnabled={setEnabled} />); });

    clickLegend(renderer);
    expect(setEnabled.mock.calls[setEnabled.mock.calls.length - 1][0]).toBe(false);

    act(() => renderer.update(<LineHarness enabled={false} setEnabled={setEnabled}
        command={{ requester: '', command: 'enable-all' }} />));
    expect(setEnabled.mock.calls[setEnabled.mock.calls.length - 1][0]).toBe(true);

    act(() => renderer.update(<LineHarness enabled={true} setEnabled={setEnabled}
        command={{ requester: 'another-line', command: 'disable-others' }} />));
    expect(setEnabled.mock.calls[setEnabled.mock.calls.length - 1][0]).toBe(false);

    act(() => renderer.update(<LineHarness enabled={true} setEnabled={setEnabled}
        command={{ requester: 'line-id', command: 'disable-others' }} />));
    expect(setEnabled.mock.calls[setEnabled.mock.calls.length - 1][0]).toBe(true);
});
