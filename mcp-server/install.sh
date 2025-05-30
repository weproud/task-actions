#!/bin/bash

echo "🚀 Starting Task Actions MCP Server installation..."

# Save current directory
CURRENT_DIR=$(pwd)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "📁 Project path: $PROJECT_ROOT"

# 1. Build parent project
echo "🔨 Building parent project..."
cd "$PROJECT_ROOT"
npm install
npm run build

if [ ! -f "dist/cli.js" ]; then
    echo "❌ Parent project build failed. dist/cli.js file not found."
    exit 1
fi

# 2. Build MCP server
echo "🔨 Building MCP server..."
cd "$SCRIPT_DIR"
npm install
npm run build

if [ ! -f "dist/index.js" ]; then
    echo "❌ MCP server build failed. dist/index.js file not found."
    exit 1
fi

# 3. Check Claude Desktop config file path and provide example
echo "⚙️  Claude Desktop configuration..."

if [[ "$OSTYPE" == "darwin"* ]]; then
    CONFIG_PATH="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
    echo "📍 macOS detected. Config file path: $CONFIG_PATH"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    CONFIG_PATH="$APPDATA/Claude/claude_desktop_config.json"
    echo "📍 Windows detected. Config file path: $CONFIG_PATH"
else
    echo "📍 Unsupported OS. Please configure manually."
    CONFIG_PATH=""
fi

# 4. Generate config file example
cat > "$SCRIPT_DIR/claude_desktop_config.example.json" << EOF
{
  "mcpServers": {
    "task-actions": {
      "command": "node",
      "args": ["$SCRIPT_DIR/dist/index.js"],
      "env": {}
    }
  }
}
EOF

echo "✅ Installation completed!"
echo ""
echo "🔧 Next steps:"
echo "1. Close Claude Desktop."
echo "2. Add the following configuration to Claude Desktop config file:"
if [ -n "$CONFIG_PATH" ]; then
    echo "   Config file location: $CONFIG_PATH"
fi
echo ""
echo "Configuration content:"
cat "$SCRIPT_DIR/claude_desktop_config.example.json"
echo ""
echo "3. Restart Claude Desktop."
echo "4. Try saying 'Please initialize a task-actions project' in Claude!"

# Return to original directory
cd "$CURRENT_DIR"