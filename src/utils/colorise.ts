/**
 * List of ANSI escapes codes for colors
 */
export enum AnsiEscapesColors {
    BLACK = 30,
    RED = 31,
    GREEN = 32,
    YELLOW = 33,
    BLUE = 34,
    MAGENTA = 35,
    CYAN = 36,
    WHITE = 37
}

/**
 * Prints a text in color
 * @param text - The text to print
 * @param color - The ANSI escape code
 */
export const colorise = (
    text: string,
    color: keyof typeof AnsiEscapesColors = "WHITE"
): string => `\u001b[${AnsiEscapesColors[color]}m${text}\u001b[0m`;

