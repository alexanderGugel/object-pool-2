var UPDATE_MAX_ERROR = new Error('Can\'t set max to be less than allocated');

var ObjectPool = function(Constructor) {
    if (!(this instanceof ObjectPool)) return new ObjectPool(Constructor);
    this._Constructor = Constructor;
    this.reset();
};

function _schedule() {
    if (this._callbackQueue.length > 0) {
        if (this._deallocated.length > 0) {
            var callback = this._callbackQueue.shift();
            var instance = this._deallocated.shift();
            this._allocated.push(instance);
            callback.call(null, null, instance);
        } else if (this._allocated.length < this._max) {
            this._deallocated.push(new this._Constructor());
            _schedule.call(this);
        }
    }
}

ObjectPool.prototype.allocate = function(callback) {
    this._callbackQueue.push(callback);
    _schedule.call(this);
    return this;
};

ObjectPool.prototype.deallocate = function(instance) {
    var index = this._allocated.indexOf(instance);
    if (this._allocated.splice(index, 1).length > 0) {
        this._deallocated.push(instance);
        _schedule.call(this);
        return true;
    } else {
        return false;
    }
};

ObjectPool.prototype.reset = function(max) {
    this._allocated = [];
    this._deallocated = [];
    this._max = max || 10;
    this._callbackQueue = [];
};

Object.defineProperties(ObjectPool.prototype, {
    inUse: {
        get: function() {
            return this._allocated.length;
        }
    },
    available: {
        get: function() {
            return this.max - this.inUse;
        }
    },
    max: {
        get: function() {
            return this._max;
        },
        set: function(max) {
            if (this.inUse > max) {
                throw UPDATE_MAX_ERROR;
            }
            this._max = max;
            var maxAllocatedAvailable = max - this.inUse;
            while (maxAllocatedAvailable < this._deallocated.length) {
                this._deallocated.pop();
            }
        }
    }

});

module.exports = ObjectPool;

