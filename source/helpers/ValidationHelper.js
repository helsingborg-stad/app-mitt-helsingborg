import validator from 'validator';

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

export const validateInput = (value, rules) =>
  rules.reduce(
    (acc, rule) => {
      const [valid] = acc;
      let valueArray = acc;

      /**
       * Validator only accepts strings.
       */
      const valueToValidate = String(value);

      /**
       * Retrive the validation method defined in the rule from the validator.js package and execute
       */
      const validationMethodArgs = rule.args || [];
      const arrayOfArgs = Object.keys(validationMethodArgs).map(key => validationMethodArgs[key]);
      const validationMethod =
        typeof rule.method === 'string' ? validator[rule.method] : rule.method;
      const isValidationRuleMeet =
        validationMethod(valueToValidate, arrayOfArgs) === rule.validWhen;

      /**
       * Only return true if the current and previous rule is met
       */
      if (valid === true && isValidationRuleMeet) {
        valueArray = [true, ''];
      }

      /**
       * Only change the  true if the current and previous rule is met
       */
      if (!isValidationRuleMeet) {
        valueArray = [false, rule.message];
      }
      return valueArray;
    },
    [true, '']
  );
