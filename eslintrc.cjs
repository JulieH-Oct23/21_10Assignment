module.exports = {
  env: {
    browser: true,
    node: true,
    es2022: true,
    mocha: true, // ✅ This is the key part: tells ESLint to expect describe/it/etc.
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};
