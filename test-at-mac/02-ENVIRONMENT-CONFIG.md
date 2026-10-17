# Environment Configuration Report

**Test Date:** 20 March 2026  
**Platform:** Apple Silicon macOS (arm64)  
**Repository:** sendtoshailesh/Agentic-SDLC-app2

---

## System Information

### Hardware
- **Architecture:** arm64 (Apple Silicon)
- **Processor:** Apple M-series chip
- **Platform:** macOS

### Software
- **OS:** macOS (current)
- **Shell:** zsh (default macOS shell)
- **Terminal:** macOS Terminal / iTerm2

---

## Node.js Environment

### Node Version Manager (nvm)
- **Status:** Installed and active
- **Usage:** Version switching during troubleshooting

### Node.js Versions Tested
1. **v20.x** (initial attempt)
   - Installed via `nvm install 20`
   - Did not resolve Prisma enum issue
   
2. **v25.6.1** (final)
   - Currently active
   - Compatible with Prisma 6.19.2
   - All tests passed with this version

### Package Manager
- **npm Version:** 11.9.0
- **Package Lock Version:** v3 (npm 7+)

---

## Project Dependencies

### Backend Dependencies (package.json)

#### Production Dependencies
```json
{
  "@prisma/client": "6.19.2",
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "express": "^4.18.2",
  "jsonwebtoken": "^9.0.0"
}
```

#### Development Dependencies
```json
{
  "@types/bcryptjs": "^2.4.6",
  "@types/cors": "^2.8.17",
  "@types/express": "^4.17.21",
  "@types/jest": "^29.5.0",
  "@types/jsonwebtoken": "^9.0.0",
  "@types/node": "^20.0.0",
  "eslint": "^8.40.0",
  "jest": "^29.5.0",
  "prisma": "6.19.2",
  "ts-jest": "^29.1.0",
  "ts-node": "^10.9.1",
  "ts-node-dev": "^2.0.0",
  "typescript": "^5.0.4"
}
```

### Frontend Dependencies (package.json)

#### Production Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.11.0"
}
```

#### Development Dependencies
```json
{
  "@types/react": "^18.0.37",
  "@types/react-dom": "^18.0.11",
  "@vitejs/plugin-react": "^4.0.0",
  "typescript": "^5.0.2",
  "vite": "^5.0.0"
}
```

---

## Prisma Configuration

### Version History
| Version | Status | Notes |
|---------|--------|-------|
| 5.22.0 | ❌ Failed | WASM validator enum bug on Apple Silicon |
| 7.5.0 | ❌ Failed | Breaking changes in datasource configuration |
| 6.19.2 | ✅ Success | Final working version |

### Prisma Client Settings
```prisma
generator client {
  provider   = "prisma-client-js"
  engineType = "binary"
}
```

### Database Configuration
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### Prisma Config File (prisma.config.ts)
```typescript
import { defineConfig } from 'prisma/config';

export default defineConfig({
  migrations: {
    seed: 'ts-node prisma/seed.ts',
  },
});
```

---

## Environment Variables

### Backend .env File
Location: `src/backend/.env`

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your-secret-key-change-in-production"

# Server
PORT=3001

# App name — shown in Navbar and Login/Register pages
VITE_APP_NAME="Workshop App"
```

### Configuration Notes
1. **DATABASE_URL:** SQLite file path relative to src/backend/
2. **JWT_SECRET:** Development secret (should be changed for production)
3. **PORT:** Backend server port (3001)
4. **VITE_APP_NAME:** Application display name

### Environment Setup Process
```bash
# .env file was missing initially
ls -la | grep env
# Output: -rw-r--r--   .env.example

# Created from template
cp .env.example .env

# Required for Prisma commands with prisma.config.ts override
DATABASE_URL="file:./dev.db" npm run db:migrate
```

---

## Database Setup

### SQLite Database
- **Location:** `src/backend/dev.db`
- **Type:** SQLite 3
- **Connection String:** `file:./dev.db`

### Schema Information
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
}

enum OfferStatus {
  ACTIVE
  INACTIVE
}

model Offer {
  id             Int         @id @default(autoincrement())
  status         OfferStatus @default(ACTIVE)
  startDate      DateTime
  endDate        DateTime
  merchantId     String
  skus           String
  discountAmount Float
  createdAt      DateTime    @default(now())
  redemptions    Redemption[]
}

model Redemption {
  id        Int      @id @default(autoincrement())
  offerId   Int
  offer     Offer    @relation(fields: [offerId], references: [id])
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
```

### Migrations
```
migrations/
└─ 20260309064519_init/
   └─ migration.sql
```

### Seed Data
- **Users:** 1 test user
- **Offers:** 5 sample offers (3 ACTIVE, 2 INACTIVE)
- **Redemptions:** 1 sample redemption

---

## Server Configuration

### Backend Server (Express)
- **Port:** 3001
- **Host:** localhost
- **Base URL:** http://localhost:3001
- **Entry Point:** src/backend/src/index.ts
- **Dev Server:** ts-node-dev with auto-restart

### API Endpoints
```
POST   /api/auth/register     - User registration
POST   /api/auth/login        - User authentication
GET    /api/offers            - List all offers (protected)
POST   /api/offers            - Create offer (protected)
GET    /api/offers/:id        - Get offer by ID (protected)
PUT    /api/offers/:id        - Update offer (protected)
DELETE /api/offers/:id        - Delete offer (protected)
GET    /api/redemptions       - List redemptions (protected)
POST   /api/redemptions       - Create redemption (protected)
GET    /api/transactions      - List transactions (protected)
```

### Frontend Server (Vite)
- **Port:** 5173
- **Host:** localhost
- **Base URL:** http://localhost:5173
- **Build Tool:** Vite 5.4.21
- **Dev Server:** Hot Module Replacement (HMR) enabled

### CORS Configuration
```typescript
// Backend allows frontend origin
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

---

## Testing Environment

### Test User Credentials
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Test Frameworks
- **Unit Tests:** Jest
- **E2E Tests:** Playwright
- **API Tests:** curl + jq

---

## Build and Development Scripts

### Backend Scripts
```json
{
  "dev": "ts-node-dev --respawn src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "test": "jest",
  "test:coverage": "jest --coverage",
  "db:migrate": "prisma migrate dev",
  "db:generate": "prisma generate",
  "db:seed": "ts-node prisma/seed.ts",
  "lint": "eslint src --ext .ts"
}
```

### Frontend Scripts
```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint src --ext .ts,.tsx"
}
```

### E2E Scripts
```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

---

## Known Configuration Issues and Resolutions

### Issue 1: Prisma ignores .env file
**Symptom:** `Environment variable not found: DATABASE_URL`  
**Cause:** Prisma 6.x with prisma.config.ts skips .env loading  
**Solution:** Explicitly set DATABASE_URL when running commands:
```bash
DATABASE_URL="file:./dev.db" npm run db:migrate
```

### Issue 2: Port 3001 already in use
**Symptom:** `EADDRINUSE: address already in use :::3001`  
**Cause:** Previous server instance not stopped  
**Solution:**
```bash
lsof -ti:3001 | xargs kill -9
```

### Issue 3: Prisma version mismatch
**Symptom:** Different errors based on global vs local Prisma  
**Cause:** Using `npx prisma` instead of `npm run db:*`  
**Solution:** Always use npm scripts which resolve to local node_modules/.bin/prisma

---

## Performance Metrics

### Server Startup Times
| Component | Startup Time | Status |
|-----------|--------------|--------|
| Backend (ts-node-dev) | ~2-3 seconds | ✅ Normal |
| Frontend (Vite) | ~911ms | ✅ Fast |
| Prisma Client Generation | 115ms | ✅ Fast |

### Database Operations
| Operation | Duration | Status |
|-----------|----------|--------|
| Migration Apply | <1 second | ✅ Fast |
| Seed Data Insert | <1 second | ✅ Fast |
| Query Execution | <50ms | ✅ Fast |

---

## Security Considerations

### Development Environment Only
⚠️ **Warning:** This configuration is for local development only

**Production Changes Required:**
1. Change JWT_SECRET to cryptographically secure random string
2. Enable HTTPS for all endpoints
3. Configure proper CORS policies
4. Use PostgreSQL or MySQL instead of SQLite
5. Add rate limiting middleware
6. Implement proper error handling without stack traces
7. Enable secure cookie settings
8. Add helmet.js security headers

---

## Directory Structure

```
Agentic-SDLC-app2/
├── .github/
│   └── copilot-instructions.md
├── docs/
│   ├── design/
│   │   └── design-doc.md
│   └── requirements/
│       └── BRD.md
├── e2e/
│   └── perk-platform.spec.ts
├── issues/
├── src/
│   ├── backend/
│   │   ├── .env
│   │   ├── .env.example
│   │   ├── package.json
│   │   ├── prisma.config.ts
│   │   ├── tsconfig.json
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── seed.ts
│   │   │   └── migrations/
│   │   └── src/
│   │       ├── index.ts
│   │       ├── middleware/
│   │       ├── routes/
│   │       └── controllers/
│   └── frontend/
│       ├── package.json
│       ├── vite.config.ts
│       └── src/
│           ├── App.tsx
│           ├── main.tsx
│           ├── components/
│           └── pages/
├── test-at-mac/           ← Test reports (this folder)
├── workshop/
├── package.json
├── playwright.config.ts
└── README.md
```

---

## Recommended Next Steps

1. **Update package.json:** Pin Prisma to 6.x in both package.json files
2. **Document Setup:** Add Apple Silicon setup notes to README.md
3. **CI/CD Configuration:** Configure GitHub Actions with Prisma 6.x
4. **Environment Validation:** Create pre-workshop validation script
5. **Production Config:** Create separate .env.production template

---

**Configuration Validation:** ✅ COMPLETE  
**All Services Running:** ✅ CONFIRMED  
**Ready for Testing:** ✅ YES
