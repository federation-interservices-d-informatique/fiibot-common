import { UserContextMenuInteraction } from "discord.js";
import { BotInteraction, fiiClient } from "../../../../src/lib.js";
import { stripIndents } from "common-tags";

export default class UserContextMenuTestInteraction extends BotInteraction {
    constructor(client: fiiClient) {
        super(client, {
            name: "Informations de l'utilisateur",
            type: "USER"
        });
    }

    async runUserContextMenu(inter: UserContextMenuInteraction): Promise<void> {
        const member = await inter.guild?.members.fetch(inter.targetId);
        if (!member) return inter.reply("Invalid user!");

        inter.reply({
            content: stripIndents`
            ID: ${member.user.id}
            ${member.nickname ? `Surnom: ${member.nickname}` : ""} 
            Nom:${member.user.username}#${member.user.discriminator}
            isOwner: ${this.client.isOwner(member.user)}
            `,
            ephemeral: true
        });
    }
}
