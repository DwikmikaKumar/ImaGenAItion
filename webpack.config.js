var path = require('path')
var webpack = require('webpack')
var TerserPlugin = require("terser-webpack-plugin")
var { VueLoaderPlugin } = require('vue-loader')


module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'public/dist'),
    publicPath: 'dist/',
    filename: 'build.js'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader?indentedSyntax'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
          esModule: false
        }
      }
    ]
  },
  devServer: {
    historyApiFallback: true
  },
  performance: {
    hints: false
  },
  devtool: 'eval-source-map',
  plugins: [
    new VueLoaderPlugin()
  ],
  optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
            minify: TerserPlugin.swcMinify,
            // `terserOptions` options will be passed to `swc` (`@swc/core`)
            // Link to options - https://swc.rs/docs/config-js-minify
            terserOptions: {},
        }),
      ],
    }
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
//    new UglifyJsPlugin({
//      uglifyOptions: {
//        compress: {
//          warnings: false,
//          drop_console: true
//        }
//      },
//      sourceMap: true,
//      parallel: true
//    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
