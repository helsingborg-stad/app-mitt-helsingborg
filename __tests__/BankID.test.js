import { validatePin, sanitizePin } from "../source/helpers/ValidationHelper";

test('Test string', () => {
    expect(validatePin('This is not OK!')).toBe(false);
});

test('Test less then 12 numbers', () => {
    expect(validatePin('123')).toBe(false);
});

test('Test 12 numbers', () => {
    expect(validatePin('123456789123')).toBe(true);
});

test('Sanitize year 18', () => {
    expect(sanitizePin('18')).toBe('2018');
});

test('Sanitize year 19', () => {
    expect(sanitizePin('19')).toBe('19');
});

test('Sanitize year 20', () => {
    expect(sanitizePin('20')).toBe('20');
});

test('Sanitize year 21', () => {
    expect(sanitizePin('21')).toBe('1921');
});
