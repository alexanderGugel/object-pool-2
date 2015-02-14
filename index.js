var UPDATE_MAX_ERROR = new Error('Can\'t set max to be less than inUse');

var ObjectPool = function(Constructor) {
    if (!(this instanceof ObjectPool)) return new ObjectPool(Constructor);
    this.Constructor = Constructor;
    this._inUse = [];
    this._allocatedAvailable = [];
    this._max = 10;
    this._callbackQueue = [];
};

function _schedule() {
    if (this._callbackQueue.length > 0) {
        if (this._allocatedAvailable.length > 0) {
            var callback = this._callbackQueue.shift();
            var instance = this._allocatedAvailable.shift();
            this._inUse.push(instance);
            callback.call(null, null, instance);
        } else if (this._inUse.length < this._max) {
            this._allocatedAvailable.push(new this.Constructor());
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
    var index = this._inUse.indexOf(instance);
    if (this._inUse.splice(index, 1).length > 0) {
        this._allocatedAvailable.push(instance);
        _schedule.call(this);
        return true;
    } else {
        return false;
    }
};

Object.defineProperties(ObjectPool.prototype, {
    inUse: {
        get: function() {
            return this._inUse.length;
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
            while (maxAllocatedAvailable < this._allocatedAvailable.length) {
                this._allocatedAvailable.pop();
            }
        }
    }

});

module.exports = ObjectPool;

