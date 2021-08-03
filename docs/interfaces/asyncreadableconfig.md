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
* [refresh](asyncreadableconfig.md#optional-refresh)
* [resetOnInitFailure](asyncreadableconfig.md#optional-resetoninitfailure)
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

### `Optional` refresh

• **refresh**? : *undefined | false | true*

Whether or not the dataProvider should be called automatically by this constructor to refresh the data

___

### `Optional` resetOnInitFailure

• **resetOnInitFailure**? : *undefined | false | true*

Whether or not the localStorage item should be set to initialValue if an error occurs during initialization (e.g. due to invalid data)

___

### `Optional` start

• **start**? : *undefined | function*

A start function to pass to the Readable store

___

### `Optional` storageName

• **storageName**? : *undefined | string*

A string containing the key for the localStorage to cache the value contained in the store
