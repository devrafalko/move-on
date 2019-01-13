/* global describe, beforeAll, it, expect */
import move from './../src/move-on.js';

describe('When the', function () {
  beforeAll(function () {
    this.argumentsA = ['Jessica', /world/, [1, 2, 3]];
    this.argumentsB = [/\d{1,5}/, () => { }];
    this.argumentsC = [{ name: 'Jessica' }, null, false];
    this.boundArguments = ['world', 123, new Date()];
    this.context = { pending: true };
    this.resolveFunction = (resolve) => resolve(...this.argumentsA);
    this.rejectDone = (reject) => reject(...this.argumentsC);

    this.resolveChain = [
      (resolve) => resolve(...this.argumentsA),
      (resolve) => resolve(...this.argumentsB),
      (resolve) => resolve(...this.argumentsC),
    ];

    this.rejectOneChain = [
      (resolve) => resolve(...this.argumentsA),
      (resolve, reject) => reject(...this.argumentsB),
      (resolve) => resolve(...this.argumentsC),
    ];

    this.rejectSecondChain = [
      (resolve) => resolve(),
      (resolve, reject) => reject(...this.argumentsA)
    ];

    this.rejectAllChain = [
      (resolve, reject) => reject(...this.argumentsB),
      (resolve, reject) => reject(...this.argumentsC),
      (resolve, reject) => reject(...this.argumentsA)
    ];

    this.resolveMap = {
      0: this.argumentsA,
      1: this.argumentsB,
      2: this.argumentsC
    };

    this.resolvePartlyMap = {
      0: this.argumentsA,
      2: this.argumentsC
    };

    this.rejectMap = {
      0: this.argumentsB,
      1: this.argumentsC,
      2: this.argumentsA
    };

  });

  describe('module is executed with the first chained function that resolves with some arguments', function () {
    describe('and when config.passContext is set to true', function () {
      describe('the arguments of the second chained function', function () {
        it('should suit resolve, reject, context and all arguments passed by the previous chained function', function () {
          const after = this.argumentsA;
          this.passArguments({
            list: (config) => {
              return [
                this.resolveFunction,
                function (resolve, reject, context, a, b, c) {
                  expect([resolve, reject, context, a, b, c]).toBeArguments({ config, after });
                }
              ];
            }
          });
          this.passArguments({
            list: (config) => {
              return [
                this.resolveFunction,
                (resolve, reject, context, a, b, c) => {
                  expect([resolve, reject, context, a, b, c]).toBeArguments({ config, after });
                }];
            }
          });
          this.passArguments({
            list: (config) => {
              const objectTemplate = {
                methodTemplate: function (resolve, reject, context, a, b, c) {
                  expect([resolve, reject, context, a, b, c]).toBeArguments({ config, after });
                }
              };
              return [this.resolveFunction, objectTemplate.methodTemplate];
            }
          });
          this.passArguments({
            list: (config) => {
              const objectTemplate = {
                methodTemplate: function (resolve, reject, context, a, b, c) {
                  expect([resolve, reject, context, a, b, c]).toBeArguments({ config, after });
                }
              };
              return [this.resolveFunction, [objectTemplate, objectTemplate.methodTemplate]];
            }
          });
          this.passArguments({
            list: (config) => {
              const objectTemplate = {
                methodTemplate: function (resolve, reject, context, a, b, c) {
                  expect([resolve, reject, context, a, b, c]).toBeArguments({ config, after });
                }
              };
              return [this.resolveFunction, [objectTemplate, 'methodTemplate']];
            }
          });
          this.passArguments({
            list: (config) => {
              const objectTemplate = {
                methodTemplate: (resolve, reject, context, a, b, c) => {
                  expect([resolve, reject, context, a, b, c]).toBeArguments({ config, after });
                }
              };
              return [this.resolveFunction, objectTemplate.methodTemplate];
            }
          });
          this.passArguments({
            list: (config) => {
              const objectTemplate = {
                methodTemplate: (resolve, reject, context, a, b, c) => {
                  expect([resolve, reject, context, a, b, c]).toBeArguments({ config, after });
                }
              };
              return [this.resolveFunction, [objectTemplate, objectTemplate.methodTemplate]];
            }
          });
          this.passArguments({
            list: (config) => {
              const objectTemplate = {
                methodTemplate: (resolve, reject, context, a, b, c) => {
                  expect([resolve, reject, context, a, b, c]).toBeArguments({ config, after });
                }
              };
              return [this.resolveFunction, [objectTemplate, 'methodTemplate']];
            }
          });
          this.passArguments({
            list: (config) => {
              class classTemplate {
                methodTemplate(resolve, reject, context, a, b, c) {
                  expect([resolve, reject, context, a, b, c]).toBeArguments({ config, after });
                }
              }
              return [this.resolveFunction, new classTemplate().methodTemplate];
            }
          });
          this.passArguments({
            list: (config) => {
              class classTemplate {
                methodTemplate(resolve, reject, context, a, b, c) {
                  expect([resolve, reject, context, a, b, c]).toBeArguments({ config, after });
                }
              }
              const instanceTemplate = new classTemplate();
              return [this.resolveFunction, [instanceTemplate, instanceTemplate.methodTemplate]];
            }
          });
          this.passArguments({
            list: (config) => {
              class classTemplate {
                methodTemplate(resolve, reject, context, a, b, c) {
                  expect([resolve, reject, context, a, b, c]).toBeArguments({ config, after });
                }
              }
              const instanceTemplate = new classTemplate();
              return [this.resolveFunction, [instanceTemplate, 'methodTemplate']];
            }
          });
        });
      });
      describe('the arguments of the second chained function that is already bound', function () {
        it('should suit resolve, reject, context and all arguments passed by the previous chained function', function () {
          const after = this.argumentsA;
          this.passArguments({
            list: (config) => {
              return [
                this.resolveFunction,
                (function (resolve, reject, context, a, b, c) {
                  expect([resolve, reject, context, a, b, c]).toBeArguments({ config, after });
                }).bind({})
              ];
            }
          });
          this.passArguments({
            list: (config) => {
              return [
                this.resolveFunction,
                ((resolve, reject, context, a, b, c) => {
                  expect([resolve, reject, context, a, b, c]).toBeArguments({ config, after });
                }).bind({})
              ];
            }
          });
          this.passArguments({
            list: (config) => {
              const objectTemplate = {
                methodTemplate: function (resolve, reject, context, a, b, c) {
                  expect([resolve, reject, context, a, b, c]).toBeArguments({ config, after });
                }
              };
              return [this.resolveFunction, objectTemplate.methodTemplate.bind({})];
            }
          });
          this.passArguments({
            list: (config) => {
              const objectTemplate = {
                methodTemplate: function (resolve, reject, context, a, b, c) {
                  expect([resolve, reject, context, a, b, c]).toBeArguments({ config, after });
                }
              };
              return [this.resolveFunction, [objectTemplate, objectTemplate.methodTemplate.bind({})]];
            }
          });
          this.passArguments({
            list: (config) => {
              const objectTemplate = {
                methodTemplate: (function (resolve, reject, context, a, b, c) {
                  expect([resolve, reject, context, a, b, c]).toBeArguments({ config, after });
                }).bind({})
              };
              return [this.resolveFunction, [objectTemplate, 'methodTemplate']];
            }
          });
          this.passArguments({
            list: (config) => {
              const objectTemplate = {
                methodTemplate: (resolve, reject, context, a, b, c) => {
                  expect([resolve, reject, context, a, b, c]).toBeArguments({ config, after });
                }
              };
              return [this.resolveFunction, objectTemplate.methodTemplate.bind({})];
            }
          });
          this.passArguments({
            list: (config) => {
              const objectTemplate = {
                methodTemplate: (resolve, reject, context, a, b, c) => {
                  expect([resolve, reject, context, a, b, c]).toBeArguments({ config, after });
                }
              };
              return [this.resolveFunction, [objectTemplate, objectTemplate.methodTemplate.bind({})]];
            }
          });
          this.passArguments({
            list: (config) => {
              const objectTemplate = {
                methodTemplate: ((resolve, reject, context, a, b, c) => {
                  expect([resolve, reject, context, a, b, c]).toBeArguments({ config, after });
                }).bind({})
              };
              return [this.resolveFunction, [objectTemplate, 'methodTemplate']];
            }
          });
          this.passArguments({
            list: (config) => {
              class classTemplate {
                methodTemplate(resolve, reject, context, a, b, c) {
                  expect([resolve, reject, context, a, b, c]).toBeArguments({ config, after });
                }
              }
              return [this.resolveFunction, new classTemplate().methodTemplate.bind({})];
            }
          });
          this.passArguments({
            list: (config) => {
              class classTemplate {
                methodTemplate(resolve, reject, context, a, b, c) {
                  expect([resolve, reject, context, a, b, c]).toBeArguments({ config, after });
                }
              }
              const instanceTemplate = new classTemplate();
              return [this.resolveFunction, [instanceTemplate, instanceTemplate.methodTemplate.bind({})]];
            }
          });
        });
      });
      describe('the arguments of the second chained function that is already bound with additional arguments', function () {
        it('the arguments should suit all bound arguments, resolve, reject, context and all arguments passed by the previous chained function', function () {
          const before = this.boundArguments;
          const after = this.argumentsA;
          this.passArguments({
            list: (config) => {
              return [
                this.resolveFunction,
                (function (x, y, z, resolve, reject, context, a, b, c) {
                  expect([x, y, z, resolve, reject, context, a, b, c]).toBeArguments({ config, after, before });
                }).bind({}, ...before)
              ];
            }
          });
          this.passArguments({
            list: (config) => {
              return [
                this.resolveFunction,
                ((x, y, z, resolve, reject, context, a, b, c) => {
                  expect([x, y, z, resolve, reject, context, a, b, c]).toBeArguments({ config, after, before });
                }).bind({}, ...before)
              ];
            }
          });
          this.passArguments({
            list: (config) => {
              const objectTemplate = {
                methodTemplate: function (x, y, z, resolve, reject, context, a, b, c) {
                  expect([x, y, z, resolve, reject, context, a, b, c]).toBeArguments({ config, after, before });
                }
              };
              return [this.resolveFunction, objectTemplate.methodTemplate.bind({}, ...before)];
            }
          });
          this.passArguments({
            list: (config) => {
              const objectTemplate = {
                methodTemplate: function (x, y, z, resolve, reject, context, a, b, c) {
                  expect([x, y, z, resolve, reject, context, a, b, c]).toBeArguments({ config, after, before });
                }
              };
              return [this.resolveFunction, [objectTemplate, objectTemplate.methodTemplate.bind({}, ...before)]];
            }
          });
          this.passArguments({
            list: (config) => {
              const objectTemplate = {
                methodTemplate: (function (x, y, z, resolve, reject, context, a, b, c) {
                  expect([x, y, z, resolve, reject, context, a, b, c]).toBeArguments({ config, after, before });
                }).bind({}, ...before)
              };
              return [this.resolveFunction, [objectTemplate, 'methodTemplate']];
            }
          });
          this.passArguments({
            list: (config) => {
              const objectTemplate = {
                methodTemplate: (x, y, z, resolve, reject, context, a, b, c) => {
                  expect([x, y, z, resolve, reject, context, a, b, c]).toBeArguments({ config, after, before });
                }
              };
              return [this.resolveFunction, objectTemplate.methodTemplate.bind({}, ...before)];
            }
          });
          this.passArguments({
            list: (config) => {
              const objectTemplate = {
                methodTemplate: (x, y, z, resolve, reject, context, a, b, c) => {
                  expect([x, y, z, resolve, reject, context, a, b, c]).toBeArguments({ config, after, before });
                }
              };
              return [this.resolveFunction, [objectTemplate, objectTemplate.methodTemplate.bind({}, ...before)]];
            }
          });
          this.passArguments({
            list: (config) => {
              const objectTemplate = {
                methodTemplate: ((x, y, z, resolve, reject, context, a, b, c) => {
                  expect([x, y, z, resolve, reject, context, a, b, c]).toBeArguments({ config, after, before });
                }).bind({}, ...before)
              };
              return [this.resolveFunction, [objectTemplate, 'methodTemplate']];
            }
          });
          this.passArguments({
            list: (config) => {
              class classTemplate {
                methodTemplate(x, y, z, resolve, reject, context, a, b, c) {
                  expect([x, y, z, resolve, reject, context, a, b, c]).toBeArguments({ config, after, before });
                }
              }
              return [this.resolveFunction, new classTemplate().methodTemplate.bind({}, ...before)];
            }
          });
          this.passArguments({
            list: (config) => {
              class classTemplate {
                methodTemplate(x, y, z, resolve, reject, context, a, b, c) {
                  expect([x, y, z, resolve, reject, context, a, b, c]).toBeArguments({ config, after, before });
                }
              }
              const instanceTemplate = new classTemplate();
              return [this.resolveFunction, [instanceTemplate, instanceTemplate.methodTemplate.bind({}, ...before)]];
            }
          });
        });
      });
    });
    describe('and config.passContext is set to false', function () {
      const passContext = false;
      describe('the arguments of the second chained function', function () {
        it('should suit resolve, reject and all arguments passed by the previous chained function', function () {
          const after = this.argumentsA;
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              return [
                this.resolveFunction,
                function (resolve, reject, a, b, c) {
                  expect([resolve, reject, a, b, c]).toBeArguments({ passContext, config, after });
                }
              ];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              return [
                this.resolveFunction,
                (resolve, reject, a, b, c) => {
                  expect([resolve, reject, a, b, c]).toBeArguments({ passContext, config, after });
                }
              ];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              const objectTemplate = {
                methodTemplate: function (resolve, reject, a, b, c) {
                  expect([resolve, reject, a, b, c]).toBeArguments({ passContext, config, after });
                }
              };
              return [this.resolveFunction, objectTemplate.methodTemplate];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              const objectTemplate = {
                methodTemplate: function (resolve, reject, a, b, c) {
                  expect([resolve, reject, a, b, c]).toBeArguments({ passContext, config, after });
                }
              };
              return [this.resolveFunction, [objectTemplate, objectTemplate.methodTemplate]];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              const objectTemplate = {
                methodTemplate: function (resolve, reject, a, b, c) {
                  expect([resolve, reject, a, b, c]).toBeArguments({ passContext, config, after });
                }
              };
              return [this.resolveFunction, [objectTemplate, 'methodTemplate']];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              const objectTemplate = {
                methodTemplate: (resolve, reject, a, b, c) => {
                  expect([resolve, reject, a, b, c]).toBeArguments({ passContext, config, after });
                }
              };
              return [this.resolveFunction, objectTemplate.methodTemplate];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              const objectTemplate = {
                methodTemplate: (resolve, reject, a, b, c) => {
                  expect([resolve, reject, a, b, c]).toBeArguments({ passContext, config, after });
                }
              };
              return [this.resolveFunction, [objectTemplate, objectTemplate.methodTemplate]];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              const objectTemplate = {
                methodTemplate: (resolve, reject, a, b, c) => {
                  expect([resolve, reject, a, b, c]).toBeArguments({ passContext, config, after });
                }
              };
              return [this.resolveFunction, [objectTemplate, 'methodTemplate']];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              class classTemplate {
                methodTemplate(resolve, reject, a, b, c) {
                  expect([resolve, reject, a, b, c]).toBeArguments({ passContext, config, after });
                }
              }
              return [this.resolveFunction, new classTemplate().methodTemplate];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              class classTemplate {
                methodTemplate(resolve, reject, a, b, c) {
                  expect([resolve, reject, a, b, c]).toBeArguments({ passContext, config, after });
                }
              }
              const instanceTemplate = new classTemplate();
              return [this.resolveFunction, [instanceTemplate, instanceTemplate.methodTemplate]];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              class classTemplate {
                methodTemplate(resolve, reject, a, b, c) {
                  expect([resolve, reject, a, b, c]).toBeArguments({ passContext, config, after });
                }
              }
              const instanceTemplate = new classTemplate();
              return [this.resolveFunction, [instanceTemplate, 'methodTemplate']];
            }
          });
        });
      });
      describe('the arguments of the second chained function that is already bound', function () {
        it('should suit resolve, reject and all arguments passed by the previous chained function', function () {
          const after = this.argumentsA;
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              return [
                this.resolveFunction,
                (function (resolve, reject, a, b, c) {
                  expect([resolve, reject, a, b, c]).toBeArguments({ passContext, config, after });
                }).bind({})
              ];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              return [
                this.resolveFunction,
                ((resolve, reject, a, b, c) => {
                  expect([resolve, reject, a, b, c]).toBeArguments({ passContext, config, after });
                }).bind({})
              ];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              const objectTemplate = {
                methodTemplate: function (resolve, reject, a, b, c) {
                  expect([resolve, reject, a, b, c]).toBeArguments({ passContext, config, after });
                }
              };
              return [this.resolveFunction, objectTemplate.methodTemplate.bind({})];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              const objectTemplate = {
                methodTemplate: function (resolve, reject, a, b, c) {
                  expect([resolve, reject, a, b, c]).toBeArguments({ passContext, config, after });
                }
              };
              return [this.resolveFunction, [objectTemplate, objectTemplate.methodTemplate.bind({})]];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              const objectTemplate = {
                methodTemplate: (function (resolve, reject, a, b, c) {
                  expect([resolve, reject, a, b, c]).toBeArguments({ passContext, config, after });
                }).bind({})
              };
              return [this.resolveFunction, [objectTemplate, 'methodTemplate']];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              const objectTemplate = {
                methodTemplate: (resolve, reject, a, b, c) => {
                  expect([resolve, reject, a, b, c]).toBeArguments({ passContext, config, after });
                }
              };
              return [this.resolveFunction, objectTemplate.methodTemplate.bind({})];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              const objectTemplate = {
                methodTemplate: (resolve, reject, a, b, c) => {
                  expect([resolve, reject, a, b, c]).toBeArguments({ passContext, config, after });
                }
              };
              return [this.resolveFunction, [objectTemplate, objectTemplate.methodTemplate.bind({})]];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              const objectTemplate = {
                methodTemplate: ((resolve, reject, a, b, c) => {
                  expect([resolve, reject, a, b, c]).toBeArguments({ passContext, config, after });
                }).bind({})
              };
              return [this.resolveFunction, [objectTemplate, 'methodTemplate']];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              class classTemplate {
                methodTemplate(resolve, reject, a, b, c) {
                  expect([resolve, reject, a, b, c]).toBeArguments({ passContext, config, after });
                }
              }
              return [this.resolveFunction, new classTemplate().methodTemplate.bind({})];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              class classTemplate {
                methodTemplate(resolve, reject, a, b, c) {
                  expect([resolve, reject, a, b, c]).toBeArguments({ passContext, config, after });
                }
              }
              const instanceTemplate = new classTemplate();
              return [this.resolveFunction, [instanceTemplate, instanceTemplate.methodTemplate.bind({})]];
            }
          });
        });
      });
      describe('the arguments of the second chained function that is already bound with additional arguments', function () {
        it('the arguments should suit all bound arguments, resolve, reject and all arguments passed by the previous chained function', function () {
          const before = this.boundArguments;
          const after = this.argumentsA;
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              return [
                this.resolveFunction,
                (function (x, y, z, resolve, reject, a, b, c) {
                  expect([x, y, z, resolve, reject, a, b, c]).toBeArguments({ passContext, config, before, after });
                }).bind({}, ...before)
              ];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              return [
                this.resolveFunction,
                ((x, y, z, resolve, reject, a, b, c) => {
                  expect([x, y, z, resolve, reject, a, b, c]).toBeArguments({ passContext, config, before, after });
                }).bind({}, ...before)
              ];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              const objectTemplate = {
                methodTemplate: function (x, y, z, resolve, reject, a, b, c) {
                  expect([x, y, z, resolve, reject, a, b, c]).toBeArguments({ passContext, config, before, after });
                }
              };
              return [this.resolveFunction, objectTemplate.methodTemplate.bind({}, ...before)];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              const objectTemplate = {
                methodTemplate: function (x, y, z, resolve, reject, a, b, c) {
                  expect([x, y, z, resolve, reject, a, b, c]).toBeArguments({ passContext, config, before, after });
                }
              };
              return [this.resolveFunction, [objectTemplate, objectTemplate.methodTemplate.bind({}, ...before)]];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              const objectTemplate = {
                methodTemplate: (function (x, y, z, resolve, reject, a, b, c) {
                  expect([x, y, z, resolve, reject, a, b, c]).toBeArguments({ passContext, config, before, after });
                }).bind({}, ...before)
              };
              return [this.resolveFunction, [objectTemplate, 'methodTemplate']];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              const objectTemplate = {
                methodTemplate: (x, y, z, resolve, reject, a, b, c) => {
                  expect([x, y, z, resolve, reject, a, b, c]).toBeArguments({ passContext, config, before, after });
                }
              };
              return [this.resolveFunction, objectTemplate.methodTemplate.bind({}, ...before)];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              const objectTemplate = {
                methodTemplate: (x, y, z, resolve, reject, a, b, c) => {
                  expect([x, y, z, resolve, reject, a, b, c]).toBeArguments({ passContext, config, before, after });
                }
              };
              return [this.resolveFunction, [objectTemplate, objectTemplate.methodTemplate.bind({}, ...before)]];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              const objectTemplate = {
                methodTemplate: ((x, y, z, resolve, reject, a, b, c) => {
                  expect([x, y, z, resolve, reject, a, b, c]).toBeArguments({ passContext, config, before, after });
                }).bind({}, ...before)
              };
              return [this.resolveFunction, [objectTemplate, 'methodTemplate']];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              class classTemplate {
                methodTemplate(x, y, z, resolve, reject, a, b, c) {
                  expect([x, y, z, resolve, reject, a, b, c]).toBeArguments({ passContext, config, before, after });
                }
              }
              return [this.resolveFunction, new classTemplate().methodTemplate.bind({}, ...before)];
            }
          });
          this.passArguments({
            passContext: passContext,
            list: (config) => {
              class classTemplate {
                methodTemplate(x, y, z, resolve, reject, a, b, c) {
                  expect([x, y, z, resolve, reject, a, b, c]).toBeArguments({ passContext, config, before, after });
                }
              }
              const instanceTemplate = new classTemplate();
              return [this.resolveFunction, [instanceTemplate, instanceTemplate.methodTemplate.bind({}, ...before)]];
            }
          });
        });
      });
    });
  });

  describe('module\'s static methods are executed', function () {
    describe('and when config.passContext is set to true', function () {
      describe('the arguments of all chained functions', function () {
        it('should suit resolve, reject and context', function () {
          this.passArguments({
            methods: [move.all, move.each, move.first],
            list: (config) => {
              const list = [];

              list.push(function (resolve, reject, context) {
                expect([resolve, reject, context]).toBeArguments({ config });
              });

              list.push((resolve, reject, context) => {
                expect([resolve, reject, context]).toBeArguments({ config });
              });

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: function (resolve, reject, context) {
                    expect([resolve, reject, context]).toBeArguments({ config });
                  }
                };
                return objectTemplate.methodTemplate;
              })());

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: function (resolve, reject, context) {
                    expect([resolve, reject, context]).toBeArguments({ config });
                  }
                };
                return [objectTemplate, objectTemplate.methodTemplate];
              })());

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: function (resolve, reject, context) {
                    expect([resolve, reject, context]).toBeArguments({ config });
                  }
                };
                return [objectTemplate, 'methodTemplate'];
              })());

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: (resolve, reject, context) => {
                    expect([resolve, reject, context]).toBeArguments({ config });
                  }
                };
                return objectTemplate.methodTemplate;
              })());

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: (resolve, reject, context) => {
                    expect([resolve, reject, context]).toBeArguments({ config });
                  }
                };
                return [objectTemplate, objectTemplate.methodTemplate];
              })());

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: (resolve, reject, context) => {
                    expect([resolve, reject, context]).toBeArguments({ config });
                  }
                };
                return [objectTemplate, 'methodTemplate'];
              })());

              list.push((() => {
                class classTemplate {
                  methodTemplate(resolve, reject, context) {
                    expect([resolve, reject, context]).toBeArguments({ config });
                  }
                }
                return new classTemplate().methodTemplate;
              })());

              list.push((() => {
                class classTemplate {
                  methodTemplate(resolve, reject, context) {
                    expect([resolve, reject, context]).toBeArguments({ config });
                  }
                }
                const instanceTemplate = new classTemplate();
                return [instanceTemplate, instanceTemplate.methodTemplate];

              })());

              list.push((() => {
                class classTemplate {
                  methodTemplate(resolve, reject, context) {
                    expect([resolve, reject, context]).toBeArguments({ config });
                  }
                }
                const instanceTemplate = new classTemplate();
                return [instanceTemplate, 'methodTemplate'];
              })());

              return list;
            }
          });
        });
      });
      describe('the arguments of all chained functions that are already bound with additional arguments', function () {
        it('should suit all bound arguments, resolve, reject and context', function () {
          const before = this.boundArguments;
          this.passArguments({
            methods: [move.all, move.each, move.first],
            list: (config) => {
              const list = [];
              list.push((function secondFunction(x, y, z, resolve, reject, context) {
                expect([x, y, z, resolve, reject, context]).toBeArguments({ config, before });
              }).bind({}, ...before));

              list.push(((x, y, z, resolve, reject, context) => {
                expect([x, y, z, resolve, reject, context]).toBeArguments({ config, before });
              }).bind({}, ...before));

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: function (x, y, z, resolve, reject, context) {
                    expect([x, y, z, resolve, reject, context]).toBeArguments({ config, before });
                  }
                };
                return objectTemplate.methodTemplate.bind({}, ...before);
              })());

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: function (x, y, z, resolve, reject, context) {
                    expect([x, y, z, resolve, reject, context]).toBeArguments({ config, before });
                  }
                };
                return [objectTemplate, objectTemplate.methodTemplate.bind({}, ...before)];
              })());

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: (function (x, y, z, resolve, reject, context) {
                    expect([x, y, z, resolve, reject, context]).toBeArguments({ config, before });
                  }).bind({}, ...before)
                };
                return [objectTemplate, 'methodTemplate'];
              })());

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: (x, y, z, resolve, reject, context) => {
                    expect([x, y, z, resolve, reject, context]).toBeArguments({ config, before });
                  }
                };
                return objectTemplate.methodTemplate.bind({}, ...before);
              })());

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: (x, y, z, resolve, reject, context) => {
                    expect([x, y, z, resolve, reject, context]).toBeArguments({ config, before });
                  }
                };
                return [objectTemplate, objectTemplate.methodTemplate.bind({}, ...before)];
              })());

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: ((x, y, z, resolve, reject, context) => {
                    expect([x, y, z, resolve, reject, context]).toBeArguments({ config, before });
                  }).bind({}, ...before)
                };
                return [objectTemplate, 'methodTemplate'];
              })());

              list.push((() => {
                class classTemplate {
                  methodTemplate(x, y, z, resolve, reject, context) {
                    expect([x, y, z, resolve, reject, context]).toBeArguments({ config, before });
                  }
                }
                return new classTemplate().methodTemplate.bind({}, ...before);
              })());

              list.push((() => {
                class classTemplate {
                  methodTemplate(x, y, z, resolve, reject, context) {
                    expect([x, y, z, resolve, reject, context]).toBeArguments({ config, before });
                  }
                }
                const instanceTemplate = new classTemplate();
                return [instanceTemplate, instanceTemplate.methodTemplate.bind({}, ...before)];
              })());

              return list;
            }
          });
        });
      });
    });

    describe('and when config.passContext is set to false', function () {
      const passContext = false;
      describe('the arguments of all chained functions', function () {
        it('should suit resolve and reject', function () {
          this.passArguments({
            passContext: passContext,
            methods: [move.all, move.each, move.first],
            list: (config) => {
              const list = [];

              list.push(function secondFunction(resolve, reject) {
                expect([resolve, reject]).toBeArguments({ passContext, config });
              });

              list.push((resolve, reject) => {
                expect([resolve, reject]).toBeArguments({ passContext, config });
              });

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: function (resolve, reject) {
                    expect([resolve, reject]).toBeArguments({ passContext, config });
                  }
                };
                return objectTemplate.methodTemplate;
              })());

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: function (resolve, reject) {
                    expect([resolve, reject]).toBeArguments({ passContext, config });
                  }
                };
                return [objectTemplate, objectTemplate.methodTemplate];
              })());

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: function (resolve, reject) {
                    expect([resolve, reject]).toBeArguments({ passContext, config });
                  }
                };
                return [objectTemplate, 'methodTemplate'];
              })());

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: (resolve, reject) => {
                    expect([resolve, reject]).toBeArguments({ passContext, config });
                  }
                };
                return objectTemplate.methodTemplate;
              })());

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: (resolve, reject) => {
                    expect([resolve, reject]).toBeArguments({ passContext, config });
                  }
                };
                return [objectTemplate, objectTemplate.methodTemplate];
              })());

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: (resolve, reject) => {
                    expect([resolve, reject]).toBeArguments({ passContext, config });
                  }
                };
                return [objectTemplate, 'methodTemplate'];
              })());

              list.push((() => {
                class classTemplate {
                  methodTemplate(resolve, reject) {
                    expect([resolve, reject]).toBeArguments({ passContext, config });
                  }
                }
                return new classTemplate().methodTemplate;
              })());

              list.push((() => {
                class classTemplate {
                  methodTemplate(resolve, reject) {
                    expect([resolve, reject]).toBeArguments({ passContext, config });
                  }
                }
                const instanceTemplate = new classTemplate();
                return [instanceTemplate, instanceTemplate.methodTemplate];

              })());

              list.push((() => {
                class classTemplate {
                  methodTemplate(resolve, reject) {
                    expect([resolve, reject]).toBeArguments({ passContext, config });
                  }
                }
                const instanceTemplate = new classTemplate();
                return [instanceTemplate, 'methodTemplate'];
              })());

              return list;
            }
          });
        });
      });
      describe('the arguments of all chained functions that are already bound with additional arguments', function () {
        it('should suit all bound arguments, resolve and reject', function () {
          const before = this.boundArguments;
          this.passArguments({
            passContext: passContext,
            methods: [move.all, move.each, move.first],
            list: (config) => {
              const list = [];
              list.push((function secondFunction(x, y, z, resolve, reject) {
                expect([x, y, z, resolve, reject]).toBeArguments({ passContext, config, before });
              }).bind({}, ...before));

              list.push(((x, y, z, resolve, reject) => {
                expect([x, y, z, resolve, reject]).toBeArguments({ passContext, config, before });
              }).bind({}, ...before));

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: function (x, y, z, resolve, reject) {
                    expect([x, y, z, resolve, reject]).toBeArguments({ passContext, config, before });
                  }
                };
                return objectTemplate.methodTemplate.bind({}, ...before);
              })());

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: function (x, y, z, resolve, reject) {
                    expect([x, y, z, resolve, reject]).toBeArguments({ passContext, config, before });
                  }
                };
                return [objectTemplate, objectTemplate.methodTemplate.bind({}, ...before)];
              })());

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: (function (x, y, z, resolve, reject) {
                    expect([x, y, z, resolve, reject]).toBeArguments({ passContext, config, before });
                  }).bind({}, ...before)
                };
                return [objectTemplate, 'methodTemplate'];
              })());

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: (x, y, z, resolve, reject) => {
                    expect([x, y, z, resolve, reject]).toBeArguments({ passContext, config, before });
                  }
                };
                return objectTemplate.methodTemplate.bind({}, ...before);
              })());

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: (x, y, z, resolve, reject) => {
                    expect([x, y, z, resolve, reject]).toBeArguments({ passContext, config, before });
                  }
                };
                return [objectTemplate, objectTemplate.methodTemplate.bind({}, ...before)];
              })());

              list.push((() => {
                const objectTemplate = {
                  methodTemplate: ((x, y, z, resolve, reject) => {
                    expect([x, y, z, resolve, reject]).toBeArguments({ passContext, config, before });
                  }).bind({}, ...before)
                };
                return [objectTemplate, 'methodTemplate'];
              })());

              list.push((() => {
                class classTemplate {
                  methodTemplate(x, y, z, resolve, reject) {
                    expect([x, y, z, resolve, reject]).toBeArguments({ passContext, config, before });
                  }
                }
                return new classTemplate().methodTemplate.bind({}, ...before);
              })());

              list.push((() => {
                class classTemplate {
                  methodTemplate(x, y, z, resolve, reject) {
                    expect([x, y, z, resolve, reject]).toBeArguments({ passContext, config, before });
                  }
                }
                const instanceTemplate = new classTemplate();
                return [instanceTemplate, instanceTemplate.methodTemplate.bind({}, ...before)];
              })());

              return list;
            }
          });
        });
      });
    });
  });

  describe('module is executed with the list of functions', function () {
    describe('that finally resolves', function () {
      const mode = 'done';
      describe('and when config.passContext is set to true', function () {
        describe('the done callback function', function () {
          it('should suit reject, context and all arguments passed by the last chained function', function () {
            const after = this.argumentsC;
            this.passArguments({
              list: () => this.resolveChain,
              doneCallback: (config) => {
                return function (reject, context, a, b, c) {
                  expect([reject, context, a, b, c]).toBeArguments({ mode, config, after });
                };
              }
            });

            this.passArguments({
              list: () => this.resolveChain,
              doneCallback: (config) => {
                return (reject, context, a, b, c) => {
                  expect([reject, context, a, b, c]).toBeArguments({ mode, config, after });
                };
              }
            });

            this.passArguments({
              list: () => this.resolveChain,
              doneCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: function (reject, context, a, b, c) {
                    expect([reject, context, a, b, c]).toBeArguments({ mode, config, after });
                  }
                };
                return objectTemplate.methodTemplate;
              }
            });

            this.passArguments({
              list: () => this.resolveChain,
              doneCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: (reject, context, a, b, c) => {
                    expect([reject, context, a, b, c]).toBeArguments({ mode, config, after });
                  }
                };
                return objectTemplate.methodTemplate;
              }
            });

            this.passArguments({
              list: () => this.resolveChain,
              doneCallback: (config) => {
                class classTemplate {
                  methodTemplate(reject, context, a, b, c) {
                    expect([reject, context, a, b, c]).toBeArguments({ mode, config, after });
                  }
                }
                return new classTemplate().methodTemplate;
              }
            });
          });
        });
        describe('the done callback function that is already bound with additional arguments', function () {
          it('should suit all bound arguments, reject, context and all arguments passed by the last chained function', function () {
            const after = this.argumentsC;
            const before = this.boundArguments;
            this.passArguments({
              list: () => this.resolveChain,
              doneCallback: (config) => {
                return (function (x, y, z, reject, context, a, b, c) {
                  expect([x, y, z, reject, context, a, b, c]).toBeArguments({ mode, config, after, before });
                }).bind({}, ...before);
              }
            });

            this.passArguments({
              list: () => this.resolveChain,
              doneCallback: (config) => {
                return ((x, y, z, reject, context, a, b, c) => {
                  expect([x, y, z, reject, context, a, b, c]).toBeArguments({ mode, config, after, before });
                }).bind({}, ...before);
              }
            });

            this.passArguments({
              list: () => this.resolveChain,
              doneCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: function (x, y, z, reject, context, a, b, c) {
                    expect([x, y, z, reject, context, a, b, c]).toBeArguments({ mode, config, after, before });
                  }
                };
                return objectTemplate.methodTemplate.bind({}, ...before);
              }
            });

            this.passArguments({
              list: () => this.resolveChain,
              doneCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: (x, y, z, reject, context, a, b, c) => {
                    expect([x, y, z, reject, context, a, b, c]).toBeArguments({ mode, config, after, before });
                  }
                };
                return objectTemplate.methodTemplate.bind({}, ...before);
              }
            });

            this.passArguments({
              list: () => this.resolveChain,
              doneCallback: (config) => {
                class classTemplate {
                  methodTemplate(x, y, z, reject, context, a, b, c) {
                    expect([x, y, z, reject, context, a, b, c]).toBeArguments({ mode, config, after, before });
                  }
                }
                return new classTemplate().methodTemplate.bind({}, ...before);
              }
            });
          });
        });
      });
      describe('and when config.passContext is set to false', function () {
        const passContext = false;
        describe('the done callback function', function () {
          it('should suit reject and all arguments passed by the last chained function', function () {
            const after = this.argumentsC;
            this.passArguments({
              passContext,
              list: () => this.resolveChain,
              doneCallback: (config) => {
                return function (reject, a, b, c) {
                  expect([reject, a, b, c]).toBeArguments({ mode, passContext, config, after });
                };
              }
            });

            this.passArguments({
              passContext,
              list: () => this.resolveChain,
              doneCallback: (config) => {
                return (reject, a, b, c) => {
                  expect([reject, a, b, c]).toBeArguments({ mode, passContext, config, after });
                };
              }
            });

            this.passArguments({
              passContext,
              list: () => this.resolveChain,
              doneCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: function (reject, a, b, c) {
                    expect([reject, a, b, c]).toBeArguments({ mode, passContext, config, after });
                  }
                };
                return objectTemplate.methodTemplate;
              }
            });

            this.passArguments({
              passContext,
              list: () => this.resolveChain,
              doneCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: (reject, a, b, c) => {
                    expect([reject, a, b, c]).toBeArguments({ mode, passContext, config, after });
                  }
                };
                return objectTemplate.methodTemplate;
              }
            });

            this.passArguments({
              passContext,
              list: () => this.resolveChain,
              doneCallback: (config) => {
                class classTemplate {
                  methodTemplate(reject, a, b, c) {
                    expect([reject, a, b, c]).toBeArguments({ mode, passContext, config, after });
                  }
                }
                return new classTemplate().methodTemplate;
              }
            });
          });
        });
        describe('the done callback function that is already bound with additional arguments', function () {
          it('should suit all bound arguments, reject and all arguments passed by the last chained function', function () {
            const after = this.argumentsC;
            const before = this.boundArguments;
            this.passArguments({
              passContext,
              list: () => this.resolveChain,
              doneCallback: (config) => {
                return (function (x, y, z, reject, a, b, c) {
                  expect([x, y, z, reject, a, b, c]).toBeArguments({ mode, passContext, config, after, before });
                }).bind({}, ...before);
              }
            });

            this.passArguments({
              passContext,
              list: () => this.resolveChain,
              doneCallback: (config) => {
                return ((x, y, z, reject, a, b, c) => {
                  expect([x, y, z, reject, a, b, c]).toBeArguments({ mode, passContext, config, after, before });
                }).bind({}, ...before);
              }
            });

            this.passArguments({
              passContext,
              list: () => this.resolveChain,
              doneCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: function (x, y, z, reject, a, b, c) {
                    expect([x, y, z, reject, a, b, c]).toBeArguments({ mode, passContext, config, after, before });
                  }
                };
                return objectTemplate.methodTemplate.bind({}, ...before);
              }
            });

            this.passArguments({
              passContext,
              list: () => this.resolveChain,
              doneCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: (x, y, z, reject, a, b, c) => {
                    expect([x, y, z, reject, a, b, c]).toBeArguments({ mode, passContext, config, after, before });
                  }
                };
                return objectTemplate.methodTemplate.bind({}, ...before);
              }
            });

            this.passArguments({
              passContext,
              list: () => this.resolveChain,
              doneCallback: (config) => {
                class classTemplate {
                  methodTemplate(x, y, z, reject, a, b, c) {
                    expect([x, y, z, reject, a, b, c]).toBeArguments({ mode, passContext, config, after, before });
                  }
                }
                return new classTemplate().methodTemplate.bind({}, ...before);
              }
            });
          });
        });
      });
    });

    describe('that finally rejects', function () {
      const mode = 'catch';
      describe('and when config.passContext is set to true', function () {
        describe('the catch callback function', function () {
          it('should suit context and all arguments passed by the rejected function', function () {
            const after = this.argumentsA;
            this.passArguments({
              list: () => this.rejectSecondChain,
              catchCallback: (config) => {
                return function (context, a, b, c) {
                  expect([context, a, b, c]).toBeArguments({ mode, config, after });
                };
              }
            });

            this.passArguments({
              list: () => this.rejectSecondChain,
              catchCallback: (config) => {
                return (context, a, b, c) => {
                  expect([context, a, b, c]).toBeArguments({ mode, config, after });
                };
              }
            });

            this.passArguments({
              list: () => this.rejectSecondChain,
              catchCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: function (context, a, b, c) {
                    expect([context, a, b, c]).toBeArguments({ mode, config, after });
                  }
                };
                return objectTemplate.methodTemplate;
              }
            });

            this.passArguments({
              list: () => this.rejectSecondChain,
              catchCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: (context, a, b, c) => {
                    expect([context, a, b, c]).toBeArguments({ mode, config, after });
                  }
                };
                return objectTemplate.methodTemplate;
              }
            });

            this.passArguments({
              list: () => this.rejectSecondChain,
              catchCallback: (config) => {
                class classTemplate {
                  methodTemplate(context, a, b, c) {
                    expect([context, a, b, c]).toBeArguments({ mode, config, after });
                  }
                }
                return new classTemplate().methodTemplate;
              }
            });
          });
        });
        describe('the catch callback function that is already bound with additional arguments', function () {
          it('should suit all bound arguments, context and all arguments passed by the rejected function', function () {
            const after = this.argumentsA;
            const before = this.boundArguments;
            this.passArguments({
              list: () => this.rejectSecondChain,
              catchCallback: (config) => {
                return (function (x, y, z, context, a, b, c) {
                  expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                }).bind({}, ...before);
              }
            });

            this.passArguments({
              list: () => this.rejectSecondChain,
              catchCallback: (config) => {
                return ((x, y, z, context, a, b, c) => {
                  expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                }).bind({}, ...before);
              }
            });

            this.passArguments({
              list: () => this.rejectSecondChain,
              catchCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: function (x, y, z, context, a, b, c) {
                    expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                  }
                };
                return objectTemplate.methodTemplate.bind({}, ...before);
              }
            });

            this.passArguments({
              list: () => this.rejectSecondChain,
              catchCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: (x, y, z, context, a, b, c) => {
                    expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                  }
                };
                return objectTemplate.methodTemplate.bind({}, ...before);
              }
            });

            this.passArguments({
              list: () => this.rejectSecondChain,
              catchCallback: (config) => {
                class classTemplate {
                  methodTemplate(x, y, z, context, a, b, c) {
                    expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                  }
                }
                return new classTemplate().methodTemplate.bind({}, ...before);
              }
            });
          });
        });
      });
      describe('when config.passContext is set to false', function () {
        const passContext = false;
        describe('the catch callback function', function () {
          it('should suit all arguments passed by the rejected function', function () {
            const after = this.argumentsA;
            this.passArguments({
              passContext,
              list: () => this.rejectSecondChain,
              catchCallback: (config) => {
                return function (a, b, c) {
                  expect([a, b, c]).toBeArguments({ mode, passContext, config, after });
                };
              }
            });

            this.passArguments({
              passContext,
              list: () => this.rejectSecondChain,
              catchCallback: (config) => {
                return (a, b, c) => {
                  expect([a, b, c]).toBeArguments({ mode, passContext, config, after });
                };
              }
            });

            this.passArguments({
              passContext,
              list: () => this.rejectSecondChain,
              catchCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: function (a, b, c) {
                    expect([a, b, c]).toBeArguments({ mode, passContext, config, after });
                  }
                };
                return objectTemplate.methodTemplate;
              }
            });

            this.passArguments({
              passContext,
              list: () => this.rejectSecondChain,
              catchCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: (a, b, c) => {
                    expect([a, b, c]).toBeArguments({ mode, passContext, config, after });
                  }
                };
                return objectTemplate.methodTemplate;
              }
            });

            this.passArguments({
              passContext,
              list: () => this.rejectSecondChain,
              catchCallback: (config) => {
                class classTemplate {
                  methodTemplate(a, b, c) {
                    expect([a, b, c]).toBeArguments({ mode, passContext, config, after });
                  }
                }
                return new classTemplate().methodTemplate;
              }
            });
          });
        });
        describe('the catch callback function that is already bound with additional arguments', function () {
          it('should suit all bound arguments and all arguments passed by the rejected function', function () {
            const after = this.argumentsA;
            const before = this.boundArguments;
            this.passArguments({
              passContext,
              list: () => this.rejectSecondChain,
              catchCallback: (config) => {
                return (function (x, y, z, a, b, c) {
                  expect([x, y, z, a, b, c]).toBeArguments({ mode, passContext, config, after, before });
                }).bind({}, ...before);
              }
            });

            this.passArguments({
              passContext,
              list: () => this.rejectSecondChain,
              catchCallback: (config) => {
                return ((x, y, z, a, b, c) => {
                  expect([x, y, z, a, b, c]).toBeArguments({ mode, passContext, config, after, before });
                }).bind({}, ...before);
              }
            });

            this.passArguments({
              passContext,
              list: () => this.rejectSecondChain,
              catchCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: function (x, y, z, a, b, c) {
                    expect([x, y, z, a, b, c]).toBeArguments({ mode, passContext, config, after, before });
                  }
                };
                return objectTemplate.methodTemplate.bind({}, ...before);
              }
            });

            this.passArguments({
              passContext,
              list: () => this.rejectSecondChain,
              catchCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: (x, y, z, a, b, c) => {
                    expect([x, y, z, a, b, c]).toBeArguments({ mode, passContext, config, after, before });
                  }
                };
                return objectTemplate.methodTemplate.bind({}, ...before);
              }
            });

            this.passArguments({
              passContext,
              list: () => this.rejectSecondChain,
              catchCallback: (config) => {
                class classTemplate {
                  methodTemplate(x, y, z, a, b, c) {
                    expect([x, y, z, a, b, c]).toBeArguments({ mode, passContext, config, after, before });
                  }
                }
                return new classTemplate().methodTemplate.bind({}, ...before);
              }
            });
          });
        });
      });
    });

    describe('that finally resolves but the done callback rejects', function () {
      const mode = 'catch';
      describe('and when config.passContext is set to true', function () {
        describe('the catch callback function', function () {
          it('should suit context and all arguments passed by the rejected done function', function () {
            const after = this.argumentsC;
            this.passArguments({
              list: () => this.resolveChain,
              doneCallback: () => this.rejectDone,
              catchCallback: (config) => {
                return function (context, a, b, c) {
                  expect([context, a, b, c]).toBeArguments({ mode, config, after });
                };
              }
            });

            this.passArguments({
              list: () => this.resolveChain,
              doneCallback: () => this.rejectDone,
              catchCallback: (config) => {
                return (context, a, b, c) => {
                  expect([context, a, b, c]).toBeArguments({ mode, config, after });
                };
              }
            });

            this.passArguments({
              list: () => this.resolveChain,
              doneCallback: () => this.rejectDone,
              catchCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: function (context, a, b, c) {
                    expect([context, a, b, c]).toBeArguments({ mode, config, after });
                  }
                };
                return objectTemplate.methodTemplate;
              }
            });

            this.passArguments({
              list: () => this.resolveChain,
              doneCallback: () => this.rejectDone,
              catchCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: (context, a, b, c) => {
                    expect([context, a, b, c]).toBeArguments({ mode, config, after });
                  }
                };
                return objectTemplate.methodTemplate;
              }
            });

            this.passArguments({
              list: () => this.resolveChain,
              doneCallback: () => this.rejectDone,
              catchCallback: (config) => {
                class classTemplate {
                  methodTemplate(context, a, b, c) {
                    expect([context, a, b, c]).toBeArguments({ mode, config, after });
                  }
                }
                return new classTemplate().methodTemplate;
              }
            });
          });
        });
        describe('the catch callback function that is already bound with additional arguments', function () {
          it('should suit all bound arguments, context and all arguments passed by the rejected done function', function () {
            const after = this.argumentsC;
            const before = this.boundArguments;
            this.passArguments({
              list: () => this.resolveChain,
              doneCallback: () => this.rejectDone,
              catchCallback: (config) => {
                return (function (x, y, z, context, a, b, c) {
                  expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                }).bind({}, ...before);
              }
            });

            this.passArguments({
              list: () => this.resolveChain,
              doneCallback: () => this.rejectDone,
              catchCallback: (config) => {
                return ((x, y, z, context, a, b, c) => {
                  expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                }).bind({}, ...before);
              }
            });

            this.passArguments({
              list: () => this.resolveChain,
              doneCallback: () => this.rejectDone,
              catchCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: function (x, y, z, context, a, b, c) {
                    expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                  }
                };
                return objectTemplate.methodTemplate.bind({}, ...before);
              }
            });

            this.passArguments({
              list: () => this.resolveChain,
              doneCallback: () => this.rejectDone,
              catchCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: (x, y, z, context, a, b, c) => {
                    expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                  }
                };
                return objectTemplate.methodTemplate.bind({}, ...before);
              }
            });

            this.passArguments({
              list: () => this.resolveChain,
              doneCallback: () => this.rejectDone,
              catchCallback: (config) => {
                class classTemplate {
                  methodTemplate(x, y, z, context, a, b, c) {
                    expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                  }
                }
                return new classTemplate().methodTemplate.bind({}, ...before);
              }
            });
          });
        });
      });
      describe('when config.passContext is set to false', function () {
        const passContext = false;
        describe('the catch callback function', function () {
          it('should suit all arguments passed by the rejected done function', function () {
            const after = this.argumentsC;
            this.passArguments({
              passContext,
              list: () => this.resolveChain,
              doneCallback: () => this.rejectDone,
              catchCallback: (config) => {
                return function (a, b, c) {
                  expect([a, b, c]).toBeArguments({ mode, passContext, config, after });
                };
              }
            });

            this.passArguments({
              passContext,
              list: () => this.resolveChain,
              doneCallback: () => this.rejectDone,
              catchCallback: (config) => {
                return (a, b, c) => {
                  expect([a, b, c]).toBeArguments({ mode, passContext, config, after });
                };
              }
            });

            this.passArguments({
              passContext,
              list: () => this.resolveChain,
              doneCallback: () => this.rejectDone,
              catchCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: function (a, b, c) {
                    expect([a, b, c]).toBeArguments({ mode, passContext, config, after });
                  }
                };
                return objectTemplate.methodTemplate;
              }
            });

            this.passArguments({
              passContext,
              list: () => this.resolveChain,
              doneCallback: () => this.rejectDone,
              catchCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: (a, b, c) => {
                    expect([a, b, c]).toBeArguments({ mode, passContext, config, after });
                  }
                };
                return objectTemplate.methodTemplate;
              }
            });

            this.passArguments({
              passContext,
              list: () => this.resolveChain,
              doneCallback: () => this.rejectDone,
              catchCallback: (config) => {
                class classTemplate {
                  methodTemplate(a, b, c) {
                    expect([a, b, c]).toBeArguments({ mode, passContext, config, after });
                  }
                }
                return new classTemplate().methodTemplate;
              }
            });
          });
        });
        describe('the catch callback function that is already bound with additional arguments', function () {
          it('should suit all bound arguments and all arguments passed by the rejected done function', function () {
            const after = this.argumentsC;
            const before = this.boundArguments;
            this.passArguments({
              passContext,
              list: () => this.resolveChain,
              doneCallback: () => this.rejectDone,
              catchCallback: (config) => {
                return (function (x, y, z, a, b, c) {
                  expect([x, y, z, a, b, c]).toBeArguments({ mode, passContext, config, after, before });
                }).bind({}, ...before);
              }
            });

            this.passArguments({
              passContext,
              list: () => this.resolveChain,
              doneCallback: () => this.rejectDone,
              catchCallback: (config) => {
                return ((x, y, z, a, b, c) => {
                  expect([x, y, z, a, b, c]).toBeArguments({ mode, passContext, config, after, before });
                }).bind({}, ...before);
              }
            });

            this.passArguments({
              passContext,
              list: () => this.resolveChain,
              doneCallback: () => this.rejectDone,
              catchCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: function (x, y, z, a, b, c) {
                    expect([x, y, z, a, b, c]).toBeArguments({ mode, passContext, config, after, before });
                  }
                };
                return objectTemplate.methodTemplate.bind({}, ...before);
              }
            });

            this.passArguments({
              passContext,
              list: () => this.resolveChain,
              doneCallback: () => this.rejectDone,
              catchCallback: (config) => {
                const objectTemplate = {
                  methodTemplate: (x, y, z, a, b, c) => {
                    expect([x, y, z, a, b, c]).toBeArguments({ mode, passContext, config, after, before });
                  }
                };
                return objectTemplate.methodTemplate.bind({}, ...before);
              }
            });

            this.passArguments({
              passContext,
              list: () => this.resolveChain,
              doneCallback: () => this.rejectDone,
              catchCallback: (config) => {
                class classTemplate {
                  methodTemplate(x, y, z, a, b, c) {
                    expect([x, y, z, a, b, c]).toBeArguments({ mode, passContext, config, after, before });
                  }
                }
                return new classTemplate().methodTemplate.bind({}, ...before);
              }
            });
          });
        });
      });
    });
  });

  describe('module\'s static method', function () {
    describe('\'all\' is executed with the list of functions', function () {
      describe('that finally resolves', function () {
        const mode = 'done';
        describe('and when config.passContext is set to true', function () {
          describe('the done callback function', function () {
            it('should suit reject, context and the [Resolved] object', function () {
              const argumentsMap = this.resolveMap;
              this.passArguments({
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: (config) => {
                  return function (reject, context, map) {
                    expect([reject, context, map]).toBeArguments({ mode, config, argumentsMap });
                  };
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: (config) => {
                  return (reject, context, map) => {
                    expect([reject, context, map]).toBeArguments({ mode, config, argumentsMap });
                  };
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (reject, context, map) {
                      expect([reject, context, map]).toBeArguments({ mode, config, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (reject, context, map) => {
                      expect([reject, context, map]).toBeArguments({ mode, config, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: (config) => {
                  class classTemplate {
                    methodTemplate(reject, context, map) {
                      expect([reject, context, map]).toBeArguments({ mode, config, argumentsMap });
                    }
                  }
                  return new classTemplate().methodTemplate;
                }
              });
            });
          });
          describe('the done callback function that is already bound with additional arguments', function () {
            it('should suit all bound arguments, reject, context and the [Resolved] object', function () {
              const before = this.boundArguments;
              const argumentsMap = this.resolveMap;
              this.passArguments({
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: (config) => {
                  return (function (x, y, z, reject, context, map) {
                    expect([x, y, z, reject, context, map]).toBeArguments({ mode, config, before, argumentsMap });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: (config) => {
                  return ((x, y, z, reject, context, map) => {
                    expect([x, y, z, reject, context, map]).toBeArguments({ mode, config, before, argumentsMap });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (x, y, z, reject, context, map) {
                      expect([x, y, z, reject, context, map]).toBeArguments({ mode, config, before, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (x, y, z, reject, context, map) => {
                      expect([x, y, z, reject, context, map]).toBeArguments({ mode, config, before, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: (config) => {
                  class classTemplate {
                    methodTemplate(x, y, z, reject, context, map) {
                      expect([x, y, z, reject, context, map]).toBeArguments({ mode, config, before, argumentsMap });
                    }
                  }
                  return new classTemplate().methodTemplate.bind({}, ...before);
                }
              });
            });
          });
        });
        describe('and when config.passContext is set to false', function () {
          const passContext = false;
          describe('the done callback function', function () {
            it('should suit reject and the [Resolved] object', function () {
              const argumentsMap = this.resolveMap;
              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: (config) => {
                  return function (reject, map) {
                    expect([reject, map]).toBeArguments({ passContext, mode, config, argumentsMap });
                  };
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: (config) => {
                  return (reject, map) => {
                    expect([reject, map]).toBeArguments({ passContext, mode, config, argumentsMap });
                  };
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (reject, map) {
                      expect([reject, map]).toBeArguments({ passContext, mode, config, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (reject, map) => {
                      expect([reject, map]).toBeArguments({ passContext, mode, config, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: (config) => {
                  class classTemplate {
                    methodTemplate(reject, map) {
                      expect([reject, map]).toBeArguments({ passContext, mode, config, argumentsMap });
                    }
                  }
                  return new classTemplate().methodTemplate;
                }
              });
            });
          });
          describe('the done callback function that is already bound with additional arguments', function () {
            it('should suit all bound arguments, reject and the [Resolved] object', function () {
              const before = this.boundArguments;
              const argumentsMap = this.resolveMap;
              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: (config) => {
                  return (function (x, y, z, reject, map) {
                    expect([x, y, z, reject, map]).toBeArguments({ passContext, mode, config, before, argumentsMap });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: (config) => {
                  return ((x, y, z, reject, map) => {
                    expect([x, y, z, reject, map]).toBeArguments({ passContext, mode, config, before, argumentsMap });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (x, y, z, reject, map) {
                      expect([x, y, z, reject, map]).toBeArguments({ passContext, mode, config, before, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (x, y, z, reject, map) => {
                      expect([x, y, z, reject, map]).toBeArguments({ passContext, mode, config, before, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: (config) => {
                  class classTemplate {
                    methodTemplate(x, y, z, reject, map) {
                      expect([x, y, z, reject, map]).toBeArguments({ passContext, mode, config, before, argumentsMap });
                    }
                  }
                  return new classTemplate().methodTemplate.bind({}, ...before);
                }
              });
            });
          });
        });
      });

      describe('that finally rejects', function () {
        const mode = 'catch';
        describe('and when config.passContext is set to true', function () {
          describe('the catch callback function', function () {
            it('should suit context and all arguments passed by the rejected function', function () {
              const after = this.argumentsB;
              this.passArguments({
                methods: [move.all],
                list: () => this.rejectOneChain,
                catchCallback: (config) => {
                  return function (context, a, b) {
                    expect([context, a, b]).toBeArguments({ mode, config, after });
                  };
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.rejectOneChain,
                catchCallback: (config) => {
                  return (context, a, b) => {
                    expect([context, a, b]).toBeArguments({ mode, config, after });
                  };
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.rejectOneChain,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (context, a, b) {
                      expect([context, a, b]).toBeArguments({ mode, config, after });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.rejectOneChain,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (context, a, b) => {
                      expect([context, a, b]).toBeArguments({ mode, config, after });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.rejectOneChain,
                catchCallback: (config) => {
                  class classTemplate {
                    methodTemplate(context, a, b) {
                      expect([context, a, b]).toBeArguments({ mode, config, after });
                    }
                  }
                  return new classTemplate().methodTemplate;
                }
              });
            });
          });
          describe('the catch callback function that is already bound with additional arguments', function () {
            it('should suit all bound arguments, context and all arguments passed by the rejected function', function () {
              const after = this.argumentsB;
              const before = this.boundArguments;
              this.passArguments({
                methods: [move.all],
                list: () => this.rejectOneChain,
                catchCallback: (config) => {
                  return (function (x, y, z, context, a, b) {
                    expect([x, y, z, context, a, b]).toBeArguments({ mode, config, after, before });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.rejectOneChain,
                catchCallback: (config) => {
                  return ((x, y, z, context, a, b) => {
                    expect([x, y, z, context, a, b]).toBeArguments({ mode, config, after, before });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.rejectOneChain,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (x, y, z, context, a, b) {
                      expect([x, y, z, context, a, b]).toBeArguments({ mode, config, after, before });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.rejectOneChain,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (x, y, z, context, a, b) => {
                      expect([x, y, z, context, a, b]).toBeArguments({ mode, config, after, before });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.rejectOneChain,
                catchCallback: (config) => {
                  class classTemplate {
                    methodTemplate(x, y, z, context, a, b) {
                      expect([x, y, z, context, a, b]).toBeArguments({ mode, config, after, before });
                    }
                  }
                  return new classTemplate().methodTemplate.bind({}, ...before);
                }
              });
            });
          });
        });
        describe('and when config.passContext is set to false', function () {
          const passContext = false;
          describe('the catch callback function', function () {
            it('should suit all arguments passed by the rejected function', function () {
              const after = this.argumentsB;
              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.rejectOneChain,
                catchCallback: (config) => {
                  return function (a, b) {
                    expect([a, b]).toBeArguments({ passContext, mode, config, after });
                  };
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.rejectOneChain,
                catchCallback: (config) => {
                  return (a, b) => {
                    expect([a, b]).toBeArguments({ passContext, mode, config, after });
                  };
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.rejectOneChain,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (a, b) {
                      expect([a, b]).toBeArguments({ passContext, mode, config, after });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.rejectOneChain,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (a, b) => {
                      expect([a, b]).toBeArguments({ passContext, mode, config, after });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.rejectOneChain,
                catchCallback: (config) => {
                  class classTemplate {
                    methodTemplate(a, b) {
                      expect([a, b]).toBeArguments({ passContext, mode, config, after });
                    }
                  }
                  return new classTemplate().methodTemplate;
                }
              });
            });
          });
          describe('the catch callback function that is already bound with additional arguments', function () {
            it('should suit all bound arguments and all arguments passed by the rejected function', function () {
              const after = this.argumentsB;
              const before = this.boundArguments;
              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.rejectOneChain,
                catchCallback: (config) => {
                  return (function (x, y, z, a, b) {
                    expect([x, y, z, a, b]).toBeArguments({ passContext, mode, config, after, before });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.rejectOneChain,
                catchCallback: (config) => {
                  return ((x, y, z, a, b) => {
                    expect([x, y, z, a, b]).toBeArguments({ passContext, mode, config, after, before });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.rejectOneChain,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (x, y, z, a, b) {
                      expect([x, y, z, a, b]).toBeArguments({ passContext, mode, config, after, before });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.rejectOneChain,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (x, y, z, a, b) => {
                      expect([x, y, z, a, b]).toBeArguments({ passContext, mode, config, after, before });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.rejectOneChain,
                catchCallback: (config) => {
                  class classTemplate {
                    methodTemplate(x, y, z, a, b) {
                      expect([x, y, z, a, b]).toBeArguments({ passContext, mode, config, after, before });
                    }
                  }
                  return new classTemplate().methodTemplate.bind({}, ...before);
                }
              });
            });
          });
        });
      });

      describe('that finally resolves but the done callback rejects', function () {
        const mode = 'catch';
        describe('and when config.passContext is set to true', function () {
          describe('the catch callback function', function () {
            it('should suit context and all arguments passed by the rejected done function', function () {
              const after = this.argumentsC;
              this.passArguments({
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return function (context, a, b, c) {
                    expect([context, a, b, c]).toBeArguments({ mode, config, after });
                  };
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return (context, a, b, c) => {
                    expect([context, a, b, c]).toBeArguments({ mode, config, after });
                  };
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (context, a, b, c) {
                      expect([context, a, b, c]).toBeArguments({ mode, config, after });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (context, a, b, c) => {
                      expect([context, a, b, c]).toBeArguments({ mode, config, after });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  class classTemplate {
                    methodTemplate(context, a, b, c) {
                      expect([context, a, b, c]).toBeArguments({ mode, config, after });
                    }
                  }
                  return new classTemplate().methodTemplate;
                }
              });
            });
          });
          describe('the catch callback function that is already bound with additional arguments', function () {
            it('should suit all bound arguments, context and all arguments passed by the rejected done function', function () {
              const after = this.argumentsC;
              const before = this.boundArguments;
              this.passArguments({
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return (function (x, y, z, context, a, b, c) {
                    expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return ((x, y, z, context, a, b, c) => {
                    expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (x, y, z, context, a, b, c) {
                      expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (x, y, z, context, a, b, c) => {
                      expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  class classTemplate {
                    methodTemplate(x, y, z, context, a, b, c) {
                      expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                    }
                  }
                  return new classTemplate().methodTemplate.bind({}, ...before);
                }
              });
            });
          });
        });
        describe('and when config.passContext is set to false', function () {
          const passContext = false;
          describe('the catch callback function', function () {
            it('should suit all arguments passed by the rejected done function', function () {
              const after = this.argumentsC;
              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return function (a, b, c) {
                    expect([a, b, c]).toBeArguments({ passContext, mode, config, after });
                  };
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return (a, b, c) => {
                    expect([a, b, c]).toBeArguments({ passContext, mode, config, after });
                  };
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (a, b, c) {
                      expect([a, b, c]).toBeArguments({ passContext, mode, config, after });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (a, b, c) => {
                      expect([a, b, c]).toBeArguments({ passContext, mode, config, after });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  class classTemplate {
                    methodTemplate(a, b, c) {
                      expect([a, b, c]).toBeArguments({ passContext, mode, config, after });
                    }
                  }
                  return new classTemplate().methodTemplate;
                }
              });
            });
          });
          describe('the catch callback function that is already bound with additional arguments', function () {
            it('should suit all bound arguments and all arguments passed by the rejected done function', function () {
              const after = this.argumentsC;
              const before = this.boundArguments;
              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return (function (x, y, z, a, b, c) {
                    expect([x, y, z, a, b, c]).toBeArguments({ passContext, mode, config, after, before });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return ((x, y, z, a, b, c) => {
                    expect([x, y, z, a, b, c]).toBeArguments({ passContext, mode, config, after, before });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (x, y, z, a, b, c) {
                      expect([x, y, z, a, b, c]).toBeArguments({ passContext, mode, config, after, before });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (x, y, z, a, b, c) => {
                      expect([x, y, z, a, b, c]).toBeArguments({ passContext, mode, config, after, before });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.all],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  class classTemplate {
                    methodTemplate(x, y, z, a, b, c) {
                      expect([x, y, z, a, b, c]).toBeArguments({ passContext, mode, config, after, before });
                    }
                  }
                  return new classTemplate().methodTemplate.bind({}, ...before);
                }
              });
            });
          });
        });
      });
    });

    describe('\'each\' is executed with the list of functions', function () {
      describe('that finally resolves', function () {
        const mode = 'done';
        describe('and when config.passContext is set to true', function () {
          describe('the done callback function', function () {
            it('should suit reject, context and the [Resolved] object', function () {
              const argumentsMap = this.resolvePartlyMap;
              this.passArguments({
                methods: [move.each],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  return function (reject, context, map) {
                    expect([reject, context, map]).toBeArguments({ mode, config, argumentsMap });
                  };
                }
              });

              this.passArguments({
                methods: [move.each],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  return (reject, context, map) => {
                    expect([reject, context, map]).toBeArguments({ mode, config, argumentsMap });
                  };
                }
              });

              this.passArguments({
                methods: [move.each],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (reject, context, map) {
                      expect([reject, context, map]).toBeArguments({ mode, config, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                methods: [move.each],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (reject, context, map) => {
                      expect([reject, context, map]).toBeArguments({ mode, config, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                methods: [move.each],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  class classTemplate {
                    methodTemplate(reject, context, map) {
                      expect([reject, context, map]).toBeArguments({ mode, config, argumentsMap });
                    }
                  }
                  return new classTemplate().methodTemplate;
                }
              });
            });
          });
          describe('the done callback function that is already bound with additional arguments', function () {
            it('should suit all bound arguments, reject, context and the [Resolved] object', function () {
              const before = this.boundArguments;
              const argumentsMap = this.resolvePartlyMap;
              this.passArguments({
                methods: [move.each],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  return (function (x, y, z, reject, context, map) {
                    expect([x, y, z, reject, context, map]).toBeArguments({ mode, config, before, argumentsMap });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.each],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  return ((x, y, z, reject, context, map) => {
                    expect([x, y, z, reject, context, map]).toBeArguments({ mode, config, before, argumentsMap });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.each],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (x, y, z, reject, context, map) {
                      expect([x, y, z, reject, context, map]).toBeArguments({ mode, config, before, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.each],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (x, y, z, reject, context, map) => {
                      expect([x, y, z, reject, context, map]).toBeArguments({ mode, config, before, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.each],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  class classTemplate {
                    methodTemplate(x, y, z, reject, context, map) {
                      expect([x, y, z, reject, context, map]).toBeArguments({ mode, config, before, argumentsMap });
                    }
                  }
                  return new classTemplate().methodTemplate.bind({}, ...before);
                }
              });
            });
          });
        });
        describe('and when config.passContext is set to false', function () {
          const passContext = false;
          describe('the done callback function', function () {
            it('should suit reject and the [Resolved] object', function () {
              const argumentsMap = this.resolvePartlyMap;
              this.passArguments({
                passContext,
                methods: [move.each],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  return function (reject, map) {
                    expect([reject, map]).toBeArguments({ passContext, mode, config, argumentsMap });
                  };
                }
              });

              this.passArguments({
                passContext,
                methods: [move.each],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  return (reject, map) => {
                    expect([reject, map]).toBeArguments({ passContext, mode, config, argumentsMap });
                  };
                }
              });

              this.passArguments({
                passContext,
                methods: [move.each],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (reject, map) {
                      expect([reject, map]).toBeArguments({ passContext, mode, config, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                passContext,
                methods: [move.each],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (reject, map) => {
                      expect([reject, map]).toBeArguments({ passContext, mode, config, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                passContext,
                methods: [move.each],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  class classTemplate {
                    methodTemplate(reject, map) {
                      expect([reject, map]).toBeArguments({ passContext, mode, config, argumentsMap });
                    }
                  }
                  return new classTemplate().methodTemplate;
                }
              });
            });
          });
          describe('the done callback function that is already bound with additional arguments', function () {
            it('should suit all bound arguments, reject and the [Resolved] object', function () {
              const before = this.boundArguments;
              const argumentsMap = this.resolvePartlyMap;
              this.passArguments({
                passContext,
                methods: [move.each],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  return (function (x, y, z, reject, map) {
                    expect([x, y, z, reject, map]).toBeArguments({ passContext, mode, config, before, argumentsMap });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.each],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  return ((x, y, z, reject, map) => {
                    expect([x, y, z, reject, map]).toBeArguments({ passContext, mode, config, before, argumentsMap });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.each],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (x, y, z, reject, map) {
                      expect([x, y, z, reject, map]).toBeArguments({ passContext, mode, config, before, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.each],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (x, y, z, reject, map) => {
                      expect([x, y, z, reject, map]).toBeArguments({ passContext, mode, config, before, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.each],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  class classTemplate {
                    methodTemplate(x, y, z, reject, map) {
                      expect([x, y, z, reject, map]).toBeArguments({ passContext, mode, config, before, argumentsMap });
                    }
                  }
                  return new classTemplate().methodTemplate.bind({}, ...before);
                }
              });
            });
          });
        });
      });

      describe('that finally resolves but the done callback rejects', function () {
        const mode = 'catch';
        describe('and when config.passContext is set to true', function () {
          describe('the catch callback function', function () {
            it('should suit context and all arguments passed by the rejected done function', function () {
              const after = this.argumentsC;
              this.passArguments({
                methods: [move.each],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return function (context, a, b, c) {
                    expect([context, a, b, c]).toBeArguments({ mode, config, after });
                  };
                }
              });

              this.passArguments({
                methods: [move.each],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return (context, a, b, c) => {
                    expect([context, a, b, c]).toBeArguments({ mode, config, after });
                  };
                }
              });

              this.passArguments({
                methods: [move.each],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (context, a, b, c) {
                      expect([context, a, b, c]).toBeArguments({ mode, config, after });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                methods: [move.each],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (context, a, b, c) => {
                      expect([context, a, b, c]).toBeArguments({ mode, config, after });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                methods: [move.each],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  class classTemplate {
                    methodTemplate(context, a, b, c) {
                      expect([context, a, b, c]).toBeArguments({ mode, config, after });
                    }
                  }
                  return new classTemplate().methodTemplate;
                }
              });
            });
          });
          describe('the catch callback function that is already bound with additional arguments', function () {
            it('should suit all bound arguments, context and all arguments passed by the rejected done function', function () {
              const after = this.argumentsC;
              const before = this.boundArguments;
              this.passArguments({
                methods: [move.each],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return (function (x, y, z, context, a, b, c) {
                    expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.each],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return ((x, y, z, context, a, b, c) => {
                    expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.each],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (x, y, z, context, a, b, c) {
                      expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.each],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (x, y, z, context, a, b, c) => {
                      expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.each],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  class classTemplate {
                    methodTemplate(x, y, z, context, a, b, c) {
                      expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                    }
                  }
                  return new classTemplate().methodTemplate.bind({}, ...before);
                }
              });
            });
          });
        });
        describe('and when config.passContext is set to false', function () {
          const passContext = false;
          describe('the catch callback function', function () {
            it('should suit all arguments passed by the rejected done function', function () {
              const after = this.argumentsC;
              this.passArguments({
                passContext,
                methods: [move.each],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return function (a, b, c) {
                    expect([a, b, c]).toBeArguments({ passContext, mode, config, after });
                  };
                }
              });

              this.passArguments({
                passContext,
                methods: [move.each],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return (a, b, c) => {
                    expect([a, b, c]).toBeArguments({ passContext, mode, config, after });
                  };
                }
              });

              this.passArguments({
                passContext,
                methods: [move.each],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (a, b, c) {
                      expect([a, b, c]).toBeArguments({ passContext, mode, config, after });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                passContext,
                methods: [move.each],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (a, b, c) => {
                      expect([a, b, c]).toBeArguments({ passContext, mode, config, after });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                passContext,
                methods: [move.each],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  class classTemplate {
                    methodTemplate(a, b, c) {
                      expect([a, b, c]).toBeArguments({ passContext, mode, config, after });
                    }
                  }
                  return new classTemplate().methodTemplate;
                }
              });
            });
          });
          describe('the catch callback function that is already bound with additional arguments', function () {
            it('should suit all bound arguments and all arguments passed by the rejected done function', function () {
              const after = this.argumentsC;
              const before = this.boundArguments;
              this.passArguments({
                passContext,
                methods: [move.each],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return (function (x, y, z, a, b, c) {
                    expect([x, y, z, a, b, c]).toBeArguments({ passContext, mode, config, after, before });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.each],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return ((x, y, z, a, b, c) => {
                    expect([x, y, z, a, b, c]).toBeArguments({ passContext, mode, config, after, before });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.each],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (x, y, z, a, b, c) {
                      expect([x, y, z, a, b, c]).toBeArguments({ passContext, mode, config, after, before });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.each],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (x, y, z, a, b, c) => {
                      expect([x, y, z, a, b, c]).toBeArguments({ passContext, mode, config, after, before });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.each],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  class classTemplate {
                    methodTemplate(x, y, z, a, b, c) {
                      expect([x, y, z, a, b, c]).toBeArguments({ passContext, mode, config, after, before });
                    }
                  }
                  return new classTemplate().methodTemplate.bind({}, ...before);
                }
              });
            });
          });
        });
      });
    });

    describe('\'first\' is executed with the list of functions', function () {
      describe('that finally resolves', function () {
        const mode = 'done';
        describe('and when config.passContext is set to true', function () {
          describe('the done callback function', function () {
            it('should suit reject, context and all arguments passed by the first resolved function', function () {
              const after = this.argumentsA;
              this.passArguments({
                methods: [move.first],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  return function (reject, context, a, b, c) {
                    expect([reject, context, a, b, c]).toBeArguments({ mode, config, after });
                  };
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  return (reject, context, a, b, c) => {
                    expect([reject, context, a, b, c]).toBeArguments({ mode, config, after });
                  };
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (reject, context, a, b, c) {
                      expect([reject, context, a, b, c]).toBeArguments({ mode, config, after });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (reject, context, a, b, c) => {
                      expect([reject, context, a, b, c]).toBeArguments({ mode, config, after });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  class classTemplate {
                    methodTemplate(reject, context, a, b, c) {
                      expect([reject, context, a, b, c]).toBeArguments({ mode, config, after });
                    }
                  }
                  return new classTemplate().methodTemplate;
                }
              });
            });
          });
          describe('the done callback function that is already bound with additional arguments', function () {
            it('should suit all bound arguments, reject, context and all arguments passed by the first resolved function', function () {
              const before = this.boundArguments;
              const after = this.argumentsA;
              this.passArguments({
                methods: [move.first],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  return (function (x, y, z, reject, context, a, b, c) {
                    expect([x, y, z, reject, context, a, b, c]).toBeArguments({ mode, config, before, after });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  return ((x, y, z, reject, context, a, b, c) => {
                    expect([x, y, z, reject, context, a, b, c]).toBeArguments({ mode, config, before, after });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (x, y, z, reject, context, a, b, c) {
                      expect([x, y, z, reject, context, a, b, c]).toBeArguments({ mode, config, before, after });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (x, y, z, reject, context, a, b, c) => {
                      expect([x, y, z, reject, context, a, b, c]).toBeArguments({ mode, config, before, after });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  class classTemplate {
                    methodTemplate(x, y, z, reject, context, a, b, c) {
                      expect([x, y, z, reject, context, a, b, c]).toBeArguments({ mode, config, before, after });
                    }
                  }
                  return new classTemplate().methodTemplate.bind({}, ...before);
                }
              });
            });
          });
        });
        describe('and when config.passContext is set to false', function () {
          const passContext = false;
          describe('the done callback function', function () {
            it('should suit reject and all arguments passed by the first resolved function', function () {
              const after = this.argumentsA;
              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  return function (reject, a, b, c) {
                    expect([reject, a, b, c]).toBeArguments({ passContext, mode, config, after });
                  };
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  return (reject, a, b, c) => {
                    expect([reject, a, b, c]).toBeArguments({ passContext, mode, config, after });
                  };
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (reject, a, b, c) {
                      expect([reject, a, b, c]).toBeArguments({ passContext, mode, config, after });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (reject, a, b, c) => {
                      expect([reject, a, b, c]).toBeArguments({ passContext, mode, config, after });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  class classTemplate {
                    methodTemplate(reject, a, b, c) {
                      expect([reject, a, b, c]).toBeArguments({ passContext, mode, config, after });
                    }
                  }
                  return new classTemplate().methodTemplate;
                }
              });
            });
          });
          describe('the done callback function that is already bound with additional arguments', function () {
            it('should suit all bound arguments, reject and all arguments passed by the first resolved function', function () {
              const before = this.boundArguments;
              const after = this.argumentsA;
              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  return (function (x, y, z, reject, a, b, c) {
                    expect([x, y, z, reject, a, b, c]).toBeArguments({ passContext, mode, config, before, after });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  return ((x, y, z, reject, a, b, c) => {
                    expect([x, y, z, reject, a, b, c]).toBeArguments({ passContext, mode, config, before, after });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (x, y, z, reject, a, b, c) {
                      expect([x, y, z, reject, a, b, c]).toBeArguments({ passContext, mode, config, before, after });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (x, y, z, reject, a, b, c) => {
                      expect([x, y, z, reject, a, b, c]).toBeArguments({ passContext, mode, config, before, after });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.rejectOneChain,
                doneCallback: (config) => {
                  class classTemplate {
                    methodTemplate(x, y, z, reject, a, b, c) {
                      expect([x, y, z, reject, a, b, c]).toBeArguments({ passContext, mode, config, before, after });
                    }
                  }
                  return new classTemplate().methodTemplate.bind({}, ...before);
                }
              });
            });
          });
        });
      });

      describe('that finally rejects', function () {
        const mode = 'catch';
        describe('and when config.passContext is set to true', function () {
          describe('the catch callback function', function () {
            it('should suit context and [Rejected] object', function () {
              const argumentsMap = this.rejectMap;
              this.passArguments({
                methods: [move.first],
                list: () => this.rejectAllChain,
                catchCallback: (config) => {
                  return function (context, map) {
                    expect([context, map]).toBeArguments({ mode, config, argumentsMap });
                  };
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.rejectAllChain,
                catchCallback: (config) => {
                  return (context, map) => {
                    expect([context, map]).toBeArguments({ mode, config, argumentsMap });
                  };
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.rejectAllChain,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (context, map) {
                      expect([context, map]).toBeArguments({ mode, config, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.rejectAllChain,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (context, map) => {
                      expect([context, map]).toBeArguments({ mode, config, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.rejectAllChain,
                catchCallback: (config) => {
                  class classTemplate {
                    methodTemplate(context, map) {
                      expect([context, map]).toBeArguments({ mode, config, argumentsMap });
                    }
                  }
                  return new classTemplate().methodTemplate;
                }
              });

            });
          });
          describe('the catch callback function that is already bound with additional arguments', function () {
            it('should suit all bound arguments, context and [Rejected] object', function () {
              const argumentsMap = this.rejectMap;
              const before = this.boundArguments;
              this.passArguments({
                methods: [move.first],
                list: () => this.rejectAllChain,
                catchCallback: (config) => {
                  return (function (x, y, z, context, map) {
                    expect([x, y, z, context, map]).toBeArguments({ mode, config, before, argumentsMap });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.rejectAllChain,
                catchCallback: (config) => {
                  return ((x, y, z, context, map) => {
                    expect([x, y, z, context, map]).toBeArguments({ mode, config, before, argumentsMap });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.rejectAllChain,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (x, y, z, context, map) {
                      expect([x, y, z, context, map]).toBeArguments({ mode, config, before, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.rejectAllChain,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (x, y, z, context, map) => {
                      expect([x, y, z, context, map]).toBeArguments({ mode, config, before, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.rejectAllChain,
                catchCallback: (config) => {
                  class classTemplate {
                    methodTemplate(x, y, z, context, map) {
                      expect([x, y, z, context, map]).toBeArguments({ mode, config, before, argumentsMap });
                    }
                  }
                  return new classTemplate().methodTemplate.bind({}, ...before);
                }
              });
            });
          });
        });
        describe('and when config.passContext is set to false', function () {
          const passContext = false;
          describe('the catch callback function', function () {
            it('should suit [Rejected] object', function () {
              const argumentsMap = this.rejectMap;
              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.rejectAllChain,
                catchCallback: (config) => {
                  return function (map) {
                    expect([map]).toBeArguments({ passContext, mode, config, argumentsMap });
                  };
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.rejectAllChain,
                catchCallback: (config) => {
                  return (map) => {
                    expect([map]).toBeArguments({ passContext, mode, config, argumentsMap });
                  };
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.rejectAllChain,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (map) {
                      expect([map]).toBeArguments({ passContext, mode, config, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.rejectAllChain,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (map) => {
                      expect([map]).toBeArguments({ passContext, mode, config, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.rejectAllChain,
                catchCallback: (config) => {
                  class classTemplate {
                    methodTemplate(map) {
                      expect([map]).toBeArguments({ passContext, mode, config, argumentsMap });
                    }
                  }
                  return new classTemplate().methodTemplate;
                }
              });
            });
          });
          describe('the catch callback function that is already bound with additional arguments', function () {
            it('should suit all bound arguments and [Rejected] object', function () {
              const argumentsMap = this.rejectMap;
              const before = this.boundArguments;
              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.rejectAllChain,
                catchCallback: (config) => {
                  return (function (x, y, z, map) {
                    expect([x, y, z, map]).toBeArguments({ passContext, mode, config, before, argumentsMap });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.rejectAllChain,
                catchCallback: (config) => {
                  return ((x, y, z, map) => {
                    expect([x, y, z, map]).toBeArguments({ passContext, mode, config, before, argumentsMap });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.rejectAllChain,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (x, y, z, map) {
                      expect([x, y, z, map]).toBeArguments({ passContext, mode, config, before, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.rejectAllChain,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (x, y, z, map) => {
                      expect([x, y, z, map]).toBeArguments({ passContext, mode, config, before, argumentsMap });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.rejectAllChain,
                catchCallback: (config) => {
                  class classTemplate {
                    methodTemplate(x, y, z, map) {
                      expect([x, y, z, map]).toBeArguments({ passContext, mode, config, before, argumentsMap });
                    }
                  }
                  return new classTemplate().methodTemplate.bind({}, ...before);
                }
              });
            });
          });
        });
      });

      describe('that finally resolves but the done callback rejects', function () {
        const mode = 'catch';
        describe('and when config.passContext is set to true', function () {
          describe('the catch callback function', function () {
            it('should suit context and all arguments passed by the rejected done function', function () {
              const after = this.argumentsC;
              this.passArguments({
                methods: [move.first],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return function (context, a, b, c) {
                    expect([context, a, b, c]).toBeArguments({ mode, config, after });
                  };
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return (context, a, b, c) => {
                    expect([context, a, b, c]).toBeArguments({ mode, config, after });
                  };
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (context, a, b, c) {
                      expect([context, a, b, c]).toBeArguments({ mode, config, after });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (context, a, b, c) => {
                      expect([context, a, b, c]).toBeArguments({ mode, config, after });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  class classTemplate {
                    methodTemplate(context, a, b, c) {
                      expect([context, a, b, c]).toBeArguments({ mode, config, after });
                    }
                  }
                  return new classTemplate().methodTemplate;
                }
              });
            });
          });
          describe('the catch callback function that is already bound with additional arguments', function () {
            it('should suit all bound arguments, context and all arguments passed by the rejected done function', function () {
              const after = this.argumentsC;
              const before = this.boundArguments;
              this.passArguments({
                methods: [move.first],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return (function (x, y, z, context, a, b, c) {
                    expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return ((x, y, z, context, a, b, c) => {
                    expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (x, y, z, context, a, b, c) {
                      expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (x, y, z, context, a, b, c) => {
                      expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                methods: [move.first],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  class classTemplate {
                    methodTemplate(x, y, z, context, a, b, c) {
                      expect([x, y, z, context, a, b, c]).toBeArguments({ mode, config, after, before });
                    }
                  }
                  return new classTemplate().methodTemplate.bind({}, ...before);
                }
              });
            });
          });
        });
        describe('and when config.passContext is set to false', function () {
          const passContext = false;
          describe('the catch callback function', function () {
            it('should suit all arguments passed by the rejected done function', function () {
              const after = this.argumentsC;
              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return function (a, b, c) {
                    expect([a, b, c]).toBeArguments({ passContext, mode, config, after });
                  };
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return (a, b, c) => {
                    expect([a, b, c]).toBeArguments({ passContext, mode, config, after });
                  };
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (a, b, c) {
                      expect([a, b, c]).toBeArguments({ passContext, mode, config, after });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (a, b, c) => {
                      expect([a, b, c]).toBeArguments({ passContext, mode, config, after });
                    }
                  };
                  return objectTemplate.methodTemplate;
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  class classTemplate {
                    methodTemplate(a, b, c) {
                      expect([a, b, c]).toBeArguments({ passContext, mode, config, after });
                    }
                  }
                  return new classTemplate().methodTemplate;
                }
              });
            });
          });
          describe('the catch callback function that is already bound with additional arguments', function () {
            it('should suit all bound arguments and all arguments passed by the rejected done function', function () {
              const after = this.argumentsC;
              const before = this.boundArguments;
              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return (function (x, y, z, a, b, c) {
                    expect([x, y, z, a, b, c]).toBeArguments({ passContext, mode, config, after, before });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  return ((x, y, z, a, b, c) => {
                    expect([x, y, z, a, b, c]).toBeArguments({ passContext, mode, config, after, before });
                  }).bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: function (x, y, z, a, b, c) {
                      expect([x, y, z, a, b, c]).toBeArguments({ passContext, mode, config, after, before });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  const objectTemplate = {
                    methodTemplate: (x, y, z, a, b, c) => {
                      expect([x, y, z, a, b, c]).toBeArguments({ passContext, mode, config, after, before });
                    }
                  };
                  return objectTemplate.methodTemplate.bind({}, ...before);
                }
              });

              this.passArguments({
                passContext,
                methods: [move.first],
                list: () => this.resolveChain,
                doneCallback: () => this.rejectDone,
                catchCallback: (config) => {
                  class classTemplate {
                    methodTemplate(x, y, z, a, b, c) {
                      expect([x, y, z, a, b, c]).toBeArguments({ passContext, mode, config, after, before });
                    }
                  }
                  return new classTemplate().methodTemplate.bind({}, ...before);
                }
              });
            });
          });
        });
      });
    });
  });
});

describe('When the module is executed with the config.bind set to true and with the config.context', function () {
  describe('not defined', function () {
    describe('but with some functions in the collection that have their own context set', function () {
      it('each function with its own context in the collection should have the this keyword that refers to their own context object|value', function () {
        const context = { bind: true };
        for (let key of this.contextObjects) {
          let fnA = function (resolve) { expect(this).toBe(key); resolve(); };
          let fnB = function (resolve) { expect(this).toBe(key); resolve(); };
          this.loop((method) => method([[key, fnA], [key, fnB]], context, () => { }, () => { }));
        }
      });
    });
    describe('but with all functions in the collection that have the default context set', function () {
      it('each function in the collection should have the this keyword that refers to the default context object|value', function () {
        const config = { bind: true };
        for (let key of this.contextObjects) {
          let fnA = function (resolve) { expect(this).not.toBe(key); resolve(); };
          let fnB = function (resolve) { expect(this).not.toBe(key); resolve(); };
          this.loop((method) => method([fnA, fnB], config, () => { }, () => { }));
        }
      });
    });
  });

  describe('defined as any value', function () {
    describe('but with some functions in the collection that have their own context set', function () {
      it('each function with its own context in the collection should have the this keyword that refers to their own context object|value and each function without its own context in the collection should have the this keyword that refers to the default context object|value', function () {
        const individualContext = { name: 'Elon', age: 22 };
        for (let key of this.contextObjects) {
          let config = { bind: true, context: key };
          let fnA = function (resolve) { expect(this).toBe(individualContext); resolve(); };
          let fnB = function (resolve) { expect(this).toBe(key); resolve(); };
          this.loop((method) => method([[individualContext, fnA], fnB], config, () => { }, () => { }));
        }
      });
      it('the done and catch functions should have the this keyword that refers to the default context object|value', function () {
        const individualContext = { name: 'Elon', age: 22 };
        const fnA = function (resolve) { resolve(); };
        const fnB = function (resolve) { resolve(); };
        for (let key of this.contextObjects) {
          let config = { bind: true, context: key };
          let done = function () { expect(this).toBe(key); };
          let _catch = function () { expect(this).toBe(key); };
          this.loop((method) => method([[individualContext, fnA], fnB], config, done, _catch));
        }
      });
    });
    describe('but with all functions in the collection that have the default context set', function () {
      it('each function in the collection should have the this keyword that refers to the default context object|value', function () {
        for (let key of this.contextObjects) {
          let config = { bind: true, context: key };
          let fnA = function (resolve) { expect(this).toBe(key); resolve(); };
          let fnB = function (resolve) { expect(this).toBe(key); resolve(); };
          this.loop((method) => method([fnA, fnB], config, () => { }, () => { }));
        }
      });
      it('the done and catch functions should have the this keyword that refers to the default context object|value', function () {
        const fnA = function (resolve) { resolve(); };
        const fnB = function (resolve) { resolve(); };
        for (let key of this.contextObjects) {
          let config = { bind: true, context: key };
          let done = function () { expect(this).toBe(key); };
          let _catch = function () { expect(this).toBe(key); };
          this.loop((method) => method([fnA, fnB], config, done, _catch));
        }
      });
    });
  });
});