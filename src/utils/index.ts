export * from "./Permissions.js";
export * from "./colorise.js";
export * from "./FileSystem.js";

/**
 * Generate discord \`\`\` code block
 * @param lang The language
 * @param content Block content
 * @returns Full codeblock
 */
export const codeBlock = (lang: string, content: string): string => {
    return `\`\`\`${lang}\n${content}\`\`\``;
};
