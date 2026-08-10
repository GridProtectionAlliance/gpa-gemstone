import * as React from 'react';
import HeartBeatCheck from '../HeartBeatCheck';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useEffect: jest.fn(),
    useState: jest.fn()
}));

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
    let effect: React.EffectCallback;
    let setShowError: jest.Mock;

    beforeEach(() => {
        jest.useFakeTimers();
        setShowError = jest.fn();
        (React.useState as jest.Mock).mockReturnValue([false, setShowError]);
        (React.useEffect as jest.Mock).mockImplementation((callback: React.EffectCallback) => {
            effect = callback;
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
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

        HeartBeatCheck({ HeartBeat: heartBeat, IntervalMS: 30000, RetryIntervalMS: retryIntervalMS });
        const cleanup = effect() as () => void;

        expect(heartBeat).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(30000);
        expect(heartBeat).toHaveBeenCalledTimes(1);

        first.resolve();
        await Promise.resolve();
        jest.advanceTimersByTime(expectedIntervalMS - 1);
        expect(heartBeat).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(1);
        expect(heartBeat).toHaveBeenCalledTimes(2);

        cleanup();
    });

    test('does not set state when cleanup aborts the heartbeat', async () => {
        const request = deferred();
        request.promise.abort.mockImplementation(request.reject);

        HeartBeatCheck({ HeartBeat: jest.fn().mockReturnValue(request.promise), IntervalMS: 30000 });
        const cleanup = effect() as () => void;
        cleanup();
        await Promise.resolve();

        expect(request.promise.abort).toHaveBeenCalledTimes(1);
        expect(setShowError).not.toHaveBeenCalled();
    });
});
