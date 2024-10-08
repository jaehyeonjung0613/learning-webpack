const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = (env) => {
  console.log('Goal: ', env.goal); // 'local'
  console.log('Production: ', env.production);

  return {
    mode: 'development',
    entry: {
      index: './src/index.ts'
    },
    devtool: 'inline-source-map',
    devServer: {
      static: './dist',
      port: 3000
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Authoring Libraries'
      })
    ],
    resolve: {
      extensions: ['.js', '.ts'],
      plugins: [new TsconfigPathsPlugin({})]
    },
    output: {
      filename: 'webpack-numbers.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      publicPath: '/',
      globalObject: 'this',
      library: {
        name: 'webpackNumbers',
        type: 'umd'
      }
    },
    externals: {
      lodash: {
        commonjs: 'lodash',
        commonjs2: 'lodash',
        amd: 'lodash',
        root: '_'
      }
    },
    optimization: {
      moduleIds: 'deterministic'
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)$/i,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader'
          }
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'public/[hash][ext]'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource'
        },
        {
          test: /\.(csv|tsv)$/i,
          use: ['csv-loader']
        },
        {
          test: /.xml$/i,
          use: ['xml-loader']
        }
      ]
    }
  };
};
