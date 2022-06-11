import { ChatInputCommandInteraction } from "discord.js";
import { BotInteraction, FiiClient } from "../../../../src/lib.js";

export default class SuperCoolAdminCommand extends BotInteraction {
    constructor(client: FiiClient) {
        super(client, {
            name: "admincommand",
            defaultMemberPermissions: ["Administrator"],
            description: "UwU"
        });
    }

    async runChatInputCommand(
        inter: ChatInputCommandInteraction
    ): Promise<void> {
        inter.reply("U admin");
    }
}
