/* global describe, it, expect */
describe('When the module is executed', function () {
  describe('without any arguments', function () {
    it('it should throw a TypeError, that the [0] argument of [Array] type is expected', function () {
      this.loop((method) => expect(method).toThrowError(TypeError, 'move-on: Invalid argument [0]. The [undefined] argument has been passed, while the argument of type [Array] is expected.'));
    });
  });
  describe('with the first argument of incorrect type', function () {
    describe('of incorrect type', function () {
      it('it should throw a TypeError, that the [0] argument is of incorrect type and that the [Array] type is expected', function () {
        for (let [key, value] of this.types) {
          if (key === 'Array') continue;
          this.loop((method) => expect(method.bind(null, value)).toThrowError(TypeError, `move-on: Invalid argument [0]. The [${key}] argument has been passed, while the argument of type [Array] is expected.`));
        }
      });
    });
    describe('of correct type', function () {
      it('it should throw a TypeError, that the [1] argument of [Object|null] type is expected', function () {
        this.loop((method) => expect(method.bind(null, [])).toThrowError(TypeError, 'move-on: Invalid argument [1]. The [undefined] argument has been passed, while the argument of type [Object|null] is expected.'));

      });
    });
  });
  describe('with the second argument', function () {
    describe('of incorrect type, and also with the incorrect function list item', function () {
      it('it should throw a TypeError, that the [1] argument is of incorrect type and that the argument of type [Object|null] is expected', function () {
        for (let [key, value] of this.types) {
          if (key === 'Object' || key === 'null') continue;
          let msg = `move-on: Invalid argument [1]. The [${key}] argument has been passed, while the argument of type [Object|null] is expected.`;
          this.loop((method) => expect(method.bind(null, [], value)).toThrowError(TypeError, msg));
          this.loop((method) => expect(method.bind(null, [5], value)).toThrowError(TypeError, msg));
        }
      });
    });
    describe('of correct type', function () {
      it('it should throw a TypeError, that the [2] argument is of incorrect type and that the [Function] type is expected', function () {
        this.loop((method) => expect(method.bind(null, [], {})).toThrowError(TypeError, 'move-on: Invalid argument [2]. The [undefined] argument has been passed, while the argument of type [Function] is expected.'));
        this.loop((method) => expect(method.bind(null, [], null)).toThrowError(TypeError, 'move-on: Invalid argument [2]. The [undefined] argument has been passed, while the argument of type [Function] is expected.'));
      });
    });
  });
  describe('with the third argument', function () {
    describe('of incorrect type, and also with the incorrect function list item', function () {
      it('it should throw a TypeError, that the [2] argument is of incorrect type and that the [Function] type is expected', function () {
        for (let [key, value] of this.types) {
          if (key === 'Function') continue;
          let msg = `move-on: Invalid argument [2]. The [${key}] argument has been passed, while the argument of type [Function] is expected.`;
          this.loop((method) => expect(method.bind(null, [], {}, value)).toThrowError(TypeError, msg));
          this.loop((method) => expect(method.bind(null, [5], {}, value)).toThrowError(TypeError, msg));
        }
      });
    });
    describe('of correct type', function () {
      it('it should throw a TypeError, that the [3] argument is of incorrect type and that the [Function] type is expected', function () {
        this.loop((method) => expect(method.bind(null, [], {}, () => { })).toThrowError(TypeError, 'move-on: Invalid argument [3]. The [undefined] argument has been passed, while the argument of type [Function] is expected.'));
      });
    });
  });
  describe('with the fourth argument', function () {
    describe('of incorrect type, and also with the incorrect function list item', function () {
      it('it should throw a TypeError, that the [3] argument is of incorrect type and that the [Function] type is expected', function () {
        for (let [key, value] of this.types) {
          if (key === 'Function') continue;
          let msg = `move-on: Invalid argument [3]. The [${key}] argument has been passed, while the argument of type [Function] is expected.`;
          this.loop((method) => expect(method.bind(null, [], {}, () => { }, value)).toThrowError(TypeError, msg));
          this.loop((method) => expect(method.bind(null, [5], {}, () => { }, value)).toThrowError(TypeError, msg));
        }
      });
    });
  });
});