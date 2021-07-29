import { Message } from "discord.js";
import { commandOptions } from "../lib";
import { fiiClient } from "./client";

/**
 * Bot command
 */
export class Command {
    /** Command options (name, description, ...) */
    infos: commandOptions;
    /** Discord client (we can also use message.client) */
    client: fiiClient;
    /** Command temp data */
    data: Map<string, string | unknown>;
    /**
     * Create a new command (must be extended)
     * @param client - The client
     * @param options - Command options
     */
    constructor(
        client: fiiClient,
        options: commandOptions,
        data?: Map<string, unknown>
    ) {
        this.client = client;
        this.infos = options;
        this.data = data || new Map();
    }
    // eslint-disable-next-line
    async run(message: Message, args: string[]): Promise<void> {
        message.channel.send("NYI!");
    }
}
