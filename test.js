var ObjectPool = require('./');
var test = require('tape');

var i;
function Constructor() {
    this.i = i++;
}

test('single synchronous instance allocation', function(t) {
    i = 0;
    t.plan(4);
    var op = ObjectPool(Constructor);
    op.allocate(function (error, instance) {
        t.ok(instance instanceof Constructor);
        t.equal(instance.i, 0);
        t.equal(op.inUse, 1);
        t.equal(op.available, 9);
    });
});

test('multiple synchronous instance allocations', function(t) {
    i = 0;
    t.plan(8);
    var op = ObjectPool(Constructor);
    op.allocate(function (error, instance) {
        t.ok(instance instanceof Constructor);
        t.equal(instance.i, 0);
        t.equal(op.inUse, 1);
        t.equal(op.available, 9);
    });
    op.allocate(function (error, instance) {
        t.ok(instance instanceof Constructor);
        t.equal(instance.i, 1);
        t.equal(op.inUse, 2);
        t.equal(op.available, 8);
    });
});

test('multiple asynchronous instance allocations', function(t) {
    i = 0;
    t.plan(1);
    var op = ObjectPool(Constructor);
    op.max = 1;
    var instance1 = null;
    var instance2 = null;
    op.allocate(function(error, instance) {
        instance1 = instance;
    });
    op.allocate(function(error, instance) {
        instance2 = instance;
        t.equal(instance1, instance2);
    });
    op.deallocate(instance1);
});
