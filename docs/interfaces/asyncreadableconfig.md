[svelte-async-readable](../README.md) › [AsyncReadableConfig](asyncreadableconfig.md)

# Interface: AsyncReadableConfig <**T**>

## Type parameters

▪ **T**

## Hierarchy

* **AsyncReadableConfig**

## Index

### Properties

* [dataProvider](asyncreadableconfig.md#dataprovider)

## Properties

###  dataProvider

• **dataProvider**: *function*

A function that returns returns a Promise<T> that resolves to the new content of this store.
If the Promise rejects, the store will keep its previous value.

#### Type declaration:

▸ (): *Promise‹T›*
