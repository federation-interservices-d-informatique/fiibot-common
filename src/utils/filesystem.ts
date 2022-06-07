import { readdirSync, lstatSync } from "fs";
import { dirname } from "path";

/**
 * Get the dirname of the file. Replacement of __dirname (not aviable with es6 modules)
 * @param {string} importUrl - Always `import.meta.url`
 * @returns {string} - The dirname
 */
export const getDirname = (importUrl: string): string =>
    dirname(new URL(importUrl).pathname);

/**
 * Walk into a dir recursivly
 * @param {string[]} fpath The path to scan
 * @param {string[]} filter extensions filter. Ex: .js
 * @returns Path to files
 */
export const walkDir = (fpath: string, filter?: string): string[] => {
    const result: string[] = [];
    const files = readdirSync(fpath);
    files.forEach((file: string) => {
        if (
            !lstatSync(`${fpath}/${file}`).isDirectory() &&
            file.endsWith(filter ?? ".js")
        ) {
            result.push(`${fpath}/${file}`);
        } else if (lstatSync(`${fpath}/${file}`).isDirectory()) {
            result.push(...walkDir(`${fpath}/${file}`));
        }
    });
    return result;
};
