/* global describe, beforeAll, it */
import move from './../src/move-on.js';

describe('When the', function () {
  beforeAll(function () {
    this.defaultTimeout = 10000;
  });
  describe('module is executed with the config.timeout', function () {
    describe('and all functions are resolved before the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 100 }),
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 300 }),
        ];
      });
      describe('when the config.timeout is set to default value', function () {
        describe('for the moveon', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(600).catch(0).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.all, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(300).catch(0).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.each, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(300).catch(0).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(100).catch(0).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is switched off', function () {
        describe('for the moveon', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(600).catch(0).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.all, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(300).catch(0).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.each, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(300).catch(0).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(100).catch(0).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is set to the user value', function () {
        describe('for the moveon', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              timeout: 301, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(600).catch(0).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.all, timeout: 301, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(300).catch(0).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.each, timeout: 301, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(300).catch(0).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 301, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(100).catch(0).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and all functions are rejected before the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ rejects: 100 }),
          this.asyncFun({ rejects: 200 }),
          this.asyncFun({ rejects: 300 })
        ];
      });
      describe('when the config.timeout is set to default value', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(100).catch(1).done(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally once without timeout error', function () {
            this.timeout({
              method: move.all, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(100).catch(1).done(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally and the catch should be called finally (as many times as called by chained functions) without timeout error', function () {
            this.timeout({
              method: move.each, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(100).catch(1).done(0)
                  .after(100).catch(2).done(0)
                  .after(100).catch(3).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should not be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              method: move.first, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(300).catch(1).done(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is switched off', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(100).catch(1).done(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally once without timeout error', function () {
            this.timeout({
              method: move.all, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(100).catch(1).done(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally and the catch should be called finally (as many times as called by chained functions) without timeout error', function () {
            this.timeout({
              method: move.each, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(100).catch(1).done(0)
                  .after(100).catch(2).done(0)
                  .after(100).catch(3).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should not be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              method: move.first, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(300).catch(1).done(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is set to the user value', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              timeout: 301, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(100).catch(1).done(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally once without timeout error', function () {
            this.timeout({
              method: move.all, timeout: 301, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(100).catch(1).done(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally and the catch should be called finally (as many times as called by chained functions) without timeout error', function () {
            this.timeout({
              method: move.each, timeout: 301, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(100).catch(1).done(0)
                  .after(100).catch(2).done(0)
                  .after(100).catch(3).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should not be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              method: move.first, timeout: 301, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(300).catch(1).done(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and all functions are resolved after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 11000 }),
          this.asyncFun({ resolves: 12000 }),
          this.asyncFun({ resolves: 13000 }),
        ];
      });
      describe('when the config.timeout is set to default value', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(10000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              method: move.all, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(10000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should not be called finally and the catch should be called finally once with timeout error', function () {
            this.timeout({
              method: move.each, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(10000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              method: move.first, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(10000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is switched off', function () {
        describe('for the moveon', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(36000).catch(0).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.all, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(13000).catch(0).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.each, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(13000).catch(0).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(11000).catch(0).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is set to the user value', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              timeout: 11000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(11000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              method: move.all, timeout: 13000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(13000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should not be called finally and the catch should be called finally once with timeout error', function () {
            this.timeout({
              method: move.each, timeout: 11000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(11000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              method: move.first, timeout: 11000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(11000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and all functions are rejected after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ rejects: 11000 }),
          this.asyncFun({ rejects: 12000 }),
          this.asyncFun({ rejects: 13000 }),
        ];
      });
      describe('when the config.timeout is set to default value', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(10000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              method: move.all, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(10000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should not be called finally and the catch should be called finally once with timeout error', function () {
            this.timeout({
              method: move.each, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(10000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              method: move.first, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(10000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is switched off', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(11000).catch(1).done(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally once without timeout error', function () {
            this.timeout({
              method: move.all, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(11000).catch(1).done(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally and the catch should be called finally (as many times as called by chained functions) without timeout error', function () {
            this.timeout({
              method: move.each, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(11000).catch(1).done(0)
                  .after(1000).catch(2).done(0)
                  .after(1000).catch(3).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should not be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              method: move.first, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(13000).catch(1).done(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is set to the user value', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              timeout: 11000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(11000).timeout(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally once with timeout error', function () {
            this.timeout({
              method: move.all, timeout: 11000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(11000).timeout(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should not be called finally and the catch should be called finally once with timeout error', function () {
            this.timeout({
              method: move.each, timeout: 11000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(11000).timeout(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              method: move.first, timeout: 11000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(11000).timeout(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and some function rejects before timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 1000 }),
          this.asyncFun({ resolves: 2000 }),
          this.asyncFun({ rejects: 3000 }),
          this.asyncFun({ resolves: 4000 }),
        ];
      });
      describe('when the config.timeout is set to default value', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(6000).catch(1).done(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              method: move.all, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(3000).catch(1).done(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally and the catch should be called finally once without timeout error', function () {
            this.timeout({
              method: move.each, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(3000).catch(1).done(0)
                  .after(1000).catch(1).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1000).catch(0).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is switched off', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(6000).catch(1).done(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              method: move.all, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(3000).catch(1).done(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              method: move.each, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(3000).catch(1).done(0)
                  .after(1000).catch(1).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1000).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is set to the user value', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              timeout: 5000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(6000).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              method: move.all, timeout: 5000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(3000).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              method: move.each, timeout: 5000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(3000).catch(1).done(0)
                  .after(1000).catch(1).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 5000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1000).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and some function resolves after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 1000 }),
          this.asyncFun({ resolves: 2000 }),
          this.asyncFun({ resolves: 11000 }),
          this.asyncFun({ resolves: 3000 })
        ];
      });
      describe('when the config.timeout is set to default value', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(13000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              method: move.all, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(10000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              method: move.each, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(10000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1000).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is switched off', function () {
        describe('for the moveon', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(17000).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.all, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(11000).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.each, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(11000).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1000).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is set to the user value', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              timeout: 5520, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(8520).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              method: move.all, timeout: 5520, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(5520).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              method: move.each, timeout: 5520, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(5520).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 5520, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1000).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and some function resolves twice after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 3020 }),
          this.asyncFun({ resolves: 4500 }),
          this.asyncFun({ resolves: [11000, 12000] }),
          this.asyncFun({ resolves: 3000 })
        ];
      });

      describe('when the config.timeout is set to default value', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(17520).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              method: move.all, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(10000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              method: move.each, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(10000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.each, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(10000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is switched off', function () {
        describe('for the moveon', function () {
          it('the done should be called finally twice and the catch should not be called finally', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(21520).done(1).catch(0)
                  .after(1000).done(2).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should be called finally once and the catch should not be called finally', function () {
            this.timeout({
              method: move.all, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(11000).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally once and the catch should not be called finally', function () {
            this.timeout({
              method: move.each, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(11000).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(3000).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is set to the user value', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              timeout: 4501, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(12021).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              method: move.all, timeout: 4501, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(4501).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              method: move.each, timeout: 4501, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(4501).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 4501, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(3000).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and some function rejects after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 3020 }),
          this.asyncFun({ resolves: 4500 }),
          this.asyncFun({ rejects: 11700 }),
          this.asyncFun({ resolves: 3000 })
        ];
      });
      describe('when the config.timeout is set to default value', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(17520).timeout(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              method: move.all, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(10000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              method: move.each, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(10000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(3000).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is switched off', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(19220).done(0).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              method: move.all, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(11700).done(0).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              method: move.each, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(11700).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(3000).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is set to the user value', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              timeout: 6500, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(14020).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              method: move.all, timeout: 6500, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(6500).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              method: move.each, timeout: 6500, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(6500).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 6500, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(3000).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and some function rejects twice after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 3020 }),
          this.asyncFun({ resolves: 4500 }),
          this.asyncFun({ rejects: [11700, 15200] }),
          this.asyncFun({ resolves: 1125 })
        ];
      });
      describe('when the config.timeout is set to default value', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally once with timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(17520).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error', function () {
            this.timeout({
              method: move.all, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(10000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should not be called finally and the catch should be called finally once with timeout error', function () {
            this.timeout({
              method: move.each, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(10000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1125).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is switched off', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally twice without timeout error', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(19220).done(0).catch(1)
                  .after(3500).done(0).catch(2)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally once without timeout error', function () {
            this.timeout({
              method: move.all, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(11700).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally and the catch should be called finally once without timeout error', function () {
            this.timeout({
              method: move.each, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(11700).catch(1).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1125).catch(0).done(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is set to the user value', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally once with timeout error', function () {
            this.timeout({
              timeout: 4550, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(12070).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally once with timeout error', function () {
            this.timeout({
              method: move.all, timeout: 4550, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(4550).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should not be called finally and the catch should be called finally once with timeout error', function () {
            this.timeout({
              method: move.each, timeout: 4550, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(4550).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 4550, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1125).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and some function neither resolves nor rejects', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 500 }),
          this.asyncFun({ resolves: 1000 }),
          this.asyncFun({ resolves: [], rejects: [] }),
          this.asyncFun({ resolves: 1500 })
        ];
      });
      describe('when the config.timeout is set to default value', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error after the timeout pass', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(11500).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error after the timeout pass', function () {
            this.timeout({
              method: move.all, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(10000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error after the timeout pass', function () {
            this.timeout({
              method: move.each, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(10000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(500).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is switched off', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should not be called finally after the default timeout pass', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(this.defaultTimeout).done(0).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should not be called finally after the default timeout pass', function () {
            this.timeout({
              method: move.all, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(this.defaultTimeout).done(0).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should not be called finally and the catch should not be called finally after the default timeout pass', function () {
            this.timeout({
              method: move.each, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(this.defaultTimeout).done(0).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(500).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is set to the user value', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error after the user timeout pass', function () {
            this.timeout({
              timeout: 2000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(3500).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error after the user timeout pass', function () {
            this.timeout({
              method: move.all, timeout: 2000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(2000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should not be called finally and the catch should be called finally with timeout error after the user timeout pass', function () {
            this.timeout({
              method: move.each, timeout: 2000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(2000).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 2000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(500).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and some function resolves before and then rejects after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 2200 }),
          this.asyncFun({ resolves: 4400 }),
          this.asyncFun({ resolves: 6600, rejects: 10500 }),
          this.asyncFun({ resolves: 8800 })
        ];
      });
      describe('when the config.timeout is set to default value', function () {
        describe('for the moveon', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(22000).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.all, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(8800).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.each, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(8800).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(2200).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is switched off', function () {
        describe('for the moveon', function () {
          it('the done should be called finally once and the catch should be called finally once without timeout error', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(17100).done(0).catch(1)
                  .after(4900).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should be called finally once and the catch should not be called finally', function () {
            this.timeout({
              method: move.all, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(8800).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally once and the catch should not be called finally', function () {
            this.timeout({
              method: move.each, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(8800).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(2200).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is set to the user value', function () {
        describe('for the moveon', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              timeout: 9000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(22000).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.all, timeout: 9000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(8800).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.all, timeout: 9000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(8800).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 9000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(2200).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and some function rejects before and then resolves after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 100 }),
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 10500, rejects: 400 }),
          this.asyncFun({ resolves: 300 })
        ];
      });
      describe('when the config.timeout is set to default value', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(700).done(0).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              method: move.all, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(400).done(0).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally and the catch should be called finally once without timeout error', function () {
            this.timeout({
              method: move.each, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(400).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(100).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is switched off', function () {
        describe('for the moveon', function () {
          it('the done should be called finally once and the catch should be called finally once without timeout error', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(700).done(0).catch(1)
                  .after(10400).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally once without timeout error', function () {
            this.timeout({
              method: move.all, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(400).done(0).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally and the catch should be called finally once without timeout error', function () {
            this.timeout({
              method: move.each, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(400).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(100).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is set to the user value', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              timeout: 500, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(700).done(0).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              method: move.all, timeout: 500, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(400).done(0).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally and the catch should be called finally without timeout error', function () {
            this.timeout({
              method: move.each, timeout: 500, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(400).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 500, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(100).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and some function resolves before and then resolves after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 400 }),
          this.asyncFun({ resolves: [600, 10200] }),
          this.asyncFun({ resolves: 800 })
        ];
      });
      describe('when the config.timeout is set to default value', function () {
        describe('for the moveon', function () {
          it('the done should be called finally once and the catch should not be called finally', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(2000).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should be called finally once and the catch should not be called finally', function () {
            this.timeout({
              method: move.all, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally once and the catch should not be called finally', function () {
            this.timeout({
              method: move.each, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally once and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(200).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is switched off', function () {
        describe('for the moveon', function () {
          it('the done should be called finally twice and the catch should not be called finally', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(2000).done(1).catch(0)
                  .after(9600).done(2).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should be called finally once and the catch should not be called finally', function () {
            this.timeout({
              method: move.all, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally once and the catch should not be called finally', function () {
            this.timeout({
              method: move.each, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(200).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is set to the user value', function () {
        describe('for the moveon', function () {
          it('the done should be called finally once and the catch should not be called finally', function () {
            this.timeout({
              timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(2000).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should be called finally once and the catch should not be called finally', function () {
            this.timeout({
              method: move.all, timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally once and the catch should not be called finally', function () {
            this.timeout({
              method: move.each, timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(200).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and some function rejects before and then rejects after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 400 }),
          this.asyncFun({ rejects: [600, 10200] }),
          this.asyncFun({ resolves: 800 })
        ];
      });
      describe('when the config.timeout is set to default value', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally once without timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1200).done(0).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally once without timeout error', function () {
            this.timeout({
              method: move.all, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(600).done(0).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally and the catch should be called finally once without timeout error', function () {
            this.timeout({
              method: move.each, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(600).done(0).catch(1)
                  .after(200).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(200).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is switched off', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally twice without timeout error', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1200).done(0).catch(1)
                  .after(9600).done(0).catch(2)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally once without timeout error', function () {
            this.timeout({
              method: move.all, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(600).done(0).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally and the catch should be called finally once without timeout error', function () {
            this.timeout({
              method: move.each, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(600).done(0).catch(1)
                  .after(200).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(200).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
      describe('when the config.timeout is set to the user value', function () {
        describe('for the moveon', function () {
          it('the done should not be called finally and the catch should be called finally once without timeout error', function () {
            this.timeout({
              timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1200).done(0).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.all static method', function () {
          it('the done should not be called finally and the catch should be called finally once without timeout error', function () {
            this.timeout({
              method: move.all, timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(600).done(0).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.each static method', function () {
          it('the done should be called finally and the catch should be called finally once without timeout error', function () {
            this.timeout({
              method: move.each, timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(600).done(0).catch(1)
                  .after(200).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('for the moveon.first static method', function () {
          it('the done should be called finally and the catch should not be called finally', function () {
            this.timeout({
              method: move.first, timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(200).done(1).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and the function resolve twice before and then the function resolve twice after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 400 }),
          this.asyncFun({ resolves: [200, 400, 10200, 10400] }),
          this.asyncFun({ resolves: 800 })
        ];
      });
      describe('for the moveon', function () {
        describe('when the config.timeout is set to default value', function () {
          it('the done should be called twice finally and the catch should not be called finally', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1600).done(1).catch(0)
                  .after(200).done(2).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is switched off', function () {
          it('the done should be called four times finally and the catch should not be called finally', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1600).done(1).catch(0)
                  .after(200).done(2).catch(0)
                  .after(9800).done(3).catch(0)
                  .after(200).done(4).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is set to the user value', function () {
          it('the done should be called twice finally and the catch should not be called finally', function () {
            this.timeout({
              timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1600).done(1).catch(0)
                  .after(200).done(2).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and the function resolve twice before and then the function reject twice after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 400 }),
          this.asyncFun({ resolves: [200, 400], rejects: [10200, 10400] }),
          this.asyncFun({ resolves: 800 })
        ];
      });
      describe('for the moveon', function () {
        describe('when the config.timeout is set to default value', function () {
          it('the done should be called twice finally and the catch should not be called finally', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1600).done(1).catch(0)
                  .after(200).done(2).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is switched off', function () {
          it('the done should be called twice finally and the catch should be called twice finally', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1600).done(1).catch(0)
                  .after(200).done(2).catch(0)
                  .after(9000).done(2).catch(1)
                  .after(200).done(2).catch(2)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is set to the user value', function () {
          it('the done should be called twice finally and the catch should not be called finally', function () {
            this.timeout({
              timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1600).done(1).catch(0)
                  .after(200).done(2).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and the function reject twice before and then the function resolve twice after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 400 }),
          this.asyncFun({ rejects: [200, 400], resolves: [10200, 10400] }),
          this.asyncFun({ resolves: 800 })
        ];
      });
      describe('for the moveon', function () {
        describe('when the config.timeout is set to default value', function () {
          it('the done should not be called finally and the catch should be called twice finally without timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(200).done(0).catch(2)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is switched off', function () {
          it('the done should be called twice finally and the catch should be called twice finally without timeout error', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(200).done(0).catch(2)
                  .after(10600).done(1).catch(2)
                  .after(200).done(2).catch(2)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is set to the user value', function () {
          it('the done should not be called finally and the catch should be called twice finally without timeout error', function () {
            this.timeout({
              timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(200).done(0).catch(2)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and the function both resolve and reject before and then the function resolve twice after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 400 }),
          this.asyncFun({ resolves: [200, 10200, 10400], rejects: [400] }),
          this.asyncFun({ resolves: 800 })
        ];
      });
      describe('for the moveon', function () {
        describe('when the config.timeout is set to default value', function () {
          it('the done should be called once finally and the catch should be called once finally without timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1000).done(0).catch(1)
                  .after(600).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is switched off', function () {
          it('the done should be called three times finally and the catch should be called once finally without timeout error', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1000).done(0).catch(1)
                  .after(600).done(1).catch(1)
                  .after(10000).done(2).catch(1)
                  .after(200).done(3).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is set to the user value', function () {
          it('the done should be called once finally and the catch should be called once finally without timeout error', function () {
            this.timeout({
              timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1000).done(0).catch(1)
                  .after(600).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and the function resolve twice before and then the function both resolve and reject after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 400 }),
          this.asyncFun({ resolves: [200, 400, 10200], rejects: 10400 }),
          this.asyncFun({ resolves: 800 })
        ];
      });
      describe('for the moveon', function () {
        describe('when the config.timeout is set to default value', function () {
          it('the done should be called twice finally and the catch should not be called finally', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1600).done(1).catch(0)
                  .after(200).done(2).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is switched off', function () {
          it('the done should be called three times finally and the catch should be called once finally', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1600).done(1).catch(0)
                  .after(200).done(2).catch(0)
                  .after(9200).done(2).catch(1)
                  .after(600).done(3).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is set to the user value', function () {
          it('the done should be called twice finally and the catch should not be called finally', function () {
            this.timeout({
              timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1600).done(1).catch(0)
                  .after(200).done(2).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and the function both resolve and reject before and then the function reject twice after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 400 }),
          this.asyncFun({ resolves: 200, rejects: [400, 10200, 10400] }),
          this.asyncFun({ resolves: 800 })
        ];
      });
      describe('for the moveon', function () {
        describe('when the config.timeout is set to default value', function () {
          it('the done should be called once finally and the catch should be called once finally without timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1000).done(0).catch(1)
                  .after(600).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is switched off', function () {
          it('the done should be called once finally and the catch should be called thee times finally without timeout error', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1000).done(0).catch(1)
                  .after(600).done(1).catch(1)
                  .after(9200).done(1).catch(2)
                  .after(200).done(1).catch(3)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is set to the user value', function () {
          it('the done should be called once finally and the catch should be called once finally without timeout error', function () {
            this.timeout({
              timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1000).done(0).catch(1)
                  .after(600).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and the function reject twice before and then the function both resolve and reject after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 400 }),
          this.asyncFun({ resolves: 10200, rejects: [200, 400, 10400] }),
          this.asyncFun({ resolves: 800 })
        ];
      });
      describe('for the moveon', function () {
        describe('when the config.timeout is set to default value', function () {
          it('the done should not be called finally and the catch should be called twice finally without timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(200).done(0).catch(2)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is switched off', function () {
          it('the done should be called once finally and the catch should be called three times finally without timeout error', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(200).done(0).catch(2)
                  .after(10000).done(0).catch(3)
                  .after(600).done(1).catch(3)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is set to the user value', function () {
          it('the done should not be called finally and the catch should be called twice finally without timeout error', function () {
            this.timeout({
              timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(200).done(0).catch(2)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and the function both reject and resolve before and then the function resolve twice after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 400 }),
          this.asyncFun({ resolves: [400, 10200, 10400], rejects: [200] }),
          this.asyncFun({ resolves: 800 })
        ];
      });
      describe('for the moveon', function () {
        describe('when the config.timeout is set to default value', function () {
          it('the done should be called once finally and the catch should be called once finally without timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(1000).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is switched off', function () {
          it('the done should be called three times finally and the catch should be called once finally without timeout error', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(1000).done(1).catch(1)
                  .after(9800).done(2).catch(1)
                  .after(200).done(3).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is set to the user value', function () {
          it('the done should be called once finally and the catch should be called once finally without timeout error', function () {
            this.timeout({
              timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(1000).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and the function resolve twice before and then the function both reject and resolve after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 400 }),
          this.asyncFun({ resolves: [200, 400, 10400], rejects: [10200] }),
          this.asyncFun({ resolves: 800 })
        ];
      });
      describe('for the moveon', function () {
        describe('when the config.timeout is set to default value', function () {
          it('the done should be called twice finally and the catch should not be called finally', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1600).done(1).catch(0)
                  .after(200).done(2).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is switched off', function () {
          it('the done should be called three times finally and the catch should be called once finally without timeout error', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1600).done(1).catch(0)
                  .after(200).done(2).catch(0)
                  .after(9000).done(2).catch(1)
                  .after(1000).done(3).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is set to the user value', function () {
          it('the done should be called twice finally and the catch should not be called finally', function () {
            this.timeout({
              timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1600).done(1).catch(0)
                  .after(200).done(2).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and the function both reject and resolve before and then the function reject twice after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 400 }),
          this.asyncFun({ resolves: [400], rejects: [200, 10200, 10400] }),
          this.asyncFun({ resolves: 800 })
        ];
      });
      describe('for the moveon', function () {
        describe('when the config.timeout is set to default value', function () {
          it('the done should be called once finally and the catch should be called once finally without timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(1000).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is switched off', function () {
          it('the done should be called once finally and the catch should be called three times finally without timeout error', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(1000).done(1).catch(1)
                  .after(9000).done(1).catch(2)
                  .after(200).done(1).catch(3)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is set to the user value', function () {
          it('the done should be called once finally and the catch should be called once finally without timeout error', function () {
            this.timeout({
              timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(1000).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and the function reject twice before and then the function both reject and resolve after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 400 }),
          this.asyncFun({ resolves: 10200, rejects: [200, 400, 10400] }),
          this.asyncFun({ resolves: 800 })
        ];
      });
      describe('for the moveon', function () {
        describe('when the config.timeout is set to default value', function () {
          it('the done should not be called finally and the catch should be called twice finally without timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(200).done(0).catch(2)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is switched off', function () {
          it('the done should be called once finally and the catch should be called three times finally without timeout error', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(200).done(0).catch(2)
                  .after(10000).done(0).catch(3)
                  .after(600).done(1).catch(3)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is set to the user value', function () {
          it('the done should not be called finally and the catch should be called twice finally without timeout error', function () {
            this.timeout({
              timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(200).done(0).catch(2)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and the function both resolve and reject before and then the function both resolve and reject after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 400 }),
          this.asyncFun({ resolves: [200, 10200], rejects: [400, 10400] }),
          this.asyncFun({ resolves: 800 })
        ];
      });
      describe('for the moveon', function () {
        describe('when the config.timeout is set to default value', function () {
          it('the done should be called once finally and the catch should be called once finally without timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1000).done(0).catch(1)
                  .after(600).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is switched off', function () {
          it('the done should be called twice finally and the catch should be called twice finally without timeout error', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1000).done(0).catch(1)
                  .after(600).done(1).catch(1)
                  .after(9400).done(1).catch(2)
                  .after(600).done(2).catch(2)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is set to the user value', function () {
          it('the done should be called once finally and the catch should be called once finally without timeout error', function () {
            this.timeout({
              timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1000).done(0).catch(1)
                  .after(600).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and the function both reject and resolve before and then the function both reject and resolve after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 400 }),
          this.asyncFun({ resolves: [400, 10400], rejects: [200, 10200] }),
          this.asyncFun({ resolves: 800 })
        ];
      });
      describe('for the moveon', function () {
        describe('when the config.timeout is set to default value', function () {
          it('the done should be called once finally and the catch should be called once finally without timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(1000).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is switched off', function () {
          it('the done should be called twice finally and the catch should be called twice finally without timeout error', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(1000).done(1).catch(1)
                  .after(9000).done(1).catch(2)
                  .after(1000).done(2).catch(2)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is set to the user value', function () {
          it('the done should be called once finally and the catch should be called once finally without timeout error', function () {
            this.timeout({
              timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(1000).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and the function both resolve and reject before and then the function both reject and resolve after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 400 }),
          this.asyncFun({ resolves: [200, 10400], rejects: [400, 10200] }),
          this.asyncFun({ resolves: 800 })
        ];
      });
      describe('for the moveon', function () {
        describe('when the config.timeout is set to default value', function () {
          it('the done should be called once finally and the catch should be called once finally without timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1000).done(0).catch(1)
                  .after(600).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is switched off', function () {
          it('the done should be called twice finally and the catch should be called twice finally without timeout error', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1000).done(0).catch(1)
                  .after(600).done(1).catch(1)
                  .after(9200).done(1).catch(2)
                  .after(1000).done(2).catch(2)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is set to the user value', function () {
          it('the done should be called once finally and the catch should be called once finally without timeout error', function () {
            this.timeout({
              timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1000).done(0).catch(1)
                  .after(600).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and the function both reject and resolve before and then the function both resolve and reject after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 400 }),
          this.asyncFun({ resolves: [400, 10200], rejects: [200, 10400] }),
          this.asyncFun({ resolves: 800 })
        ];
      });
      describe('for the moveon', function () {
        describe('when the config.timeout is set to default value', function () {
          it('the done should be called once finally and the catch should be called once finally without timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(1000).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is switched off', function () {
          it('the done should be called twice finally and the catch should be called twice finally without timeout error', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(1000).done(1).catch(1)
                  .after(9200).done(1).catch(2)
                  .after(600).done(2).catch(2)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is set to the user value', function () {
          it('the done should be called once finally and the catch should be called once finally without timeout error', function () {
            this.timeout({
              timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(1000).done(1).catch(1)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and the function neither resolve nor reject before and then the function resolve twice after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 400 }),
          this.asyncFun({ resolves: [10200, 10400] }),
          this.asyncFun({ resolves: 800 })
        ];
      });
      describe('for the moveon', function () {
        describe('when the config.timeout is set to default value', function () {
          it('the done should not be called finally and the catch should be called once finally with timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(10600).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is switched off', function () {
          it('the done should be called twice finally and the catch should not be called finally', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(11600).done(1).catch(0)
                  .after(200).done(2).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is set to the user value', function () {
          it('the done should not be called finally and the catch should be called once finally with timeout error', function () {
            this.timeout({
              timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1600).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and the function neither resolve nor reject before and then the function reject twice after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 400 }),
          this.asyncFun({ rejects: [10200, 10400] }),
          this.asyncFun({ resolves: 800 })
        ];
      });
      describe('for the moveon', function () {
        describe('when the config.timeout is set to default value', function () {
          it('the done should not be called finally and the catch should be called once finally with timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(10600).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is switched off', function () {
          it('the done should not be called finally and the catch should be called twice finally without timeout error', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(10800).done(0).catch(1)
                  .after(200).done(0).catch(2)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is set to the user value', function () {
          it('the done should not be called finally and the catch should be called once finally with timeout error', function () {
            this.timeout({
              timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1600).timeout()
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and the function resolve twice before and then the function neither resolve nor reject after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 400 }),
          this.asyncFun({ resolves: [200, 400] }),
          this.asyncFun({ resolves: 800 })
        ];
      });
      describe('for the moveon', function () {
        describe('when the config.timeout is set to default value', function () {
          it('the done should be called twice finally and the catch should not be called finally', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1600).done(1).catch(0)
                  .after(200).done(2).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is switched off', function () {
          it('the done should be called twice finally and the catch should not be called finally', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1600).done(1).catch(0)
                  .after(200).done(2).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is set to the user value', function () {
          it('the done should be called twice finally and the catch should not be called finally', function () {
            this.timeout({
              timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(1600).done(1).catch(0)
                  .after(200).done(2).catch(0)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
    describe('and the function reject twice before and then the function neither resolve nor reject after the timeout pass', function () {
      beforeAll(function () {
        this.list = [
          this.asyncFun({ resolves: 200 }),
          this.asyncFun({ resolves: 400 }),
          this.asyncFun({ rejects: [200, 400] }),
          this.asyncFun({ resolves: 800 })
        ];
      });
      describe('for the moveon', function () {
        describe('when the config.timeout is set to default value', function () {
          it('the done should not be called finally and the catch should be called twice finally without timeout error', function () {
            this.timeout({
              list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(200).done(0).catch(2)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is switched off', function () {
          it('the done should not be called finally and the catch should be called twice finally without timeout error', function () {
            this.timeout({
              timeout: 'off', list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(200).done(0).catch(2)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
        describe('when the config.timeout is set to the user value', function () {
          it('the done should not be called finally and the catch should be called twice finally without timeout error', function () {
            this.timeout({
              timeout: 1000, list: this.list,
              callback: (timeoutChain) => {
                timeoutChain
                  .after(800).done(0).catch(1)
                  .after(200).done(0).catch(2)
                  .after(this.defaultTimeout).keep()
                  .after(this.defaultTimeout).keep();
              }
            });
          });
        });
      });
    });
  });
});