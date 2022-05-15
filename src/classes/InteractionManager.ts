import { InteractionManagerSettings } from "../lib";
import { fiiClient } from "./client.js";
import { BotInteraction } from "./Interaction.js";
import { existsSync } from "fs";
import { walkDir } from "../utils/FileSystem.js";
import { Collection } from "discord.js";

/**
 * Interactions + paths store
 */
export class InteractionsManager {
    /// Interactions store
    public interactions: Map<string, BotInteraction>;
    /// Discord Client
    private client: fiiClient;
    /// Settings (commands path, ...)
    public settings: InteractionManagerSettings;

    constructor(client: fiiClient, settings: InteractionManagerSettings) {
        this.client = client;
        this.interactions = new Map();
        this.settings = settings;
        this.init();
    }

    public init = (): void => {
        const interactionFiles: string[] = [];
        this.settings.interactionsPath.forEach((path) => {
            if (!existsSync(path)) {
                this.client.logger.error(
                    `Can't scan path ${path}: Not such file or directory`,
                    "Handler"
                );
                return;
            }
            interactionFiles.push(...walkDir(path));
        });

        // Wait for the client (and its application command) to be ready
        this.client.on("ready", async () => {
            this.loadInteractions(interactionFiles).then(() => {
                this.client.logger.ok("Loaded all interactions", "LOADER");
            });
        });
    };
    loadInteractions = async (files: string[]): Promise<void> => {
        // Load interactions in this.interactions
        for (const file of files) {
            this.loadInteraction(file);
        }

        if (!this.client.application?.commands) {
            throw new Error("Client application not ready!");
        }
        const interactionsList =
            (await this.client.application?.commands.fetch()) ||
            new Collection();

        for (const inter of this.interactions.values()) {
            const interaction = interactionsList.filter(
                (i) => i.name === inter.appCommand.name
            );
            if (interaction.size === 0) {
                this.client.logger.info(
                    `Creating interaction ${inter.appCommand.name}`,
                    "LOADER"
                );
                this.client.application?.commands.create(inter.appCommand);
            } else {
                const cmdInteraction = interaction.first();
                if (!cmdInteraction) continue;
                if (!cmdInteraction.equals(inter.appCommand)) {
                    this.client.logger.info(
                        `Editing command ${inter.appCommand.name}`,
                        "LOADER"
                    );
                    this.client.application?.commands.edit(
                        cmdInteraction.id,
                        inter.appCommand
                    );
                }
            }
        }
        interactionsList.forEach(async (cmd) => {
            if (!this.interactions.has(cmd.name)) {
                this.client.logger.warn(
                    `Found deleted interaction ${cmd.name}, removing if from application`,
                    "LOADER"
                );
                await this.client.application?.commands.delete(cmd.id);
            }
        });
    };
    loadInteraction = async (file: string): Promise<void> => {
        const imported = (await import(file)).default;
        const cmd: BotInteraction = new imported(this.client);
        this.client.logger.info(
            `Loading interaction ${cmd.appCommand.name}`,
            "LOADER"
        );
        this.interactions.set(cmd.appCommand.name, cmd);
    };

    public setClient = (client: fiiClient) => {
        this.client = client;
    };
}