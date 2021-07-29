import { fiiClient } from "../../src/index.js";
import { config as envconfig } from "dotenv";
import { dirname } from "path";
envconfig();
const client = new fiiClient(
    {},
    {
        prefix: "$",
        commandManagerSettings: {
            commandsPath: [`${dirname(import.meta.url.substr(7))}/commands`]
        }
    }
);

client.login(process.env.BOT_TOKEN);
