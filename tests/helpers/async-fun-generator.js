/* global beforeAll */
const type = require('of-type');

beforeAll(function () {
  this.asyncFun = function ({ resolves, rejects } = {}) {
    validateArguments(resolves, rejects);
    let res = type(resolves, Number) ? [resolves] : type(resolves, undefined) ? [] : resolves;
    let rej = type(rejects, Number) ? [rejects] : type(rejects, undefined) ? [] : rejects;
    return function (resolve, reject) {
      for (let time of res) setTimeout(resolve, time);
      for (let time of rej) setTimeout(reject, time);
    };

    function validateArguments(resolves, rejects) {
      if (!type(resolves, [Number, Array, undefined])) throw new TypeError('The asyncFun method expects ["resolves"] property to be of [Number|Array] type.');
      if (type(resolves, Number) && isNumberValid(resolves)) throw new Error('The asyncFun method expects ["resolves"] [Number] value to be an integer equal or bigger than zero.');
      if (type(resolves, Array)) {
        for (let item of resolves) {
          if (!type(item, Number)) throw new Error('The asyncFun method expects ["resolves"] each item to be of [Number] type');
          if (isNumberValid(item)) throw new Error('The asyncFun method expects ["resolves"] each item to be [Number] an integer equal or bigger than zero.');
        }
      }
      if (!type(rejects, [Number, Array, undefined])) throw new TypeError('The asyncFun method expects ["rejects"] property to be of [Number|Array] type.');
      if (type(rejects, Number) && isNumberValid(rejects)) throw new Error('The asyncFun method expects ["rejects"] [Number] value to be an integer equal or bigger than zero.');
      if (type(rejects, Array)) {
        for (let item of rejects) {
          if (!type(item, Number)) throw new Error('The asyncFun method expects ["rejects"] each item to be of [Number] type');
          if (isNumberValid(item)) throw new Error('The asyncFun method expects ["rejects"] each item to be [Number] an integer equal or bigger than zero.');
        }
      }
    }

    function isNumberValid(value) {
      return (!type(value, Number) || value < 0 || value === Infinity || isNaN(value) || Math.round(value) !== value);
    }
  };
});