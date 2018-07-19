const args = require('typeof-arguments');
const type = require('of-type');
const moduleName = 'move-on';

class Utils {
  constructor(l) {
    Object.defineProperty(this, '_listLength', { value: l });
  }
  _add(i, arr) {
    let args = type(arr, 'arguments') ? Array.prototype.slice.call(arr, 0) : arr;
    this[i] = args;
  }

  get missing() {
    const list = [];
    for (let i = 0; i < this._listLength; i++) {
      if (!type(this[i], Array)) list.push(i);
    }
    return list;
  }

  forEach(callback) {
    args(arguments, [Function], (o) => { throw new TypeError(`${moduleName}: forEach: ${o.message}`); });
    for (let argsIndex of Object.keys(this)) {
      callback(this[argsIndex], Number(argsIndex), this);
    }
  }

  forAll(callback) {
    args(arguments, [Function], (o) => { throw new TypeError(`${moduleName}: forAll: ${o.message}`); });
    for (let argsIndex of Object.keys(this)) {
      for (let itemIndex in this[argsIndex]) callback(this[argsIndex][itemIndex], Number(argsIndex), Number(itemIndex), this);
    }
  }
}

class Resolved extends Utils {
  constructor(l) {
    super(l);
  }
}
class Rejected extends Utils {
  constructor(l) {
    super(l);
  }
}

class Timeout {
  constructor({ time, callback }) {
    this._time = time;
    this._callback = callback;
    this._pending = false;
    this._timedOut = false;
    this._quietMode = false;
    this._mount();
  }

  get timedOut() {
    return this._timedOut;
  }

  get _timeoutError() {
    const err = new Error();
    err.message = `Timeout. The chained function did not respond in the expected time of ${this._time} ms.`;
    err.info = 'timeout';
    err.code = 'ETIMEDOUT';
    return err;
  }

  _mount() {
    this._pending = true;
    this._timer = setTimeout(() => {
      this._pending = false;
      this._timedOut = true;
      if (!this._quietMode) this._callback(this._timeoutError);
    }, this._time);
  }

  unmount() {
    if (this._pending) {
      clearTimeout(this._timer);
      this._pending = false;
    }
  }

  quiet() {
    if (this._pending) this._quietMode = true;
  }

}

class MoveOn {
  constructor(mode, args) {
    this._mode = mode;
    this._init(...args);
  }

  get error() {
    return {
      incorrectListItem: (i) => new TypeError(`${moduleName}: Invalid argument [0]. Incorrect [${i}] item type. The item of [Function|Array] type is expected.`),
      incorrectObjectItem: (i) => new TypeError(`${moduleName}: Invalid argument [0]. Incorrect [${i}][0] item. The item of [Object] type is expected.`),
      incorrectMethodItem: (i, index) => new TypeError(`${moduleName}: Invalid argument [0]. Incorrect [${i}][${index}] item. The [Function|String] item is expected.`),
      incorrectMethodName: (name, i, index) => new TypeError(`${moduleName}: Invalid argument [0]. Incorrect [${i}][${index}] item. The given [${i}][0] object does not define ["${name}"] method.`),
    };
  }

  get defaults() {
    return {
      timeout: 10000,
      bind: true,
      context: {},
      passContext: true
    };
  }

  get listLength() {
    let iter = 0;
    for (let i = 0; i < this.list.length; i++) {
      if (type(this.list[i], Function)) iter++;
      else if (type(this.list[i], Array)) iter += this.list[i].length - 1;
    }
    return iter;
  }

  get timeoutConfig() {
    return { time: this.config.timeout, callback: this.finalCatch };
  }

  get timeoutDefined() {
    return !(this.config.timeout === null || this.config.timeout === Infinity);
  }

  _validateArguments(argumentsObject) {
    const validationTypes = [Array, [Object, null], Function, Function];
    args(argumentsObject, validationTypes, (o) => { throw new TypeError(`${moduleName}: ${o.message}`); });
  }

  _validateFunctionList(list) {
    this.list = list;
    for (let i in this.list) {
      let fun = this.list[i];
      if (!type(fun, [Function, Array])) throw this.error.incorrectListItem(i);
      if (type(fun, Array)) {
        if (fun.length === 0) continue;
        if (!type(fun[0], 'Object|instance')) throw this.error.incorrectObjectItem(i);
        fun.forEach((item, index) => {
          if (index !== 0 && !type(item, [String, Function])) throw this.error.incorrectMethodItem(i, index);
          if (index !== 0 && type(item, String) && !type(fun[0][item], Function)) throw this.error.incorrectMethodName(item, i, index);
        });
      }
    }
  }

  _validateConfig(config) {
    this.config = this.defaults;
    if (type(config, null)) return;
    if (config.hasOwnProperty('timeout') && type(config.timeout, null) || ((type(config.timeout, Number)) & config.timeout >= 0 & Math.round(config.timeout) === config.timeout && !isNaN(config.timeout))) this.config.timeout = config.timeout;
    if (config.hasOwnProperty('bind') && type(config.bind, Boolean)) this.config.bind = config.bind;
    if (config.hasOwnProperty('context') && type(config.context, 'Object|instance')) this.config.context = config.context;
    if (config.hasOwnProperty('passContext') && type(config.passContext, Boolean)) this.config.passContext = config.passContext;
  }

  _init(list, config, onDone, onCatch) {
    this._validateArguments(arguments);
    this._validateFunctionList(list);
    this._validateConfig(config);

    this.finalCatch = this._bind({
      caller: onCatch
    });
    this.finalDone = this._bind({
      caller: onDone,
      reject: this.finalCatch
    });
    this[this._mode]();
  }

  _moveOn() {
    const finalChain = this.list.reduceRight((chain, next) => {
      if (type(next, Function)) {
        let config = {
          caller: next,
          resolve: chain,
          reject: this.finalCatch,
          timeout: true
        };
        return this._bind(config);
      }
      let innerContext = next[0];
      return next.reduceRight((innerChain, innerNext, index) => {
        if (index === 0) return innerChain;
        return this._bind({
          caller: [innerContext, innerNext],
          resolve: innerChain,
          reject: this.finalCatch,
          timeout: true
        });
      }, chain);
    }, this.finalDone);
    finalChain();
  }

  _moveAll() {
    const alreadyResolvedMap = new Map();
    const timeout = this.timeoutDefined ? new Timeout(this.timeoutConfig) : null;
    const resolveData = new Resolved(this.listLength);
    let alreadyRejected = false;
    let iterator = 0;
    const callback = (iter, resolve) => {
      return (function () {
        if (alreadyResolvedMap.get(iter) === true || alreadyRejected) return;
        if (resolve) {
          alreadyResolvedMap.set(iter, true);
          resolveData._add(iter, arguments);
          if (++iterator === this.listLength) {
            if (timeout) timeout.unmount();
            if (!(timeout && timeout.timedOut)) this.finalDone(resolveData);
          }
        } else {
          if (timeout) timeout.unmount();
          if (!(timeout && timeout.timedOut)) this.finalCatch(...arguments);
          alreadyRejected = true;
        }
      }).bind(this);
    };
    this._loopChain((item, iter, stop) => {
      this._bind({
        caller: item,
        resolve: callback(iter, true),
        reject: callback(iter, false)
      })();
      if (alreadyRejected) return stop();
    }, this.finalDone);
  }

  _moveEach() {
    const alreadyResolvedMap = new Map();
    const timeout = this.timeoutDefined ? new Timeout(this.timeoutConfig) : null;
    const resolveData = new Resolved(this.listLength);
    let iterator = 0;
    const callback = (iter, resolve) => {
      return (function () {
        if (alreadyResolvedMap.get(iter) === true) return;
        alreadyResolvedMap.set(iter, true);
        if (resolve) resolveData._add(iter, arguments);
        if (!resolve && !(timeout && timeout.timedOut)) this.finalCatch(...arguments);
        if (++iterator === this.listLength) {
          if (timeout) timeout.unmount();
          if (!(timeout && timeout.timedOut)) this.finalDone(resolveData);
        }
      }).bind(this);
    };
    this._loopChain((item, iter) => {
      this._bind({
        caller: item,
        resolve: callback(iter, true),
        reject: callback(iter, false)
      })();
    }, this.finalDone);
  }

  _moveFirst() {
    const alreadyRejectedMap = new Map();
    const timeout = this.timeoutDefined ? new Timeout(this.timeoutConfig) : null;
    const rejectData = new Rejected(this.listLength);
    let alreadyResolved = false;
    let iterator = 0;
    const callback = (iter, resolve) => {
      return (function () {
        if (alreadyRejectedMap.get(iter) === true || alreadyResolved) return;
        if (resolve) {
          if (timeout) timeout.unmount();
          if (!(timeout && timeout.timedOut)) this.finalDone(...arguments);
          alreadyResolved = true;
        } else {
          alreadyRejectedMap.set(iter, true);
          rejectData._add(iter, arguments);
          if (++iterator === this.listLength) {
            if (timeout) timeout.unmount();
            if (!(timeout && timeout.timedOut)) this.finalCatch(rejectData);
          }
        }
      }).bind(this);
    };
    this._loopChain((item, iter, stop) => {
      this._bind({
        caller: item,
        resolve: callback(iter, true),
        reject: callback(iter, false)
      })();
      if (alreadyResolved) return stop();
    }, this.finalDone);
  }

  _loopChain(callback, empty) {
    let iter = 0;
    let stop = () => shouldStop = true;
    let shouldStop = false;
    for (let item of this.list) {
      if (type(item, Function)) callback(item, iter++, stop);
      else for (let i = 1; i < item.length; i++) {
        callback([item[0], item[i]], iter++, stop);
        if (shouldStop) break;
      }
      if (shouldStop) break;
    }
    if (iter === 0) empty();
  }

  _bind({ caller, resolve, reject, timeout } = {}) {
    const context = this.config.passContext ? [this.config.context] : [];

    return ((function () {
      const timer = (this.timeoutDefined && timeout) ? new Timeout(this.timeoutConfig) : null;
      const defaults = [];
      this._middleChain(defaults, resolve, 'resolve', timer);
      this._middleChain(defaults, reject, 'reject', timer);
      const args = [...defaults, ...context];
      return type(caller, Array) ?
        type(caller[1], Function) ?
          caller[1].call(caller[0], ...args, ...arguments) :
          caller[0][caller[1]](...args, ...arguments) :
        this.config.bind ?
          caller.call(this.config.context, ...args, ...arguments) :
          caller(...args, ...arguments);
    }).bind(this));
  }

  _middleChain(arr, next, name, timer) {
    if (type(next, Function)) arr.push(Object.defineProperty((function () {
      if (timer) timer.quiet();
      if (timer && timer.timedOut) return;
      next(...arguments);
    }).bind(this), 'name', { value: name }));
  }
}

function moveOn() {
  new MoveOn('_moveOn', arguments);
}

const statics = {
  all: {
    value: function () {
      new MoveOn('_moveAll', arguments);
    }
  },
  each: {
    value: function () {
      new MoveOn('_moveEach', arguments);
    }
  },
  first: {
    value: function () {
      new MoveOn('_moveFirst', arguments);
    }
  }
};

module.exports = Object.defineProperties(moveOn, statics);