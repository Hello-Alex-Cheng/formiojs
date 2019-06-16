const _ = require('lodash');
const path = require('path');

const WebpackConfig = require('./webpack.config');

module.exports = (entry, output) => {
  return _.merge({}, WebpackConfig, {
    mode: 'development',
    entry: "./lib/index.js",
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: '[name].js'
    }
  });
};
