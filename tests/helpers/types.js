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

  this.contextObjects = [
    /* in non-stric mode the this keyword refers to the primitive values' instances
       and when function is bound to null, the this keyword refers to the global scope */
    'hello world',
    234,
    true,
    new Date(),
    Date,
    function hello() { },
    null,
    undefined,
    this.objectTemplate,
    [1, 2, 3, 'hello world'],
    /hello/g,
    new class Workers { }
  ];
});