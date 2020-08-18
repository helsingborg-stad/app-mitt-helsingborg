import { increaseCount, decreaseCount } from 'app/helpers/Counter';

const initialCount = 6;

test('increaseCount', () => {
  const count = increaseCount(initialCount);
  expect(count).toBe(initialCount + 1);
});

test('increaseCount with max', () => {
  const count = increaseCount(initialCount, initialCount);
  expect(count).toBe(initialCount);
});

test('decreaseCount', () => {
  const count = decreaseCount(initialCount);
  expect(count).toBe(initialCount - 1);
});

test('decreaseCount with min', () => {
  const count = decreaseCount(initialCount, initialCount);
  expect(count).toBe(initialCount);
});
