import { Client, ClientOptions } from "discord.js";
import { fiiClientOptions } from "../lib.js";
import { fiiLogger } from "./logger.js";

/**
 * FII extension of base Discord.JS client
 */
export class fiiClient extends Client {
    /**
     *
     * @param {ClientOptions} djsopts - Discord.JS Options
     * @param {fiiClientOptions} opts - Fii client options
     */
    logger: fiiLogger;
    constructor(djsopts: ClientOptions, opts: fiiClientOptions) {
        super(djsopts);
        this.logger = new fiiLogger();
    }
}
