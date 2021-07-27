import { fiiClient } from "../../src/index.js";

const client = new fiiClient(
    {},
    {
        prefix: "$"
    }
);

client.login(process.env.BOT_TOKEN);
