const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: './src/Main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.json', '.jsx', '.css']
  },
  devtool: 'source-map',
  devServer: {
    clientLogLevel: 'warning',
    contentBase: path.join(__dirname, 'public'),
    publicPath: '/dist/',
    historyApiFallback : true,
    compress: true,
    open: true,
    hot: true,
    quiet: true,
    progress: true,
    port: 1337,
    watchOptions: {},
    proxy: {
      // "/api": {
      //   target: "http://localhost:3000",
      //   pathRewrite: {"^/api" : ""}
      // }
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader']
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {}
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              moduls: true,
              importLoaders: 1,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.(svg|png|jpe?g|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'static/images/[hash].[name].[ext]'
          }
        }]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[hash].[name].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/fonts/[hash].[name].[ext]'
        }
      }
    ]
  },
  // splict common chunks
  optimization: {
  },
  plugins: [
  ]
}
