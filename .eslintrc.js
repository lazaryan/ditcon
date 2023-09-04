/* eslint-env node */

const ESLINT_NO_CYCLE = process.env.ESLINT_NO_CYCLE === 'true';

const styledPropsReferenceSelectors =
  'TaggedTemplateExpression[tag.callee.name="styled"] > TSTypeParameterInstantiation > TSTypeReference' +
  ',' +
  'TaggedTemplateExpression[tag.object.name="styled"] > TSTypeParameterInstantiation > TSTypeReference';

/**
 * @return {import('@typescript-eslint/utils').TSESLint.Linter.Config}
 */
function getBaseConfig() {
  return {
    root: true,
    plugins: [
      '@typescript-eslint/eslint-plugin',
      'eslint-plugin-import',
      'eslint-plugin-eslint-comments',
      'eslint-plugin-react-hooks',
    ],
    parser: '@typescript-eslint/parser',
    ignorePatterns: ['!.storybook'],
    settings: {
      'import/ignore': ['react-native'],
    },
  };
}

/**
 * @return {import('@typescript-eslint/utils').TSESLint.Linter.Config}
 */
function getGeneralConfig() {
  return {
    ...getBaseConfig(),
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-plugin/recommended',
      'plugin:eslint-plugin-eslint-comments/recommended',
      'plugin:eslint-plugin-import/recommended',
      'plugin:eslint-plugin-import/typescript',
      'plugin:eslint-plugin-react-hooks/recommended',
      'eslint-config-prettier',
    ],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: styledPropsReferenceSelectors,
          message: 'Use inline type parameter for styled-components',
        },
      ],

      'sort-imports': [
        'warn',
        {
          ignoreDeclarationSort: true,
          ignoreCase: true,
        },
      ],

      // typescript rules
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/member-delimiter-style': ['error'],
      '@typescript-eslint/member-ordering': ['warn'],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/camelcase': 'off',
      '@typescript-eslint/method-signature-style': ['warn', 'property'],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: false,
          allowTernary: true,
          allowTaggedTemplates: false,
        },
      ],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/ban-types': [
        'error',
        {
          extendDefaults: true,
          types: {
            object: false,
          },
        },
      ],

      'class-methods-use-this': 'off',
      'no-implicit-coercion': 'error',
      'no-param-reassign': ['error', { props: false }],
      indent: 'off',
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'styled-components',
              message: "Use 'styled-components/macro' instead.",
            },
            {
              name: 'lodash',
              message:
                '\nImport individual methods from the Lodash module so tree-shaking could work.\n E.g. "import isEmpty from \'lodash/isEmpty\'"',
            },
          ],
          patterns: [
            {
              group: ['\\#clodack-*/../*'],
              message:
                "Don't use relative paths to import other packages. Import package directly.",
            },
          ],
        },
      ],
      'import/prefer-default-export': 'off',
      'import/no-cycle': 'off',
      'import/no-default-export': 'error',
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@msgpl/**',
              group: 'external',
              position: 'after',
            },
            {
              pattern: 's2b-*',
              group: 'external',
              position: 'after',
            },
            {
              pattern: 'clodack-*/**',
              group: 'external',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-unresolved': 'off',
      'import/extensions': 'off',

      'no-underscore-dangle': 'off',
      'no-void': ['error', { allowAsStatement: true }],

      'eslint-comments/disable-enable-pair': [
        'error',
        { allowWholeFile: true },
      ],
      'default-case': 'error',
    },

    overrides: [
      // Typescript declarations
      {
        files: ['*.d.ts'],
        rules: {
          '@typescript-eslint/method-signature-style': 'off',
        },
      },

      // Node.js scripts
      {
        files: ['*.js', '*.mjs'],
        rules: {
          '@typescript-eslint/no-var-requires': 'off',
        },
      },

      // Jest unit tests
      {
        files: ['packages/*/src/**/*.test.ts', 'packages/*/src-*/**/*.test.ts'],
        env: {
          'jest/globals': true,
        },
        extends: ['plugin:jest/recommended'],
        plugins: ['jest'],
        rules: {
          'jest/expect-expect': 'off',
        },
      },

      // Playwright e2e tests
      {
        files: ['playwright.config.ts'],
        rules: {
          'import/no-default-export': 'off',
        },
      },
    ],
  };
}

/**
 * @return {import('@typescript-eslint/utils').TSESLint.Linter.Config}
 */
function getImportNoCycleConfig() {
  return {
    ...getBaseConfig(),
    extends: [
      'plugin:eslint-plugin-import/typescript',
      'eslint-config-prettier',
    ],
    rules: {
      'import/no-cycle': 'error',
    },
  };
}

module.exports =
  ESLINT_NO_CYCLE
    ? getImportNoCycleConfig()
    : getGeneralConfig();
