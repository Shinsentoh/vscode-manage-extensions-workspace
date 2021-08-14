/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-nocheck

'use strict';

const path = require('path');
const fs = require('fs');
const copyPlugin = require("copy-webpack-plugin");

function copypluginPathNameFilter(filterList, resourcePath) {
  return filterList.some(value => resourcePath.toLowerCase().indexOf(value.toLowerCase()) > -1);
}

/**@type {import('webpack').Configuration}*/
const config = {
  target: 'node', // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/

  entry: './src/extension.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  output: { // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
      path: path.resolve(__dirname, 'dist'),
      filename: 'extension.js',
      libraryTarget: "commonjs2",
      devtoolModuleFilenameTemplate: "../[resource-path]",
      clean: true,
  },
  devtool: 'source-map',
  externalsPresets: { node: true },
  externals: (() => {
    let modules = {
      vscode: "commonjs vscode",
      'sqlite3': 'commonjs sqlite3',
    };
    return modules;
  })(),
  resolve: { // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
      extensions: ['.ts', '.js']
  },
  module: {
      rules: [{
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [{
              loader: 'ts-loader',
              options: {
                  compilerOptions: {
                      "module": "es6" // override `tsconfig.json` so that TypeScript emits native JavaScript modules.
                  }
              }
          }]
      }]
  },
  stats: {
      errorDetails: true,
      errorStack: true,
      warnings: true
  },
  plugins: [
    new copyPlugin({
      patterns: [
        {
          from: "node_modules/sqlite3",
          to: "node_modules/sqlite3",
          filter: async (resourcePath) => {
            return copypluginPathNameFilter([ 'lib/', 'package.json' ], resourcePath);
          },
          globOptions: {
            ignore: ['**/sqlite3-binding.js', '**/node_modules', '**/binding', '**/test'] // will be replaced below
          },
        },
        {
          from: "src/issues/sqlite3-binding.js", // install pre-build package if exists
          to: "node_modules/sqlite3/lib"
        }
      ],
    }),
  ]
};

module.exports = config;