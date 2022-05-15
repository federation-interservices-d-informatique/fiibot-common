import { CommandInteraction } from "discord.js";
import { fiiClient, BotInteraction } from "../../../../src/lib.js";

export default class PingInteraction extends BotInteraction {
    constructor(client: fiiClient) {
        super(client, {
            name: "ping",
            description: "Get bot ping!"
        });
    }
    async runCommand(inter: CommandInteraction): Promise<void> {
        const base = Date.now();
        await inter.reply("Mesure...");
        await inter.editReply(
            `${
                Date.now() - base < 250 ? "🟢" : 500 < Date.now() ? "🔴" : "🟡"
            } Pong! 🏓 en ${Date.now() - base}ms`
        );
    }
}
