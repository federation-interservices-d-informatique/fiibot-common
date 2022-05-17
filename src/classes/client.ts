import {
    Client,
    ClientOptions,
    Interaction,
    ThreadChannel,
    User,
    UserResolvable
} from "discord.js";
import { fiiClientOptions } from "../lib.js";
import { InteractionsManager } from "./InteractionManager.js";
import { EventManager } from "./EventManager.js";
import { fiiLogger } from "./Logger.js";
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
        this.eventManager = new EventManager(
            this,
            opts.managersSettings.eventsManagerSettings
        );

        // Setup interactionsManager
        this.interactionManager = new InteractionsManager(
            this,
            opts.managersSettings.interactionsManagerSettings
        );

        this.eventManager.registerEvent(
            "loginfos",
            "ready",
            async (): Promise<void> => {
                await this.application?.fetch();
                this.logger
                    .ok(
                        `Connected as ${this.user?.tag} (${this.user?.id})`,
                        "BOT"
                    )
                    .ok(`Present in ${this.guilds.cache.size} guilds`, "BOT");

                // Join all unarchived threads found
                this.channels.cache.forEach(async (chan) => {
                    if (chan.isThread() && !chan.archived) {
                        this.logger.info(
                            `Joined thread ${chan.name}`,
                            "CLIENT"
                        );
                        await chan.join();
                    }
                });
            }
        );

        // Join threads when they are created
        this.eventManager.registerEvent(
            "joinNewThreads",
            "threadCreate",
            async (threadChannel: ThreadChannel) => {
                this.logger.info(
                    `Joined thread ${threadChannel.name}`,
                    "CLIENT"
                );
                await threadChannel.join();
            }
        );

        // Handle application commands
        this.eventManager.registerEvent(
            "processAppCommand",
            "interactionCreate",
            async (inter: Interaction) => {
                if (!inter.isApplicationCommand()) return;

                /*
                    Return if the user is a bot / a webhook
                    NOTE: I don't think a bot can trigger an interaction but I kept this here as a safety measure
                */
                if (inter.user.bot) return;

                const cmd = this.interactionManager.interactions.get(
                    inter.commandName
                );

                // Make sure interaction exists locally
                if (!cmd) return;

                // Make sure user/bot have all required permissions
                if (
                    !cmd.botHasPermission(inter) ||
                    !cmd.userHasPermission(inter)
                )
                    return;

                try {
                    // Run command
                    cmd.run(inter);
                } catch (e) {
                    console.log(e);
                }
            }
        );

        this.login(opts.token)
            .then(() => {
                // Prepare interactionsManager
                this.interactionManager.setClient(this);
            })
            .catch(console.log);

        if (postgresConfig) {
            // Prepare database (pskv)
            this.logger.info("Initialising DB client", "CLIENT");
            this.dbclient = new Pskv(postgresConfig);
            this.dbclient.connect().then(() => {
                this.logger.ok("DB initialised!", "CLIENT");
            });
        }
    }

    /**
     * Checks if a user is a bot owner
     * @param user {UserResolvable} - User to check
     * @returns {boolean} True if the user is an owner
     */
    isOwner(user: UserResolvable): boolean {
        if (!this.isReady()) return false; // WTF? How can we get interactions if we are not ready?
        // Just return false if application has problems
        if (!this.application.owner) return false;

        const resolvedUser = this.users.resolve(user);
        if (!resolvedUser) {
            return false;
        }
        /*
        Support user-owned bot, even if FII bots are owned by a Team
        */
        if (this.application.owner instanceof User) {
            return this.application.owner.equals(resolvedUser);
        } else {
            return this.application.owner.members.has(resolvedUser.id);
        }
    }
}
