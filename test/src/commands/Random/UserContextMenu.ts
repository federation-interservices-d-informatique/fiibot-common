import {
    ApplicationCommandType,
    MessageFlags,
    UserContextMenuCommandInteraction
} from "discord.js";
import { BotInteraction, FiiClient } from "../../../../src/lib.js";
import { stripIndents } from "common-tags";

export default class UserContextMenuTestInteraction extends BotInteraction {
    constructor(client: FiiClient) {
        super(client, {
            name: "Informations de l'utilisateur",
            type: ApplicationCommandType.User
        });
    }

    async runUserContextMenuCommand(
        inter: UserContextMenuCommandInteraction
    ): Promise<void> {
        const member = await inter.guild?.members.fetch(inter.targetId);
        if (!member) {
            await inter.reply("Invalid user!");
            return;
        }
        await inter.reply({
            content: stripIndents`
                ID: ${member.user.id}
                ${member.nickname ? `Surnom: ${member.nickname}` : ""} 
                Nom:${member.user.username}#${member.user.discriminator}
                isOwner: ${this.client.isOwner(member.user)}
            `,
            flags: MessageFlags.Ephemeral
        });
    }
}
