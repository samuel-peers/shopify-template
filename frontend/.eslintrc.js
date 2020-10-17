module.exports = {
  env: {
    node: false,
    es6: true,
    mocha: true
  },
  extends: [
    "airbnb-base",
    "plugin:vue/recommended",
    "plugin:vue/essential",
    "prettier/vue",
    "prettier",
    "eslint:recommended"
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    fetch: false,
    document: false,
    module: false
  },
  overrides: [
    {
      files: ["*.test.js"],
      rules: {
        "no-unused-expressions": "off"
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: "module"
  },
  rules: {
    "max-len": ["error", { code: 80 }],
    "no-console": "off",
    "no-unused-vars": ["error", { vars: "all", args: "after-used" }],
    "implicit-arrow-linebreak": "off",
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: ["error", "always"]
  }
};
