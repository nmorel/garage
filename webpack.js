const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const data = require('./src/data');

module.exports = config => {
  const publicPath = config && config.publicPath ? config.publicPath : '/';
  const filename = 'scripts/[name].[chunkhash].js';
  const cssFilename = 'styles/[name].[contenthash].css';
  const imageFilename = 'images/[name].[hash].[ext]';

  const staticPaths = ['/', '/occasions', '/prestations', '/contact'];
  data.cars.forEach(car => staticPaths.push('/occasions/' + car.id));

  return {
    entry: {
      app: './src/index.js',
    },
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /\.(js|jsx)$/,
          exclude: [/node_modules/],
          loader: 'babel',
          query: {
            cacheDirectory: true,
            presets: ['es2015', 'react'],
            plugins: ['transform-class-properties'],
          },
        },
        {
          test: /\.(png|jpg|ico|svg|eot|ttf|woff)$/,
          exclude: [/node_modules/],
          loader: 'file?name=' + imageFilename,
        },
        {
          test: /\.scss$/,
          exclude: [/node_modules/],
          loader: ExtractTextPlugin.extract('css?modules!autoprefixer?browsers=last 2 versions!sass'),
        },
        {
          test: /\.json/,
          exclude: [/node_modules/],
          loader: 'json',
        },
      ],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: filename,
      libraryTarget: 'umd',
      publicPath: publicPath,
    },
    plugins: [
      new ExtractTextPlugin(cssFilename),
      new StaticSiteGeneratorPlugin('app', staticPaths),
    ],
    resolve: {
      modulesDirectories: ['.', './node_modules'],
    },
    devServer: {
      publicPath: publicPath,
      progress: true,
      colors: true,
      contentBase: './src/',
    },
  };
};
