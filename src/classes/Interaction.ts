import {
    ApplicationCommandData,
    AutocompleteInteraction,
    BaseCommandInteraction,
    CommandInteraction,
    Interaction,
    MessageContextMenuInteraction,
    UserContextMenuInteraction
} from "discord.js";

import { ApplicationCommandTypes } from "discord.js/typings/enums";
import { interactionOptions } from "../lib";
import { canSendEmbeds } from "../utils/Permissions.js";
import { fiiClient } from "./client";

/**
 * Base interaction
 */
export class BotInteraction {
    /** Command options (name, description, ...) */
    extraOptions: interactionOptions;
    /** Discord client (we can also use message.client) */
    client: fiiClient;
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
        client: fiiClient,
        appCommand: ApplicationCommandData,
        extraOptions?: interactionOptions,
        data?: Map<string, unknown>
    ) {
        this.client = client;
        this.appCommand = appCommand;
        // Options doesn't exist on contextmenus
        if (
            this.appCommand.type === ApplicationCommandTypes.CHAT_INPUT ||
            this.appCommand.type === "CHAT_INPUT"
        ) {
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
    userHasPermission(inter: BaseCommandInteraction): boolean {
        if (!inter.channel || !inter.user) return false;

        if (inter.channel.type === "DM" && !this.extraOptions.ownerOnly) {
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
            inter.reply({
                ephemeral: true,
                content: `La commande \`${this.appCommand.name}\` ne peut être utilisée que par un owner du bot!`
            });
            return false;
        }
        if (this.extraOptions.guildOnly && inter.channel.type === "DM")
            return false;
        if (inter.channel.type !== "DM") {
            const missing =
                inter.channel
                    .permissionsFor(inter.user)
                    ?.missing(this.extraOptions.userPermissions || []) || [];

            if (missing.length > 0) {
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
                            color: "RED"
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
    botHasPermission(inter: BaseCommandInteraction): boolean {
        if (!inter.channel || !inter.user || !inter.guild?.me) return false;
        if (inter.channel.type === "DM") return true;
        if (inter.isAutocomplete()) {
            return false;
        }

        const missing =
            inter.channel
                .permissionsFor(inter.guild.me)
                ?.missing(this.extraOptions.clientPermissions || []) || [];

        if (missing.length > 0) {
            if (canSendEmbeds(inter.guild)) {
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
                            color: "RED"
                        }
                    ]
                });
            } else {
                inter.reply({
                    ephemeral: true,
                    content: `Erreur: Je ne peux pas exécuter la commande \`${
                        this.appCommand.name
                    }\` car elle requiert que j'aie les permissions suivantes: ${this.extraOptions.clientPermissions?.join(
                        ","
                    )}`
                });
            }
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
        if (inter.isAutocomplete()) return this.runAutoComplete(inter);
        if (inter.isCommand()) return this.runCommand(inter);

        // ContextMenu interactions
        if (inter.isMessageContextMenu())
            return this.runMessageContextMenu(inter);
        if (inter.isUserContextMenu()) return this.runUserContextMenu(inter);
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
    async runCommand(inter: CommandInteraction): Promise<void> {
        inter.reply("Run for CommandInteraction not implemented!");
    }

    /**
     * Handles a MessageContextMenuInteraction
     * @param inter {MessageContextMenuInteraction} - The interaction
     */
    async runMessageContextMenu(
        inter: MessageContextMenuInteraction
    ): Promise<void> {
        inter.reply(
            "Run for MessageContextMenuInteraction is not implemented!"
        );
    }

    /**
     * Handles a UserContextMenuInteraction
     * @param inter {ContextMenuInteraction} - The interaction
     */
    async runUserContextMenu(inter: UserContextMenuInteraction): Promise<void> {
        inter.reply("Run for UserContextMenuInteraction is not implemented!");
    }
}
