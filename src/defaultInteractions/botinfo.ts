import { CommandInteraction } from "discord.js";
import { BotInteraction, FiiClient } from "../lib.js";

export default class BotInfoInteraction extends BotInteraction {
    constructor(client: FiiClient) {
        super(client, {
            name: "botinfo",
            description: "Obtenir les informations du bot"
        });
    }

    async runCommand(inter: CommandInteraction): Promise<void> {
        const uptime = this.client?.uptime || process.uptime() * 1000;
        const upDays = Math.floor(uptime / 86400000);
        const upHours = Math.floor(uptime / 3600000) % 24;
        const upMins = Math.floor(uptime / 60000) % 60;
        const upSeconds = Math.floor(uptime / 1000) % 60;

        inter.reply({
            ephemeral: true,
            embeds: [
                {
                    title: `Informations de ${
                        this.client.user?.username ?? "moi"
                    }`,
                    color: "RANDOM",
                    fields: [
                        {
                            name: "Uptime",
                            value: `${upDays} jour${
                                upDays !== 1 ? "s" : ""
                            }, ${upHours} heure${
                                upHours !== 1 ? "s" : ""
                            }, ${upMins} minute${
                                upMins !== 1 ? "s" : ""
                            } et ${upSeconds} seconde${
                                upSeconds !== 1 ? "s" : ""
                            }`
                        },
                        {
                            name: "Serveurs",
                            value: this.client.guilds.cache.size.toString(),
                            inline: true
                        }
                    ]
                }
            ],
            components: [
                {
                    type: "ACTION_ROW",
                    components: [
                        {
                            type: "BUTTON",
                            style: "LINK",
                            label: "GitHub",
                            emoji: "<:octocat:793998492787802142>",
                            url: "https://github.com/federation-interservices-d-informatique"
                        },
                        {
                            type: "BUTTON",
                            style: "LINK",
                            label: "License (MIT)",
                            emoji: "⚖️",
                            url: "https://github.com/federation-interservices-d-informatique/fiibot-common/blob/main/LICENSE"
                        },
                        {
                            type: "BUTTON",
                            style: "LINK",
                            label: "Invitation",
                            emoji: "📩",
                            url:
                                this.client.application?.customInstallURL ??
                                this.client.generateInvite({
                                    scopes: ["applications.commands", "bot"],
                                    permissions: ["ADMINISTRATOR"]
                                }),
                            // Disable invitations for non-owners if the bot is not public
                            disabled: this.client.application?.botPublic
                                ? false
                                : !this.client.isOwner(inter.user)
                        }
                    ]
                }
            ]
        });
    }
}
