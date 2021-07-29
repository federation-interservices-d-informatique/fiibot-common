import { readdirSync } from "fs";
import { lstatSync } from "fs";
export function walkDir(path: string): string[] {
    const result = [];
    const files = readdirSync(path);
    files.forEach((file: string) => {
        if (
            !lstatSync(`${path}/${file}`).isDirectory() &&
            file.endsWith(".js")
        ) {
            result.push(`${path}/${file}`);
        } else if (lstatSync(file).isDirectory()) {
            walkDir(`${path}/${file}`).forEach(result.push);
        }
    });
    return result;
}
