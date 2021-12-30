import { CommandManagerSettings } from "../lib";
import { fiiClient } from "./client.js";
import { Command } from "./command.js";
import { existsSync } from "fs";
import { walkDir } from "../utils/FileSystem.js";
/**
 * Commands and aliases + paths store
 */
export class CommandManager {
    /// Commands store
    public commands: Map<string, Command>;
    /// Discord Client
    private client: fiiClient;
    /// Settings (commands path, ...)
    public settings: CommandManagerSettings;

    constructor(client: fiiClient, settings: CommandManagerSettings) {
        this.client = client;
        this.commands = new Map();
        this.settings = settings;
        this.init();
    }
    public init = (): void => {
        const commandFiles = [];
        this.settings.commandsPath.forEach((path) => {
            if (!existsSync(path)) {
                this.client.logger.error(
                    `Can't scan path ${path}: Not such file or directory`,
                    "Handler"
                );
                return;
            }
            walkDir(path).forEach((i) => {
                commandFiles.push(i);
            });
        });

        this.loadCommands(commandFiles).then(() => {
            this.client.logger.ok("Loaded all commands", "LOADER");
        });
    };
    loadCommands = async (files: string[]): Promise<void> => {
        files.forEach(this.loadCommand);
        const commandsList = await this.client.application.commands.fetch();
        this.commands.forEach((cmd) => {
            const command = commandsList.filter(
                (c) => c.name === cmd.appCommand.name
            );
            if (command.size === 0) {
                this.client.logger.info(
                    `Creating command ${cmd.appCommand.name}`,
                    "LOADER"
                );
                this.client.application.commands.create(cmd.appCommand);
            } else {
                if (!command.first().equals(cmd.appCommand)) {
                    this.client.logger.info(
                        `Editing command ${cmd.appCommand.name}`,
                        "LOADER"
                    );
                    this.client.application.commands.edit(
                        command.first().id,
                        cmd.appCommand
                    );
                }
            }
        });
        commandsList.forEach(async (cmd) => {
            if (!this.commands.has(cmd.name)) {
                this.client.logger.warn(
                    `Found deleted command ${cmd.name}, removing if from application`,
                    "LOADER"
                );
                await this.client.application.commands.delete(cmd.id);
            }
        });
    };
    loadCommand = async (file: string): Promise<void> => {
        const imported = (await import(file)).default;
        const cmd: Command = new imported(this.client);
        this.client.logger.info(
            `Loading command ${cmd.appCommand.name}`,
            "LOADER"
        );
        this.commands.set(cmd.appCommand.name, cmd);
    };
}
