var EventEmitter = process.env.L20N_COV ?
  require('../../build/cov/lib/l20n/events').EventEmitter :
  require('../../lib/l20n/events').EventEmitter;

describe('EventEmitter', function () {
  'use strict';

  // jsHint incorrectly claims function expressions on which the property
  // is accessed just after its definition doesn't require parens;
  // ignore this warning.
  /* jshint -W068 */

  var ee;
  beforeEach(function () {
    ee = new EventEmitter();
  });

  it('should add listeners', function (done) {
    var handler = function () {done();};
    ee.addEventListener('ev', handler);
    ee.emit('ev');
  });

  it('should add multiple listeners', function (done) {
    var counter = 0;
    var handler1 = function () {
      counter.should.equal(0);
      counter += 2;
    };
    var handler2 = function () {
      counter.should.equal(2);
      counter += 3;
      counter.should.equal(5);
      done();
    };
    ee.addEventListener('ev', handler1);
    ee.addEventListener('ev', handler2);
    ee.emit('ev');
  });

  it('should chain method invocations', function (done) {
    var handler1 = function () {done();};
    var handler2 = function () {done(new Error('handler2 invoked!'));};
    ee.addEventListener('ev1', handler1)
      .addEventListener('ev2', handler2);
    ee.emit('ev1');
  });

  it('should remove listeners', function (done) {
    var handler = function () {done(new Error('handler invoked!'));};
    ee.addEventListener('ev', handler);
    ee.removeEventListener('ev', handler);
    ee.emit('ev1');
    done();
  });

  it('should not remove other listeners', function (done) {
    var handler1 = function () {done(new Error('handler1 invoked!'));};
    var handler2 = function () {done(new Error('handler2 invoked!'));};
    var handler3 = function () {done();};
    ee.addEventListener('ev1', handler1);
    ee.addEventListener('ev2', handler2);
    ee.addEventListener('ev1', handler3);
    ee.removeEventListener('ev1', handler1);
    ee.emit('ev1');
  });

  it('should not throw when removing unregistered listeners', function () {
    (function () {
      var handler = function () {};
      ee.removeEventListener('ev', handler);
    }).should.not.throw();
  });

  it('should not throw when removing listeners twice', function () {
    (function () {
      var handler = function () {};
      ee.addEventListener('ev', handler);
      ee.removeEventListener('ev', handler);
      ee.removeEventListener('ev', handler);
    }).should.not.throw();
  });

  it('should invoke listeners', function () {
    var handler1 = function () {};
    var handler2 = function () {};
    var handler3 = function () {};
    ee.addEventListener('ev1', handler1);
    ee.addEventListener('ev2', handler2);
    ee.addEventListener('ev1', handler3);
    ee.emit('ev1');
  });
});
