const path = require('path');

module.exports = {
  entry: {
    index: './src/move-on.js'
  },
  output: {
    filename: 'move-on.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'moveOn',
    libraryTarget: 'var',
    libraryExport: 'default',
    globalObject: 'this'
  },
  target: 'web'
};