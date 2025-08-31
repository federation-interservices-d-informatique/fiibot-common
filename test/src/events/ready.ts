import { Client } from "discord.js";
import { clientEvent } from "../../../src/lib.js";
export default clientEvent({
    name: "setPresence",
    type: "clientReady",
    callback: async (client: Client) => {
        client.user?.setActivity({
            name: "Faire des choses"
        });
    }
});
