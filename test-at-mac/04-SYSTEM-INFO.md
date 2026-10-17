# System Information Report

**Test Date:** 20 March 2026  
**Test Location:** Apple Silicon Mac

---

## Operating System

### macOS Details
```
ProductName:            macOS
ProductVersion:         15.7.4
BuildVersion:           24G517
```

### Architecture
```
arm64 (Apple Silicon)
```

### Processor
- Apple M-series chip (Apple Silicon)
- ARM64 architecture

---

## Development Environment

### Node.js
```
Version: v25.6.1
Architecture: arm64
```

### npm (Node Package Manager)
```
Version: 11.9.0
Package Lock Version: v3
```

### Shell
```
Type: zsh
Default macOS Shell: Yes
```

---

## Backend Dependencies

### Installed Packages (Top Level)
```
workshop-backend@1.0.0

Production Dependencies:
├── @prisma/client@6.19.2
├── bcryptjs@2.4.3
├── cors@2.8.6
├── express@4.22.1
└── jsonwebtoken@9.0.3

Development Dependencies:
├── @types/bcryptjs@2.4.6
├── @types/cors@2.8.19
├── @types/express@4.17.25
├── @types/jest@29.5.14
├── @types/jsonwebtoken@9.0.10
├── @types/node@20.19.37
├── @types/supertest@6.0.3
├── jest@29.7.0
├── jest-mock-extended@3.0.7
├── prisma@6.19.2
├── supertest@6.3.4
├── ts-jest@29.4.6
├── ts-node@10.9.2
└── ts-node-dev@2.0.0
```

### Key Framework Versions
| Package | Version | Purpose |
|---------|---------|---------|
| express | 4.22.1 | Web framework |
| prisma | 6.19.2 | ORM + migrations |
| @prisma/client | 6.19.2 | Database client |
| typescript | 5.9.3 | Type system |
| ts-node-dev | 2.0.0 | Dev server |
| jsonwebtoken | 9.0.3 | JWT auth |
| bcryptjs | 2.4.3 | Password hashing |
| jest | 29.7.0 | Testing framework |

---

## Frontend Dependencies

### Key Framework Versions
| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.2.0 | UI framework |
| react-dom | 18.2.0 | React renderer |
| react-router-dom | 6.11.0 | Client-side routing |
| vite | 5.4.21 | Build tool |
| typescript | 5.0.2 | Type system |

---

## Prisma Configuration

### Prisma Version Details
```
CLI Version: 6.19.2
Client Version: 6.19.2
Engine Version: binary
Platform: darwin-arm64
```

### Prisma Engine Types
- **Query Engine:** binary (for runtime queries)
- **Migration Engine:** binary (for schema changes)
- **Introspection Engine:** binary (for schema analysis)

### Schema Validation
```
✅ Schema valid
✅ Enums supported (OfferStatus)
✅ SQLite datasource configured
✅ Client generation successful
```

---

## Database Information

### SQLite
```
Type: SQLite 3
File: src/backend/dev.db
Size: ~40 KB (after seed)
```

### Database Schema
```
Tables: 3 (User, Offer, Redemption)
Enums: 1 (OfferStatus)
Relations: 2 (Redemption → Offer, Redemption → User)
```

### Migration Status
```
Applied Migrations: 1
Latest Migration: 20260309064519_init
Schema Status: In sync
```

---

## Network Configuration

### Server Ports
```
Backend (Express):  3001
Frontend (Vite):    5173
```

### Listening Addresses
```
Backend:  localhost:3001 (127.0.0.1:3001)
Frontend: localhost:5173 (127.0.0.1:5173)
```

### CORS Configuration
```
Allowed Origin: http://localhost:5173
Credentials: Enabled
Methods: GET, POST, PUT, DELETE
```

---

## File System

### Project Root
```
/Users/shaileshmishra/my-docs/my-proj/Agentic-SDLC-app2
```

### Backend Directory
```
/Users/shaileshmishra/my-docs/my-proj/Agentic-SDLC-app2/src/backend
```

### Frontend Directory
```
/Users/shaileshmishra/my-docs/my-proj/Agentic-SDLC-app2/src/frontend
```

### Test Reports Directory
```
/Users/shaileshmishra/my-docs/my-proj/Agentic-SDLC-app2/test-at-mac
```

---

## Disk Usage

### Project Size (Approximate)
```
Total:            ~200 MB (with node_modules)
Backend:          ~150 MB
Frontend:         ~50 MB
Database:         ~40 KB
Test Reports:     ~50 KB
```

---

## Version Control

### Repository
```
Platform: GitHub
Repository: sendtoshailesh/Agentic-SDLC-app2
Branch: Not specified (assumed main/master)
```

---

## Environment Variables

### Backend Configuration
```
DATABASE_URL=file:./dev.db
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
VITE_APP_NAME=Workshop App
```

---

## Process Information

### Running Processes (During Test)
1. **Backend Server**
   - Process: ts-node-dev
   - Port: 3001
   - PID: [Dynamic - killed after test]
   
2. **Frontend Server**
   - Process: vite
   - Port: 5173
   - PID: [Dynamic - killed after test]

---

## System Performance

### Available Resources (Typical Apple Silicon)
- **CPU Cores:** 8-10 cores (varies by M1/M2/M3)
- **Memory:** 8-64 GB (varies by configuration)
- **Storage:** SSD (fast I/O)

### Resource Usage During Test
- **CPU:** Low (<10% typical)
- **Memory:** ~500 MB for both servers
- **Disk I/O:** Minimal (SQLite is file-based)

---

## Compiler and Build Tools

### TypeScript Compiler
```
Version: 5.9.3 (backend), 5.0.2 (frontend)
Target: ES2020
Module: CommonJS (backend), ESNext (frontend)
Strict Mode: Enabled
```

### Build Tools
```
Backend: tsc (TypeScript compiler)
Frontend: vite (Rollup-based bundler)
Dev Server: ts-node-dev (backend), vite (frontend)
```

---

## Testing Tools

### Unit Testing
```
Framework: Jest 29.7.0
Test Runner: ts-jest 29.4.6
Coverage Tool: jest --coverage
```

### E2E Testing
```
Framework: Playwright
Config: playwright.config.ts
Browsers: Chromium, Firefox, WebKit
```

### API Testing
```
Manual Tool: curl + jq
HTTP Client: supertest 6.3.4 (for automated tests)
```

---

## Security Tools

### Password Hashing
```
Library: bcryptjs 2.4.3
Algorithm: bcrypt
Salt Rounds: 10 (default)
```

### JWT Token Management
```
Library: jsonwebtoken 9.0.3
Algorithm: HS256 (HMAC SHA-256)
Token Expiry: 7 days
```

---

## Known Issues and Workarounds

### Issue 1: Prisma 5.22.0 WASM Bug
**Status:** RESOLVED  
**Workaround:** Upgraded to Prisma 6.19.2

### Issue 2: Environment Variable Loading
**Status:** KNOWN  
**Workaround:** Explicitly set DATABASE_URL in command line

### Issue 3: Port Already in Use
**Status:** KNOWN  
**Workaround:** Kill existing processes with `lsof -ti:<port> | xargs kill -9`

---

## Verification Tests

### System Compatibility
- ✅ Node.js version compatible
- ✅ npm version compatible
- ✅ ARM64 architecture supported
- ✅ macOS version compatible

### Dependencies
- ✅ All npm packages installed
- ✅ No security vulnerabilities reported
- ✅ Peer dependencies satisfied

### Services
- ✅ Backend server starts successfully
- ✅ Frontend server starts successfully
- ✅ Database accessible
- ✅ Prisma client generated

### Network
- ✅ Ports 3001 and 5173 available
- ✅ CORS configured correctly
- ✅ API endpoints reachable

---

## Recommendations

### System Updates
- ✅ Node.js version is current
- ✅ npm version is current
- ⚠️ Consider pinning Node version in .nvmrc file

### Dependency Management
- ⚠️ Pin Prisma to 6.x in package.json
- ⚠️ Review for any deprecated dependencies
- ⚠️ Set up Dependabot for security updates

### Performance Optimization
- ✅ Vite provides fast hot reload
- ✅ SQLite is fast for development
- ⚠️ Consider PostgreSQL for production

---

**System Validation:** ✅ COMPLETE  
**All Checks Passed:** ✅ YES  
**Environment Ready:** ✅ CONFIRMED
