import { readdirSync } from "fs";
import { lstatSync } from "fs";
/**
 * Walk a dir recursivly
 * @param {string[]} fpath The path to scan
 * @param {string[]} filter extensions filter. Ex: .js
 * @returns Path to files
 */
export const walkDir = (fpath: string, filter?: string): string[] => {
    const result = [];
    const files = readdirSync(fpath);
    files.forEach((file: string) => {
        if (
            !lstatSync(`${fpath}/${file}`).isDirectory() &&
            file.endsWith(filter ?? ".js")
        ) {
            result.push(`${fpath}/${file}`);
        } else if (lstatSync(file).isDirectory()) {
            walkDir(`${fpath}/${file}`).forEach(result.push);
        }
    });
    return result;
};
