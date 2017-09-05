/* global Function */

const args = require('typeof-arguments');
const type = require('of-type');
const moduleName = require('./package.json').name;
const clc = require('cli-color');
const warn = clc.bgYellow.blue;

module.exports = function(list,userContext,finalThen,finalCatch){
  args(arguments,[Array,[Object,null],Function,Function],(o)=>{
    throw new TypeError(`${warn(moduleName)}: ${o.message}`);
  });
  for(var i in list){
    if(!type(list[i],Function)) throw new TypeError(`${warn(moduleName)}: Each [Array] list item must be of [Function] type.`);
  }
  var bFinalThen = finalThen.bind(userContext,userContext,finalCatch);
  var bReject = finalCatch.bind(userContext,userContext);
  var b = list.reduceRight((a,b)=>{
    return b.bind(userContext,a,bReject);
  },bFinalThen);
  b();
};