module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    es6: true,
    node: true,
    commonjs: true,
    jest: true
  },
  extends: ['standard', 'plugin:@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: false
        },
        singleline: {
          delimiter: 'comma',
          requireLast: false
        }
      }
    ]
  }
}
