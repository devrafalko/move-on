/* global beforeAll */

const path = require('path');
const move = require(path.resolve('./src/index.js'));

beforeAll(function () {
  this.loop = (callback) => {
    for (let method of [move, move.all, move.each, move.first]) callback(method);
  };
});