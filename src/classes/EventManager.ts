import { ClientEvents } from "discord.js";
import { fiiClient } from "./client.js";

/**
 * Event manager to reload and unload events
 */
export class EventManager {
    /** Event callback store */ // eslint-disable-next-line
    callbacks: Map<string, (...args: any[]) => void>;
    /** Discord client */
    client: fiiClient;
    /** Name => Event type */
    types: Map<string, keyof ClientEvents>;
    /**
     * Create a new event manager without events
     */
    constructor(client: fiiClient) {
        this.client = client;
        this.callbacks = new Map();
        this.types = new Map();
    }
    registerEvent = (
        name: string,
        event: keyof ClientEvents,
        // eslint-disable-next-line
        cb: (...args: any[]) => void
    ): void => {
        this.client.logger.info(
            `Registering event ${name} type ${event}`,
            "EVENTMANAGER"
        );
        this.callbacks.set(name, cb);
        this.types.set(name, event);
        this.client.on(event, cb.bind(null));
    };
    /**
     * Deletes an event handler
     * @param {string} name Name of the event handler
     */
    deleteEvent(name: string): void {
        const type = this.types.get(name);
        this.callbacks.delete(name);
        this.types.delete(name);
        this.client.removeAllListeners(type);
        Array.from(this.callbacks.entries(), ([name, cb]) => {
            if (this.types.get(name) == type) {
                this.client.on(type, cb.bind(null));
            }
        });
    }
}
