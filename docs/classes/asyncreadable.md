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

* [_dataProvider](asyncreadable.md#_dataprovider)
* [_mapper](asyncreadable.md#_mapper)
* [_readable](asyncreadable.md#_readable)
* [_readableRaw](asyncreadable.md#_readableraw)

### Methods

* [_getValueRaw](asyncreadable.md#_getvalueraw)
* [_setValueRaw](asyncreadable.md#_setvalueraw)
* [refresh](asyncreadable.md#refresh)
* [subscribe](asyncreadable.md#subscribe)

## Constructors

###  constructor

\+ **new AsyncReadable**(`__namedParameters`: object): *[AsyncReadable](asyncreadable.md)*

Instantiates an async readable

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`dataProvider` | function |
`initialValue` | TRaw |
`mapper` | undefined &#124; function |
`start` | undefined &#124; function |
`storageName` | undefined &#124; string |

**Returns:** *[AsyncReadable](asyncreadable.md)*

## Properties

###  _dataProvider

• **_dataProvider**: *function*

A function that returns a promise for the raw entity

#### Type declaration:

▸ (): *Promise‹TRaw›*

___

###  _mapper

• **_mapper**: *function*

A mapping function that converts the TRaw value to T

#### Type declaration:

▸ (`raw`: TRaw): *T*

**Parameters:**

Name | Type |
------ | ------ |
`raw` | TRaw |

___

###  _readable

• **_readable**: *Readable‹T›*

Readable svelte store that contains the mapped value

___

###  _readableRaw

• **_readableRaw**: *Readable‹TRaw›*

Readable store associated with the raw entity returned from the data provider

## Methods

###  _getValueRaw

▸ **_getValueRaw**(): *TRaw*

**Returns:** *TRaw*

___

###  _setValueRaw

▸ **_setValueRaw**(): *void*

**Returns:** *void*

___

###  refresh

▸ **refresh**(`temporaryValue?`: TRaw): *Promise‹void›*

Refreshes the content of this store by calling the data provider and waiting for the new value.
The store is set to the new value only if the value returned from the data provider promise is different than
the value previously stored.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`temporaryValue?` | TRaw | (optional) a value the store will contain until the data provider promise resolves  |

**Returns:** *Promise‹void›*

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
