import {jest, describe, it, expect, beforeEach} from "@jest/globals";
import {IconService} from "../../services/icon-service.js";
import * as iconPackages from "react-icons";

// Create a more complete mock that includes required properties
type IconPackagesType = typeof iconPackages;

// Create a subclass for testing that overrides the protected method
class TestableIconService extends IconService {
	// Mock icon packages to use in tests
	private mockIconPackages = {
		// Include the required properties from the real iconPackages
		IconsManifest: [],
		IconBase: jest.fn(),
		IconContext: {Consumer: {}, Provider: {}},
		DefaultContext: {},
		GenIcon: jest.fn(),

		// Our test icon packages
		fa: {
			FaUser: jest.fn(),
			FaHome: jest.fn(),
			FaCog: jest.fn(),
			someUtil: jest.fn(), // Non-icon utility that should be filtered out
		},
		md: {
			MDHome: jest.fn(),
			MDSettings: jest.fn(),
			MDPerson: jest.fn(),
		},
		bs: {
			BSArrowUp: jest.fn(),
			BSArrowDown: jest.fn(),
		},
	} as unknown as IconPackagesType;

	// Override the protected method to return our mock data
	protected override getIconPackages() {
		return this.mockIconPackages;
	}
}

describe("IconService", () => {
	let iconService: TestableIconService;

	beforeEach(() => {
		iconService = new TestableIconService();
	});

	describe("getIconLibraries", () => {
		it("should return all available icon libraries", () => {
			const libraries = iconService.getIconLibraries();

			// Check if we have the expected number of libraries
			expect(libraries.length).toBeGreaterThan(20);

			// Check if required properties are present in each library
			libraries.forEach(library => {
				expect(library).toHaveProperty("prefix");
				expect(library).toHaveProperty("name");
				expect(library).toHaveProperty("description");
				expect(library).toHaveProperty("totalIcons");
				expect(library).toHaveProperty("license");
				expect(library).toHaveProperty("url");
			});

			// Verify a few specific libraries exist
			const faLibrary = libraries.find(lib => lib.prefix === "fa");
			expect(faLibrary).toBeDefined();
			expect(faLibrary?.name).toBe("Font Awesome 5");

			const mdLibrary = libraries.find(lib => lib.prefix === "md");
			expect(mdLibrary).toBeDefined();
			expect(mdLibrary?.name).toBe("Material Design Icons");
		});
	});

	describe("getLibraryByPrefix", () => {
		it("should return the correct library for a valid prefix", () => {
			const faLibrary = iconService.getLibraryByPrefix("fa");
			expect(faLibrary).toBeDefined();
			expect(faLibrary?.name).toBe("Font Awesome 5");
			expect(faLibrary?.prefix).toBe("fa");

			const bsLibrary = iconService.getLibraryByPrefix("bs");
			expect(bsLibrary).toBeDefined();
			expect(bsLibrary?.name).toBe("Bootstrap Icons");
			expect(bsLibrary?.prefix).toBe("bs");
		});

		it("should return undefined for an invalid prefix", () => {
			const nonExistentLibrary = iconService.getLibraryByPrefix("nonexistent");
			expect(nonExistentLibrary).toBeUndefined();
		});
	});

	describe("getIconsFromPackage", () => {
		it("should return icons from a valid package", () => {
			const faIcons = iconService.getIconsFromPackage("fa");

			// Should have 3 icons that start with the uppercase prefix
			expect(faIcons.length).toBe(3);

			// Verify structure of returned icons
			faIcons.forEach(icon => {
				expect(icon.packageName).toBe("fa");
				expect(icon.iconName).toMatch(/^Fa/);
				expect(icon.fullName).toBe(`fa/${icon.iconName}`);
			});

			// Check for specific icons that we mocked
			const iconNames = faIcons.map(icon => icon.iconName);
			expect(iconNames).toContain("FaUser");
			expect(iconNames).toContain("FaHome");
			expect(iconNames).toContain("FaCog");

			// Utility functions should not be included
			expect(iconNames).not.toContain("someUtil");
		});

		it("should return an empty array for an invalid package", () => {
			const icons = iconService.getIconsFromPackage("nonexistent");
			expect(icons).toEqual([]);
		});
	});

	describe("searchIcons", () => {
		it("should search across all packages when no prefix is specified", () => {
			// Search for a generic term that should match icons in multiple packages
			const results = iconService.searchIcons("home");

			// Should find icons with "home" in the name
			expect(results.length).toBeGreaterThan(0);

			// We expect FaHome to be found
			const iconNames = results.map(icon => icon.iconName);
			expect(iconNames).toContain("FaHome");

			// Also check if we have correct package names
			const packageNames = results.map(icon => icon.packageName);
			expect(packageNames).toContain("fa");
		});

		it("should search within a specific package when prefix is specified", () => {
			// Search within Font Awesome package
			const results = iconService.searchIcons("fa:user");

			// Should find at least one icon
			expect(results.length).toBeGreaterThan(0);

			// All results should be from the FA package
			results.forEach(icon => {
				expect(icon.packageName).toBe("fa");
			});

			// Should find the specific icon
			const faUser = results.find(icon => icon.iconName === "FaUser");
			expect(faUser).toBeDefined();
		});

		it("should return an empty array when no matches are found", () => {
			const results = iconService.searchIcons("nonexistenticon");
			expect(results).toEqual([]);
		});
	});

	describe("getIconDetails", () => {
		it("should return details for a valid icon", () => {
			const iconDetails = iconService.getIconDetails("fa", "FaUser");

			expect(iconDetails).not.toBeNull();
			expect(iconDetails).toEqual({
				packageName: "fa",
				iconName: "FaUser",
				fullName: "fa/FaUser",
			});
		});

		it("should return null for an invalid icon", () => {
			const iconDetails = iconService.getIconDetails("fa", "NonExistentIcon");
			expect(iconDetails).toBeNull();
		});

		it("should return null for an invalid package", () => {
			const iconDetails = iconService.getIconDetails("nonexistent", "FaUser");
			expect(iconDetails).toBeNull();
		});
	});
});
