/**
 * List of ANSI escapes codes for colors
 */
export enum AnsiEscapesColors {
    BLACK = 90,
    RED = 91,
    GREEN = 92,
    YELLOW = 93,
    BLUE = 94,
    MAGENTA = 95,
    CYAN = 96,
    WHITE = 97
}
/**
 * Prints a text in color
 * @param text {string} - The text to print
 * @param color {number} - The ANSI escape code
 */
export const colorise = (
    text: string,
    color: number = AnsiEscapesColors.WHITE
): string => {
    return `\x1b[${color}m${text}\x1b[m`;
};
