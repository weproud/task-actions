#!/bin/bash

echo "🚀 Task Actions MCP Server 설치를 시작합니다..."

# 현재 디렉토리 저장
CURRENT_DIR=$(pwd)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "📁 프로젝트 경로: $PROJECT_ROOT"

# 1. 부모 프로젝트 빌드
echo "🔨 부모 프로젝트 빌드 중..."
cd "$PROJECT_ROOT"
npm install
npm run build

if [ ! -f "dist/cli.js" ]; then
    echo "❌ 부모 프로젝트 빌드에 실패했습니다. dist/cli.js 파일이 없습니다."
    exit 1
fi

# 2. MCP 서버 빌드
echo "🔨 MCP 서버 빌드 중..."
cd "$SCRIPT_DIR"
npm install
npm run build

if [ ! -f "dist/index.js" ]; then
    echo "❌ MCP 서버 빌드에 실패했습니다. dist/index.js 파일이 없습니다."
    exit 1
fi

# 3. Claude Desktop 설정 파일 경로 확인 및 예제 제공
echo "⚙️  Claude Desktop 설정..."

if [[ "$OSTYPE" == "darwin"* ]]; then
    CONFIG_PATH="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
    echo "📍 macOS 감지됨. 설정 파일 경로: $CONFIG_PATH"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    CONFIG_PATH="$APPDATA/Claude/claude_desktop_config.json"
    echo "📍 Windows 감지됨. 설정 파일 경로: $CONFIG_PATH"
else
    echo "📍 지원되지 않는 OS입니다. 수동으로 설정해주세요."
    CONFIG_PATH=""
fi

# 4. 설정 파일 예제 생성
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

echo "✅ 설치가 완료되었습니다!"
echo ""
echo "🔧 다음 단계:"
echo "1. Claude Desktop을 종료합니다."
echo "2. 다음 설정을 Claude Desktop 설정 파일에 추가합니다:"
if [ -n "$CONFIG_PATH" ]; then
    echo "   설정 파일 위치: $CONFIG_PATH"
fi
echo ""
echo "설정 내용:"
cat "$SCRIPT_DIR/claude_desktop_config.example.json"
echo ""
echo "3. Claude Desktop을 다시 시작합니다."
echo "4. Claude에서 'task-actions 프로젝트를 초기화해주세요'라고 말해보세요!"

# 원래 디렉토리로 복귀
cd "$CURRENT_DIR" 