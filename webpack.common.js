const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.ts'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Production'
    })
  ],
  resolve: {
    extensions: ['.js', '.ts'],
    plugins: [new TsconfigPathsPlugin({})]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/i,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      }
    ]
  }
};
