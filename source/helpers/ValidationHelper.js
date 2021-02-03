import validator from 'validator';

/**
 * Checks if a string is a valid personal identity number
 * @param {string} pin Personal identity number
 * @return {boolean} Return true if PIN is valid, else return false
 */
export const validatePin = (pin) => {
  const pinRegex = /^[0-9]{12}$/;

  return pinRegex.test(pin);
};

/**
 * Sanitizes and prefixes personal identity number with century
 * @param {string} pin Personal identity number
 * @return {string} Personal identity number
 */
export const sanitizePin = (pin) => {
  // Remove non digits
  let sanitizedPin = pin.replace(/\D/g, '');
  const pinInt = parseInt(sanitizedPin);

  sanitizedPin =
    sanitizedPin.length === 2 && pinInt > 19 && pinInt !== 20 ? `19${sanitizedPin}` : sanitizedPin;

  sanitizedPin = sanitizedPin.length === 2 && pinInt < 19 ? `20${sanitizedPin}` : sanitizedPin;

  return sanitizedPin;
};

/**
 * Use library validator.js to validate inputs.
 *
 * @param value {string} Value to validate.
 * @param rules Array of rules to validate input against.
 * @returns {*} Array with to elements. First element is the validation result, true or false. Second element is a string error message if validation fails.
 */
export const validateInput = (value, rules) =>
  rules.reduce(
    (acc, rule) => {
      const [valid] = acc;
      let valueArray = acc;

      /**
       * Validator only accepts strings.
       */
      let valueToValidate = String(value);
      /**
       * If the value comes from a checkbox or select input, we want the following values to count as empty, so that the isEmpty rule can be applied correctly.
       */
      if (value === false || value === undefined || value === null) {
        valueToValidate = '';
      }
      /**
       * Retrieve the validation method defined in the rule from the validator.js package and execute.
       * An array of args will be created if multiple args defined. Single arg will be passed as is.
       */
      const ruleArgs = rule.args || [];
      const validationMethodArgs = rule.arg || Object.keys(ruleArgs).map((key) => ruleArgs[key]);
      const validationMethod =
        typeof rule.method === 'string' ? validator[rule.method] : rule.method;
      const isValidationRuleMeet =
        validationMethod(valueToValidate, validationMethodArgs) === rule.validWhen;

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
