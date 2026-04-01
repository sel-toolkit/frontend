/* eslint-env node */
module.exports = {
    extends: [
        '@nuxt/eslint-config',
        'plugin:tailwindcss/recommended', // https://github.com/francoismassart/eslint-plugin-tailwindcss
        'prettier',
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        project: true,
        sourceType: 'module',
        parser: '@typescript-eslint/parser',
    },
    root: true,
    rules: {
        '@typescript-eslint/consistent-type-exports': 'error',
        '@typescript-eslint/consistent-type-imports': 'error', // This rule throws error if an import is used as type, but not right after the import declaration is appeared
    },
    overrides: [
        {
            files: ['components/**/*.vue'],
            rules: {
                'vue/multi-word-component-names': 'off',
                'tailwindcss/no-custom-classname': 'off',
            },
        },
    ],
};