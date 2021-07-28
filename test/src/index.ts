import { fiiClient } from "../../src/index.js";
import { config as envconfig } from "dotenv";

envconfig();

const client = new fiiClient(
    {},
    {
        prefix: "$"
    }
);

client.login(process.env.BOT_TOKEN);
