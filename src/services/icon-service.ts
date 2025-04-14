// Service to interact with react-icons library
import {iconsLib} from "./data.js";
import {Logger} from "~/server.js";

export interface IconMetadata {
	packageName: string;
	iconName: string;
	fullName: string;
	svgPath?: string;
}

export type IconLibraryInfo = {
	prefix: string;
	name: string;
	description: string;
	totalIcons: number;
	license: string;
	url: string;
};

export class IconService {
	private iconLibraries: IconLibraryInfo[] = iconsLib;
	private iconCache: Record<string, IconMetadata[]> = {};

	constructor() {
		// Pre-cache common icon packages for faster access
		this.preloadCommonPackages();
	}

	private async preloadCommonPackages() {
		// Pre-load commonly used packages to reduce latency
		const commonPackages = ["fa", "md", "io", "bs", "fi"];
		for (const pkg of commonPackages) {
			try {
				await this.loadIconPackage(pkg);
			} catch (error) {
				Logger.error(`Failed to preload icon package ${pkg}:`, error);
			}
		}
	}

	private async loadIconPackage(packagePrefix: string): Promise<any> {
		try {
			// Use dynamic import to load the icon package
			return await import(`react-icons/${packagePrefix}`);
		} catch (error) {
			Logger.error(`Error loading icon package ${packagePrefix}:`, error);
			return null;
		}
	}

	getIconLibraries(): IconLibraryInfo[] {
		return this.iconLibraries;
	}

	getLibraryByPrefix(prefix: string): IconLibraryInfo | undefined {
		return this.iconLibraries.find(lib => lib.prefix === prefix);
	}

	async getIconsFromPackage(packagePrefix: string): Promise<IconMetadata[]> {
		Logger.log(`Fetching icons from package: ${packagePrefix}`, "IconService");

		// Return cached icons if available
		if (this.iconCache[packagePrefix]) {
			return this.iconCache[packagePrefix];
		}

		const icons: IconMetadata[] = [];
		try {
			// Dynamically import the package
			const iconPackage = await this.loadIconPackage(packagePrefix);

			if (!iconPackage) {
				return [];
			}

			// Filter out the actual icon exports (excluding internal utilities, etc.)
			for (const key in iconPackage) {
				// Most icon packages follow the pattern of prefixing icon names with the package code
				if (
					key.startsWith(packagePrefix.toUpperCase()) ||
					// Handle special cases like Font Awesome which uses Fa prefix
					(packagePrefix === "fa" && key.startsWith("Fa")) ||
					(packagePrefix === "fa6" && key.startsWith("Fa")) ||
					// Material Design uses Md prefix
					(packagePrefix === "md" && key.startsWith("Md")) ||
					// Ionicons uses Io prefix
					(packagePrefix === "io" && key.startsWith("Io")) ||
					(packagePrefix === "io5" && key.startsWith("Io"))
				) {
					icons.push({
						packageName: packagePrefix,
						iconName: key,
						fullName: `${packagePrefix}/${key}`,
					});
				}
			}

			// Cache the results
			this.iconCache[packagePrefix] = icons;

			return icons;
		} catch (error) {
			Logger.error(`Error fetching icons from package ${packagePrefix}:`, error);
			return [];
		}
	}

	async searchIcons(query: string): Promise<IconMetadata[]> {
		const results: IconMetadata[] = [];

		// Normalize query
		const normalizedQuery = query.toLowerCase();

		// Check if query is in format "prefix:iconname"
		const prefixMatch = normalizedQuery.match(/^([a-z0-9]+):(.*)/);

		if (prefixMatch) {
			const [, prefix, iconQuery] = prefixMatch;
			const library = this.getLibraryByPrefix(prefix);

			if (library) {
				// Get icons from the specific package
				const packageIcons = await this.getIconsFromPackage(prefix);

				// Filter icons by the query after the colon
				return packageIcons.filter(icon => icon.iconName.toLowerCase().includes(iconQuery.trim()));
			}
		}

		// If no specific package or package not found, search all packages
		// Start with most commonly used packages for better user experience
		const priorityPackages = ["fa", "md", "io", "bs", "fi", "hi"];
		const otherPackages = this.iconLibraries.map(lib => lib.prefix).filter(prefix => !priorityPackages.includes(prefix));

		const searchOrder = [...priorityPackages, ...otherPackages];

		for (const prefix of searchOrder) {
			try {
				const packageIcons = await this.getIconsFromPackage(prefix);

				// Add matching icons to results
				const matches = packageIcons.filter(icon => icon.iconName.toLowerCase().includes(normalizedQuery));

				results.push(...matches);

				// Limit results to prevent overwhelming responses
				if (results.length >= 100) {
					break;
				}
			} catch (error) {
				Logger.error(`Error searching in package ${prefix}:`, error);
			}
		}

		return results;
	}

	async getIconDetails(packageName: string, iconName: string): Promise<IconMetadata | null> {
		try {
			// Load the package dynamically
			const iconPackage = await this.loadIconPackage(packageName);

			if (!iconPackage || !iconPackage[iconName]) {
				return null;
			}

			return {
				packageName,
				iconName,
				fullName: `${packageName}/${iconName}`,
				// We don't extract SVG path here as it would require rendering the component
			};
		} catch (error) {
			Logger.error(`Error getting icon details for ${packageName}/${iconName}:`, error);
			return null;
		}
	}
}
