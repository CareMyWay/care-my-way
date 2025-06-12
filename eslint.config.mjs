import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    ignores: ["node_modules", "dist", ".next"],

    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      react: require("eslint-plugin-react"),
      "react-hooks": require("eslint-plugin-react-hooks"),
    },

    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      ...require("eslint-plugin-react").configs.recommended.rules,
      ...require("@typescript-eslint/eslint-plugin").configs.recommended.rules,
      ...require("eslint-plugin-react-hooks").configs.recommended.rules,
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
