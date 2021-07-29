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
    /// Aliases store
    public aliases: Map<string, Command>;
    /// Paths to commands (for reloading)
    private paths: Map<string, string>;
    /// Discord Client
    private client: fiiClient;
    /// Settings (commands path, ...)
    public settings: CommandManagerSettings;

    constructor(client: fiiClient, settings: CommandManagerSettings) {
        this.client = client;
        this.paths = new Map();
        this.aliases = new Map();
        this.commands = new Map();
        this.settings = settings;
        this.init();
    }
    public init = () => {
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
        commandFiles.forEach(async (file) => {
            await this.loadCommand(file);
        });
    };
    loadCommand = async (file: string) => {
        const imported = (await import(file)).default;
        const cmd: Command = new imported();
        this.client.logger.info(`Loading command ${cmd.infos.name}`, "LOADER");
        this.commands.set(cmd.infos.name, cmd);
        if (cmd.infos.aliases) {
            cmd.infos.aliases.forEach((alias) => {
                this.aliases.set(alias, cmd);
            });
        }
        this.paths.set(cmd.infos.name, file);
    };
}
