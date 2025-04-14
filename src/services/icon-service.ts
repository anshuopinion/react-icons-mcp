// Service to interact with react-icons library
import * as iconPackages from "react-icons";

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
	private iconLibraries: IconLibraryInfo[] = [
		{
			prefix: "ai",
			name: "Ant Design Icons",
			description: "Icons from Ant Design",
			totalIcons: 831,
			license: "MIT",
			url: "https://github.com/ant-design/ant-design-icons",
		},
		{
			prefix: "bs",
			name: "Bootstrap Icons",
			description: "Icons from Bootstrap",
			totalIcons: 2716,
			license: "MIT",
			url: "https://github.com/twbs/icons",
		},
		{
			prefix: "bi",
			name: "BoxIcons",
			description: "High quality web icons",
			totalIcons: 1634,
			license: "MIT",
			url: "https://github.com/atisawd/boxicons",
		},
		{
			prefix: "ci",
			name: "Circum Icons",
			description: "Circle-based icons",
			totalIcons: 288,
			license: "MPL-2.0",
			url: "https://circumicons.com/",
		},
		{
			prefix: "cg",
			name: "css.gg",
			description: "Pure CSS icons",
			totalIcons: 704,
			license: "MIT",
			url: "https://github.com/astrit/css.gg",
		},
		{
			prefix: "di",
			name: "Devicons",
			description: "Developer tool icons",
			totalIcons: 192,
			license: "MIT",
			url: "https://vorillaz.github.io/devicons/",
		},
		{
			prefix: "fa",
			name: "Font Awesome 5",
			description: "Popular icon toolkit",
			totalIcons: 1612,
			license: "CC BY 4.0",
			url: "https://fontawesome.com/",
		},
		{
			prefix: "fa6",
			name: "Font Awesome 6",
			description: "Latest Font Awesome icons",
			totalIcons: 2045,
			license: "CC BY 4.0",
			url: "https://fontawesome.com/",
		},
		{
			prefix: "fc",
			name: "Flat Color Icons",
			description: "Colored flat icons",
			totalIcons: 329,
			license: "MIT",
			url: "https://github.com/icons8/flat-color-icons",
		},
		{
			prefix: "fi",
			name: "Feather",
			description: "Simply beautiful icons",
			totalIcons: 287,
			license: "MIT",
			url: "https://feathericons.com/",
		},
		{
			prefix: "gi",
			name: "Game Icons",
			description: "Icons for games",
			totalIcons: 4040,
			license: "CC BY 3.0",
			url: "https://game-icons.net/",
		},
		{
			prefix: "go",
			name: "Github Octicons",
			description: "GitHub's icons",
			totalIcons: 264,
			license: "MIT",
			url: "https://octicons.github.com/",
		},
		{
			prefix: "gr",
			name: "Grommet-Icons",
			description: "Grommet UI icons",
			totalIcons: 635,
			license: "Apache License v2.0",
			url: "https://github.com/grommet/grommet-icons",
		},
		{
			prefix: "hi",
			name: "Heroicons",
			description: "Tailwind UI icons",
			totalIcons: 460,
			license: "MIT",
			url: "https://github.com/tailwindlabs/heroicons",
		},
		{
			prefix: "hi2",
			name: "Heroicons 2",
			description: "Heroicons v2",
			totalIcons: 888,
			license: "MIT",
			url: "https://github.com/tailwindlabs/heroicons",
		},
		{
			prefix: "im",
			name: "IcoMoon Free",
			description: "IcoMoon icon set",
			totalIcons: 491,
			license: "CC BY 4.0",
			url: "https://github.com/Keyamoon/IcoMoon-Free",
		},
		{
			prefix: "io",
			name: "Ionicons 4",
			description: "Ionic Framework icons v4",
			totalIcons: 696,
			license: "MIT",
			url: "https://ionicons.com/",
		},
		{
			prefix: "io5",
			name: "Ionicons 5",
			description: "Ionic Framework icons v5",
			totalIcons: 1332,
			license: "MIT",
			url: "https://ionicons.com/",
		},
		{
			prefix: "lia",
			name: "Icons8 Line Awesome",
			description: "Beautiful icon set",
			totalIcons: 1544,
			license: "MIT",
			url: "https://icons8.com/line-awesome",
		},
		{
			prefix: "lu",
			name: "Lucide",
			description: "Fork of Feather Icons",
			totalIcons: 1215,
			license: "ISC",
			url: "https://lucide.dev/",
		},
		{
			prefix: "md",
			name: "Material Design Icons",
			description: "Google's Material Design icons",
			totalIcons: 4341,
			license: "Apache License v2.0",
			url: "http://google.github.io/material-design-icons/",
		},
		{
			prefix: "pi",
			name: "Phosphor Icons",
			description: "Flexible icon family",
			totalIcons: 9072,
			license: "MIT",
			url: "https://github.com/phosphor-icons/core",
		},
		{
			prefix: "ri",
			name: "Remix Icon",
			description: "Neutral-style icon system",
			totalIcons: 2860,
			license: "Apache License v2.0",
			url: "https://github.com/Remix-Design/RemixIcon",
		},
		{
			prefix: "rx",
			name: "Radix Icons",
			description: "Radix UI Icon set",
			totalIcons: 318,
			license: "MIT",
			url: "https://icons.radix-ui.com",
		},
		{
			prefix: "si",
			name: "Simple Icons",
			description: "Brand icons",
			totalIcons: 3209,
			license: "CC0 1.0 Universal",
			url: "https://simpleicons.org/",
		},
		{
			prefix: "sl",
			name: "Simple Line Icons",
			description: "Simple and clean line icons",
			totalIcons: 189,
			license: "MIT",
			url: "https://thesabbir.github.io/simple-line-icons/",
		},
		{
			prefix: "tb",
			name: "Tabler Icons",
			description: "Fully customizable icons",
			totalIcons: 5237,
			license: "MIT",
			url: "https://github.com/tabler/tabler-icons",
		},
		{
			prefix: "tfi",
			name: "Themify Icons",
			description: "Themify icon set",
			totalIcons: 352,
			license: "MIT",
			url: "https://github.com/lykmapipo/themify-icons",
		},
		{
			prefix: "ti",
			name: "Typicons",
			description: "Rounded icon set",
			totalIcons: 336,
			license: "CC BY-SA 3.0",
			url: "http://s-ings.com/typicons/",
		},
		{
			prefix: "vsc",
			name: "VS Code Icons",
			description: "Visual Studio Code icons",
			totalIcons: 461,
			license: "CC BY 4.0",
			url: "https://github.com/microsoft/vscode-codicons",
		},
		{
			prefix: "wi",
			name: "Weather Icons",
			description: "Weather-themed icons",
			totalIcons: 219,
			license: "SIL OFL 1.1",
			url: "https://erikflowers.github.io/weather-icons/",
		},
	];

	// Added for better testability
	protected getIconPackages() {
		return iconPackages;
	}

	constructor() {}

	getIconLibraries(): IconLibraryInfo[] {
		return this.iconLibraries;
	}

	getLibraryByPrefix(prefix: string): IconLibraryInfo | undefined {
		return this.iconLibraries.find(lib => lib.prefix === prefix);
	}

	getIconsFromPackage(packagePrefix: string): IconMetadata[] {
		// Get all exported items from the package
		const packages = this.getIconPackages();
		const packageKey = packagePrefix as keyof typeof iconPackages;
		const iconPackage = packages[packageKey];

		if (!iconPackage) {
			return [];
		}

		const icons: IconMetadata[] = [];

		// Filter out the actual icon exports (excluding internal utilities, etc.)
		for (const key in iconPackage) {
			// Check if the key starts with the package prefix in uppercase
			// For example, 'Fa' for 'fa' package or 'Md' for 'md' package
			if (key.startsWith(packagePrefix.charAt(0).toUpperCase() + packagePrefix.slice(1, 2).toLowerCase())) {
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
		const packages = this.getIconPackages();
		const packageKey = packageName as keyof typeof iconPackages;
		const iconPackage = packages[packageKey];

		if (!iconPackage) {
			return null;
		}

		// Check if icon exists in package
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
