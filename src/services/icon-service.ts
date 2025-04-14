// Service to interact with react-icons library
import * as iconPackages from "react-icons";
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

	constructor() {}

	getIconLibraries(): IconLibraryInfo[] {
		return this.iconLibraries;
	}

	getLibraryByPrefix(prefix: string): IconLibraryInfo | undefined {
		return this.iconLibraries.find(lib => lib.prefix === prefix);
	}

	getIconsFromPackage(packagePrefix: string): IconMetadata[] {
		Logger.log(`Fetching icons from package: ${packagePrefix}`, "IconService");
		// Get all exported items from the package
		const packageKey = packagePrefix as keyof typeof iconPackages;
		if (!iconPackages[packageKey]) {
			return [];
		}

		const icons: IconMetadata[] = [];
		const iconPackage = iconPackages[packageKey];

		// Filter out the actual icon exports (excluding internal utilities, etc.)
		for (const key in iconPackage) {
			if (key.startsWith(packagePrefix.toUpperCase())) {
				icons.push({
					packageName: packagePrefix,
					iconName: key,
					fullName: `${packagePrefix}/${key}`,
				});
			}
		}

		return icons;
	}

	searchIcons(query: string): IconMetadata[] {
		const results: IconMetadata[] = [];

		// Normalize query
		const normalizedQuery = query.toLowerCase();

		// Check if query specifies a package prefix
		let targetPackage: string | null = null;

		// Check if query is in format "prefix:iconname"
		const prefixMatch = normalizedQuery.match(/^([a-z0-9]+):(.*)/);

		if (prefixMatch) {
			const [, prefix, iconQuery] = prefixMatch;
			const library = this.getLibraryByPrefix(prefix);

			if (library) {
				targetPackage = prefix;
				const packageIcons = this.getIconsFromPackage(targetPackage);

				console.log(packageIcons);
				// Filter icons by the query after the colon
				return packageIcons.filter(icon => icon.iconName.toLowerCase().includes(iconQuery.trim()));
			}
		}

		// If no specific package or package not found, search all packages
		for (const library of this.iconLibraries) {
			const packageIcons = this.getIconsFromPackage(library.prefix);

			// Add matching icons to results
			const matches = packageIcons.filter(icon => icon.iconName.toLowerCase().includes(normalizedQuery));

			results.push(...matches);

			// Limit results to prevent overwhelming responses
			if (results.length > 100) {
				break;
			}
		}

		return results;
	}

	getIconDetails(packageName: string, iconName: string): IconMetadata | null {
		// Check if package exists
		const packageKey = packageName as keyof typeof iconPackages;
		if (!iconPackages[packageKey]) {
			return null;
		}

		// Check if icon exists in package
		const iconPackage = iconPackages[packageKey];
		if (!iconPackage[iconName]) {
			return null;
		}

		return {
			packageName,
			iconName,
			fullName: `${packageName}/${iconName}`,
			// We don't extract SVG path here as it would require rendering the component
		};
	}
}
