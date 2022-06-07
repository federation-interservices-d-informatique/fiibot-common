import { Guild } from "discord.js";

/**
 * Checks if **the bot** can send embeds in the guild.
 * @param guild Guild to check
 * @returns True if the bot has permissions to send embeds
 */
export const canSendEmbeds = (guild: Guild): boolean =>
    guild.me?.permissions.has("EMBED_LINKS") ?? false;

/**
 * Checks if **the bot** can send messages in the guild.
 * @param guild - Guild to check
 * @returns True if the bot has permissions to send messages
 */
export const canSendMessage = (guild: Guild): boolean =>
    guild.me?.permissions.has("SEND_MESSAGES") ?? false;
