module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    "@nuxtjs"
  ],
  // add your custom rules here
  rules: {
    'no-trailing-spaces': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'semi': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'no-console': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'vue/no-v-html': 'off'
  }
}
