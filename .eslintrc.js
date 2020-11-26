module.exports = {
  plugins: ['prettier'],
  extends: ['eslint-config-airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2019,
  },
  env: {
    node: true,
    jest: true,
  },
};
