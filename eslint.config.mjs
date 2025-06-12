import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Use dynamic imports instead of require()
const [
  typescriptEslintPlugin,
  reactPlugin,
  reactHooksPlugin,
  typescriptParser,
] = await Promise.all([
  import("@typescript-eslint/eslint-plugin"),
  import("eslint-plugin-react"),
  import("eslint-plugin-react-hooks"),
  import("@typescript-eslint/parser"),
]);

const eslintConfig = [
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    ignores: ["node_modules", "dist", ".next"],
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin.default,
      react: reactPlugin.default,
      "react-hooks": reactHooksPlugin.default,
    },
    languageOptions: {
      parser: typescriptParser.default,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...typescriptEslintPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "next",
    "prettier"
  ),
];

export default eslintConfig;
