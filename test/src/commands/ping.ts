import { CommandInteraction, Message } from "discord.js";
import { fiiClient } from "../../../src";
import { Command } from "../../../src/classes/command.js";

export default class PingCommand extends Command {
    constructor(client: fiiClient) {
        super(client, {
            name: 'ping',
            description: 'Get bot ping'
        });
    }
    async run(inter: CommandInteraction): Promise<void> {
        inter.reply("Heeeello");
    }
}
