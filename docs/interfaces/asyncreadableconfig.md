[svelte-async-readable](../README.md) › [AsyncReadableConfig](asyncreadableconfig.md)

# Interface: AsyncReadableConfig <**T, TRaw**>

## Type parameters

▪ **T**

▪ **TRaw**

## Hierarchy

* **AsyncReadableConfig**

## Index

### Properties

* [dataProvider](asyncreadableconfig.md#dataprovider)
* [initialValue](asyncreadableconfig.md#initialvalue)
* [mapper](asyncreadableconfig.md#optional-mapper)
* [start](asyncreadableconfig.md#optional-start)
* [storageName](asyncreadableconfig.md#optional-storagename)

## Properties

###  dataProvider

• **dataProvider**: *function*

A function that returns a Promise to obtain TRaw

#### Type declaration:

▸ (): *Promise‹TRaw›*

___

###  initialValue

• **initialValue**: *TRaw*

The initial value the readable store will contain

___

### `Optional` mapper

• **mapper**? : *undefined | function*

A function that converts TRaw to T

___

### `Optional` start

• **start**? : *undefined | function*

A start function to pass to the Readable store

___

### `Optional` storageName

• **storageName**? : *undefined | string*

A string containing the key for the localStorage to cache the value contained in the store
