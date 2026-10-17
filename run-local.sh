#!/usr/bin/env bash
# Run the Workshop App (Express + Prisma backend, Vite + React frontend) locally.
#
# Usage:
#   ./run-local.sh            # install deps if needed, set up DB, start both servers
#   ./run-local.sh --reset    # wipe the SQLite DB and re-seed before starting
#   ./run-local.sh --install  # force a clean `npm install` in all packages
#
# Press Ctrl+C to stop both servers.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/src/backend"
FRONTEND_DIR="$ROOT_DIR/src/frontend"
LOG_DIR="$ROOT_DIR/.logs"
BACKEND_PORT=3001
FRONTEND_PORT=5173
MIN_NODE_MAJOR=18

RESET_DB=false
FORCE_INSTALL=false
for arg in "$@"; do
  case "$arg" in
    --reset)   RESET_DB=true ;;
    --install) FORCE_INSTALL=true ;;
    -h|--help) sed -n '2,9p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown option: $arg (see --help)"; exit 1 ;;
  esac
done

info() { printf '\033[1;34m==>\033[0m %s\n' "$*"; }
ok()   { printf '\033[1;32m✔\033[0m  %s\n' "$*"; }
fail() { printf '\033[1;31m✘\033[0m  %s\n' "$*" >&2; exit 1; }

# --- 1. Toolchain -----------------------------------------------------------
info "Checking toolchain"
command -v node >/dev/null 2>&1 || fail "Node.js not found. Install Node $MIN_NODE_MAJOR+ from https://nodejs.org"
command -v npm  >/dev/null 2>&1 || fail "npm not found. It ships with Node.js — reinstall Node."
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
[ "$NODE_MAJOR" -ge "$MIN_NODE_MAJOR" ] || fail "Node $MIN_NODE_MAJOR+ required, found $(node -v)"
ok "node $(node -v), npm $(npm -v)"

# --- 2. Dependencies --------------------------------------------------------
# Reinstall when node_modules is missing, when package.json / package-lock.json
# changed since the last install, or when --install is passed.
install_deps() {
  local dir="$1" name="$2"
  local marker="$dir/node_modules/.package-lock.json"
  if $FORCE_INSTALL || [ ! -d "$dir/node_modules" ] || [ ! -f "$marker" ] \
     || [ "$dir/package.json" -nt "$marker" ] \
     || { [ -f "$dir/package-lock.json" ] && [ "$dir/package-lock.json" -nt "$marker" ]; }; then
    info "Installing $name dependencies"
    if [ -f "$dir/package-lock.json" ]; then
      (cd "$dir" && npm ci --no-audit --no-fund)
    else
      (cd "$dir" && npm install --no-audit --no-fund)
    fi
  fi
  ok "$name dependencies ready"
}
install_deps "$ROOT_DIR"     "root (Playwright)"
install_deps "$BACKEND_DIR"  "backend"
install_deps "$FRONTEND_DIR" "frontend"

# --- 3. Environment files ---------------------------------------------------
for dir in "$BACKEND_DIR" "$FRONTEND_DIR"; do
  if [ ! -f "$dir/.env" ] && [ -f "$dir/.env.example" ]; then
    cp "$dir/.env.example" "$dir/.env"
    ok "Created ${dir#$ROOT_DIR/}/.env from .env.example"
  fi
done
[ -f "$BACKEND_DIR/.env" ] || fail "src/backend/.env missing and no .env.example to copy from"

# Export backend env so Prisma and the seed script see DATABASE_URL etc.
set -a
# shellcheck disable=SC1091
. "$BACKEND_DIR/.env"
set +a

# --- 4. Database ------------------------------------------------------------
# Always use the local Prisma in node_modules (never a global/npx-fetched one).
PRISMA="$BACKEND_DIR/node_modules/.bin/prisma"
[ -x "$PRISMA" ] || fail "Local Prisma CLI not found — try ./run-local.sh --install"

cd "$BACKEND_DIR"
if $RESET_DB; then
  info "Resetting database"
  "$PRISMA" migrate reset --force --skip-seed
fi

info "Generating Prisma client"
npm run --silent db:generate >/dev/null
ok "Prisma client generated"

info "Applying migrations"
"$PRISMA" migrate deploy
ok "Database schema up to date"

# The seed uses createMany, so only run it when the domain tables are empty
# to avoid duplicate rows.
NEEDS_SEED="$(node -e '
  const { PrismaClient } = require("@prisma/client");
  const p = new PrismaClient();
  Promise.all([p.user.count(), p.offer.count()])
    .then(([u, o]) => console.log(u === 0 || o === 0 ? "yes" : "no"))
    .catch(() => console.log("yes"))
    .finally(() => p.$disconnect());
')"
if [ "$NEEDS_SEED" = "yes" ]; then
  info "Seeding database"
  npm run --silent db:seed
else
  ok "Seed data already present (use --reset to re-seed)"
fi
cd "$ROOT_DIR"

# --- 5. Free ports ----------------------------------------------------------
# ts-node-dev / npm keep the actual server alive as a child, so stop the
# supervising parents too, then SIGKILL anything that refuses to exit.
free_port() {
  local port="$1" pids targets="" pid ppid
  pids="$(lsof -ti tcp:"$port" -sTCP:LISTEN 2>/dev/null || true)"
  [ -z "$pids" ] && return 0
  info "Port $port in use (pid $(echo $pids)) — stopping it"
  for pid in $pids; do
    targets="$targets $pid"
    ppid="$(ps -o ppid= -p "$pid" 2>/dev/null | tr -d ' ')"
    while [ -n "$ppid" ] && [ "$ppid" -gt 1 ] \
          && ps -o command= -p "$ppid" | grep -qE 'ts-node-dev|npm|vite|node'; do
      targets="$targets $ppid"
      ppid="$(ps -o ppid= -p "$ppid" 2>/dev/null | tr -d ' ')"
    done
  done
  kill $targets 2>/dev/null || true
  for _ in 1 2 3 4 5; do
    lsof -ti tcp:"$port" -sTCP:LISTEN >/dev/null 2>&1 || return 0
    sleep 1
  done
  kill -9 $targets $(lsof -ti tcp:"$port" -sTCP:LISTEN 2>/dev/null) 2>/dev/null || true
  sleep 1
  lsof -ti tcp:"$port" -sTCP:LISTEN >/dev/null 2>&1 && fail "Could not free port $port"
  return 0
}
if command -v lsof >/dev/null 2>&1; then
  free_port "$BACKEND_PORT"
  free_port "$FRONTEND_PORT"
fi

# --- 6. Start servers -------------------------------------------------------
mkdir -p "$LOG_DIR"
PIDS=()
cleanup() {
  echo
  info "Stopping servers"
  # Each server runs in its own process group, so this stops npm and every
  # node/vite process it spawned.
  for pid in "${PIDS[@]:-}"; do
    [ -n "$pid" ] && kill -- "-$pid" 2>/dev/null || true
  done
  if command -v lsof >/dev/null 2>&1; then
    free_port "$BACKEND_PORT" >/dev/null
    free_port "$FRONTEND_PORT" >/dev/null
  fi
  exit 0
}
trap cleanup INT TERM

# Job control gives each background server its own process group.
set -m

info "Starting backend on :$BACKEND_PORT (log: .logs/backend.log)"
(cd "$BACKEND_DIR" && npm run dev) >"$LOG_DIR/backend.log" 2>&1 &
PIDS+=($!)

info "Starting frontend on :$FRONTEND_PORT (log: .logs/frontend.log)"
(cd "$FRONTEND_DIR" && npm run dev) >"$LOG_DIR/frontend.log" 2>&1 &
PIDS+=($!)

wait_for() {
  local url="$1" name="$2" log="$3" pid="$4"
  for _ in $(seq 1 60); do
    kill -0 "$pid" 2>/dev/null || { tail -20 "$log" >&2; fail "$name exited during startup (see $log)"; }
    if grep -q 'EADDRINUSE' "$log" 2>/dev/null; then
      tail -5 "$log" >&2; fail "$name could not bind its port (see $log)"
    fi
    if curl -s -o /dev/null "$url"; then ok "$name is up"; return 0; fi
    sleep 1
  done
  tail -20 "$log" >&2
  fail "$name did not start within 60s (see $log)"
}
wait_for "http://localhost:$BACKEND_PORT/"  "Backend"  "$LOG_DIR/backend.log"  "${PIDS[0]}"
wait_for "http://localhost:$FRONTEND_PORT/" "Frontend" "$LOG_DIR/frontend.log" "${PIDS[1]}"

cat <<EOF

  App:      http://localhost:$FRONTEND_PORT
  API:      http://localhost:$BACKEND_PORT/api
  Login:    test@example.com / password123
  Logs:     .logs/backend.log, .logs/frontend.log

  Press Ctrl+C to stop.
EOF

wait || true
cleanup
