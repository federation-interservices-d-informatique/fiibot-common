import { FiiClient, getDirname } from "../../src/lib.js";
(await import("dotenv")).config();

const rootDir = getDirname(import.meta.url);

new FiiClient(
    {
        intents: ["GuildMessages", "MessageContent", "Guilds"]
    },
    {
        managersSettings: {
            interactionsManagerSettings: {
                interactionsPaths: [`${rootDir}/commands`],
                includeDefaultInteractions: true
            },
            eventsManagerSettings: {
                eventsPaths: [`${rootDir}/events`]
            }
        },
        token: process.env.BOT_TOKEN ?? ""
    }
);
