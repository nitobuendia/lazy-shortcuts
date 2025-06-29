/** @file Webpack configuration. */

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const extensionConfig = require('./extension.config');

module.exports = {
  mode: 'production',
  optimization: {
    minimize: true,
  },
  entry: {
    options: path.resolve(__dirname, 'src', 'options/index.tsx'),
  },
  output: {
    path: path.resolve(__dirname, extensionConfig.OUTPUT_BUILD_DIR),
    filename: '[name].js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@app': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/*.json',  to: '[name][ext]' },
        {
          from: 'src/img/*.png',
          globOptions: {
            ignore: ['src/img/extension-icon-original.png'],
          },
          to: 'img/[name][ext]'
        },
        { from: 'src/options/options.css', to: 'options.css' },
        { from: 'src/options/options.html', to: 'options.html' },
      ],
    }),
  ]
};
