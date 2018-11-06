module.exports = {
  root: true,

  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
  ],

  // add your custom rules here
  rules: {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

    'import/prefer-default-export': 0,
    'import/no-named-as-default': 0,
    'arrow-parens': 0,
    'no-var': 2,
    'no-multi-spaces': 2,
    'keyword-spacing': 2,
    'space-before-blocks': 2,
    'semi': [2, "never"],
    'camelcase': 0,
    'arrow-body-style': 0,
    'max-len': 0,
    'no-param-reassign': 0,
  },

  parserOptions: {
    parser: 'babel-eslint'
  },
}
