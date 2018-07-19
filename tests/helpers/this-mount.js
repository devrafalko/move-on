class ThisMount {
  constructor() {
    this.bindData = {
      context: { name: 'Jessica', age: 23 },
      boundContext: { employees: 442, branch: 'IT' },
      privateContext: { sentences: 123, words: 1913, errors: 72 }
    };
  }

  get _map() {
    const map = {};
    for (let type of ['functions', 'itemFunctions', 'itemStrings']) {
      map[type] = {};
      for (let b of ['simple', 'bound']) map[type][b] = {};
    }
    return map;
  }

  thisMount({ bind, method, mode, callback }) {
    this.map = this._map;
    this.mode = mode;
    this.method = method;
    this.bind = bind;

    appendFunctions(this.map, this.bindData);
    this._loopFunctions(({ fn, description, on, off }) => {
      let expected = this.bind ? on : off;
      this._callMethod(fn((actualContext) => {
        callback({
          actualContext,
          expectedContext: expected.context(actualContext),
          descriptionFunction: description,
          descriptionThis: expected.description
        });
      }));
    });
  }

  _callMethod(fn) {
    const resolveSamp = (resolve) => resolve();
    const rejectSamp = (resolve, reject) => reject();
    for (let config of this._configScenarios(this.bind, this.bindData.context)) {
      switch (this.mode) {
      case 'chain':
        this.method([fn], config, () => { }, () => { });
        break;
      case 'done':
        this.method([resolveSamp], config, fn, () => { });
        break;
      case 'catch':
        this.method([rejectSamp], config, () => { }, fn);
        break;
      }
    }
  }

  _configScenarios(bind, context) {
    return bind ? [
      { bind: true, context },
      { bind: null, context },
      { bind: 10, context },
      { bind: 'hello world', context },
      { context }
    ] : [
      { bind: false, context }
    ];
  }

  _loopFunctions(callback) {
    for (let fn in this.map.functions.simple) callback(this.map.functions.simple[fn]);
    for (let fn in this.map.functions.bound) callback(this.map.functions.bound[fn]);
    if (this.mode === 'chain') {
      for (let fn in this.map.itemFunctions.simple) callback(this.map.itemFunctions.simple[fn]);
      for (let fn in this.map.itemFunctions.bound) callback(this.map.itemFunctions.bound[fn]);
      for (let fn in this.map.itemStrings.simple) callback(this.map.itemStrings.simple[fn]);
      for (let fn in this.map.itemStrings.bound) callback(this.map.itemStrings.bound[fn]);
    }
  }
}

module.exports = function () {
  new ThisMount().thisMount(...arguments);
};

function appendFunctions(map, data) {
  const getGlobal = () => ({ context: () => global, description: 'global object' });
  const getContext = () => ({ context: () => data.context, description: 'config.context object' });
  const getLocalThis = () => ({ context: () => this, description: 'object, within the function has been defined' });
  const getUndefined = () => ({ context: () => undefined, description: 'undefined' });
  const getBound = () => ({ context: () => data.boundContext, description: 'object, that the function is already bound to' });
  const getPrivate = () => ({ context: () => data.privateContext, description: 'object, that the function is individually bound to' });

  map.functions.simple.regularFunction = {
    fn: (c) => function () { c(this); },
    description: 'function',
    on: getContext(),
    off: getGlobal()
  };

  map.functions.simple.arrowFunction = {
    fn: (c) => () => c(this),
    description: 'arrow function',
    on: getLocalThis(),
    off: getLocalThis()
  };

  map.functions.simple.regularMethod = {
    fn: (c) => ({ m: function () { c(this); } }.m),
    description: 'object\'s method',
    on: getContext(),
    off: getGlobal()
  };

  map.functions.simple.arrowMethod = {
    fn: (c) => ({ m: () => { c(this); } }.m),
    description: 'object\'s arrow method',
    on: getLocalThis(),
    off: getLocalThis()
  };

  map.functions.simple.instanceMethod = {
    fn: (c) => new (class { m() { c(this); } })().m,
    description: 'instance\'s method',
    on: getContext(),
    off: getUndefined()
  };

  map.functions.bound.regularFunction = {
    fn: (c) => (function () { c(this); }).bind(data.boundContext),
    description: 'bound function',
    on: getBound(),
    off: getBound()
  };

  map.functions.bound.arrowFunction = {
    fn: (c) => (() => c(this)).bind(data.boundContext),
    description: 'bound arrow function',
    on: getLocalThis(),
    off: getLocalThis()
  };


  map.functions.bound.regularMethod = {
    fn: (c) => ({ m: (function () { c(this); }).bind(data.boundContext) }.m),
    description: 'bound object\'s method',
    on: getBound(),
    off: getBound()
  };

  map.functions.bound.arrowMethod = {
    fn: (c) => ({ m: (() => { c(this); }).bind(data.boundContext) }.m),
    description: 'bound object\'s arrow method',
    on: getLocalThis(),
    off: getLocalThis()
  };

  map.functions.bound.instanceMethod = {
    fn: (c) => (new (class { m() { c(this); } })().m).bind(data.boundContext),
    description: 'bound instance\'s method',
    on: getBound(),
    off: getBound()
  };

  map.itemFunctions.simple.regularFunction = {
    fn: (c) => [data.privateContext, function () { c(this); }],
    description: 'function passed as [Array][Function] item',
    on: getPrivate(),
    off: getPrivate()
  };

  map.itemFunctions.simple.arrowFunction = {
    fn: (c) => [data.privateContext, () => c(this)],
    description: 'arrow function passed as [Array][Function] item',
    on: getLocalThis(),
    off: getLocalThis()
  };

  map.itemFunctions.simple.regularMethod = {
    fn: (c) => [data.privateContext, { m: function () { c(this); } }.m],
    description: 'object\'s method passed as [Array][Function] item',
    on: getPrivate(),
    off: getPrivate()
  };

  map.itemFunctions.simple.arrowMethod = {
    fn: (c) => [data.privateContext, { m: () => { c(this); } }.m],
    description: 'object\'s arrow method passed as [Array][Function] item',
    on: getLocalThis(),
    off: getLocalThis()
  };

  map.itemFunctions.simple.instanceMethod = {
    fn: (c) => [data.privateContext, new (class { m() { c(this); } })().m],
    description: 'instance\'s method passed as [Array][Function] item',
    on: getPrivate(),
    off: getPrivate()
  };

  map.itemFunctions.bound.regularFunction = {
    fn: (c) => [data.privateContext, (function () { c(this); }).bind(data.boundContext)],
    description: 'bound function passed as [Array][Function] item',
    on: getBound(),
    off: getBound()
  };

  map.itemFunctions.bound.arrowFunction = {
    fn: (c) => [data.privateContext, (() => c(this)).bind(data.boundContext)],
    description: 'bound arrow function passed as [Array][Function] item',
    on: getLocalThis(),
    off: getLocalThis()
  };

  map.itemFunctions.bound.regularMethod = {
    fn: (c) => [data.privateContext, { m: (function () { c(this); }).bind(data.boundContext) }.m],
    description: 'bound object\'s method passed as [Array][Function] item',
    on: getBound(),
    off: getBound()
  };

  map.itemFunctions.bound.arrowMethod = {
    fn: (c) => [data.privateContext, { m: (() => { c(this); }).bind(data.boundContext) }.m],
    description: 'bound object\'s arrow method passed as [Array][Function] item',
    on: getLocalThis(),
    off: getLocalThis()
  };

  map.itemFunctions.bound.instanceMethod = {
    fn: (c) => [data.privateContext, (new (class { m() { c(this); } })().m).bind(data.boundContext)],
    description: 'bound instance\'s method passed as [Array][Function] item',
    on: getBound(),
    off: getBound()
  };

  map.itemStrings.simple.regularMethod = {
    fn: (c) => [{ m: function () { c(this); } }, 'm'],
    description: 'object\'s method passed as [Array][String] item',
    on: { context: (c) => c, description: 'object passed as [Array][Object] [0] item.' },
    off: { context: (c) => c, description: 'object passed as [Array][Object] [0] item.' }
  };

  map.itemStrings.simple.arrowMethod = {
    fn: (c) => [{ m: () => { c(this); } }],
    description: 'object\'s arrow method passed as [Array][String] item',
    on: getLocalThis(),
    off: getLocalThis()
  };

  map.itemStrings.simple.instanceMethod = {
    fn: (c) => [new (class { m() { c(this); } })(), 'm'],
    description: 'instance\'s method passed as [Array][String] item',
    on: { context: (c) => c, description: 'instance object passed as [Array][Object] [0] item.' },
    off: { context: (c) => c, description: 'instance object passed as [Array][Object] [0] item.' }
  };

  map.itemStrings.bound.regularMethod = {
    fn: (c) => [{ m: (function () { c(this); }).bind(data.boundContext) }, 'm'],
    description: 'bound object\'s method passed as [Array][String] item',
    on: getBound(),
    off: getBound()
  };

  map.itemStrings.bound.arrowMethod = {
    fn: (c) => [{ m: (() => { c(this); }).bind(data.boundContext) }, 'm'],
    description: 'bound object\'s arrow method passed as [Array][String] item',
    on: getLocalThis(),
    off: getLocalThis()
  };
}