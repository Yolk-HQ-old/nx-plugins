module.exports = {
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+\\.(ts|js|html)$': require.resolve('ts-jest')
  },
  resolver: require.resolve('@nrwl/jest/plugins/resolver'),
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageReporters: ['html']
};
