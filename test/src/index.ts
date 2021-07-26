import { FiiClient } from "../../src/index.js";

const client = new FiiClient({}, {});

client.login(process.env.BOT_TOKEN);