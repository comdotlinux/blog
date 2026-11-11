import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import globals from "globals";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
  {
    // Rules for TypeScript declaration files
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
  {
    // Rules for CommonJS files
    files: ["**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    // Vendored upstream files: their ASCII-range regexes are intentional.
    files: ["src/utils/slugify.ts", "src/utils/toTransitionName.ts"],
    rules: { "no-control-regex": "off" },
  },
  {
    files: ["src/**", "*.ts", "*.mjs"],
    rules: { "no-console": "error" },
  },
  {
    ignores: [
      "dist/",
      "public/pagefind/",
      "old-posts/",
      ".lighthouseci/",
      "playwright-report/",
      "test-results/",
      "node_modules/",
      ".astro/",
      ".husky/",
      ".vscode/",
      "public/",
    ],
  },
];
