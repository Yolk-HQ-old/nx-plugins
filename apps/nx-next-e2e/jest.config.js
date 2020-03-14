const path = require('path');

module.exports = {
  globals: {
    'ts-jest': { packageJson: path.join(__dirname, '..', '..', 'package.json') }
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  name: 'nx-next-e2e',
  resolver: require.resolve('@nrwl/jest/plugins/resolver'),
  transform: {
    '^.+\\.[tj]sx?$': require.resolve('ts-jest')
  }
};
