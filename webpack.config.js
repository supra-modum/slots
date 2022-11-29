const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');


module.exports = (env, argv) => {
  return ({
    stats: 'minimal',
    entry: './src/index.ts',

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },

    devServer: {
      compress: true,
      static: false,
      client: {
        logging: 'error',
        overlay: {
          errors: true,
          warnings: false,
        },
        progress: true,
      },
      port: 1234, host: '0.0.0.0',
    },

    performance: { hints: false },

    devtool: argv.mode === 'development' ? 'eval-source-map' : undefined,

    optimization: {
      minimize: argv.mode === 'production',
      minimizer: [new TerserPlugin({
        terserOptions: {
          ecma: 6,
          compress: { drop_console: true },
          output: { comments: false, beautify: false },
        },
      })],
    },

    module: {
      rules: [
        {
          test: /\.ts(x)?$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      extensions: [
        '.tsx',
        '.ts',
        '.js',
      ],
    },

    plugins: [
      new CopyPlugin({
        patterns: [{ from: 'assets/' }],
      }),

      new HtmlWebpackPlugin({
        template: 'src/index.html',
        hash: true,
        minify: false,
      }),
      new ESLintPlugin({
        extensions: ['.tsx', '.ts', '.js'],
        exclude: 'node_modules',
      }),
      new CleanWebpackPlugin(),
      new ForkTsCheckerWebpackPlugin(),
    ],
  });
};
