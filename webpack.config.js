require('dotenv').config();
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const nodeEnv = process.env.NODE_ENV || 'production';
const zip = process.env.ZIP || false;
const FileManagerPlugin = require('filemanager-webpack-plugin');


module.exports = {
  devtool: nodeEnv === 'development' ? 'inline-source-map' : false,
  entry: './src/scripts/app.js',
  mode: nodeEnv,
  resolve: {
    alias: {
      Scripts: path.resolve(__dirname, './src/scripts/templates'),
      Sections: path.resolve(__dirname, './src/scripts/sections')
    },
    extensions: ['.js', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, './src/assets'),
    filename: 'theme.js'
  },
  optimization: nodeEnv === 'production' ? {
    minimizer: [new TerserPlugin()],
  } : {
    minimize: false
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    },
      {
        test: /scripts\/modernizr\.js$/,
        loader: 'imports-loader?this=>window!exports-loader?window.Modernizr'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          plugins: [
            ["@babel/transform-react-jsx", {"pragma": "h"}],
            ["@babel/plugin-proposal-class-properties"]
          ]
        }
      }]
  },
  plugins: zip ? [
    // env plugin
    new webpack.DefinePlugin({
      'proccess.env': {NODE_ENV: JSON.stringify(nodeEnv)}
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: ['./dist', './rc.zip']
        },
        onEnd: {
          copy: [
            {source: './src/assets', destination: './dist/assets'},
            {source: './src/config', destination: './dist/config'},
            {source: './src/layout', destination: './dist/layout'},
            {source: './src/locales', destination: './dist/locales'},
            {source: './src/sections', destination: './dist/sections'},
            {source: './src/snippets', destination: './dist/snippets'},
            {source: './src/templates', destination: './dist/templates'}
          ],
          archive: [
            {source: './dist', destination: './rc.zip', format: 'zip'}
          ],
        },
      },
      runTasksInSeries: true,
    })
  ] : [
    // env plugin
    new webpack.DefinePlugin({
      'proccess.env': {NODE_ENV: JSON.stringify(nodeEnv)}
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
  ]
};
