module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['prettier', 'prettier/prettier', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    curly: ['warn', 'all'],
    '@typescript-eslint/no-empty-interface': 'off',
    'no-var': 'error',
    'brace-style': 'error',
    'prefer-template': 'error',
    'space-before-blocks': 'error',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'prettier/prettier': 'warn',
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.test.jsx', '**/*.test.tsx', '**/*.spec.js', '**/*.spec.jsx', '**/*.spec.tsx'],
      env: {
        jest: true,
      },
    },
  ],
};
