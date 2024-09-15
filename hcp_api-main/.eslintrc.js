module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'object-curly-newline': 'off', // disable this to avoid formatting issue
    camelcase: 'off',
    'no-underscore-dangle': 'off',
    'linebreak-style': 'off',
    'consistent-return': 'off',
    'operator-linebreak': 'off',
    'max-lines-per-function': ['error', 100],
    'no-console': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off',
    'no-prototype-builtins': 'off',
  },
};
