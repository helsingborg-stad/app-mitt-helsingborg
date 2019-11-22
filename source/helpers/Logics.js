  
  /**
   * Checks if two values is equal to one another.
   * @param {*} check
   * @return { boolean } 
   */
  function equal(check) {
    return (value) => {
      return value == check;
    };
  }
  
  /**
   * Checks if two values is strict equal to one another.
   * @param {*} check
   * @return { boolean } 
   */
  function equalStrict(check) {
    return (value) => {
      return value === check;
    };
  }
  
  /**
   * Checks if two values is not equal to one another.
   * @param {*} check
   * @return { boolean } 
   */
  function notEqual(check) {
    return (value) => {
      return value != check;
    };
  }

  /**
   * Checks if two values is not strict equal to one another.
   * @param {*} check
   * @return { boolean } 
   */
  function notEqualStrict(check) {
    return (value) => {
      return value !== check;
    };
  }
  
  /**
   * Predicate function to check if a value is greater than another.
   * @param {*} check
   * @return { boolean } 
   */
  function greaterThan(check) {
    return (value) => {
      return value > check
    }
  }

  /**
   * Predicate function to check if a value is lesser than another.
   * @param {*} check
   * @return { boolean }
   */
  function lessThan(check) {
    return (value) => {
      return value < check
    }
  }

  /**
   * A predicate function that takes two predicates and checks if both are true.
   * @param {*} predicateOne 
   * @param {*} predicateTwo
   * @return { boolean } 
   */
  function and(predicateOne, predicateTwo) {
    return (x) => {
      return predicateOne(x) && predicateTwo(x);
    };
  }

   /**
   * A predicate function that takes two predicates and checks if one of them is true.
   * @param {*} predicateOne 
   * @param {*} predicateTwo
   * @return { boolean } 
   */
  function or(predicateOne, predicateTwo) {
    return (x) => {
      return predicateOne(x) || predicateTwo(x)
    };
  }
  
  /**
   * Predicate function to check if a value is included in another value.
   * @param {*} check
   * @return { boolean }
   */
  function includes(check) {
    return (value) => {
      return value.includes(check);
    };
  }

  /**
   * Predicate function to check if a value is not included in another value.
   * @param {*} check
   * @return { boolean }
   */
  function excludes(check) {
    return (value) => {
      return !value.includes(check);
    };
  }
  /**
   * Object contaning operators that compare values and return true or false (also know as Comparioson operators).
   */
  const comparisonOperators = {
    equal,
    includes,
    excludes,
    equal_strict: equalStrict,
    not_equal: notEqual,
    not_equal_strict: notEqualStrict,
    greater_than: greaterThan,
    less_than: lessThan,
  }
  
  /**
   * Object contaning operators that combine multilpe boolean expressions and provide a single boolean output (also know as logical operators).
   */
  const logicalOperators = { and, or }
  
  /**
   * Object containing both logical and comparisson operators.
   */
  const allOperators = {
    ...comparisonOperators,
    ...logicalOperators
  }

  /**
   * Check if an operator is an logic operator.
   * @param {*} op
   * @return {boolean}
   */
  function isLogicalOperator(op) {
    return op in logicalOperators;
  }

   /**
   * Check if an operator is an comparisson operator.
   * @param {*} op
   * @return {boolean}
   */
  function isComparisonOperator(op) {
    return op in comparisonOperators;
  }
  
  /**
   * Recursive function to create a predicate function consisting of one or more nested predicate functions
   * @param {string} operator
   * @param {array} variabels
   * @return {function}
   */
  function createCondition(operator, variabels) {
    let newCondition;
    
    // The main predicate function to use
    const predicate = allOperators[operator]
    

    if (isLogicalOperator(operator)){
      const childConditions = []
      
      variabels.map(v => {
        const {op, vars } = v.value;
        childConditions.push(createCondition(op, vars))
        return v
      })
      
      newCondition = predicate(...childConditions)
    }
  
    if (isComparisonOperator(op)) {
      const [check] = variabels
      newCondition = predicate(check.value)
    }
  
    return newCondition
  }

  /**
   * Initiator function to create a predicate function from an object 
   * that can be used to check if a value is true or false.
   * @param {object} object
   * @return {function}
   */
  export default function createExpression(object){
      const {op, vars} = object
      if ((op in allOperators) && Array.isArray(vars)){
        const expression = createCondition(op, vars)
        return expression
      }
      return undefined;
  }
  
  // Example of how to use the helper function
  // expressionFunction = createExpression(dataObject)
  // expressionFunction(valueToCheck)
  //
  // Example data to use for creating a predicate function
  // const conditionData = {
  //       "op":"and",
  //       "vars":[
  //          {
  //             "op":"equal",
  //             "vars":[
  //                {
  //                   "value":"mind blown"
  //                },
  //                {
  //                   "value":"mind blown"
  //                }
  //             ]
  //          },
  //          {
  //           "op":"and",
  //           "vars":[
  //              {
  //                 value: {
  //                  "op":"equal",
  //                  "vars":[
  //                    {
  //                       "value":"mind blown"
  //                    },
  //                    {
  //                       "value":"mind blown"
  //                    }
  //                 ]
  //                  }
  //              },
  //              {
  //                 value: {
  //                   "op":"and",
  //                  "vars":[
  //                    {
  //                       "op":"equal",
  //                       "vars":[
  //                          {
  //                             "value":"mind blown"
  //                          },
  //                          {
  //                             "value":"mind blown"
  //                          }
  //                       ]
  //                    },
  //                    {
  //                       "op":"includes",
  //                       "vars":[
  //                          {
  //                             "value":"mind blown"
  //                          },
  //                          {
  //                             "value":"blown"
  //                          }
  //                       ]
  //                    }
  //                  ]}
  //              }
  //             ]
  //           }
  //       ]
  //    }