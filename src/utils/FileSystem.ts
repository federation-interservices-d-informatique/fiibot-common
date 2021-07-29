import { readdirSync } from "fs";
import { lstatSync } from "fs";
/**
 * Walk a dir recursivly
 * @param path The path to scan
 * @param filter extensions filter. Ex: .js
 * @returns Path to files
 */
export function walkDir(path: string, filter: string = ".js"): string[] {
    const result = [];
    const files = readdirSync(path);
    files.forEach((file: string) => {
        if (
            !lstatSync(`${path}/${file}`).isDirectory() &&
            file.endsWith(filter)
        ) {
            result.push(`${path}/${file}`);
        } else if (lstatSync(file).isDirectory()) {
            walkDir(`${path}/${file}`).forEach(result.push);
        }
    });
    return result;
}
