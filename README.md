# svelte-async-readable

Svelte Readable Store bound to an async resource


[NPM Package](https://www.npmjs.com/package/svelte-async-readable)

`npm install svelte-async-readable`

## Full documentation:
* [AsyncReadable](https://github.com/cdellacqua/svelte-async-readable/blob/master/docs/classes/asyncreadable.md)

## Working demo:
* [App.svelte](https://github.com/cdellacqua/svelte-async-readable/blob/master/src/App.svelte)

You can clone this repo and run `npm run dev` to see it working

## Highlights

Create an async readable associated with a GET request:
```js
const myReadable = asyncReadable(writable(null), {
	dataProvider: () => axios.get('/path/to/api').then((response) => response.data),
});
myReadable.fetch().catch(() => console.error('ops, something went wrong'));
```
In a Svelte component, the created AsyncReadable can be used just like any other Readable:

```html
Here is the resource:
<div>{$myReadable}</div>
```

A useful nested store named `fetching` is provided. It can be used, for example, to show a loading state:
```html
<script>
	const myReadable = asyncReadable(...); // Initialized in some way
	myReadable
		.fetch()
		.catch(() => console.log('ops, something went wrong')); // Start fetching asynchronously (don't forget, Promises always come with a catch!)
	const { fetching } = myReadable; // Extracts the fetching store
</script>
{#if $fetching}
	Loading...
{:else}
	Here is the resource:
	<div>{$myReadable}</div>
{/if}

```

The fetch must be manually triggered (for example, after some changes to the app state)
```js
myReadable.fetch();
```
You can pass a temporary value that will be assigned to the AsyncReadable to notify all subscribers while waiting for the new value that will be retrieved using the dataProvider. This also can be useful to show a loading/intermediate state
```js
myReadable.fetch(null);
```

## Persisting data

AsyncReadable can be used with any store as its cache, this means that you can take advantage of libraries such as [svelte-persistent-writable](https://www.npmjs.com/package/svelte-persistent-writable) or
[svelte-persistent-store](https://www.npmjs.com/package/svelte-persistent-store) (and many more) to delegate the persistence logic.

As an example, the following code uses `svelte-persistent-writable` as a storage mechanism:
```js
import { persistentWritable, localStorageAdapter } from 'svelte-persistent-writable';
import { asyncReadable } from 'svelte-async-readable';

export const myAsyncReadable = asyncReadable(
	persistentWritable(null, { storage: localStorageAdapter('myAsyncReadable') }),
	{ dataProvider: () => axios.get('/path/to/api').then((response) => response.data) }
);

myAsyncReadable.fetch().catch(() => console.error('oops...'));
```