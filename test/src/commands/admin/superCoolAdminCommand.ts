import { ChatInputCommandInteraction } from "discord.js";
import { BotInteraction, FiiClient } from "../../../../src/lib.js";

export default class SuperCoolAdminCommand extends BotInteraction {
    constructor(client: FiiClient) {
        super(client, {
            name: "admincomm",
            description: "UwU"
        });
    }

    async runChatInputCommand(
        inter: ChatInputCommandInteraction
    ): Promise<void> {
        await inter.reply("U admin");
    }
}
