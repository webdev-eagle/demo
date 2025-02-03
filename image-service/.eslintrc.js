const WARN = 'warn';
const OFF = 'off';

module.exports = {
    parser: '@typescript-eslint/parser',
    env: {
        commonjs: true,
        node: true,
        jest: true,
    },
    extends: ['plugin:node/recommended', 'prettier', '../configs/eslint/.eslintrc.js'],
    parserOptions: {
        sourceType: 'module',
        impliedStrict: true,
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.ts'],
            },
        },
    },
    ignorePatterns: ['bundle.js', 'gameWorker.js', 'gameServer.js'],

    rules: {
        /* ************************************* */
        /* ************************************* */
        /* *** SHOULD ACCEPT UNCONDITIONALLY *** */
        /* ************************************* */
        /* ************************************* */

        /**
         * Disallow 'import' declarations which import private modules {@link https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/no-unpublished-import.md}
         * Doesn't work quite right
         */
        'node/no-unpublished-import': OFF, // TODO: Check the way to fix resolving issues

        /**
         * Disallow 'import' declarations which import private modules {@link https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/no-unpublished-import.md}
         * Doesn't work quite right
         */
        'node/no-missing-require': OFF, // TODO: Check the way to fix resolving issues

        /** ****************************** **/
        /** ****************************** **/
        /** ******* SHOULD DISCUSS ******* **/
        /** ****************************** **/
        /** ****************************** **/

        /** Disallows the use of `process.exit()`. {@link https://eslint.org/docs/rules/no-process-exit} */
        'no-process-exit': OFF,

        /** Prevent importing packages through relative paths {@link https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-relative-packages.md} */
        'import/no-relative-packages': WARN,

        /** Disallow unsupported ECMAScript features on the specified version {@link https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/no-unsupported-features/es-syntax.md} */
        'node/no-unsupported-features/es-syntax': OFF, // TODO: Can be customized

        /** Disallow unsupported ECMAScript built-ins on the specified version {@link https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/no-unsupported-features/es-builtins.md} */
        'node/no-unsupported-features/es-builtins': OFF, // TODO: Can be customized

        /** Disallow 'import' declarations which import non-existence modules {@link https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/no-missing-import.md} */
        'node/no-missing-import': OFF, // TODO: Can be customized

        /** Disallow 'import' declarations which import extraneous modules {@link https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/no-extraneous-import.md} */
        'node/no-extraneous-import': OFF, // TODO: Can be customized

        /** Disallow unsupported Node.js built-in APIs on the specified version {@link https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/no-unsupported-features/node-builtins.md} */
        'node/no-unsupported-features/node-builtins': OFF, // TODO: Can be customized

        'prettier/prettier': 0,
    },
};
