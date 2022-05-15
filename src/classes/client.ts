import { Client, ClientOptions, Interaction, UserResolvable } from "discord.js";
import { fiiClientOptions } from "../lib.js";
import { InteractionsManager } from "./InteractionManager.js";
import { EventManager } from "./EventManager.js";
import { fiiLogger } from "./logger.js";
import { Pskv, PskvInitOptions } from "pskv";
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
    interactionManager: InteractionsManager;
    fiiSettings: fiiClientOptions;
    eventManager: EventManager;
    dbclient?: Pskv;
    constructor(
        djsopts: ClientOptions,
        opts: fiiClientOptions,
        postgresConfig?: PskvInitOptions
    ) {
        super(djsopts);
        this.logger = new fiiLogger();

        this.fiiSettings = opts;

        this.eventManager = new EventManager(this);

        // Setup interactionsManager
        this.interactionManager = new InteractionsManager(
            this,
            opts.interactionsManagerSettings
        );

        this.eventManager.registerEvent("loginfos", "ready", (): void => {
            this.logger
                .ok(`Connected as ${this.user?.tag} (${this.user?.id})`, "BOT")
                .ok(`Present in ${this.guilds.cache.size} guilds`, "BOT");
            this.channels.cache.forEach(async (chan) => {
                if (chan.isThread() && !chan.archived) {
                    this.logger.info(`Joined thread ${chan.name}`, "CLIENT");
                    await chan.join();
                }
            });
        });

        // Join newly created threads
        this.eventManager.registerEvent(
            "joinNewThreads",
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
                if (!inter.isApplicationCommand()) return;
                // NOTE: I am not sure if a bot can trigger an interaction
                if (inter.user.bot) return; //Stop if the author is a bot or a WebHook
                const cmd = this.interactionManager.interactions.get(
                    inter?.commandName
                );
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
                this.interactionManager.setClient(this);
            })
            .catch(console.log);

        if (postgresConfig) {
            this.logger.info("Initialising DB client", "CLIENT");
            this.dbclient = new Pskv(postgresConfig);
            this.dbclient.connect().then(() => {
                this.logger.ok("DB initialised!", "CLIENT");
            });
        }
    }
    isOwner(user: UserResolvable): boolean {
        if (this.fiiSettings.owners.length === 0) {
            return false;
        }
        const resolvedUser = this.users.resolve(user);
        if (!resolvedUser) {
            return false;
        }
        return this.fiiSettings.owners.includes(parseInt(resolvedUser.id));
    }
}
