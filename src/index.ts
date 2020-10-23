import {
	readable, Readable, derived,
// eslint-disable-next-line import/no-extraneous-dependencies
} from 'svelte/store';
import { readable as persistentReadable } from 'svelte-persistent-store/dist/local';

/**
 * Svelte Readable Store bound to an async resource
 */
export class AsyncReadable<T, TRaw = T> implements Readable<T> {
	/**
	 * Readable store associated with the raw entity returned from the data provider
	 */
	_readableRaw: Readable<TRaw>;

	/**
	 * Readable svelte store that contains the mapped value
	 */
	_readable: Readable<T>;

	/**
	 * A function that returns a promise for the raw entity
	 */
	_dataProvider: () => Promise<TRaw>;

	/**
	 * A mapping function that converts the TRaw value to T
	 */
	_mapper: (raw: TRaw) => T;

	/**
	 * Instantiates an async readable
	 * @param config
	 * @param config.initialValue the initial value the readable store will contain
	 * @param config.dataProvider a function that returns a Promise to obtain TRaw
	 * @param config.mapper (optional) a function that converts TRaw to T
	 * @param config.storageName (optional) a string containing the key for the localStorage to cache the value contained in the store
	 * @param config.start (optional) a start function to pass to the Readable store
	 */
	constructor({
		initialValue,
		storageName,
		mapper,
		dataProvider,
		start,
	}: AsyncReadableConfig<T, TRaw>) {
		this._mapper = mapper ?? ((raw) => raw as unknown as T);
		this._dataProvider = dataProvider;

		const defaultStart = (set: (value: TRaw) => void) => {
			this._setValueRaw = set;

			const unsubscribe = start?.(set);

			this.refresh();

			return () => {
				this._setValueRaw = ()=>{};
				if (unsubscribe) {
					unsubscribe();
				}
			};
		};

		this._readableRaw = storageName ? persistentReadable(storageName, initialValue, defaultStart) : readable<TRaw>(initialValue, defaultStart);
		this._readable = derived(this._readableRaw, ($value) => this._mapper($value));
	}

	_setValueRaw: (value: TRaw) => void = ()=>{};

	_getValueRaw(): TRaw {
		let tmp: TRaw;
		this._readableRaw.subscribe((value) => { tmp = value; })();
		return tmp!;
	}

	/**
	 * Refreshes the content of this store by calling the data provider and waiting for the new value.
	 * The store is set to the new value only if the value returned from the data provider promise is different than
	 * the value previously stored.
	 * @param temporaryValue (optional) a value the store will contain until the data provider promise resolves
	 */
	async refresh(temporaryValue?: TRaw): Promise<void> {
		if (temporaryValue !== undefined) {
			this._setValueRaw(temporaryValue);
		}
		const res = await this._dataProvider();
		if (JSON.stringify(res) !== JSON.stringify(this._getValueRaw())) {
			this._setValueRaw(res);
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
}

/**
 * Instantiates an async readable
 * @param config
 * @param config.initialValue the initial value the readable store will contain
 * @param config.dataProvider a function that returns a Promise to obtain TRaw
 * @param config.mapper (optional) a function that converts TRaw to T
 * @param config.storageName (optional) a string containing the key for the localStorage to cache the value contained in the store
 * @param config.start (optional) a start function to pass to the Readable store
 */
export function asyncReadable<T, TRaw = T>(config: AsyncReadableConfig<T, TRaw>) {
	return new AsyncReadable<T, TRaw>(config);
}
