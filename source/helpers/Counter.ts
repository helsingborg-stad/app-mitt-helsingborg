export function increaseCount(number, max) {
  const next = number + 1;
  if (next > max) {
    return number;
  }

  return next;
}

export function decreaseCount(number, min) {
  const next = number - 1;
  if (next < min) {
    return number;
  }

  return next;
}
