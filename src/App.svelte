<script>
	import { readable } from 'svelte/store';
	import { asyncReadable } from "../";
	import axios from "axios";

	const myReadable = asyncReadable({
		dataProvider: () =>
			axios.get("/example.json")
				.then((response) => response.data)
				.then((data) => new Promise(res => setTimeout(() => res(data), 1000))), // artificial timeout to see the loading status
		initialValue: null,
		storageName: "my-readable",
	});
	const { fetching } = myReadable;

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

	const timer1 = readableTimer(4);
	const timer2 = readableTimer(8);

	$: if ($timer1 === 0) {
		myReadable.setRaw([]);		
	}

	$: if ($timer2 === 0) {
		myReadable.fetch();
	}
</script>

<style>
	:global(body) {
		font-family: sans-serif;
	}
</style>

<h1>Here is the resource:</h1>
{#if $fetching}
	<div>Loading...</div>
{:else}
	<div>{JSON.stringify($myReadable)}</div>
{/if}
{#if $timer1}
	<h3>Setting custom value in: {$timer1}</h3>
{:else if $timer2}
	<h3>Fetching in: {$timer2}</h3>
{:else if !$fetching}
	<h3>Demo completed</h3>
{/if}
