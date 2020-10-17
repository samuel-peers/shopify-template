module.exports = {
  env: {
    node: true,
    es6: true,
    mocha: true,
  },
  extends: ["airbnb-base", "eslint:recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    fetch: false,
    document: false,
  },
  overrides: [
    {
      files: ["*.test.js"],
      rules: {
        "no-unused-expressions": "off",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  rules: {
    "max-len": ["error", { code: 80 }],
    "no-console": "off",
    "no-unused-vars": ["error", { vars: "all", args: "after-used" }],
    "implicit-arrow-linebreak": "off",
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: ["error", "always"],
  },
};
