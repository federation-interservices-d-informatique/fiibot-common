import { Message } from "discord.js";
import { commandOptions } from "../lib";
import { canSendEmbeds, canSendMessage } from "../utils/Permissions.js";
import { fiiClient } from "./client";

/**
 * Bot command
 */
export class Command {
    /** Command options (name, description, ...) */
    infos: commandOptions;
    /** Discord client (we can also use message.client) */
    client: fiiClient;
    /** Command temp data */
    data: Map<string, string | unknown>;
    /**
     * Create a new command (must be extended)
     * @param client - The client
     * @param options - Command options
     */
    constructor(
        client: fiiClient,
        options: commandOptions,
        data?: Map<string, unknown>
    ) {
        this.client = client;
        this.infos = options;
        this.data = data || new Map();
    }
    // eslint-disable-next-line
    async run(message: Message, args: string[]): Promise<void> {
        message.channel.send("NYI!");
    }
    hasPermission(message: Message): boolean {
        if (!message.guild && !this.infos.ownerOnly) {
            return true;
        }
        if (!this.infos.ownerOnly && !this.infos.userPermissions) {
            return true;
        }
        if (this.client.isOwner(message.author)) {
            return true;
        }
        if (this.infos.ownerOnly && !this.client.isOwner(message.author)) {
            message.channel.send(
                `La commande \`${this.infos.name}\` ne peut être utilisée que par un owner du bot!`
            );
            return false;
        }
        if (this.infos.guildOnly && !message.guild) return false;
        if (message.channel.type != "DM") {
            const missing = message.channel
                .permissionsFor(message.author)
                .missing(this.infos.userPermissions);
            if (missing.length > 0) {
                message.reply({
                    embeds: [
                        {
                            title: "Manque de permissions:",
                            description: `La commande ${
                                this.infos.name
                            } requiert les permissions suivantes: ${this.infos.userPermissions.join(
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
    hasBotPermission(message: Message): boolean {
        if (!message.guild) return true;
        if (!canSendMessage(message)) return false;
        if (message.channel.type != "DM") {
            const missing = message.channel
                .permissionsFor(message.guild.me)
                .missing(this.infos.clientPermissions);
            if (missing.length > 0) {
                if (canSendEmbeds(message)) {
                    message.channel.send({
                        embeds: [
                            {
                                title: "Manque de permissions:",
                                description: `Je ne peux pas exécuter la commande \`${
                                    this.infos.name
                                }\` car elle requiert que j'aie les permissions suivantes: ${this.infos.clientPermissions.join(
                                    ","
                                )}`,
                                color: "RED"
                            }
                        ]
                    });
                } else {
                    message.channel.send(
                        `Erreur: Je ne peux pas exécuter la commande \`${
                            this.infos.name
                        }\` car elle requiert que j'aie les permissions suivantes: ${this.infos.clientPermissions.join(
                            ","
                        )}`
                    );
                }
                return false;
            }
            return true;
        }
    }
}
