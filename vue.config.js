/*
 * @Author: your name
 * @Date: 2021-07-09 10:19:17
 * @LastEditTime: 2021-08-11 10:45:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \quality-defense-initiative\vue.config.js
 */
const path = require('path')

const isProd = process.env.NODE_ENV === 'production'

function resolve (dir) {
  return path.resolve(__dirname, dir)
}
module.exports = {
  lintOnSave: false,
  runtimeCompiler: false, // 是否使用包含运行时编译器的Vue核心的构建

  productionSourceMap: false,

  filenameHashing: true,
  parallel: require('os').cpus().length > 1,

  configureWebpack: config => {
    if (isProd) {
      // const BundleAnalyzePlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
      const CompressionWebpackPlugin = require('compression-webpack-plugin')
      // 配置webpack 压缩
      config.plugins.push(
        new CompressionWebpackPlugin({
          test: /\.js$|\.html$|\.css$/,
          // 超过1kb压缩
          threshold: 1024,
          minRatio: 0.6
        })
        // new BundleAnalyzePlugin()
      )
      config.performance = {
        hints: 'warning',
        maxEntrypointSize: 50000000,
        maxAssetSize: 30000000,
        assetFilter: function (assetFilename) {
          return assetFilename.endsWith('.js')
        }
      }
      config.optimization = {
        runtimeChunk: 'single',
        splitChunks: {
          cacheGroups: {
            commons: {
              chunks: 'initial',
              minChunks: 2,
              minSize: 0
            },
            vendor: {
              test: '/node_modules',
              chunks: 'initial',
              name: 'vendor',
              enforce: true
            }
          }
        }
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
  }
  // devServer: {
  //   proxy: {
  //     '/telot': {
  //       target: 'http://telot-ci-gateway.kt.ziroom.com/telot', // API服务器的地址
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/telot': ''
  //       }
  //     }

  //     // http://www.web-jshtml.cn/api/vue3  /api/getCode
  //   }
  // }
}
