const path = require('path')
const slsw = require('serverless-webpack')
const nodeExternals = require('webpack-node-externals')

const entries = {}

Object.keys(slsw.lib.entries).forEach(key => (
  entries[key] = ['./source-map-install.js', slsw.lib.entries[key]]
))

module.exports = {
  entry: entries,
  // devtool: 'source-map',
  target: 'node',
  mode: process.env.NODE_ENV || 'production',
  externals: [nodeExternals()],

  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },

  resolve: {
    modules: [
      path.join(__dirname, "src"),
      "node_modules",
    ],

    extensions: [
      '.js',
      '.ts',
    ],
  },

  module: {
    rules: [

      {
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        include: path.join(__dirname, "src"),
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'imports-loader?graphql',
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['env', {
                  targets: {
                    node: '6.10'
                  }
                }]
              ],
            },
          },
        ],
      },

    ],
  },
}