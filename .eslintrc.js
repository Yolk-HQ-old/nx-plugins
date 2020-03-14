// https://github.com/typescript-eslint/typescript-eslint/blob/2ccd66b920816d54cc1a639059f60410df665900/docs/getting-started/linting/README.md
// https://github.com/typescript-eslint/typescript-eslint/blob/2ccd66b920816d54cc1a639059f60410df665900/docs/getting-started/linting/MONOREPO.md

module.exports = {
  root: true,
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: [
      './tsconfig.json',
      './apps/*/tsconfig.json',
      './apps/*/tsconfig.*.json',
      './libs/*/tsconfig.json',
      './libs/*/tsconfig.*.json'
    ]
  },
  plugins: ['@typescript-eslint', '@nrwl/nx'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    require.resolve('eslint-config-prettier'),
    require.resolve('eslint-config-prettier/@typescript-eslint')
  ],
  rules: {
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@nrwl/nx/enforce-module-boundaries': [
      'error',
      {
        enforceBuildableLibDependency: true,
        allow: [],
        depConstraints: [{ sourceTag: '*', onlyDependOnLibsWithTags: ['*'] }]
      }
    ]
  },
  overrides: [
    {
      files: ['jest.config.js'],
      env: {
        node: true
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ]
};
