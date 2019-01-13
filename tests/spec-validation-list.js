/* global describe, it, expect */
describe('When the module is executed with all arguments of correct types and with the first [Array] argument', function () {
  describe('that is empty', function () {
    it('it should not throw any errors', function () {
      this.loop((method) => expect(method.bind(null, [], {}, () => { }, () => { })).not.toThrowError());
    });
  });
  describe('that contains some item of incorrect type', function () {
    it('it should throw a TypeError that this item is of incorrect type', function () {
      for (let [key, value] of this.types) {
        if (key === 'Function' || key === 'Array') continue;
        this.loop((method) => expect(method.bind(null, [() => { }, () => { }, value, []], {}, () => { }, () => { })).toThrowError(TypeError, 'move-on: Invalid argument [0]. Incorrect [2] item type. The item of [Function|Array] type is expected.'));
        this.loop((method) => expect(method.bind(null, [value, () => { }, () => { }, []], {}, () => { }, () => { })).toThrowError(TypeError, 'move-on: Invalid argument [0]. Incorrect [0] item type. The item of [Function|Array] type is expected.'));
        this.loop((method) => expect(method.bind(null, [() => { }, [this.objectTemplate, 'greet'], () => { }, () => { }, value, () => { }], {}, () => { }, () => { })).toThrowError(TypeError, 'move-on: Invalid argument [0]. Incorrect [4] item type. The item of [Function|Array] type is expected.'));
      }
    });
  });
  describe('that contains some [Array] item', function () {
    describe('that is empty', function () {
      it('it should not throw any errors', function () {
        this.loop((method) => expect(method.bind(null, [() => { }, [], () => { }], {}, () => { }, () => { })).not.toThrowError());
      });
    });
    describe('that contains only one [Object] item', function () {
      it('it should not throw any errors', function () {
        this.loop((method) => expect(method.bind(null, [() => { }, [this.objectTemplate], () => { }], {}, () => { }, () => { })).not.toThrowError());
      });
    });
    describe('that contains only one value item of any type', function () {
      it('it should not throw any errors', function () {
        for (let [value] of this.types) {
          this.loop((method) => expect(method.bind(null, [() => { }, [value], () => { }], {}, () => { }, () => { })).not.toThrowError());
        }
      });
    });
    describe('that contains first item of any type and the further [Function] items', function () {
      it('it should not throw any errors', function () {
        for (let [value] of this.types) {
          this.loop((method) => expect(method.bind(null, [() => { }, [value, ()=>{}, ()=>{}], () => { }], {}, () => { }, () => { })).not.toThrowError());
        }
      });
    });
    describe('of which the second or farther item is of incorrect type', function () {
      it('it should throw a TypeError that this item is of incorrect type and that the [Function|String] type is expected', function () {
        for (let [key, value] of this.types) {
          if (key === 'String' || key === 'Function') continue;
          this.loop((method) => expect(method.bind(null, [() => { }, [this.objectTemplate, value, 'names'], () => { }], {}, () => { }, () => { })).toThrowError(TypeError, 'move-on: Invalid argument [0]. Incorrect [1][1] item. The [Function|String] item is expected.'));
          this.loop((method) => expect(method.bind(null, [() => { }, () => { }, [this.objectTemplate, 'greet', value], () => { }], {}, () => { }, () => { })).toThrowError(TypeError, 'move-on: Invalid argument [0]. Incorrect [2][2] item. The [Function|String] item is expected.'));
          this.loop((method) => expect(method.bind(null, [[this.objectTemplate, 'names', value, 'greet'], () => { }], {}, () => { }, () => { })).toThrowError(TypeError, 'move-on: Invalid argument [0]. Incorrect [0][2] item. The [Function|String] item is expected.'));
        }
      });
    });
    describe('of which the second or farther [String] item does not indicate the name of the given object\'s method', function () {
      it('it should throw a TypeError that the given object does not define this method', function () {
        this.loop((method) => expect(method.bind(null, [() => { }, [this.objectTemplate, 'greet', 'hello', 'names'], () => { }], {}, () => { }, () => { })).toThrowError(TypeError, 'move-on: Invalid argument [0]. Incorrect [1][2] item. The given [1][0] object does not define ["hello"] method.'));
        this.loop((method) => expect(method.bind(null, [[this.objectTemplate, this.objectTemplate.names, 'greet', 'workers'], () => { }], {}, () => { }, () => { })).toThrowError(TypeError, 'move-on: Invalid argument [0]. Incorrect [0][3] item. The given [0][0] object does not define ["workers"] method.'));
        this.loop((method) => expect(method.bind(null, [() => { }, () => { }, [this.objectTemplate, 'tasks', 'names', this.objectTemplate.greet], () => { }], {}, () => { }, () => { })).toThrowError(TypeError, 'move-on: Invalid argument [0]. Incorrect [2][1] item. The given [2][0] object does not define ["tasks"] method.'));
        for (let [value] of this.types) {
          this.loop((method) => expect(method.bind(null, [() => { }, () => { }, [value, '_names'], () => { }], {}, () => { }, () => { })).toThrowError(TypeError, 'move-on: Invalid argument [0]. Incorrect [2][1] item. The given [2][0] object does not define ["_names"] method.'));
          this.loop((method) => expect(method.bind(null, [() => { }, () => { }, () => { }, [value, '_hello']], {}, () => { }, () => { })).toThrowError(TypeError, 'move-on: Invalid argument [0]. Incorrect [3][1] item. The given [3][0] object does not define ["_hello"] method.'));
        }
      });
    });
  });
  describe('that contains all items of correct types', function () {
    it('it should not throw any errors', function () {
      this.loop((method) => expect(method.bind(null, [() => { }], {}, () => { }, () => { })).not.toThrowError());
      this.loop((method) => expect(method.bind(null, [() => { }, () => { }, () => { }], {}, () => { }, () => { })).not.toThrowError());
      this.loop((method) => expect(method.bind(null, [() => { }, [this.objectTemplate, 'greet', 'names'], () => { }], {}, () => { }, () => { })).not.toThrowError());
      this.loop((method) => expect(method.bind(null, [() => { }, [this.objectTemplate, 'greet', this.objectTemplate.names], () => { }], {}, () => { }, () => { })).not.toThrowError());
      this.loop((method) => expect(method.bind(null, [() => { }, [this.objectTemplate, this.objectTemplate.names, this.objectTemplate.greet], () => { }], {}, () => { }, () => { })).not.toThrowError());
      this.loop((method) => expect(method.bind(null, [() => { }, () => { }, [this.objectTemplate, this.objectTemplate.names, this.objectTemplate.greet], () => { }], {}, () => { }, () => { })).not.toThrowError());
      this.loop((method) => expect(method.bind(null, [[this.objectTemplate, 'greet'], () => { }, [this.objectTemplate, 'names']], {}, () => { }, () => { })).not.toThrowError());
    });
  });
});