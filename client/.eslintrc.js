module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    "cypress/globals": true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "cypress"],
  rules: {
    "no-unused-vars": "warn",
    "react/prop-types": 0,
  },
};
