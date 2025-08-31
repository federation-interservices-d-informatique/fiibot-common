// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: ['eslint.config.mjs'],
                    defaultProject: './tsconfig.json'
                },
                tsconfigRootDir: import.meta.dirname
            }
        },
        rules: {
            "@typescript-eslint/no-unused-vars":
                ["error", {
                    varsIgnorePattern: "^_",
                    argsIgnorePattern: "^_"
                }],
            "@typescript-eslint/require-await": "off",
            "@typescript-eslint/no-deprecated": "error",
            "@typescript-eslint/no-misused-promises": "off"
        }
    }
)
