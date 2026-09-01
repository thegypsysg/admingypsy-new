const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer('terser').tap((args) => {
        if (args[0] && args[0].terserOptions) {
          args[0].terserOptions.compress = {
            ...args[0].terserOptions.compress,
            drop_console: true,
            drop_debugger: true,
          };
        }
        return args;
      });
    }
  },
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 10,
        cacheGroups: {
          vuetify: {
            name: 'chunk-vuetify',
            test: /[\\/]node_modules[\\/]vuetify[\\/]/,
            priority: 20,
            reuseExistingChunk: true,
          },
          vendor: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      },
    },
  },
  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
});
