import { fiiClient } from "../../src/lib.js";
import { config as envconfig } from "dotenv";
import { dirname } from "path";
import { Intents } from "discord.js";
envconfig();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const client = new fiiClient(
    {
        intents: new Intents(["GUILD_MESSAGES", "GUILDS"])
    },
    {
        interactionsManagerSettings: {
            interactionsPath: [`${dirname(import.meta.url.substr(7))}/commands`]
        },
        owners: process.env.OWNERS?.split(",").map((o) => parseInt(o)) || [],
        token: process.env.BOT_TOKEN || ""
    }
);
