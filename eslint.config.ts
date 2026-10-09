import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },

  tseslint.configs.recommended,

  {
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      curly: "error",
      semi: ["error", "always"],
      quotes: ["error", "double"],
      indent: ["error", 2],
      "object-curly-spacing": ["error", "always"],
      // Keep as a warning because console logs are useful when developing.     
      "no-console": "warn",
    },
  },

  {
    ignores: ["dist", "node_modules"],
  },
]);