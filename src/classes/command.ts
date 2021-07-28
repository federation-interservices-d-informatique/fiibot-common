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
    data: Map<string, any>;
    /**
     * Create a new command (must be extended)
     * @param client - The client
     * @param options - Command options
     */
    constructor(
        client: fiiClient,
        options: commandOptions,
        data?: Map<string, any>
    ) {
        this.client = client;
        this.infos = options;
        this.data = data || new Map<string, any>();
    }
}
