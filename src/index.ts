import {
	Readable, derived, writable, Writable, get
// eslint-disable-next-line import/no-extraneous-dependencies
} from 'svelte/store';

/**
 * Svelte Readable Store bound to an async resource
 */
export class AsyncReadable<T, TRaw = T> implements Readable<T> {
	/**
	 * Writable store associated with the raw entity returned by the data provider
	 */
	writableRaw: Writable<TRaw>;

	/**
	 * The Readable Svelte store that contains the mapped value
	 */
	_readable: Readable<T>;

	/**
	 * The key to use when reading from and saving to the localStorage
	 */
	storageName: string|undefined;

	/**
	 * A function that returns a promise for the raw entity
	 */
	dataProvider: () => Promise<TRaw>;

	/**
	 * A mapping function that converts the TRaw value to T
	 */
	mapper: (raw: TRaw) => T;

	/**
	 * Instantiates an async readable. 
	 * @param config
	 * @param config.initialValue the initial value the writableRaw store will contain
	 * @param config.dataProvider a function that returns a Promise to obtain TRaw
	 * @param config.mapper (optional) a function that converts TRaw to T, defaults to the identity function (v) => v
	 * @param config.storageName (optional) a string containing the key for the localStorage to cache the value contained in the store
	 * @param config.start (optional) a start function to pass to the Readable store
	 * @param config.prefetch (optional) whether or not the dataProvider should be called automatically by this constructor to fetch the data, defaults to true
	 * @param config.resetOnInitFailure (optional) whether or not the localStorage item should be set to initialValue if an error occurs during initialization (e.g. due to invalid data), defaults to true
	 */
	constructor({
		initialValue,
		storageName,
		mapper,
		dataProvider,
		start,
		prefetch,
		resetOnInitFailure,
	}: AsyncReadableConfig<T, TRaw>) {
		const stringifiedInitialValue = JSON.stringify(initialValue);
		if (stringifiedInitialValue === undefined) {
			throw new Error('you can only use values accepted by JSON.stringify');
		}

		this.mapper = mapper ?? ((raw) => raw as unknown as T);
		this.dataProvider = dataProvider;
		this.storageName = storageName;

		if (storageName !== undefined && typeof localStorage !== "undefined") {
			let initialOrExistingValue = initialValue;
			const localStorageValue = localStorage.getItem(storageName);
			if (localStorageValue !== null) {
				try {
					initialOrExistingValue = JSON.parse(localStorageValue);
				} catch (err) {
					if (resetOnInitFailure === undefined || resetOnInitFailure) {
						localStorage.setItem(storageName, stringifiedInitialValue);
					} else {
						throw err;
					}
				}
			} else {
				localStorage.setItem(storageName, stringifiedInitialValue);
			}
			this.writableRaw = writable<TRaw>(initialOrExistingValue, start && ((set) => {
				return start((value) => {
					const stringifiedValue = JSON.stringify(value);
					if (stringifiedValue === undefined) {
						throw new Error('you can only use values accepted by JSON.stringify');
					}
					localStorage.setItem(storageName, stringifiedValue);
					set(value);
				});
			}));
		} else {
			this.writableRaw = writable<TRaw>(initialValue, start);
		}

		this._readable = derived(this.writableRaw, ($value) => this.mapper($value));

		if (prefetch === undefined || prefetch) {
			this.fetch();
		}
	}
	
	/**
	 * Assigns a new value to the writableRaw store via an update function
	 * @param updater update function that accepts the current value contained in the writableRaw store and
	 * returns the new value
	 */
	updateRaw(updater: (value: TRaw) => TRaw): void {
		this.writableRaw.update((oldValue) => {
			const newValue = updater(oldValue);
			const stringifiedValue = JSON.stringify(newValue);
			if (stringifiedValue === undefined) {
				throw new Error('you can only use values accepted by JSON.stringify');
			}
			if (this.storageName !== undefined && typeof localStorage !== "undefined") {
				localStorage.setItem(this.storageName, stringifiedValue);
			}
			return newValue;
		});
	}

	/**
	 * Forces the value of the writableRaw store
	 * @param value the new value
	 */
	setRaw(value: TRaw): void {
		const stringifiedValue = JSON.stringify(value);
		if (stringifiedValue === undefined) {
			throw new Error('you can only use values accepted by JSON.stringify');
		}
		if (this.storageName !== undefined && typeof localStorage !== "undefined") {
			localStorage.setItem(this.storageName, stringifiedValue);
		}
		this.writableRaw.set(value);
	}

	/**
	 * Returns the current value of the writableRaw store
	 */
	getRaw(): TRaw {
		return get(this.writableRaw);
	}

	/**
	 * Returns true if the fetch function is still waiting for the promise of the dataProvider to be resolved
	 */
	isFetching(): boolean {
		return get(this.fetching);
	}

	/**
	 * A writable store associated with the progress of the dataProvider. It contains true if the fetch function
	 * is waiting for the promise of the dataProvider to be settled
	 */
	fetching = writable<boolean>(false);

	/**
	 * Updates the content of this store by calling the data provider and waiting for the new value.
	 * The store is set to the new value only if the value returned from the data provider promise is different than
	 * the value previously stored.
	 * If the dataProvider throws an error and a temporaryValue was set to the store, the previous value is restored.
	 * @param temporaryValue (optional) a value the store will contain until the data provider promise resolves
	 */
	async fetch(temporaryValue?: TRaw): Promise<void> {
		if (!this.isFetching()) {
			this.fetching.set(true);
			const oldValueRaw = this.getRaw();
			try {
				if (temporaryValue !== undefined) {
					this.setRaw(temporaryValue);
				}
				const res = await this.dataProvider();
				if (JSON.stringify(res) !== JSON.stringify(this.getRaw())) {
					this.setRaw(res);
				}
			} catch (err) {
				if (temporaryValue !== undefined) {
					this.setRaw(oldValueRaw);
				}
				throw err;
			} finally {
				this.fetching.set(false);
			}
		}
	}

	/**
	 * If storageName is set, this function removes the corresponding item from the localStorage,
	 * Otherwise this function does nothing
	 */
	clear(): void {
		if (this.storageName !== undefined && typeof localStorage !== "undefined") {
			localStorage.removeItem(this.storageName);
		}
	}

	/**
	 * Subscribes to this store
	 * @param run a callback that will be executed any time the value of the store changes
	 * @param invalidate
	 */
	subscribe(run: (value: T) => void, invalidate?: (value?: T) => void): () => void {
		return this._readable.subscribe(run, invalidate);
	}
}

export interface AsyncReadableConfig<T, TRaw> {
	/** The initial value the readable store will contain */
	initialValue: TRaw,
	/** A string containing the key for the localStorage to cache the value contained in the store */
	storageName?: string,
	/** A function that converts TRaw to T */
	mapper?: (raw: TRaw) => T,
	/** A function that returns a Promise to obtain TRaw */
	dataProvider: () => Promise<TRaw>
	/** A start function to pass to the Readable store */
	start?: (set: (value: TRaw) => void) => void|(() => void),
	/** Whether or not the dataProvider should be called automatically by this constructor to fetch the data */
	prefetch?: boolean,
	/** Whether or not the localStorage item should be set to initialValue if an error occurs during initialization (e.g. due to invalid data) */
	resetOnInitFailure?: boolean,
}

/**
 * Instantiates an async readable
 * @param config
 * @param config.initialValue the initial value the readable store will contain
 * @param config.dataProvider a function that returns a Promise to obtain TRaw
 * @param config.mapper (optional) a function that converts TRaw to T
 * @param config.storageName (optional) a string containing the key for the localStorage to cache the value contained in the store
 * @param config.start (optional) a start function to pass to the Readable store
 * @param config.prefetch (optional) whether or not the dataProvider should be called automatically by this constructor to fetch the data, defaults to true
 * @param config.resetOnInitFailure (optional) whether or not the localStorage item should be set to initialValue if an error occurs during initialization (e.g. due to invalid data), defaults to true
 */
export function asyncReadable<T, TRaw = T>(config: AsyncReadableConfig<T, TRaw>) {
	return new AsyncReadable<T, TRaw>(config);
}
