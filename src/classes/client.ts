import { Client, ClientOptions } from "discord.js";
import { fiiClientOptions } from "../lib.js";
import { Command } from "./command.js";
import { CommandManager } from "./CommandManager.js";
import { EventManager } from "./EventManager.js";
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
    commandManager: CommandManager;
    fiiSettings: fiiClientOptions;
    eventManager: EventManager;
    constructor(djsopts: ClientOptions, opts: fiiClientOptions) {
        super(djsopts);
        this.logger = new fiiLogger();
        this.commandManager = new CommandManager(
            this,
            opts.commandManagerSettings
        );
        this.fiiSettings = opts;
        this.eventManager = new EventManager(this);
        this.eventManager.registerEvent("loginfos", "ready", (): void => {
            this.logger
                .ok(
                    `Connected as ${this.user.username}#${this.user.discriminator} (${this.user.id})`,
                    "BOT"
                )
                .ok(`Present in ${this.guilds.cache.size} guilds`, "BOT");
            this.channels.cache.forEach(async (chan) => {
                if (chan.isThread() && !chan.archived) {
                    this.logger.info(`Joined thread ${chan.name}`, "CLIENT");
                    await chan.join();
                }
            });
        });
        this.eventManager.registerEvent(
            "joinnewthreads",
            "threadCreate",
            async (tc) => {
                this.logger.info(`Joined thread ${tc.name}`, "CLIENT");
                await tc.join();
            }
        );
        this.eventManager.registerEvent(
            "processcommand",
            "messageCreate",
            async (msg) => {
                if (msg.partial) await msg.fetch();
                if (msg.author.bot) return; //Stop if the author is a bot or a WebHook
                if (msg.content.indexOf(this.fiiSettings.prefix) !== 0) return;
                const args = msg.content
                    .slice(this.fiiSettings.prefix.length)
                    .trim()
                    .split(/ +/g);
                const command = args.shift().toLowerCase();
                if (
                    !this.commandManager.aliases.has(command) &&
                    !this.commandManager.commands.has(command)
                )
                    return;
                let cmd: Command;
                if (this.commandManager.aliases.has(command)) {
                    cmd = this.commandManager.aliases.get(command);
                } else {
                    cmd = this.commandManager.commands.get(command);
                }
                try {
                    cmd.run(msg, args);
                } catch (e) {
                    console.log(e);
                }
            }
        );
    }
}
