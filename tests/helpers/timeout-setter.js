/* global jasmine, beforeAll, expect */

import move from './../../src/move-on.js';
import type from 'of-type';

class TimeoutChain {
  constructor(onDone, onCatch) {
    this.onDone = onDone;
    this.onCatch = onCatch;
    this.currentDone = onDone.calls.count();
    this.currentCatch = onDone.calls.count();
  }

  after(v) {
    jasmine.clock().tick(v - 1);
    this.keep();
    jasmine.clock().tick(1);
    return this;
  }

  done(v) {
    const getCalls = this.onDone.calls.count();
    expect(getCalls).toBe(v);
    this.currentDone = getCalls;
    return this;
  }

  catch(v) {
    const getCalls = this.onCatch.calls.count();
    expect(getCalls).toBe(v);
    this.currentCatch = getCalls;
    return this;
  }

  keep() {
    expect(this.onDone.calls.count()).toBe(this.currentDone);
    expect(this.onCatch.calls.count()).toBe(this.currentCatch);
    return this;
  }

  timeout() {
    expect(this.onCatch.calls.count()).toBe(this.currentCatch + 1);
    expect(this.onCatch).toHaveBeenCalledWith(jasmine.objectContaining({}), jasmine.objectContaining({ code: 'ETIMEDOUT', info: 'timeout' }));
    this.currentCatch++;
    return this;
  }
}

class Timeout {
  constructor() {
    this.defaultTimeout = 10000;
  }
  timeout({ list, timeout = 'default', method = move, callback }) {
    this._validateArguments(list, timeout, method, callback);
    const configs = this._getConfigScenarios(timeout);
    for (let config of configs) {
      jasmine.clock().install();
      let onDone = jasmine.createSpy('onDone');
      let onCatch = jasmine.createSpy('onCatch');
      method(list, config, onDone, onCatch);
      callback(new TimeoutChain(onDone, onCatch));
      jasmine.clock().uninstall();
    }
  }

  _validateArguments(list, timeout, method, callback) {
    if (!type(list, Array)) throw new TypeError('The timeout method expects ["list"] property to be of [Array] type.');
    if (!type(timeout, [Number, String])) throw new TypeError('The timeout method expects ["timeout"] property to be of [String|Number] type.');
    if (type(timeout, Number) && (timeout < 0 || timeout === Infinity || isNaN(timeout) || Math.round(timeout) !== timeout)) throw new Error('The timeout method expects ["timeout"] property to be [Number] integer bigger or equal than zero.');
    if (type(timeout, String) && timeout !== 'default' && timeout !== 'off') throw new Error('The timeout method expects ["timeout"] property to be [String] "default" or "off" value.');
    if (!type(method, Function)) throw new TypeError('The timeout method expects ["method"] property to be of [Function] type.');
    if (!type(callback, Function)) throw new TypeError('The timeout method expects ["callback"] property to be of [Function] type.');
  }

  _getConfigScenarios(timeout) {
    if (timeout === 'default') return this._defaultTimeoutConfig;
    if (timeout === 'off') return this._offTimeoutConfig;
    if (type(timeout, Number)) return [{ timeout }];
  }

  get _defaultTimeoutConfig() {
    return [
      null,
      {},
      { timeout: false },
      { timeout: 'hello world' },
      { timeout: /hello/ },
      { timeout: {} },
      { timeout: [] },
      { timeout: new Date() },
      { timeout: -1 },
      { timeout: -1.5 },
      { timeout: 3.33 },
      { timeout: -Infinity },
      { timeout: NaN },
    ];
  }

  get _offTimeoutConfig() {
    return [
      { timeout: null },
      { timeout: Infinity },
    ];
  }
}

beforeAll(function () {
  this.timeout = function timeout() {
    new Timeout().timeout(...arguments);
  };
});