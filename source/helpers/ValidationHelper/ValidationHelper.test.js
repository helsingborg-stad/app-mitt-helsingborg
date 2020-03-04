import { validatePin, sanitizePin } from 'app/helpers/ValidationHelper/ValidationHelper';

test('validationPin: test valid pin', () => {
  const validPin = 201111111111;

  const validationPinResult = validatePin(validPin);
  expect(validationPinResult).toBe(true);
});

test('validationPin: test invalid pin', () => {
  const invalidPin = 1;

  const validationPinResult = validatePin(invalidPin);
  expect(validationPinResult).toBe(false);
});

test('sanitizePin: Remove dash', () => {
  const tenDigitPin = '20111111-1111';
  const expectedTwelvDigitPin = '201111111111';

  expect(sanitizePin(tenDigitPin)).toBe(expectedTwelvDigitPin);
});

test('sanitizePin: Prefix with 19', () => {
  const testPin = '21';
  const sanitizePinResult = '1921';

  expect(sanitizePin(testPin)).toBe(sanitizePinResult);
});

test('sanitizePin: Prefix with 20', () => {
  const testPin = '11';
  const sanitizePinResult = '2011';

  expect(sanitizePin(testPin)).toBe(sanitizePinResult);
});
