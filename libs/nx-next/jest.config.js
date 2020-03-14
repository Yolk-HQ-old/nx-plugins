module.exports = {
  name: 'nx-next',
  preset: require.resolve('../../jest.config.js'),
  transform: {
    '^.+\\.[tj]sx?$': require.resolve('ts-jest')
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../coverage/libs/nx-next'
};
