/* global beforeAll */

const path = require('path');
const move = require(path.resolve('./src/index.js'));
const type = require('of-type');

beforeAll(function () {
  this.passArguments = function ({ context = this.context, methods = [move], passContext = true, list, doneCallback = () => () => { }, catchCallback = () => () => { } } = {}) {
    const collections = {
      off: [{ context, passContext: false }],
      on: [
        null,
        { context },
        { context, passContext: 10 },
        { context, passContext: 'hello' },
        { context, passContext: {} },
        { context, passContext: undefined },
        { context, passContext: /true/ },
        { context, passContext: [1, 2, 3] },
        { context, passContext: null },
        { context, passContext: true },
      ]
    }[passContext ? 'on' : 'off'];

    for (let config of collections) {
      let getList = list(config);
      let _list = type(getList, Array) ? getList : [getList];
      for (let method of methods) method(_list, config, doneCallback(config), catchCallback(config));
    }
  };
});