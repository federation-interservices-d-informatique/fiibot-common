/**
 * Generate discord \`\`\` code block
 * @param lang The language
 * @param content Block content
 * @returns Full codeblock
 */

export const codeBlock = (lang: string, content: string): string =>
    `\`\`\`${lang}\n${content}\`\`\``;
