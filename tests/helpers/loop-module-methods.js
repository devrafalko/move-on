/* global beforeAll */

import move from './../../src/move-on.js';

beforeAll(function () {
  this.loop = (callback) => {
    for (let method of [move, move.all, move.each, move.first]) callback(method);
  };
});