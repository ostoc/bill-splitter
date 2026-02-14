import js from "@eslint/js";
import globals from "globals";
import vue from "eslint-plugin-vue";

export default [
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  js.configs.recommended,
  ...vue.configs["flat/recommended"],
  {
    rules: {
      // Disable rule that triggers on Vue 3 defineProps with default values
      "vue/no-required-prop-with-default": "off",
      // Disable rule that triggers on unused variable assignments in Vue composition API
      "no-useless-assignment": "off",
    },
  },
];
