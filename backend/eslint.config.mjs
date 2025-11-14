import tseslint from "typescript-eslint";
import jsdoc from "eslint-plugin-jsdoc";
import prettierConfig from "eslint-config-prettier";

const config = [
  {
    // Ignore patterns - must come first in flat config
    ignores: [
      // Dependencies
      "node_modules/**",

      // Build outputs
      "dist/**",
      "build/**",
      "coverage/**",

      // Config files (these are typically not linted)
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",

      // Generated files
      "tsconfig.tsbuildinfo",

      // Environment and log files
      ".env*",
      "*.log",

      // Database files
      "*.sqlite",
      "*.db",

      // Cache directories
      ".cache/**",
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,ts}"],
    plugins: {
      jsdoc,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname || process.cwd(),
      },
      globals: {
        // Node.js globals
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        // Jest globals
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
      },
    },
    rules: {
      // Google Style Guide: Semicolons are required
      semi: ["error", "always"],

      // Google Style Guide: Maximum line length (100 characters)
      "max-len": [
        "error",
        {
          code: 100,
          tabWidth: 2,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignoreComments: true,
        },
      ],

      // Google Style Guide: Use double quotes for strings
      quotes: [
        "error",
        "double",
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],

      // Google Style Guide: No var, use let/const
      "no-var": "error",
      "@typescript-eslint/no-var-requires": "error",

      // Google Style Guide: Prefer const over let
      "prefer-const": "error",

      // Google Style Guide: Additional best practices
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
      "no-sequences": "error",
      "no-throw-literal": "error",
      "no-useless-call": "error",
      "no-useless-concat": "error",
      "no-useless-return": "error",
      "prefer-arrow-callback": "error",
      "prefer-promise-reject-errors": "error",
      "prefer-spread": "error",
      "prefer-template": "error",
      radix: "error",
      yoda: "error",

      // Google Style Guide: Use arrow functions for callbacks, function declarations for named functions
      "func-style": [
        "error",
        "declaration",
        {
          allowArrowFunctions: true,
        },
      ],

      // Google Style Guide: Require braces for all control statements
      curly: ["error", "all"],

      // Google Style Guide: No console.log in production (warn in development)
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],

      // Google Style Guide: No debugger statements
      "no-debugger": "error",

      // Google Style Guide: Require === and !==
      eqeqeq: [
        "error",
        "always",
        {
          null: "ignore",
        },
      ],

      // Google Style Guide: No unused variables
      "no-unused-vars": "off", // Turn off base rule
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Google Style Guide: Require JSDoc comments for public APIs
      "jsdoc/require-jsdoc": [
        "warn",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
          contexts: [
            "ExportNamedDeclaration > FunctionDeclaration",
            "ExportDefaultDeclaration > FunctionDeclaration",
            "ExportNamedDeclaration > ClassDeclaration",
            "ExportDefaultDeclaration > ClassDeclaration",
          ],
        },
      ],
      "jsdoc/require-description": "warn",
      "jsdoc/require-param": "warn",
      "jsdoc/require-returns": "warn",
      "jsdoc/check-types": "warn",
      "jsdoc/check-param-names": "warn",
      "jsdoc/check-tag-names": "warn",
      "jsdoc/require-param-description": "warn",
      "jsdoc/require-returns-description": "warn",

      // Google Style Guide: Object property spacing
      "object-curly-spacing": ["error", "always"],

      // Google Style Guide: Array bracket spacing
      "array-bracket-spacing": ["error", "never"],

      // Google Style Guide: Space before function parentheses (except for anonymous functions)
      "space-before-function-paren": [
        "error",
        {
          anonymous: "always",
          named: "never",
          asyncArrow: "always",
        },
      ],

      // Google Style Guide: Spacing around operators
      "space-infix-ops": "error",

      // Google Style Guide: Spacing around keywords
      "keyword-spacing": [
        "error",
        {
          before: true,
          after: true,
        },
      ],

      // Google Style Guide: No multiple empty lines (max 1 blank line)
      "no-multiple-empty-lines": [
        "error",
        {
          max: 1,
          maxEOF: 1,
          maxBOF: 0,
        },
      ],

      // Google Style Guide: Trailing spaces not allowed
      "no-trailing-spaces": "error",

      // Google Style Guide: End files with newline
      "eol-last": ["error", "always"],

      // TypeScript specific rules aligned with Google style
      "@typescript-eslint/explicit-function-return-type": "off", // Too strict for NestJS decorators
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off", // Too strict for NestJS
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "off", // Requires strictNullChecks which is disabled
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"], // Google prefers interfaces
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ], // Google style: use type imports for types
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/no-inferrable-types": "error", // Don't annotate obvious types
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/prefer-for-of": "error",
      "@typescript-eslint/prefer-function-type": "error",
      "@typescript-eslint/prefer-namespace-keyword": "error",
      "@typescript-eslint/prefer-reduce-type-parameter": "error",
      "@typescript-eslint/prefer-string-starts-ends-with": "error",
      "@typescript-eslint/prefer-ts-expect-error": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",

      // NestJS specific: Allow parameter properties (used in NestJS constructors)
      "@typescript-eslint/no-parameter-properties": "off",

      // Allow empty catch blocks (sometimes needed in NestJS error handling)
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  },
  // Prettier config must come last to disable conflicting formatting rules
  prettierConfig,
];

export default config;
