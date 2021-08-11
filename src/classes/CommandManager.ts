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

        // Flush commands list
        this.client.application.commands.set([]);
        commandFiles.forEach(async (file) => {
            await this.loadCommand(file);
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
        this.client.application.commands.create(cmd.appCommand);
    };
}
