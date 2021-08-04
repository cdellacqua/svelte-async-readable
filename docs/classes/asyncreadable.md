[svelte-async-readable](../README.md) › [AsyncReadable](asyncreadable.md)

# Class: AsyncReadable <**T, TRaw**>

Svelte Readable Store bound to an async resource

## Type parameters

▪ **T**

▪ **TRaw**

## Hierarchy

* **AsyncReadable**

## Implements

* Readable‹T›

## Index

### Constructors

* [constructor](asyncreadable.md#constructor)

### Properties

* [_readable](asyncreadable.md#_readable)
* [dataProvider](asyncreadable.md#dataprovider)
* [fetching](asyncreadable.md#fetching)
* [mapper](asyncreadable.md#mapper)
* [storageName](asyncreadable.md#storagename)
* [writableRaw](asyncreadable.md#writableraw)

### Methods

* [clear](asyncreadable.md#clear)
* [fetch](asyncreadable.md#fetch)
* [getRaw](asyncreadable.md#getraw)
* [isFetching](asyncreadable.md#isfetching)
* [setRaw](asyncreadable.md#setraw)
* [subscribe](asyncreadable.md#subscribe)
* [updateRaw](asyncreadable.md#updateraw)

## Constructors

###  constructor

\+ **new AsyncReadable**(`__namedParameters`: object): *[AsyncReadable](asyncreadable.md)*

Instantiates an async readable.

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`dataProvider` | function |
`initialValue` | TRaw |
`mapper` | undefined &#124; function |
`prefetch` | undefined &#124; false &#124; true |
`resetOnInitFailure` | undefined &#124; false &#124; true |
`start` | undefined &#124; function |
`storageName` | undefined &#124; string |

**Returns:** *[AsyncReadable](asyncreadable.md)*

## Properties

###  _readable

• **_readable**: *Readable‹T›*

The Readable Svelte store that contains the mapped value

___

###  dataProvider

• **dataProvider**: *function*

A function that returns a promise for the raw entity

#### Type declaration:

▸ (): *Promise‹TRaw›*

___

###  fetching

• **fetching**: *Writable‹boolean›* = writable<boolean>(false)

A writable store associated with the progress of the dataProvider. It contains true if the fetch function
is waiting for the promise of the dataProvider to be settled

___

###  mapper

• **mapper**: *function*

A mapping function that converts the TRaw value to T

#### Type declaration:

▸ (`raw`: TRaw): *T*

**Parameters:**

Name | Type |
------ | ------ |
`raw` | TRaw |

___

###  storageName

• **storageName**: *string | undefined*

The key to use when reading from and saving to the localStorage

___

###  writableRaw

• **writableRaw**: *Writable‹TRaw›*

Writable store associated with the raw entity returned by the data provider

## Methods

###  clear

▸ **clear**(): *void*

If storageName is set, this function removes the corresponding item from the localStorage,
Otherwise this function does nothing

**Returns:** *void*

___

###  fetch

▸ **fetch**(`temporaryValue?`: TRaw): *Promise‹void›*

Updates the content of this store by calling the data provider and waiting for the new value.
The store is set to the new value only if the value returned from the data provider promise is different than
the value previously stored.
If the dataProvider throws an error and a temporaryValue was set to the store, the previous value is restored.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`temporaryValue?` | TRaw | (optional) a value the store will contain until the data provider promise resolves  |

**Returns:** *Promise‹void›*

___

###  getRaw

▸ **getRaw**(): *TRaw*

Returns the current value of the writableRaw store

**Returns:** *TRaw*

___

###  isFetching

▸ **isFetching**(): *boolean*

Returns true if the fetch function is still waiting for the promise of the dataProvider to be resolved

**Returns:** *boolean*

___

###  setRaw

▸ **setRaw**(`value`: TRaw): *void*

Forces the value of the writableRaw store

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | TRaw | the new value  |

**Returns:** *void*

___

###  subscribe

▸ **subscribe**(`run`: function, `invalidate?`: undefined | function): *function*

Subscribes to this store

**Parameters:**

▪ **run**: *function*

a callback that will be executed any time the value of the store changes

▸ (`value`: T): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |

▪`Optional`  **invalidate**: *undefined | function*

**Returns:** *function*

▸ (): *void*

___

###  updateRaw

▸ **updateRaw**(`updater`: function): *void*

Assigns a new value to the writableRaw store via an update function

**Parameters:**

▪ **updater**: *function*

update function that accepts the current value contained in the writableRaw store and
returns the new value

▸ (`value`: TRaw): *TRaw*

**Parameters:**

Name | Type |
------ | ------ |
`value` | TRaw |

**Returns:** *void*
