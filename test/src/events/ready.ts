import { Client } from "discord.js";
import { clientEvent } from "../../../src/lib.js";
export default clientEvent({
    name: "setPresence",
    type: "ready",
    callback: async (client: Client) => {
        await client.user?.setActivity({
            name: "Faire des choses"
        });
    }
});
