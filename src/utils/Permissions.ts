import { Message } from "discord.js";

/**
 * Checks if **the bot** can send embeds in the guild.
 */
export const canSendEmbeds = (message: Message): boolean => {
    return message.guild.me.permissions.has("EMBED_LINKS");
};
/**
 *  Checks if **the bot** can send messages in the guild.
 * This check is done by the Command#hasBotPermission if not overwritten.
 */
export const canSendMessage = (message: Message): boolean => {
    return message.guild.me.permissions.has("SEND_MESSAGES");
};
