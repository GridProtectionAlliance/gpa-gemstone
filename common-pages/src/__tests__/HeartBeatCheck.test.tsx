import * as React from 'react';
import { act, render } from '@testing-library/react';
import HeartBeatCheck from '../HeartBeatCheck';

jest.mock('@gpa-gemstone/react-interactive', () => ({
    LoadingIcon: () => null,
    Modal: () => null
}));

interface IDeferred {
    promise: PromiseLike<unknown> & { abort: jest.Mock },
    resolve: () => void,
    reject: () => void
}

const deferred = (): IDeferred => {
    let resolve = () => { /* */ };
    let reject = () => { /* */ };
    const promise = new Promise<unknown>((resolvePromise, rejectPromise) => {
        resolve = () => resolvePromise(undefined);
        reject = rejectPromise;
    }) as Promise<unknown> & { abort: jest.Mock };
    promise.abort = jest.fn();

    return { promise, resolve: () => resolve(), reject: () => reject() };
};

describe('HeartBeatCheck', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test.each([
        ['the default 10 seconds', undefined, 10000],
        ['the configured interval', 5000, 5000]
    ])('waits %s before retrying an in-flight heartbeat', async (_, retryIntervalMS, expectedIntervalMS) => {
        const first = deferred();
        const second = deferred();
        const heartBeat = jest.fn()
            .mockReturnValueOnce(first.promise)
            .mockReturnValueOnce(second.promise);

        const { unmount } = render(
            <HeartBeatCheck HeartBeat={heartBeat} IntervalMS={30000} RetryIntervalMS={retryIntervalMS} />
        );

        expect(heartBeat).toHaveBeenCalledTimes(1);
        act(() => jest.advanceTimersByTime(30000));
        expect(heartBeat).toHaveBeenCalledTimes(1);

        await act(async () => first.resolve());
        act(() => jest.advanceTimersByTime(expectedIntervalMS - 1));
        expect(heartBeat).toHaveBeenCalledTimes(1);
        act(() => jest.advanceTimersByTime(1));
        expect(heartBeat).toHaveBeenCalledTimes(2);

        unmount();
    });

    test('does not set state when cleanup aborts the heartbeat', async () => {
        const request = deferred();
        request.promise.abort.mockImplementation(request.reject);

        const { unmount } = render(
            <HeartBeatCheck HeartBeat={jest.fn().mockReturnValue(request.promise)} IntervalMS={30000} />
        );
        unmount();
        await act(async () => Promise.resolve());

        expect(request.promise.abort).toHaveBeenCalledTimes(1);
    });
});
