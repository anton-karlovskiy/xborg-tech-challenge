import nextConfig from "eslint-config-next";
import coreWebVitalsConfig from "eslint-config-next/core-web-vitals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsdoc from "eslint-plugin-jsdoc";

const config = [
  {
    // Ignore patterns - must come first in flat config
    ignores: [
      // Dependencies
      "node_modules/**",
      
      // Build outputs
      ".next/**",
      "dist/**",
      "build/**",
      "out/**",
      
      // Config files (these are typically not linted)
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
      
      // Generated files
      "next-env.d.ts",
      "tsconfig.tsbuildinfo",
      
      // Environment and log files
      ".env*",
      "*.log",
      
      // Coverage reports
      "coverage/**",
      
      // Cache directories
      ".cache/**",
      ".turbo/**"
    ]
  },
  ...nextConfig,
  ...coreWebVitalsConfig,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      jsdoc
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        },
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname || process.cwd()
      }
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      // Google Style Guide: Semicolons are required
      "semi": ["error", "always"],

      // Google Style Guide: Use 2 spaces for indentation
      "indent": ["error", 2, {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        MemberExpression: 1,
        FunctionDeclaration: {
          parameters: 1,
          body: 1
        },
        FunctionExpression: {
          parameters: 1,
          body: 1
        },
        CallExpression: {
          arguments: 1
        },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        ignoredNodes: [
          "TemplateLiteral *",
          "JSXElement",
          "JSXElement > *",
          "JSXAttribute",
          "JSXIdentifier",
          "JSXNamespacedName",
          "JSXMemberExpression",
          "JSXSpreadAttribute",
          "JSXExpressionContainer",
          "JSXOpeningElement",
          "JSXClosingElement",
          "JSXFragment",
          "JSXOpeningFragment",
          "JSXClosingFragment",
          "JSXText",
          "JSXEmptyExpression",
          "JSXSpreadChild"
        ],
        ignoreComments: false
      }],

      // Google Style Guide: Maximum line length (100 characters)
      "max-len": ["error", {
        code: 100,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignoreComments: true
      }],

      // Google Style Guide: Trailing commas allowed in arrays/objects but not in function parameters
      // This improves git diffs and aligns with modern Google TypeScript style
      "comma-dangle": ["error", {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "never",
        exports: "never",
        functions: "never"
      }],

      // Google Style Guide: Use single quotes for strings, double quotes for JSX attributes
      // Note: Google JS style uses single quotes, but TypeScript/React commonly uses double
      // We'll use double quotes to match the existing codebase and JSX requirements
      "quotes": ["error", "double", {
        avoidEscape: true,
        allowTemplateLiterals: true
      }],

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
      "radix": "error",
      "yoda": "error",

      // Google Style Guide: Use arrow functions for callbacks, function declarations for named functions
      "func-style": ["error", "declaration", {
        allowArrowFunctions: true
      }],

      // Google Style Guide: Require braces for all control statements
      "curly": ["error", "all"],

      // Google Style Guide: No console.log in production (warn in development)
      "no-console": ["warn", {
        allow: ["warn", "error"]
      }],

      // Google Style Guide: No debugger statements
      "no-debugger": "error",

      // Google Style Guide: Require === and !==
      "eqeqeq": ["error", "always", {
        null: "ignore"
      }],

      // Google Style Guide: No unused variables
      "no-unused-vars": "off", // Turn off base rule
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_"
      }],

      // Google Style Guide: Require JSDoc comments for public APIs
      "jsdoc/require-jsdoc": ["warn", {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: false,
          FunctionExpression: false
        },
        contexts: [
          "ExportNamedDeclaration > FunctionDeclaration",
          "ExportDefaultDeclaration > FunctionDeclaration"
        ]
      }],
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
      "space-before-function-paren": ["error", {
        anonymous: "always",
        named: "never",
        asyncArrow: "always"
      }],

      // Google Style Guide: Spacing around operators
      "space-infix-ops": "error",

      // Google Style Guide: Spacing around keywords
      "keyword-spacing": ["error", {
        before: true,
        after: true
      }],

      // Google Style Guide: No multiple empty lines (max 1 blank line)
      "no-multiple-empty-lines": ["error", {
        max: 1,
        maxEOF: 1,
        maxBOF: 0
      }],

      // Google Style Guide: Trailing spaces not allowed
      "no-trailing-spaces": "error",

      // Google Style Guide: End files with newline
      "eol-last": ["error", "always"],

      // TypeScript specific rules aligned with Google style
      "@typescript-eslint/explicit-function-return-type": "off", // Too strict for React
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off", // Too strict for React
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"], // Google prefers interfaces
      "@typescript-eslint/consistent-type-imports": ["error", {
        prefer: "type-imports",
        fixStyle: "inline-type-imports"
      }], // Google style: use type imports for types
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

      // React specific rules
      "react/react-in-jsx-scope": "off", // Not needed in React 17+
      "react/prop-types": "off", // Using TypeScript instead
      "react/jsx-uses-react": "off", // Not needed in React 17+
      "react/jsx-uses-vars": "error",
      "react/jsx-key": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-undef": "error",
      "react/jsx-pascal-case": "error",
      "react/no-array-index-key": "warn",
      "react/no-danger": "warn",
      "react/no-deprecated": "error",
      "react/no-direct-mutation-state": "error",
      "react/no-unknown-property": "error",
      "react/self-closing-comp": "error",
      "react/jsx-closing-bracket-location": ["error", "line-aligned"],
      "react/jsx-closing-tag-location": "error",
      "react/jsx-curly-spacing": ["error", {
        when: "never",
        children: true
      }],
      "react/jsx-equals-spacing": ["error", "never"],
      "react/jsx-first-prop-new-line": ["error", "multiline-multiprop"],
      "react/jsx-indent": ["error", 2],
      "react/jsx-indent-props": ["error", 2],
      "react/jsx-max-props-per-line": ["error", {
        maximum: 1,
        when: "multiline"
      }],
      "react/jsx-tag-spacing": ["error", {
        closingSlash: "never",
        beforeSelfClosing: "always",
        afterOpening: "never",
        beforeClosing: "never"
      }],
      "react/jsx-wrap-multilines": ["error", {
        declaration: "parens-new-line",
        assignment: "parens-new-line",
        return: "parens-new-line",
        arrow: "parens-new-line",
        condition: "parens-new-line",
        logical: "parens-new-line",
        prop: "parens-new-line"
      }],

      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      
      // Additional React best practices aligned with Google style
      "react/jsx-boolean-value": ["error", "never"], // Don't pass true explicitly
      "react/jsx-fragments": ["error", "syntax"], // Prefer <> over <React.Fragment>
      "react/jsx-no-bind": ["warn", {
        allowArrowFunctions: true,
        allowFunctions: false,
        allowBind: false
      }],
      "react/jsx-no-leaked-render": "error", // Prevent leaked renders (e.g., {count && <div>})
      "react/jsx-no-useless-fragment": "error",
      "react/no-unstable-nested-components": "error",
      "react/function-component-definition": ["error", {
        namedComponents: "function-declaration",
        unnamedComponents: "arrow-function"
      }] // Google style: function declarations for named components
    }
  }
];

export default config;
