import {
	Readable, writable, Writable, get
// eslint-disable-next-line import/no-extraneous-dependencies
} from 'svelte/store';

/**
 * Svelte Readable Store bound to an async resource
 */
export interface AsyncReadable<T, TCache extends Writable<T>> extends Readable<T> {
	/**
	 * Returns true if the fetch function is still waiting for the promise of the dataProvider to settle
	 */
	isFetching: () => boolean,

	/**
	 * A writable store associated with the progress of the dataProvider. It contains true if the fetch function
	 * is waiting for the promise of the dataProvider to settle
	 */
	fetching: Writable<boolean>,

	/**
	 * Updates the content of this store by calling the dataProvider and waiting for the new value.
	 * If the dataProvider throws an error and a temporaryValue was set to the store, the previous value is restored.
	 * @param force (optional, defaults to false) if set to true, the dataProvider will be called even if there is still another call awaiting
	 *              for its result. In this case, the previous call(s) will be discarded in favor of the forced one.
	 * @param temporaryValue (optional) a value the store will contain until the dataProvider promise settles
	 */
	fetch: (force?: boolean, temporaryValue?: T) => Promise<void>,

	/**
	 * Returns the writable store that was passed to the factory function "asyncReadable".
	 * Changing its value will notify all subscribers of the AsyncReadable store.
	 */
	cache: TCache,
}

export interface AsyncReadableConfig<T> {
	/**
	 * A function that returns returns a Promise<T> that resolves to the new content of this store.
	 * If the Promise rejects, the store will keep its previous value.
	 */
	dataProvider: () => Promise<T>
}

/**
 * Creates an asyncReadable store
 * @param cache a Writable store that will be used for initialization and storage purposes. (e.g. a simple writable, a store that persist its content to the localStorage, ...)
 * @param config a configuration object
 * @param config.dataProvider a function that returns a Promise<T> that resolves to the new content of this store. It the Promise rejects, the store will keep its previous value
 */
export function asyncReadable<T, TCache extends Writable<T>>(
	cache: TCache,
	{ dataProvider }: AsyncReadableConfig<T>
): AsyncReadable<T, TCache> {
	const fetching = writable(false);
	const isFetching = () => get(fetching);

	let latestRequestId: string|null = null;
	const fetch = async (force: boolean = false, temporaryValue?: T) => {
		if (isFetching() && !force) {
			return;
		}
		const requestId = performance.now().toString();
		latestRequestId = requestId;
		fetching.set(true);
		const oldValue = get(cache);
		try {
			if (temporaryValue !== undefined) {
				cache.set(temporaryValue);
			}
			const newValue = await dataProvider();
			if (latestRequestId === requestId) {
				cache.set(newValue);
			}
		} catch (err) {
			if (latestRequestId === requestId && temporaryValue !== undefined) {
				cache.set(oldValue);
			}
			throw err;
		} finally {
			if (latestRequestId === requestId) {
				fetching.set(false);
				latestRequestId = null;
			}
		}
	}

	return {
		fetch,
		fetching,
		isFetching,
		subscribe: (run) => cache.subscribe(run),
		cache,
	};
}

