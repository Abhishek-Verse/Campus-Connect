# CampusHub

[![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)](https://github.com/Abhishek-Verse/Campus-Connect/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20.x%20LTS-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-Amazon%20RDS%20PostgreSQL-336791.svg)](https://aws.amazon.com/rds/postgresql/)
[![AWS](https://img.shields.io/badge/Cloud-EC2%20%7C%20RDS%20%7C%20S3-FF9900.svg)](https://aws.amazon.com/)
[![PWA](https://img.shields.io/badge/PWA-Installable%20%26%20Offline%20Ready-5A0FC8.svg)](https://web.dev/progressive-web-apps/)

**CampusHub** is a production-grade college event and attendance management platform built as a high-performance modular monolith. It provides students with a unified portal to discover campus activities, register instantly, and present an offline-capable permanent Universal QR Pass, while providing club organizers operational tools to create events, run direct camera check-ins with tactile feedback, prevent duplicate entry, and export official reports to Excel.

---

## Architecture & Technology Stack

- **Architecture:** Modular Monolith (Strict separation of Routes &rarr; Middleware &rarr; Controllers &rarr; Services &rarr; Prisma &rarr; PostgreSQL)
- **Frontend:** HTML5, Modern CSS3 (Neo-Brutalist Elegance design system, light paper background `#f5f1e7`, high-contrast borders), Vanilla JavaScript ES6+
- **Backend:** Node.js, Express.js (REST API, JWT authentication, rate limiting, Helmet CSP)
- **Database & ORM:** PostgreSQL on **Amazon RDS** (or local PostgreSQL) managed through **Prisma ORM**
- **Mobile & Offline:** **Progressive Web App (PWA)** with Service Worker (`sw.js` v2), Web App Manifest (`standalone` mode), and client-side offline QR pass hydration
- **Camera Scanner:** `html5-qrcode` library with direct camera startup, zero-latency scanning, Web Audio API chimes, and full-screen visual status overlays
- **Export Engine:** ExcelJS (auto-formatted `.xlsx` and `.csv` audit spreadsheets with student academic identity)
- **Cloud Infrastructure:** AWS EC2, Amazon RDS (PostgreSQL), Amazon S3, AWS IAM, CloudWatch, Nginx reverse proxy

---

## Key Features

### 1. Dual Operational Portals
* **Student Portal:**
  * Event discovery grid with category and title search.
  * Instant event registration with real-time seat tracking and capacity enforcement.
  * **Universal Student Pass:** Permanent, offline-capable digital pass with high-density QR code.
  * Personal attendance ledger (Present/Absent tracking with timestamps).
  * Academic profile manager with editable personal details and locked university credentials.
* **Club Console:**
  * Multi-status event lifecycle management (`DRAFT` &harr; `PUBLISHED` &harr; `CANCELLED` &harr; `COMPLETED`).
  * Direct camera scanner for rapid venue gate check-in.
  * Attendee roster viewer with live registration counts.
  * Instant `.xlsx` / `.csv` attendance exports for university viva and auditing.
  * Notice board publisher with priority flags (`NORMAL`, `IMPORTANT`, `URGENT`).

### 2. Universal QR Code Identifier
* Each student receives an opaque, permanent token (e.g., `CH-C37C35FD`).
* The QR payload contains **no plain-text credentials, passwords, or personal data**.
* Identity, event registration status, and entry authorization are resolved securely on the backend in a single database transaction.

### 3. Direct Operational Scanner
* **Camera-First Simplicity:** Camera automatically initializes immediately upon event selection.
* **Instant Tactile & Visual Feedback:**
  * `✓ ENTRY ALLOWED` (Green badge + pleasant high chime) &rarr; displays student name, roll number, ERP ID, department, and division.
  * `ALREADY ATTENDED` (Yellow badge + chirp) &rarr; prevents duplicate entry by the same student.
  * `✕ ENTRY DENIED` (Red badge + error buzz) &rarr; alerts if student is not registered or QR is invalid.
* **1.4-Second Auto-Reset:** Seamlessly returns to active camera scanning without requiring button clicks or page reloads.
* **Fallback Manual Entry:** Allows manual QR token entry if cameras are unavailable or permissions are restricted.

### 4. Progressive Web App (PWA) & Offline Shell
* **Installable:** Add to Home Screen on Android, iOS Safari, and Desktop as a standalone app with no browser URL bar.
* **Offline Student Pass:** Students can display their Universal QR Pass in basement auditoriums or crowded venues with zero network coverage.
* **Caching Strategy:**
  * API endpoints (`/api/v1/*`): Network-only (guarantees real-time attendance and seat counts).
  * Navigation requests: Network-first with offline fallback shell.
  * Static assets: Stale-while-revalidate for instantaneous load speeds.

---

## AWS Infrastructure Architecture

```text
                                Internet
                                   |
                                   v
                          [ Amazon EC2 Instance ]
                       (Ubuntu 22.04 LTS / 24.04 LTS)
                                   |
                 +-----------------+-----------------+
                 |                                   |
                 v                                   v
         [ Nginx Reverse Proxy ]              [ PM2 Daemon ]
        (Port 80/443 SSL Certbot)       (Node.js + Express Port 3000)
                 |                                   |
                 |                                   +-----> Static Frontend (/opt/campushub/frontend)
                 |                                   +-----> REST API Routes (/api/v1/*)
                 |
                 +-----------------+-----------------+
                                   |
                 +-----------------+-----------------+
                 |                                   |
                 v                                   v
      [ Amazon RDS PostgreSQL ]               [ Amazon S3 Bucket ]
     (campushub-db us-east-1 / 5432)        (Event Posters & Club Media)
                 |                                   |
                 +-----------------+-----------------+
                                   |
                                   v
                         [ AWS IAM & CloudWatch ]
```

---

## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.x or v20.x LTS)
* PostgreSQL database ([Amazon RDS PostgreSQL](https://aws.amazon.com/rds/postgresql/) or local instance running on port `5432`)
* Modern web browser (Chrome, Safari, Edge, Firefox)

---

### Step-by-Step Local Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/Abhishek-Verse/Campus-Connect.git
cd Campus-Connect
```

#### 2. Install Dependencies
```bash
cd backend
npm install
```

#### 3. Configure Environment Variables
Inside `backend/`, copy the example environment file:
```bash
cp .env.example .env
```

Edit `backend/.env` with your active database configuration:

```env
NODE_ENV=development
PORT=3000

# AWS RDS PostgreSQL (or local: postgresql://postgres:password@localhost:5432/campushub)
DATABASE_URL="postgresql://<USER>:<PASSWORD>@<RDS_ENDPOINT>:5432/<DB_NAME>?sslmode=require"

# JWT Secret
JWT_SECRET=super-secret-campushub-jwt-key-2026-secure
JWT_EXPIRES_IN=7d

# AWS S3 Storage (optional for local development)
AWS_REGION=ap-south-1
AWS_S3_BUCKET=campushub-dev
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY

# CORS & Rate Limiting
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

#### 4. Push Database Schema & Seed Initial Data
```bash
# Push Prisma schema to PostgreSQL / AWS RDS
npx prisma db push

# Populate official college clubs, venues, and organizer accounts
node prisma/seed.js
```

#### 5. Start the Application
```bash
# Start standard Node.js server
npm start

# Or development mode with file watcher
npm run dev
```

The Express server serves both the REST API and the static frontend on **`http://localhost:3000`**.

---

## Default Access & Accounts

### Club Organizer Access
* **Portal:** Select **Club Portal** on the login page ([`/pages/auth/login.html`](http://localhost:3000/pages/auth/login.html))
* **Default Seed Accounts:**
  * Coding Club: `codingclub@campushub.edu` (pw: `password123`)
  * Cultural Club: `culturalclub@campushub.edu` (pw: `password123`)
  * Sports Club: `sportsclub@campushub.edu` (pw: `password123`)

### Student Access
* **Portal:** Select **Student Portal** on the login page
* Students can register their college profile (Roll No, ERP ID, Department, Division) at [`/pages/auth/register.html`](http://localhost:3000/pages/auth/register.html) to instantly generate their permanent Universal QR Pass.

---

## Deploying to AWS EC2

CampusHub includes production-ready configuration templates in the [`infrastructure/`](file:///d:/PROJECT/CAMPUS-CONNECT/infrastructure) directory.

### Quick Deployment Steps on EC2:

1. **Launch an EC2 Instance:**
   * AMI: Ubuntu Server 22.04 LTS or 24.04 LTS (t2.micro / t3.micro).
   * Security Group: Allow Inbound **SSH (22)**, **HTTP (80)**, and **HTTPS (443)**.

2. **Link to Amazon RDS:**
   * In your RDS Security Group, add an Inbound Rule allowing **PostgreSQL (5432)** from your EC2 Security Group ID.

3. **Run Automated Setup on EC2:**
   ```bash
   # Connect to your instance
   ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>

   # Clone the repository
   sudo git clone https://github.com/Abhishek-Verse/Campus-Connect.git /opt/campushub
   sudo chown -R ubuntu:ubuntu /opt/campushub

   # Run automated setup (Node 20, PM2, Nginx, UFW)
   cd /opt/campushub/infrastructure
   sudo bash ec2-setup.sh
   ```

4. **Configure Production Environment & Start App:**
   ```bash
   # Create production .env
   cp /opt/campushub/backend/.env.production.example /opt/campushub/backend/.env
   nano /opt/campushub/backend/.env   # paste your active RDS credentials

   # Install dependencies and sync DB
   cd /opt/campushub/backend
   npm install --omit=dev
   npx prisma db push
   node prisma/seed.js

   # Launch with PM2 process manager
   pm2 start /opt/campushub/infrastructure/ecosystem.config.cjs
   pm2 save
   pm2 startup
   ```

5. **Enable Free HTTPS with Let's Encrypt Certbot:**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

---

## Project Structure

```text
CAMPUS-CONNECT/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma            # Prisma schema (PostgreSQL models & constraints)
│   │   └── seed.js                  # Database seeder (clubs, venues, organizers)
│   ├── src/
│   │   ├── config/                  # Database client & environment validation (Zod)
│   │   ├── controllers/             # Request handlers (auth, events, attendance, etc.)
│   │   ├── middleware/              # JWT auth, role guard, upload & error handling
│   │   ├── routes/                  # API route definitions (/api/v1/...)
│   │   ├── services/                # Core business logic & database transactions
│   │   ├── utils/                   # JWT helpers, response formatters
│   │   ├── validators/              # Zod input validation schemas
│   │   ├── app.js                   # Express app setup & static file mounts
│   │   └── server.js                # Server entry point
│   ├── .env.example                 # Local environment template
│   ├── .env.production.example      # Production EC2 environment template
│   └── package.json
├── frontend/
│   ├── assets/
│   │   └── icons/                   # PWA icons (192x192, 512x512, SVG, Apple touch icon)
│   ├── css/
│   │   ├── global.css               # Design system & shared components
│   │   ├── auth.css                 # Auth cards & mobile touch scrolling
│   │   ├── student.css              # Student portal styles & pass layout
│   │   ├── club.css                 # Club management styles & dashboards
│   │   └── scanner.css              # Camera stage & full-screen feedback overlays
│   ├── js/
│   │   ├── api/client.js            # Centralized API fetch client
│   │   ├── auth/auth.js             # Session & role state manager
│   │   └── utils/
│   │       ├── helpers.js           # Toast, loading, formatting utilities
│   │       ├── navigation.js        # Responsive sidebar & mobile bottom bar
│   │       └── pwa.js               # Service worker registration & install prompts
│   ├── pages/
│   │   ├── auth/                    # login.html, register.html
│   │   ├── club/                    # dashboard, manage-events, edit-event, scanner, attendance, registrations, notices
│   │   └── student/                 # dashboard, events, event-details, my-qr, my-events, attendance, profile
│   ├── manifest.json                # PWA Web App Manifest (standalone, theme `#f5f1e7`)
│   ├── sw.js                        # Service Worker (precaches 27-asset offline shell)
│   └── index.html                   # Platform landing page
├── infrastructure/
│   ├── ec2-setup.sh                 # Automated Ubuntu setup script
│   ├── nginx.conf                   # Production Nginx reverse proxy configuration
│   ├── ecosystem.config.cjs         # PM2 process manager configuration
│   └── campushub.service            # Systemd service unit configuration
├── docs/                            # PRD, SRS, Architecture, Security, & Testing docs
├── tests/                           # Unit and integration test suites
├── package.json                     # Monorepo scripts
└── README.md
```

---

## Verification & Testing

To run the automated validation tests:

```bash
# Run API validator test suite
node tests/validators.test.js

# Test health check on running server
curl http://localhost:3000/api/v1/health
```

---

## License

This project is licensed under the [MIT License](LICENSE).
