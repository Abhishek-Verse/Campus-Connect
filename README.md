# CampusHub

**CampusHub** is a college event and attendance management platform built as a modular monolith. It provides students with a unified portal to discover events, register, and present a permanent Universal QR pass, while giving club organizers operational tools to manage events, scan attendee passes with real-time feedback, and export attendance records directly to Excel.

---

## Architecture & Technology Stack

- **Architecture:** Modular Monolith
- **Frontend:** HTML5, Modern CSS3 (responsive grid system, strict professional palette, no emoji clutter), Vanilla JavaScript ES6+
- **Backend:** Node.js, Express.js (REST API, JWT authentication, rate limiting, Helmet CSP)
- **Database & ORM:** PostgreSQL on Amazon RDS or local PostgreSQL via Prisma ORM
- **Export Engine:** ExcelJS (auto-formatted `.xlsx` and `.csv` reports with full academic details)
- **Camera Scanner:** `html5-qrcode` library with tactile Web Audio API feedback
- **Cloud Infrastructure:** AWS EC2, Amazon RDS (PostgreSQL), Amazon S3, AWS IAM, CloudWatch

---

## Key Features

1. **Dual Portals (Student & Club)**:
   - **Student Portal**: Event discovery, instant registration, Universal QR code pass, personal attendance history, and profile management with academic credentials.
   - **Club Portal**: Multi-status event lifecycle management (Draft $\leftrightarrow$ Published $\leftrightarrow$ Cancelled), live camera QR attendance scanner, registrations manager, and Excel export.

2. **Universal QR Identifier**:
   - Each student is assigned a permanent, opaque QR token (`CH-XXXXXXXX`).
   - The token contains no plain text credentials; identity and registration eligibility are verified securely on the backend in real time.

3. **High-Speed Scanner UI**:
   - Camera-first interface with full-screen feedback overlays (green approval animation for valid entry, red warning for non-registered students).
   - Audio feedback chime and rapid 1.4-second reset for continuous line check-ins.

4. **Comprehensive Academic Identity & Excel Exports**:
   - Captures Full Name, GSuite Email, ERP ID, Roll Number, Department (dropdown), Division (A/B/C/D), Gender, College Name, Admission Year, and Passing Year.
   - Excel exports cleanly format all student academic fields alongside check-in timestamps for university auditing and viva submissions.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later)
- [PostgreSQL](https://www.postgresql.org/) (local instance running on port `5432` or an Amazon RDS PostgreSQL endpoint)
- Modern web browser (Chrome, Edge, Firefox, Safari)

---

### Step-by-Step Local Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/Abhishek-Verse/Campus-Connect.git
cd Campus-Connect
```

#### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

#### 3. Configure Environment Variables

Create a `.env` file inside the `backend/` directory by copying `.env.example`:

```bash
cp .env.example .env
```

Ensure your `DATABASE_URL` matches your PostgreSQL configuration:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/campushub"
JWT_SECRET=super-secret-campushub-jwt-key-2026-secure
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

#### 4. Initialize Database Schema & Seed Data

Push the Prisma schema to create the tables in PostgreSQL and load the demo clubs and events:

```bash
# Push schema to PostgreSQL database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Populate with realistic college seed data
node prisma/seed.js
```

#### 5. Start the Application

```bash
# Development mode with hot-reload
npm run dev

# Or standard start
npm start
```

The Express server serves both the REST API and the static frontend on port `3000`.

#### 6. Open in Browser

Visit:
```
http://localhost:3000
```

---

## Demo Accounts

### Club Organizer Account
- **Portal:** Click **Club Portal** on the login page
- **Email:** `codingclub@campushub.edu`
- **Password:** `password123`

### Pre-Seeded Student Accounts
- **Portal:** Click **Student Portal** on the login page
- **Student 1:** `rahul@test.com` (pw: `password123`)
- **Student 2:** `priya@test.com` (pw: `password123`)
- *Or register a new student account instantly using the Register form.*

---

## Project Structure

```text
CAMPUS-CONNECT/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database models (User, Club, Event, Registration, Attendance)
│   │   └── seed.js             # Demo data seeder
│   ├── src/
│   │   ├── config/             # DB & environment configuration
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Auth, validation, & error handling
│   │   ├── routes/             # REST API endpoint routes (/api/v1/...)
│   │   ├── services/           # Core business logic (attendance, events, export)
│   │   ├── validators/         # Zod schemas
│   │   ├── app.js              # Express app & static file serving
│   │   └── server.js           # Server entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── assets/                 # Brand logos and static images
│   ├── css/
│   │   ├── global.css          # Design system & shared components
│   │   ├── auth.css            # Auth card styling
│   │   ├── club.css            # Club dashboard & forms
│   │   └── scanner.css         # Camera overlay & feedback animations
│   ├── js/
│   │   ├── api/client.js       # Centralized API fetch client
│   │   ├── auth/auth.js        # Session & token manager
│   │   └── utils/navigation.js # Responsive sidebar navigation
│   ├── pages/
│   │   ├── auth/               # login.html, register.html
│   │   ├── club/               # dashboard, manage-events, edit-event, scanner, attendance, registrations
│   │   └── student/            # dashboard, events, event-details, my-qr, my-events, profile
│   └── index.html              # Landing page
├── docs/                       # PRD, SRS, Architecture, & DB Design documentation
└── README.md
```

---

## Verification & Testing

To run the API validation unit tests:

```bash
cd backend
node ../tests/validators.test.js
```

---

## License

This project is licensed under the MIT License.
