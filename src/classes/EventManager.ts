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
    /**
     * Register a new event
     * @param name The event name
     * @param event Type of event
     * @param cb The callback code
     * @param log Set to false if the event must not be logged
     */
    registerEvent = (
        name: string,
        event: keyof ClientEvents,
        // eslint-disable-next-line
        cb: (...args: any[]) => void,
        log = true
    ): void => {
        if (log) {
            this.client.logger.info(
                `Registering event ${name} type ${event}`,
                "EVENTMANAGER"
            );
        }
        this.callbacks.set(name, cb);
        this.types.set(name, event);
        this.client.on(event, cb.bind(null));
    };
    /**
     * Deletes an event handler
     * @param {string} name Name of the event handler
     * @param log Disable if the event must not be logged
     */
    deleteEvent(name: string, log = true): void {
        if (!this.callbacks.has(name) || !this.types.has(name)) {
            this.client.logger.error(
                `Can't delete event ${name}: not found`,
                "EVENTHANDLER"
            );
            return;
        }
        if (log) {
            this.client.logger.warn(`Deleting event ${name}`, "EVENTMANAGER");
        }
        const eventType = this.types.get(name);

        this.callbacks.delete(name);
        this.types.delete(name);
        this.client.removeAllListeners(eventType);

        Array.from(this.callbacks.entries(), ([name, cb]) => {
            if (this.types.get(name) == eventType && eventType) {
                this.client.on(eventType, cb.bind(null));
            }
        });
    }
    /**
     * Reload an event and modify its callback
     * @param name The name of the event
     * @param cb The new callback
     */
    // eslint-disable-next-line
    setCallback(name: string, cb: (...args: any[]) => void): void {
        if (!this.callbacks.has(name) || !this.types.has(name)) {
            this.client.logger.error(
                `Can't modify event ${name}: not found`,
                "EVENTHANDLER"
            );
            return;
        }
        this.client.logger.info(`Reloading event ${name}`, "EVENTHANDLER");
        const eventType = this.types.get(name);
        this.deleteEvent(name, false);
        if (eventType) {
            this.registerEvent(name, eventType, cb, false);
        }
    }
}
