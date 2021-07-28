import { dirname } from "path";
export const getDirname = (): string => {
    const mod_url = new URL(import.meta.url);
    return dirname(mod_url.pathname);
};
