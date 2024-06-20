import pluginJs from '@eslint/js';
import perfectionist from 'eslint-plugin-perfectionist';
import pluginSolid from 'eslint-plugin-solid';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		plugins: {
			solid: pluginSolid.configs['flat/typescript'],
		},
	},
	{
		plugins: {
			perfectionist,
		},
		rules: {
			'perfectionist/sort-imports': [
				'error',
				{
					type: 'natural',
					order: 'asc',
					groups: [
						'type',
						'solid',
						['builtin', 'external'],
						'internal-type',
						'internal',
						['parent-type', 'sibling-type', 'index-type'],
						['parent', 'sibling', 'index'],
						'side-effect',
						'style',
						'object',
						'unknown',
					],
					'custom-groups': {
						value: {
							solid: 'solid-js',
						},
					},
					'newlines-between': 'always',
					'internal-pattern': ['@/**'],
				},
			],
		},
	},
	{
		ignores: ['node_modules', 'dist'],
	},
];
