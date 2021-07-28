import { WebhookClient } from "discord.js";
import { parentPort } from "worker_threads";

const whclient = new WebhookClient(
    process.env.LOGS_WEBHOOK_ID,
    process.env.LOGS_WEBHOOK_TOKEN
);

const postHook = (msg: string): void => {
    /* eslint-disable-next-line */
    whclient.send(msg).catch(() => {});
};
parentPort.on("message", (msg: string) => {
    parentPort.postMessage(postHook(msg));
});
