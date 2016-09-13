const path = require('path');
module.exports = {
  context: __dirname,
  entry: './lib/sliding_warfare.js',
  output: {
    filename: './lib/bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devtool: 'source-maps'
};
