/* global beforeAll */

beforeAll(function () {
  this.objectTemplate = {
    greet: function () {
      return 'hello world!';
    },
    names: function () {
      return ['Amanda', 'Jasmine'];
    }
  };
  this.types = new Map([
    ['String', 'hello world'],
    ['Number', 234],
    ['Number', -234],
    ['Boolean', true],
    ['Date', new Date()],
    ['Function', function () { }],
    ['null', null],
    ['undefined', undefined],
    ['Object', this.objectTemplate],
    ['Array', []],
    ['RegExp', /hello/g],
    ['Workers', new class Workers { }]
  ]);
});