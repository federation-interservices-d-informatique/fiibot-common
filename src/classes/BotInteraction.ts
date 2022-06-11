import {
    ApplicationCommandData,
    ApplicationCommandType,
    AutocompleteInteraction,
    ChannelType,
    ChatInputCommandInteraction,
    Colors,
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
        if (!inter.user) return false;

        if (
            (!inter.guildId || inter.channel?.type === ChannelType.DM) &&
            !this.extraOptions.ownerOnly
        ) {
            return true;
        }
        if (
            !this.extraOptions.ownerOnly &&
            (!this.extraOptions.userPermissions ||
                this.extraOptions.userPermissions?.length === 0)
        ) {
            return true;
        }
        if (this.client.isOwner(inter.user)) {
            return true;
        }
        if (this.extraOptions.ownerOnly && !this.client.isOwner(inter.user)) {
            if (inter.isRepliable())
                inter.reply({
                    ephemeral: true,
                    content: `La commande \`${this.appCommand.name}\` ne peut être utilisée que par un owner du bot!`
                });
            return false;
        }

        if (inter.channel?.type !== ChannelType.DM && inter.channel) {
            const missing =
                inter.channel
                    .permissionsFor(inter.user)
                    ?.missing(this.extraOptions.userPermissions || []) || [];

            if (missing.length > 0) {
                if (inter.isRepliable())
                    inter.reply({
                        ephemeral: true,
                        embeds: [
                            {
                                title: "Manque de permissions:",
                                description: `La commande ${
                                    this.appCommand.name
                                } requiert les permissions suivantes: ${this.extraOptions.userPermissions?.join(
                                    ","
                                )}`,
                                color: Colors.Red
                            }
                        ]
                    });

                return false;
            }
        }
        return true;
    }

    /**
     * Check if **the bot** has all required permissions to handle interaction
     * @param inter - The interaction
     * @returns {boolean} Whetever the bot has permission to handle interaction
     */
    botHasPermission(inter: Interaction): boolean {
        if (!inter.guildId || inter.channel?.type === ChannelType.DM)
            return true;
        if (!inter.channel || !inter.user || !inter.guild?.members.me)
            return false;
        if (inter instanceof AutocompleteInteraction) {
            return true;
        }

        const missing =
            inter.channel
                .permissionsFor(inter.guild.members?.me)
                ?.missing(this.extraOptions.clientPermissions || []) || [];

        if (missing.length > 0) {
            if (inter.isRepliable())
                inter.reply({
                    ephemeral: true,
                    embeds: [
                        {
                            title: "Manque de permissions:",
                            description: `Je ne peux pas exécuter la commande \`${
                                this.appCommand.name
                            }\` car elle requiert que j'aie les permissions suivantes: ${this.extraOptions.clientPermissions?.join(
                                ","
                            )}`,
                            color: Colors.Red
                        }
                    ]
                });

            return false;
        }
        return true;
    }

    /**
     * Handle interaction (call run*{InteractionType}*)
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
     * @param inter {AutoCompleteInteraction} - The interaction
     */
    async runAutoComplete(inter: AutocompleteInteraction): Promise<void> {
        await inter.respond([]); // Just don't send suggestions because we can't reply
    }

    /**
     * Handles a CommandInteraction
     * @param inter {CommandInteraction} - The interaction
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
