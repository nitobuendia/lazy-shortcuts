const path = require('path');

module.exports = {
  entry: {
    background: path.resolve(__dirname, 'src', 'background.ts'),
    options: path.resolve(__dirname, 'src', 'options.ts'),
    content: path.resolve(__dirname, 'src', 'content.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
};
