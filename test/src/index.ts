import { fiiClient } from "../../src/index.js";

const client = new fiiClient(
    {},
    {
        prefix: "$"
    }
);

client.logger.error("msg", "i");
client.logger.info("msg", "a");
client.logger.ok("msg", "o");
client.logger.warn("msg", "m");
client.login(process.env.BOT_TOKEN);
