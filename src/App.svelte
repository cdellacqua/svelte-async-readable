<script>
	import { readable } from 'svelte/store';
	import { asyncReadable } from "../";
	import axios from "axios";

	const myReadable = asyncReadable({
		dataProvider: () =>
			axios.get("/example.json").then((response) => response.data),
		initialValue: null,
		storageName: "my-readable",
	});

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
		myReadable._setValueRaw([]);		
	}

	$: if ($timer2 === 0) {
		myReadable.refresh();
	}
</script>

<style>
	:global(body) {
		font-family: sans-serif;
	}
</style>

<h1>Here is the resource:</h1>
<div>{JSON.stringify($myReadable)}</div>
{#if $timer1}
	<h3>Setting custom value in: {$timer1}</h3>
{:else if $timer2}
	<h3>Refreshing in: {$timer2}</h3>
{:else}
	<h3>Demo completed</h3>
{/if}
