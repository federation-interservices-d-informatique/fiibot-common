/**
 * Server names
 */
export enum SERVERS {
    "696156347946762240" = "MicroMax",
    "706283053160464395" = "Hub central discord",
    "456901919344951298" = "Communauté Linuxienne Indépendante",
    "745664551831339150" = "Atelier des projets",
    "622831434427662346" = "Linux Pour Tous"
}

export type ServersKey = keyof typeof SERVERS;

/**
 * Servers 3-letter "codenames"
 */
export enum SERVER_CODENAMES {
    "696156347946762240" = "MIM",
    "706283053160464395" = "HUB",
    "456901919344951298" = "CLI",
    "745664551831339150" = "ADP",
    "622831434427662346" = "LPT"
}

export type ServerCodenamesKey = keyof typeof SERVER_CODENAMES;

/**
 * FII Servers list
 */
export const SERVERS_LIST = [
    "706283053160464395", // HUB
    "696156347946762240", // MicroMax
    "456901919344951298", // CLI
    "622831434427662346", // LPT
    "745664551831339150" // ADP
];

/**
 * Servers emoji headers
 */
export enum SERVERS_HEADERS {
    "622831434427662346" = "<:lpt:970386551945187338> LPT",
    "696156347946762240" = "<:mim:970386612162797638> MIM",
    "456901919344951298" = "<:cli:970386525906948106> CLI",
    "706283053160464395" = "<:hub:970386593405894687> HUB",
    "793993155343024160" = "<:hub:970386593405894687> TEST"
}

export type ServersHeadersKey = keyof typeof SERVERS_HEADERS;

/**
 * FII ID Regex
 */
export const FII_ID_REGEX =
    /FII-(LPT|CLI|MIM|HUB|ADP)-[0-9]{6}-[0-9]{10}-FII/gim;
