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
 * Cool logger with colors for FIIClient and commands
 */
export class fiiLogger {
    /**
     * Prints a text in color
     * @param text {string} - The text to print
     * @param color {number} - The ANSI escape code
     */
    public colorise = (
        text: string,
        color: number = AnsiEscapesColors.WHITE
    ): string => {
        return `\x1b[${color}m${text}\x1b[m`;
    };
    /**
     * Write an info, in blue
     * @param {string} msg - Message to log. Ex: Eating potatoes
     * @param {source} source - The source of the log. Ex: WOOMY
     */
    public info = (msg: string, source?: string): void => {
        const date = new Date();
        let sourceline = " ";
        if (source) {
            sourceline = `(${source.toUpperCase()}) `;
        }
        console.log(
            this.colorise(
                `[${date.toDateString()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] [INFO] ${sourceline}${msg}`,
                AnsiEscapesColors.CYAN
            )
        );
    };
    /**
     * Write an error, in red
     * @param {string} msg - Message to log
     * @param {string} source - The source of the log. Ex: WOOMY
     */
    public error = (msg: string, source?: string): void => {
        const date = new Date();
        let sourceline = " ";
        if (source) {
            sourceline = `(${source.toUpperCase()}) `;
        }
        console.error(
            this.colorise(
                `[${date.toDateString()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] [ERROR] ${sourceline}${msg}`,
                AnsiEscapesColors.RED
            )
        );
    };
    /**
     * Write a warn, in Yellow
     * @param {string} msg - Message to log
     * @param {string} source - The source of the log. Ex: WOOMY
     */
    public warn = (msg: string, source?: string): void => {
        const date = new Date();
        let sourceline = " ";
        if (source) {
            sourceline = `(${source.toUpperCase()}) `;
        }
        // This is not an error but this should appear on stderr
        console.error(
            this.colorise(
                `[${date.toDateString()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] [WARN] ${sourceline}${msg}`,
                AnsiEscapesColors.YELLOW
            )
        );
    };
    /**
     * Write an "ok", in green
     * @param {string} msg - Message to log
     * @param {string} source - The source of the log. Ex: WOOMY
     */
    public ok = (msg: string, source?: string): void => {
        const date = new Date();
        let sourceline = " ";
        if (source) {
            sourceline = `(${source.toUpperCase()}) `;
        }
        console.log(
            this.colorise(
                `[${date.toDateString()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] [OK] ${sourceline}${msg}`,
                AnsiEscapesColors.GREEN
            )
        );
    };
}
