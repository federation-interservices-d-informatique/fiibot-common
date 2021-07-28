import { dirname } from "path";
/**
 * Get the dirname of the file. Replacement of __dirname (not aviable with es6 modules)
 * @returns {string} - The dirname
 */
export const getDirname = (): string => {
    const mod_url = new URL(import.meta.url);
    return dirname(mod_url.pathname);
};
