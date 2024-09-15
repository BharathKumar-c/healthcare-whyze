const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const SRC_DIR = path.resolve(__dirname);
const OUT_DIR = path.resolve(__dirname, 'dist');

const config = {
  entry: {
    bundle: path.resolve(SRC_DIR, 'src/app.js'),
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
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        './node_modules/swagger-ui-dist/swagger-ui.css',
        './node_modules/swagger-ui-dist/swagger-ui-bundle.js',
        './node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js',
        './node_modules/swagger-ui-dist/favicon-16x16.png',
        './node_modules/swagger-ui-dist/favicon-32x32.png',
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'views', to: 'views' }],
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'public', to: 'public' }],
    }),
  ],
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
