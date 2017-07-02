const path = require('path');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: "cheap-eval-source-map",
  module: {
     rules: [
       {
        test: /\.css$/,
        use: [
           'style-loader',
           'css-loader'
         ]
       }
     ]
   },
};