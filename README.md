# React Icons MCP Server

A Model Context Protocol (MCP) server for React Icons integration. This server enables AI coding tools like Cursor, Windsurf, Cline, and other AI-powered coding assistants to access and understand the React Icons library.

## What is React Icons?

[React Icons](https://react-icons.github.io/react-icons/) is a popular library that includes icons from multiple icon sets like Font Awesome, Material Design, Bootstrap, and many more. It allows easy integration of icons into React applications using ES6 imports.

## What is MCP?

The [Model Context Protocol](https://modelcontextprotocol.io/introduction) is a standard for AI tools to request specific context from sources outside their main training data. This MCP server allows AI coding assistants to access information about React Icons to provide better coding assistance.

## Features

- Get information about all icon libraries available in react-icons
- Search for icons by name across all libraries or within a specific library
- Retrieve all icons from a specific library
- Get detailed information about specific icons
- Get usage examples for icons in different React contexts

## Getting Started

### Installation

```bash
npm install -g react-icons-mcp
# or
npx react-icons-mcp
```

### Configuration

To use this MCP server with your AI coding tools, you'll need to add it to your tool's MCP configuration. Here are examples for popular AI coding assistants:

#### MacOS / Linux

```json
{
  "mcpServers": {
    "React Icons MCP": {
      "command": "npx",
      "args": ["-y", "react-icons-mcp", "--stdio"]
    }
  }
}
```

#### Windows

```json
{
  "mcpServers": {
    "React Icons MCP": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "react-icons-mcp", "--stdio"]
    }
  }
}
```

### Running Locally

You can also run the server directly:

```bash
# Run in HTTP mode (default port 3334)
npx react-icons-mcp

# Run in stdio mode for direct integration with AI tools
npx react-icons-mcp --stdio

# Run on a custom port
npx react-icons-mcp --port 3456
```

## Tools Available

This MCP server exposes the following tools to AI coding assistants:

1. **get_icon_libraries** - Get information about all available icon libraries
2. **search_icons** - Search for icons by name or category
3. **get_library_icons** - Get all icons from a specific library
4. **get_icon_details** - Get detailed information about a specific icon
5. **get_icon_usage_examples** - Get code examples for using React Icons

## Example Usage

Here's how an AI tool might use this MCP server to help a developer:

1. User asks: "I need a user icon for my React app"
2. AI tool calls `search_icons` with query "user"
3. AI tool receives a list of user-related icons from various libraries
4. AI tool suggests: "You can use the FaUser icon from Font Awesome with this code snippet:"

```jsx
import { FaUser } from 'react-icons/fa';

function UserProfile() {
  return (
    <div>
      <FaUser size={24} />
      <span>User Profile</span>
    </div>
  );
}
```

## Development

```bash
# Clone the repository
git clone https://github.com/yourusername/react-icons-mcp.git
cd react-icons-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode with hot reloading
npm run dev
```

## License

MIT