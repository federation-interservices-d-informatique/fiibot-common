import { fiiClient } from "../../src/index.js";
import { config as envconfig } from "dotenv";
import { dirname } from "path";
import { Intents, Message } from "discord.js";
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
const cb = (msg: Message) => {
    if (msg.author.bot) return;
    msg.channel.send(msg.content);
    if (msg.content === "delete") {
        client.eventManager.deleteEvent("logmessage");
    }
};
client.eventManager.registerEvent("logmessage", "messageCreate", cb);
client.login(process.env.BOT_TOKEN);
