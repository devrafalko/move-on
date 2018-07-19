/* global beforeAll, jasmine */

beforeAll(function () {
  this.looper = function(callback){
    let onCatch = this.f[this.spies[this.spies.length-1]];
    let onDone = this.f[this.spies[this.spies.length-2]];
    for(let i=0;i< this.chains.length;i++){
      let chain = this.chains[i];
      this.f.order = [];
      jasmine.clock().install();
      this.method(chain, this.config, onDone, onCatch);
      callback();
      for(let name of this.spies) this.f[name].calls.reset();
      jasmine.clock().uninstall();
    }
  };
});