import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import { globalIgnores } from "eslint/config";

export default tseslint.config([
  // replacement for .eslintignore
  { ignores: ["dist"] }, // you can also keep using globalIgnores if you prefer: globalIgnores(["dist"])
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      react.configs.recommended, // React-specific best practices
      reactHooks.configs["recommended-latest"], // Hooks rules (flat config modern variant) :contentReference[oaicite:5]{index=5}
      reactRefresh.configs.vite, // Vite-compatible Fast Refresh rules :contentReference[oaicite:6]{index=6}
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
      globals: globals.browser,
      // If you need type-aware rules that require type information, you can supply parserOptions.project via tseslint helpers.
    },
    plugins: {
      react: react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      // Note: tseslint.configs.recommended already wires up @typescript-eslint internally
    },
    rules: {
      // Prefer the TS version of unused vars
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // Optional: enforce Hook rules explicitly if not relying solely on the preset
      // 'react-hooks/rules-of-hooks': 'error',
      // 'react-hooks/exhaustive-deps': 'warn',

      // Example React tweaks (since you have react plugin now)
      "react/jsx-uses-react": "off", // not needed with the automatic JSX runtime (React 17+)
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off", // using TypeScript instead of prop-types
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]);
