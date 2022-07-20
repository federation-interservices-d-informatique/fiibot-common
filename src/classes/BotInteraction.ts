import {
    ApplicationCommandData,
    ApplicationCommandType,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Interaction,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction
} from "discord.js";

import { InteractionOptions } from "../lib";
import { FiiClient } from "./FiiClient.js";

/**
 * Base interaction
 */
export class BotInteraction {
    /** Command options (name, description, ...) */
    extraOptions: InteractionOptions;
    /** Discord client (we can also use message.client) */
    client: FiiClient;
    /** Command temp data */
    data: Map<string, string | unknown>;
    /** Data for applications command */
    appCommand: ApplicationCommandData;
    /**
     * Create a new command (must be extended)
     * @param client - The client
     * @param extraOptions - Command extra options
     */
    constructor(
        client: FiiClient,
        appCommand: ApplicationCommandData,
        extraOptions?: InteractionOptions,
        data?: Map<string, unknown>
    ) {
        this.client = client;
        this.appCommand = appCommand;
        // Options doesn't exist on contextmenus
        if (this.appCommand.type === ApplicationCommandType.ChatInput) {
            if (!this.appCommand.options) {
                this.appCommand.options = [];
            }
        }
        this.extraOptions = extraOptions || {};
        this.data = data || new Map();
    }

    /**
     * Check if **the user** has permission to use this command
     * @param inter - The interaction
     * @returns {boolean} Whetever the user has permission to use command
     */
    userHasPermission(inter: Interaction): boolean {
        return this.extraOptions.ownerOnly
            ? this.client.isOwner(inter.user)
            : true;
    }

    /**
     * Handle interaction (call runInteractionType)
     * @param inter The interaction
     */
    async run(inter: Interaction): Promise<void> {
        // Commands / Base interacitons
        if (inter instanceof AutocompleteInteraction)
            return this.runAutoComplete(inter);
        if (inter instanceof ChatInputCommandInteraction)
            return this.runChatInputCommand(inter);

        // ContextMenu interactions
        if (inter.isMessageContextMenuCommand())
            return this.runMessageContextMenuCommand(inter);
        if (inter.isUserContextMenuCommand())
            return this.runUserContextMenuCommand(inter);

        if (inter.isRepliable()) inter.reply("Unknown interaction type");
    }

    /**
     * Handles an AutoCompleteInteraction
     * @param inter - The interaction
     */
    async runAutoComplete(inter: AutocompleteInteraction): Promise<void> {
        await inter.respond([]); // Just don't send suggestions because we can't reply
    }

    /**
     * Handles a CommandInteraction
     * @param inter - The interaction
     */
    async runChatInputCommand(
        inter: ChatInputCommandInteraction
    ): Promise<void> {
        inter.reply("Run for ChatInputCommandInteraction not implemented!");
    }

    /**
     * Handles a MessageContextMenuCommandInteraction
     * @param inter - The interaction
     */
    async runMessageContextMenuCommand(
        inter: MessageContextMenuCommandInteraction
    ): Promise<void> {
        inter.reply(
            "Run for MessageContextMenuCommandInteraction is not implemented!"
        );
    }

    /**
     * Handles a UserContextMenuCommandInteraction
     * @param inter - The interaction
     */
    async runUserContextMenuCommand(
        inter: UserContextMenuCommandInteraction
    ): Promise<void> {
        inter.reply(
            "Run for UserContextMenuCommandInteraction is not implemented!"
        );
    }
}
