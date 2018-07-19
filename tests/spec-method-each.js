/* global describe, beforeAll, it, expect */

const path = require('path');
const move = require(path.resolve('./src/index.js'));

describe('The "each" static method', function () {
  it('should be accessible via the move-on module', function () {
    expect(typeof move.each).toBe('function');
  });
});

describe('When the module\'s "each" static method is executed', function () {
  beforeAll(function () {
    this.method = move.each;
    this.config = { timeout: null, context: this.f };
    this.f.config = this.config;
  });

  describe('without any functions passed, except onDone and onCatch', function () {
    beforeAll(function () {
      this.spies = ['syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [],
        [[]],
        [[], [], []],
      ];
    });

    it('the functions should be called in the following order: onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('without any functions passed, except onDone and onCatch, where onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [],
        [[]],
        [[], [], []],
      ];
    });

    it('the functions should be called in the following order: onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('without any functions passed, except async onDone and onCatch, where onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [],
        [[]],
        [[], [], []],
      ];
    });

    it('the functions should be called in the following order: onDone, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('without any functions passed, except async onDone and onCatch, where onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [],
        [[]],
        [[], [], []],
      ];
    });

    it('the functions should be called in the following order: onDone, then onCatch, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where both resolve', function () {
    beforeAll(function () {
      this.spies = ['syncResolveA', 'syncResolveB', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveA, this.f.syncResolveB],
        [this.f.syncResolveA, [this.f, 'syncResolveB']],
        [[this.f, this.f.syncResolveA], this.f.syncResolveB],
        [[this.f, this.f.syncResolveA], [this.f, 'syncResolveB']],
        [[this.f, this.f.syncResolveA, this.f.syncResolveB]],
        [[this.f, 'syncResolveA', 'syncResolveB']],
      ];
    });

    it('the functions should be called in the following order: A, B and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveA', 'syncResolveB', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where both resolve and the first resolves faster', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveFaster', 'asyncResolveSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveFaster, this.f.asyncResolveSlower],
        [this.f.asyncResolveFaster, [this.f, 'asyncResolveSlower']],
        [[this.f, this.f.asyncResolveFaster], this.f.asyncResolveSlower],
        [[this.f, this.f.asyncResolveFaster], [this.f, 'asyncResolveSlower']],
        [[this.f, this.f.asyncResolveFaster, this.f.asyncResolveSlower]],
        [[this.f, 'asyncResolveFaster', 'asyncResolveSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onDone when B resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveFaster', 'asyncResolveSlower')
          .after(500).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where both resolve and the second resolves faster', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveSlower', 'asyncResolveFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveSlower, this.f.asyncResolveFaster],
        [this.f.asyncResolveSlower, [this.f, 'asyncResolveFaster']],
        [[this.f, this.f.asyncResolveSlower], this.f.asyncResolveFaster],
        [[this.f, this.f.asyncResolveSlower], [this.f, 'asyncResolveFaster']],
        [[this.f, this.f.asyncResolveSlower, this.f.asyncResolveFaster]],
        [[this.f, 'asyncResolveSlower', 'asyncResolveFaster']]
      ];
    });

    it('the functions should be called in the following order: A, then B, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveSlower', 'asyncResolveFaster')
          .after(500).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first asynchronous and second synchronous functions, where both resolve', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveFaster', 'syncResolveA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveFaster, this.f.syncResolveA],
        [this.f.asyncResolveFaster, [this.f, 'syncResolveA']],
        [[this.f, this.f.asyncResolveFaster], this.f.syncResolveA],
        [[this.f, this.f.asyncResolveFaster], [this.f, 'syncResolveA']],
        [[this.f, this.f.asyncResolveFaster, this.f.syncResolveA]],
        [[this.f, 'asyncResolveFaster', 'syncResolveA']]
      ];
    });

    it('the functions should be called in the following order:A and B, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveFaster', 'syncResolveA')
          .after(100).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first synchronous and second asynchronous functions, where both resolve', function () {
    beforeAll(function () {
      this.spies = ['syncResolveA', 'asyncResolveFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveA, this.f.asyncResolveFaster],
        [this.f.syncResolveA, [this.f, 'asyncResolveFaster']],
        [[this.f, this.f.syncResolveA], this.f.asyncResolveFaster],
        [[this.f, this.f.syncResolveA], [this.f, 'asyncResolveFaster']],
        [[this.f, this.f.syncResolveA, this.f.asyncResolveFaster]],
        [[this.f, 'syncResolveA', 'asyncResolveFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onDone when B resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveA', 'asyncResolveFaster')
          .after(100).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where both resolve and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveA', 'syncResolveB', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveA, this.f.syncResolveB],
        [this.f.syncResolveA, [this.f, 'syncResolveB']],
        [[this.f, this.f.syncResolveA], this.f.syncResolveB],
        [[this.f, this.f.syncResolveA], [this.f, 'syncResolveB']],
        [[this.f, this.f.syncResolveA, this.f.syncResolveB]],
        [[this.f, 'syncResolveA', 'syncResolveB']]
      ];
    });

    it('the functions should be called in the following order: A, B, onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveA', 'syncResolveB', 'syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where both resolve and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveFaster', 'asyncResolveSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveFaster, this.f.asyncResolveSlower],
        [this.f.asyncResolveFaster, [this.f, 'asyncResolveSlower']],
        [[this.f, this.f.asyncResolveFaster], this.f.asyncResolveSlower],
        [[this.f, this.f.asyncResolveFaster], [this.f, 'asyncResolveSlower']],
        [[this.f, this.f.asyncResolveFaster, this.f.asyncResolveSlower]],
        [[this.f, 'asyncResolveFaster', 'asyncResolveSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onDone when B resolves, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveFaster', 'asyncResolveSlower')
          .after(500).add('asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where both resolve and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveFaster', 'asyncResolveSlower', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveFaster, this.f.asyncResolveSlower],
        [this.f.asyncResolveFaster, [this.f, 'asyncResolveSlower']],
        [[this.f, this.f.asyncResolveFaster], this.f.asyncResolveSlower],
        [[this.f, this.f.asyncResolveFaster], [this.f, 'asyncResolveSlower']],
        [[this.f, this.f.asyncResolveFaster, this.f.asyncResolveSlower]],
        [[this.f, 'asyncResolveFaster', 'asyncResolveSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onDone when B resolves, then onCatch, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveFaster', 'asyncResolveSlower')
          .after(500).add('asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where both reject', function () {
    beforeAll(function () {
      this.spies = ['syncRejectA', 'syncRejectB', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncRejectA, this.f.syncRejectB],
        [this.f.syncRejectA, [this.f, 'syncRejectB']],
        [[this.f, this.f.syncRejectA], this.f.syncRejectB],
        [[this.f, this.f.syncRejectA], [this.f, 'syncRejectB']],
        [[this.f, this.f.syncRejectA, this.f.syncRejectB]],
        [[this.f, 'syncRejectA', 'syncRejectB']]
      ];
    });

    it('the functions should be called in the following order: A, onCatch, B, onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncRejectA', 'syncCatch', 'syncRejectB', 'syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where both reject and the first rejects faster', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectFaster', 'asyncRejectSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectFaster, this.f.asyncRejectSlower],
        [this.f.asyncRejectFaster, [this.f, 'asyncRejectSlower']],
        [[this.f, this.f.asyncRejectFaster], this.f.asyncRejectSlower],
        [[this.f, this.f.asyncRejectFaster], [this.f, 'asyncRejectSlower']],
        [[this.f, this.f.asyncRejectFaster, this.f.asyncRejectSlower]],
        [[this.f, 'asyncRejectFaster', 'asyncRejectSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch, then onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectFaster', 'asyncRejectSlower')
          .after(100).add('syncCatch')
          .after(400).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where both reject and the second rejects faster', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectSlower', 'asyncRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectSlower, this.f.asyncRejectFaster],
        [this.f.asyncRejectSlower, [this.f, 'asyncRejectFaster']],
        [[this.f, this.f.asyncRejectSlower], this.f.asyncRejectFaster],
        [[this.f, this.f.asyncRejectSlower], [this.f, 'asyncRejectFaster']],
        [[this.f, this.f.asyncRejectSlower, this.f.asyncRejectFaster]],
        [[this.f, 'asyncRejectSlower', 'asyncRejectFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when B rejects', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectSlower', 'asyncRejectFaster')
          .after(100).add('syncCatch')
          .after(400).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first asynchronous and second synchronous functions, where both reject', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectFaster', 'syncRejectA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectFaster, this.f.syncRejectA],
        [this.f.asyncRejectFaster, [this.f, 'syncRejectA']],
        [[this.f, this.f.asyncRejectFaster], this.f.syncRejectA],
        [[this.f, this.f.asyncRejectFaster], [this.f, 'syncRejectA']],
        [[this.f, this.f.asyncRejectFaster, this.f.syncRejectA]],
        [[this.f, 'asyncRejectFaster', 'syncRejectA']]
      ];
    });

    it('the functions should be called in the following order: A, B and onCatch, then onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectFaster', 'syncRejectA', 'syncCatch')
          .after(100).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first synchronous and second asynchronous functions, where both reject', function () {
    beforeAll(function () {
      this.spies = ['syncRejectA', 'asyncRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncRejectA, this.f.asyncRejectFaster],
        [this.f.syncRejectA, [this.f, 'asyncRejectFaster']],
        [[this.f, this.f.syncRejectA], this.f.asyncRejectFaster],
        [[this.f, this.f.syncRejectA], [this.f, 'asyncRejectFaster']],
        [[this.f, this.f.syncRejectA, this.f.asyncRejectFaster]],
        [[this.f, 'syncRejectA', 'asyncRejectFaster']]
      ];
    });

    it('the functions should be called in the following order: A, onCatch and B, then onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncRejectA', 'syncCatch', 'asyncRejectFaster')
          .after(100).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where both reject and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncRejectA', 'syncRejectB', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncRejectA, this.f.syncRejectB],
        [this.f.syncRejectA, [this.f, 'syncRejectB']],
        [[this.f, this.f.syncRejectA], this.f.syncRejectB],
        [[this.f, this.f.syncRejectA], [this.f, 'syncRejectB']],
        [[this.f, this.f.syncRejectA, this.f.syncRejectB]],
        [[this.f, 'syncRejectA', 'syncRejectB']]
      ];
    });

    it('the functions should be called in the following order: A, onCatch, B, onCatch, onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncRejectA', 'syncCatch', 'syncRejectB', 'syncCatch', 'syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where both reject and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectFaster', 'asyncRejectSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectFaster, this.f.asyncRejectSlower],
        [this.f.asyncRejectFaster, [this.f, 'asyncRejectSlower']],
        [[this.f, this.f.asyncRejectFaster], this.f.asyncRejectSlower],
        [[this.f, this.f.asyncRejectFaster], [this.f, 'asyncRejectSlower']],
        [[this.f, this.f.asyncRejectFaster, this.f.asyncRejectSlower]],
        [[this.f, 'asyncRejectFaster', 'asyncRejectSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch, then onCatch and onDone, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectFaster', 'asyncRejectSlower')
          .after(100).add('syncCatch')
          .after(400).add('syncCatch', 'asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where both reject and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectFaster', 'asyncRejectSlower', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectFaster, this.f.asyncRejectSlower],
        [this.f.asyncRejectFaster, [this.f, 'asyncRejectSlower']],
        [[this.f, this.f.asyncRejectFaster], this.f.asyncRejectSlower],
        [[this.f, this.f.asyncRejectFaster], [this.f, 'asyncRejectSlower']],
        [[this.f, this.f.asyncRejectFaster, this.f.asyncRejectSlower]],
        [[this.f, 'asyncRejectFaster', 'asyncRejectSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch, then onCatch and onDone, then onCatch, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectFaster', 'asyncRejectSlower')
          .after(100).add('syncCatch')
          .after(400).add('syncCatch', 'asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where the first resolves and second rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveA', 'syncRejectA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveA, this.f.syncRejectA],
        [this.f.syncResolveA, [this.f, 'syncRejectA']],
        [[this.f, this.f.syncResolveA], this.f.syncRejectA],
        [[this.f, this.f.syncResolveA], [this.f, 'syncRejectA']],
        [[this.f, this.f.syncResolveA, this.f.syncRejectA]],
        [[this.f, 'syncResolveA', 'syncRejectA']]
      ];
    });

    it('the functions should be called in the following order: A, B, onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveA', 'syncRejectA', 'syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where the first resolves and second rejects and the first resolves faster', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveFaster', 'asyncRejectSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveFaster, this.f.asyncRejectSlower],
        [this.f.asyncResolveFaster, [this.f, 'asyncRejectSlower']],
        [[this.f, this.f.asyncResolveFaster], this.f.asyncRejectSlower],
        [[this.f, this.f.asyncResolveFaster], [this.f, 'asyncRejectSlower']],
        [[this.f, this.f.asyncResolveFaster, this.f.asyncRejectSlower]],
        [[this.f, 'asyncResolveFaster', 'asyncRejectSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveFaster', 'asyncRejectSlower')
          .after(500).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where the first resolves and second rejects and the second rejects faster', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveSlower', 'asyncRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveSlower, this.f.asyncRejectFaster],
        [this.f.asyncResolveSlower, [this.f, 'asyncRejectFaster']],
        [[this.f, this.f.asyncResolveSlower], this.f.asyncRejectFaster],
        [[this.f, this.f.asyncResolveSlower], [this.f, 'asyncRejectFaster']],
        [[this.f, this.f.asyncResolveSlower, this.f.asyncRejectFaster]],
        [[this.f, 'asyncResolveSlower', 'asyncRejectFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveSlower', 'asyncRejectFaster')
          .after(100).add('syncCatch')
          .after(400).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first asynchronous and second synchronous functions, where the first resolves and second rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveFaster', 'syncRejectA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveFaster, this.f.syncRejectA],
        [this.f.asyncResolveFaster, [this.f, 'syncRejectA']],
        [[this.f, this.f.asyncResolveFaster], this.f.syncRejectA],
        [[this.f, this.f.asyncResolveFaster], [this.f, 'syncRejectA']],
        [[this.f, this.f.asyncResolveFaster, this.f.syncRejectA]],
        [[this.f, 'asyncResolveFaster', 'syncRejectA']]
      ];
    });

    it('the functions should be called in the following order: A, B and onCatch, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveFaster', 'syncRejectA', 'syncCatch')
          .after(100).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first synchronous and second asynchronous functions, where the first resolves and second rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveA', 'asyncRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveA, this.f.asyncRejectFaster],
        [this.f.syncResolveA, [this.f, 'asyncRejectFaster']],
        [[this.f, this.f.syncResolveA], this.f.asyncRejectFaster],
        [[this.f, this.f.syncResolveA], [this.f, 'asyncRejectFaster']],
        [[this.f, this.f.syncResolveA, this.f.asyncRejectFaster]],
        [[this.f, 'syncResolveA', 'asyncRejectFaster']]
      ];
    });

    it('the functions should be called in the following order: A nad B, then onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveA', 'asyncRejectFaster')
          .after(100).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where the first resolves and second rejects and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveA', 'syncRejectA', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveA, this.f.syncRejectA],
        [this.f.syncResolveA, [this.f, 'syncRejectA']],
        [[this.f, this.f.syncResolveA], this.f.syncRejectA],
        [[this.f, this.f.syncResolveA], [this.f, 'syncRejectA']],
        [[this.f, this.f.syncResolveA, this.f.syncRejectA]],
        [[this.f, 'syncResolveA', 'syncRejectA']]
      ];
    });

    it('the functions should be called in the following order: A, B, onCatch, onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveA', 'syncRejectA', 'syncCatch', 'syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where the first resolves and second rejects and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveFaster', 'asyncRejectSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveFaster, this.f.asyncRejectSlower],
        [this.f.asyncResolveFaster, [this.f, 'asyncRejectSlower']],
        [[this.f, this.f.asyncResolveFaster], this.f.asyncRejectSlower],
        [[this.f, this.f.asyncResolveFaster], [this.f, 'asyncRejectSlower']],
        [[this.f, this.f.asyncResolveFaster, this.f.asyncRejectSlower]],
        [[this.f, 'asyncResolveFaster', 'asyncRejectSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch and onDone, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveFaster', 'asyncRejectSlower')
          .after(500).add('syncCatch', 'asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where the first resolves and second rejects and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveFaster', 'asyncRejectSlower', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveFaster, this.f.asyncRejectSlower],
        [this.f.asyncResolveFaster, [this.f, 'asyncRejectSlower']],
        [[this.f, this.f.asyncResolveFaster], this.f.asyncRejectSlower],
        [[this.f, this.f.asyncResolveFaster], [this.f, 'asyncRejectSlower']],
        [[this.f, this.f.asyncResolveFaster, this.f.asyncRejectSlower]],
        [[this.f, 'asyncResolveFaster', 'asyncRejectSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when B rejects', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveFaster', 'asyncRejectSlower')
          .after(500).add('syncCatch', 'asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first rejects and second resolves', function () {
    beforeAll(function () {
      this.spies = ['syncRejectA', 'syncResolveA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncRejectA, this.f.syncResolveA],
        [this.f.syncRejectA, [this.f, 'syncResolveA']],
        [[this.f, this.f.syncRejectA], this.f.syncResolveA],
        [[this.f, this.f.syncRejectA], [this.f, 'syncResolveA']],
        [[this.f, this.f.syncRejectA, this.f.syncResolveA]],
        [[this.f, 'syncRejectA', 'syncResolveA']]
      ];
    });

    it('the functions should be called in the following order: A, onCatch, B and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncRejectA', 'syncCatch', 'syncResolveA', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where the first rejects and second resolves and the first rejects faster', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectFaster', 'asyncResolveSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectFaster, this.f.asyncResolveSlower],
        [this.f.asyncRejectFaster, [this.f, 'asyncResolveSlower']],
        [[this.f, this.f.asyncRejectFaster], this.f.asyncResolveSlower],
        [[this.f, this.f.asyncRejectFaster], [this.f, 'asyncResolveSlower']],
        [[this.f, this.f.asyncRejectFaster, this.f.asyncResolveSlower]],
        [[this.f, 'asyncRejectFaster', 'asyncResolveSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when A rejects, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectFaster', 'asyncResolveSlower')
          .after(100).add('syncCatch')
          .after(400).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where the first rejects and second resolves and the second resolves faster', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectSlower', 'asyncResolveFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectSlower, this.f.asyncResolveFaster],
        [this.f.asyncRejectSlower, [this.f, 'asyncResolveFaster']],
        [[this.f, this.f.asyncRejectSlower], this.f.asyncResolveFaster],
        [[this.f, this.f.asyncRejectSlower], [this.f, 'asyncResolveFaster']],
        [[this.f, this.f.asyncRejectSlower, this.f.asyncResolveFaster]],
        [[this.f, 'asyncRejectSlower', 'asyncResolveFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when A rejects and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectSlower', 'asyncResolveFaster')
          .after(500).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first asynchronous and second synchronous functions, where the first rejects and second resolves', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectFaster', 'syncResolveA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectFaster, this.f.syncResolveA],
        [this.f.asyncRejectFaster, [this.f, 'syncResolveA']],
        [[this.f, this.f.asyncRejectFaster], this.f.syncResolveA],
        [[this.f, this.f.asyncRejectFaster], [this.f, 'syncResolveA']],
        [[this.f, this.f.asyncRejectFaster, this.f.syncResolveA]],
        [[this.f, 'asyncRejectFaster', 'syncResolveA']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when A rejects and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectFaster', 'syncResolveA')
          .after(100).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first synchronous and second asynchronous functions, where the first rejects and second resolves', function () {
    beforeAll(function () {
      this.spies = ['syncRejectA', 'asyncResolveFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncRejectA, this.f.asyncResolveFaster],
        [this.f.syncRejectA, [this.f, 'asyncResolveFaster']],
        [[this.f, this.f.syncRejectA], this.f.asyncResolveFaster],
        [[this.f, this.f.syncRejectA], [this.f, 'asyncResolveFaster']],
        [[this.f, this.f.syncRejectA, this.f.asyncResolveFaster]],
        [[this.f, 'syncRejectA', 'asyncResolveFaster']]
      ];
    });

    it('the functions should be called in the following order: A, onCatch and B, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncRejectA', 'syncCatch', 'asyncResolveFaster')
          .after(100).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where the first rejects and second resolves and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncRejectA', 'syncResolveA', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncRejectA, this.f.syncResolveA],
        [this.f.syncRejectA, [this.f, 'syncResolveA']],
        [[this.f, this.f.syncRejectA], this.f.syncResolveA],
        [[this.f, this.f.syncRejectA], [this.f, 'syncResolveA']],
        [[this.f, this.f.syncRejectA, this.f.syncResolveA]],
        [[this.f, 'syncRejectA', 'syncResolveA']]
      ];
    });

    it('the functions should be called in the following order: A, onCatch, B, onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncRejectA', 'syncCatch', 'syncResolveA', 'syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where the first rejects and second resolves and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectFaster', 'asyncResolveSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectFaster, this.f.asyncResolveSlower],
        [this.f.asyncRejectFaster, [this.f, 'asyncResolveSlower']],
        [[this.f, this.f.asyncRejectFaster], this.f.asyncResolveSlower],
        [[this.f, this.f.asyncRejectFaster], [this.f, 'asyncResolveSlower']],
        [[this.f, this.f.asyncRejectFaster, this.f.asyncResolveSlower]],
        [[this.f, 'asyncRejectFaster', 'asyncResolveSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch, then onDone, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectFaster', 'asyncResolveSlower')
          .after(100).add('syncCatch')
          .after(400).add('asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where the first rejects and second resolves and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectFaster', 'asyncResolveSlower', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectFaster, this.f.asyncResolveSlower],
        [this.f.asyncRejectFaster, [this.f, 'asyncResolveSlower']],
        [[this.f, this.f.asyncRejectFaster], this.f.asyncResolveSlower],
        [[this.f, this.f.asyncRejectFaster], [this.f, 'asyncResolveSlower']],
        [[this.f, this.f.asyncRejectFaster, this.f.asyncResolveSlower]],
        [[this.f, 'asyncRejectFaster', 'asyncResolveSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch, then onDone, then onCatch, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectFaster', 'asyncResolveSlower')
          .after(100).add('syncCatch')
          .after(400).add('asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first resolves twice and second both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveTwiceA', 'syncResolveRejectA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveTwiceA, this.f.syncResolveRejectA],
        [this.f.syncResolveTwiceA, [this.f, 'syncResolveRejectA']],
        [[this.f, this.f.syncResolveTwiceA], this.f.syncResolveRejectA],
        [[this.f, this.f.syncResolveTwiceA], [this.f, 'syncResolveRejectA']],
        [[this.f, this.f.syncResolveTwiceA, this.f.syncResolveRejectA]],
        [[this.f, 'syncResolveTwiceA', 'syncResolveRejectA']]
      ];
    });

    it('the functions should be called in the following order: A, B and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveTwiceA', 'syncResolveRejectA', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first resolves twice and second both resolves and rejects and the first executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceFaster', 'asyncResolveRejectSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceFaster, this.f.asyncResolveRejectSlower],
        [this.f.asyncResolveTwiceFaster, [this.f, 'asyncResolveRejectSlower']],
        [[this.f, this.f.asyncResolveTwiceFaster], this.f.asyncResolveRejectSlower],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, 'asyncResolveRejectSlower']],
        [[this.f, this.f.asyncResolveTwiceFaster, this.f.asyncResolveRejectSlower]],
        [[this.f, 'asyncResolveTwiceFaster', 'asyncResolveRejectSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onDone when B resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceFaster', 'asyncResolveRejectSlower')
          .after(500).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first resolves twice and second both resolves and rejects and the second executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceSlower', 'asyncResolveRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceSlower, this.f.asyncResolveRejectFaster],
        [this.f.asyncResolveTwiceSlower, [this.f, 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveTwiceSlower], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveTwiceSlower, this.f.asyncResolveRejectFaster]],
        [[this.f, 'asyncResolveTwiceSlower', 'asyncResolveRejectFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceSlower', 'asyncResolveRejectFaster')
          .after(550).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first asynchronous and second synchronous functions, where first resolves twice and second both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceFaster', 'syncResolveRejectA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceFaster, this.f.syncResolveRejectA],
        [this.f.asyncResolveTwiceFaster, [this.f, 'syncResolveRejectA']],
        [[this.f, this.f.asyncResolveTwiceFaster], this.f.syncResolveRejectA],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, 'syncResolveRejectA']],
        [[this.f, this.f.asyncResolveTwiceFaster, this.f.syncResolveRejectA]],
        [[this.f, 'asyncResolveTwiceFaster', 'syncResolveRejectA']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceFaster', 'syncResolveRejectA')
          .after(100).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first synchronous and second asynchronous functions, where first resolves twice and second both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveTwiceA', 'asyncResolveRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveTwiceA, this.f.asyncResolveRejectFaster],
        [this.f.syncResolveTwiceA, [this.f, 'asyncResolveRejectFaster']],
        [[this.f, this.f.syncResolveTwiceA], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.syncResolveTwiceA], [this.f, 'asyncResolveRejectFaster']],
        [[this.f, this.f.syncResolveTwiceA, this.f.asyncResolveRejectFaster]],
        [[this.f, 'syncResolveTwiceA', 'asyncResolveRejectFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onDone when B resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveTwiceA', 'asyncResolveRejectFaster')
          .after(150).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first resolves twice and second both resolves and rejects and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveTwiceA', 'syncResolveRejectA', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveTwiceA, this.f.syncResolveRejectA],
        [this.f.syncResolveTwiceA, [this.f, 'syncResolveRejectA']],
        [[this.f, this.f.syncResolveTwiceA], this.f.syncResolveRejectA],
        [[this.f, this.f.syncResolveTwiceA], [this.f, 'syncResolveRejectA']],
        [[this.f, this.f.syncResolveTwiceA, this.f.syncResolveRejectA]],
        [[this.f, 'syncResolveTwiceA', 'syncResolveRejectA']]
      ];
    });

    it('the functions should be called in the following order: A, B, onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveTwiceA', 'syncResolveRejectA', 'syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first resolves twice and second both resolves and rejects and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceFaster', 'asyncResolveRejectSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceFaster, this.f.asyncResolveRejectSlower],
        [this.f.asyncResolveTwiceFaster, [this.f, 'asyncResolveRejectSlower']],
        [[this.f, this.f.asyncResolveTwiceFaster], this.f.asyncResolveRejectSlower],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, 'asyncResolveRejectSlower']],
        [[this.f, this.f.asyncResolveTwiceFaster, this.f.asyncResolveRejectSlower]],
        [[this.f, 'asyncResolveTwiceFaster', 'asyncResolveRejectSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onDone, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceFaster', 'asyncResolveRejectSlower')
          .after(500).add('asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first resolves twice and second both resolves and rejects and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceSlower', 'asyncResolveRejectFaster', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceSlower, this.f.asyncResolveRejectFaster],
        [this.f.asyncResolveTwiceSlower, [this.f, 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveTwiceSlower], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveTwiceSlower, this.f.asyncResolveRejectFaster]],
        [[this.f, 'asyncResolveTwiceSlower', 'asyncResolveRejectFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onDone, then onCatch, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceSlower', 'asyncResolveRejectFaster')
          .after(550).add('asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first both resolves and rejects and second resolves twice', function () {
    beforeAll(function () {
      this.spies = ['syncResolveRejectA', 'syncResolveTwiceA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveRejectA, this.f.syncResolveTwiceA],
        [this.f.syncResolveRejectA, [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.syncResolveRejectA], this.f.syncResolveTwiceA],
        [[this.f, this.f.syncResolveRejectA], [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.syncResolveRejectA, this.f.syncResolveTwiceA]],
        [[this.f, 'syncResolveRejectA', 'syncResolveTwiceA']]
      ];
    });

    it('the functions should be called in the following order: A, B and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveRejectA', 'syncResolveTwiceA', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first both resolves and rejects and second resolves twice and the first executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectFaster', 'asyncResolveTwiceSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectFaster, this.f.asyncResolveTwiceSlower],
        [this.f.asyncResolveRejectFaster, [this.f, 'asyncResolveTwiceSlower']],
        [[this.f, this.f.asyncResolveRejectFaster], this.f.asyncResolveTwiceSlower],
        [[this.f, this.f.asyncResolveRejectFaster], [this.f, 'asyncResolveTwiceSlower']],
        [[this.f, this.f.asyncResolveRejectFaster, this.f.asyncResolveTwiceSlower]],
        [[this.f, 'asyncResolveRejectFaster', 'asyncResolveTwiceSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onDone when B resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectFaster', 'asyncResolveTwiceSlower')
          .after(550).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first both resolves and rejects and second resolves twice and the second executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectSlower', 'asyncResolveTwiceFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectSlower, this.f.asyncResolveTwiceFaster],
        [this.f.asyncResolveRejectSlower, [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.asyncResolveRejectSlower], this.f.asyncResolveTwiceFaster],
        [[this.f, this.f.asyncResolveRejectSlower], [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.asyncResolveRejectSlower, this.f.asyncResolveTwiceFaster]],
        [[this.f, 'asyncResolveRejectSlower', 'asyncResolveTwiceFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectSlower', 'asyncResolveTwiceFaster')
          .after(500).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first asynchronous and second synchronous functions, where first both resolves and rejects and second resolves twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectFaster', 'syncResolveTwiceA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectFaster, this.f.syncResolveTwiceA],
        [this.f.asyncResolveRejectFaster, [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.asyncResolveRejectFaster], this.f.syncResolveTwiceA],
        [[this.f, this.f.asyncResolveRejectFaster], [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.asyncResolveRejectFaster, this.f.syncResolveTwiceA]],
        [[this.f, 'asyncResolveRejectFaster', 'syncResolveTwiceA']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectFaster', 'syncResolveTwiceA')
          .after(150).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first synchronous and second asynchronous functions, where first both resolves and rejects and second resolves twice', function () {
    beforeAll(function () {
      this.spies = ['syncResolveRejectA', 'asyncResolveTwiceFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveRejectA, this.f.asyncResolveTwiceFaster],
        [this.f.syncResolveRejectA, [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.syncResolveRejectA], this.f.asyncResolveTwiceFaster],
        [[this.f, this.f.syncResolveRejectA], [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.syncResolveRejectA, this.f.asyncResolveTwiceFaster]],
        [[this.f, 'syncResolveRejectA', 'asyncResolveTwiceFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onDone when B resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveRejectA', 'asyncResolveTwiceFaster')
          .after(100).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first both resolves and rejects and second resolves twice and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveRejectA', 'syncResolveTwiceA', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveRejectA, this.f.syncResolveTwiceA],
        [this.f.syncResolveRejectA, [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.syncResolveRejectA], this.f.syncResolveTwiceA],
        [[this.f, this.f.syncResolveRejectA], [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.syncResolveRejectA, this.f.syncResolveTwiceA]],
        [[this.f, 'syncResolveRejectA', 'syncResolveTwiceA']]
      ];
    });

    it('the functions should be called in the following order: A, B, onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveRejectA', 'syncResolveTwiceA', 'syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first both resolves and rejects and second resolves twice and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectFaster', 'asyncResolveTwiceSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectFaster, this.f.asyncResolveTwiceSlower],
        [this.f.asyncResolveRejectFaster, [this.f, 'asyncResolveTwiceSlower']],
        [[this.f, this.f.asyncResolveRejectFaster], this.f.asyncResolveTwiceSlower],
        [[this.f, this.f.asyncResolveRejectFaster], [this.f, 'asyncResolveTwiceSlower']],
        [[this.f, this.f.asyncResolveRejectFaster, this.f.asyncResolveTwiceSlower]],
        [[this.f, 'asyncResolveRejectFaster', 'asyncResolveTwiceSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onDone, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectFaster', 'asyncResolveTwiceSlower')
          .after(550).add('asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first both resolves and rejects and second resolves twice and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectSlower', 'asyncResolveTwiceFaster', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectSlower, this.f.asyncResolveTwiceFaster],
        [this.f.asyncResolveRejectSlower, [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.asyncResolveRejectSlower], this.f.asyncResolveTwiceFaster],
        [[this.f, this.f.asyncResolveRejectSlower], [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.asyncResolveRejectSlower, this.f.asyncResolveTwiceFaster]],
        [[this.f, 'asyncResolveRejectSlower', 'asyncResolveTwiceFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onDone when A resolves, then onCatch, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectSlower', 'asyncResolveTwiceFaster')
          .after(500).add('asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first both resolves and rejects and the second as well', function () {
    beforeAll(function () {
      this.spies = ['syncResolveRejectA', 'syncResolveRejectB', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveRejectA, this.f.syncResolveRejectB],
        [this.f.syncResolveRejectA, [this.f, 'syncResolveRejectB']],
        [[this.f, this.f.syncResolveRejectA], this.f.syncResolveRejectB],
        [[this.f, this.f.syncResolveRejectA], [this.f, 'syncResolveRejectB']],
        [[this.f, this.f.syncResolveRejectA, this.f.syncResolveRejectB]],
        [[this.f, 'syncResolveRejectA', 'syncResolveRejectB']]
      ];
    });

    it('the functions should be called in the following order: A, B and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveRejectA', 'syncResolveRejectB', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first both resolves and rejects and the second as well and the first executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectFaster', 'asyncResolveRejectSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectFaster, this.f.asyncResolveRejectSlower],
        [this.f.asyncResolveRejectFaster, [this.f, 'asyncResolveRejectSlower']],
        [[this.f, this.f.asyncResolveRejectFaster], this.f.asyncResolveRejectSlower],
        [[this.f, this.f.asyncResolveRejectFaster], [this.f, 'asyncResolveRejectSlower']],
        [[this.f, this.f.asyncResolveRejectFaster, this.f.asyncResolveRejectSlower]],
        [[this.f, 'asyncResolveRejectFaster', 'asyncResolveRejectSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onDone when B resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectFaster', 'asyncResolveRejectSlower')
          .after(500).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first both resolves and rejects and the second as well and the second executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectSlower', 'asyncResolveRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectSlower, this.f.asyncResolveRejectFaster],
        [this.f.asyncResolveRejectSlower, [this.f, 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveRejectSlower], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.asyncResolveRejectSlower], [this.f, 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveRejectSlower, this.f.asyncResolveRejectFaster]],
        [[this.f, 'asyncResolveRejectSlower', 'asyncResolveRejectFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectSlower', 'asyncResolveRejectFaster')
          .after(500).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first asynchronous and second synchronous functions, where first both resolves and rejects and the second as well', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectFaster', 'syncResolveRejectA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectFaster, this.f.syncResolveRejectA],
        [this.f.asyncResolveRejectFaster, [this.f, 'syncResolveRejectA']],
        [[this.f, this.f.asyncResolveRejectFaster], this.f.syncResolveRejectA],
        [[this.f, this.f.asyncResolveRejectFaster], [this.f, 'syncResolveRejectA']],
        [[this.f, this.f.asyncResolveRejectFaster, this.f.syncResolveRejectA]],
        [[this.f, 'asyncResolveRejectFaster', 'syncResolveRejectA']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectFaster', 'syncResolveRejectA')
          .after(150).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first synchronous and second asynchronous functions, where first both resolves and rejects and the second as well', function () {
    beforeAll(function () {
      this.spies = ['syncResolveRejectA', 'asyncResolveRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveRejectA, this.f.asyncResolveRejectFaster],
        [this.f.syncResolveRejectA, [this.f, 'asyncResolveRejectFaster']],
        [[this.f, this.f.syncResolveRejectA], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.syncResolveRejectA], [this.f, 'asyncResolveRejectFaster']],
        [[this.f, this.f.syncResolveRejectA, this.f.asyncResolveRejectFaster]],
        [[this.f, 'syncResolveRejectA', 'asyncResolveRejectFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveRejectA', 'asyncResolveRejectFaster')
          .after(150).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first both resolves and rejects and the second as well and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveRejectA', 'syncResolveRejectB', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveRejectA, this.f.syncResolveRejectB],
        [this.f.syncResolveRejectA, [this.f, 'syncResolveRejectB']],
        [[this.f, this.f.syncResolveRejectA], this.f.syncResolveRejectB],
        [[this.f, this.f.syncResolveRejectA], [this.f, 'syncResolveRejectB']],
        [[this.f, this.f.syncResolveRejectA, this.f.syncResolveRejectB]],
        [[this.f, 'syncResolveRejectA', 'syncResolveRejectB']]
      ];
    });

    it('the functions should be called in the following order: A, B, onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveRejectA', 'syncResolveRejectB', 'syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first both resolves and rejects and the second as well and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectFaster', 'asyncResolveRejectSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectFaster, this.f.asyncResolveRejectSlower],
        [this.f.asyncResolveRejectFaster, [this.f, 'asyncResolveRejectSlower']],
        [[this.f, this.f.asyncResolveRejectFaster], this.f.asyncResolveRejectSlower],
        [[this.f, this.f.asyncResolveRejectFaster], [this.f, 'asyncResolveRejectSlower']],
        [[this.f, this.f.asyncResolveRejectFaster, this.f.asyncResolveRejectSlower]],
        [[this.f, 'asyncResolveRejectFaster', 'asyncResolveRejectSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onDone when B resolves, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectFaster', 'asyncResolveRejectSlower')
          .after(500).add('asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first both resolves and rejects and the second as well and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectSlower', 'asyncResolveRejectFaster', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectSlower, this.f.asyncResolveRejectFaster],
        [this.f.asyncResolveRejectSlower, [this.f, 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveRejectSlower], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.asyncResolveRejectSlower], [this.f, 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveRejectSlower, this.f.asyncResolveRejectFaster]],
        [[this.f, 'asyncResolveRejectSlower', 'asyncResolveRejectFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onDone, then onCatch, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectSlower', 'asyncResolveRejectFaster')
          .after(500).add('asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first resolves twice and second rejects twice', function () {
    beforeAll(function () {
      this.spies = ['syncResolveTwiceA', 'syncRejectTwice', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveTwiceA, this.f.syncRejectTwice],
        [this.f.syncResolveTwiceA, [this.f, 'syncRejectTwice']],
        [[this.f, this.f.syncResolveTwiceA], this.f.syncRejectTwice],
        [[this.f, this.f.syncResolveTwiceA], [this.f, 'syncRejectTwice']],
        [[this.f, this.f.syncResolveTwiceA, this.f.syncRejectTwice]],
        [[this.f, 'syncResolveTwiceA', 'syncRejectTwice']]
      ];
    });

    it('the functions should be called in the following order: A, B, onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveTwiceA', 'syncRejectTwice', 'syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first resolves twice and second rejects twice and the first executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceFaster', 'asyncRejectTwiceSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceFaster, this.f.asyncRejectTwiceSlower],
        [this.f.asyncResolveTwiceFaster, [this.f, 'asyncRejectTwiceSlower']],
        [[this.f, this.f.asyncResolveTwiceFaster], this.f.asyncRejectTwiceSlower],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, 'asyncRejectTwiceSlower']],
        [[this.f, this.f.asyncResolveTwiceFaster, this.f.asyncRejectTwiceSlower]],
        [[this.f, 'asyncResolveTwiceFaster', 'asyncRejectTwiceSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when B rejects and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceFaster', 'asyncRejectTwiceSlower')
          .after(650).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first resolves twice and second rejects twice and the second executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceSlower', 'asyncRejectTwiceFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceSlower, this.f.asyncRejectTwiceFaster],
        [this.f.asyncResolveTwiceSlower, [this.f, 'asyncRejectTwiceFaster']],
        [[this.f, this.f.asyncResolveTwiceSlower], this.f.asyncRejectTwiceFaster],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, 'asyncRejectTwiceFaster']],
        [[this.f, this.f.asyncResolveTwiceSlower, this.f.asyncRejectTwiceFaster]],
        [[this.f, 'asyncResolveTwiceSlower', 'asyncRejectTwiceFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when B rejects, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceSlower', 'asyncRejectTwiceFaster')
          .after(50).add('syncCatch')
          .after(500).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first asynchronous and second synchronous functions, where first resolves twice and second rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceFaster', 'syncRejectTwice', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceFaster, this.f.syncRejectTwice],
        [this.f.asyncResolveTwiceFaster, [this.f, 'syncRejectTwice']],
        [[this.f, this.f.asyncResolveTwiceFaster], this.f.syncRejectTwice],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, 'syncRejectTwice']],
        [[this.f, this.f.asyncResolveTwiceFaster, this.f.syncRejectTwice]],
        [[this.f, 'asyncResolveTwiceFaster', 'syncRejectTwice']]
      ];
    });

    it('the functions should be called in the following order: A, B and onCatch, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceFaster', 'syncRejectTwice', 'syncCatch')
          .after(100).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first synchronous and second asynchronous functions, where first resolves twice and second rejects twice', function () {
    beforeAll(function () {
      this.spies = ['syncResolveTwiceA', 'asyncRejectTwiceFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveTwiceA, this.f.asyncRejectTwiceFaster],
        [this.f.syncResolveTwiceA, [this.f, 'asyncRejectTwiceFaster']],
        [[this.f, this.f.syncResolveTwiceA], this.f.asyncRejectTwiceFaster],
        [[this.f, this.f.syncResolveTwiceA], [this.f, 'asyncRejectTwiceFaster']],
        [[this.f, this.f.syncResolveTwiceA, this.f.asyncRejectTwiceFaster]],
        [[this.f, 'syncResolveTwiceA', 'asyncRejectTwiceFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when B rejects and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveTwiceA', 'asyncRejectTwiceFaster')
          .after(50).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first resolves twice and second rejects twice and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveTwiceA', 'syncRejectTwice', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveTwiceA, this.f.syncRejectTwice],
        [this.f.syncResolveTwiceA, [this.f, 'syncRejectTwice']],
        [[this.f, this.f.syncResolveTwiceA], this.f.syncRejectTwice],
        [[this.f, this.f.syncResolveTwiceA], [this.f, 'syncRejectTwice']],
        [[this.f, this.f.syncResolveTwiceA, this.f.syncRejectTwice]],
        [[this.f, 'syncResolveTwiceA', 'syncRejectTwice']]
      ];
    });

    it('the functions should be called in the following order: A, B, onCatch, onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveTwiceA', 'syncRejectTwice', 'syncCatch', 'syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first resolves twice and second rejects twice and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceFaster', 'asyncRejectTwiceSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceFaster, this.f.asyncRejectTwiceSlower],
        [this.f.asyncResolveTwiceFaster, [this.f, 'asyncRejectTwiceSlower']],
        [[this.f, this.f.asyncResolveTwiceFaster], this.f.asyncRejectTwiceSlower],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, 'asyncRejectTwiceSlower']],
        [[this.f, this.f.asyncResolveTwiceFaster, this.f.asyncRejectTwiceSlower]],
        [[this.f, 'asyncResolveTwiceFaster', 'asyncRejectTwiceSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch and onDone, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceFaster', 'asyncRejectTwiceSlower')
          .after(650).add('syncCatch', 'asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first resolves twice and second rejects twice and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceSlower', 'asyncRejectTwiceFaster', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceSlower, this.f.asyncRejectTwiceFaster],
        [this.f.asyncResolveTwiceSlower, [this.f, 'asyncRejectTwiceFaster']],
        [[this.f, this.f.asyncResolveTwiceSlower], this.f.asyncRejectTwiceFaster],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, 'asyncRejectTwiceFaster']],
        [[this.f, this.f.asyncResolveTwiceSlower, this.f.asyncRejectTwiceFaster]],
        [[this.f, 'asyncResolveTwiceSlower', 'asyncRejectTwiceFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when B rejects', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceSlower', 'asyncRejectTwiceFaster')
          .after(50).add('syncCatch')
          .after(500).add('asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first resolves twice and second both rejects and resolves', function () {
    beforeAll(function () {
      this.spies = ['syncResolveTwiceA', 'syncRejectResolveA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveTwiceA, this.f.syncRejectResolveA],
        [this.f.syncResolveTwiceA, [this.f, 'syncRejectResolveA']],
        [[this.f, this.f.syncResolveTwiceA], this.f.syncRejectResolveA],
        [[this.f, this.f.syncResolveTwiceA], [this.f, 'syncRejectResolveA']],
        [[this.f, this.f.syncResolveTwiceA, this.f.syncRejectResolveA]],
        [[this.f, 'syncResolveTwiceA', 'syncRejectResolveA']]
      ];
    });

    it('the functions should be called in the following order: A, B, onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveTwiceA', 'syncRejectResolveA', 'syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first resolves twice and second both rejects and resolves and the first executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceFaster', 'asyncRejectResolveSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceFaster, this.f.asyncRejectResolveSlower],
        [this.f.asyncResolveTwiceFaster, [this.f, 'asyncRejectResolveSlower']],
        [[this.f, this.f.asyncResolveTwiceFaster], this.f.asyncRejectResolveSlower],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, 'asyncRejectResolveSlower']],
        [[this.f, this.f.asyncResolveTwiceFaster, this.f.asyncRejectResolveSlower]],
        [[this.f, 'asyncResolveTwiceFaster', 'asyncRejectResolveSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when B rejects and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceFaster', 'asyncRejectResolveSlower')
          .after(450).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first resolves twice and second both rejects and resolves and the second executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceSlower', 'asyncRejectResolveFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceSlower, this.f.asyncRejectResolveFaster],
        [this.f.asyncResolveTwiceSlower, [this.f, 'asyncRejectResolveFaster']],
        [[this.f, this.f.asyncResolveTwiceSlower], this.f.asyncRejectResolveFaster],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, 'asyncRejectResolveFaster']],
        [[this.f, this.f.asyncResolveTwiceSlower, this.f.asyncRejectResolveFaster]],
        [[this.f, 'asyncResolveTwiceSlower', 'asyncRejectResolveFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when B rejects, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceSlower', 'asyncRejectResolveFaster')
          .after(100).add('syncCatch')
          .after(450).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first asynchronous and second synchronous functions, where first resolves twice and second both rejects and resolves', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceFaster', 'syncRejectResolveA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceFaster, this.f.syncRejectResolveA],
        [this.f.asyncResolveTwiceFaster, [this.f, 'syncRejectResolveA']],
        [[this.f, this.f.asyncResolveTwiceFaster], this.f.syncRejectResolveA],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, 'syncRejectResolveA']],
        [[this.f, this.f.asyncResolveTwiceFaster, this.f.syncRejectResolveA]],
        [[this.f, 'asyncResolveTwiceFaster', 'syncRejectResolveA']]
      ];
    });

    it('the functions should be called in the following order: A, B and onCatch, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceFaster', 'syncRejectResolveA', 'syncCatch')
          .after(100).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first synchronous and second asynchronous functions, where first resolves twice and second both rejects and resolves', function () {
    beforeAll(function () {
      this.spies = ['syncResolveTwiceA', 'asyncRejectResolveFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveTwiceA, this.f.asyncRejectResolveFaster],
        [this.f.syncResolveTwiceA, [this.f, 'asyncRejectResolveFaster']],
        [[this.f, this.f.syncResolveTwiceA], this.f.asyncRejectResolveFaster],
        [[this.f, this.f.syncResolveTwiceA], [this.f, 'asyncRejectResolveFaster']],
        [[this.f, this.f.syncResolveTwiceA, this.f.asyncRejectResolveFaster]],
        [[this.f, 'syncResolveTwiceA', 'asyncRejectResolveFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when B rejects and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveTwiceA', 'asyncRejectResolveFaster')
          .after(100).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first resolves twice and second both rejects and resolves and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveTwiceA', 'syncRejectResolveA', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveTwiceA, this.f.syncRejectResolveA],
        [this.f.syncResolveTwiceA, [this.f, 'syncRejectResolveA']],
        [[this.f, this.f.syncResolveTwiceA], this.f.syncRejectResolveA],
        [[this.f, this.f.syncResolveTwiceA], [this.f, 'syncRejectResolveA']],
        [[this.f, this.f.syncResolveTwiceA, this.f.syncRejectResolveA]],
        [[this.f, 'syncResolveTwiceA', 'syncRejectResolveA']]
      ];
    });

    it('the functions should be called in the following order: A, B, onCatch, onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveTwiceA', 'syncRejectResolveA', 'syncCatch', 'syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first resolves twice and second both rejects and resolves and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceFaster', 'asyncRejectResolveSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceFaster, this.f.asyncRejectResolveSlower],
        [this.f.asyncResolveTwiceFaster, [this.f, 'asyncRejectResolveSlower']],
        [[this.f, this.f.asyncResolveTwiceFaster], this.f.asyncRejectResolveSlower],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, 'asyncRejectResolveSlower']],
        [[this.f, this.f.asyncResolveTwiceFaster, this.f.asyncRejectResolveSlower]],
        [[this.f, 'asyncResolveTwiceFaster', 'asyncRejectResolveSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when B rejects and onDone, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceFaster', 'asyncRejectResolveSlower')
          .after(450).add('syncCatch', 'asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first resolves twice and second both rejects and resolves and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceSlower', 'asyncRejectResolveFaster', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceSlower, this.f.asyncRejectResolveFaster],
        [this.f.asyncResolveTwiceSlower, [this.f, 'asyncRejectResolveFaster']],
        [[this.f, this.f.asyncResolveTwiceSlower], this.f.asyncRejectResolveFaster],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, 'asyncRejectResolveFaster']],
        [[this.f, this.f.asyncResolveTwiceSlower, this.f.asyncRejectResolveFaster]],
        [[this.f, 'asyncResolveTwiceSlower', 'asyncRejectResolveFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when B rejects, then onDone, then onCatch, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceSlower', 'asyncRejectResolveFaster')
          .after(100).add('syncCatch')
          .after(450).add('asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first both rejects and resolves and second neither resolves nor rejects', function () {
    beforeAll(function () {
      this.spies = ['syncRejectResolveA', 'syncVoidA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncRejectResolveA, this.f.syncVoidA],
        [this.f.syncRejectResolveA, [this.f, 'syncVoidA']],
        [[this.f, this.f.syncRejectResolveA], this.f.syncVoidA],
        [[this.f, this.f.syncRejectResolveA], [this.f, 'syncVoidA']],
        [[this.f, this.f.syncRejectResolveA, this.f.syncVoidA]],
        [[this.f, 'syncRejectResolveA', 'syncVoidA']]
      ];
    });

    it('the functions should be called in the following order: A, onCatch and B', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncRejectResolveA', 'syncCatch', 'syncVoidA')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first both rejects and resolves and second neither resolves nor rejects and the first executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectResolveFaster', 'asyncVoidSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectResolveFaster, this.f.asyncVoidSlower],
        [this.f.asyncRejectResolveFaster, [this.f, 'asyncVoidSlower']],
        [[this.f, this.f.asyncRejectResolveFaster], this.f.asyncVoidSlower],
        [[this.f, this.f.asyncRejectResolveFaster], [this.f, 'asyncVoidSlower']],
        [[this.f, this.f.asyncRejectResolveFaster, this.f.asyncVoidSlower]],
        [[this.f, 'asyncRejectResolveFaster', 'asyncVoidSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when A rejects', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectResolveFaster', 'asyncVoidSlower')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first both rejects and resolves and second neither resolves nor rejects and the second executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectResolveSlower', 'asyncVoidFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectResolveSlower, this.f.asyncVoidFaster],
        [this.f.asyncRejectResolveSlower, [this.f, 'asyncVoidFaster']],
        [[this.f, this.f.asyncRejectResolveSlower], this.f.asyncVoidFaster],
        [[this.f, this.f.asyncRejectResolveSlower], [this.f, 'asyncVoidFaster']],
        [[this.f, this.f.asyncRejectResolveSlower, this.f.asyncVoidFaster]],
        [[this.f, 'asyncRejectResolveSlower', 'asyncVoidFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when A rejects', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectResolveSlower', 'asyncVoidFaster')
          .after(450).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with first asynchronous and second synchronous functions, where first both rejects and resolves and second neither resolves nor rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectResolveFaster', 'syncVoidA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectResolveFaster, this.f.syncVoidA],
        [this.f.asyncRejectResolveFaster, [this.f, 'syncVoidA']],
        [[this.f, this.f.asyncRejectResolveFaster], this.f.syncVoidA],
        [[this.f, this.f.asyncRejectResolveFaster], [this.f, 'syncVoidA']],
        [[this.f, this.f.asyncRejectResolveFaster, this.f.syncVoidA]],
        [[this.f, 'asyncRejectResolveFaster', 'syncVoidA']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when A rejects', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectResolveFaster', 'syncVoidA')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with first synchronous and second asynchronous functions, where first both rejects and resolves and second neither resolves nor rejects', function () {
    beforeAll(function () {
      this.spies = ['syncRejectResolveA', 'asyncVoidFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncRejectResolveA, this.f.asyncVoidFaster],
        [this.f.syncRejectResolveA, [this.f, 'asyncVoidFaster']],
        [[this.f, this.f.syncRejectResolveA], this.f.asyncVoidFaster],
        [[this.f, this.f.syncRejectResolveA], [this.f, 'asyncVoidFaster']],
        [[this.f, this.f.syncRejectResolveA, this.f.asyncVoidFaster]],
        [[this.f, 'syncRejectResolveA', 'asyncVoidFaster']]
      ];
    });

    it('the functions should be called in the following order: A, onCatch and B', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncRejectResolveA', 'syncCatch', 'asyncVoidFaster')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first both rejects and resolves and second neither resolves nor rejects and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncRejectResolveA', 'syncVoidA', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncRejectResolveA, this.f.syncVoidA],
        [this.f.syncRejectResolveA, [this.f, 'syncVoidA']],
        [[this.f, this.f.syncRejectResolveA], this.f.syncVoidA],
        [[this.f, this.f.syncRejectResolveA], [this.f, 'syncVoidA']],
        [[this.f, this.f.syncRejectResolveA, this.f.syncVoidA]],
        [[this.f, 'syncRejectResolveA', 'syncVoidA']]
      ];
    });

    it('the functions should be called in the following order: A, onCatch and B', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncRejectResolveA', 'syncCatch', 'syncVoidA')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first both rejects and resolves and second neither resolves nor rejects and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectResolveFaster', 'asyncVoidSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectResolveFaster, this.f.asyncVoidSlower],
        [this.f.asyncRejectResolveFaster, [this.f, 'asyncVoidSlower']],
        [[this.f, this.f.asyncRejectResolveFaster], this.f.asyncVoidSlower],
        [[this.f, this.f.asyncRejectResolveFaster], [this.f, 'asyncVoidSlower']],
        [[this.f, this.f.asyncRejectResolveFaster, this.f.asyncVoidSlower]],
        [[this.f, 'asyncRejectResolveFaster', 'asyncVoidSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when A rejects', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectResolveFaster', 'asyncVoidSlower')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first both rejects and resolves and second neither resolves nor rejects and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectResolveSlower', 'asyncVoidFaster', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectResolveSlower, this.f.asyncVoidFaster],
        [this.f.asyncRejectResolveSlower, [this.f, 'asyncVoidFaster']],
        [[this.f, this.f.asyncRejectResolveSlower], this.f.asyncVoidFaster],
        [[this.f, this.f.asyncRejectResolveSlower], [this.f, 'asyncVoidFaster']],
        [[this.f, this.f.asyncRejectResolveSlower, this.f.asyncVoidFaster]],
        [[this.f, 'asyncRejectResolveSlower', 'asyncVoidFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when A rejects', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectResolveSlower', 'asyncVoidFaster')
          .after(450).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first both rejects and resolves and second resolves twice', function () {
    beforeAll(function () {
      this.spies = ['syncRejectResolveA', 'syncResolveTwiceA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncRejectResolveA, this.f.syncResolveTwiceA],
        [this.f.syncRejectResolveA, [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.syncRejectResolveA], this.f.syncResolveTwiceA],
        [[this.f, this.f.syncRejectResolveA], [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.syncRejectResolveA, this.f.syncResolveTwiceA]],
        [[this.f, 'syncRejectResolveA', 'syncResolveTwiceA']]
      ];
    });

    it('the functions should be called in the following order: A, onCatch, B and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncRejectResolveA', 'syncCatch', 'syncResolveTwiceA', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first both rejects and resolves and second resolves twice and the first executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectResolveFaster', 'asyncResolveTwiceSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectResolveFaster, this.f.asyncResolveTwiceSlower],
        [this.f.asyncRejectResolveFaster, [this.f, 'asyncResolveTwiceSlower']],
        [[this.f, this.f.asyncRejectResolveFaster], this.f.asyncResolveTwiceSlower],
        [[this.f, this.f.asyncRejectResolveFaster], [this.f, 'asyncResolveTwiceSlower']],
        [[this.f, this.f.asyncRejectResolveFaster, this.f.asyncResolveTwiceSlower]],
        [[this.f, 'asyncRejectResolveFaster', 'asyncResolveTwiceSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when A rejects, then onDone when B resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectResolveFaster', 'asyncResolveTwiceSlower')
          .after(100).add('syncCatch')
          .after(450).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first both rejects and resolves and second resolves twice and the second executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectResolveSlower', 'asyncResolveTwiceFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectResolveSlower, this.f.asyncResolveTwiceFaster],
        [this.f.asyncRejectResolveSlower, [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.asyncRejectResolveSlower], this.f.asyncResolveTwiceFaster],
        [[this.f, this.f.asyncRejectResolveSlower], [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.asyncRejectResolveSlower, this.f.asyncResolveTwiceFaster]],
        [[this.f, 'asyncRejectResolveSlower', 'asyncResolveTwiceFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when A rejects and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectResolveSlower', 'asyncResolveTwiceFaster')
          .after(450).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first asynchronous and second synchronous functions, where first both rejects and resolves and second resolves twice', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectResolveFaster', 'syncResolveTwiceA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectResolveFaster, this.f.syncResolveTwiceA],
        [this.f.asyncRejectResolveFaster, [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.asyncRejectResolveFaster], this.f.syncResolveTwiceA],
        [[this.f, this.f.asyncRejectResolveFaster], [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.asyncRejectResolveFaster, this.f.syncResolveTwiceA]],
        [[this.f, 'asyncRejectResolveFaster', 'syncResolveTwiceA']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when A rejects and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectResolveFaster', 'syncResolveTwiceA')
          .after(100).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first synchronous and second asynchronous functions, where first both rejects and resolves and second resolves twice', function () {
    beforeAll(function () {
      this.spies = ['syncRejectResolveA', 'asyncResolveTwiceFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncRejectResolveA, this.f.asyncResolveTwiceFaster],
        [this.f.syncRejectResolveA, [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.syncRejectResolveA], this.f.asyncResolveTwiceFaster],
        [[this.f, this.f.syncRejectResolveA], [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.syncRejectResolveA, this.f.asyncResolveTwiceFaster]],
        [[this.f, 'syncRejectResolveA', 'asyncResolveTwiceFaster']]
      ];
    });

    it('the functions should be called in the following order: A, onCatch and B, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncRejectResolveA', 'syncCatch', 'asyncResolveTwiceFaster')
          .after(100).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first both rejects and resolves and second resolves twice and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncRejectResolveA', 'syncResolveTwiceA', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncRejectResolveA, this.f.syncResolveTwiceA],
        [this.f.syncRejectResolveA, [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.syncRejectResolveA], this.f.syncResolveTwiceA],
        [[this.f, this.f.syncRejectResolveA], [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.syncRejectResolveA, this.f.syncResolveTwiceA]],
        [[this.f, 'syncRejectResolveA', 'syncResolveTwiceA']]
      ];
    });

    it('the functions should be called in the following order: A, onCatch, B, onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncRejectResolveA', 'syncCatch', 'syncResolveTwiceA', 'syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first both rejects and resolves and second resolves twice and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectResolveFaster', 'asyncResolveTwiceSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectResolveFaster, this.f.asyncResolveTwiceSlower],
        [this.f.asyncRejectResolveFaster, [this.f, 'asyncResolveTwiceSlower']],
        [[this.f, this.f.asyncRejectResolveFaster], this.f.asyncResolveTwiceSlower],
        [[this.f, this.f.asyncRejectResolveFaster], [this.f, 'asyncResolveTwiceSlower']],
        [[this.f, this.f.asyncRejectResolveFaster, this.f.asyncResolveTwiceSlower]],
        [[this.f, 'asyncRejectResolveFaster', 'asyncResolveTwiceSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when A rejects, then onDone when B resolves, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectResolveFaster', 'asyncResolveTwiceSlower')
          .after(100).add('syncCatch')
          .after(450).add('asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first both rejects and resolves and second resolves twice and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectResolveSlower', 'asyncResolveTwiceFaster', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectResolveSlower, this.f.asyncResolveTwiceFaster],
        [this.f.asyncRejectResolveSlower, [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.asyncRejectResolveSlower], this.f.asyncResolveTwiceFaster],
        [[this.f, this.f.asyncRejectResolveSlower], [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.asyncRejectResolveSlower, this.f.asyncResolveTwiceFaster]],
        [[this.f, 'asyncRejectResolveSlower', 'asyncResolveTwiceFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch and onDone, then onCatch, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectResolveSlower', 'asyncResolveTwiceFaster')
          .after(450).add('syncCatch', 'asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first neither resolves nor rejects and second resolves twice', function () {
    beforeAll(function () {
      this.spies = ['syncVoidA', 'syncResolveTwiceA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncVoidA, this.f.syncResolveTwiceA],
        [this.f.syncVoidA, [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.syncVoidA], this.f.syncResolveTwiceA],
        [[this.f, this.f.syncVoidA], [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.syncVoidA, this.f.syncResolveTwiceA]],
        [[this.f, 'syncVoidA', 'syncResolveTwiceA']]
      ];
    });

    it('the functions should be called in the following order: A and B', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncVoidA', 'syncResolveTwiceA')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first neither resolves nor rejects and second resolves twice and the first executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncVoidFaster', 'asyncResolveTwiceSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncVoidFaster, this.f.asyncResolveTwiceSlower],
        [this.f.asyncVoidFaster, [this.f, 'asyncResolveTwiceSlower']],
        [[this.f, this.f.asyncVoidFaster], this.f.asyncResolveTwiceSlower],
        [[this.f, this.f.asyncVoidFaster], [this.f, 'asyncResolveTwiceSlower']],
        [[this.f, this.f.asyncVoidFaster, this.f.asyncResolveTwiceSlower]],
        [[this.f, 'asyncVoidFaster', 'asyncResolveTwiceSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncVoidFaster', 'asyncResolveTwiceSlower')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first neither resolves nor rejects and second resolves twice and the second executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncVoidSlower', 'asyncResolveTwiceFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncVoidSlower, this.f.asyncResolveTwiceFaster],
        [this.f.asyncVoidSlower, [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.asyncVoidSlower], this.f.asyncResolveTwiceFaster],
        [[this.f, this.f.asyncVoidSlower], [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.asyncVoidSlower, this.f.asyncResolveTwiceFaster]],
        [[this.f, 'asyncVoidSlower', 'asyncResolveTwiceFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncVoidSlower', 'asyncResolveTwiceFaster')
          .after(5000).keep();
      });
    });
  });

  describe('with first asynchronous and second synchronous functions, where first neither resolves nor rejects and second resolves twice', function () {
    beforeAll(function () {
      this.spies = ['asyncVoidFaster', 'syncResolveTwiceA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncVoidFaster, this.f.syncResolveTwiceA],
        [this.f.asyncVoidFaster, [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.asyncVoidFaster], this.f.syncResolveTwiceA],
        [[this.f, this.f.asyncVoidFaster], [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.asyncVoidFaster, this.f.syncResolveTwiceA]],
        [[this.f, 'asyncVoidFaster', 'syncResolveTwiceA']]
      ];
    });

    it('the functions should be called in the following order: A and B', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncVoidFaster', 'syncResolveTwiceA')
          .after(5000).keep();
      });
    });
  });

  describe('with first synchronous and second asynchronous functions, where first neither resolves nor rejects and second resolves twice', function () {
    beforeAll(function () {
      this.spies = ['syncVoidA', 'asyncResolveTwiceFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncVoidA, this.f.asyncResolveTwiceFaster],
        [this.f.syncVoidA, [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.syncVoidA], this.f.asyncResolveTwiceFaster],
        [[this.f, this.f.syncVoidA], [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.syncVoidA, this.f.asyncResolveTwiceFaster]],
        [[this.f, 'syncVoidA', 'asyncResolveTwiceFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncVoidA', 'asyncResolveTwiceFaster')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first neither resolves nor rejects and second resolves twice and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncVoidA', 'syncResolveTwiceA', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncVoidA, this.f.syncResolveTwiceA],
        [this.f.syncVoidA, [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.syncVoidA], this.f.syncResolveTwiceA],
        [[this.f, this.f.syncVoidA], [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.syncVoidA, this.f.syncResolveTwiceA]],
        [[this.f, 'syncVoidA', 'syncResolveTwiceA']]
      ];
    });

    it('the functions should be called in the following order: A and B', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncVoidA', 'syncResolveTwiceA')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first neither resolves nor rejects and second resolves twice and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncVoidFaster', 'asyncResolveTwiceSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncVoidFaster, this.f.asyncResolveTwiceSlower],
        [this.f.asyncVoidFaster, [this.f, 'asyncResolveTwiceSlower']],
        [[this.f, this.f.asyncVoidFaster], this.f.asyncResolveTwiceSlower],
        [[this.f, this.f.asyncVoidFaster], [this.f, 'asyncResolveTwiceSlower']],
        [[this.f, this.f.asyncVoidFaster, this.f.asyncResolveTwiceSlower]],
        [[this.f, 'asyncVoidFaster', 'asyncResolveTwiceSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncVoidFaster', 'asyncResolveTwiceSlower')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first neither resolves nor rejects and second resolves twice and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncVoidSlower', 'asyncResolveTwiceFaster', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncVoidSlower, this.f.asyncResolveTwiceFaster],
        [this.f.asyncVoidSlower, [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.asyncVoidSlower], this.f.asyncResolveTwiceFaster],
        [[this.f, this.f.asyncVoidSlower], [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.asyncVoidSlower, this.f.asyncResolveTwiceFaster]],
        [[this.f, 'asyncVoidSlower', 'asyncResolveTwiceFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncVoidSlower', 'asyncResolveTwiceFaster')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first neither resolves nor rejects and second as well', function () {
    beforeAll(function () {
      this.spies = ['syncVoidA', 'syncVoidB', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncVoidA, this.f.syncVoidB],
        [this.f.syncVoidA, [this.f, 'syncVoidB']],
        [[this.f, this.f.syncVoidA], this.f.syncVoidB],
        [[this.f, this.f.syncVoidA], [this.f, 'syncVoidB']],
        [[this.f, this.f.syncVoidA, this.f.syncVoidB]],
        [[this.f, 'syncVoidA', 'syncVoidB']]
      ];
    });

    it('the functions should be called in the following order: A and B', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncVoidA', 'syncVoidB')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first neither resolves nor rejects and second as well and the first executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncVoidFaster', 'asyncVoidSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncVoidFaster, this.f.asyncVoidSlower],
        [this.f.asyncVoidFaster, [this.f, 'asyncVoidSlower']],
        [[this.f, this.f.asyncVoidFaster], this.f.asyncVoidSlower],
        [[this.f, this.f.asyncVoidFaster], [this.f, 'asyncVoidSlower']],
        [[this.f, this.f.asyncVoidFaster, this.f.asyncVoidSlower]],
        [[this.f, 'asyncVoidFaster', 'asyncVoidSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncVoidFaster', 'asyncVoidSlower')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first neither resolves nor rejects and second as well and the second executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncVoidSlower', 'asyncVoidFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncVoidSlower, this.f.asyncVoidFaster],
        [this.f.asyncVoidSlower, [this.f, 'asyncVoidFaster']],
        [[this.f, this.f.asyncVoidSlower], this.f.asyncVoidFaster],
        [[this.f, this.f.asyncVoidSlower], [this.f, 'asyncVoidFaster']],
        [[this.f, this.f.asyncVoidSlower, this.f.asyncVoidFaster]],
        [[this.f, 'asyncVoidSlower', 'asyncVoidFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncVoidSlower', 'asyncVoidFaster')
          .after(5000).keep();
      });
    });
  });

  describe('with first asynchronous and second synchronous functions, where first neither resolves nor rejects and second as well', function () {
    beforeAll(function () {
      this.spies = ['asyncVoidFaster', 'syncVoidA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncVoidFaster, this.f.syncVoidA],
        [this.f.asyncVoidFaster, [this.f, 'syncVoidA']],
        [[this.f, this.f.asyncVoidFaster], this.f.syncVoidA],
        [[this.f, this.f.asyncVoidFaster], [this.f, 'syncVoidA']],
        [[this.f, this.f.asyncVoidFaster, this.f.syncVoidA]],
        [[this.f, 'asyncVoidFaster', 'syncVoidA']]
      ];
    });

    it('the functions should be called in the following order: A and B', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncVoidFaster', 'syncVoidA')
          .after(5000).keep();
      });
    });
  });

  describe('with first synchronous and second asynchronous functions, where first neither resolves nor rejects and second as well', function () {
    beforeAll(function () {
      this.spies = ['syncVoidA', 'asyncVoidFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncVoidA, this.f.asyncVoidFaster],
        [this.f.syncVoidA, [this.f, 'asyncVoidFaster']],
        [[this.f, this.f.syncVoidA], this.f.asyncVoidFaster],
        [[this.f, this.f.syncVoidA], [this.f, 'asyncVoidFaster']],
        [[this.f, this.f.syncVoidA, this.f.asyncVoidFaster]],
        [[this.f, 'syncVoidA', 'asyncVoidFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncVoidA', 'asyncVoidFaster')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first neither resolves nor rejects and second as well and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncVoidA', 'syncVoidB', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncVoidA, this.f.syncVoidB],
        [this.f.syncVoidA, [this.f, 'syncVoidB']],
        [[this.f, this.f.syncVoidA], this.f.syncVoidB],
        [[this.f, this.f.syncVoidA], [this.f, 'syncVoidB']],
        [[this.f, this.f.syncVoidA, this.f.syncVoidB]],
        [[this.f, 'syncVoidA', 'syncVoidB']]
      ];
    });

    it('the functions should be called in the following order: A and B', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncVoidA', 'syncVoidB')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first neither resolves nor rejects and second as well and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncVoidFaster', 'asyncVoidSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncVoidFaster, this.f.asyncVoidSlower],
        [this.f.asyncVoidFaster, [this.f, 'asyncVoidSlower']],
        [[this.f, this.f.asyncVoidFaster], this.f.asyncVoidSlower],
        [[this.f, this.f.asyncVoidFaster], [this.f, 'asyncVoidSlower']],
        [[this.f, this.f.asyncVoidFaster, this.f.asyncVoidSlower]],
        [[this.f, 'asyncVoidFaster', 'asyncVoidSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncVoidFaster', 'asyncVoidSlower')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first neither resolves nor rejects and second as well and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncVoidSlower', 'asyncVoidFaster', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncVoidSlower, this.f.asyncVoidFaster],
        [this.f.asyncVoidSlower, [this.f, 'asyncVoidFaster']],
        [[this.f, this.f.asyncVoidSlower], this.f.asyncVoidFaster],
        [[this.f, this.f.asyncVoidSlower], [this.f, 'asyncVoidFaster']],
        [[this.f, this.f.asyncVoidSlower, this.f.asyncVoidFaster]],
        [[this.f, 'asyncVoidSlower', 'asyncVoidFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncVoidSlower', 'asyncVoidFaster')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first both resolves and rejects and the second both rejects and resolves', function () {
    beforeAll(function () {
      this.spies = ['syncResolveRejectA', 'syncRejectResolveA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveRejectA, this.f.syncRejectResolveA],
        [this.f.syncResolveRejectA, [this.f, 'syncRejectResolveA']],
        [[this.f, this.f.syncResolveRejectA], this.f.syncRejectResolveA],
        [[this.f, this.f.syncResolveRejectA], [this.f, 'syncRejectResolveA']],
        [[this.f, this.f.syncResolveRejectA, this.f.syncRejectResolveA]],
        [[this.f, 'syncResolveRejectA', 'syncRejectResolveA']]
      ];
    });

    it('the functions should be called in the following order: A, B, onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveRejectA', 'syncRejectResolveA', 'syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first both resolves and rejects and the second both rejects and resolves and the first executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectFaster', 'asyncRejectResolveSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectFaster, this.f.asyncRejectResolveSlower],
        [this.f.asyncResolveRejectFaster, [this.f, 'asyncRejectResolveSlower']],
        [[this.f, this.f.asyncResolveRejectFaster], this.f.asyncRejectResolveSlower],
        [[this.f, this.f.asyncResolveRejectFaster], [this.f, 'asyncRejectResolveSlower']],
        [[this.f, this.f.asyncResolveRejectFaster, this.f.asyncRejectResolveSlower]],
        [[this.f, 'asyncResolveRejectFaster', 'asyncRejectResolveSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectFaster', 'asyncRejectResolveSlower')
          .after(450).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first both resolves and rejects and the second both rejects and resolves and the second executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectSlower', 'asyncRejectResolveFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectSlower, this.f.asyncRejectResolveFaster],
        [this.f.asyncResolveRejectSlower, [this.f, 'asyncRejectResolveFaster']],
        [[this.f, this.f.asyncResolveRejectSlower], this.f.asyncRejectResolveFaster],
        [[this.f, this.f.asyncResolveRejectSlower], [this.f, 'asyncRejectResolveFaster']],
        [[this.f, this.f.asyncResolveRejectSlower, this.f.asyncRejectResolveFaster]],
        [[this.f, 'asyncResolveRejectSlower', 'asyncRejectResolveFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when B rejects, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectSlower', 'asyncRejectResolveFaster')
          .after(100).add('syncCatch')
          .after(400).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first asynchronous and second synchronous functions, where first both resolves and rejects and the second both rejects and resolves', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectFaster', 'syncRejectResolveA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectFaster, this.f.syncRejectResolveA],
        [this.f.asyncResolveRejectFaster, [this.f, 'syncRejectResolveA']],
        [[this.f, this.f.asyncResolveRejectFaster], this.f.syncRejectResolveA],
        [[this.f, this.f.asyncResolveRejectFaster], [this.f, 'syncRejectResolveA']],
        [[this.f, this.f.asyncResolveRejectFaster, this.f.syncRejectResolveA]],
        [[this.f, 'asyncResolveRejectFaster', 'syncRejectResolveA']]
      ];
    });

    it('the functions should be called in the following order: A, B and onCatch, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectFaster', 'syncRejectResolveA', 'syncCatch')
          .after(150).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first synchronous and second asynchronous functions, where first both resolves and rejects and the second both rejects and resolves', function () {
    beforeAll(function () {
      this.spies = ['syncResolveRejectA', 'asyncRejectResolveFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveRejectA, this.f.asyncRejectResolveFaster],
        [this.f.syncResolveRejectA, [this.f, 'asyncRejectResolveFaster']],
        [[this.f, this.f.syncResolveRejectA], this.f.asyncRejectResolveFaster],
        [[this.f, this.f.syncResolveRejectA], [this.f, 'asyncRejectResolveFaster']],
        [[this.f, this.f.syncResolveRejectA, this.f.asyncRejectResolveFaster]],
        [[this.f, 'syncResolveRejectA', 'asyncRejectResolveFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveRejectA', 'asyncRejectResolveFaster')
          .after(100).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first both resolves and rejects and the second both rejects and resolves and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveRejectA', 'syncRejectResolveA', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveRejectA, this.f.syncRejectResolveA],
        [this.f.syncResolveRejectA, [this.f, 'syncRejectResolveA']],
        [[this.f, this.f.syncResolveRejectA], this.f.syncRejectResolveA],
        [[this.f, this.f.syncResolveRejectA], [this.f, 'syncRejectResolveA']],
        [[this.f, this.f.syncResolveRejectA, this.f.syncRejectResolveA]],
        [[this.f, 'syncResolveRejectA', 'syncRejectResolveA']]
      ];
    });

    it('the functions should be called in the following order: A, B, onCatch, onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveRejectA', 'syncRejectResolveA', 'syncCatch', 'syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first both resolves and rejects and the second both rejects and resolves and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectFaster', 'asyncRejectResolveSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectFaster, this.f.asyncRejectResolveSlower],
        [this.f.asyncResolveRejectFaster, [this.f, 'asyncRejectResolveSlower']],
        [[this.f, this.f.asyncResolveRejectFaster], this.f.asyncRejectResolveSlower],
        [[this.f, this.f.asyncResolveRejectFaster], [this.f, 'asyncRejectResolveSlower']],
        [[this.f, this.f.asyncResolveRejectFaster, this.f.asyncRejectResolveSlower]],
        [[this.f, 'asyncResolveRejectFaster', 'asyncRejectResolveSlower']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch and onDone, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectFaster', 'asyncRejectResolveSlower')
          .after(450).add('syncCatch', 'asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first both resolves and rejects and the second both rejects and resolves and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectSlower', 'asyncRejectResolveFaster', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectSlower, this.f.asyncRejectResolveFaster],
        [this.f.asyncResolveRejectSlower, [this.f, 'asyncRejectResolveFaster']],
        [[this.f, this.f.asyncResolveRejectSlower], this.f.asyncRejectResolveFaster],
        [[this.f, this.f.asyncResolveRejectSlower], [this.f, 'asyncRejectResolveFaster']],
        [[this.f, this.f.asyncResolveRejectSlower, this.f.asyncRejectResolveFaster]],
        [[this.f, 'asyncResolveRejectSlower', 'asyncRejectResolveFaster']]
      ];
    });

    it('the functions should be called in the following order: A and B, then onCatch when B rejects, then onDone when A resolves, then onCatch, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectSlower', 'asyncRejectResolveFaster')
          .after(100).add('syncCatch')
          .after(400).add('asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first has inner move-on module and resolves and second resolves twice', function () {
    beforeAll(function () {
      this.spies = ['syncInjectedModuleResolve', 'syncResolveA', 'syncResolveB', 'syncResolveTwiceA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncInjectedModuleResolve, this.f.syncResolveTwiceA],
        [this.f.syncInjectedModuleResolve, [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.syncInjectedModuleResolve], this.f.syncResolveTwiceA],
        [[this.f, this.f.syncInjectedModuleResolve], [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.syncInjectedModuleResolve, this.f.syncResolveTwiceA]],
        [[this.f, 'syncInjectedModuleResolve', 'syncResolveTwiceA']]
      ];
    });

    it('the functions should be called in the following order: A, inner-module-A, inner-module-B, B and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncInjectedModuleResolve', 'syncResolveA', 'syncResolveB', 'syncResolveTwiceA', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first has inner move-on module and resolves and second resolves twice and the first executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncInjectedModuleResolveFaster', 'asyncResolveFaster', 'asyncResolveTwiceSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncInjectedModuleResolveFaster, this.f.asyncResolveTwiceSlower],
        [this.f.asyncInjectedModuleResolveFaster, [this.f, 'asyncResolveTwiceSlower']],
        [[this.f, this.f.asyncInjectedModuleResolveFaster], this.f.asyncResolveTwiceSlower],
        [[this.f, this.f.asyncInjectedModuleResolveFaster], [this.f, 'asyncResolveTwiceSlower']],
        [[this.f, this.f.asyncInjectedModuleResolveFaster, this.f.asyncResolveTwiceSlower]],
        [[this.f, 'asyncInjectedModuleResolveFaster', 'asyncResolveTwiceSlower']]
      ];
    });

    it('the functions should be called in the following order: A, inner-module-A and B, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncInjectedModuleResolveFaster', 'asyncResolveFaster', 'asyncResolveTwiceSlower')
          .after(550).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first has inner move-on module and resolves and second resolves twice and the second executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncInjectedModuleResolveSlower', 'asyncResolveFaster', 'asyncResolveSlower', 'asyncResolveTwiceFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncInjectedModuleResolveSlower, this.f.asyncResolveTwiceFaster],
        [this.f.asyncInjectedModuleResolveSlower, [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.asyncInjectedModuleResolveSlower], this.f.asyncResolveTwiceFaster],
        [[this.f, this.f.asyncInjectedModuleResolveSlower], [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.asyncInjectedModuleResolveSlower, this.f.asyncResolveTwiceFaster]],
        [[this.f, 'asyncInjectedModuleResolveSlower', 'asyncResolveTwiceFaster']]
      ];
    });

    it('the functions should be called in the following order: A, inner-module-A and B, then inner-module-B, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncInjectedModuleResolveSlower', 'asyncResolveFaster', 'asyncResolveTwiceFaster')
          .after(100).add('asyncResolveSlower')
          .after(500).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first asynchronous and second synchronous functions, where first has inner move-on module and resolves and second resolves twice', function () {
    beforeAll(function () {
      this.spies = ['asyncInjectedModuleResolveFaster', 'asyncResolveFaster', 'syncResolveTwiceA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncInjectedModuleResolveFaster, this.f.syncResolveTwiceA],
        [this.f.asyncInjectedModuleResolveFaster, [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.asyncInjectedModuleResolveFaster], this.f.syncResolveTwiceA],
        [[this.f, this.f.asyncInjectedModuleResolveFaster], [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.asyncInjectedModuleResolveFaster, this.f.syncResolveTwiceA]],
        [[this.f, 'asyncInjectedModuleResolveFaster', 'syncResolveTwiceA']]
      ];
    });

    it('the functions should be called in the following order: A, inner-module-A and B, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncInjectedModuleResolveFaster', 'asyncResolveFaster', 'syncResolveTwiceA')
          .after(100).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first synchronous and second asynchronous functions, where first has inner move-on module and resolves and second resolves twice', function () {
    beforeAll(function () {
      this.spies = ['syncInjectedModuleResolve', 'syncResolveA', 'syncResolveB', 'asyncResolveTwiceFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncInjectedModuleResolve, this.f.asyncResolveTwiceFaster],
        [this.f.syncInjectedModuleResolve, [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.syncInjectedModuleResolve], this.f.asyncResolveTwiceFaster],
        [[this.f, this.f.syncInjectedModuleResolve], [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.syncInjectedModuleResolve, this.f.asyncResolveTwiceFaster]],
        [[this.f, 'syncInjectedModuleResolve', 'asyncResolveTwiceFaster']]
      ];
    });

    it('the functions should be called in the following order: A, inner-module-A, inner-module-B and B, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncInjectedModuleResolve', 'syncResolveA', 'syncResolveB', 'asyncResolveTwiceFaster')
          .after(100).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first has inner move-on module and resolves and second resolves twice and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncInjectedModuleResolve', 'syncResolveA', 'syncResolveB', 'syncResolveTwiceA', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncInjectedModuleResolve, this.f.syncResolveTwiceA],
        [this.f.syncInjectedModuleResolve, [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.syncInjectedModuleResolve], this.f.syncResolveTwiceA],
        [[this.f, this.f.syncInjectedModuleResolve], [this.f, 'syncResolveTwiceA']],
        [[this.f, this.f.syncInjectedModuleResolve, this.f.syncResolveTwiceA]],
        [[this.f, 'syncInjectedModuleResolve', 'syncResolveTwiceA']]
      ];
    });

    it('the functions should be called in the following order: A, inner-module-A, inner-module-B, B, onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncInjectedModuleResolve', 'syncResolveA', 'syncResolveB', 'syncResolveTwiceA', 'syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first has inner move-on module and resolves and second resolves twice and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncInjectedModuleResolveFaster', 'asyncResolveFaster', 'asyncResolveTwiceSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncInjectedModuleResolveFaster, this.f.asyncResolveTwiceSlower],
        [this.f.asyncInjectedModuleResolveFaster, [this.f, 'asyncResolveTwiceSlower']],
        [[this.f, this.f.asyncInjectedModuleResolveFaster], this.f.asyncResolveTwiceSlower],
        [[this.f, this.f.asyncInjectedModuleResolveFaster], [this.f, 'asyncResolveTwiceSlower']],
        [[this.f, this.f.asyncInjectedModuleResolveFaster, this.f.asyncResolveTwiceSlower]],
        [[this.f, 'asyncInjectedModuleResolveFaster', 'asyncResolveTwiceSlower']]
      ];
    });

    it('the functions should be called in the following order: A, inner-module-A and B, then onDone, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncInjectedModuleResolveFaster', 'asyncResolveFaster', 'asyncResolveTwiceSlower')
          .after(550).add('asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first has inner move-on module and resolves and second resolves twice and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncInjectedModuleResolveSlower', 'asyncResolveFaster', 'asyncResolveSlower', 'asyncResolveTwiceFaster', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncInjectedModuleResolveSlower, this.f.asyncResolveTwiceFaster],
        [this.f.asyncInjectedModuleResolveSlower, [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.asyncInjectedModuleResolveSlower], this.f.asyncResolveTwiceFaster],
        [[this.f, this.f.asyncInjectedModuleResolveSlower], [this.f, 'asyncResolveTwiceFaster']],
        [[this.f, this.f.asyncInjectedModuleResolveSlower, this.f.asyncResolveTwiceFaster]],
        [[this.f, 'asyncInjectedModuleResolveSlower', 'asyncResolveTwiceFaster']]
      ];
    });

    it('the functions should be called in the following order: A, inner-module-A and B, then inner-module-B, then onDone when A resolves, then onCatch, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncInjectedModuleResolveSlower', 'asyncResolveFaster', 'asyncResolveTwiceFaster')
          .after(100).add('asyncResolveSlower')
          .after(500).add('asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first has inner move-on module and rejects and second both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['syncInjectedModuleReject', 'syncResolveA', 'syncResolveB', 'syncRejectA', 'syncResolveRejectA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncInjectedModuleReject, this.f.syncResolveRejectA],
        [this.f.syncInjectedModuleReject, [this.f, 'syncResolveRejectA']],
        [[this.f, this.f.syncInjectedModuleReject], this.f.syncResolveRejectA],
        [[this.f, this.f.syncInjectedModuleReject], [this.f, 'syncResolveRejectA']],
        [[this.f, this.f.syncInjectedModuleReject, this.f.syncResolveRejectA]],
        [[this.f, 'syncInjectedModuleReject', 'syncResolveRejectA']]
      ];
    });

    it('the functions should be called in the following order: A, inner-module-A, inner-module-B, inner-module-C, onCatch, B and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncInjectedModuleReject', 'syncResolveA', 'syncResolveB', 'syncRejectA', 'syncCatch', 'syncResolveRejectA', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first has inner move-on module and rejects and second both resolves and rejects and the first executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncInjectedModuleRejectFaster', 'asyncResolveFaster', 'asyncRejectFaster', 'asyncResolveRejectSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncInjectedModuleRejectFaster, this.f.asyncResolveRejectSlower],
        [this.f.asyncInjectedModuleRejectFaster, [this.f, 'asyncResolveRejectSlower']],
        [[this.f, this.f.asyncInjectedModuleRejectFaster], this.f.asyncResolveRejectSlower],
        [[this.f, this.f.asyncInjectedModuleRejectFaster], [this.f, 'asyncResolveRejectSlower']],
        [[this.f, this.f.asyncInjectedModuleRejectFaster, this.f.asyncResolveRejectSlower]],
        [[this.f, 'asyncInjectedModuleRejectFaster', 'asyncResolveRejectSlower']]
      ];
    });

    it('the functions should be called in the following order: A, inner-module-A and B, then inner-module-B, then onCatch, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncInjectedModuleRejectFaster', 'asyncResolveFaster', 'asyncResolveRejectSlower')
          .after(100).add('asyncRejectFaster')
          .after(100).add('syncCatch')
          .after(300).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first has inner move-on module and rejects and second both resolves and rejects and the second executes faster', function () {
    beforeAll(function () {
      this.spies = ['asyncInjectedModuleRejectSlower', 'asyncResolveFaster', 'asyncResolveSlower', 'asyncRejectSlower', 'asyncResolveRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncInjectedModuleRejectSlower, this.f.asyncResolveRejectFaster],
        [this.f.asyncInjectedModuleRejectSlower, [this.f, 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncInjectedModuleRejectSlower], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.asyncInjectedModuleRejectSlower], [this.f, 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncInjectedModuleRejectSlower, this.f.asyncResolveRejectFaster]],
        [[this.f, 'asyncInjectedModuleRejectSlower', 'asyncResolveRejectFaster']]
      ];
    });

    it('the functions should be called in the following order: A, inner-module-A and B, then inner-module-B, then inner-module-C, then onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncInjectedModuleRejectSlower', 'asyncResolveFaster', 'asyncResolveRejectFaster')
          .after(100).add('asyncResolveSlower')
          .after(500).add('asyncRejectSlower')
          .after(500).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first asynchronous and second synchronous functions, where first has inner move-on module and rejects and second both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncInjectedModuleRejectFaster', 'asyncResolveFaster', 'asyncRejectFaster', 'syncResolveRejectA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncInjectedModuleRejectFaster, this.f.syncResolveRejectA],
        [this.f.asyncInjectedModuleRejectFaster, [this.f, 'syncResolveRejectA']],
        [[this.f, this.f.asyncInjectedModuleRejectFaster], this.f.syncResolveRejectA],
        [[this.f, this.f.asyncInjectedModuleRejectFaster], [this.f, 'syncResolveRejectA']],
        [[this.f, this.f.asyncInjectedModuleRejectFaster, this.f.syncResolveRejectA]],
        [[this.f, 'asyncInjectedModuleRejectFaster', 'syncResolveRejectA']]
      ];
    });

    it('the functions should be called in the following order: A, inner-module-A and B, then inner-module-B, then onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncInjectedModuleRejectFaster', 'asyncResolveFaster', 'syncResolveRejectA')
          .after(100).add('asyncRejectFaster')
          .after(100).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with first synchronous and second asynchronous functions, where first has inner move-on module and rejects and second both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['syncInjectedModuleReject', 'syncResolveA', 'syncResolveB', 'syncRejectA', 'asyncResolveRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncInjectedModuleReject, this.f.asyncResolveRejectFaster],
        [this.f.syncInjectedModuleReject, [this.f, 'asyncResolveRejectFaster']],
        [[this.f, this.f.syncInjectedModuleReject], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.syncInjectedModuleReject], [this.f, 'asyncResolveRejectFaster']],
        [[this.f, this.f.syncInjectedModuleReject, this.f.asyncResolveRejectFaster]],
        [[this.f, 'syncInjectedModuleReject', 'asyncResolveRejectFaster']]
      ];
    });

    it('the functions should be called in the following order: A, inner-module-A, inner-module-B, inner-module-C, onCatch and B, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncInjectedModuleReject', 'syncResolveA', 'syncResolveB', 'syncRejectA', 'syncCatch', 'asyncResolveRejectFaster')
          .after(150).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where first has inner move-on module and rejects and second both resolves and rejects and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncInjectedModuleReject', 'syncResolveA', 'syncResolveB', 'syncRejectA', 'syncResolveRejectA', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncInjectedModuleReject, this.f.syncResolveRejectA],
        [this.f.syncInjectedModuleReject, [this.f, 'syncResolveRejectA']],
        [[this.f, this.f.syncInjectedModuleReject], this.f.syncResolveRejectA],
        [[this.f, this.f.syncInjectedModuleReject], [this.f, 'syncResolveRejectA']],
        [[this.f, this.f.syncInjectedModuleReject, this.f.syncResolveRejectA]],
        [[this.f, 'syncInjectedModuleReject', 'syncResolveRejectA']]
      ];
    });

    it('the functions should be called in the following order: A, inner-module-A, inner-module-B, inner-module-C, onCatch, B, onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncInjectedModuleReject', 'syncResolveA', 'syncResolveB', 'syncRejectA', 'syncCatch', 'syncResolveRejectA', 'syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first has inner move-on module and rejects and second both resolves and rejects and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncInjectedModuleRejectFaster', 'asyncResolveFaster', 'asyncRejectFaster', 'asyncResolveRejectSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncInjectedModuleRejectFaster, this.f.asyncResolveRejectSlower],
        [this.f.asyncInjectedModuleRejectFaster, [this.f, 'asyncResolveRejectSlower']],
        [[this.f, this.f.asyncInjectedModuleRejectFaster], this.f.asyncResolveRejectSlower],
        [[this.f, this.f.asyncInjectedModuleRejectFaster], [this.f, 'asyncResolveRejectSlower']],
        [[this.f, this.f.asyncInjectedModuleRejectFaster, this.f.asyncResolveRejectSlower]],
        [[this.f, 'asyncInjectedModuleRejectFaster', 'asyncResolveRejectSlower']]
      ];
    });

    it('the functions should be called in the following order: A, inner-module-A and B, then inner-module-B, then onCatch, then onDone, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncInjectedModuleRejectFaster', 'asyncResolveFaster', 'asyncResolveRejectSlower')
          .after(100).add('asyncRejectFaster')
          .after(100).add('syncCatch')
          .after(300).add('asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where first has inner move-on module and rejects and second both resolves and rejects and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncInjectedModuleRejectSlower', 'asyncResolveFaster', 'asyncResolveSlower', 'asyncRejectSlower', 'asyncResolveRejectFaster', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncInjectedModuleRejectSlower, this.f.asyncResolveRejectFaster],
        [this.f.asyncInjectedModuleRejectSlower, [this.f, 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncInjectedModuleRejectSlower], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.asyncInjectedModuleRejectSlower], [this.f, 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncInjectedModuleRejectSlower, this.f.asyncResolveRejectFaster]],
        [[this.f, 'asyncInjectedModuleRejectSlower', 'asyncResolveRejectFaster']]
      ];
    });

    it('the functions should be called in the following order: A, inner-module-A and B, then inner-module-B, then inner-module-C, then onCatch and onDone, then onCatch, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncInjectedModuleRejectSlower', 'asyncResolveFaster', 'asyncResolveRejectFaster')
          .after(100).add('asyncResolveSlower')
          .after(500).add('asyncRejectSlower')
          .after(500).add('syncCatch', 'asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where it doubles the same function, that resolves', function () {
    beforeAll(function () {
      this.spies = ['syncResolveA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveA, this.f.syncResolveA],
        [this.f.syncResolveA, [this.f, 'syncResolveA']],
        [[this.f, this.f.syncResolveA], this.f.syncResolveA],
        [[this.f, this.f.syncResolveA], [this.f, 'syncResolveA']],
        [[this.f, this.f.syncResolveA, this.f.syncResolveA]],
        [[this.f, 'syncResolveA', 'syncResolveA']]
      ];
    });

    it('the functions should be called in the following order: A, A and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveA', 'syncResolveA', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where it doubles the same function, that resolves', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveFaster, this.f.asyncResolveFaster],
        [this.f.asyncResolveFaster, [this.f, 'asyncResolveFaster']],
        [[this.f, this.f.asyncResolveFaster], this.f.asyncResolveFaster],
        [[this.f, this.f.asyncResolveFaster], [this.f, 'asyncResolveFaster']],
        [[this.f, this.f.asyncResolveFaster, this.f.asyncResolveFaster]],
        [[this.f, 'asyncResolveFaster', 'asyncResolveFaster']]
      ];
    });

    it('the functions should be called in the following order: A and A, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveFaster', 'asyncResolveFaster')
          .after(100).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where it doubles the same function, that both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectMiddle', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectMiddle, this.f.asyncResolveRejectMiddle],
        [this.f.asyncResolveRejectMiddle, [this.f, 'asyncResolveRejectMiddle']],
        [[this.f, this.f.asyncResolveRejectMiddle], this.f.asyncResolveRejectMiddle],
        [[this.f, this.f.asyncResolveRejectMiddle], [this.f, 'asyncResolveRejectMiddle']],
        [[this.f, this.f.asyncResolveRejectMiddle, this.f.asyncResolveRejectMiddle]],
        [[this.f, 'asyncResolveRejectMiddle', 'asyncResolveRejectMiddle']]
      ];
    });

    it('the functions should be called in the following order: A and A, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectMiddle', 'asyncResolveRejectMiddle')
          .after(400).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two synchronous functions, where it doubles the same function, that resolves and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveA', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveA, this.f.syncResolveA],
        [this.f.syncResolveA, [this.f, 'syncResolveA']],
        [[this.f, this.f.syncResolveA], this.f.syncResolveA],
        [[this.f, this.f.syncResolveA], [this.f, 'syncResolveA']],
        [[this.f, this.f.syncResolveA, this.f.syncResolveA]],
        [[this.f, 'syncResolveA', 'syncResolveA']]
      ];
    });

    it('the functions should be called in the following order: A, A, onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveA', 'syncResolveA', 'syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where it doubles the same function, that resolves and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveFaster', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveFaster, this.f.asyncResolveFaster],
        [this.f.asyncResolveFaster, [this.f, 'asyncResolveFaster']],
        [[this.f, this.f.asyncResolveFaster], this.f.asyncResolveFaster],
        [[this.f, this.f.asyncResolveFaster], [this.f, 'asyncResolveFaster']],
        [[this.f, this.f.asyncResolveFaster, this.f.asyncResolveFaster]],
        [[this.f, 'asyncResolveFaster', 'asyncResolveFaster']]
      ];
    });

    it('the functions should be called in the following order: A and A, then onDone, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveFaster', 'asyncResolveFaster')
          .after(100).add('asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where it doubles the same function, that both resolves and rejects and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectMiddle', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectMiddle, this.f.asyncResolveRejectMiddle],
        [this.f.asyncResolveRejectMiddle, [this.f, 'asyncResolveRejectMiddle']],
        [[this.f, this.f.asyncResolveRejectMiddle], this.f.asyncResolveRejectMiddle],
        [[this.f, this.f.asyncResolveRejectMiddle], [this.f, 'asyncResolveRejectMiddle']],
        [[this.f, this.f.asyncResolveRejectMiddle, this.f.asyncResolveRejectMiddle]],
        [[this.f, 'asyncResolveRejectMiddle', 'asyncResolveRejectMiddle']]
      ];
    });

    it('the functions should be called in the following order: A and A, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectMiddle', 'asyncResolveRejectMiddle')
          .after(400).add('asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where it doubles the same function, that resolves twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceSlower, this.f.asyncResolveTwiceSlower],
        [this.f.asyncResolveTwiceSlower, [this.f, 'asyncResolveTwiceSlower']],
        [[this.f, this.f.asyncResolveTwiceSlower], this.f.asyncResolveTwiceSlower],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, 'asyncResolveTwiceSlower']],
        [[this.f, this.f.asyncResolveTwiceSlower, this.f.asyncResolveTwiceSlower]],
        [[this.f, 'asyncResolveTwiceSlower', 'asyncResolveTwiceSlower']]
      ];
    });

    it('the functions should be called in the following order: A and A, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceSlower', 'asyncResolveTwiceSlower')
          .after(550).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where it doubles the same function, that rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectTwiceFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectTwiceFaster, this.f.asyncRejectTwiceFaster],
        [this.f.asyncRejectTwiceFaster, [this.f, 'asyncRejectTwiceFaster']],
        [[this.f, this.f.asyncRejectTwiceFaster], this.f.asyncRejectTwiceFaster],
        [[this.f, this.f.asyncRejectTwiceFaster], [this.f, 'asyncRejectTwiceFaster']],
        [[this.f, this.f.asyncRejectTwiceFaster, this.f.asyncRejectTwiceFaster]],
        [[this.f, 'asyncRejectTwiceFaster', 'asyncRejectTwiceFaster']]
      ];
    });

    it('the functions should be called in the following order: A and A, then onCatch twice and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectTwiceFaster', 'asyncRejectTwiceFaster')
          .after(50).add('syncCatch', 'syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with two asynchronous functions, where it doubles the same function, that neither resolves nor rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncVoidSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncVoidSlower, this.f.asyncVoidSlower],
        [this.f.asyncVoidSlower, [this.f, 'asyncVoidSlower']],
        [[this.f, this.f.asyncVoidSlower], this.f.asyncVoidSlower],
        [[this.f, this.f.asyncVoidSlower], [this.f, 'asyncVoidSlower']],
        [[this.f, this.f.asyncVoidSlower, this.f.asyncVoidSlower]],
        [[this.f, 'asyncVoidSlower', 'asyncVoidSlower']]
      ];
    });

    it('the functions should be called in the following order: A and A', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncVoidSlower', 'asyncVoidSlower')
          .after(5000).keep();
      });
    });
  });

  describe('with three synchronous functions, where the first resolves, second resolves twice and third both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveA', 'syncResolveTwiceA', 'syncResolveRejectA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveA, this.f.syncResolveTwiceA, this.f.syncResolveRejectA],
        [this.f.syncResolveA, [this.f, 'syncResolveTwiceA'], this.f.syncResolveRejectA],
        [[this.f, this.f.syncResolveA], [this.f, this.f.syncResolveTwiceA, this.f.syncResolveRejectA]],
        [[this.f, this.f.syncResolveA], [this.f, 'syncResolveTwiceA', 'syncResolveRejectA']],
        [[this.f, this.f.syncResolveA, this.f.syncResolveTwiceA, this.f.syncResolveRejectA]],
        [[this.f, 'syncResolveA', 'syncResolveTwiceA'], this.f.syncResolveRejectA]
      ];
    });

    it('the functions should be called in the following order: A, B, C and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveA', 'syncResolveTwiceA', 'syncResolveRejectA', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions (order: 1, 2, 3), where the first resolves, second resolves twice and third both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveFaster', 'asyncResolveTwiceMiddle', 'asyncResolveRejectSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveFaster, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveRejectSlower],
        [this.f.asyncResolveFaster, [this.f, 'asyncResolveTwiceMiddle'], this.f.asyncResolveRejectSlower],
        [[this.f, this.f.asyncResolveFaster], [this.f, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveRejectSlower]],
        [[this.f, this.f.asyncResolveFaster], [this.f, 'asyncResolveTwiceMiddle', 'asyncResolveRejectSlower']],
        [[this.f, this.f.asyncResolveFaster, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveRejectSlower]],
        [[this.f, 'asyncResolveFaster', 'asyncResolveTwiceMiddle'], this.f.asyncResolveRejectSlower]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when C resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveFaster', 'asyncResolveTwiceMiddle', 'asyncResolveRejectSlower')
          .after(500).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions (order: 3, 2, 1), where the first resolves, second resolves twice and third both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveSlower', 'asyncResolveTwiceMiddle', 'asyncResolveRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveSlower, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveRejectFaster],
        [this.f.asyncResolveSlower, [this.f, 'asyncResolveTwiceMiddle'], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.asyncResolveSlower], [this.f, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveRejectFaster]],
        [[this.f, this.f.asyncResolveSlower], [this.f, 'asyncResolveTwiceMiddle', 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveSlower, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveRejectFaster]],
        [[this.f, 'asyncResolveSlower', 'asyncResolveTwiceMiddle'], this.f.asyncResolveRejectFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveSlower', 'asyncResolveTwiceMiddle', 'asyncResolveRejectFaster')
          .after(500).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions (order: 2, 3, 1), where the first resolves, second resolves twice and third both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveMiddle', 'asyncResolveTwiceSlower', 'asyncResolveRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveMiddle, this.f.asyncResolveTwiceSlower, this.f.asyncResolveRejectFaster],
        [this.f.asyncResolveMiddle, [this.f, 'asyncResolveTwiceSlower'], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.asyncResolveMiddle], [this.f, this.f.asyncResolveTwiceSlower, this.f.asyncResolveRejectFaster]],
        [[this.f, this.f.asyncResolveMiddle], [this.f, 'asyncResolveTwiceSlower', 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveMiddle, this.f.asyncResolveTwiceSlower, this.f.asyncResolveRejectFaster]],
        [[this.f, 'asyncResolveMiddle', 'asyncResolveTwiceSlower'], this.f.asyncResolveRejectFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when B resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveMiddle', 'asyncResolveTwiceSlower', 'asyncResolveRejectFaster')
          .after(550).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with asynchronous, asynchronous and synchronous three functions, where the first resolves, second resolves twice and third both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveFaster', 'asyncResolveTwiceSlower', 'syncResolveRejectA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveFaster, this.f.asyncResolveTwiceSlower, this.f.syncResolveRejectA],
        [this.f.asyncResolveFaster, [this.f, 'asyncResolveTwiceSlower'], this.f.syncResolveRejectA],
        [[this.f, this.f.asyncResolveFaster], [this.f, this.f.asyncResolveTwiceSlower, this.f.syncResolveRejectA]],
        [[this.f, this.f.asyncResolveFaster], [this.f, 'asyncResolveTwiceSlower', 'syncResolveRejectA']],
        [[this.f, this.f.asyncResolveFaster, this.f.asyncResolveTwiceSlower, this.f.syncResolveRejectA]],
        [[this.f, 'asyncResolveFaster', 'asyncResolveTwiceSlower'], this.f.syncResolveRejectA]

      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when B resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveFaster', 'asyncResolveTwiceSlower', 'syncResolveRejectA')
          .after(550).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with synchronous, synchronous and asynchronous three functions, where the first resolves, second resolves twice and third both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveA', 'syncResolveTwiceA', 'asyncResolveRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveA, this.f.syncResolveTwiceA, this.f.asyncResolveRejectFaster],
        [this.f.syncResolveA, [this.f, 'syncResolveTwiceA'], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.syncResolveA], [this.f, this.f.syncResolveTwiceA, this.f.asyncResolveRejectFaster]],
        [[this.f, this.f.syncResolveA], [this.f, 'syncResolveTwiceA', 'asyncResolveRejectFaster']],
        [[this.f, this.f.syncResolveA, this.f.syncResolveTwiceA, this.f.asyncResolveRejectFaster]],
        [[this.f, 'syncResolveA', 'syncResolveTwiceA'], this.f.asyncResolveRejectFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when C resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveA', 'syncResolveTwiceA', 'asyncResolveRejectFaster')
          .after(150).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with asynchronous, synchronous and asynchronous three functions, where the first resolves, second resolves twice and third both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveMiddle', 'syncResolveTwiceA', 'asyncResolveRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveMiddle, this.f.syncResolveTwiceA, this.f.asyncResolveRejectFaster],
        [this.f.asyncResolveMiddle, [this.f, 'syncResolveTwiceA'], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.asyncResolveMiddle], [this.f, this.f.syncResolveTwiceA, this.f.asyncResolveRejectFaster]],
        [[this.f, this.f.asyncResolveMiddle], [this.f, 'syncResolveTwiceA', 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveMiddle, this.f.syncResolveTwiceA, this.f.asyncResolveRejectFaster]],
        [[this.f, 'asyncResolveMiddle', 'syncResolveTwiceA'], this.f.asyncResolveRejectFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveMiddle', 'syncResolveTwiceA', 'asyncResolveRejectFaster')
          .after(350).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three synchronous functions, where the first resolves, second resolves twice and third both resolves and rejects and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveA', 'syncResolveTwiceA', 'syncResolveRejectA', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveA, this.f.syncResolveTwiceA, this.f.syncResolveRejectA],
        [this.f.syncResolveA, [this.f, 'syncResolveTwiceA'], this.f.syncResolveRejectA],
        [[this.f, this.f.syncResolveA], [this.f, this.f.syncResolveTwiceA, this.f.syncResolveRejectA]],
        [[this.f, this.f.syncResolveA], [this.f, 'syncResolveTwiceA', 'syncResolveRejectA']],
        [[this.f, this.f.syncResolveA, this.f.syncResolveTwiceA, this.f.syncResolveRejectA]],
        [[this.f, 'syncResolveA', 'syncResolveTwiceA'], this.f.syncResolveRejectA]
      ];
    });

    it('the functions should be called in the following order: A, B, C, onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveA', 'syncResolveTwiceA', 'syncResolveRejectA', 'syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where the first resolves, second resolves twice and third both resolves and rejects and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveFaster', 'asyncResolveTwiceMiddle', 'asyncResolveRejectSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveFaster, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveRejectSlower],
        [this.f.asyncResolveFaster, [this.f, 'asyncResolveTwiceMiddle'], this.f.asyncResolveRejectSlower],
        [[this.f, this.f.asyncResolveFaster], [this.f, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveRejectSlower]],
        [[this.f, this.f.asyncResolveFaster], [this.f, 'asyncResolveTwiceMiddle', 'asyncResolveRejectSlower']],
        [[this.f, this.f.asyncResolveFaster, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveRejectSlower]],
        [[this.f, 'asyncResolveFaster', 'asyncResolveTwiceMiddle'], this.f.asyncResolveRejectSlower]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when C resolves, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveFaster', 'asyncResolveTwiceMiddle', 'asyncResolveRejectSlower')
          .after(500).add('asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where the first resolves, second resolves twice and third both resolves and rejects and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveSlower', 'asyncResolveTwiceMiddle', 'asyncResolveRejectFaster', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveSlower, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveRejectFaster],
        [this.f.asyncResolveSlower, [this.f, 'asyncResolveTwiceMiddle'], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.asyncResolveSlower], [this.f, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveRejectFaster]],
        [[this.f, this.f.asyncResolveSlower], [this.f, 'asyncResolveTwiceMiddle', 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveSlower, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveRejectFaster]],
        [[this.f, 'asyncResolveSlower', 'asyncResolveTwiceMiddle'], this.f.asyncResolveRejectFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when A resolves, then onCatch, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveSlower', 'asyncResolveTwiceMiddle', 'asyncResolveRejectFaster')
          .after(500).add('asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three synchronous functions, where the first both resolves and rejects, second resolves twice and third rejects twice', function () {
    beforeAll(function () {
      this.spies = ['syncResolveRejectA', 'syncResolveTwiceA', 'syncRejectTwice', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveRejectA, this.f.syncResolveTwiceA, this.f.syncRejectTwice],
        [this.f.syncResolveRejectA, [this.f, 'syncResolveTwiceA'], this.f.syncRejectTwice],
        [[this.f, this.f.syncResolveRejectA], [this.f, this.f.syncResolveTwiceA, this.f.syncRejectTwice]],
        [[this.f, this.f.syncResolveRejectA], [this.f, 'syncResolveTwiceA', 'syncRejectTwice']],
        [[this.f, this.f.syncResolveRejectA, this.f.syncResolveTwiceA, this.f.syncRejectTwice]],
        [[this.f, 'syncResolveRejectA', 'syncResolveTwiceA'], this.f.syncRejectTwice]
      ];
    });

    it('the functions should be called in the following order: A, B, C, onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveRejectA', 'syncResolveTwiceA', 'syncRejectTwice', 'syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions (order: 1, 2, 3), where the first both resolves and rejects, second resolves twice and third rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectFaster', 'asyncResolveTwiceMiddle', 'asyncRejectTwiceSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectFaster, this.f.asyncResolveTwiceMiddle, this.f.asyncRejectTwiceSlower],
        [this.f.asyncResolveRejectFaster, [this.f, 'asyncResolveTwiceMiddle'], this.f.asyncRejectTwiceSlower],
        [[this.f, this.f.asyncResolveRejectFaster], [this.f, this.f.asyncResolveTwiceMiddle, this.f.asyncRejectTwiceSlower]],
        [[this.f, this.f.asyncResolveRejectFaster], [this.f, 'asyncResolveTwiceMiddle', 'asyncRejectTwiceSlower']],
        [[this.f, this.f.asyncResolveRejectFaster, this.f.asyncResolveTwiceMiddle, this.f.asyncRejectTwiceSlower]],
        [[this.f, 'asyncResolveRejectFaster', 'asyncResolveTwiceMiddle'], this.f.asyncRejectTwiceSlower]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onCatch when C rejects and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectFaster', 'asyncResolveTwiceMiddle', 'asyncRejectTwiceSlower')
          .after(650).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions (order: 3, 2, 1), where the first both resolves and rejects, second resolves twice and third rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectSlower', 'asyncResolveTwiceMiddle', 'asyncRejectTwiceFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectSlower, this.f.asyncResolveTwiceMiddle, this.f.asyncRejectTwiceFaster],
        [this.f.asyncResolveRejectSlower, [this.f, 'asyncResolveTwiceMiddle'], this.f.asyncRejectTwiceFaster],
        [[this.f, this.f.asyncResolveRejectSlower], [this.f, this.f.asyncResolveTwiceMiddle, this.f.asyncRejectTwiceFaster]],
        [[this.f, this.f.asyncResolveRejectSlower], [this.f, 'asyncResolveTwiceMiddle', 'asyncRejectTwiceFaster']],
        [[this.f, this.f.asyncResolveRejectSlower, this.f.asyncResolveTwiceMiddle, this.f.asyncRejectTwiceFaster]],
        [[this.f, 'asyncResolveRejectSlower', 'asyncResolveTwiceMiddle'], this.f.asyncRejectTwiceFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onCatch when C rejects, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectSlower', 'asyncResolveTwiceMiddle', 'asyncRejectTwiceFaster')
          .after(50).add('syncCatch')
          .after(450).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions (order: 2, 3, 1), where the first both resolves and rejects, second resolves twice and third rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectMiddle', 'asyncResolveTwiceSlower', 'asyncRejectTwiceFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectMiddle, this.f.asyncResolveTwiceSlower, this.f.asyncRejectTwiceFaster],
        [this.f.asyncResolveRejectMiddle, [this.f, 'asyncResolveTwiceSlower'], this.f.asyncRejectTwiceFaster],
        [[this.f, this.f.asyncResolveRejectMiddle], [this.f, this.f.asyncResolveTwiceSlower, this.f.asyncRejectTwiceFaster]],
        [[this.f, this.f.asyncResolveRejectMiddle], [this.f, 'asyncResolveTwiceSlower', 'asyncRejectTwiceFaster']],
        [[this.f, this.f.asyncResolveRejectMiddle, this.f.asyncResolveTwiceSlower, this.f.asyncRejectTwiceFaster]],
        [[this.f, 'asyncResolveRejectMiddle', 'asyncResolveTwiceSlower'], this.f.asyncRejectTwiceFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onCatch when C rejects, then onDone when B resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectMiddle', 'asyncResolveTwiceSlower', 'asyncRejectTwiceFaster')
          .after(50).add('syncCatch')
          .after(500).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with asynchronous, asynchronous and synchronous three functions, where the first both resolves and rejects, second resolves twice and third rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectFaster', 'asyncResolveTwiceSlower', 'syncRejectTwice', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectFaster, this.f.asyncResolveTwiceSlower, this.f.syncRejectTwice],
        [this.f.asyncResolveRejectFaster, [this.f, 'asyncResolveTwiceSlower'], this.f.syncRejectTwice],
        [[this.f, this.f.asyncResolveRejectFaster], [this.f, this.f.asyncResolveTwiceSlower, this.f.syncRejectTwice]],
        [[this.f, this.f.asyncResolveRejectFaster], [this.f, 'asyncResolveTwiceSlower', 'syncRejectTwice']],
        [[this.f, this.f.asyncResolveRejectFaster, this.f.asyncResolveTwiceSlower, this.f.syncRejectTwice]],
        [[this.f, 'asyncResolveRejectFaster', 'asyncResolveTwiceSlower'], this.f.syncRejectTwice]

      ];
    });

    it('the functions should be called in the following order: A, B, C and onCatch, then onDone when B resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectFaster', 'asyncResolveTwiceSlower', 'syncRejectTwice', 'syncCatch')
          .after(550).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with synchronous, synchronous and asynchronous three functions, where the first both resolves and rejects, second resolves twice and third rejects twice', function () {
    beforeAll(function () {
      this.spies = ['syncResolveRejectA', 'syncResolveTwiceA', 'asyncRejectTwiceFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveRejectA, this.f.syncResolveTwiceA, this.f.asyncRejectTwiceFaster],
        [this.f.syncResolveRejectA, [this.f, 'syncResolveTwiceA'], this.f.asyncRejectTwiceFaster],
        [[this.f, this.f.syncResolveRejectA], [this.f, this.f.syncResolveTwiceA, this.f.asyncRejectTwiceFaster]],
        [[this.f, this.f.syncResolveRejectA], [this.f, 'syncResolveTwiceA', 'asyncRejectTwiceFaster']],
        [[this.f, this.f.syncResolveRejectA, this.f.syncResolveTwiceA, this.f.asyncRejectTwiceFaster]],
        [[this.f, 'syncResolveRejectA', 'syncResolveTwiceA'], this.f.asyncRejectTwiceFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onCatch when C rejects and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveRejectA', 'syncResolveTwiceA', 'asyncRejectTwiceFaster')
          .after(50).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with asynchronous, synchronous and asynchronous three functions, where the first both resolves and rejects, second resolves twice and third rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectMiddle', 'syncResolveTwiceA', 'asyncRejectTwiceFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectMiddle, this.f.syncResolveTwiceA, this.f.asyncRejectTwiceFaster],
        [this.f.asyncResolveRejectMiddle, [this.f, 'syncResolveTwiceA'], this.f.asyncRejectTwiceFaster],
        [[this.f, this.f.asyncResolveRejectMiddle], [this.f, this.f.syncResolveTwiceA, this.f.asyncRejectTwiceFaster]],
        [[this.f, this.f.asyncResolveRejectMiddle], [this.f, 'syncResolveTwiceA', 'asyncRejectTwiceFaster']],
        [[this.f, this.f.asyncResolveRejectMiddle, this.f.syncResolveTwiceA, this.f.asyncRejectTwiceFaster]],
        [[this.f, 'asyncResolveRejectMiddle', 'syncResolveTwiceA'], this.f.asyncRejectTwiceFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onCatch when C rejects, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectMiddle', 'syncResolveTwiceA', 'asyncRejectTwiceFaster')
          .after(50).add('syncCatch')
          .after(350).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three synchronous functions, where the first both resolves and rejects, second resolves twice and third rejects twice and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveRejectA', 'syncResolveTwiceA', 'syncRejectTwice', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveRejectA, this.f.syncResolveTwiceA, this.f.syncRejectTwice],
        [this.f.syncResolveRejectA, [this.f, 'syncResolveTwiceA'], this.f.syncRejectTwice],
        [[this.f, this.f.syncResolveRejectA], [this.f, this.f.syncResolveTwiceA, this.f.syncRejectTwice]],
        [[this.f, this.f.syncResolveRejectA], [this.f, 'syncResolveTwiceA', 'syncRejectTwice']],
        [[this.f, this.f.syncResolveRejectA, this.f.syncResolveTwiceA, this.f.syncRejectTwice]],
        [[this.f, 'syncResolveRejectA', 'syncResolveTwiceA'], this.f.syncRejectTwice]
      ];
    });

    it('the functions should be called in the following order: A, B, C, onCatch, onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveRejectA', 'syncResolveTwiceA', 'syncRejectTwice', 'syncCatch', 'syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where the first both resolves and rejects, second resolves twice and third rejects twice and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectFaster', 'asyncResolveTwiceMiddle', 'asyncRejectTwiceSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectFaster, this.f.asyncResolveTwiceMiddle, this.f.asyncRejectTwiceSlower],
        [this.f.asyncResolveRejectFaster, [this.f, 'asyncResolveTwiceMiddle'], this.f.asyncRejectTwiceSlower],
        [[this.f, this.f.asyncResolveRejectFaster], [this.f, this.f.asyncResolveTwiceMiddle, this.f.asyncRejectTwiceSlower]],
        [[this.f, this.f.asyncResolveRejectFaster], [this.f, 'asyncResolveTwiceMiddle', 'asyncRejectTwiceSlower']],
        [[this.f, this.f.asyncResolveRejectFaster, this.f.asyncResolveTwiceMiddle, this.f.asyncRejectTwiceSlower]],
        [[this.f, 'asyncResolveRejectFaster', 'asyncResolveTwiceMiddle'], this.f.asyncRejectTwiceSlower]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onCatch when C rejects and onDone, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectFaster', 'asyncResolveTwiceMiddle', 'asyncRejectTwiceSlower')
          .after(650).add('syncCatch', 'asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where the first both resolves and rejects, second resolves twice and third rejects twice and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectSlower', 'asyncResolveTwiceMiddle', 'asyncRejectTwiceFaster', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectSlower, this.f.asyncResolveTwiceMiddle, this.f.asyncRejectTwiceFaster],
        [this.f.asyncResolveRejectSlower, [this.f, 'asyncResolveTwiceMiddle'], this.f.asyncRejectTwiceFaster],
        [[this.f, this.f.asyncResolveRejectSlower], [this.f, this.f.asyncResolveTwiceMiddle, this.f.asyncRejectTwiceFaster]],
        [[this.f, this.f.asyncResolveRejectSlower], [this.f, 'asyncResolveTwiceMiddle', 'asyncRejectTwiceFaster']],
        [[this.f, this.f.asyncResolveRejectSlower, this.f.asyncResolveTwiceMiddle, this.f.asyncRejectTwiceFaster]],
        [[this.f, 'asyncResolveRejectSlower', 'asyncResolveTwiceMiddle'], this.f.asyncRejectTwiceFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onCatch when C rejects, then onDone when A resolves, then onCatch, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectSlower', 'asyncResolveTwiceMiddle', 'asyncRejectTwiceFaster')
          .after(50).add('syncCatch')
          .after(450).add('asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three synchronous functions, where each resolves twice', function () {
    beforeAll(function () {
      this.spies = ['syncResolveTwiceA', 'syncResolveTwiceB', 'syncResolveTwiceC', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveTwiceA, this.f.syncResolveTwiceB, this.f.syncResolveTwiceC],
        [this.f.syncResolveTwiceA, [this.f, 'syncResolveTwiceB'], this.f.syncResolveTwiceC],
        [[this.f, this.f.syncResolveTwiceA], [this.f, this.f.syncResolveTwiceB, this.f.syncResolveTwiceC]],
        [[this.f, this.f.syncResolveTwiceA], [this.f, 'syncResolveTwiceB', 'syncResolveTwiceC']],
        [[this.f, this.f.syncResolveTwiceA, this.f.syncResolveTwiceB, this.f.syncResolveTwiceC]],
        [[this.f, 'syncResolveTwiceA', 'syncResolveTwiceB'], this.f.syncResolveTwiceC]
      ];
    });

    it('the functions should be called in the following order: A, B, C and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveTwiceA', 'syncResolveTwiceB', 'syncResolveTwiceC', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions (order: 1, 2, 3), where each resolves twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceFaster', 'asyncResolveTwiceMiddle', 'asyncResolveTwiceSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceFaster, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveTwiceSlower],
        [this.f.asyncResolveTwiceFaster, [this.f, 'asyncResolveTwiceMiddle'], this.f.asyncResolveTwiceSlower],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveTwiceSlower]],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, 'asyncResolveTwiceMiddle', 'asyncResolveTwiceSlower']],
        [[this.f, this.f.asyncResolveTwiceFaster, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveTwiceSlower]],
        [[this.f, 'asyncResolveTwiceFaster', 'asyncResolveTwiceMiddle'], this.f.asyncResolveTwiceSlower]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when C resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceFaster', 'asyncResolveTwiceMiddle', 'asyncResolveTwiceSlower')
          .after(550).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions (order: 3, 2, 1), where each resolves twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceSlower', 'asyncResolveTwiceMiddle', 'asyncResolveTwiceFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceSlower, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveTwiceFaster],
        [this.f.asyncResolveTwiceSlower, [this.f, 'asyncResolveTwiceMiddle'], this.f.asyncResolveTwiceFaster],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveTwiceFaster]],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, 'asyncResolveTwiceMiddle', 'asyncResolveTwiceFaster']],
        [[this.f, this.f.asyncResolveTwiceSlower, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveTwiceFaster]],
        [[this.f, 'asyncResolveTwiceSlower', 'asyncResolveTwiceMiddle'], this.f.asyncResolveTwiceFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceSlower', 'asyncResolveTwiceMiddle', 'asyncResolveTwiceFaster')
          .after(550).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions (order: 2, 3, 1), where each resolves twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceMiddle', 'asyncResolveTwiceSlower', 'asyncResolveTwiceFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceMiddle, this.f.asyncResolveTwiceSlower, this.f.asyncResolveTwiceFaster],
        [this.f.asyncResolveTwiceMiddle, [this.f, 'asyncResolveTwiceSlower'], this.f.asyncResolveTwiceFaster],
        [[this.f, this.f.asyncResolveTwiceMiddle], [this.f, this.f.asyncResolveTwiceSlower, this.f.asyncResolveTwiceFaster]],
        [[this.f, this.f.asyncResolveTwiceMiddle], [this.f, 'asyncResolveTwiceSlower', 'asyncResolveTwiceFaster']],
        [[this.f, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveTwiceSlower, this.f.asyncResolveTwiceFaster]],
        [[this.f, 'asyncResolveTwiceMiddle', 'asyncResolveTwiceSlower'], this.f.asyncResolveTwiceFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when B resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceMiddle', 'asyncResolveTwiceSlower', 'asyncResolveTwiceFaster')
          .after(550).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with asynchronous, asynchronous and synchronous three functions, where each resolves twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceFaster', 'asyncResolveTwiceSlower', 'syncResolveTwiceC', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceFaster, this.f.asyncResolveTwiceSlower, this.f.syncResolveTwiceC],
        [this.f.asyncResolveTwiceFaster, [this.f, 'asyncResolveTwiceSlower'], this.f.syncResolveTwiceC],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, this.f.asyncResolveTwiceSlower, this.f.syncResolveTwiceC]],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, 'asyncResolveTwiceSlower', 'syncResolveTwiceC']],
        [[this.f, this.f.asyncResolveTwiceFaster, this.f.asyncResolveTwiceSlower, this.f.syncResolveTwiceC]],
        [[this.f, 'asyncResolveTwiceFaster', 'asyncResolveTwiceSlower'], this.f.syncResolveTwiceC]

      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when B resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceFaster', 'asyncResolveTwiceSlower', 'syncResolveTwiceC')
          .after(550).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with synchronous, synchronous and asynchronous three functions, where each resolves twice', function () {
    beforeAll(function () {
      this.spies = ['syncResolveTwiceA', 'syncResolveTwiceB', 'asyncResolveTwiceFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveTwiceA, this.f.syncResolveTwiceB, this.f.asyncResolveTwiceFaster],
        [this.f.syncResolveTwiceA, [this.f, 'syncResolveTwiceB'], this.f.asyncResolveTwiceFaster],
        [[this.f, this.f.syncResolveTwiceA], [this.f, this.f.syncResolveTwiceB, this.f.asyncResolveTwiceFaster]],
        [[this.f, this.f.syncResolveTwiceA], [this.f, 'syncResolveTwiceB', 'asyncResolveTwiceFaster']],
        [[this.f, this.f.syncResolveTwiceA, this.f.syncResolveTwiceB, this.f.asyncResolveTwiceFaster]],
        [[this.f, 'syncResolveTwiceA', 'syncResolveTwiceB'], this.f.asyncResolveTwiceFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when C resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveTwiceA', 'syncResolveTwiceB', 'asyncResolveTwiceFaster')
          .after(100).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with asynchronous, synchronous and asynchronous three functions, where each resolves twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceMiddle', 'syncResolveTwiceB', 'asyncResolveTwiceFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceMiddle, this.f.syncResolveTwiceB, this.f.asyncResolveTwiceFaster],
        [this.f.asyncResolveTwiceMiddle, [this.f, 'syncResolveTwiceB'], this.f.asyncResolveTwiceFaster],
        [[this.f, this.f.asyncResolveTwiceMiddle], [this.f, this.f.syncResolveTwiceB, this.f.asyncResolveTwiceFaster]],
        [[this.f, this.f.asyncResolveTwiceMiddle], [this.f, 'syncResolveTwiceB', 'asyncResolveTwiceFaster']],
        [[this.f, this.f.asyncResolveTwiceMiddle, this.f.syncResolveTwiceB, this.f.asyncResolveTwiceFaster]],
        [[this.f, 'asyncResolveTwiceMiddle', 'syncResolveTwiceB'], this.f.asyncResolveTwiceFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceMiddle', 'syncResolveTwiceB', 'asyncResolveTwiceFaster')
          .after(350).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three synchronous functions, where each resolves twice and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveTwiceA', 'syncResolveTwiceB', 'syncResolveTwiceC', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveTwiceA, this.f.syncResolveTwiceB, this.f.syncResolveTwiceC],
        [this.f.syncResolveTwiceA, [this.f, 'syncResolveTwiceB'], this.f.syncResolveTwiceC],
        [[this.f, this.f.syncResolveTwiceA], [this.f, this.f.syncResolveTwiceB, this.f.syncResolveTwiceC]],
        [[this.f, this.f.syncResolveTwiceA], [this.f, 'syncResolveTwiceB', 'syncResolveTwiceC']],
        [[this.f, this.f.syncResolveTwiceA, this.f.syncResolveTwiceB, this.f.syncResolveTwiceC]],
        [[this.f, 'syncResolveTwiceA', 'syncResolveTwiceB'], this.f.syncResolveTwiceC]
      ];
    });

    it('the functions should be called in the following order: A, B, C, onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveTwiceA', 'syncResolveTwiceB', 'syncResolveTwiceC', 'syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where each resolves twice and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceFaster', 'asyncResolveTwiceMiddle', 'asyncResolveTwiceSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceFaster, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveTwiceSlower],
        [this.f.asyncResolveTwiceFaster, [this.f, 'asyncResolveTwiceMiddle'], this.f.asyncResolveTwiceSlower],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveTwiceSlower]],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, 'asyncResolveTwiceMiddle', 'asyncResolveTwiceSlower']],
        [[this.f, this.f.asyncResolveTwiceFaster, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveTwiceSlower]],
        [[this.f, 'asyncResolveTwiceFaster', 'asyncResolveTwiceMiddle'], this.f.asyncResolveTwiceSlower]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when C resolves, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceFaster', 'asyncResolveTwiceMiddle', 'asyncResolveTwiceSlower')
          .after(550).add('asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where each resolves twice and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceSlower', 'asyncResolveTwiceMiddle', 'asyncResolveTwiceFaster', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceSlower, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveTwiceFaster],
        [this.f.asyncResolveTwiceSlower, [this.f, 'asyncResolveTwiceMiddle'], this.f.asyncResolveTwiceFaster],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveTwiceFaster]],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, 'asyncResolveTwiceMiddle', 'asyncResolveTwiceFaster']],
        [[this.f, this.f.asyncResolveTwiceSlower, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveTwiceFaster]],
        [[this.f, 'asyncResolveTwiceSlower', 'asyncResolveTwiceMiddle'], this.f.asyncResolveTwiceFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when A resolves, then onCatch, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceSlower', 'asyncResolveTwiceMiddle', 'asyncResolveTwiceFaster')
          .after(550).add('asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three synchronous functions, where each both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveRejectA', 'syncResolveRejectB', 'syncResolveRejectC', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveRejectA, this.f.syncResolveRejectB, this.f.syncResolveRejectC],
        [this.f.syncResolveRejectA, [this.f, 'syncResolveRejectB'], this.f.syncResolveRejectC],
        [[this.f, this.f.syncResolveRejectA], [this.f, this.f.syncResolveRejectB, this.f.syncResolveRejectC]],
        [[this.f, this.f.syncResolveRejectA], [this.f, 'syncResolveRejectB', 'syncResolveRejectC']],
        [[this.f, this.f.syncResolveRejectA, this.f.syncResolveRejectB, this.f.syncResolveRejectC]],
        [[this.f, 'syncResolveRejectA', 'syncResolveRejectB'], this.f.syncResolveRejectC]
      ];
    });

    it('the functions should be called in the following order: A, B, C and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveRejectA', 'syncResolveRejectB', 'syncResolveRejectC', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions (order: 1, 2, 3), where each both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectFaster', 'asyncResolveRejectMiddle', 'asyncResolveRejectSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectFaster, this.f.asyncResolveRejectMiddle, this.f.asyncResolveRejectSlower],
        [this.f.asyncResolveRejectFaster, [this.f, 'asyncResolveRejectMiddle'], this.f.asyncResolveRejectSlower],
        [[this.f, this.f.asyncResolveRejectFaster], [this.f, this.f.asyncResolveRejectMiddle, this.f.asyncResolveRejectSlower]],
        [[this.f, this.f.asyncResolveRejectFaster], [this.f, 'asyncResolveRejectMiddle', 'asyncResolveRejectSlower']],
        [[this.f, this.f.asyncResolveRejectFaster, this.f.asyncResolveRejectMiddle, this.f.asyncResolveRejectSlower]],
        [[this.f, 'asyncResolveRejectFaster', 'asyncResolveRejectMiddle'], this.f.asyncResolveRejectSlower]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when C resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectFaster', 'asyncResolveRejectMiddle', 'asyncResolveRejectSlower')
          .after(500).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions (order: 3, 2, 1), where each both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectSlower', 'asyncResolveRejectMiddle', 'asyncResolveRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectSlower, this.f.asyncResolveRejectMiddle, this.f.asyncResolveRejectFaster],
        [this.f.asyncResolveRejectSlower, [this.f, 'asyncResolveRejectMiddle'], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.asyncResolveRejectSlower], [this.f, this.f.asyncResolveRejectMiddle, this.f.asyncResolveRejectFaster]],
        [[this.f, this.f.asyncResolveRejectSlower], [this.f, 'asyncResolveRejectMiddle', 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveRejectSlower, this.f.asyncResolveRejectMiddle, this.f.asyncResolveRejectFaster]],
        [[this.f, 'asyncResolveRejectSlower', 'asyncResolveRejectMiddle'], this.f.asyncResolveRejectFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectSlower', 'asyncResolveRejectMiddle', 'asyncResolveRejectFaster')
          .after(500).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions (order: 2, 3, 1), where each both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectMiddle', 'asyncResolveRejectSlower', 'asyncResolveRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectMiddle, this.f.asyncResolveRejectSlower, this.f.asyncResolveRejectFaster],
        [this.f.asyncResolveRejectMiddle, [this.f, 'asyncResolveRejectSlower'], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.asyncResolveRejectMiddle], [this.f, this.f.asyncResolveRejectSlower, this.f.asyncResolveRejectFaster]],
        [[this.f, this.f.asyncResolveRejectMiddle], [this.f, 'asyncResolveRejectSlower', 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveRejectMiddle, this.f.asyncResolveRejectSlower, this.f.asyncResolveRejectFaster]],
        [[this.f, 'asyncResolveRejectMiddle', 'asyncResolveRejectSlower'], this.f.asyncResolveRejectFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when B rejects', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectMiddle', 'asyncResolveRejectSlower', 'asyncResolveRejectFaster')
          .after(500).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with asynchronous, asynchronous and synchronous three functions, where each both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectFaster', 'asyncResolveRejectSlower', 'syncResolveRejectA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectFaster, this.f.asyncResolveRejectSlower, this.f.syncResolveRejectA],
        [this.f.asyncResolveRejectFaster, [this.f, 'asyncResolveRejectSlower'], this.f.syncResolveRejectA],
        [[this.f, this.f.asyncResolveRejectFaster], [this.f, this.f.asyncResolveRejectSlower, this.f.syncResolveRejectA]],
        [[this.f, this.f.asyncResolveRejectFaster], [this.f, 'asyncResolveRejectSlower', 'syncResolveRejectA']],
        [[this.f, this.f.asyncResolveRejectFaster, this.f.asyncResolveRejectSlower, this.f.syncResolveRejectA]],
        [[this.f, 'asyncResolveRejectFaster', 'asyncResolveRejectSlower'], this.f.syncResolveRejectA]

      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when B resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectFaster', 'asyncResolveRejectSlower', 'syncResolveRejectA')
          .after(500).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with synchronous, synchronous and asynchronous three functions, where each both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveRejectA', 'syncResolveRejectB', 'asyncResolveRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveRejectA, this.f.syncResolveRejectB, this.f.asyncResolveRejectFaster],
        [this.f.syncResolveRejectA, [this.f, 'syncResolveRejectB'], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.syncResolveRejectA], [this.f, this.f.syncResolveRejectB, this.f.asyncResolveRejectFaster]],
        [[this.f, this.f.syncResolveRejectA], [this.f, 'syncResolveRejectB', 'asyncResolveRejectFaster']],
        [[this.f, this.f.syncResolveRejectA, this.f.syncResolveRejectB, this.f.asyncResolveRejectFaster]],
        [[this.f, 'syncResolveRejectA', 'syncResolveRejectB'], this.f.asyncResolveRejectFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when C resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveRejectA', 'syncResolveRejectB', 'asyncResolveRejectFaster')
          .after(150).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with asynchronous, synchronous and asynchronous three functions, where each both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectMiddle', 'syncResolveRejectB', 'asyncResolveRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectMiddle, this.f.syncResolveRejectB, this.f.asyncResolveRejectFaster],
        [this.f.asyncResolveRejectMiddle, [this.f, 'syncResolveRejectB'], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.asyncResolveRejectMiddle], [this.f, this.f.syncResolveRejectB, this.f.asyncResolveRejectFaster]],
        [[this.f, this.f.asyncResolveRejectMiddle], [this.f, 'syncResolveRejectB', 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveRejectMiddle, this.f.syncResolveRejectB, this.f.asyncResolveRejectFaster]],
        [[this.f, 'asyncResolveRejectMiddle', 'syncResolveRejectB'], this.f.asyncResolveRejectFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectMiddle', 'syncResolveRejectB', 'asyncResolveRejectFaster')
          .after(400).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three synchronous functions, where each both resolves and rejects and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveRejectA', 'syncResolveRejectB', 'syncResolveRejectC', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveRejectA, this.f.syncResolveRejectB, this.f.syncResolveRejectC],
        [this.f.syncResolveRejectA, [this.f, 'syncResolveRejectB'], this.f.syncResolveRejectC],
        [[this.f, this.f.syncResolveRejectA], [this.f, this.f.syncResolveRejectB, this.f.syncResolveRejectC]],
        [[this.f, this.f.syncResolveRejectA], [this.f, 'syncResolveRejectB', 'syncResolveRejectC']],
        [[this.f, this.f.syncResolveRejectA, this.f.syncResolveRejectB, this.f.syncResolveRejectC]],
        [[this.f, 'syncResolveRejectA', 'syncResolveRejectB'], this.f.syncResolveRejectC]
      ];
    });

    it('the functions should be called in the following order: A, B, C, onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveRejectA', 'syncResolveRejectB', 'syncResolveRejectC', 'syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where each both resolves and rejects and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectFaster', 'asyncResolveRejectMiddle', 'asyncResolveRejectSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectFaster, this.f.asyncResolveRejectMiddle, this.f.asyncResolveRejectSlower],
        [this.f.asyncResolveRejectFaster, [this.f, 'asyncResolveRejectMiddle'], this.f.asyncResolveRejectSlower],
        [[this.f, this.f.asyncResolveRejectFaster], [this.f, this.f.asyncResolveRejectMiddle, this.f.asyncResolveRejectSlower]],
        [[this.f, this.f.asyncResolveRejectFaster], [this.f, 'asyncResolveRejectMiddle', 'asyncResolveRejectSlower']],
        [[this.f, this.f.asyncResolveRejectFaster, this.f.asyncResolveRejectMiddle, this.f.asyncResolveRejectSlower]],
        [[this.f, 'asyncResolveRejectFaster', 'asyncResolveRejectMiddle'], this.f.asyncResolveRejectSlower]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when C resolves, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectFaster', 'asyncResolveRejectMiddle', 'asyncResolveRejectSlower')
          .after(500).add('asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where each both resolves and rejects and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveRejectSlower', 'asyncResolveRejectMiddle', 'asyncResolveRejectFaster', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveRejectSlower, this.f.asyncResolveRejectMiddle, this.f.asyncResolveRejectFaster],
        [this.f.asyncResolveRejectSlower, [this.f, 'asyncResolveRejectMiddle'], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.asyncResolveRejectSlower], [this.f, this.f.asyncResolveRejectMiddle, this.f.asyncResolveRejectFaster]],
        [[this.f, this.f.asyncResolveRejectSlower], [this.f, 'asyncResolveRejectMiddle', 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveRejectSlower, this.f.asyncResolveRejectMiddle, this.f.asyncResolveRejectFaster]],
        [[this.f, 'asyncResolveRejectSlower', 'asyncResolveRejectMiddle'], this.f.asyncResolveRejectFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onDone when A resolves, then onCatch, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveRejectSlower', 'asyncResolveRejectMiddle', 'asyncResolveRejectFaster')
          .after(500).add('asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three synchronous functions, where each both rejects and resolves', function () {
    beforeAll(function () {
      this.spies = ['syncRejectResolveA', 'syncRejectResolveB', 'syncRejectResolveC', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncRejectResolveA, this.f.syncRejectResolveB, this.f.syncRejectResolveC],
        [this.f.syncRejectResolveA, [this.f, 'syncRejectResolveB'], this.f.syncRejectResolveC],
        [[this.f, this.f.syncRejectResolveA], [this.f, this.f.syncRejectResolveB, this.f.syncRejectResolveC]],
        [[this.f, this.f.syncRejectResolveA], [this.f, 'syncRejectResolveB', 'syncRejectResolveC']],
        [[this.f, this.f.syncRejectResolveA, this.f.syncRejectResolveB, this.f.syncRejectResolveC]],
        [[this.f, 'syncRejectResolveA', 'syncRejectResolveB'], this.f.syncRejectResolveC]
      ];
    });

    it('the functions should be called in the following order: A, onCatch, B, onCatch, C, onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncRejectResolveA', 'syncCatch', 'syncRejectResolveB', 'syncCatch', 'syncRejectResolveC', 'syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions (order: 1, 2, 3), where each both rejects and resolves', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectResolveFaster', 'asyncRejectResolveMiddle', 'asyncRejectResolveSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectResolveFaster, this.f.asyncRejectResolveMiddle, this.f.asyncRejectResolveSlower],
        [this.f.asyncRejectResolveFaster, [this.f, 'asyncRejectResolveMiddle'], this.f.asyncRejectResolveSlower],
        [[this.f, this.f.asyncRejectResolveFaster], [this.f, this.f.asyncRejectResolveMiddle, this.f.asyncRejectResolveSlower]],
        [[this.f, this.f.asyncRejectResolveFaster], [this.f, 'asyncRejectResolveMiddle', 'asyncRejectResolveSlower']],
        [[this.f, this.f.asyncRejectResolveFaster, this.f.asyncRejectResolveMiddle, this.f.asyncRejectResolveSlower]],
        [[this.f, 'asyncRejectResolveFaster', 'asyncRejectResolveMiddle'], this.f.asyncRejectResolveSlower]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onCatch, then onCatch, then onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectResolveFaster', 'asyncRejectResolveMiddle', 'asyncRejectResolveSlower')
          .after(100).add('syncCatch')
          .after(250).add('syncCatch')
          .after(100).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions (order: 3, 2, 1), where each both rejects and resolves', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectResolveSlower', 'asyncRejectResolveMiddle', 'asyncRejectResolveFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectResolveSlower, this.f.asyncRejectResolveMiddle, this.f.asyncRejectResolveFaster],
        [this.f.asyncRejectResolveSlower, [this.f, 'asyncRejectResolveMiddle'], this.f.asyncRejectResolveFaster],
        [[this.f, this.f.asyncRejectResolveSlower], [this.f, this.f.asyncRejectResolveMiddle, this.f.asyncRejectResolveFaster]],
        [[this.f, this.f.asyncRejectResolveSlower], [this.f, 'asyncRejectResolveMiddle', 'asyncRejectResolveFaster']],
        [[this.f, this.f.asyncRejectResolveSlower, this.f.asyncRejectResolveMiddle, this.f.asyncRejectResolveFaster]],
        [[this.f, 'asyncRejectResolveSlower', 'asyncRejectResolveMiddle'], this.f.asyncRejectResolveFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onCatch, then onCatch, then onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectResolveSlower', 'asyncRejectResolveMiddle', 'asyncRejectResolveFaster')
          .after(100).add('syncCatch')
          .after(250).add('syncCatch')
          .after(100).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions (order: 2, 3, 1), where each both rejects and resolves', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectResolveMiddle', 'asyncRejectResolveSlower', 'asyncRejectResolveFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectResolveMiddle, this.f.asyncRejectResolveSlower, this.f.asyncRejectResolveFaster],
        [this.f.asyncRejectResolveMiddle, [this.f, 'asyncRejectResolveSlower'], this.f.asyncRejectResolveFaster],
        [[this.f, this.f.asyncRejectResolveMiddle], [this.f, this.f.asyncRejectResolveSlower, this.f.asyncRejectResolveFaster]],
        [[this.f, this.f.asyncRejectResolveMiddle], [this.f, 'asyncRejectResolveSlower', 'asyncRejectResolveFaster']],
        [[this.f, this.f.asyncRejectResolveMiddle, this.f.asyncRejectResolveSlower, this.f.asyncRejectResolveFaster]],
        [[this.f, 'asyncRejectResolveMiddle', 'asyncRejectResolveSlower'], this.f.asyncRejectResolveFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onCatch, then onCatch, then onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectResolveMiddle', 'asyncRejectResolveSlower', 'asyncRejectResolveFaster')
          .after(100).add('syncCatch')
          .after(250).add('syncCatch')
          .after(100).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with asynchronous, asynchronous and synchronous three functions, where each both rejects and resolves', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectResolveFaster', 'asyncRejectResolveSlower', 'syncRejectResolveA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectResolveFaster, this.f.asyncRejectResolveSlower, this.f.syncRejectResolveA],
        [this.f.asyncRejectResolveFaster, [this.f, 'asyncRejectResolveSlower'], this.f.syncRejectResolveA],
        [[this.f, this.f.asyncRejectResolveFaster], [this.f, this.f.asyncRejectResolveSlower, this.f.syncRejectResolveA]],
        [[this.f, this.f.asyncRejectResolveFaster], [this.f, 'asyncRejectResolveSlower', 'syncRejectResolveA']],
        [[this.f, this.f.asyncRejectResolveFaster, this.f.asyncRejectResolveSlower, this.f.syncRejectResolveA]],
        [[this.f, 'asyncRejectResolveFaster', 'asyncRejectResolveSlower'], this.f.syncRejectResolveA]

      ];
    });

    it('the functions should be called in the following order: A, B, C and onCatch, then onCatch, then onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectResolveFaster', 'asyncRejectResolveSlower', 'syncRejectResolveA', 'syncCatch')
          .after(100).add('syncCatch')
          .after(350).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with synchronous, synchronous and asynchronous three functions, where each both rejects and resolves', function () {
    beforeAll(function () {
      this.spies = ['syncRejectResolveA', 'syncRejectResolveB', 'asyncRejectResolveFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncRejectResolveA, this.f.syncRejectResolveB, this.f.asyncRejectResolveFaster],
        [this.f.syncRejectResolveA, [this.f, 'syncRejectResolveB'], this.f.asyncRejectResolveFaster],
        [[this.f, this.f.syncRejectResolveA], [this.f, this.f.syncRejectResolveB, this.f.asyncRejectResolveFaster]],
        [[this.f, this.f.syncRejectResolveA], [this.f, 'syncRejectResolveB', 'asyncRejectResolveFaster']],
        [[this.f, this.f.syncRejectResolveA, this.f.syncRejectResolveB, this.f.asyncRejectResolveFaster]],
        [[this.f, 'syncRejectResolveA', 'syncRejectResolveB'], this.f.asyncRejectResolveFaster]
      ];
    });

    it('the functions should be called in the following order: A, onCatch, B, onCatch and C, then onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncRejectResolveA', 'syncCatch', 'syncRejectResolveB', 'syncCatch', 'asyncRejectResolveFaster')
          .after(100).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with asynchronous, synchronous and asynchronous three functions, where each both rejects and resolves', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectResolveMiddle', 'syncRejectResolveB', 'asyncRejectResolveFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectResolveMiddle, this.f.syncRejectResolveB, this.f.asyncRejectResolveFaster],
        [this.f.asyncRejectResolveMiddle, [this.f, 'syncRejectResolveB'], this.f.asyncRejectResolveFaster],
        [[this.f, this.f.asyncRejectResolveMiddle], [this.f, this.f.syncRejectResolveB, this.f.asyncRejectResolveFaster]],
        [[this.f, this.f.asyncRejectResolveMiddle], [this.f, 'syncRejectResolveB', 'asyncRejectResolveFaster']],
        [[this.f, this.f.asyncRejectResolveMiddle, this.f.syncRejectResolveB, this.f.asyncRejectResolveFaster]],
        [[this.f, 'asyncRejectResolveMiddle', 'syncRejectResolveB'], this.f.asyncRejectResolveFaster]
      ];
    });

    it('the functions should be called in the following order: A, B, onCatch and C, then onCatch, then onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectResolveMiddle', 'syncRejectResolveB', 'syncCatch', 'asyncRejectResolveFaster')
          .after(100).add('syncCatch')
          .after(250).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three synchronous functions, where each both rejects and resolves and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncRejectResolveA', 'syncRejectResolveB', 'syncRejectResolveC', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncRejectResolveA, this.f.syncRejectResolveB, this.f.syncRejectResolveC],
        [this.f.syncRejectResolveA, [this.f, 'syncRejectResolveB'], this.f.syncRejectResolveC],
        [[this.f, this.f.syncRejectResolveA], [this.f, this.f.syncRejectResolveB, this.f.syncRejectResolveC]],
        [[this.f, this.f.syncRejectResolveA], [this.f, 'syncRejectResolveB', 'syncRejectResolveC']],
        [[this.f, this.f.syncRejectResolveA, this.f.syncRejectResolveB, this.f.syncRejectResolveC]],
        [[this.f, 'syncRejectResolveA', 'syncRejectResolveB'], this.f.syncRejectResolveC]
      ];
    });

    it('the functions should be called in the following order: A, onCatch, B, onCatch, C, onCatch, onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncRejectResolveA', 'syncCatch', 'syncRejectResolveB', 'syncCatch', 'syncRejectResolveC', 'syncCatch', 'syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where each both rejects and resolves and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectResolveFaster', 'asyncRejectResolveMiddle', 'asyncRejectResolveSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectResolveFaster, this.f.asyncRejectResolveMiddle, this.f.asyncRejectResolveSlower],
        [this.f.asyncRejectResolveFaster, [this.f, 'asyncRejectResolveMiddle'], this.f.asyncRejectResolveSlower],
        [[this.f, this.f.asyncRejectResolveFaster], [this.f, this.f.asyncRejectResolveMiddle, this.f.asyncRejectResolveSlower]],
        [[this.f, this.f.asyncRejectResolveFaster], [this.f, 'asyncRejectResolveMiddle', 'asyncRejectResolveSlower']],
        [[this.f, this.f.asyncRejectResolveFaster, this.f.asyncRejectResolveMiddle, this.f.asyncRejectResolveSlower]],
        [[this.f, 'asyncRejectResolveFaster', 'asyncRejectResolveMiddle'], this.f.asyncRejectResolveSlower]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onCatch, then onCatch, then onCatch and onDone, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectResolveFaster', 'asyncRejectResolveMiddle', 'asyncRejectResolveSlower')
          .after(100).add('syncCatch')
          .after(250).add('syncCatch')
          .after(100).add('syncCatch', 'asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where each both rejects and resolves and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncRejectResolveSlower', 'asyncRejectResolveMiddle', 'asyncRejectResolveFaster', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncRejectResolveSlower, this.f.asyncRejectResolveMiddle, this.f.asyncRejectResolveFaster],
        [this.f.asyncRejectResolveSlower, [this.f, 'asyncRejectResolveMiddle'], this.f.asyncRejectResolveFaster],
        [[this.f, this.f.asyncRejectResolveSlower], [this.f, this.f.asyncRejectResolveMiddle, this.f.asyncRejectResolveFaster]],
        [[this.f, this.f.asyncRejectResolveSlower], [this.f, 'asyncRejectResolveMiddle', 'asyncRejectResolveFaster']],
        [[this.f, this.f.asyncRejectResolveSlower, this.f.asyncRejectResolveMiddle, this.f.asyncRejectResolveFaster]],
        [[this.f, 'asyncRejectResolveSlower', 'asyncRejectResolveMiddle'], this.f.asyncRejectResolveFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onCatch, then onCatch, then onCatch and onDone, then onCatch, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncRejectResolveSlower', 'asyncRejectResolveMiddle', 'asyncRejectResolveFaster')
          .after(100).add('syncCatch')
          .after(250).add('syncCatch')
          .after(100).add('syncCatch', 'asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three synchronous functions, where first resolves twice, second both resolves and rejects and third both rejects and resolves', function () {
    beforeAll(function () {
      this.spies = ['syncResolveTwiceA', 'syncResolveRejectA', 'syncRejectResolveA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveTwiceA, this.f.syncResolveRejectA, this.f.syncRejectResolveA],
        [this.f.syncResolveTwiceA, [this.f, 'syncResolveRejectA'], this.f.syncRejectResolveA],
        [[this.f, this.f.syncResolveTwiceA], [this.f, this.f.syncResolveRejectA, this.f.syncRejectResolveA]],
        [[this.f, this.f.syncResolveTwiceA], [this.f, 'syncResolveRejectA', 'syncRejectResolveA']],
        [[this.f, this.f.syncResolveTwiceA, this.f.syncResolveRejectA, this.f.syncRejectResolveA]],
        [[this.f, 'syncResolveTwiceA', 'syncResolveRejectA'], this.f.syncRejectResolveA]
      ];
    });

    it('the functions should be called in the following order: A, B, C, onCatch and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveTwiceA', 'syncResolveRejectA', 'syncRejectResolveA', 'syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions (order: 1, 2, 3), where first resolves twice, second both resolves and rejects and third both rejects and resolves', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceFaster', 'asyncResolveRejectMiddle', 'asyncRejectResolveSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceFaster, this.f.asyncResolveRejectMiddle, this.f.asyncRejectResolveSlower],
        [this.f.asyncResolveTwiceFaster, [this.f, 'asyncResolveRejectMiddle'], this.f.asyncRejectResolveSlower],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, this.f.asyncResolveRejectMiddle, this.f.asyncRejectResolveSlower]],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, 'asyncResolveRejectMiddle', 'asyncRejectResolveSlower']],
        [[this.f, this.f.asyncResolveTwiceFaster, this.f.asyncResolveRejectMiddle, this.f.asyncRejectResolveSlower]],
        [[this.f, 'asyncResolveTwiceFaster', 'asyncResolveRejectMiddle'], this.f.asyncRejectResolveSlower]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onCatch when C rejects and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceFaster', 'asyncResolveRejectMiddle', 'asyncRejectResolveSlower')
          .after(450).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions (order: 3, 2, 1), where first resolves twice, second both resolves and rejects and third both rejects and resolves', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceSlower', 'asyncResolveRejectMiddle', 'asyncRejectResolveFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceSlower, this.f.asyncResolveRejectMiddle, this.f.asyncRejectResolveFaster],
        [this.f.asyncResolveTwiceSlower, [this.f, 'asyncResolveRejectMiddle'], this.f.asyncRejectResolveFaster],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, this.f.asyncResolveRejectMiddle, this.f.asyncRejectResolveFaster]],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, 'asyncResolveRejectMiddle', 'asyncRejectResolveFaster']],
        [[this.f, this.f.asyncResolveTwiceSlower, this.f.asyncResolveRejectMiddle, this.f.asyncRejectResolveFaster]],
        [[this.f, 'asyncResolveTwiceSlower', 'asyncResolveRejectMiddle'], this.f.asyncRejectResolveFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onCatch when C rejects, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceSlower', 'asyncResolveRejectMiddle', 'asyncRejectResolveFaster')
          .after(100).add('syncCatch')
          .after(450).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions (order: 2, 3, 1), where first resolves twice, second both resolves and rejects and third both rejects and resolves', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceMiddle', 'asyncResolveRejectSlower', 'asyncRejectResolveFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceMiddle, this.f.asyncResolveRejectSlower, this.f.asyncRejectResolveFaster],
        [this.f.asyncResolveTwiceMiddle, [this.f, 'asyncResolveRejectSlower'], this.f.asyncRejectResolveFaster],
        [[this.f, this.f.asyncResolveTwiceMiddle], [this.f, this.f.asyncResolveRejectSlower, this.f.asyncRejectResolveFaster]],
        [[this.f, this.f.asyncResolveTwiceMiddle], [this.f, 'asyncResolveRejectSlower', 'asyncRejectResolveFaster']],
        [[this.f, this.f.asyncResolveTwiceMiddle, this.f.asyncResolveRejectSlower, this.f.asyncRejectResolveFaster]],
        [[this.f, 'asyncResolveTwiceMiddle', 'asyncResolveRejectSlower'], this.f.asyncRejectResolveFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onCatch when C rejects, then onDone when B resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceMiddle', 'asyncResolveRejectSlower', 'asyncRejectResolveFaster')
          .after(100).add('syncCatch')
          .after(400).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with asynchronous, asynchronous and synchronous three functions, where first resolves twice, second both resolves and rejects and third both rejects and resolves', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceFaster', 'asyncResolveRejectSlower', 'syncRejectResolveA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceFaster, this.f.asyncResolveRejectSlower, this.f.syncRejectResolveA],
        [this.f.asyncResolveTwiceFaster, [this.f, 'asyncResolveRejectSlower'], this.f.syncRejectResolveA],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, this.f.asyncResolveRejectSlower, this.f.syncRejectResolveA]],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, 'asyncResolveRejectSlower', 'syncRejectResolveA']],
        [[this.f, this.f.asyncResolveTwiceFaster, this.f.asyncResolveRejectSlower, this.f.syncRejectResolveA]],
        [[this.f, 'asyncResolveTwiceFaster', 'asyncResolveRejectSlower'], this.f.syncRejectResolveA]

      ];
    });

    it('the functions should be called in the following order: A, B, C and onCatch, then onDone when B resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceFaster', 'asyncResolveRejectSlower', 'syncRejectResolveA', 'syncCatch')
          .after(500).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with synchronous, synchronous and asynchronous three functions, where first resolves twice, second both resolves and rejects and third both rejects and resolves', function () {
    beforeAll(function () {
      this.spies = ['syncResolveTwiceA', 'syncResolveRejectA', 'asyncRejectResolveFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveTwiceA, this.f.syncResolveRejectA, this.f.asyncRejectResolveFaster],
        [this.f.syncResolveTwiceA, [this.f, 'syncResolveRejectA'], this.f.asyncRejectResolveFaster],
        [[this.f, this.f.syncResolveTwiceA], [this.f, this.f.syncResolveRejectA, this.f.asyncRejectResolveFaster]],
        [[this.f, this.f.syncResolveTwiceA], [this.f, 'syncResolveRejectA', 'asyncRejectResolveFaster']],
        [[this.f, this.f.syncResolveTwiceA, this.f.syncResolveRejectA, this.f.asyncRejectResolveFaster]],
        [[this.f, 'syncResolveTwiceA', 'syncResolveRejectA'], this.f.asyncRejectResolveFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onCatch when C rejects and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveTwiceA', 'syncResolveRejectA', 'asyncRejectResolveFaster')
          .after(100).add('syncCatch', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with asynchronous, synchronous and asynchronous three functions, where first resolves twice, second both resolves and rejects and third both rejects and resolves', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceMiddle', 'syncResolveRejectA', 'asyncRejectResolveFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceMiddle, this.f.syncResolveRejectA, this.f.asyncRejectResolveFaster],
        [this.f.asyncResolveTwiceMiddle, [this.f, 'syncResolveRejectA'], this.f.asyncRejectResolveFaster],
        [[this.f, this.f.asyncResolveTwiceMiddle], [this.f, this.f.syncResolveRejectA, this.f.asyncRejectResolveFaster]],
        [[this.f, this.f.asyncResolveTwiceMiddle], [this.f, 'syncResolveRejectA', 'asyncRejectResolveFaster']],
        [[this.f, this.f.asyncResolveTwiceMiddle, this.f.syncResolveRejectA, this.f.asyncRejectResolveFaster]],
        [[this.f, 'asyncResolveTwiceMiddle', 'syncResolveRejectA'], this.f.asyncRejectResolveFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onCatch when C rejects, then onDone when A resolves', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceMiddle', 'syncResolveRejectA', 'asyncRejectResolveFaster')
          .after(100).add('syncCatch')
          .after(250).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three synchronous functions, where first resolves twice, second both resolves and rejects and third both rejects and resolves and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveTwiceA', 'syncResolveRejectA', 'syncRejectResolveA', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveTwiceA, this.f.syncResolveRejectA, this.f.syncRejectResolveA],
        [this.f.syncResolveTwiceA, [this.f, 'syncResolveRejectA'], this.f.syncRejectResolveA],
        [[this.f, this.f.syncResolveTwiceA], [this.f, this.f.syncResolveRejectA, this.f.syncRejectResolveA]],
        [[this.f, this.f.syncResolveTwiceA], [this.f, 'syncResolveRejectA', 'syncRejectResolveA']],
        [[this.f, this.f.syncResolveTwiceA, this.f.syncResolveRejectA, this.f.syncRejectResolveA]],
        [[this.f, 'syncResolveTwiceA', 'syncResolveRejectA'], this.f.syncRejectResolveA]
      ];
    });

    it('the functions should be called in the following order: A, B, C, onCatch, onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveTwiceA', 'syncResolveRejectA', 'syncRejectResolveA', 'syncCatch', 'syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where first resolves twice, second both resolves and rejects and third both rejects and resolves and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceFaster', 'asyncResolveRejectMiddle', 'asyncRejectResolveSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceFaster, this.f.asyncResolveRejectMiddle, this.f.asyncRejectResolveSlower],
        [this.f.asyncResolveTwiceFaster, [this.f, 'asyncResolveRejectMiddle'], this.f.asyncRejectResolveSlower],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, this.f.asyncResolveRejectMiddle, this.f.asyncRejectResolveSlower]],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, 'asyncResolveRejectMiddle', 'asyncRejectResolveSlower']],
        [[this.f, this.f.asyncResolveTwiceFaster, this.f.asyncResolveRejectMiddle, this.f.asyncRejectResolveSlower]],
        [[this.f, 'asyncResolveTwiceFaster', 'asyncResolveRejectMiddle'], this.f.asyncRejectResolveSlower]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onCatch when C rejects and onDone, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceFaster', 'asyncResolveRejectMiddle', 'asyncRejectResolveSlower')
          .after(450).add('syncCatch', 'asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where first resolves twice, second both resolves and rejects and third both rejects and resolves and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceSlower', 'asyncResolveRejectMiddle', 'asyncRejectResolveFaster', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceSlower, this.f.asyncResolveRejectMiddle, this.f.asyncRejectResolveFaster],
        [this.f.asyncResolveTwiceSlower, [this.f, 'asyncResolveRejectMiddle'], this.f.asyncRejectResolveFaster],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, this.f.asyncResolveRejectMiddle, this.f.asyncRejectResolveFaster]],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, 'asyncResolveRejectMiddle', 'asyncRejectResolveFaster']],
        [[this.f, this.f.asyncResolveTwiceSlower, this.f.asyncResolveRejectMiddle, this.f.asyncRejectResolveFaster]],
        [[this.f, 'asyncResolveTwiceSlower', 'asyncResolveRejectMiddle'], this.f.asyncRejectResolveFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C, then onCatch when C rejects, then onDone when A resolves, then onCatch, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceSlower', 'asyncResolveRejectMiddle', 'asyncRejectResolveFaster')
          .after(100).add('syncCatch')
          .after(450).add('asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three synchronous functions, where first resolves, second has inner move-on module and resolves and third resolves', function () {
    beforeAll(function () {
      this.spies = ['syncResolveA', 'syncInjectedModuleResolve', 'syncResolveB', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveA, this.f.syncInjectedModuleResolve, this.f.syncResolveB],
        [this.f.syncResolveA, [this.f, 'syncInjectedModuleResolve'], this.f.syncResolveB],
        [[this.f, this.f.syncResolveA], [this.f, this.f.syncInjectedModuleResolve, this.f.syncResolveB]],
        [[this.f, this.f.syncResolveA], [this.f, 'syncInjectedModuleResolve', 'syncResolveB']],
        [[this.f, this.f.syncResolveA, this.f.syncInjectedModuleResolve, this.f.syncResolveB]],
        [[this.f, 'syncResolveA', 'syncInjectedModuleResolve'], this.f.syncResolveB]
      ];
    });

    it('the functions should be called in the following order: A, B, inner-module-A, inner-module-B, C and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveA', 'syncInjectedModuleResolve', 'syncResolveA', 'syncResolveB', 'syncResolveB', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where first resolves, second has inner move-on module and resolves and third resolves and first executes farster than third', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveFaster', 'asyncInjectedModuleResolveSlower', 'asyncResolveSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveFaster, this.f.asyncInjectedModuleResolveSlower, this.f.asyncResolveSlower],
        [this.f.asyncResolveFaster, [this.f, 'asyncInjectedModuleResolveSlower'], this.f.asyncResolveSlower],
        [[this.f, this.f.asyncResolveFaster], [this.f, this.f.asyncInjectedModuleResolveSlower, this.f.asyncResolveSlower]],
        [[this.f, this.f.asyncResolveFaster], [this.f, 'asyncInjectedModuleResolveSlower', 'asyncResolveSlower']],
        [[this.f, this.f.asyncResolveFaster, this.f.asyncInjectedModuleResolveSlower, this.f.asyncResolveSlower]],
        [[this.f, 'asyncResolveFaster', 'asyncInjectedModuleResolveSlower'], this.f.asyncResolveSlower]
      ];
    });

    it('the functions should be called in the following order: A, B, inner-module-A and C, then inner-module-B, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveFaster', 'asyncInjectedModuleResolveSlower', 'asyncResolveFaster', 'asyncResolveSlower')
          .after(100).add('asyncResolveSlower')
          .after(500).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where first resolves, second has inner move-on module and resolves and third resolves and third executes faster than first', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveSlower', 'asyncInjectedModuleResolveSlower', 'asyncResolveFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveSlower, this.f.asyncInjectedModuleResolveSlower, this.f.asyncResolveFaster],
        [this.f.asyncResolveSlower, [this.f, 'asyncInjectedModuleResolveSlower'], this.f.asyncResolveFaster],
        [[this.f, this.f.asyncResolveSlower], [this.f, this.f.asyncInjectedModuleResolveSlower, this.f.asyncResolveFaster]],
        [[this.f, this.f.asyncResolveSlower], [this.f, 'asyncInjectedModuleResolveSlower', 'asyncResolveFaster']],
        [[this.f, this.f.asyncResolveSlower, this.f.asyncInjectedModuleResolveSlower, this.f.asyncResolveFaster]],
        [[this.f, 'asyncResolveSlower', 'asyncInjectedModuleResolveSlower'], this.f.asyncResolveFaster]
      ];
    });

    it('the functions should be called in the following order: A, B, inner-module-A, C, then inner-module-B, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveSlower', 'asyncInjectedModuleResolveSlower', 'asyncResolveFaster', 'asyncResolveFaster')
          .after(100).add('asyncResolveSlower')
          .after(500).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where first resolves, second has inner move-on module and resolves and third resolves and third executes a bit faster than first', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveMiddle', 'asyncInjectedModuleResolveA', 'asyncResolveFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveMiddle, this.f.asyncInjectedModuleResolveA, this.f.asyncResolveFaster],
        [this.f.asyncResolveMiddle, [this.f, 'asyncInjectedModuleResolveA'], this.f.asyncResolveFaster],
        [[this.f, this.f.asyncResolveMiddle], [this.f, this.f.asyncInjectedModuleResolveA, this.f.asyncResolveFaster]],
        [[this.f, this.f.asyncResolveMiddle], [this.f, 'asyncInjectedModuleResolveA', 'asyncResolveFaster']],
        [[this.f, this.f.asyncResolveMiddle, this.f.asyncInjectedModuleResolveA, this.f.asyncResolveFaster]],
        [[this.f, 'asyncResolveMiddle', 'asyncInjectedModuleResolveA'], this.f.asyncResolveFaster]
      ];
    });

    it('the functions should be called in the following order: A, B, inner-module-A and C, then inner-module-B, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveMiddle', 'asyncInjectedModuleResolveA', 'asyncResolveMiddle', 'asyncResolveFaster')
          .after(350).add('asyncResolveFaster')
          .after(100).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with asynchronous, asynchronous and synchronous three functions, where first resolves, second has inner move-on module and resolves and third resolves', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveFaster', 'asyncInjectedModuleResolveB', 'syncResolveA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveFaster, this.f.asyncInjectedModuleResolveB, this.f.syncResolveA],
        [this.f.asyncResolveFaster, [this.f, 'asyncInjectedModuleResolveB'], this.f.syncResolveA],
        [[this.f, this.f.asyncResolveFaster], [this.f, this.f.asyncInjectedModuleResolveB, this.f.syncResolveA]],
        [[this.f, this.f.asyncResolveFaster], [this.f, 'asyncInjectedModuleResolveB', 'syncResolveA']],
        [[this.f, this.f.asyncResolveFaster, this.f.asyncInjectedModuleResolveB, this.f.syncResolveA]],
        [[this.f, 'asyncResolveFaster', 'asyncInjectedModuleResolveB'], this.f.syncResolveA]

      ];
    });

    it('the functions should be called in the following order: A, B, inner-module-A and C, then inner-module-B and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveFaster', 'asyncInjectedModuleResolveB', 'asyncResolveFaster', 'syncResolveA')
          .after(100).add('syncResolveA', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with synchronous, asynchronous and asynchronous three functions, where first resolves, second has inner move-on module and resolves and third resolves', function () {
    beforeAll(function () {
      this.spies = ['syncResolveA', 'asyncInjectedModuleResolveB', 'asyncResolveFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveA, this.f.asyncInjectedModuleResolveB, this.f.asyncResolveFaster],
        [this.f.syncResolveA, [this.f, 'asyncInjectedModuleResolveB'], this.f.asyncResolveFaster],
        [[this.f, this.f.syncResolveA], [this.f, this.f.asyncInjectedModuleResolveB, this.f.asyncResolveFaster]],
        [[this.f, this.f.syncResolveA], [this.f, 'asyncInjectedModuleResolveB', 'asyncResolveFaster']],
        [[this.f, this.f.syncResolveA, this.f.asyncInjectedModuleResolveB, this.f.asyncResolveFaster]],
        [[this.f, 'syncResolveA', 'asyncInjectedModuleResolveB'], this.f.asyncResolveFaster]
      ];
    });

    it('the functions should be called in the following order: A, B, inner-module-A and C, then inner-module-B and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveA', 'asyncInjectedModuleResolveB', 'asyncResolveFaster', 'asyncResolveFaster')
          .after(100).add('syncResolveA', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with asynchronous, asynchronous and synchronous three functions, where first resolves, second has inner move-on module and resolves and third resolves', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveMiddle', 'asyncInjectedModuleResolveC', 'syncResolveA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveMiddle, this.f.asyncInjectedModuleResolveC, this.f.syncResolveA],
        [this.f.asyncResolveMiddle, [this.f, 'asyncInjectedModuleResolveC'], this.f.syncResolveA],
        [[this.f, this.f.asyncResolveMiddle], [this.f, this.f.asyncInjectedModuleResolveC, this.f.syncResolveA]],
        [[this.f, this.f.asyncResolveMiddle], [this.f, 'asyncInjectedModuleResolveC', 'syncResolveA']],
        [[this.f, this.f.asyncResolveMiddle, this.f.asyncInjectedModuleResolveC, this.f.syncResolveA]],
        [[this.f, 'asyncResolveMiddle', 'asyncInjectedModuleResolveC'], this.f.syncResolveA]
      ];
    });

    it('the functions should be called in the following order: A, B, inner-module-A, inner-module-B and C, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveMiddle', 'asyncInjectedModuleResolveC', 'syncResolveA', 'asyncResolveMiddle', 'syncResolveA')
          .after(350).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three synchronous functions, where first resolves, second has inner move-on module and resolves and third resolves and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveA', 'syncInjectedModuleResolve', 'syncResolveB', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveA, this.f.syncInjectedModuleResolve, this.f.syncResolveB],
        [this.f.syncResolveA, [this.f, 'syncInjectedModuleResolve'], this.f.syncResolveB],
        [[this.f, this.f.syncResolveA], [this.f, this.f.syncInjectedModuleResolve, this.f.syncResolveB]],
        [[this.f, this.f.syncResolveA], [this.f, 'syncInjectedModuleResolve', 'syncResolveB']],
        [[this.f, this.f.syncResolveA, this.f.syncInjectedModuleResolve, this.f.syncResolveB]],
        [[this.f, 'syncResolveA', 'syncInjectedModuleResolve'], this.f.syncResolveB]
      ];
    });

    it('the functions should be called in the following order: A, B, inner-module-A, inner-module-B, C onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveA', 'syncInjectedModuleResolve', 'syncResolveA', 'syncResolveB', 'syncResolveB', 'syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where first resolves, second has inner move-on module and resolves and third resolves and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveFaster', 'asyncInjectedModuleResolveSlower', 'asyncResolveSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveFaster, this.f.asyncInjectedModuleResolveSlower, this.f.asyncResolveSlower],
        [this.f.asyncResolveFaster, [this.f, 'asyncInjectedModuleResolveSlower'], this.f.asyncResolveSlower],
        [[this.f, this.f.asyncResolveFaster], [this.f, this.f.asyncInjectedModuleResolveSlower, this.f.asyncResolveSlower]],
        [[this.f, this.f.asyncResolveFaster], [this.f, 'asyncInjectedModuleResolveSlower', 'asyncResolveSlower']],
        [[this.f, this.f.asyncResolveFaster, this.f.asyncInjectedModuleResolveSlower, this.f.asyncResolveSlower]],
        [[this.f, 'asyncResolveFaster', 'asyncInjectedModuleResolveSlower'], this.f.asyncResolveSlower]
      ];
    });

    it('the functions should be called in the following order: A, B, inner-module-A and C, then inner-module-B, then onDone, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveFaster', 'asyncInjectedModuleResolveSlower', 'asyncResolveFaster', 'asyncResolveSlower')
          .after(100).add('asyncResolveSlower')
          .after(500).add('asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where first resolves, second has inner move-on module and resolves and third resolves and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveSlower', 'asyncInjectedModuleResolveSlower', 'asyncResolveFaster', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveSlower, this.f.asyncInjectedModuleResolveSlower, this.f.asyncResolveFaster],
        [this.f.asyncResolveSlower, [this.f, 'asyncInjectedModuleResolveSlower'], this.f.asyncResolveFaster],
        [[this.f, this.f.asyncResolveSlower], [this.f, this.f.asyncInjectedModuleResolveSlower, this.f.asyncResolveFaster]],
        [[this.f, this.f.asyncResolveSlower], [this.f, 'asyncInjectedModuleResolveSlower', 'asyncResolveFaster']],
        [[this.f, this.f.asyncResolveSlower, this.f.asyncInjectedModuleResolveSlower, this.f.asyncResolveFaster]],
        [[this.f, 'asyncResolveSlower', 'asyncInjectedModuleResolveSlower'], this.f.asyncResolveFaster]
      ];
    });

    it('the functions should be called in the following order: A, B, inner-module-A, C, then inner-module-B, then onDone, then onCatch, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveSlower', 'asyncInjectedModuleResolveSlower', 'asyncResolveFaster', 'asyncResolveFaster')
          .after(100).add('asyncResolveSlower')
          .after(500).add('asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three synchronous functions, where first resolves twice, second has inner move-on module and resolves and third both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveTwiceA', 'syncInjectedModuleMixedA', 'syncResolveRejectA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveTwiceA, this.f.syncInjectedModuleMixedA, this.f.syncResolveRejectA],
        [this.f.syncResolveTwiceA, [this.f, 'syncInjectedModuleMixedA'], this.f.syncResolveRejectA],
        [[this.f, this.f.syncResolveTwiceA], [this.f, this.f.syncInjectedModuleMixedA, this.f.syncResolveRejectA]],
        [[this.f, this.f.syncResolveTwiceA], [this.f, 'syncInjectedModuleMixedA', 'syncResolveRejectA']],
        [[this.f, this.f.syncResolveTwiceA, this.f.syncInjectedModuleMixedA, this.f.syncResolveRejectA]],
        [[this.f, 'syncResolveTwiceA', 'syncInjectedModuleMixedA'], this.f.syncResolveRejectA]
      ];
    });

    it('the functions should be called in the following order: A, B, inner-module-A, inner-module-B twice, C and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveTwiceA', 'syncInjectedModuleMixedA', 'syncResolveTwiceA', 'syncResolveRejectA', 'syncResolveRejectA', 'syncResolveRejectA', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where first resolves twice, second has inner move-on module and resolves and third both resolves and rejects and first executes faster than third', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceFaster', 'asyncInjectedModuleMixedA', 'asyncResolveRejectSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceFaster, this.f.asyncInjectedModuleMixedA, this.f.asyncResolveRejectSlower],
        [this.f.asyncResolveTwiceFaster, [this.f, 'asyncInjectedModuleMixedA'], this.f.asyncResolveRejectSlower],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, this.f.asyncInjectedModuleMixedA, this.f.asyncResolveRejectSlower]],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, 'asyncInjectedModuleMixedA', 'asyncResolveRejectSlower']],
        [[this.f, this.f.asyncResolveTwiceFaster, this.f.asyncInjectedModuleMixedA, this.f.asyncResolveRejectSlower]],
        [[this.f, 'asyncResolveTwiceFaster', 'asyncInjectedModuleMixedA'], this.f.asyncResolveRejectSlower]
      ];
    });

    it('the functions should be called in the following order: A, B, inner-module-A and C, then inner-module-B, then inner-module-B, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceFaster', 'asyncInjectedModuleMixedA', 'asyncResolveTwiceFaster', 'asyncResolveRejectSlower')
          .after(100).add('asyncResolveRejectSlower')
          .after(100).add('asyncResolveRejectSlower')
          .after(400).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where first resolves twice, second has inner move-on module and resolves and third both resolves and rejects and third executes faster than first', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceSlower', 'asyncInjectedModuleMixedB', 'asyncResolveRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceSlower, this.f.asyncInjectedModuleMixedB, this.f.asyncResolveRejectFaster],
        [this.f.asyncResolveTwiceSlower, [this.f, 'asyncInjectedModuleMixedB'], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, this.f.asyncInjectedModuleMixedB, this.f.asyncResolveRejectFaster]],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, 'asyncInjectedModuleMixedB', 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveTwiceSlower, this.f.asyncInjectedModuleMixedB, this.f.asyncResolveRejectFaster]],
        [[this.f, 'asyncResolveTwiceSlower', 'asyncInjectedModuleMixedB'], this.f.asyncResolveRejectFaster]
      ];
    });

    it('the functions should be called in the following order: A, B, inner-module-A and C, then inner-module-B, then inner-module-B and onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceSlower', 'asyncInjectedModuleMixedB', 'asyncResolveTwiceSlower', 'asyncResolveRejectFaster')
          .after(550).add('asyncResolveRejectFaster')
          .after(150).add('asyncResolveRejectFaster', 'syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where first resolves twice, second has inner move-on module and resolves and third both resolves and rejects and third executes a bit faster than first', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceMiddle', 'asyncInjectedModuleMixedC', 'asyncResolveRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceMiddle, this.f.asyncInjectedModuleMixedC, this.f.asyncResolveRejectFaster],
        [this.f.asyncResolveTwiceMiddle, [this.f, 'asyncInjectedModuleMixedC'], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.asyncResolveTwiceMiddle], [this.f, this.f.asyncInjectedModuleMixedC, this.f.asyncResolveRejectFaster]],
        [[this.f, this.f.asyncResolveTwiceMiddle], [this.f, 'asyncInjectedModuleMixedC', 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveTwiceMiddle, this.f.asyncInjectedModuleMixedC, this.f.asyncResolveRejectFaster]],
        [[this.f, 'asyncResolveTwiceMiddle', 'asyncInjectedModuleMixedC'], this.f.asyncResolveRejectFaster]
      ];
    });

    it('the functions should be called in the following order: A, B, inner-module-A and C, then inner-module-B, then inner-module-B, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceMiddle', 'asyncInjectedModuleMixedC', 'asyncResolveTwiceMiddle', 'asyncResolveRejectFaster')
          .after(350).add('asyncResolveRejectFaster')
          .after(100).add('asyncResolveRejectFaster')
          .after(50).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with asynchronous, asynchronous and synchronous three functions, where first resolves twice, second has inner move-on module and resolves and third both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceFaster', 'asyncInjectedModuleMixedD', 'syncResolveRejectA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceFaster, this.f.asyncInjectedModuleMixedD, this.f.syncResolveRejectA],
        [this.f.asyncResolveTwiceFaster, [this.f, 'asyncInjectedModuleMixedD'], this.f.syncResolveRejectA],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, this.f.asyncInjectedModuleMixedD, this.f.syncResolveRejectA]],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, 'asyncInjectedModuleMixedD', 'syncResolveRejectA']],
        [[this.f, this.f.asyncResolveTwiceFaster, this.f.asyncInjectedModuleMixedD, this.f.syncResolveRejectA]],
        [[this.f, 'asyncResolveTwiceFaster', 'asyncInjectedModuleMixedD'], this.f.syncResolveRejectA]
      ];
    });

    it('the functions should be called in the following order: A, B, inner-module-A and C, then inner-module-B and onDone, then inner-module-B', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceFaster', 'asyncInjectedModuleMixedD', 'asyncResolveTwiceFaster', 'syncResolveRejectA')
          .after(100).add('syncResolveRejectA', 'syncDone')
          .after(100).add('syncResolveRejectA')
          .after(5000).keep();
      });
    });
  });

  describe('with synchronous, asynchronous and asynchronous three functions, where first resolves twice, second has inner move-on module and resolves and third both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveTwiceA', 'asyncInjectedModuleMixedE', 'asyncResolveRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveTwiceA, this.f.asyncInjectedModuleMixedE, this.f.asyncResolveRejectFaster],
        [this.f.syncResolveTwiceA, [this.f, 'asyncInjectedModuleMixedE'], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.syncResolveTwiceA], [this.f, this.f.asyncInjectedModuleMixedE, this.f.asyncResolveRejectFaster]],
        [[this.f, this.f.syncResolveTwiceA], [this.f, 'asyncInjectedModuleMixedE', 'asyncResolveRejectFaster']],
        [[this.f, this.f.syncResolveTwiceA, this.f.asyncInjectedModuleMixedE, this.f.asyncResolveRejectFaster]],
        [[this.f, 'syncResolveTwiceA', 'asyncInjectedModuleMixedE'], this.f.asyncResolveRejectFaster]
      ];
    });

    it('the functions should be called in the following order: A, B, inner-module-A, inner-module-B twice and C, then onDone', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveTwiceA', 'asyncInjectedModuleMixedE', 'syncResolveTwiceA', 'asyncResolveRejectFaster', 'asyncResolveRejectFaster', 'asyncResolveRejectFaster')
          .after(150).add('syncDone')
          .after(5000).keep();
      });
    });
  });

  describe('with asynchronous, asynchronous and synchronous three functions, where first resolves twice, second has inner move-on module and resolves and third both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceMiddle', 'asyncInjectedModuleMixedF', 'syncResolveRejectA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceMiddle, this.f.asyncInjectedModuleMixedF, this.f.syncResolveRejectA],
        [this.f.asyncResolveTwiceMiddle, [this.f, 'asyncInjectedModuleMixedF'], this.f.syncResolveRejectA],
        [[this.f, this.f.asyncResolveTwiceMiddle], [this.f, this.f.asyncInjectedModuleMixedF, this.f.syncResolveRejectA]],
        [[this.f, this.f.asyncResolveTwiceMiddle], [this.f, 'asyncInjectedModuleMixedF', 'syncResolveRejectA']],
        [[this.f, this.f.asyncResolveTwiceMiddle, this.f.asyncInjectedModuleMixedF, this.f.syncResolveRejectA]],
        [[this.f, 'asyncResolveTwiceMiddle', 'asyncInjectedModuleMixedF'], this.f.syncResolveRejectA]
      ];
    });

    it('the functions should be called in the following order: A, B, inner-module-A and C, then inner-module-B and onDone, then inner-module-B', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceMiddle', 'asyncInjectedModuleMixedF', 'asyncResolveTwiceMiddle', 'syncResolveRejectA')
          .after(350).add('syncResolveRejectA', 'syncDone')
          .after(100).add('syncResolveRejectA')
          .after(5000).keep();
      });
    });
  });

  describe('with three synchronous functions, where first resolves twice, second has inner move-on module and resolves and third both resolves and rejects and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveTwiceA', 'syncInjectedModuleMixedA', 'syncResolveRejectA', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveTwiceA, this.f.syncInjectedModuleMixedA, this.f.syncResolveRejectA],
        [this.f.syncResolveTwiceA, [this.f, 'syncInjectedModuleMixedA'], this.f.syncResolveRejectA],
        [[this.f, this.f.syncResolveTwiceA], [this.f, this.f.syncInjectedModuleMixedA, this.f.syncResolveRejectA]],
        [[this.f, this.f.syncResolveTwiceA], [this.f, 'syncInjectedModuleMixedA', 'syncResolveRejectA']],
        [[this.f, this.f.syncResolveTwiceA, this.f.syncInjectedModuleMixedA, this.f.syncResolveRejectA]],
        [[this.f, 'syncResolveTwiceA', 'syncInjectedModuleMixedA'], this.f.syncResolveRejectA]
      ];
    });

    it('the functions should be called in the following order: A, B, inner-module-A, inner-module-B twice, C, onDone and onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveTwiceA', 'syncInjectedModuleMixedA', 'syncResolveTwiceA', 'syncResolveRejectA', 'syncResolveRejectA', 'syncResolveRejectA', 'syncDoneReject', 'syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where first resolves twice, second has inner move-on module and resolves and third both resolves and rejects and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceFaster', 'asyncInjectedModuleMixedA', 'asyncResolveRejectSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceFaster, this.f.asyncInjectedModuleMixedA, this.f.asyncResolveRejectSlower],
        [this.f.asyncResolveTwiceFaster, [this.f, 'asyncInjectedModuleMixedA'], this.f.asyncResolveRejectSlower],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, this.f.asyncInjectedModuleMixedA, this.f.asyncResolveRejectSlower]],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, 'asyncInjectedModuleMixedA', 'asyncResolveRejectSlower']],
        [[this.f, this.f.asyncResolveTwiceFaster, this.f.asyncInjectedModuleMixedA, this.f.asyncResolveRejectSlower]],
        [[this.f, 'asyncResolveTwiceFaster', 'asyncInjectedModuleMixedA'], this.f.asyncResolveRejectSlower]
      ];
    });

    it('the functions should be called in the following order: A, B, inner-module-A and C, then inner-module-B, then inner-module-B, then onDone, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceFaster', 'asyncInjectedModuleMixedA', 'asyncResolveTwiceFaster', 'asyncResolveRejectSlower')
          .after(100).add('asyncResolveRejectSlower')
          .after(100).add('asyncResolveRejectSlower')
          .after(400).add('asyncDoneReject')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where first resolves twice, second has inner move-on module and resolves and third both resolves and rejects and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceSlower', 'asyncInjectedModuleMixedB', 'asyncResolveRejectFaster', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceSlower, this.f.asyncInjectedModuleMixedB, this.f.asyncResolveRejectFaster],
        [this.f.asyncResolveTwiceSlower, [this.f, 'asyncInjectedModuleMixedB'], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, this.f.asyncInjectedModuleMixedB, this.f.asyncResolveRejectFaster]],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, 'asyncInjectedModuleMixedB', 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveTwiceSlower, this.f.asyncInjectedModuleMixedB, this.f.asyncResolveRejectFaster]],
        [[this.f, 'asyncResolveTwiceSlower', 'asyncInjectedModuleMixedB'], this.f.asyncResolveRejectFaster]
      ];
    });

    it('the functions should be called in the following order: A, B, inner-module-A and C, then inner-module-B, then inner-module-B and onDone, then onCatch, then onCatch', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceSlower', 'asyncInjectedModuleMixedB', 'asyncResolveTwiceSlower', 'asyncResolveRejectFaster')
          .after(550).add('asyncResolveRejectFaster')
          .after(150).add('asyncResolveRejectFaster', 'asyncDoneRejectTwice')
          .after(100).add('syncCatch')
          .after(100).add('syncCatch')
          .after(5000).keep();
      });
    });
  });

  describe('with three synchronous functions, where first resolves twice, second neither resolves nor rejects and third both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveTwiceA', 'syncVoidA', 'syncResolveRejectA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveTwiceA, this.f.syncVoidA, this.f.syncResolveRejectA],
        [this.f.syncResolveTwiceA, [this.f, 'syncVoidA'], this.f.syncResolveRejectA],
        [[this.f, this.f.syncResolveTwiceA], [this.f, this.f.syncVoidA, this.f.syncResolveRejectA]],
        [[this.f, this.f.syncResolveTwiceA], [this.f, 'syncVoidA', 'syncResolveRejectA']],
        [[this.f, this.f.syncResolveTwiceA, this.f.syncVoidA, this.f.syncResolveRejectA]],
        [[this.f, 'syncResolveTwiceA', 'syncVoidA'], this.f.syncResolveRejectA]
      ];
    });

    it('the functions should be called in the following order: A, B and C', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveTwiceA', 'syncVoidA', 'syncResolveRejectA')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions (order: 1, 2, 3), where first resolves twice, second neither resolves nor rejects and third both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceFaster', 'asyncVoidMiddle', 'asyncResolveRejectSlower', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceFaster, this.f.asyncVoidMiddle, this.f.asyncResolveRejectSlower],
        [this.f.asyncResolveTwiceFaster, [this.f, 'asyncVoidMiddle'], this.f.asyncResolveRejectSlower],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, this.f.asyncVoidMiddle, this.f.asyncResolveRejectSlower]],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, 'asyncVoidMiddle', 'asyncResolveRejectSlower']],
        [[this.f, this.f.asyncResolveTwiceFaster, this.f.asyncVoidMiddle, this.f.asyncResolveRejectSlower]],
        [[this.f, 'asyncResolveTwiceFaster', 'asyncVoidMiddle'], this.f.asyncResolveRejectSlower]
      ];
    });

    it('the functions should be called in the following order: A, B and C', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceFaster', 'asyncVoidMiddle', 'asyncResolveRejectSlower')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions (order: 3, 2, 1), where first resolves twice, second neither resolves nor rejects and third both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceSlower', 'asyncVoidMiddle', 'asyncResolveRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceSlower, this.f.asyncVoidMiddle, this.f.asyncResolveRejectFaster],
        [this.f.asyncResolveTwiceSlower, [this.f, 'asyncVoidMiddle'], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, this.f.asyncVoidMiddle, this.f.asyncResolveRejectFaster]],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, 'asyncVoidMiddle', 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveTwiceSlower, this.f.asyncVoidMiddle, this.f.asyncResolveRejectFaster]],
        [[this.f, 'asyncResolveTwiceSlower', 'asyncVoidMiddle'], this.f.asyncResolveRejectFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceSlower', 'asyncVoidMiddle', 'asyncResolveRejectFaster')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions (order: 2, 3, 1), where first resolves twice, second neither resolves nor rejects and third both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceMiddle', 'asyncVoidSlower', 'asyncResolveRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceMiddle, this.f.asyncVoidSlower, this.f.asyncResolveRejectFaster],
        [this.f.asyncResolveTwiceMiddle, [this.f, 'asyncVoidSlower'], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.asyncResolveTwiceMiddle], [this.f, this.f.asyncVoidSlower, this.f.asyncResolveRejectFaster]],
        [[this.f, this.f.asyncResolveTwiceMiddle], [this.f, 'asyncVoidSlower', 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveTwiceMiddle, this.f.asyncVoidSlower, this.f.asyncResolveRejectFaster]],
        [[this.f, 'asyncResolveTwiceMiddle', 'asyncVoidSlower'], this.f.asyncResolveRejectFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceMiddle', 'asyncVoidSlower', 'asyncResolveRejectFaster')
          .after(5000).keep();
      });
    });
  });

  describe('with asynchronous, asynchronous and synchronous three functions, where first resolves twice, second neither resolves nor rejects and third both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceFaster', 'asyncVoidSlower', 'syncResolveRejectA', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceFaster, this.f.asyncVoidSlower, this.f.syncResolveRejectA],
        [this.f.asyncResolveTwiceFaster, [this.f, 'asyncVoidSlower'], this.f.syncResolveRejectA],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, this.f.asyncVoidSlower, this.f.syncResolveRejectA]],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, 'asyncVoidSlower', 'syncResolveRejectA']],
        [[this.f, this.f.asyncResolveTwiceFaster, this.f.asyncVoidSlower, this.f.syncResolveRejectA]],
        [[this.f, 'asyncResolveTwiceFaster', 'asyncVoidSlower'], this.f.syncResolveRejectA]

      ];
    });

    it('the functions should be called in the following order: A, B and C', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceFaster', 'asyncVoidSlower', 'syncResolveRejectA')
          .after(5000).keep();
      });
    });
  });

  describe('with synchronous, synchronous and asynchronous three functions, where first resolves twice, second neither resolves nor rejects and third both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveTwiceA', 'syncVoidA', 'asyncResolveRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveTwiceA, this.f.syncVoidA, this.f.asyncResolveRejectFaster],
        [this.f.syncResolveTwiceA, [this.f, 'syncVoidA'], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.syncResolveTwiceA], [this.f, this.f.syncVoidA, this.f.asyncResolveRejectFaster]],
        [[this.f, this.f.syncResolveTwiceA], [this.f, 'syncVoidA', 'asyncResolveRejectFaster']],
        [[this.f, this.f.syncResolveTwiceA, this.f.syncVoidA, this.f.asyncResolveRejectFaster]],
        [[this.f, 'syncResolveTwiceA', 'syncVoidA'], this.f.asyncResolveRejectFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveTwiceA', 'syncVoidA', 'asyncResolveRejectFaster')
          .after(5000).keep();
      });
    });
  });

  describe('with asynchronous, synchronous and asynchronous three functions, where first resolves twice, second neither resolves nor rejects and third both resolves and rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceMiddle', 'syncVoidA', 'asyncResolveRejectFaster', 'syncDone', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceMiddle, this.f.syncVoidA, this.f.asyncResolveRejectFaster],
        [this.f.asyncResolveTwiceMiddle, [this.f, 'syncVoidA'], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.asyncResolveTwiceMiddle], [this.f, this.f.syncVoidA, this.f.asyncResolveRejectFaster]],
        [[this.f, this.f.asyncResolveTwiceMiddle], [this.f, 'syncVoidA', 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveTwiceMiddle, this.f.syncVoidA, this.f.asyncResolveRejectFaster]],
        [[this.f, 'asyncResolveTwiceMiddle', 'syncVoidA'], this.f.asyncResolveRejectFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceMiddle', 'syncVoidA', 'asyncResolveRejectFaster')
          .after(5000).keep();
      });
    });
  });

  describe('with three synchronous functions, where first resolves twice, second neither resolves nor rejects and third both resolves and rejects and synchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['syncResolveTwiceA', 'syncVoidA', 'syncResolveRejectA', 'syncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.syncResolveTwiceA, this.f.syncVoidA, this.f.syncResolveRejectA],
        [this.f.syncResolveTwiceA, [this.f, 'syncVoidA'], this.f.syncResolveRejectA],
        [[this.f, this.f.syncResolveTwiceA], [this.f, this.f.syncVoidA, this.f.syncResolveRejectA]],
        [[this.f, this.f.syncResolveTwiceA], [this.f, 'syncVoidA', 'syncResolveRejectA']],
        [[this.f, this.f.syncResolveTwiceA, this.f.syncVoidA, this.f.syncResolveRejectA]],
        [[this.f, 'syncResolveTwiceA', 'syncVoidA'], this.f.syncResolveRejectA]
      ];
    });

    it('the functions should be called in the following order: A, B and C', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('syncResolveTwiceA', 'syncVoidA', 'syncResolveRejectA')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where first resolves twice, second neither resolves nor rejects and third both resolves and rejects and asynchronous onDone rejects', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceFaster', 'asyncVoidMiddle', 'asyncResolveRejectSlower', 'asyncDoneReject', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceFaster, this.f.asyncVoidMiddle, this.f.asyncResolveRejectSlower],
        [this.f.asyncResolveTwiceFaster, [this.f, 'asyncVoidMiddle'], this.f.asyncResolveRejectSlower],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, this.f.asyncVoidMiddle, this.f.asyncResolveRejectSlower]],
        [[this.f, this.f.asyncResolveTwiceFaster], [this.f, 'asyncVoidMiddle', 'asyncResolveRejectSlower']],
        [[this.f, this.f.asyncResolveTwiceFaster, this.f.asyncVoidMiddle, this.f.asyncResolveRejectSlower]],
        [[this.f, 'asyncResolveTwiceFaster', 'asyncVoidMiddle'], this.f.asyncResolveRejectSlower]
      ];
    });

    it('the functions should be called in the following order: A, B and C', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceFaster', 'asyncVoidMiddle', 'asyncResolveRejectSlower')
          .after(5000).keep();
      });
    });
  });

  describe('with three asynchronous functions, where first resolves twice, second neither resolves nor rejects and third both resolves and rejects and asynchronous onDone rejects twice', function () {
    beforeAll(function () {
      this.spies = ['asyncResolveTwiceSlower', 'asyncVoidMiddle', 'asyncResolveRejectFaster', 'asyncDoneRejectTwice', 'syncCatch'];
      this.spy();
      this.chains = [
        [this.f.asyncResolveTwiceSlower, this.f.asyncVoidMiddle, this.f.asyncResolveRejectFaster],
        [this.f.asyncResolveTwiceSlower, [this.f, 'asyncVoidMiddle'], this.f.asyncResolveRejectFaster],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, this.f.asyncVoidMiddle, this.f.asyncResolveRejectFaster]],
        [[this.f, this.f.asyncResolveTwiceSlower], [this.f, 'asyncVoidMiddle', 'asyncResolveRejectFaster']],
        [[this.f, this.f.asyncResolveTwiceSlower, this.f.asyncVoidMiddle, this.f.asyncResolveRejectFaster]],
        [[this.f, 'asyncResolveTwiceSlower', 'asyncVoidMiddle'], this.f.asyncResolveRejectFaster]
      ];
    });

    it('the functions should be called in the following order: A, B and C', function () {
      this.looper(() => {
        new this.ChainBuilder(this)
          .add('asyncResolveTwiceSlower', 'asyncVoidMiddle', 'asyncResolveRejectFaster')
          .after(5000).keep();
      });
    });
  });
});