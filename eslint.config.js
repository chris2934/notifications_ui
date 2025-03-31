import vue from "eslint-plugin-vue"
import prettierPlugin from "eslint-plugin-prettier"
// Make sure to import the vue-eslint-parser
import vueParser from "vue-eslint-parser"

export default [
  {
    files: ["**/*.{js,vue}"],
    ignores: ["node_modules"],
    languageOptions: {
      parser: vueParser, // Use vue-eslint-parser to parse Vue files
      parserOptions: {
        parser: "@babel/eslint-parser", // For JS in <script> blocks
        requireConfigFile: false, // Disable Babel config file checking
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: false, // Disable JSX parsing since this is Vue
        },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
      },
    },
    plugins: {
      vue, // Enable Vue plugin
      prettier: prettierPlugin, // Prettier plugin
    },
    rules: {
      ...(vue.configs["vue3-recommended"]?.rules || {}), // Use Vue 3 recommended rules
      semi: ["error", "never"], // Disallow semicolons
      "prettier/prettier": [
        "error",
        {
          semi: false, // Ensure prettier aligns with no semicolon rule
        },
      ],
    },
  },
]
