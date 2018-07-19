/* global beforeAll, spyOn */

beforeAll(function () {
  this.spy = function () {
    if (typeof this.spies === 'string') this.spies = [this.spies];
    for (let name of this.spies) spyOn(this.f, name).and.callThrough();
  };
});