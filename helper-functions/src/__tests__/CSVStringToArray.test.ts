import { CsvStringToArray } from "../CSVStringToArray";

test('parse simple CSV', () => {
    const csv = 'a,b,c\n1,2,3\r\n4,5,6'
    const expected = [['a', 'b', 'c'], ['1', '2', '3'], ['4', '5', '6']]
    const output = CsvStringToArray(csv)
    expect(output).toEqual(expected);
})

test('parse single line CSV', () => {
    const csv = '1,2,3,4,5,6'
    const expected = [['1', '2', '3', '4', '5', '6']]
    const output = CsvStringToArray(csv)
    expect(output).toEqual(expected);
})

test('parse CSV with cells containing commas', () => {
    const csv = 'a,b,c,"a,b,c","1,2"'
    const expected = [['a', 'b', 'c', 'a,b,c', '1,2']]
    const output = CsvStringToArray(csv)
    expect(output).toEqual(expected);
})


test('parse CSV with escaped quotes', () => {
    const csv = 'Name,Description\r\n"John ""GPA"" Doe",GPA Dev\nJane Doe,GPA Dev'
    const expected = [['Name', 'Description'], ['John "GPA" Doe', 'GPA Dev'], ["Jane Doe", 'GPA Dev']]
    const output = CsvStringToArray(csv)
    expect(output).toEqual(expected);
})

test('parse CSV with newlines within quoted fields', () => {
    const csv = 'Name,Description\nJohn Doe","GPA\nDeveloper"\nJane Smith,"GPA\nDeveloper"';
    const expected = [
        ['Name', 'Description'],
        ['John Doe', 'GPA\nDeveloper'],
        ['Jane Smith', 'GPA\nDeveloper']
    ];
    const output = CsvStringToArray(csv)
    expect(output).toEqual(expected);}
);

test('parse CSV with empty fields', () => {
    const csv = 'a,b,c\r\na,,c\r\n,b,';
    const expected = [['a','b','c'], ['a', '', 'c'], ['', 'b', '']];
    const output = CsvStringToArray(csv)
    expect(output).toEqual(expected);
})