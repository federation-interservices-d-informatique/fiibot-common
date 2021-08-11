import { PermissionResolvable } from "discord.js";
export * from "./classes/client.js";
/**
 * fii Client options
 */
export interface fiiClientOptions {
    /**
     * Prefix of the client
     */
    prefix: string;
    /**
     * Settings to pass to CommandManager
     */
    commandManagerSettings: CommandManagerSettings;
    /**
     * List of owners
     */
    owners: number[];
}
/**
 * Command options
 */
export interface commandOptions {
    /** Set to true if the command can only be run in a guild */
    guildOnly?: boolean;
    /** Set to true if the command can be run by an owner  */
    ownerOnly?: boolean;
    /** List of permissions required by **the client** to run the command */
    clientPermissions?: Array<PermissionResolvable>;
    /** List of permissions required by **the user (executor)** to run the command */
    userPermissions?: Array<PermissionResolvable>;
    /** Link to command docs */
    doclink?: string;
}

/**
 * CommandManager settings
 */
export interface CommandManagerSettings {
    /** Commands paths */
    commandsPath: Array<string>;
}

export const VERSION = "1.0.0";
