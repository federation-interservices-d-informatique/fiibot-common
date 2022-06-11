import {
    ButtonStyle,
    ChatInputCommandInteraction,
    Colors,
    ComponentType,
    OAuth2Scopes
} from "discord.js";
import { BotInteraction, FiiClient } from "../lib.js";

export default class BotInfoInteraction extends BotInteraction {
    constructor(client: FiiClient) {
        super(client, {
            name: "botinfo",
            description: "Obtenir les informations du bot"
        });
    }

    async runChatInputCommand(
        inter: ChatInputCommandInteraction
    ): Promise<void> {
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
                    color: Colors.Blue,
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
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            style: ButtonStyle.Link,
                            label: "GitHub",
                            emoji: "<:octocat:793998492787802142>",
                            url: "https://github.com/federation-interservices-d-informatique"
                        },
                        {
                            type: ComponentType.Button,
                            style: ButtonStyle.Link,
                            label: "License (MIT)",
                            emoji: "⚖️",
                            url: "https://github.com/federation-interservices-d-informatique/fiibot-common/blob/main/LICENSE"
                        },
                        {
                            type: ComponentType.Button,
                            style: ButtonStyle.Link,
                            label: "Invitation",
                            emoji: "📩",
                            url:
                                this.client.application?.customInstallURL ??
                                this.client.generateInvite({
                                    scopes: [
                                        OAuth2Scopes.ApplicationsCommands,
                                        OAuth2Scopes.Bot
                                    ],
                                    permissions: ["Administrator"]
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
