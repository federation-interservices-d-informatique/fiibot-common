import { CommandInteraction } from "discord.js";
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
    async run(inter: CommandInteraction): Promise<void> {
        inter.reply("NYI!");
    }
    hasPermission(inter: CommandInteraction): boolean {
        if (!inter.guild && !this.infos.ownerOnly) {
            return true;
        }
        if (!this.infos.ownerOnly && !this.infos.userPermissions) {
            return true;
        }
        if (this.client.isOwner(inter.user)) {
            return true;
        }
        if (this.infos.ownerOnly && !this.client.isOwner(inter.user)) {
            inter.reply(
                `La commande \`${this.infos.name}\` ne peut être utilisée que par un owner du bot!`
            );
            return false;
        }
        if (this.infos.guildOnly && !inter.guild) return false;
        if (inter.channel.type != "DM") {
            const missing = inter.channel
                .permissionsFor(inter.user)
                .missing(this.infos.userPermissions);
            if (missing.length > 0) {
                inter.reply({
                    embeds: [
                        {
                            title: "Manque de permissions:",
                            description: `La commande ${this.infos.name
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
    hasBotPermission(inter: CommandInteraction): boolean {
        if (!inter.guild) return true;
        if (!canSendMessage(inter.guild)) return false;
        if (inter.channel.type != "DM") {
            const missing = inter.channel
                .permissionsFor(inter.guild.me)
                .missing(this.infos.clientPermissions);
            if (missing.length > 0) {
                if (canSendEmbeds(inter.guild)) {
                    inter.reply({
                        embeds: [
                            {
                                title: "Manque de permissions:",
                                description: `Je ne peux pas exécuter la commande \`${this.infos.name
                                    }\` car elle requiert que j'aie les permissions suivantes: ${this.infos.clientPermissions.join(
                                        ","
                                    )}`,
                                color: "RED"
                            }
                        ]
                    });
                } else {
                    inter.reply(
                        `Erreur: Je ne peux pas exécuter la commande \`${this.infos.name
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
