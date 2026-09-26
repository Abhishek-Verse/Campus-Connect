# CampusHub — AWS Deployment Specification

## 1. Purpose

This document defines how CampusHub will be deployed using the project's required technology stack:

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Node.js
- Express.js
- PostgreSQL
- Amazon RDS
- Amazon EC2
- Amazon S3
- AWS IAM
- AWS CloudWatch

The project should remain simple, understandable, and suitable for a 2nd-year college project and viva.

---

## 2. Technology Rule

CampusHub must not introduce frontend frameworks such as:

- React
- Angular
- Vue
- Next.js
- Nuxt
- Bootstrap
- Tailwind CSS

### Frontend

Use only:

- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API
- Browser APIs

Small JavaScript libraries may be used only when they directly support a required feature, such as QR generation or QR scanning. They must not replace the application's frontend architecture.

### Backend

Use:

- Node.js
- Express.js
- Prisma
- PostgreSQL

### AWS

Use:

- EC2
- RDS
- S3
- IAM
- CloudWatch

Optional AWS services should not be added to the MVP unless there is a clear requirement.

---

# 3. Deployment Architecture

```text
                    Internet
                       |
                       v
              +----------------+
              |   EC2 Server   |
              | Node.js +      |
              | Express.js     |
              +----------------+
                 |          |
                 |          |
                 v          v
        +---------------+  +---------------+
        | Amazon RDS    |  | Amazon S3     |
        | PostgreSQL    |  | Event files   |
        | Database      |  | Posters/docs  |
        +---------------+  +---------------+
                 |
                 v
             CloudWatch
              Logging
```

The browser communicates with the backend over HTTPS.

The browser must never connect directly to RDS.

The browser must never contain AWS credentials.

---

# 4. Frontend Deployment

The frontend consists of static files:

```text
frontend/
├── index.html
├── pages/
├── css/
├── js/
└── assets/
```

These files contain:

- HTML pages
- CSS styles
- Vanilla JavaScript
- Images
- Icons
- Client-side validation
- API calls using Fetch

The frontend communicates with the backend through REST APIs.

Example:

```text
HTML
  ↓
JavaScript
  ↓
fetch()
  ↓
https://campushub.example/api/v1/...
  ↓
Express.js
```

The frontend must not contain:

```text
DATABASE_URL
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
JWT_SECRET
SESSION_SECRET
```

or any other server-side secret.

---

# 5. Backend Deployment on EC2

The Node.js/Express application runs on Amazon EC2.

Example production structure:

```text
/opt/campushub/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── .env
└── frontend/
```

The backend process must run as a managed service so that it can restart after failure or server reboot.

A process manager such as PM2 may be used if required.

Do not introduce Docker, Kubernetes, ECS, Lambda, or microservices for the MVP unless the project requirements are explicitly changed.

---

# 6. PostgreSQL on Amazon RDS

CampusHub uses PostgreSQL as its primary database.

Amazon RDS is responsible for:

- Users
- Clubs
- Club members
- Events
- Registrations
- Attendance
- Notices
- Venues
- Relationships
- Constraints
- Indexes

The application connects to RDS through Prisma.

```text
Express.js
    |
    v
Prisma
    |
    v
PostgreSQL
    |
    v
Amazon RDS
```

RDS should not be publicly exposed unnecessarily.

The EC2 instance should be allowed to communicate with the RDS instance through AWS security groups.

---

# 7. Amazon S3

S3 is used for file storage.

Recommended structure:

```text
campushub-production/
├── clubs/
│   └── {clubId}/
│       └── logo.png
├── events/
│   └── {eventId}/
│       └── poster.webp
└── documents/
    └── {eventId}/
        └── document.pdf
```

The database stores the S3 object key or reference.

Example:

```text
events/evt_123/poster.webp
```

The database should not store large binary files.

S3 should not be treated as the source of truth for attendance or registrations.

---

# 8. AWS IAM

Use IAM to control AWS permissions.

The application should follow least privilege.

The EC2 application should receive only the permissions it actually needs.

For example:

```text
EC2 Application
    |
    +--> S3: required bucket/object operations
```

Do not use the AWS root account for application operations.

Do not place AWS access keys in:

- HTML
- CSS
- JavaScript
- Git repositories
- README files
- screenshots
- API responses

---

# 9. Environment Variables

Server-side configuration should be stored in environment variables.

Example `.env`:

```env
NODE_ENV=production
PORT=3000

DATABASE_URL=postgresql://...

AWS_REGION=...
AWS_S3_BUCKET=...

JWT_SECRET=...
```

The actual values must never be committed to Git.

Provide only safe placeholders in:

```text
backend/.env.example
```

Example:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=
AWS_REGION=
AWS_S3_BUCKET=
JWT_SECRET=
```

---

# 10. HTTPS

Production communication should use HTTPS.

The expected flow is:

```text
Browser
   |
 HTTPS
   |
   v
EC2 / Reverse Proxy
   |
   v
Node.js + Express
```

HTTP should redirect to HTTPS in production.

Authentication credentials, session tokens, and other sensitive data must not be sent over plain HTTP.

---

# 11. Security Groups

A simple deployment should use separate security rules for the web server and database.

### EC2

Allow:

```text
HTTP/HTTPS from the internet
SSH only from an administrator's allowed IP when required
```

### RDS

Allow:

```text
PostgreSQL traffic only from the EC2 security group
```

Do not expose PostgreSQL directly to the public internet for normal operation.

---

# 12. CloudWatch

Amazon CloudWatch can be used for:

- Application logs
- Server monitoring
- Error investigation
- CPU monitoring
- Memory monitoring where configured
- Basic operational alerts

Important application events may include:

```text
Server started
Database connection established
Authentication failure
Unauthorized access attempt
Event creation
Registration failure
Attendance scan failure
Attendance successfully recorded
S3 upload failure
Unexpected server error
```

Do not log:

- Passwords
- Password hashes
- JWT/session secrets
- AWS credentials
- Complete sensitive student information unnecessarily

---

# 13. Database Migration

Prisma migrations must be used to manage database schema changes.

Development:

```bash
npx prisma migrate dev
```

Production:

```bash
npx prisma migrate deploy
```

Do not manually modify production tables unless there is a controlled reason and the change is reflected in the Prisma schema/migration history.

---

# 14. Production Request Flow

A normal API request follows:

```text
Browser
   |
   | HTTPS
   v
Express Route
   |
   v
Authentication Middleware
   |
   v
Role / Authorization Middleware
   |
   v
Validation Middleware
   |
   v
Controller
   |
   v
Service
   |
   +------> Prisma ------> RDS
   |
   +------> S3 Service --> S3
   |
   v
Response
   |
   v
Browser
```

The frontend must not bypass this flow.

---

# 15. Attendance Scan in Production

Attendance remains backend-controlled.

```text
Student QR
    |
    v
Club Scanner
    |
    v
POST /events/:eventId/attendance/scan
    |
    v
Authentication
    |
    v
Club authorization
    |
    v
QR token lookup
    |
    v
Student lookup
    |
    v
Registration check
    |
    v
Duplicate attendance check
    |
    v
Database transaction
    |
    v
Attendance recorded
    |
    v
Response to scanner
```

The QR code itself does not grant attendance access.

The database remains the source of truth.

---

# 16. File Upload Flow

For event posters:

```text
Club Portal
    |
    v
HTML file input
    |
    v
Vanilla JavaScript
    |
    v
Express API
    |
    v
Validation
    |
    v
S3 Service
    |
    v
Amazon S3
```

The backend must validate uploaded files.

At minimum validate:

- File type
- File size
- Required fields
- Event ownership/authorization

Do not allow arbitrary file uploads without validation.

---

# 17. Deployment Sequence

Recommended deployment order:

### Step 1 — Prepare AWS

Create:

- IAM configuration
- EC2 instance
- RDS PostgreSQL database
- S3 bucket
- Security groups

### Step 2 — Configure RDS

Create the database and verify that EC2 can connect to it.

### Step 3 — Configure EC2

Install:

- Node.js
- npm
- Git
- Required production tools

### Step 4 — Deploy Backend

Upload or clone the CampusHub project.

Install dependencies:

```bash
npm install
```

Configure environment variables.

### Step 5 — Run Prisma Migration

```bash
npx prisma migrate deploy
```

### Step 6 — Start Express

Start the Node.js application using the selected process manager.

### Step 7 — Deploy Frontend

Serve the static HTML/CSS/JavaScript files through the production web setup.

### Step 8 — Configure HTTPS

Configure the production domain and HTTPS.

### Step 9 — Test

Verify:

- Login
- Registration
- Event creation
- Event registration
- QR generation
- QR scanning
- Attendance
- Notices
- S3 uploads
- Attendance export

### Step 10 — Monitor

Check application logs and CloudWatch after deployment.

---

# 18. Production Checklist

Before demonstrating or deploying CampusHub:

## Application

- [ ] Frontend loads correctly
- [ ] API is reachable
- [ ] Authentication works
- [ ] Role authorization works
- [ ] Event creation works
- [ ] Registration works
- [ ] QR generation works
- [ ] QR scanning works
- [ ] Attendance validation works
- [ ] Duplicate attendance is prevented
- [ ] Notices work
- [ ] Attendance export works

## Database

- [ ] RDS is reachable from EC2
- [ ] Prisma migrations are applied
- [ ] Unique constraints exist
- [ ] Required indexes exist
- [ ] Database is not publicly exposed unnecessarily

## S3

- [ ] Bucket exists
- [ ] Upload works
- [ ] Object keys are stored correctly
- [ ] Unauthorized uploads are rejected
- [ ] Sensitive files are not accidentally public

## Security

- [ ] HTTPS is enabled
- [ ] Secrets are stored outside source code
- [ ] `.env` is not committed
- [ ] IAM permissions are limited
- [ ] RDS is protected by security groups
- [ ] CORS is restricted appropriately
- [ ] Rate limiting is enabled
- [ ] Helmet is enabled

## Monitoring

- [ ] CloudWatch logging works
- [ ] Server errors are visible
- [ ] Important security events are logged
- [ ] Sensitive data is not logged

---

# 19. Cost Control for a College Project

CampusHub should avoid unnecessary AWS services.

The MVP should prefer a simple architecture:

```text
EC2
 |
 +---- Node.js + Express
 |
 +---- Static HTML/CSS/JavaScript

RDS
 |
 +---- PostgreSQL

S3
 |
 +---- Event files

CloudWatch
 |
 +---- Logs and basic monitoring
```

Do not add services simply because they are available.

Potential future services such as:

- CloudFront
- Cognito
- SES
- SNS
- Lambda
- ECS

should be introduced only when there is a real requirement.

---

# 20. Architecture Invariants

These rules must not be broken without explicit project approval:

1. Frontend uses HTML, CSS, and vanilla JavaScript.
2. Backend uses Node.js and Express.js.
3. Frontend never directly accesses PostgreSQL/RDS.
4. Backend is the final authority for business rules.
5. PostgreSQL/RDS is the source of truth.
6. S3 stores uploaded files.
7. AWS secrets never appear in frontend code.
8. Universal QR identifies a student but does not authorize attendance.
9. Attendance requires backend verification of event registration.
10. One student can register only once per event.
11. One student can receive attendance only once per event.
12. Excel/CSV is a report and is not the primary attendance database.
13. The MVP remains a modular monolith.
14. Do not introduce unnecessary frameworks or cloud services.

---

# 21. Viva Explanation

The deployment can be explained simply:

> CampusHub uses a vanilla HTML, CSS, and JavaScript frontend. The frontend communicates with a Node.js and Express.js backend through REST APIs. The backend uses Prisma to communicate with PostgreSQL hosted on Amazon RDS. Amazon S3 stores uploaded event files such as posters and documents. The application runs on Amazon EC2, IAM controls AWS permissions, and CloudWatch is used for monitoring and logs.

This explanation should remain consistent with the actual implementation.

---

# 22. Final Rule

The CampusHub architecture should optimize for:

- Simplicity
- Security
- Understandability
- Correctness
- Maintainability
- Viva readiness

Do not add technology merely to make the project look more advanced.

A smaller architecture that is fully understood and correctly implemented is preferred over a larger architecture that is difficult to explain or maintain.
