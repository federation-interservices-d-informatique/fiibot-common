import { ChatInputCommandInteraction } from "discord.js";
import { FiiClient, BotInteraction } from "../lib.js";

export default class PingInteraction extends BotInteraction {
    constructor(client: FiiClient) {
        super(client, {
            name: "ping",
            description: "Obtenir le ping du bot",
            dmPermission: true
        });
    }
    async runChatInputCommand(
        inter: ChatInputCommandInteraction
    ): Promise<void> {
        const base = Date.now();
        await inter.reply("Mesure...");
        await inter.editReply(
            `${
                Date.now() - base < 250 ? "🟢" : 500 < Date.now() ? "🔴" : "🟡"
            } Pong 🏓 en ${Date.now() - base}ms`
        );
    }
}
