function equal(check) {
    return (value) => {
      return value == check;
    };
  }
  
  function equalStrict(check) {
    return (value) => {
      return value === check;
    };
  }
  
  function notEqual(check) {
    return (value) => {
      return value != check;
    };
  }
  function notEqualStrict(check) {
    return (value) => {
      return value !== check;
    };
  }
  
  function greaterThan(check) {
    return (value) => {
      return value > check
    }
  }
  
  function lessThan(check) {
    return (value) => {
      return value < check
    }
  }
  
  function and(predicateOne, predicateTwo) {
    return (x) => {
      return predicateOne(x) && predicateTwo(x);
    };
  }
  
  function or(predicateOne, predicateTwo) {
    return (x) => {
      return predicateOne(x) || predicateTwo(x)
    };
  }
  
  function includes(check) {
    return (value) => {
      return value.includes(check);
    };
  }
  
  function excludes(check) {
    return (value) => {
      return !value.includes(check);
    };
  }
  
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
  
  const logicalOperators = { and, or }
  
  const allOperators = {
    ...comparisonOperators,
    ...logicalOperators
  }
  
  function isLogicalOperator(op) {
    return op in logicalOperators;
  }
  
  
  function createCondition(operator, variabels) {
    let newCondition;
  
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
  
    if (operator in comparisonOperators) {
      const [check] = variabels
      newCondition = predicate(check.value)
    }
  
    return newCondition
  }
  
  export default function createExpression(object){
      const {op, vars} = object
      if ((op in allOperators) && Array.isArray(vars)){
        const expression = createCondition(op, vars)
        return expression
      }
      return undefined;
  }
  
  // // test data to use for recrusive function
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