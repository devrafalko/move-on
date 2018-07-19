/* global expect, beforeAll, jasmine */

beforeAll(function () {
  this.ChainBuilder = class ChainBuilder {
    constructor(context) {
      this.context = context;
      this._iteratorMap = {};
      this._chainCollection = [];
      this._createCollection(this.context.spies);
    }

    add() {
      const names = Array.prototype.slice.call(arguments);
      for (let name of names) {
        this._iteratorMap[name]++;
        this._push(name);
      }
      for (let name of names) expect(this.context.f[name].calls.count()).toEqual(this._iteratorMap[name]);
      expect(this.context.f.order).toHaveItems(this._chainCollection);
      return this;
    }

    keep() {
      const names = arguments.length ? Array.prototype.slice.call(arguments) : this.context.spies;
      for (let name of names) {
        expect(this.context.f[name].calls.count()).toEqual(this._iteratorMap[name]);
      }
      expect(this.context.f.order).toHaveItems(this._chainCollection);
      return this;
    }

    after(val) {
      if (typeof val !== 'number') throw new TypeError('The ["after"] method expects the [0] argument to be of [Number] type.');
      jasmine.clock().tick(val - 1);
      this.keep();
      jasmine.clock().tick(1);
      return this;
    }

    _createCollection(spies) {
      for (let name of spies) {
        this._iteratorMap[name] = 0;
      }
    }

    _push() {
      Array.prototype.push.apply(this._chainCollection, Array.prototype.slice.call(arguments));
      return this._chainCollection;
    }

  };
});