import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

const external = [
	...Object.keys(pkg.devDependencies || {}),
	...Object.keys(pkg.peerDependencies || {}),
	...Object.keys(pkg.dependencies || {})
];

export default [
	{
		input: 'src/index.ts',
		external,
		plugins: [
			typescript()
		],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		]
	}
];
