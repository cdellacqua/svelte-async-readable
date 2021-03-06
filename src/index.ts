import {
	Readable, derived, writable, Writable, get
// eslint-disable-next-line import/no-extraneous-dependencies
} from 'svelte/store';
import { writable as persistentWritable } from 'svelte-persistent-store/dist/local';

/**
 * Svelte Readable Store bound to an async resource
 */
export class AsyncReadable<T, TRaw = T> implements Readable<T> {
	/**
	 * Writable store associated with the raw entity returned by the data provider
	 */
	writableRaw: Writable<TRaw>;

	/**
	 * The decorated Readable Svelte store that contains the mapped value
	 */
	_readable: Readable<T>;

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
	 * @param config.refresh (optional) whether or not the dataProvider should be called automatically by this constructor to refresh the data, defaults to true
	 */
	constructor({
		initialValue,
		storageName,
		mapper,
		dataProvider,
		start,
		refresh,
	}: AsyncReadableConfig<T, TRaw>) {
		this.mapper = mapper ?? ((raw) => raw as unknown as T);
		this.dataProvider = dataProvider;

		const defaultStart = (set: (value: TRaw) => void) => {
			const unsubscribe = start?.(set);

			return () => {
				if (unsubscribe) {
					unsubscribe();
				}
			};
		};

		this.writableRaw = storageName ? persistentWritable<TRaw>(storageName, initialValue, defaultStart) : writable<TRaw>(initialValue, defaultStart);
		this._readable = derived(this.writableRaw, ($value) => this.mapper($value));

		if (refresh === undefined || refresh) {
			this.refresh();
		}
	}
	
	/**
	 * Assigns a new value to the writableRaw store via an update function
	 * @param updater update function that accepts the current value contained in the writableRaw store and
	 * returns the new value
	 */
	updateRaw(updater: (value: TRaw) => TRaw): void {
		this.writableRaw.update(updater);
	}

	/**
	 * Forces the value of the writableRaw store
	 * @param value the new value
	 */
	setRaw(value: TRaw): void {
		this.writableRaw.set(value);
	}

	/**
	 * Returns the current value of the writableRaw store
	 */
	getRaw(): TRaw {
		return get(this.writableRaw);
	}

	/**
	 * Returns true if the refresh function is still waiting for the promise of the dataProvider to be resolved
	 */
	isRefreshing(): boolean {
		return get(this.refreshing);
	}

	/**
	 * A writable store associated with the progress of the dataProvider. It contains true if the refresh function
	 * is waiting for the promise of the dataProvider to be resolved
	 */
	refreshing = writable<boolean>(false);

	/**
	 * Refreshes the content of this store by calling the data provider and waiting for the new value.
	 * The store is set to the new value only if the value returned from the data provider promise is different than
	 * the value previously stored.
	 * If the dataProvider throws an error and a temporaryValue was set to the store, the previous value is restored.
	 * @param temporaryValue (optional) a value the store will contain until the data provider promise resolves
	 */
	async refresh(temporaryValue?: TRaw): Promise<void> {
		if (!this.isRefreshing()) {
			this.refreshing.set(true);
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
				this.refreshing.set(false);
			}
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
	/** Whether or not the dataProvider should be called automatically by this constructor to refresh the data */
	refresh?: boolean;
}

/**
 * Instantiates an async readable
 * @param config
 * @param config.initialValue the initial value the readable store will contain
 * @param config.dataProvider a function that returns a Promise to obtain TRaw
 * @param config.mapper (optional) a function that converts TRaw to T
 * @param config.storageName (optional) a string containing the key for the localStorage to cache the value contained in the store
 * @param config.start (optional) a start function to pass to the Readable store
 * @param config.refresh (optional) whether or not the dataProvider should be called automatically by this constructor to refresh the data, defaults to true
 */
export function asyncReadable<T, TRaw = T>(config: AsyncReadableConfig<T, TRaw>) {
	return new AsyncReadable<T, TRaw>(config);
}
