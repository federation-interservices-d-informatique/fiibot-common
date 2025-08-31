import { WebhookClient } from "discord.js";
import { parentPort } from "worker_threads";

const whClient = new WebhookClient(
    // Just values to fill, will crash anyway
    {
        id: process.env.LOGS_WEBHOOK_ID ?? "5",
        token: process.env.LOGS_WEBHOOK_TOKEN ?? "5"
    },
    {}
);

const postHook = (msg: string): void => {
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    whClient.send(msg).catch(() => {});
};

// Should work in all cases, but TypeScript gives a warning so we add ?.
parentPort?.on("message", (msg: string) => {
    postHook(msg);
});
