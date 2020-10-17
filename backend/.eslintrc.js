module.exports = {
  env: {
    node: true,
    es6: true,
    mocha: true,
  },
  extends: ['airbnb-base', 'prettier', 'eslint:recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    fetch: false,
    document: false,
  },
  overrides: [
    {
      files: ['*.test.js'],
      rules: {
        'no-unused-expressions': 'off',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  rules: {
    'max-len': ['error', { code: 80 }],
    'no-console': 'off',
    'implicit-arrow-linebreak': 'off',
    'linebreak-style': ['error', 'unix'],
  },
};
