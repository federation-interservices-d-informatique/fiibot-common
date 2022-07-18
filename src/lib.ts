import { ClientEvents, PermissionResolvable } from "discord.js";

export * from "./classes/index.js";
export * from "./utils/index.js";

/**
 * FII Client options
 */
export interface FiiClientOptions {
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
export interface InteractionOptions {
    /** Set to true if the command can be run by an owner  */
    ownerOnly?: boolean;
    /** List of permissions required by **the client** to run the command */
    clientPermissions?: Array<PermissionResolvable>;
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
    /** True to include default command interactions (ping, botinfo, ...) */
    includeDefaultInteractions?: boolean;
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

/**
 * Just a small helper because export default can't be easily typed
 * @param data Event's data
 * @returns Same data
 */
export const clientEvent = <T extends keyof ClientEvents>(
    data: EventData<T>
): EventData<T> => data;
