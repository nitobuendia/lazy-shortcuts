const path = require('path');
const { optimize } = require('webpack');

module.exports = {
  entry: {
    background: path.resolve(__dirname, 'src', 'background.ts'),
    options: path.resolve(__dirname, 'src', 'options/index.tsx'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'], // Add .tsx and .jsx
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/, // Add rule for JavaScript/JSX
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'], // For handling CSS
      },
    ],
  },
  mode: 'production',
  optimization: {
    minimize: true,
  }
};
