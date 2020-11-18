module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  name: 'nx-next',
  resolver: require.resolve('@nrwl/jest/plugins/resolver'),
  transform: {
    '^.+\\.[tj]sx?$': require.resolve('ts-jest'),
  },
};
