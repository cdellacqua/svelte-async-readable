<script>
	import { readable, writable } from "svelte/store";
	import {
		persistentWritable,
		localStorageAdapter,
	} from "svelte-persistent-writable";
	import { asyncReadable } from "../";
	import axios from "axios";

	const myAsyncReadable = asyncReadable(writable(null), {
		dataProvider: () =>
			axios
				.get("/example.json")
				.then((response) => response.data)
				.then(
					(data) => new Promise((res) => setTimeout(() => res(data), 3000))
				), // artificial timeout to see the loading status
	});
	myAsyncReadable.fetch().catch(console.error);
	const { fetching: fetchingMyAsyncReadable } = myAsyncReadable;

	const myPersistentAsyncReadable = asyncReadable(
		persistentWritable(null, {
			storage: localStorageAdapter("myPersistentAsyncReadable"),
		}),
		{
			dataProvider: () =>
				axios
					.get("/example.json")
					.then((response) => response.data)
					.then(
						(data) => new Promise((res) => setTimeout(() => res(data), 3000))
					),
		}
	); // artificial timeout to see the loading status
	myPersistentAsyncReadable.fetch().catch(console.error);
	const { fetching: fetchingMyPersistentAsyncReadable } =
		myPersistentAsyncReadable;

	function readableTimer(seconds) {
		return readable(seconds, (set) => {
			let value = seconds;
			let timeout;
			function tick() {
				value--;
				set(value);
				if (value > 0) {
					timeout = setTimeout(tick, 1000);
				}
			}

			timeout = setTimeout(tick, 1000);
			return () => {
				clearTimeout(timeout);
			};
		});
	}

	const timer1 = readableTimer(6);
	const timer2 = readableTimer(12);

	$: if ($timer1 === 0) {
		myAsyncReadable.cache.set(null);
		myPersistentAsyncReadable.cache.set(null);
	}

	$: if ($timer2 === 0) {
		myAsyncReadable.fetch();
		myPersistentAsyncReadable.fetch();
	}
</script>

<h1>Async Readable Demo</h1>

<div>
	Demo progress:
	{#if $timer1}
		Setting custom value in: {$timer1}
	{:else if $timer2}
		Fetching in: {$timer2}
	{:else if !$fetchingMyAsyncReadable && !$fetchingMyPersistentAsyncReadable}
		Demo completed
	{/if}
</div>

<h2>
	myAsyncReadable
	{#if $fetchingMyAsyncReadable}
		(fetching...)
	{/if}
</h2>
<div>{JSON.stringify($myAsyncReadable)}</div>

<h2>
	myPersistentAsyncReadable
	{#if $fetchingMyPersistentAsyncReadable}
		(fetching...)
	{/if}
</h2>
<div>{JSON.stringify($myPersistentAsyncReadable)}</div>
<p>
	<i>
		Check out your localStorage in the developer tools.
		You can deduce this second store is cached by reloading the page after
		this demo has finished: while the first store will reset to null, this second store
		will have the last set value
	</i>
</p>

<style>
	:global(body) {
		font-family: sans-serif;
	}
</style>
