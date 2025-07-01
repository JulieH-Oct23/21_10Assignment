module.exports = {
  env: {
    browser: false,
    node: true,
    es2022: true,
    mocha: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module", // enables `import`/`export`
  },
  rules: {
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // don't warn on `next`
  },
};