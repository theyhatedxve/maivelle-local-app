const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/**', 'build-inspection/**'],
  },
  {
    settings: {
      'import/resolver': {
        typescript: { project: './jsconfig.json' },
      },
    },
  },
]);
