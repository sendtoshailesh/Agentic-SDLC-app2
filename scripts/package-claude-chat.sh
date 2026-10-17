#!/usr/bin/env bash
# Packages skills + project instructions for upload to Claude chat (claude.ai).
# Output: dist/claude-chat/skills/<skill>.zip  and  dist/claude-chat/project-knowledge/*
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=dist/claude-chat
rm -rf "$OUT" && mkdir -p "$OUT/skills" "$OUT/project-knowledge"
for d in .claude/skills/*/; do
  name=$(basename "$d")
  (cd .claude/skills && zip -qr "../../$OUT/skills/$name.zip" "$name")
done
cp .github/copilot-instructions.md AGENTS.md "$OUT/project-knowledge/"
for f in .claude/agents/*.md; do cp "$f" "$OUT/project-knowledge/agent-$(basename "$f")"; done
[ -f src/backend/prisma/schema.prisma ] && cp src/backend/prisma/schema.prisma "$OUT/project-knowledge/"
echo "Done → $OUT"; ls -R "$OUT"
