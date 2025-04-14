import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {z} from "zod";
import express, {Request, Response} from "express";
import {SSEServerTransport} from "@modelcontextprotocol/sdk/server/sse.js";
import {IncomingMessage, ServerResponse, Server} from "http";
import {Transport} from "@modelcontextprotocol/sdk/shared/transport.js";
import {IconService} from "./services/icon-service.js";
import yaml from "js-yaml";

export const Logger = {
	log: console.log,
	error: console.error,
};

export class ReactIconsMcpServer {
	private readonly server: McpServer;
	private readonly iconService: IconService;
	private transports: {[sessionId: string]: SSEServerTransport} = {};
	private httpServer: Server | null = null;

	constructor() {
		this.iconService = new IconService();
		this.server = new McpServer(
			{
				name: "React Icons MCP Server",
				version: "0.1.0",
			},
			{
				capabilities: {
					logging: {},
					tools: {},
				},
			}
		);

		this.registerTools();
	}

	private registerTools(): void {
		// Tool to get icon libraries information
		this.server.tool("get_icon_libraries", "Get information about all icon libraries available in react-icons", {}, async () => {
			try {
				Logger.log("Fetching icon libraries information");
				const libraries = this.iconService.getIconLibraries();

				const yamlResult = yaml.dump(libraries);

				return {
					content: [{type: "text", text: yamlResult}],
					metadata: {
						timestamp: new Date().toISOString(),
						libraryCount: libraries.length,
					},
				};
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				Logger.error(`Error fetching icon libraries:`, message);
				return {
					isError: true,
					content: [{type: "text", text: `Error fetching icon libraries: ${message}`}],
				};
			}
		});

		// Tool to search for icons
		this.server.tool(
			"search_icons",
			"Search for icons by name or category across all icon libraries or within a specific library",
			{
				query: z.string().describe("The search query. Can be a simple term like 'arrow' or library-specific like 'fa:user'"),
				limit: z.number().optional().describe("Maximum number of results to return (default: 20)"),
			},
			async ({query, limit = 20}) => {
				try {
					Logger.log(`Searching for icons matching: ${query}`);

					const icons = this.iconService.searchIcons(query);
					const limitedIcons = icons.slice(0, limit);

					const yamlResult = yaml.dump(limitedIcons);

					return {
						content: [
							{
								type: "text",
								text: icons.length > 0 ? yamlResult : `No icons found matching '${query}'. Try a different search term or check the library prefix.`,
							},
						],
					};
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error);
					Logger.error(`Error searching for icons:`, message);
					return {
						isError: true,
						content: [{type: "text", text: `Error searching for icons: ${message}`}],
					};
				}
			}
		);

		// Tool to get icons from a specific library
		this.server.tool(
			"get_library_icons",
			"Get all icons from a specific icon library",
			{
				libraryPrefix: z.string().describe("The library prefix (e.g., 'fa' for Font Awesome, 'md' for Material Design, etc.)"),
				limit: z.number().optional().describe("Maximum number of icons to return (default: 50)"),
			},
			async ({libraryPrefix, limit = 50}) => {
				try {
					Logger.log(`Fetching icons from library: ${libraryPrefix}`);

					const library = this.iconService.getLibraryByPrefix(libraryPrefix);
					if (!library) {
						return {
							content: [
								{
									type: "text",
									text: `Library with prefix '${libraryPrefix}' not found. Available prefixes: ${this.iconService
										.getIconLibraries()
										.map(l => l.prefix)
										.join(", ")}`,
								},
							],
						};
					}

					const icons = this.iconService.getIconsFromPackage(libraryPrefix);
					const limitedIcons = icons.slice(0, limit);

					const result = {
						library,
						totalIcons: icons.length,
						icons: limitedIcons,
					};

					const yamlResult = yaml.dump(result);

					return {
						content: [{type: "text", text: yamlResult}],
					};
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error);
					Logger.error(`Error fetching icons from library ${libraryPrefix}:`, message);
					return {
						isError: true,
						content: [{type: "text", text: `Error fetching icons from library: ${message}`}],
					};
				}
			}
		);

		// Tool to get details about a specific icon
		this.server.tool(
			"get_icon_details",
			"Get detailed information about a specific icon",
			{
				libraryPrefix: z.string().describe("The library prefix (e.g., 'fa' for Font Awesome)"),
				iconName: z.string().describe("The name of the icon (e.g., 'FaUser')"),
			},
			async ({libraryPrefix, iconName}) => {
				try {
					Logger.log(`Fetching details for icon: ${libraryPrefix}/${iconName}`);

					const iconDetails = this.iconService.getIconDetails(libraryPrefix, iconName);

					if (!iconDetails) {
						return {
							content: [
								{
									type: "text",
									text: `Icon '${iconName}' not found in library '${libraryPrefix}'.`,
								},
							],
						};
					}

					// Get library info
					const libraryInfo = this.iconService.getLibraryByPrefix(libraryPrefix);

					const result = {
						icon: iconDetails,
						library: libraryInfo,
						usage: {
							import: `import { ${iconName} } from "react-icons/${libraryPrefix}";`,
							jsx: `<${iconName} />`,
							withProps: `<${iconName} size={24} color="blue" />`,
						},
					};

					const yamlResult = yaml.dump(result);

					return {
						content: [{type: "text", text: yamlResult}],
					};
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error);
					Logger.error(`Error fetching icon details:`, message);
					return {
						isError: true,
						content: [{type: "text", text: `Error fetching icon details: ${message}`}],
					};
				}
			}
		);

		// Tool to get icon usage examples
		this.server.tool(
			"get_icon_usage_examples",
			"Get code examples for using react-icons in different contexts",
			{
				libraryPrefix: z.string().optional().describe("The library prefix to get specific examples for (optional)"),
			},
			async ({libraryPrefix}) => {
				try {
					Logger.log(`Generating usage examples${libraryPrefix ? ` for ${libraryPrefix}` : ""}`);

					let iconExample = "FaUser";
					let libraryName = "Font Awesome 5";

					if (libraryPrefix) {
						const library = this.iconService.getLibraryByPrefix(libraryPrefix);
						if (library) {
							libraryName = library.name;

							// Get a sample icon from the library
							const icons = this.iconService.getIconsFromPackage(libraryPrefix);
							if (icons.length > 0) {
								iconExample = icons[0].iconName;
							}
						}
					}

					const examples = {
						basic: {
							title: "Basic Usage",
							description: `Import and use a ${libraryName} icon`,
							code: `import { ${iconExample} } from "react-icons/${libraryPrefix || "fa"}";

function MyComponent() {
  return (
    <div>
      <${iconExample} />
      <p>This is my content with an icon</p>
    </div>
  );
}`,
						},
						withProps: {
							title: "Customizing Icons",
							description: "Customize icon size, color, and other properties",
							code: `import { ${iconExample} } from "react-icons/${libraryPrefix || "fa"}";

function MyComponent() {
  return (
    <div>
      <${iconExample} 
        size={24} 
        color="blue"
        className="my-icon"
        onClick={() => alert('Icon clicked!')}
      />
    </div>
  );
}`,
						},
						withContext: {
							title: "Using IconContext",
							description: "Set default properties for all icons within a context",
							code: `import { ${iconExample} } from "react-icons/${libraryPrefix || "fa"}";
import { IconContext } from "react-icons";

function MyComponent() {
  return (
    <IconContext.Provider value={{ color: "blue", size: "1.5em", className: "global-icon" }}>
      <div>
        <${iconExample} /> {/* This icon will be blue, 1.5em, and have class "global-icon" */}
        <p>This is my content</p>
        <${iconExample} color="red" /> {/* This will override the context color */}
      </div>
    </IconContext.Provider>
  );
}`,
						},
						dynamicImport: {
							title: "Dynamic Import",
							description: "Import icons dynamically based on conditions",
							code: `import React from 'react';
import { IconContext } from "react-icons";
// Import different icon types
import { FaUser, FaCog } from "react-icons/fa";
import { MdHome } from "react-icons/md";

function DynamicIcon({ type }) {
  // Map icon types to components
  const icons = {
    user: FaUser,
    settings: FaCog,
    home: MdHome,
  };
  
  // Get the appropriate icon or default to FaUser
  const IconComponent = icons[type] || FaUser;
  
  return <IconComponent />;
}

function App() {
  return (
    <div>
      <DynamicIcon type="user" />
      <DynamicIcon type="settings" />
      <DynamicIcon type="home" />
    </div>
  );
}`,
						},
					};

					const yamlResult = yaml.dump(examples);

					return {
						content: [{type: "text", text: yamlResult}],
					};
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error);
					Logger.error(`Error generating usage examples:`, message);
					return {
						isError: true,
						content: [{type: "text", text: `Error generating usage examples: ${message}`}],
					};
				}
			}
		);
	}

	async connect(transport: Transport): Promise<void> {
		await this.server.connect(transport);

		Logger.log = (...args: any[]) => {
			this.server.server.sendLoggingMessage({
				level: "info",
				data: args,
			});
		};
		Logger.error = (...args: any[]) => {
			this.server.server.sendLoggingMessage({
				level: "error",
				data: args,
			});
		};

		Logger.log("React Icons MCP Server connected and ready to process requests");
	}

	async startHttpServer(port: number): Promise<void> {
		const app = express();

		app.get("/sse", async (req: Request, res: Response) => {
			console.log("Establishing new SSE connection");
			const transport = new SSEServerTransport("/messages", res as unknown as ServerResponse<IncomingMessage>);
			console.log(`New SSE connection established for sessionId ${transport.sessionId}`);

			this.transports[transport.sessionId] = transport;
			res.on("close", () => {
				delete this.transports[transport.sessionId];
			});

			await this.server.connect(transport);
		});

		app.post("/messages", async (req: Request, res: Response) => {
			const sessionId = req.query.sessionId as string;
			if (!this.transports[sessionId]) {
				res.status(400).send(`No transport found for sessionId ${sessionId}`);
				return;
			}
			console.log(`Received message for sessionId ${sessionId}`);
			await this.transports[sessionId].handlePostMessage(req, res);
		});

		Logger.log = console.log;
		Logger.error = console.error;

		this.httpServer = app.listen(port, () => {
			Logger.log(`HTTP server listening on port ${port}`);
			Logger.log(`SSE endpoint available at http://localhost:${port}/sse`);
			Logger.log(`Message endpoint available at http://localhost:${port}/messages`);
		});
	}

	async stopHttpServer(): Promise<void> {
		if (!this.httpServer) {
			throw new Error("HTTP server is not running");
		}

		return new Promise((resolve, reject) => {
			this.httpServer!.close((err: Error | undefined) => {
				if (err) {
					reject(err);
					return;
				}
				this.httpServer = null;
				const closing = Object.values(this.transports).map(transport => {
					return transport.close();
				});
				Promise.all(closing).then(() => {
					resolve();
				});
			});
		});
	}
}
