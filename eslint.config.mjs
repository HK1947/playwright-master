// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,

    prettier,

    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            'prefer-const': 'warn',
            'no-var': 'error',
            'no-console': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'off',
        },
    },

    {
        ignores: [
            'node_modules/**',
            'playwright-report/**',
            'test-results/**',
            'dist/**',
            'eslint.config.mjs',
        ],
    },
];
