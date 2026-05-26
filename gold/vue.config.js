const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/',
  configureWebpack: {
    plugins: [
      // Silence Vue esm-bundler feature-flag warning and enable tree-shaking hints.
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
        // تغییر آدرس API برای تست به localhost
        'process.env.VUE_APP_API_URL': JSON.stringify('http://localhost:8701')
      }),
    ],
  },
  pwa: {
    name: 'gold',
    themeColor: '#FBBF24',
    msTileColor: '#000000',
    manifestOptions: {
      short_name: 'gold',
      background_color: '#ffffff'
    },
    workboxOptions: {
    
    }
  }
})
