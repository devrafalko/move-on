/* global beforeAll */
import move from './../../src/move-on.js';

beforeAll(function () {
  this.f = {
    order: [],
    syncResolveA: function (resolve) {
      this.order.push('syncResolveA');
      resolve();
    },
    syncResolveB: function (resolve) {
      this.order.push('syncResolveB');
      resolve();
    },
    syncResolveTwiceA: function (resolve) {
      this.order.push('syncResolveTwiceA');
      resolve();
      resolve();
    },
    syncResolveTwiceB: function (resolve) {
      this.order.push('syncResolveTwiceB');
      resolve();
      resolve();
    },
    syncResolveTwiceC: function (resolve) {
      this.order.push('syncResolveTwiceC');
      resolve();
      resolve();
    },
    syncRejectA: function (resolve, reject) {
      this.order.push('syncRejectA');
      reject();
    },
    syncRejectB: function (resolve, reject) {
      this.order.push('syncRejectB');
      reject();
    },
    syncRejectTwice: function (resolve, reject) {
      this.order.push('syncRejectTwice');
      reject();
      reject();
    },
    syncResolveRejectA: function (resolve, reject) {
      this.order.push('syncResolveRejectA');
      resolve();
      reject();
    },
    syncResolveRejectB: function (resolve, reject) {
      this.order.push('syncResolveRejectB');
      resolve();
      reject();
    },
    syncResolveRejectC: function (resolve, reject) {
      this.order.push('syncResolveRejectC');
      resolve();
      reject();
    },
    syncRejectResolveA: function (resolve, reject) {
      this.order.push('syncRejectResolveA');
      reject();
      resolve();
    },
    syncRejectResolveB: function (resolve, reject) {
      this.order.push('syncRejectResolveB');
      reject();
      resolve();
    },
    syncRejectResolveC: function (resolve, reject) {
      this.order.push('syncRejectResolveC');
      reject();
      resolve();
    },
    syncVoidA: function () {
      this.order.push('syncVoidA');
    },
    syncVoidB: function () {
      this.order.push('syncVoidB');
    },
    syncInjectedModuleResolve: function (resolve, reject) {
      this.order.push('syncInjectedModuleResolve');
      move([this.syncResolveA, this.syncResolveB], this.config, resolve, reject);
    },
    syncInjectedModuleReject: function (resolve, reject) {
      this.order.push('syncInjectedModuleReject');
      move([this.syncResolveA, this.syncResolveB, this.syncRejectA], this.config, resolve, reject);
    },
    syncInjectedModuleMixedA: function (resolve, reject) {
      this.order.push('syncInjectedModuleMixedA');
      move([this.syncResolveTwiceA, this.syncResolveRejectA], this.config, resolve, reject);
    },
    asyncResolveFaster: function (resolve) {
      this.order.push('asyncResolveFaster');
      setTimeout(resolve, 100);
    },
    asyncResolveMiddle: function (resolve) {
      this.order.push('asyncResolveMiddle');
      setTimeout(resolve, 350);
    },
    asyncResolveSlower: function (resolve) {
      this.order.push('asyncResolveSlower');
      setTimeout(resolve, 500);
    },
    asyncResolveTwiceFaster: function (resolve) {
      this.order.push('asyncResolveTwiceFaster');
      setTimeout(resolve, 100);
      setTimeout(resolve, 200);
    },
    asyncResolveTwiceMiddle: function (resolve) {
      this.order.push('asyncResolveTwiceMiddle');
      setTimeout(resolve, 350);
      setTimeout(resolve, 450);
    },
    asyncResolveTwiceSlower: function (resolve) {
      this.order.push('asyncResolveTwiceSlower');
      setTimeout(resolve, 550);
      setTimeout(resolve, 700);
    },
    asyncRejectFaster: function (resolve, reject) {
      this.order.push('asyncRejectFaster');
      setTimeout(reject, 100);
    },
    asyncRejectSlower: function (resolve, reject) {
      this.order.push('asyncRejectSlower');
      setTimeout(reject, 500);
    },
    asyncRejectTwiceSlower: function (resolve, reject) {
      this.order.push('asyncRejectTwiceSlower');
      setTimeout(reject, 650);
      setTimeout(reject, 750);
    },
    asyncRejectTwiceFaster: function (resolve, reject) {
      this.order.push('asyncRejectTwiceFaster');
      setTimeout(reject, 50);
      setTimeout(reject, 200);
    },
    asyncResolveRejectSlower: function (resolve, reject) {
      this.order.push('asyncResolveRejectSlower');
      setTimeout(resolve, 500);
      setTimeout(reject, 600);
    },
    asyncResolveRejectMiddle: function (resolve, reject) {
      this.order.push('asyncResolveRejectMiddle');
      setTimeout(resolve, 400);
      setTimeout(reject, 450);
    },
    asyncResolveRejectFaster: function (resolve, reject) {
      this.order.push('asyncResolveRejectFaster');
      setTimeout(resolve, 150);
      setTimeout(reject, 300);
    },
    asyncRejectResolveFaster: function (resolve, reject) {
      this.order.push('asyncRejectResolveFaster');
      setTimeout(reject, 100);
      setTimeout(resolve, 300);
    },
    asyncRejectResolveMiddle: function (resolve, reject) {
      this.order.push('asyncRejectResolveMiddle');
      setTimeout(reject, 350);
      setTimeout(resolve, 450);
    },
    asyncRejectResolveSlower: function (resolve, reject) {
      this.order.push('asyncRejectResolveSlower');
      setTimeout(reject, 450);
      setTimeout(resolve, 650);
    },
    asyncVoidSlower: function () {
      this.order.push('asyncVoidSlower');
      setTimeout(() => { }, 550);
    },
    asyncVoidMiddle: function () {
      this.order.push('asyncVoidMiddle');
      setTimeout(() => { }, 350);
    },
    asyncVoidFaster: function () {
      this.order.push('asyncVoidFaster');
      setTimeout(() => { }, 50);
    },
    asyncInjectedModuleResolveFaster: function (resolve, reject) {
      this.order.push('asyncInjectedModuleResolveFaster');
      move([this.asyncResolveFaster], this.config, resolve, reject);
    },
    asyncInjectedModuleResolveSlower: function (resolve, reject) {
      this.order.push('asyncInjectedModuleResolveSlower');
      move([this.asyncResolveFaster, this.asyncResolveSlower], this.config, resolve, reject);
    },
    asyncInjectedModuleResolveA: function (resolve, reject) {
      this.order.push('asyncInjectedModuleResolveA');
      move([this.asyncResolveMiddle, this.asyncResolveFaster], this.config, resolve, reject);
    },
    asyncInjectedModuleResolveB: function (resolve, reject) {
      this.order.push('asyncInjectedModuleResolveB');
      move([this.asyncResolveFaster, this.syncResolveA], this.config, resolve, reject);
    },
    asyncInjectedModuleResolveC: function (resolve, reject) {
      this.order.push('asyncInjectedModuleResolveC');
      move([this.syncResolveA, this.asyncResolveMiddle], this.config, resolve, reject);
    },
    asyncInjectedModuleRejectFaster: function (resolve, reject) {
      this.order.push('asyncInjectedModuleRejectFaster');
      move([this.asyncResolveFaster, this.asyncRejectFaster], this.config, resolve, reject);
    },
    asyncInjectedModuleRejectSlower: function (resolve, reject) {
      this.order.push('asyncInjectedModuleRejectSlower');
      move([this.asyncResolveFaster, this.asyncResolveSlower, this.asyncRejectSlower], this.config, resolve, reject);
    },
    asyncInjectedModuleMixedA: function (resolve, reject) {
      this.order.push('asyncInjectedModuleMixedA');
      move([this.asyncResolveTwiceFaster, this.asyncResolveRejectSlower], this.config, resolve, reject);
    },
    asyncInjectedModuleMixedB: function (resolve, reject) {
      this.order.push('asyncInjectedModuleMixedB');
      move([this.asyncResolveTwiceSlower, this.asyncResolveRejectFaster], this.config, resolve, reject);
    },
    asyncInjectedModuleMixedC: function (resolve, reject) {
      this.order.push('asyncInjectedModuleMixedC');
      move([this.asyncResolveTwiceMiddle, this.asyncResolveRejectFaster], this.config, resolve, reject);
    },
    asyncInjectedModuleMixedD: function (resolve, reject) {
      this.order.push('asyncInjectedModuleMixedD');
      move([this.asyncResolveTwiceFaster, this.syncResolveRejectA], this.config, resolve, reject);
    },
    asyncInjectedModuleMixedE: function (resolve, reject) {
      this.order.push('asyncInjectedModuleMixedE');
      move([this.syncResolveTwiceA, this.asyncResolveRejectFaster], this.config, resolve, reject);
    },
    asyncInjectedModuleMixedF: function (resolve, reject) {
      this.order.push('asyncInjectedModuleMixedF');
      move([this.asyncResolveTwiceMiddle, this.syncResolveRejectA], this.config, resolve, reject);
    },
    syncDone: function () {
      this.order.push('syncDone');
    },
    syncDoneReject: function (reject) {
      this.order.push('syncDoneReject');
      reject();
    },
    asyncDoneReject: function (reject) {
      this.order.push('asyncDoneReject');
      setTimeout(reject, 100);
    },
    asyncDoneRejectTwice: function (reject) {
      this.order.push('asyncDoneRejectTwice');
      setTimeout(reject, 100);
      setTimeout(reject, 200);
    },
    syncCatch: function () {
      this.order.push('syncCatch');
    }
  };
});