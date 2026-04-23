import * as React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchableSelect, { IProps } from '../SearchableSelect';
import { Gemstone } from '@gpa-gemstone/application-typings';

// Helper to create a controllable abortable promise
function createAbortablePromise<T>(resolveValue: T): Gemstone.TSX.Interfaces.AbortablePromise<T> {
    let resolveFn: (value: T) => void;
    const promise = new Promise<T>((resolve) => {
        resolveFn = resolve;
    }) as Gemstone.TSX.Interfaces.AbortablePromise<T>;
    promise.abort = jest.fn();

    // Auto-resolve on next tick so tests don't hang
    Promise.resolve().then(() => resolveFn(resolveValue));
    return promise;
}

interface ITestRecord {
    ID: number;
    Name: string;
}

const defaultRecord: ITestRecord = { ID: 1, Name: 'Test' };

function renderSearchableSelect(overrides: Partial<IProps<ITestRecord>> = {}) {
    const defaultProps: IProps<ITestRecord> = {
        Record: defaultRecord,
        Field: 'ID',
        Label: 'Test Select',
        Setter: jest.fn(),
        Search: jest.fn(() => createAbortablePromise([])),
        ...overrides,
    };

    return render(<SearchableSelect {...defaultProps} />);
}

// StylableSelect renders options as table rows in a portal, so query the whole document body for matching text.

describe('SearchableSelect', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('No results found', () => {
        it('shows "No results found" when search returns empty and AllowCustom is false', async () => {
            const searchFn = jest.fn(() => createAbortablePromise([]));

            renderSearchableSelect({
                Search: searchFn,
                AllowCustom: false,
                Record: { ID: 0, Name: '' },
                Field: 'ID',
            });

            // Trigger the debounced search
            await act(async () => {
                jest.advanceTimersByTime(500);
            });

            await waitFor(() => {
                expect(screen.getByText('No results found')).toBeInTheDocument();
            });
        });

        it('shows "No results found" when search returns empty and AllowCustom is true', async () => {
            const searchFn = jest.fn(() => createAbortablePromise([]));

            renderSearchableSelect({
                Search: searchFn,
                AllowCustom: true,
                Record: { ID: 0, Name: '' },
                Field: 'ID',
            });

            await act(async () => {
                jest.advanceTimersByTime(500);
            });

            await waitFor(() => {
                expect(screen.getByText('No results found')).toBeInTheDocument();
            });
        });

        it('does not show "No results found" when search returns results', async () => {
            const searchFn = jest.fn(() =>
                createAbortablePromise([{ Label: 'Option A', Value: 10 }])
            );

            renderSearchableSelect({
                Search: searchFn,
                AllowCustom: false,
                Record: { ID: 0, Name: '' },
                Field: 'ID',
            });

            await act(async () => {
                jest.advanceTimersByTime(500);
            });

            await waitFor(() => {
                expect(screen.getByText('Option A')).toBeInTheDocument();
            });

            expect(screen.queryByText('No results found')).not.toBeInTheDocument();
        });
    });

    describe('Fallback option for current value', () => {
        it('shows fallback with resolved label when current value is not in search results and GetLabel is provided', async () => {
            const searchFn = jest.fn(() =>
                createAbortablePromise([{ Label: 'Other Option', Value: 99 }])
            );
            const getLabelFn = jest.fn(() => createAbortablePromise('Resolved Label'));

            renderSearchableSelect({
                Search: searchFn,
                GetLabel: getLabelFn,
                Record: { ID: 42, Name: 'Test' },
                Field: 'ID',
            });

            await act(async () => {
                jest.advanceTimersByTime(500);
            });

            await waitFor(() => {
                expect(screen.getByText('Resolved Label')).toBeInTheDocument();
            });
        });

        it('shows fallback with raw value when current value is not in search results and GetLabel is not provided', async () => {
            const searchFn = jest.fn(() =>
                createAbortablePromise([{ Label: 'Other Option', Value: 99 }])
            );

            renderSearchableSelect({
                Search: searchFn,
                Record: { ID: 42, Name: 'Test' },
                Field: 'ID',
            });

            await act(async () => {
                jest.advanceTimersByTime(500);
            });

            await waitFor(() => {
                expect(screen.getByText('42')).toBeInTheDocument();
            });
        });

        it('does not show fallback when current value is in search results', async () => {
            const searchFn = jest.fn(() =>
                createAbortablePromise([
                    { Label: 'Current Option', Value: 1 },
                    { Label: 'Other Option', Value: 2 },
                ])
            );

            renderSearchableSelect({
                Search: searchFn,
                Record: { ID: 1, Name: 'Test' },
                Field: 'ID',
            });

            await act(async () => {
                jest.advanceTimersByTime(500);
            });

            await waitFor(() => {
                expect(screen.getByText('Current Option')).toBeInTheDocument();
            });

            // The raw value '1' should not appear as a separate fallback element
            const allText = document.body.textContent || '';
            const currentOptionCount = (allText.match(/Current Option/g) || []).length;
            expect(currentOptionCount).toBe(1);
        });

        it('does not show fallback when current value is null', async () => {
            const searchFn = jest.fn(() =>
                createAbortablePromise([{ Label: 'Option A', Value: 10 }])
            );

            renderSearchableSelect({
                Search: searchFn,
                Record: { ID: null as any, Name: 'Test' },
                Field: 'ID',
            });

            await act(async () => {
                jest.advanceTimersByTime(500);
            });

            await waitFor(() => {
                expect(screen.getByText('Option A')).toBeInTheDocument();
            });
        });
    });

    describe('Search input clearing on focus', () => {
        it('clears search text when input is clicked', async () => {
            const searchFn = jest.fn(() => createAbortablePromise([]));

            renderSearchableSelect({
                Search: searchFn,
                Record: { ID: 1, Name: 'Test' },
                Field: 'ID',
            });

            await act(async () => {
                jest.advanceTimersByTime(500);
            });

            const input = screen.getByRole('textbox');

            // Input should have some value initially
            expect(input).toHaveValue('1');

            // Click the input to simulate focus
            await act(async () => {
                fireEvent.mouseDown(input);
            });

            expect(input).toHaveValue('');
        });
    });

    describe('Search input space handling', () => {
        it('should not reset search text when a space is typed', async () => {
            const searchFn = jest.fn(() => createAbortablePromise([]));

            renderSearchableSelect({
                Search: searchFn,
                Record: { ID: 1, Name: 'Test' },
                Field: 'ID',
            });

            await act(async () => {
                jest.advanceTimersByTime(500);
            });

            const input = screen.getByRole('textbox');

            // Clear initial value
            await act(async () => {
                fireEvent.click(input);
            });

            // Type a search query
            await act(async () => {
                fireEvent.change(input, { target: { value: 'Option' } });
            });

            expect(input).toHaveValue('Option');

            // Add a space - this shoudnt reset the value
            await act(async () => {
                fireEvent.change(input, { target: { value: 'Option A' } });
            });

            expect(input).toHaveValue('Option A');
        });
    });
});