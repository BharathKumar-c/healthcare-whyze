const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const SRC_DIR = path.resolve(__dirname);
const OUT_DIR = path.resolve(__dirname, 'cron_dist');

const config = {
  entry: {
    bundle: path.resolve(SRC_DIR, 'src/cronjob.js'),
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
  output: {
    path: OUT_DIR,
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd',
  },
  target: 'node',
  mode: 'production',
};

module.exports = config;
