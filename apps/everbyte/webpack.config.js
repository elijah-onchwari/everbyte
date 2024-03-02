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
        "@nestjs/cqrs",
        "class-validator",
        "class-transformer",
        "class-transformer/storage",
        "typeorm",
        "passport",
        "bcrypt"
      ]
    }),
  ],
};
