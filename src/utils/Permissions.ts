import { Guild } from "discord.js";

/**
 * Checks if **the bot** can send embeds in the guild.
 */
export const canSendEmbeds = (guild: Guild): boolean => {
    return guild.me ? guild.me.permissions.has("EMBED_LINKS") : false;
};
/**
 *  Checks if **the bot** can send messages in the guild.
 * This check is done by the Command#hasBotPermission if not overwritten.
 */
export const canSendMessage = (guild: Guild): boolean => {
    return guild.me ? guild.me.permissions.has("SEND_MESSAGES") : false;
};
