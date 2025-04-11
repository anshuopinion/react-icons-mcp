import fetch from "node-fetch";
import {getServerConfig} from "./config.js";

async function checkServerHealth(url: string): Promise<boolean> {
	try {
		const response = await fetch(url);
		console.log(`Server responded with status: ${response.status}`);
		return response.status >= 200 && response.status < 500;
	} catch (error) {
		console.error("Error connecting to server:", error);
		return false;
	}
}

async function main() {
	const config = getServerConfig(false);
	const sseUrl = `http://localhost:${config.port}/sse`;

	console.log(`Checking server health at ${sseUrl}...`);
	const isHealthy = await checkServerHealth(sseUrl);

	if (isHealthy) {
		console.log("✅ Server is running and responding to requests");
	} else {
		console.log("❌ Server is not responding properly");
	}
}

if (require.main === module) {
	main().catch(console.error);
}

export {checkServerHealth};
