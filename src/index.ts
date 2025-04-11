// Re-export the server and its types
export { ReactIconsMcpServer } from "./server.js";
export { getServerConfig } from "./config.js";
export { startServer } from "./cli.js";
export type { IconMetadata, IconLibraryInfo } from "./services/icon-service.js";
export { IconService } from "./services/icon-service.js";