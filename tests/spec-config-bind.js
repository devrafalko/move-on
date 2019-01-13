/*global describe, it, expect*/
import move from './../src/move-on.js';
import thisMount from './helpers/this-mount.js';

describe('When the module is executed', function () {
  const method = move;
  describe('with config.bind set to true', function () {
    const bind = true;
    thisMount({
      bind, method, mode: 'chain',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the chained ${descriptionFunction}`, function () { });
        it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
          expect(actualContext).toBe(expectedContext);
        });
      }
    });
    thisMount({
      bind, method, mode: 'done',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the done callback ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
    thisMount({
      bind, method, mode: 'catch',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the catch callback ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
  });

  describe('with config.bind set to false', function () {
    const bind = false;
    thisMount({
      bind, method, mode: 'chain',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the chained ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
    thisMount({
      bind, method, mode: 'done',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the done callback ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
    thisMount({
      bind, method, mode: 'catch',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the catch callback ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
  });
});

describe('When the module\'s "all" static function is executed', function () {
  const method = move.all;
  describe('and with config.bind set to true', function () {
    const bind = true;
    thisMount({
      bind, method, mode: 'chain',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the chained ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
    thisMount({
      bind, method, mode: 'done',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the done callback ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
    thisMount({
      bind, method, mode: 'catch',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the catch callback ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
  });

  describe('with config.bind set to false', function () {
    const bind = false;
    thisMount({
      bind, method, mode: 'chain',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the chained ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
    thisMount({
      bind, method, mode: 'done',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the done callback ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
    thisMount({
      bind, method, mode: 'catch',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the catch callback ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
  });
});

describe('When the module\'s "each" static function is executed', function () {
  const method = move.each;
  describe('with config.bind set to true', function () {
    const bind = true;
    thisMount({
      bind, method, mode: 'chain',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the chained ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
    thisMount({
      bind, method, mode: 'done',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the done callback ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
    thisMount({
      bind, method, mode: 'catch',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the catch callback ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
  });

  describe('with config.bind set to false', function () {
    const bind = false;
    thisMount({
      bind, method, mode: 'chain',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the chained ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
    thisMount({
      bind, method, mode: 'done',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the done callback ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
    thisMount({
      bind, method, mode: 'catch',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the catch callback ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
  });
});

describe('When the module\'s "first" static function is executed', function () {
  const method = move.first;
  describe('with config.bind set to true', function () {
    const bind = true;
    thisMount({
      bind, method, mode: 'chain',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the chained ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
    thisMount({
      bind, method, mode: 'done',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the done callback ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
    thisMount({
      bind, method, mode: 'catch',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the catch callback ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
  });

  describe('with config.bind set to false', function () {
    const bind = false;
    thisMount({
      bind, method, mode: 'chain',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the chained ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
    thisMount({
      bind, method, mode: 'done',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the done callback ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
    thisMount({
      bind, method, mode: 'catch',
      callback: ({ actualContext, expectedContext, descriptionFunction, descriptionThis }) => {
        describe(`and the catch callback ${descriptionFunction}`, function () {
          it(`the 'this' reference should lead to the ${descriptionThis}`, function () {
            expect(actualContext).toBe(expectedContext);
          });
        });
      }
    });
  });
});