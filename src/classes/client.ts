import { Client, ClientOptions, Interaction, UserResolvable } from "discord.js";
import { fiiClientOptions } from "../lib.js";
import { CommandManager } from "./CommandManager.js";
import { EventManager } from "./EventManager.js";
import { fiiLogger } from "./logger.js";
import {
    Client as PostgresClient,
    Configuration as PostgresConfiguration
} from "ts-postgres";

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
    dbclient?: PostgresClient;
    constructor(
        djsopts: ClientOptions,
        opts: fiiClientOptions,
        postgresConfig?: PostgresConfiguration
    ) {
        super(djsopts);
        this.logger = new fiiLogger();

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
            "processAppCommand",
            "interactionCreate",
            async (inter: Interaction) => {
                if (!inter.isCommand()) return;
                // NOTE: I am not sure if a bot can trigger an interaction
                if (inter.user.bot) return; //Stop if the author is a bot or a WebHook
                const cmd = this.commandManager.commands.get(inter.commandName);
                if (!cmd) return;
                if (!cmd.hasBotPermission(inter) || !cmd.hasPermission(inter))
                    return;
                try {
                    cmd.run(inter);
                } catch (e) {
                    console.log(e);
                }
            }
        );
        this.login(opts.token)
            .then(() => {
                this.commandManager = new CommandManager(
                    this,
                    opts.commandManagerSettings
                );
            })
            .catch(console.log);
        if (postgresConfig) {
            this.logger.info("Initialising DB client", "CLIENT");
            this.dbclient = new PostgresClient(postgresConfig);
            this.dbclient.connect().then(() => {
                this.logger.ok("DB initialised!", "CLIENT");
            });
        }
    }
    isOwner(user: UserResolvable): boolean {
        if (this.fiiSettings.owners.length === 0) {
            return false;
        }
        user = this.users.resolve(user);
        if (!user) {
            return false;
        }
        return this.fiiSettings.owners.includes(parseInt(user.id));
    }
}
