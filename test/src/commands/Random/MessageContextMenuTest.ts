import {
    ApplicationCommandType,
    MessageContextMenuCommandInteraction,
    MessageFlags
} from "discord.js";
import { BotInteraction, FiiClient } from "../../../../src/lib.js";
import { stripIndents } from "common-tags";

export default class MessageContextMenuTestInteraction extends BotInteraction {
    constructor(client: FiiClient) {
        super(client, {
            name: "Informations du message",
            type: ApplicationCommandType.Message
        });
    }

    async runMessageContextMenuCommand(
        inter: MessageContextMenuCommandInteraction
    ): Promise<void> {
        const msg = inter.targetMessage;
        await inter.reply({
            content: stripIndents`
            ID: ${msg.id}
            Auteur: ${msg.author.username}#${msg.author.discriminator} (${msg.author.id})
            Contenu: ${msg.content}
        `,
            embeds: msg.embeds,
            flags: MessageFlags.Ephemeral
        });
    }
}
