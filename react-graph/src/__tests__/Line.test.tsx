import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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
        <svg><Line
            color="red"
            data={data}
            enabled={props.enabled}
            legend="Test line"
            lineStyle="solid"
            setEnabled={props.setEnabled}
        /></svg>
        {legend}
    </GraphContext.Provider>;
};

test('Line legend remains internally controlled when enabled props are omitted', () => {
    const { container } = render(<LineHarness />);

    expect(container.querySelectorAll('svg path')).toHaveLength(1);
    fireEvent.click(screen.getByText('Test line'));
    expect(container.querySelectorAll('svg path')).toHaveLength(0);
});

test('Line ignores a controlled enabled value when setEnabled is omitted', () => {
    const { container } = render(<LineHarness enabled={false} />);

    expect(container.querySelectorAll('svg path')).toHaveLength(1);
    fireEvent.click(screen.getByText('Test line'));
    expect(container.querySelectorAll('svg path')).toHaveLength(0);
});

test('controlled Line reports regular and bulk legend commands', () => {
    const setEnabled = jest.fn();
    const { rerender } = render(<LineHarness enabled={true} setEnabled={setEnabled} />);

    fireEvent.click(screen.getByText('Test line'));
    expect(setEnabled.mock.calls[setEnabled.mock.calls.length - 1][0]).toBe(false);

    rerender(<LineHarness enabled={false} setEnabled={setEnabled}
        command={{ requester: '', command: 'enable-all' }} />);
    expect(setEnabled.mock.calls[setEnabled.mock.calls.length - 1][0]).toBe(true);

    rerender(<LineHarness enabled={true} setEnabled={setEnabled}
        command={{ requester: 'another-line', command: 'disable-others' }} />);
    expect(setEnabled.mock.calls[setEnabled.mock.calls.length - 1][0]).toBe(false);

    rerender(<LineHarness enabled={true} setEnabled={setEnabled}
        command={{ requester: 'line-id', command: 'disable-others' }} />);
    expect(setEnabled.mock.calls[setEnabled.mock.calls.length - 1][0]).toBe(true);
});
