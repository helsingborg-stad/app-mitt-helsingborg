/**
 * @type {import("eslint").Linter.Config}
 */
const config = {
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
    },
  },
  plugins: ["unused-imports", "import", "jest"],
  env: {
    es2021: true,
    browser: true,
    node: true,
    jest: true,
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  extends: [
    "eslint:recommended",
    "airbnb",
    "airbnb/hooks",
    "plugin:import/recommended",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "plugin:react/recommended",
    "prettier",
  ],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      plugins: ["@typescript-eslint"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:import/typescript",
        "prettier",
      ],
      rules: {
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": ["error"],
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "error",
        "react/require-default-props": "off",
        "@typescript-eslint/no-floating-promises": "error",
        "no-void": ["error", { allowAsStatement: true }],
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/consistent-type-imports": "warn",
        "@typescript-eslint/explicit-module-boundary-types": "warn",
      },
    },
  ],
  rules: {
    "no-console": "off",
    "no-plusplus": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "import/no-unused-modules": [1, { unusedExports: true }],
    "import/prefer-default-export": "off",
    "react/jsx-filename-extension": [2, { extensions: [".jsx", ".tsx"] }],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["**/*.test.*", "jestSetupFile.ts"] },
    ],
  },
};

module.exports = config;
