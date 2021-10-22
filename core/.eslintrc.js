module.exports = {
    root: true,
    env: {
        node: true,
        es2021: true,
    },
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    extends: ['plugin:prettier/recommended'],
    overrides: [
        {
            files: ['*.ts'],
            extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
            rules: {
                '@typescript-eslint/ban-ts-comment': 'off',
                '@typescript-eslint/explicit-member-accessibility': ['error'],
                '@typescript-eslint/explicit-function-return-type': ['error'],
                'no-restricted-syntax': [
                    'error',
                    {
                        selector: 'MethodDefinition[static = true] ThisExpression',
                        message: 'Keyword "this" is not allowed inside static!',
                    },
                ],
            },
        },
    ],
    rules: {
        'dot-notation': 'error',
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    },
};
