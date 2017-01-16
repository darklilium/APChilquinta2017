const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: __dirname,
  devtool: 'inline-source-map',
  entry: {
    app: './src/app/Main.js',
    vendor: [
      'webpack-hot-middleware/client'
    ]
  },
  output: {
    path: path.join(path.join(__dirname, 'dist'), 'js'),
    filename: '[name].js',
    libraryTarget: "amd",
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.scss', '.css', '.js', '.json','.webpack.js', '.web.js', '.js', '.jsx'],
    modulesDirectories: [
      'node_modules',
      path.resolve(__dirname, './node_modules')
    ]
  },
  module: {
    loaders: [
      {
        test: /(\.js|\.jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: { presets: ['es2015', 'stage-0', 'react','stage-2'] }
      }, {
        test: /(\.scss|\.css)$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass')
      }
    ]
  },
  externals: [
      function(context, request, callback) {
          if (/^dojo/.test(request) ||
              /^dojox/.test(request) ||
              /^dijit/.test(request) ||
              /^esri/.test(request)
          ) {
              return callback(null, "amd " + request);
          }
          callback();
      }
  ],
  devServer: {
    inline: true,
    port: 443,
    host: "127.0.0.1",
    historyApiFallback: true
  },
  devtool: 'source-map',
  postcss: [autoprefixer],
  sassLoader: {
    data: '@import "css/index.scss";',
    includePaths: [path.resolve(__dirname, './src/app')]
  },
  plugins: [
    new ExtractTextPlugin('../css/style.css', { allChunks: true }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
};
