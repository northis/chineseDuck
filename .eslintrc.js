module.exports = {
  extends: "eslint:recommended",
  parser: "babel-eslint",
  env: {
    browser: false,
    es6: true,
    node: true,
    mocha: true
  },

  plugins: ["mocha"],
  rules: {
    "no-console": [
      "error",
      {
        allow: ["warn", "error", "info"]
      }
    ],
    "mocha/no-exclusive-tests": "error"
  }
};
