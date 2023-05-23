const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  // devServer: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://admin1.the-gypsy.sg',
  //       changeOrigin: true,
  //       secure: false,
  //       pathRewrite: { '^/api': '/api' },
  //     },
  //   },
  // },
  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
});
