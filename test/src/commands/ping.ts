import { Message } from "discord.js";
import { fiiClient } from "../../../src";
import { Command } from "../../../src/classes/command.js";

export default class PingCommand extends Command {
    constructor(client: fiiClient) {
        super(client, {
            name: "ping",
            description: "Get bot's ping",
            aliases: ["pong"]
        });
    }
    async run(message: Message): Promise<void> {
        message.reply("Heeeello");
    }
}
