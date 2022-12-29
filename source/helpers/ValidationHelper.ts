import validator from "validator";
/**
 * Checks if a string is a valid personal identity number
 * @param {string} pin Personal identity number
 * @return {boolean} Return true if PIN is valid, else return false
 */
export const validatePin = (pin: string): boolean => {
  const pinRegex = /^[0-9]{12}$/;

  return pinRegex.test(pin);
};

/**
 * Sanitizes and prefixes personal identity number with century
 * @param {string} pin Personal identity number
 * @return {string} Personal identity number
 */
export const sanitizePin = (pin: string): string => {
  // Remove non digits
  let sanitizedPin = pin.replace(/\D/g, "");
  const pinInt = parseInt(sanitizedPin, 10);

  sanitizedPin =
    sanitizedPin.length === 2 && pinInt > 19 && pinInt !== 20
      ? `19${sanitizedPin}`
      : sanitizedPin;

  sanitizedPin =
    sanitizedPin.length === 2 && pinInt < 19
      ? `20${sanitizedPin}`
      : sanitizedPin;

  return sanitizedPin;
};

function sanitizeRuleArguments(
  args?: unknown
): unknown[] | Record<string, unknown> {
  if (args === undefined) {
    return {};
  }

  if (Array.isArray(args)) {
    return args;
  }

  if (typeof args === "object") {
    const argsAsRecord = args as Record<string, unknown>;
    if (typeof argsAsRecord.options === "object") {
      return argsAsRecord.options as Record<string, unknown>;
    }

    return Object.values(argsAsRecord);
  }

  return [args];
}

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
      const valueArray = acc;

      /**
       * Validator only accepts strings.
       */
      let valueToValidate = String(value);
      /**
       * If the value comes from a checkbox or select input, we want the following values to count as empty,
       * so that the isEmpty rule can be applied correctly.
       */
      if (value === false || value === undefined || value === null) {
        valueToValidate = "";
      }

      const validationMethodArgs = sanitizeRuleArguments(rule.args);
      const validationMethod =
        typeof rule.method === "string" ? validator[rule.method] : rule.method;
      /** For any other rule than the isEmpty, an empty value should be treated as valid. */
      if (
        validationMethod !== validator.isEmpty &&
        valid === true &&
        valueToValidate === ""
      ) {
        return [true, ""];
      }

      const isValidationRuleMeet =
        validationMethod(valueToValidate, validationMethodArgs) ===
        rule.validWhen;

      /**
       * Only return true if the current and previous rule is met
       */
      if (valid === true && isValidationRuleMeet) {
        return [true, ""];
      }
      /**
       * Only change the  true if the current and previous rule is met
       */
      if (!isValidationRuleMeet) {
        return [false, rule.message];
      }
      return valueArray;
    },
    [true, ""]
  );
