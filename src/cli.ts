#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "dotenv";
import { resolve } from "path";
import { getServerConfig } from "./config.js";
import { ReactIconsMcpServer } from "./server.js";

// Load .env from the current working directory
config({ path: resolve(process.cwd(), ".env") });

export async function startServer(): Promise<void> {
  // Check if we're running in stdio mode (e.g., via CLI)
  const isStdioMode = process.env.NODE_ENV === "cli" || process.argv.includes("--stdio");

  const config = getServerConfig(isStdioMode);
  
  const server = new ReactIconsMcpServer();

  if (isStdioMode) {
    console.log("Initializing React Icons MCP Server in stdio mode...");
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } else {
    console.log(`Initializing React Icons MCP Server in HTTP mode on port ${config.port}...`);
    await server.startHttpServer(config.port);
  }
}

// If we're being executed directly (not imported), start the server
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}

// Helper function to get the file path from the import.meta.url
function fileURLToPath(url: string): string {
  if (url.startsWith('file://')) {
    // For Windows, remove leading slash after file:// protocol
    if (process.platform === 'win32') {
      return decodeURIComponent(url.substring(8).replace(/\//g, '\\'));
    }
    return decodeURIComponent(url.substring(7));
  }
  return url;
}