# CampusHub

**CampusHub** is a campus event and attendance management system. It gives students a place to discover and register for events, and gives authorized club organizers tools to manage events, scan student QR codes, review attendance, and export permitted records.

> **Project status:** This README describes the approved project direction and intended workflows. The current workspace contains project documentation, not the application source code. Therefore, exact repository URLs, executable commands, screen names, API routes, and environment variable names must be confirmed against the implementation before this guide is used as a deployment runbook.

## Contents

- [What CampusHub does](#what-campushub-does)
- [User roles](#user-roles)
- [Technology and architecture](#technology-and-architecture)
- [Main workflows](#main-workflows)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Using CampusHub](#using-campushub)
- [Security and data handling](#security-and-data-handling)
- [Project documentation](#project-documentation)
- [Testing and release checks](#testing-and-release-checks)
- [Project status and contribution](#project-status-and-contribution)

## What CampusHub does

CampusHub supports the basic event lifecycle:

1. An authorized club organizer creates and publishes an event.
2. Students view event details and register while registration is open and capacity remains.
3. At the event, an authorized scanner checks the student's universal QR code.
4. The backend validates the student, event, registration rules, and scanner permissions before recording attendance.
5. Organizers review attendance and export only records within their authorized scope.

The system is intended to keep identity, registration, event capacity, and attendance decisions on the server. The browser presents the interface and calls the API; it does not decide whether a user is allowed to perform a protected action.

## User roles

The exact role names and permissions are governed by the security and API documents. The planned roles are:

| Role | Intended use |
|---|---|
| Student | Browse events, register, view their own event information, and present their universal QR code. |
| Club member / organizer | Manage events for an authorized club, scan eligible attendees, review attendance, and export permitted event records. |
| Administrator | Perform system-level actions explicitly assigned to administrators. |

The backend must enforce role and ownership checks on every protected operation. Removing a link or button from the page is not an access-control measure.

## Technology and architecture

| Area | Approved technology / service |
|---|---|
| Frontend | HTML5, CSS3, vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database access | Prisma |
| Relational database | PostgreSQL on Amazon RDS |
| File storage | Amazon S3 |
| Application hosting | Amazon EC2 |
| AWS permissions | IAM roles and least-privilege policies |
| Logs and monitoring | Amazon CloudWatch |

```text
Browser
HTML5 + CSS3 + vanilla JavaScript
             │ HTTPS / documented API
             ▼
Node.js + Express.js on EC2
       │               │
       │ Prisma        │ IAM-authorized file access
       ▼               ▼
PostgreSQL on RDS     Amazon S3
             │
             └── Application/system logs and monitoring → CloudWatch
```

The frontend must not connect directly to PostgreSQL or contain AWS credentials. The Express backend validates requests, applies business rules and permissions, and accesses the database and S3 as needed.

## Main workflows

### Event registration

- The student signs in and opens an available event.
- The API checks that registration is open, the event is eligible, and capacity is available.
- A student can have no more than one registration for the same event.
- Capacity and duplicate protections must hold under concurrent requests, using database constraints and appropriate transaction handling.

### Universal QR attendance

- A signed-in student presents their universal QR code.
- An authorized organizer scans the code for an event they are allowed to manage.
- The backend verifies the QR and event rules, then records attendance once.
- Repeated scans are reported without creating duplicate attendance. Invalid or unauthorized scans must not expose another student's private information.

### File uploads and exports

- Approved event assets or optional ticket files are stored in S3 under the access policy defined by the project.
- Organizers can export attendance or registration data only for events and clubs they are authorized to manage.
- User-controlled values in exports must be handled safely, including spreadsheet formula-like content where applicable.

## Getting started

### Prerequisites

For local development, use the project-approved versions of:

- Node.js and npm
- PostgreSQL, either a local development database or a dedicated non-production Amazon RDS database
- A modern browser
- Git

AWS access is needed only for features being tested against AWS. Local development must use test credentials and test data. Never point test cleanup scripts at production.

### Setup sequence

The repository's actual directory names and scripts are not present in this documentation workspace. Once the source repository is available, confirm each command against its `package.json`, Prisma schema, and deployment guide.

1. **Get the source repository.** Clone the official CampusHub repository using the URL provided by the project owner. Do not substitute a guessed repository URL.
2. **Install dependencies.** Run the documented install command in the backend directory (and in a separate frontend directory only if the implementation defines one). Use the lockfile and package manager selected by the project.
3. **Create a development database.** Create a dedicated PostgreSQL database and database user for local/test work. Use a separate database from production.
4. **Configure server environment values.** Copy the project's example environment file if one is provided. Set the database connection, authentication secrets/settings, frontend origin, and optional AWS configuration using the exact names required by the code. Keep real values out of Git and the browser.
5. **Apply Prisma migrations.** Use the repository's documented Prisma migration command against the development database. Review migrations before applying them; never use development reset/seed commands on production.
6. **Start the backend.** Use the development script defined in the backend `package.json`.
7. **Serve the frontend.** Use the project's documented static-file server or development script. Open the configured local frontend address in a browser.
8. **Verify the connection.** Confirm the frontend uses the local API origin, authentication works, and a test event can be registered and scanned with synthetic accounts.

The project should add exact, copyable commands here when the source repository and scripts are finalized. Do not assume that a command such as `npm start`, a port, a folder name, or a migration script exists until it is confirmed in the code.

## Configuration

The backend may require configuration for the following categories. The exact variable names must match the implementation and should be documented in a checked-in example file containing placeholders only.

| Configuration category | Purpose | Handling |
|---|---|---|
| PostgreSQL connection | Connect Prisma to the development/test or deployed RDS database | Server-side secret; never expose to frontend code |
| Authentication secret/settings | Sign or validate credentials/session data as selected in `BACKEND.md` | Keep secret values outside source control; use secure production configuration |
| Frontend origin / CORS | Allow the intended browser origin to call the API | Restrict to the configured origin(s); do not use an unrestricted production wildcard with credentials |
| AWS region and bucket | Identify the S3 resources required by the app | Use an EC2 IAM role in AWS where configured; do not place AWS keys in browser code |
| Application environment and port | Select development/production behavior and the server listening port | Keep local and deployed values consistent with the deployment setup |
| Logging configuration | Set the application log behavior and CloudWatch integration as implemented | Do not log passwords, tokens, QR secrets, or sensitive personal information |

Never commit `.env` files containing real secrets. Commit a safe example file only if the codebase uses one, with placeholder values and a note explaining each setting.

## Using CampusHub

The precise navigation and screen names may change as the UI is implemented. The intended user steps are:

### Student

1. Sign in using the account provided or approved by the project administrator.
2. Browse available events and review date, venue, organizer, eligibility, and remaining capacity.
3. Open an event and register while registration is available.
4. Check that the registration confirmation appears before relying on the booking.
5. Present the universal QR code at the event entrance when asked.
6. Sign out when finished, especially on a shared device.

### Club organizer

1. Sign in with an account assigned to the correct club role.
2. Create or update events only within the assigned club's scope.
3. Review registrations and event capacity.
4. At the event, scan each attendee's QR code and read the success, duplicate, or error result before moving to the next attendee.
5. Review attendance and export only the records needed for the event.
6. Sign out after using a shared scanning device.

### Administrator

Use only the administrative operations documented for the project. Admin access should be limited to designated users and should not be shared for routine student or organizer work.

## Security and data handling

- Use synthetic accounts and event data for development and tests.
- Do not place passwords, database credentials, AWS keys, session tokens, or QR secrets in the frontend or Git.
- Do not export or share real student attendance data unless authorized for the project purpose.
- Keep RDS private as configured and limit access to the application environment.
- Give the EC2 application only the IAM permissions it needs for required S3 and CloudWatch operations.
- Use HTTPS for deployed access and configure CORS for the intended frontend origin.
- Report suspected security issues privately to the project owner rather than publishing credentials or personal data.

See `07-SECURITY.md` and `08-AWS-DEPLOYMENT.md` for the full requirements.

## Project documentation

The project documentation set is intended to live with the source repository. The files below were produced as separate documentation deliverables; place them in the matching project location when assembling the repository.

| Document | Purpose |
|---|---|
| `AGENTS.md` | Rules for coding agents and project invariants |
| `BACKEND.md` | Backend structure, frontend integration, authentication, and data-access rules |
| `01-PRD.md` | Product goals, users, requirements, and MVP boundaries |
| `02-SRS.md` | System requirements |
| `03-ARCHITECTURE.md` | Components and system request flow |
| `04-DATABASE-DESIGN.md` | PostgreSQL entities, relationships, and constraints |
| `05-API-DOCUMENTATION.md` | Frontend/backend API contract |
| `06-UI-UX-SPECIFICATION.md` | Screens, interactions, and visual direction |
| `07-SECURITY.md` | Authentication, authorization, and data security requirements |
| `08-AWS-DEPLOYMENT.md` | EC2, RDS, S3, IAM, and CloudWatch deployment guidance |
| `09-TESTING.md` | Test strategy and acceptance criteria |
| `10-FUTURE-SCOPE.md` | Optional enhancements and change control |

Keep the README, source code, and these documents synchronized. When implementation decisions change, update the relevant documents rather than letting this guide promise behavior the code does not provide.

## Testing and release checks

Before a project demonstration or release:

- Run the documented test commands against a dedicated test database.
- Verify role permissions using accounts for each supported role.
- Exercise registration, event capacity, valid QR attendance, duplicate scans, and invalid scans.
- Verify S3 access and export scoping in a non-production environment.
- Confirm the frontend, API, Prisma schema/migrations, and database agree.
- Check that deployed EC2 can access only the required RDS/S3 resources through the intended IAM permissions.
- Review CloudWatch logs for useful operational details and confirm they do not contain secrets or unnecessary student data.
- Record test results and known limitations in line with `09-TESTING.md`.

## Project status and contribution

This guide describes the planned CampusHub product and approved technology direction; it does not claim that every feature is already implemented. Before contributing, review `AGENTS.md` and the relevant product, API, database, security, and UI documents. Keep changes focused, preserve the defined role and data-integrity rules, and update documentation when behavior or configuration changes.

For project questions, access requests, or decisions about scope and architecture, contact the CampusHub project owner through the channel provided by the team. Do not invent a support address or publish private configuration in an issue.
