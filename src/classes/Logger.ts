import { Worker } from "worker_threads";
import {
    getDirname,
    colorise,
    codeBlock,
    AnsiEscapesColors
} from "../utils/index.js";

/**
 * Cool logger with colors for FIIClient and commands
 */
export class FiiLogger {
    whWorker: Worker;
    constructor() {
        this.whWorker = new Worker(
            `${getDirname(import.meta.url)}/../helpers/logworker.js`
        );
    }
    /**
     * Formats a date for logging
     * @returns {string} - The formatted date
     */
    private formatDate = (): string => {
        const date = new Date();
        return `[${date.toLocaleDateString()} ${date.getHours().toString()}:${date.getMinutes().toString()}:${date.getSeconds().toString()}]`;
    };

    /**
     * Logs in both discord and console
     * @param msg
     * @param source
     * @returns
     */
    private log = (
        level: string,
        color: AnsiEscapesColors,
        msg: string,
        source?: string
    ): this => {
        const logline = colorise(
            `${this.formatDate()} [${level.toUpperCase()}] ${
                source ? `(${source}) ` : ""
            }${msg}`,
            color
        );
        console.log(logline);
        this.whWorker.postMessage(codeBlock("ansi", logline));
        return this;
    };

    /**
     * Write an info, in blue
     * @param {string} msg - Message to log. Ex: Eating potatoes
     * @param {string} source - The source of the log. Ex: WOOMY
     */
    public info = (msg: string, source?: string): this =>
        this.log("INFO", AnsiEscapesColors.BLUE, msg, source);

    /**
     * Write an error, in red
     * @param {string} msg - Message to log
     * @param {string} source - The source of the log. Ex: WOOMY
     */
    public error = (msg: string, source?: string): this =>
        this.log("error", AnsiEscapesColors.RED, msg, source);

    /**
     * Write a warn, in Yellow
     * @param {string} msg - Message to log
     * @param {string} source - The source of the log. Ex: WOOMY
     */
    public warn = (msg: string, source?: string): this =>
        this.log("warn", AnsiEscapesColors.YELLOW, msg, source);

    /**
     * Write an "ok", in green
     * @param {string} msg - Message to log
     * @param {string} source - The source of the log. Ex: WOOMY
     */
    public ok = (msg: string, source?: string): this =>
        this.log("ok", AnsiEscapesColors.GREEN, msg, source);
}
