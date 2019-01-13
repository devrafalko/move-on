const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    index:'./src/move-on.js'
  },
  output: {
    filename: 'move-on.node.js',
    path: path.resolve(__dirname, 'dist'),
    library:'moveOn',
    libraryTarget: 'commonjs2',
    libraryExport:'default',
    globalObject: 'this'
  },
  target:'node',
  externals: [nodeExternals()]
};