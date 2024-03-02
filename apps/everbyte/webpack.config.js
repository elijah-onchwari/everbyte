const { NxWebpackPlugin } = require('@nx/webpack');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/everbyte'),
  },
  plugins: [
    new NxWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      // assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      sourceMap: true,
      externalDependencies:'all'

    }),
  ],
};