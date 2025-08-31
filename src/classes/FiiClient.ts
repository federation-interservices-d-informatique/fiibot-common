import {
    AutocompleteInteraction,
    Client,
    ClientOptions,
    Interaction,
    ThreadChannel,
    User,
    UserResolvable,
    Status
} from "discord.js";
import { FiiClientOptions } from "../lib.js";
import { InteractionsManager } from "./InteractionManager.js";
import { EventManager } from "./EventManager.js";
import { FiiLogger } from "./Logger.js";
import { Pskv, PskvInitOptions } from "pskv";
import { createServer, Server } from "http";
/**
 * FII extension of base Discord.JS client
 */
export class FiiClient extends Client {
    /**
     *
     * @param djsopts - Discord.JS Options
     * @param opts - Fii client options
     */
    logger: FiiLogger;
    interactionManager: InteractionsManager;
    fiiSettings: FiiClientOptions;
    eventManager: EventManager;
    dbClient?: Pskv;
    healthCheckServer: Server;
    constructor(
        djsopts: ClientOptions,
        opts: FiiClientOptions,
        postgresConfig?: PskvInitOptions
    ) {
        super(djsopts);
        this.logger = new FiiLogger();

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
                        `Connected as ${this.user?.username ?? "i"} (${this.user?.id.toString() ?? ""})`,
                        "BOT"
                    )
                    .ok(`Present in ${this.guilds.cache.size.toString()} guilds`, "BOT");

                // Join all unarchived threads found
                for (const [_, chan] of this.channels.cache) {
                    if (chan.isThread() && !chan.archived) {
                        this.logger.info(
                            `Joined thread ${chan.name}`,
                            "CLIENT"
                        );
                        await chan.join();
                    }
                };
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
            async (interaction: Interaction) => {
                if (
                    !interaction.isChatInputCommand() &&
                    !interaction.isContextMenuCommand() &&
                    !(interaction instanceof AutocompleteInteraction)
                )
                    return;

                /*
                    Return if the user is a bot / a webhook
                    NOTE: I don't think a bot can trigger an interaction but I kept this here as a safety measure
                */
                if (interaction.user.bot) return;

                const command = this.interactionManager.interactions.get(
                    interaction.commandName
                );

                // Make sure interaction exists locally
                if (!command) return;

                // Make sure user/bot have all required permissions
                if (!command.userHasPermission(interaction)) {
                    if (interaction.isRepliable()) {
                        await interaction.reply(
                            "Vous n'avez pas le permission d'exécuter cette commande!"
                        );
                    }
                    return;
                }
                try {
                    // Run command
                    await command.run(interaction);
                } catch (e: unknown) {
                    if (e instanceof Error)
                        this.logger.error(
                            `Error when running command ${command.appCommand.name}: ${e.toString()}`
                        );
                }
            }
        );

        this.login(opts.token)
            .then(() => {
                // Prepare interactionsManager
                this.interactionManager.setClient(this);
            })
            .catch((e: unknown) => {
                if (e instanceof Error)
                    this.logger.error(
                        `FATAL: Can't login: ${e.toString()}`,
                        "FIICLIENT"
                    );
            });

        if (postgresConfig) {
            // Prepare database (pskv)
            this.logger.info("Initialising DB client", "CLIENT");
            this.dbClient = new Pskv(postgresConfig);
            this.dbClient.connect().then(() => {
                this.logger.ok("DB initialised!", "CLIENT");
            }).catch((e: unknown) => {
                if (e instanceof Error)
                    this.logger.error(`Can't connect to db: ${e.toString()}`, "CLIENT");
            });
        }

        this.healthCheckServer = createServer();

        this.healthCheckServer.on("request", (_, res) => {
            let botHealthy = true;

            if (this.ws.status !== Status.Ready) botHealthy = false;

            res.statusCode = botHealthy ? 200 : 500;
            res.write(botHealthy ? "ok" : "error");
            res.end();
        });

        const hcPort = parseInt(process.env.HEALTHCHECK_PORT ?? "8080");
        this.healthCheckServer.listen(
            {
                port: hcPort
            },
            () => {
                this.logger.ok(`Listening on port ${hcPort.toString()}`, "HEALTHCHECK");
            }
        );
    }

    /**
     * Checks if a user is a bot owner
     * @param user - User to check
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

        // Supports user-owned bot, even if FII bots are owned by a Team
        if (this.application.owner instanceof User) {
            return this.application.owner.equals(resolvedUser);
        } else {
            return this.application.owner.members.has(resolvedUser.id);
        }
    }
}
