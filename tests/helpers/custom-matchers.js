/* global beforeAll, jasmine */

const type = require('of-type');
const join = require('join-array');

beforeAll(function () {
  jasmine.addMatchers({
    toHaveItems: function () {
      return {
        compare: function (actual, expected) {
          const fail = (msg) => ({ pass: false, message: msg });
          if (!type(actual, Array)) return fail('The actual argument must be of [Array] type.');
          if (!type(expected, Array)) return fail('The expected argument must be of [Array] type.');
          const config = (arr) => ({
            array: arr,
            separator: ', ',
            each: (value) => `"${value}"`
          });
          const failErr = () => fail(`Expected [${join(config(actual))}] array to have [${join(config(expected))}] items.`);
          if (actual.length !== expected.length) return failErr();
          for (let i = 0; i < expected.length; i++) if (expected[i] !== actual[i]) return failErr();
          return { pass: true };
        }
      };
    },
    toBeArguments: function () {
      return {
        compare: function (actual, { mode = 'chain', config, passContext = true, after = [], before = [], argumentsMap = false }) {
          const fail = (msg) => ({ pass: false, message: msg });
          const err = {
            incorrectLengthArguments: (e, a) => fail(`Expected ${e} arguments, while ${a} were passed.`),
            incorrectLengthItemResolved: (i, a, e) => fail(`Expected [Resolved][${i}] [Array] object to have ${a} items, while ${e} items were defined.`),
            incorrectLengthResolved: (e, a) => fail(`Expected [Resolved] object to have ${e} properties defined, while ${a} properties were defined.`),
            incorrectTypeActual: () => fail('The actual argument must be of [Array] type.'),
            incorrectTypeAfter: () => fail('The expected "after" property must be of [Array] type.'),
            incorrectTypeArgumentResolve: (i, r) => fail(`Expected [${i}] resolve argument to be of [Function] type, while it was [${getActualType(r)}].`),
            incorrectTypeArgumentReject: (i, r) => fail(`Expected [${i}] reject argument to be of [Function] type, while it was [${getActualType(r)}].`),
            incorrectTypeBefore: () => fail('The expected "before" property must be of [Array] type.'),
            incorrectTypeConfig: () => fail('The expected "config" property must be of [Object|null] type.'),
            incorrectTypeMode: () => fail('The expected "mode" property must equal either "chain", "done" or "catch".'),
            incorrectTypePassContext: () => fail('The expected "passContext" property must be of [Boolean] type.'),
            incorrectTypeResolved: () => fail('The expected "argumentsMap" property must be of [Object] type.'),
            incorrectValueArgumentContext: (i) => fail(`The [${i}] context argument does not match the actual context object or value.`),
            incorrectValueArgumentResolve: (i, n) => fail(`Expected [${i}] argument to be [Function] resolve callback, while it was [Function] ${n} function.`),
            incorrectValueArgumentReject: (i, n) => fail(`Expected [${i}] argument to be [Function] reject callback, while it was [Function] ${n} function.`),
            incorrectValueBoundArgument: (i, b, a) => fail(`The [${i}][${getActualType(b[i])}] bound argument does not match the actual [${i}][${getActualType(a[i])}] bound argument.`),
            incorrectValueItemAfter: (f, a, e) => fail(`The [${f}][${getActualType(a)}] passed argument does not match the actual [${f}][${getActualType(e)}] passed argument.`),
            incorrectValueItemResolved: (a, b) => fail(`The expected [Resolved][${a}][${b}] argument does not match the actual [Resolved][${a}][${b}] argument.`),
            missingPropertyResolved: (i) => fail(`The expected ["${i}"] property is not defined in the actual [Resolved] object.`),
            propsConflict: () => fail('The "after" and "argumentsMap" properties cannot be defined simultaneously.')
          };

          if (!(mode === 'chain' || mode === 'done' || mode === 'catch')) return err.incorrectTypeMode();
          if (!type(actual, Array)) return err.incorrectTypeActual();
          if (type(after, Array) && after.length && type(argumentsMap, Object)) return err.propsConflict();
          if (!type(passContext, Boolean)) return err.incorrectTypePassContext();
          if (!type(config, [Object, null])) return err.incorrectTypeConfig();
          if (!type(before, Array)) return err.incorrectTypeBefore();
          if (!type(after, Array)) return err.incorrectTypeAfter();
          if (argumentsMap !== false && !type(argumentsMap, Object)) return err.incorrectTypeResolved();

          const resolveDefined = mode === 'chain';
          const rejectDefined = mode === 'chain' || mode === 'done';
          const argumentsMapDefined = type(argumentsMap, Object);
          const actualLength = actual.length;
          const expectedLength = before.length + (resolveDefined ? 1 : 0) + (argumentsMapDefined ? 1 : 0) + (rejectDefined ? 1 : 0) + (passContext ? 1 : 0) + after.length;
          const contextDefined = config === null ? false : config.hasOwnProperty('context');
          const actualBefore = actual.splice(0, before.length);
          const resolve = resolveDefined ? actual.shift() : null;
          const reject = rejectDefined ? actual.shift() : null;
          const context = passContext ? actual.shift() : undefined;
          const actualAfter = actual;
          const actualArgumentsMap = actual[0];
          const firstPassedIndex = actualBefore.length + (passContext ? 3 : 2);

          if (actualLength !== expectedLength) return err.incorrectLengthArguments(expectedLength, actualLength);
          if (resolveDefined && !type(resolve, Function)) return err.incorrectTypeArgumentResolve(actualBefore.length, resolve);
          if (resolveDefined && resolve.name !== 'resolve') return err.incorrectValueArgumentResolve(actualBefore.length, resolve.name);
          if (rejectDefined && !type(reject, Function)) return err.incorrectTypeArgumentReject(actualBefore.length + 1, reject);
          if (rejectDefined && reject.name !== 'reject') return err.incorrectValueArgumentReject(actualBefore + 1, reject.name);
          if (passContext && ((contextDefined && context !== config.context) || (!contextDefined && !isDefaultContext(context)))) return err.incorrectValueArgumentContext(actualBefore + 2);
          for (let i = 0; i < before.length; i++) if (actualBefore[i] !== before[i]) return err.incorrectValueBoundArgument(i, actualBefore, after);

          if (argumentsMapDefined) {
            let expectedLength = Object.keys(argumentsMap).length;
            let actualLength = Object.keys(actualArgumentsMap).length;
            if (expectedLength !== actualLength) return err.incorrectLengthResolved(expectedLength, actualLength);
            for (let i in argumentsMap) {
              let actualArgs = argumentsMap[i];
              let expectedArgs = actualArgumentsMap[i];
              if (!type(expectedArgs, Array)) return err.missingPropertyResolved(i);
              if (expectedArgs.length !== actualArgs.length) return err.incorrectLengthItemResolved(i, actualArgs.length, expectedArgs.length);
              for (let x = 0; x < actualArgs.length; x++) {
                if (actualArgs[x] !== expectedArgs[x]) return err.incorrectValueItemResolved(i, x);
              }
            }
          } else {
            for (let i = 0; i < after.length; i++) {
              if (actualAfter[i] !== after[i]) return err.incorrectValueItemAfter(firstPassedIndex + i, actualAfter[i], after[i]);
            }
          }

          return { pass: true };

          function getActualType(actualValue) {
            if (type(actualValue, null)) return 'null';
            if (type(actualValue, undefined)) return 'undefined';
            if (type(actualValue, 'arguments')) return 'arguments';
            return actualValue.constructor.name;
          }

          function isDefaultContext(context) {
            if (!type(context, Object)) return false;
            if (Object.getOwnPropertyNames(context).length) return false;
            return true;
          }
        }
      };
    }
  });
});