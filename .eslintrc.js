module.exports = {
	'env': {
		'es6': true,
		'browser': true,
		'node': true,
		'es2021': true,
		'jest/globals': true,
		'cypress/globals': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:react/recommended'
	],
	'parserOptions': {
		'ecmaFeatures': {
			'jsx': true
		},
		'ecmaVersion': 12
	},
	'plugins': [
		'react', 'jest', 'cypress'
	],
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
		//		'eqeqeq': 'error',
		'no-trailing-spaces': 'error',
		'object-curly-spacing': [
			'error', 'always'
		],
		'arrow-spacing': [
			'error', { 'before': true, 'after': true }
		],
		'no-console': 0,
		'react/prop-types': 'off',
	},
	'settings': {
		'react': {
			'version': 'detect'
		}
	}
}