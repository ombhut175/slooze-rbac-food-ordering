import js from "@eslint/js";
import tseslint from "typescript-eslint";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: [
      ".next/*",
      "node_modules/*",
      "dist/*",
      "build/*",
      ".git/*",
      ".vscode/*",
      "docs/*",
      ".qodo/*",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
      },
      globals: {
        React: true,
        JSX: true,
        window: true,
        global: true,
        fetch: true,
        process: true,
        console: true,
        setTimeout: true,
        clearTimeout: true,
        setInterval: true,
        clearInterval: true,
        navigator: true,
        localStorage: true,
        sessionStorage: true,
        document: true,
        location: true,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { 
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
          caughtErrorsIgnorePattern: "^_",
          varsIgnorePattern: "^_|actionTypes",
        },
      ],
      "no-unused-vars": "off",
    },
  },
];
