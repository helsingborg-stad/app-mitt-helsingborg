import { validatePno, sanitizePno } from "../source/helpers/ValidationHelper";

test('Test string', () => {
    expect(validatePno('This is not OK!')).toBe(false);
});

test('Test less then 12 numbers', () => {
    expect(validatePno('123')).toBe(false);
});

test('Test 12 numbers', () => {
    expect(validatePno('123456789123')).toBe(true);
});

test('Sanitize year 18', () => {
    expect(sanitizePno('18')).toBe('2018');
});

test('Sanitize year 19', () => {
    expect(sanitizePno('19')).toBe('19');
});

test('Sanitize year 20', () => {
    expect(sanitizePno('20')).toBe('20');
});

test('Sanitize year 21', () => {
    expect(sanitizePno('21')).toBe('1921');
});
