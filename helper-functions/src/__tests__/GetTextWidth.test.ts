/**
 * @jest-environment jsdom
 */
import { GetTextWidth } from '../index';
test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    expect(element).not.toBeNull();
});


test('GetTextWidth', () => {
    expect(GetTextWidth('arial;', '12px', 'Word')).toBeDefined();
});

/*
test('GetTextWidth = 50', () => {
    expect(GetTextWidth('arial;', '12px', 'Word')).toBe(50);
});
*/

test.each([
    '<img src="data:," onerror="alert(1)">',
    '<svg onload="alert(1)"></svg>',
    '<a href="javascript:alert(1)">link</a>',
    '<script>alert(1)</script>'
])('GetTextWidth removes executable markup before measuring %s', (payload) => {
    // Inspect the actual element at insertion; jsdom does not execute inline handlers.
    const appendChild = document.body.appendChild.bind(document.body);
    const initialChildCount = document.body.childElementCount;
    const spy = jest.spyOn(document.body, 'appendChild').mockImplementation(node => {
        const element = node as HTMLElement;
        expect(element.querySelector('script, svg, [onerror], [onload], [href^="javascript:"]')).toBeNull();
        expect(element.querySelector('strong')?.textContent).toBe('Safe & readable');
        return appendChild(node);
    });

    try {
        expect(GetTextWidth('Arial', '12px', '<strong>Safe &amp; readable</strong>' + payload)).toBeGreaterThanOrEqual(0);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(document.body.childElementCount).toBe(initialChildCount);
    } finally {
        spy.mockRestore();
    }
});
