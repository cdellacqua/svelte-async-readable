[svelte-async-readable](README.md)

# svelte-async-readable

## Index

### Interfaces

* [AsyncReadable](interfaces/asyncreadable.md)
* [AsyncReadableConfig](interfaces/asyncreadableconfig.md)

### Functions

* [asyncReadable](README.md#asyncreadable)

## Functions

###  asyncReadable

▸ **asyncReadable**<**T**, **TCache**>(`cache`: TCache, `__namedParameters`: object): *[AsyncReadable](interfaces/asyncreadable.md)‹T, TCache›*

Creates an asyncReadable store

**Type parameters:**

▪ **T**

▪ **TCache**: *Writable‹T›*

**Parameters:**

▪ **cache**: *TCache*

a Writable store that will be used for initialization and storage purposes. (e.g. a simple writable, a store that persist its content to the localStorage, ...)

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`dataProvider` | function |

**Returns:** *[AsyncReadable](interfaces/asyncreadable.md)‹T, TCache›*
