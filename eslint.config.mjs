import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    globalIgnores([
        "**/node_modules",
        "**/dist",
        "**/jest.config.js",
        "test/node_modules",
        "test/dist",
        "**/docs/"
    ]),
    {
        extends: compat.extends(
            "eslint:recommended",
            "prettier",
            "plugin:@typescript-eslint/recommended"
        ),

        plugins: {
            "@typescript-eslint": typescriptEslint,
            prettier
        },

        languageOptions: {
            globals: {
                ...globals.node
            },

            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module"
        },

        rules: {
            "linebreak-style": ["error", "unix"],
            quotes: ["error", "double"],
            semi: ["error", "always"],
            "prettier/prettier": 1
        }
    }
]);
