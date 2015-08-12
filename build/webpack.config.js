var path = require('path');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

module.exports = {
  plugins: [
      new ngAnnotatePlugin({
          add: true,
          // other ng-annotate options here
      })
  ],
  output: {
    filename: 'bundle.js'
  },
  module: {
      loaders: [
        { test: /\.html$/, loader: 'raw' },
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
        { test: /\.styl$/, loader: 'style!css!stylus' },
        { test: /\.css$/, loader: 'style!css' },
        { test: /\.woff$/,   loader: "url-loader?limit=10000&mimetype=application/font-woff" },
        { test: /\.woff2$/,   loader: "url-loader?limit=10000&mimetype=application/font-woff" },
        { test: /\.ttf$/,    loader: "file-loader" },
        { test: /\.eot$/,    loader: "file-loader" },
        { test: /\.svg$/,    loader: "file-loader" },
        // **IMPORTANT** This is needed so that each bootstrap js file required by
        // bootstrap-webpack has access to the jQuery object
        { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' }
      ]
  }
};
