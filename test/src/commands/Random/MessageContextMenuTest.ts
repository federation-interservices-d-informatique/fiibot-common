import { MessageContextMenuInteraction } from "discord.js";
import { BotInteraction, FiiClient } from "../../../../src/lib.js";
import { stripIndents } from "common-tags";

export default class MessageContextMenuTestInteraction extends BotInteraction {
    constructor(client: FiiClient) {
        super(client, {
            name: "Informations du message",
            type: "MESSAGE"
        });
    }

    async runMessageContextMenu(
        inter: MessageContextMenuInteraction
    ): Promise<void> {
        const msg = inter.targetMessage;
        inter.reply({
            content: stripIndents`
            ID: ${msg.id}
            Auteur: ${msg.author.username}#${msg.author.discriminator} (${msg.author.id})
            Contenu: ${msg.content}
        `,
            embeds: msg.embeds,
            ephemeral: true
        });
    }
}
