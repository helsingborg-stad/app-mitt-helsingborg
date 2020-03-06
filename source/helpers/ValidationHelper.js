/**
 * Checks if a string is a valid personal identity number
 * @param {string} pin Personal identity number
 * @return {boolean} Return true if PIN is valid, else return false
 */
export const validatePin = pin => {
  const pinRegex = /^[0-9]{12}$/;

  return pinRegex.test(pin);
};

/**
 * Sanitizes and prefixes personal identity number with century
 * @param {string} pin Personal identity number
 * @return {string} Personal identity number
 */
export const sanitizePin = pin => {
  // Remove non digits
  let sanitizedPin = pin.replace(/\D/g, '');
  const pinInt = parseInt(sanitizedPin);

  sanitizedPin =
    sanitizedPin.length === 2 && pinInt > 19 && pinInt !== 20 ? `19${sanitizedPin}` : sanitizedPin;

  sanitizedPin = sanitizedPin.length === 2 && pinInt < 19 ? `20${sanitizedPin}` : sanitizedPin;

  return sanitizedPin;
};
