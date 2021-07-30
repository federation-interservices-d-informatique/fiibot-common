import { fiiClient } from "../../src/index.js";
import { config as envconfig } from "dotenv";
import { dirname } from "path";
import { Intents } from "discord.js";
envconfig();
const client = new fiiClient(
    {
        intents: new Intents(["GUILD_MESSAGES", "GUILDS"])
    },
    {
        prefix: "$",
        commandManagerSettings: {
            commandsPath: [`${dirname(import.meta.url.substr(7))}/commands`]
        }
    }
);
client.login(process.env.BOT_TOKEN);
