import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import autoprefixer from "autoprefixer"
import { resolve } from 'path'
// import compressPlugin from 'vite-plugin-compression'
// import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import pxtorem from 'postcss-pxtorem'

export default defineConfig({
  plugins: [
    createVuePlugin(),
    // compressPlugin({
    //   ext: '.gz',
    //   deleteOriginFile: false,
    // }),
    // AutoImport({
    //   resolvers: [VantResolver()],
    // }),
    Components({
      resolvers: [VantResolver()],
    })
  ],
  base: './',
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://test.api.bentley.levsoft.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\//, ''),
      }
    }
  },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, './src') }
    ]
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: ['last 2 versions', '>1%', 'ios 7']
        }),
        pxtorem({
          rootValue: 37.5,
          propList: ['*'],
        })
      ]
    }
  }
})
