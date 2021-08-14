require('dotenv').config();

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const { merge } = require('webpack-merge');

const NODE_ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const DEV_PORT = process.env.DEV_PORT || 4000;
const PORT = parseInt(process.env.PORT || DEV_PORT) + 1;
const TESTING = !!process.env.BUNDLE_TEST;
const USE_HTTPS = !!process.env.HTTPS;

const sharedConfig = {
  output: {
    path: path.join(__dirname, 'dist'),
    pathinfo: false,
    publicPath: '/dist/',
  },
  resolve: {
    modules: ['node_modules', 'app', 'core'],
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'jsx',
              target: 'es2015',
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: ['file-loader?name=fonts/[name].[ext]'],
      },
    ],
  },
};

const devConfig = {
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  output: {
    filename: '[name].js',
  },
  entry: { bundle: ['webpack-dev-server/client?http://localhost:' + DEV_PORT + '/', './client'] },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.font\.js/,
        use: [
          'style-loader',
          'css-loader',
          'webfonts-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    }),
    TESTING && new BundleAnalyzerPlugin(),
  ].filter((plugin) => !!plugin),
  devServer: {
    proxy: { '*': 'http://127.0.0.1:' + PORT },
    allowedHosts: ['localhost'],
    hot: true,
    noInfo: true,
    https: USE_HTTPS
      ? {
          key: fs.readFileSync(process.env.HTTPS_KEY),
          cert: fs.readFileSync(process.env.HTTPS_CERT),
        }
      : false,
    clientLogLevel: 'silent',
    stats: 'minimal',
    ...(process.env.POLLING && {
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
      },
    }),
  },
};

const config = merge(
  sharedConfig,
  // NODE_ENV === 'production' && prodConfig,
  NODE_ENV !== 'production' && devConfig,
);

exports.default = TESTING ? new SpeedMeasurePlugin().wrap(config) : config;
