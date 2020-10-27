# svelte-async-readable

Svelte Readable Store bound to an async resource

## Full documentation:
* [AsyncReadable](https://github.com/cdellacqua/svelte-async-readable/blob/master/docs/classes/asyncreadable.md)

## Working demo:
* [App.svelte](https://github.com/cdellacqua/svelte-async-readable/blob/master/src/App.svelte)

## Highlights

###

Creates an async readable associated with a GET request:
```
const myReadable = asyncReadable({
	dataProvider: () => axios.get('/path/to/api').then((response) => response.data),
	initialValue: null,
});
```
In a Svelte component, the created AsyncReadable can be used just like any other Readable:

```
Here is the resource:
<div>{$myReadable}</div>
```

The refresh must be manually triggered (for example, after some changes to the app state)
```
myReadable.refresh();
```
You can pass a temporary value that will be assigned to the AsyncReadable (thus triggering the refresh to all subscriptions) while waiting for the new value retrived using the dataProvider. This can be useful to show a loading state
```
myReadable.refresh(null);
```