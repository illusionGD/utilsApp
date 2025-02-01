module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        '@electron-toolkit/eslint-config-ts/recommended',
        '@electron-toolkit/eslint-config-prettier'
    ],
    rules: {
        'no-explicit-any': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-empty-pattern': 'off',
        'prettier/prettier': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/ban-types': 'off'
    }
}
