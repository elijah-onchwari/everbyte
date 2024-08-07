const { NxWebpackPlugin } = require('@nx/webpack');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/everbyte'),
  },
  plugins: [
    new NxWebpackPlugin({
      target: 'node',
      compiler: 'swc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      // assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'all',
      sourceMap: true,
      verbose: true,
      watch: true,
      commonChunk: true,
      statsJson: true,
      externalDependencies: [
        '@nestjs/core',
        '@nestjs/common',
        'path',
        'fs',
        'crypto',
        'os',
        'util',
        'process',
        'assert',
        'stream',
        'http',
        'url',
        'zlib',
        'net',
        'node-gyp',
        'tls',
        'child_process',
        'async_hooks',
        'timers',
        'class-transformer/storage',
        'nock',
        'aws-sdk',
        'mock-aws-s3',
        'react-native-sqlite-storage',
      ],
    }),
  ],
};
