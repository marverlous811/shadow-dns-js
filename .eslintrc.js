module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
  },
  parserOptions: {
    ecmaVersion: 9,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-param-reassign': [
      2,
      {
        props: true,
        ignorePropertyModificationsFor: ['ctx', 'state'],
      },
    ],
    'no-unused-vars': 'off',
  },
}
