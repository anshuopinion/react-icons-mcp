#!/usr/bin/env node

import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {config} from "dotenv";
import {resolve} from "path";
import {fileURLToPath} from "url";
import {getServerConfig} from "./config.js";
import {ReactIconsMcpServer} from "./server.js";

// Load .env from the current working directory
config({path: resolve(process.cwd(), ".env")});

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
if (process.argv[1]) {
	startServer().catch(error => {
		console.error("Failed to start server:", error);
		process.exit(1);
	});
}
