import {
    ChatInputApplicationCommandData,
    CommandInteraction
} from "discord.js";
import { commandOptions } from "../lib";
import { canSendEmbeds } from "../utils/Permissions.js";
import { fiiClient } from "./client";

/**
 * Bot command
 */
export class Command {
    /** Command options (name, description, ...) */
    extraOptions: commandOptions;
    /** Discord client (we can also use message.client) */
    client: fiiClient;
    /** Command temp data */
    data: Map<string, string | unknown>;
    /** Data for applications command */
    appCommand: ChatInputApplicationCommandData;
    /**
     * Create a new command (must be extended)
     * @param client - The client
     * @param extraOptions - Command extra options
     */
    constructor(
        client: fiiClient,
        appCommand: ChatInputApplicationCommandData,
        extraOptions?: commandOptions,
        data?: Map<string, unknown>
    ) {
        this.client = client;
        this.appCommand = appCommand;
        if (!this.appCommand.options) {
            this.appCommand.options = [];
        }
        this.extraOptions = extraOptions || {};
        this.data = data || new Map();
    }
    // eslint-disable-next-line
    async run(inter: CommandInteraction): Promise<void> {
        inter.reply({
            ephemeral: true,
            content: "NYI!"
        });
    }
    hasPermission(inter: CommandInteraction): boolean {
        if (!inter.guild && !this.extraOptions.ownerOnly) {
            return true;
        }
        if (
            !this.extraOptions.ownerOnly &&
            !this.extraOptions.userPermissions
        ) {
            return true;
        }
        if (this.client.isOwner(inter.user)) {
            return true;
        }
        if (this.extraOptions.ownerOnly && !this.client.isOwner(inter.user)) {
            inter.reply({
                ephemeral: true,
                content: `La commande \`${this.appCommand.name}\` ne peut être utilisée que par un owner du bot!`
            });
            return false;
        }
        if (this.extraOptions.guildOnly && !inter.guild) return false;
        if (inter.channel.type != "DM") {
            const missing = inter.channel
                .permissionsFor(inter.user)
                .missing(this.extraOptions.userPermissions);
            if (missing.length > 0) {
                inter.reply({
                    ephemeral: true,
                    embeds: [
                        {
                            title: "Manque de permissions:",
                            description: `La commande ${
                                this.appCommand.name
                            } requiert les permissions suivantes: ${this.extraOptions.userPermissions.join(
                                ","
                            )}`,
                            color: "RED"
                        }
                    ]
                });
                return false;
            }
            return true;
        }
    }
    hasBotPermission(inter: CommandInteraction): boolean {
        if (!inter.guild) return true;
        if (inter.channel.type != "DM") {
            const missing = inter.channel
                .permissionsFor(inter.guild.me)
                .missing(this.extraOptions.clientPermissions);
            if (missing.length > 0) {
                if (canSendEmbeds(inter.guild)) {
                    inter.reply({
                        ephemeral: true,
                        embeds: [
                            {
                                title: "Manque de permissions:",
                                description: `Je ne peux pas exécuter la commande \`${
                                    this.appCommand.name
                                }\` car elle requiert que j'aie les permissions suivantes: ${this.extraOptions.clientPermissions.join(
                                    ","
                                )}`,
                                color: "RED"
                            }
                        ]
                    });
                } else {
                    inter.reply({
                        ephemeral: true,
                        content: `Erreur: Je ne peux pas exécuter la commande \`${
                            this.appCommand.name
                        }\` car elle requiert que j'aie les permissions suivantes: ${this.extraOptions.clientPermissions.join(
                            ","
                        )}`
                    });
                }
                return false;
            }
            return true;
        }
    }
}
