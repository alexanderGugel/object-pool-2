# object-pool-2

A constructor specific object pool implementation for asynchronous recycling of object allocations.

## Installation

```
npm install object-pool-2 --save
```

## Usage

### `var objectPool = require('object-pool-2')(Constructor);`

Creates a new object pool. Accepts an `Constructor` which will be used internally in order to instantiate new `Constructor` instances (via `new Constructor`).

### `objectPool.allocate(callback)`

Asynchronous. Allocates a new `Constructor` instance. This either results into a new instance being created or a previously deallocated instance being reused.

### `objectPool.deallocate()`

Deallocates a allocated `Constructor` instance. This enables the object to be reused if needed.

### `objectPool.max = 10`

Maximum number of internally managed `Constructor` instances. Defaults to 10. Will throw an error if `max` < `inUse`.

### `objectPool.available`

Read-only. Number of available, but not necessarily allocated, `Constructor` instances.

### `objectPool.inUse`

Read-only. Number of internally managed allocated (therefore not de-allocated) `Constructor` instances.

## License

ISC
