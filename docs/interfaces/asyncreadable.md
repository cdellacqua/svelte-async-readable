[svelte-async-readable](../README.md) › [AsyncReadable](asyncreadable.md)

# Interface: AsyncReadable <**T, TCache**>

Svelte Readable Store bound to an async resource

## Type parameters

▪ **T**

▪ **TCache**: *Writable‹T›*

## Hierarchy

* Readable‹T›

  ↳ **AsyncReadable**

## Index

### Properties

* [cache](asyncreadable.md#cache)
* [fetch](asyncreadable.md#fetch)
* [fetching](asyncreadable.md#fetching)
* [isFetching](asyncreadable.md#isfetching)

### Methods

* [subscribe](asyncreadable.md#subscribe)

## Properties

###  cache

• **cache**: *TCache*

Returns the writable store that was passed to the factory function "asyncReadable".
Changing its value will notify all subscribers of the AsyncReadable store.

___

###  fetch

• **fetch**: *function*

Updates the content of this store by calling the dataProvider and waiting for the new value.
If the dataProvider throws an error and a temporaryValue was set to the store, the previous value is restored.

**`param`** (optional, defaults to false) if set to true, the dataProvider will be called even if there is still another call awaiting
             for its result. In this case, the previous call(s) will be discarded in favor of the forced one.

**`param`** (optional) a value the store will contain until the dataProvider promise settles

#### Type declaration:

▸ (`force?`: undefined | false | true, `temporaryValue?`: T): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`force?` | undefined &#124; false &#124; true |
`temporaryValue?` | T |

___

###  fetching

• **fetching**: *Writable‹boolean›*

A writable store associated with the progress of the dataProvider. It contains true if the fetch function
is waiting for the promise of the dataProvider to settle

___

###  isFetching

• **isFetching**: *function*

Returns true if the fetch function is still waiting for the promise of the dataProvider to settle

#### Type declaration:

▸ (): *boolean*

## Methods

###  subscribe

▸ **subscribe**(`this`: void, `run`: Subscriber‹T›, `invalidate?`: Invalidator‹T›): *Unsubscriber*

*Inherited from [AsyncReadable](asyncreadable.md).[subscribe](asyncreadable.md#subscribe)*

Subscribe on value changes.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`this` | void | - |
`run` | Subscriber‹T› | subscription callback |
`invalidate?` | Invalidator‹T› | cleanup callback  |

**Returns:** *Unsubscriber*
