const { NxWebpackPlugin } = require('@nx/webpack');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/everbyte'),
  },
  plugins: [
    new NxWebpackPlugin({
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      // assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      externalDependencies: [
        "@nestjs/core",
        "@nestjs/common",
        "path",
        "fs",
        "crypto",
        "os",
        "util",
        "process",
        "assert",
        "stream",
        "http",
        "url",
        "zlib",
        "net",
        "node-gyp",
        "tls",
        "child_process",
        "async_hooks",
        "timers",
        "class-transformer/storag",
        "nock",
        "aws-sdk",
        "mock-aws-s3",
        "react-native-sqlite-storage"
      ]
    }),
  ],
};
