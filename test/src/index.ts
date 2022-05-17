import { fiiClient, getDirname } from "../../src/lib.js";
import { Intents } from "discord.js";
(await import("dotenv")).config();

const rootDir = getDirname(import.meta.url);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const client = new fiiClient(
    {
        intents: new Intents(["GUILD_MESSAGES", "GUILDS"])
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
        token: process.env.BOT_TOKEN || ""
    }
);
