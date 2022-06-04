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
export class fiiLogger {
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
    public formatDate = (): string => {
        const date = new Date();
        return `[${date.toDateString()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`;
    };

    /**
     * Logs in both discord and console
     * @param msg
     * @param source
     * @returns
     */
    private log = (
        level: string,
        color: keyof typeof AnsiEscapesColors,
        msg: string,
        source?: string
    ): fiiLogger => {
        const logline = colorise(
            `${this.formatDate()} [${level.toUpperCase()}] ${
                source ? `${source} ` : ""
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
    public info = (msg: string, source?: string): fiiLogger => {
        return this.log("INFO", "BLUE", msg, source);
    };
    /**
     * Write an error, in red
     * @param {string} msg - Message to log
     * @param {string} source - The source of the log. Ex: WOOMY
     */
    public error = (msg: string, source?: string): fiiLogger => {
        return this.log("error", "RED", msg, source);
    };
    /**
     * Write a warn, in Yellow
     * @param {string} msg - Message to log
     * @param {string} source - The source of the log. Ex: WOOMY
     */
    public warn = (msg: string, source?: string): fiiLogger => {
        return this.log("warn", "YELLOW", msg, source);
    };
    /**
     * Write an "ok", in green
     * @param {string} msg - Message to log
     * @param {string} source - The source of the log. Ex: WOOMY
     */
    public ok = (msg: string, source?: string): fiiLogger => {
        return this.log("ok", "GREEN", msg, source);
    };
}
