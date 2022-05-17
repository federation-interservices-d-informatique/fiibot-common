import { ClientEvents, PermissionResolvable } from "discord.js";

export * from "./classes/index.js";
export * from "./utils/index.js";

/**
 * fii Client options
 */
export interface fiiClientOptions {
    /**
     * Settings to pass to different managers
     */
    managersSettings: ManagersSettings;
    /**
     * Discord token
     */
    token: string;
}

/**
 * Command options
 */
export interface interactionOptions {
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
 * Settings for different managers
 */
export interface ManagersSettings {
    /** InteractionsManager Settings */
    interactionsManagerSettings: InteractionsManagerSettings;
    /** EventsManager Settings */
    eventsManagerSettings: EventsManagerSettings;
}

/**
 * InteractionsManagers Settings
 */
export interface InteractionsManagerSettings {
    /** Interaction paths */
    interactionsPaths: Array<string>;
}

/**
 * EventsManager Settings
 */
export interface EventsManagerSettings {
    /** Events paths */
    eventsPaths: Array<string>;
}

export interface UntypedEventData {
    name: string;
    type: keyof ClientEvents;
    callback: (...args: unknown[]) => Promise<void>;
}

export interface EventData<T extends keyof ClientEvents> {
    name: string;
    type: T;
    callback: (...args: ClientEvents[T]) => Promise<void>;
}
