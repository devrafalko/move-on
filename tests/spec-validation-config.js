/* global describe, it, expect */
describe('When the module is executed with [Object] config object passed as the second argument', function () {
  describe('that defines ["context"] property with various types', function () {
    it('the module should not throw any error', function () {
      for (let item of this.types) {
        this.loop((method) => expect(method.bind(null, [() => { }, () => { }], { context: item[1] }, () => { }, () => { })).not.toThrowError());
      }
    });
  });
  describe('that defines ["passContext"] property with various types', function () {
    it('the module should not throw any error', function () {
      for (let item of this.types) {
        this.loop((method) => expect(method.bind(null, [() => { }, () => { }], { passContext: item[1] }, () => { }, () => { })).not.toThrowError());
      }
    });
  });
  describe('that defines ["bind"] property with various types', function () {
    it('the module should not throw any error', function () {
      for (let item of this.types) {
        this.loop((method) => expect(method.bind(null, [() => { }, () => { }], { bind: item[1] }, () => { }, () => { })).not.toThrowError());
      }
    });
  });
  describe('that defines ["timeout"] property with various types', function () {
    it('the module should not throw any error', function () {
      for (let item of this.types) {
        this.loop((method) => expect(method.bind(null, [() => { }, () => { }], { timeout: item[1] }, () => { }, () => { })).not.toThrowError());
      }
    });
  });
});