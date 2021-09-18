import { writable } from 'svelte/store';
import { asyncReadable } from "../src/index";

describe('constructors', function () {
	it('constructs a readable store', (done) => {
		let callCount = 0;
		function callback(value: number[]) {
			callCount++;
			if (callCount === 1) {
				expect(value).toEqual([]);
				return;
			}
			if (callCount === 2) {
				expect(value).toEqual([1,2,3]);
				done();
			}
		}

		const testAsyncReadable = asyncReadable<number[]>(writable([]), {
			dataProvider: () => new Promise((res) => {
				setTimeout(() => res([1,2,3]), 100);
			}),
		});
		testAsyncReadable.subscribe(callback);
		testAsyncReadable.fetch().catch(done);
	});
});
