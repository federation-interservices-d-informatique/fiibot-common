import { Worker } from "worker_threads";
import { getDirname } from "../utils/dirname.js";
import { colorise, AnsiEscapesColors } from "../utils/colorise.js";

/**
 * Cool logger with colors for FIIClient and commands
 */
export class fiiLogger {
    whworker: Worker;
    constructor() {
        this.whworker = new Worker(`${getDirname()}/../helpers/logworker.js`);
    }
    /**
     * Formats a date for logging
     * @returns {string} - The formatted date
     */
    public formatDate = (): string => {
        const date = new Date();
        return `[${date.toDateString()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`;
    };

    /**
     * Write an info, in blue
     * @param {string} msg - Message to log. Ex: Eating potatoes
     * @param {source} source - The source of the log. Ex: WOOMY
     */
    public info = (msg: string, source?: string): fiiLogger => {
        let sourceline = " ";
        if (source) {
            sourceline = `(${source.toUpperCase()}) `;
        }
        const log = `${this.formatDate()} [INFO] ${sourceline}${msg}`;

        this.whworker.postMessage(`\`\`\`markdown\n# ${log}\`\`\``);
        console.log(colorise(log, AnsiEscapesColors.CYAN));
        return this;
    };
    /**
     * Write an error, in red
     * @param {string} msg - Message to log
     * @param {string} source - The source of the log. Ex: WOOMY
     */
    public error = (msg: string, source?: string): fiiLogger => {
        let sourceline = " ";
        if (source) {
            sourceline = `(${source.toUpperCase()}) `;
        }
        const log = `${this.formatDate()} [ERROR] ${sourceline}${msg}`;
        this.whworker.postMessage(`\`\`\`diff\n- ${log}\`\`\``);
        console.error(colorise(log, AnsiEscapesColors.RED));
        return this;
    };
    /**
     * Write a warn, in Yellow
     * @param {string} msg - Message to log
     * @param {string} source - The source of the log. Ex: WOOMY
     */
    public warn = (msg: string, source?: string): fiiLogger => {
        let sourceline = " ";
        if (source) {
            sourceline = `(${source.toUpperCase()}) `;
        }
        // This is not an error but this should appear on stderr
        const log = `${this.formatDate()} [WARN] ${sourceline}${msg}`;
        this.whworker.postMessage(`\`\`\`fix\n${log}\`\`\``);
        console.error(colorise(log, AnsiEscapesColors.YELLOW));
        return this;
    };
    /**
     * Write an "ok", in green
     * @param {string} msg - Message to log
     * @param {string} source - The source of the log. Ex: WOOMY
     */
    public ok = (msg: string, source?: string): fiiLogger => {
        let sourceline = " ";
        if (source) {
            sourceline = `(${source.toUpperCase()}) `;
        }
        const log = `${this.formatDate()} [OK] ${sourceline}${msg}`;
        this.whworker.postMessage(`\`\`\`diff\n+ ${log}\`\`\``);
        console.log(colorise(log, AnsiEscapesColors.GREEN));
        return this;
    };
}
