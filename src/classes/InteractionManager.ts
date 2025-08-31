import { InteractionsManagerSettings } from "../lib";
import { FiiClient } from "./FiiClient.js";
import { BotInteraction } from "./BotInteraction.js";
import { existsSync } from "fs";
import { walkDir, getDirname } from "../utils/index.js";

/**
 * Interactions + paths store
 */
export class InteractionsManager {
    /// Interactions store
    public interactions: Map<string, BotInteraction>;
    /// Discord Client
    private client: FiiClient;
    /// Settings (commands path, ...)
    public settings: InteractionsManagerSettings;

    constructor(client: FiiClient, settings: InteractionsManagerSettings) {
        this.client = client;
        this.interactions = new Map();
        this.settings = settings;

        this.init();
    }

    /**
     * Load all interactions in this.
     */
    public init = (): void => {
        const interactionFiles: string[] = [];
        const { interactionsPaths } = this.settings;

        if (this.settings.includeDefaultInteractions !== false) {
            // Add the path at the start of the array to allow overriding interactions
            interactionsPaths.unshift(
                `${getDirname(import.meta.url)}/../defaultInteractions`
            );
        }
        for (const path of interactionsPaths) {
            if (!existsSync(path)) {
                this.client.logger.error(
                    `Can't scan path ${path} for interactions: Not such file or directory`,
                    "Handler"
                );
                continue;
            }
            interactionFiles.push(...walkDir(path));
        }

        // Wait for the client (and clientApplication) to be ready
        this.client.on("clientReady", async (): Promise<void> => {
            this.loadInteractions(interactionFiles).then(() => {
                this.client.logger.ok("Loaded all interactions", "LOADER");
            }).catch((_e: unknown) => {
                this.client.logger.error("Can't load interactions", "LOADER");
            });
        });
    };

    /**
     * Load all command files into InteractionManager#interactions and update ClientApplication#commands
     * @param files Command files to load
     */
    loadInteractions = async (files: string[]): Promise<void> => {
        // Load interactions in this.interactions
        for (const file of files) {
            await this.loadInteraction(file);
        }

        if (!this.client.application?.commands) {
            throw new Error("Client application not ready!");
        }

        // Fetch application command
        const interactionsList = await this.client.application.commands.fetch();

        for (const inter of this.interactions.values()) {
            const interaction = interactionsList.filter(
                (i) => i.name === inter.appCommand.name
            );
            // Create the application command if it doesn't exist
            if (interaction.size === 0) {
                this.client.logger.info(
                    `Creating interaction ${inter.appCommand.name}`,
                    "LOADER"
                );
                await this.client.application.commands.create(inter.appCommand);
            } else {
                const cmdInteraction = interaction.first();
                if (!cmdInteraction) continue;
                // Edit command if it has been modified
                if (!cmdInteraction.equals(inter.appCommand)) {
                    this.client.logger.info(
                        `Editing command ${inter.appCommand.name}`,
                        "LOADER"
                    );
                    await this.client.application.commands.edit(
                        cmdInteraction.id,
                        inter.appCommand
                    );
                }
            }
        }
        // Remove all deleted interaction from application commands
        for (const [_, interaction] of interactionsList) {
            if (!this.interactions.has(interaction.name)) {
                this.client.logger.warn(
                    `Found deleted interaction ${interaction.name}, removing if from application`,
                    "LOADER"
                );
                await this.client.application.commands.delete(interaction.id);
            }
        };
    };

    /**
     * Load a single interaction file into this#interactions
     * @param file The file
     */
    loadInteraction = async (file: string): Promise<void> => {
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
        const imported = (await import(file)).default;
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
        const cmd: BotInteraction = new imported(this.client);
        this.client.logger.info(
            `Loading interaction ${cmd.appCommand.name}`,
            "LOADER"
        );
        this.interactions.set(cmd.appCommand.name, cmd);
    };

    /**
     * Set this#client
     * @param client Client
     */
    public setClient = (client: FiiClient) => {
        this.client = client;
    };
}
