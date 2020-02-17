/* eslint-disable eqeqeq */
/* eslint-disable no-param-reassign */
export const validatePin = pin => {
  const pinRegex = /^[0-9]{12}$/;
  return pinRegex.test(pin);
};

export const sanitizePin = pin => {
  // Remove non digits
  pin = pin.replace(/\D/g, '');
  // Automatically prefix personal number with century
  pin = pin.length === 2 && pin > 19 && pin != 20 ? 19 + pin : pin;
  pin = pin.length === 2 && pin < 19 ? 20 + pin : pin;

  return pin;
};
