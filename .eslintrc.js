module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true,
  },
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', 'prettier'],
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    babelOptions: {
      babelrc: false,
      configFile: false,
      presets: [],
    },
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
