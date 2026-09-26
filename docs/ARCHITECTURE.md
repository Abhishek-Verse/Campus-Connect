# CampusHub --- System Architecture Document

**Document:** System Architecture\
**Version:** 1.0\
**Project:** CampusHub\
**Related Documents:** `01-PRD.md`, `02-SRS.md`

------------------------------------------------------------------------

# 1. Purpose

This document defines the technical architecture of CampusHub.

It describes how:

-   Student Portal
-   Club Committee Portal
-   Frontend
-   Backend
-   Database
-   QR generation
-   QR scanning
-   Registration
-   Attendance
-   File storage
-   AWS infrastructure
-   Authentication
-   Monitoring

work together.

The architecture is designed to be:

-   Simple enough for a 2nd-year student project.
-   Strong enough to demonstrate real cloud architecture.
-   Secure enough for a college event system.
-   Fast enough for QR-based event entry.
-   Expandable without requiring a complete rewrite.

------------------------------------------------------------------------

# 2. Architecture Goals

The architecture shall prioritize:

1.  **Simplicity**
2.  **Clear separation of responsibilities**
3.  **Fast QR attendance**
4.  **Database consistency**
5.  **Role-based security**
6.  **AWS integration**
7.  **Easy deployment**
8.  **Easy debugging**
9.  **Future extensibility**
10. **Avoiding unnecessary infrastructure complexity**

------------------------------------------------------------------------

# 3. Architecture Decision

## 3.1 Modular Monolith

CampusHub shall initially use a **modular monolithic backend**.

``` text
                  CampusHub
                      |
              +-------+-------+
              |               |
          Frontend         Backend
                              |
                       Node.js + Express
                              |
                    +---------+---------+
                    |                   |
                  RDS                  S3
                PostgreSQL           Storage
```

The backend is one deployable application, but its internal code is
separated into modules.

Example:

``` text
backend/
├── auth
├── students
├── clubs
├── events
├── registrations
├── attendance
├── notices
└── exports
```

### Why not microservices?

Microservices would introduce:

-   Multiple deployments
-   Service-to-service communication
-   More networking
-   More monitoring
-   More AWS resources
-   More failure points
-   More debugging complexity

For the current project size, this would be unnecessary.

------------------------------------------------------------------------

# 4. High-Level Architecture

``` text
                         INTERNET
                             |
                +------------+------------+
                |                         |
                v                         v
        STUDENT BROWSER            CLUB MEMBER BROWSER
                |                         |
                +------------+------------+
                             |
                           HTTPS
                             |
                             v
                    FRONTEND APPLICATION
                  HTML + CSS + JavaScript
                             |
                             | REST API
                             v
                    NODE.JS + EXPRESS
                       AMAZON EC2
                             |
          +------------------+------------------+
          |                  |                  |
          v                  v                  v
   PostgreSQL RDS        Amazon S3          Auth System
       Database          File Storage       Cognito*
          |                                      |
          +------------------+-------------------+
                             |
                             v
                        CloudWatch
                        Monitoring

* Cognito can be introduced as the authentication layer.
```

------------------------------------------------------------------------

# 5. Major System Components

CampusHub consists of the following logical components.

  Component               Responsibility
  ----------------------- -----------------------------------
  Student Frontend        Student-facing interface
  Club Frontend           Club committee interface
  Admin Frontend          Administrative interface
  REST API                Communication layer
  Authentication Module   Login and identity
  Event Module            Event management
  Registration Module     Seat reservation
  QR Module               QR identity generation/validation
  Attendance Module       QR verification and attendance
  Notice Module           Notice management
  Export Module           Excel/CSV generation
  Database                Persistent structured data
  S3                      Event files/images
  CloudWatch              Monitoring/logging
  IAM                     AWS permissions

------------------------------------------------------------------------

# 6. Frontend Architecture

The frontend uses:

-   HTML5
-   CSS3
-   JavaScript ES6+
-   Bootstrap 5 or Tailwind CSS
-   Fetch API

No frontend framework is required for MVP.

------------------------------------------------------------------------

# 7. Frontend Structure

``` text
frontend/
│
├── index.html
│
├── pages/
│   ├── auth/
│   │   ├── login.html
│   │   └── register.html
│   │
│   ├── student/
│   │   ├── dashboard.html
│   │   ├── events.html
│   │   ├── event-details.html
│   │   ├── my-events.html
│   │   ├── my-qr.html
│   │   ├── attendance.html
│   │   └── profile.html
│   │
│   ├── club/
│   │   ├── dashboard.html
│   │   ├── create-event.html
│   │   ├── manage-events.html
│   │   ├── registrations.html
│   │   ├── scanner.html
│   │   ├── attendance.html
│   │   └── notices.html
│   │
│   └── admin/
│       └── dashboard.html
│
├── css/
│   ├── global.css
│   ├── auth.css
│   ├── student.css
│   ├── club.css
│   └── scanner.css
│
├── js/
│   ├── api/
│   ├── auth/
│   ├── student/
│   ├── club/
│   └── utils/
│
└── assets/
    ├── images/
    └── icons/
```

------------------------------------------------------------------------

# 8. Frontend Responsibility

The frontend is responsible for:

-   Displaying information
-   Collecting user input
-   Form validation for user experience
-   Calling REST APIs
-   Rendering API responses
-   QR generation/display
-   QR camera scanning
-   Showing loading states
-   Showing success/error states

The frontend is **not responsible for**:

-   Database access
-   Final authorization
-   Final seat validation
-   Final registration validation
-   Final attendance validation
-   Generating authoritative timestamps
-   Storing AWS secrets

------------------------------------------------------------------------

# 9. Backend Architecture

Backend:

``` text
Node.js
    +
Express.js
```

The backend follows:

``` text
Routes
  ↓
Middleware
  ↓
Controllers
  ↓
Services
  ↓
Database / AWS
```

------------------------------------------------------------------------

# 10. Backend Request Flow

Example:

``` text
Frontend
   |
   | POST /events/123/register
   v
Express Router
   |
   v
Authentication Middleware
   |
   v
Role Middleware
   |
   v
Validation Middleware
   |
   v
Registration Controller
   |
   v
Registration Service
   |
   v
PostgreSQL
   |
   v
Response
   |
   v
Frontend
```

------------------------------------------------------------------------

# 11. Backend Folder Architecture

``` text
backend/
│
├── src/
│   │
│   ├── config/
│   │   ├── database.js
│   │   └── aws.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── student.controller.js
│   │   ├── club.controller.js
│   │   ├── event.controller.js
│   │   ├── registration.controller.js
│   │   ├── attendance.controller.js
│   │   └── notice.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── event.service.js
│   │   ├── registration.service.js
│   │   ├── qr.service.js
│   │   ├── attendance.service.js
│   │   ├── notice.service.js
│   │   ├── s3.service.js
│   │   └── export.service.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── student.routes.js
│   │   ├── club.routes.js
│   │   ├── event.routes.js
│   │   ├── registration.routes.js
│   │   ├── attendance.routes.js
│   │   └── notice.routes.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── validation.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── validators/
│   │
│   ├── utils/
│   │
│   ├── app.js
│   └── server.js
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
└── tests/
```

------------------------------------------------------------------------

# 12. Database Architecture

The production database is:

**Amazon RDS for PostgreSQL**

Logical entities:

``` text
Users
Clubs
Club Members
Venues
Events
Registrations
Attendance
Notices
```

------------------------------------------------------------------------

# 13. Database Relationship Overview

``` text
                     USERS
                       |
             +---------+---------+
             |                   |
             v                   v
          STUDENT          CLUB MEMBER
             |                   |
             |                   v
             |                  CLUB
             |                   |
             |                   v
             |                 EVENTS
             |                   |
             +--------+----------+
                      |
                      v
                REGISTRATIONS
                      |
                      v
                  ATTENDANCE
```

More explicitly:

``` text
Student 1 ──── * Registration * ──── 1 Event

Student 1 ──── * Attendance * ────── 1 Event

Club 1 ─────── * Event

Club 1 ─────── * ClubMember
```

------------------------------------------------------------------------

# 14. Student Identity Architecture

Each student has:

``` text
Student
├── id
├── name
├── roll_no
├── email
└── qr_token
```

The QR token is an opaque identifier.

Example:

``` text
CH-7F82K91X
```

The QR does not directly contain:

``` text
Abhishek Yadav
23
abhishek@example.com
```

Instead:

``` text
QR
 ↓
CH-7F82K91X
 ↓
Backend
 ↓
Student record
```

------------------------------------------------------------------------

# 15. Universal QR Architecture

The Universal QR is permanent for the student.

``` text
                STUDENT
                   |
                   v
             Universal QR
                   |
            QR Token Only
                   |
                   v
              QR Scanner
                   |
                   v
               Backend
                   |
                   v
              Student DB
```

The QR is not tied to one event.

------------------------------------------------------------------------

# 16. Event Registration Architecture

When a student registers:

``` text
Student
   |
   v
Event Details
   |
   v
Register
   |
   v
Backend
   |
   +--> Authentication check
   |
   +--> Event status check
   |
   +--> Registration deadline check
   |
   +--> Seat availability check
   |
   +--> Duplicate registration check
   |
   v
Registration Created
```

Database:

``` text
registrations
-------------------------
id
event_id
student_id
registered_at
status
```

Unique constraint:

``` text
UNIQUE(event_id, student_id)
```

------------------------------------------------------------------------

# 17. QR Attendance Architecture

This is the most performance-sensitive path.

``` text
             STUDENT
                |
                v
          Universal QR
                |
                v
        CLUB MEMBER CAMERA
                |
                v
           QR DECODER
                |
                v
          QR Token Only
                |
                | POST
                v
        Attendance API
                |
                v
        Authentication
                |
                v
        Event Authorization
                |
                v
          Student Lookup
                |
                v
      Registration Lookup
                |
                v
      Duplicate Attendance?
           /            \
         YES             NO
          |               |
          v               v
       REJECT          INSERT
                          |
                          v
                    Attendance DB
                          |
                          v
                    Small Response
                          |
                          v
                    Scanner Result
```

------------------------------------------------------------------------

# 18. Detailed Attendance Verification

The request:

``` http
POST /api/v1/events/{eventId}/attendance/scan
```

contains:

``` json
{
  "qrToken": "CH-7F82K91X"
}
```

The backend knows:

``` text
authenticated club member
current event
qr token
```

Then:

``` text
1. Is club member authenticated?
2. Is club member authorized for this event?
3. Does QR token exist?
4. Which student owns the token?
5. Does student have a registration for this event?
6. Has attendance already been recorded?
7. If not, create attendance.
8. Return result.
```

------------------------------------------------------------------------

# 19. Attendance Transaction

The attendance operation must be atomic.

``` text
BEGIN
   |
   v
Find Student
   |
   v
Find Registration
   |
   v
Check Existing Attendance
   |
   v
Create Attendance
   |
   v
COMMIT
```

If any validation fails:

``` text
ROLLBACK
```

The database unique constraint:

``` text
UNIQUE(event_id, student_id)
```

is the final duplicate protection.

------------------------------------------------------------------------

# 20. Fast Scanner Design

The scanner must be designed differently from normal application pages.

## Scanner requirements

-   Mobile-first
-   Camera opens immediately
-   Large scanning area
-   Minimal UI
-   Small API request
-   Small API response
-   No unnecessary page navigation
-   No Excel generation
-   Automatic scanner reset

Flow:

``` text
Detect QR
   ↓
Lock scanner briefly
   ↓
Send API request
   ↓
Receive result
   ↓
Show result
   ↓
Reset scanner
   ↓
Ready for next student
```

------------------------------------------------------------------------

# 21. Scanner Lock Mechanism

Camera libraries may detect the same QR multiple times.

The frontend should use a temporary lock:

``` javascript
if (scannerLocked) {
    return;
}

scannerLocked = true;

await verifyAttendance(qrToken);

setTimeout(() => {
    scannerLocked = false;
}, 500);
```

The exact timing should be tested on actual devices.

This is only a UX optimization.

The database must still prevent duplicate attendance.

------------------------------------------------------------------------

# 22. Multiple Scanner Architecture

One event may have multiple entry gates.

``` text
                   EVENT
                     |
           +---------+---------+
           |         |         |
           v         v         v
       Scanner 1 Scanner 2 Scanner 3
           |         |         |
           +---------+---------+
                     |
                     v
                  Backend
                     |
                     v
                    RDS
```

All scanners use the same backend.

No scanner has its own attendance database.

------------------------------------------------------------------------

# 23. Concurrent Scan Handling

Example:

``` text
Scanner 1 ── Student A
Scanner 2 ── Student B
Scanner 3 ── Student C
```

All can be processed concurrently.

If:

``` text
Scanner 1 ── Student A
Scanner 2 ── Student A
```

at nearly the same time:

``` text
Request 1 → attendance inserted
Request 2 → UNIQUE constraint → duplicate rejected
```

The database remains authoritative.

------------------------------------------------------------------------

# 24. Attendance Response

Success:

``` json
{
  "success": true,
  "data": {
    "student": {
      "name": "Abhishek Yadav",
      "rollNo": "23"
    },
    "status": "PRESENT",
    "checkInTime": "2026-10-12T10:21:04+05:30"
  }
}
```

Already attended:

``` json
{
  "success": false,
  "error": {
    "code": "ALREADY_ATTENDED",
    "message": "Attendance has already been recorded."
  }
}
```

Not registered:

``` json
{
  "success": false,
  "error": {
    "code": "NOT_REGISTERED",
    "message": "Student is not registered for this event."
  }
}
```

------------------------------------------------------------------------

# 25. S3 Architecture

S3 stores files such as:

``` text
Event posters
Club logos
Event documents
Certificates (future)
```

Example:

``` text
S3 Bucket
│
├── clubs/
│   └── club-id/
│       └── logo.png
│
├── events/
│   └── event-id/
│       └── poster.webp
│
└── certificates/
    └── event-id/
```

The database stores the object key/reference, not the binary image.

------------------------------------------------------------------------

# 26. S3 Upload Flow

``` text
Club
  |
  v
Create Event
  |
  v
Select Poster
  |
  v
Backend validates file
  |
  v
S3 Upload
  |
  v
S3 Object Key
  |
  v
Store key/reference in Event DB
```

------------------------------------------------------------------------

# 27. Authentication Architecture

Two viable approaches exist.

## Option A --- Application Authentication

Node.js manages authentication.

``` text
Login
  ↓
Backend
  ↓
Verify password
  ↓
Issue token
  ↓
Frontend stores appropriate session/token
```

## Option B --- Amazon Cognito

Recommended for a more AWS-focused version:

``` text
Frontend
   |
   v
Cognito
   |
   v
Access/ID Token
   |
   v
Backend
   |
   v
Validate Token
```

The backend still performs authorization.

Cognito authentication does not replace role/permission checks.

------------------------------------------------------------------------

# 28. Recommended Authentication Strategy

For the first development stage:

``` text
Local development
    ↓
Application authentication
```

After core functionality works:

``` text
AWS deployment
    ↓
Consider Cognito
```

This prevents the team from getting blocked by cloud authentication
while still allowing AWS Cognito to be demonstrated later.

If the project specifically requires AWS authentication, Cognito can be
introduced earlier.

------------------------------------------------------------------------

# 29. Authorization Architecture

Authentication answers:

> Who are you?

Authorization answers:

> What are you allowed to do?

Example:

``` text
Student
  ↓
Can register
Cannot create event

Club Member
  ↓
Can manage authorized club events
Cannot manage another club

Admin
  ↓
Platform management
```

Backend authorization must be enforced for every protected operation.

------------------------------------------------------------------------

# 30. Club Ownership Model

A club member belongs to a club.

``` text
Club
 |
 +-- Member A
 +-- Member B
 +-- Member C
 |
 +-- Event 1
 +-- Event 2
 +-- Event 3
```

When Member A requests:

``` text
PATCH /events/1
```

the backend checks:

``` text
Does event 1 belong to member's club?
```

If yes:

``` text
ALLOW
```

Otherwise:

``` text
FORBIDDEN
```

------------------------------------------------------------------------

# 31. API Architecture

Base path:

``` text
/api/v1
```

Structure:

``` text
/api/v1
│
├── /auth
├── /students
├── /clubs
├── /events
├── /registrations
├── /attendance
└── /notices
```

------------------------------------------------------------------------

# 32. Example API Flow --- View Events

``` text
GET /api/v1/events
```

``` text
Frontend
   ↓
API
   ↓
Event Controller
   ↓
Event Service
   ↓
RDS
   ↓
Published Events
   ↓
JSON Response
   ↓
Frontend Event Cards
```

------------------------------------------------------------------------

# 33. Example API Flow --- Register

``` text
POST /api/v1/events/123/register
```

``` text
Frontend
   ↓
Auth Middleware
   ↓
Student Role Check
   ↓
Validation
   ↓
Registration Service
   ↓
RDS Transaction
   ↓
Registration Created
   ↓
Response
```

------------------------------------------------------------------------

# 34. Example API Flow --- QR Attendance

``` text
Camera
   ↓
QR Decoder
   ↓
qrToken
   ↓
POST /events/123/attendance/scan
   ↓
Auth Middleware
   ↓
Club Authorization
   ↓
Attendance Service
   ↓
RDS Transaction
   ↓
Attendance Created
   ↓
Response
   ↓
Green/Red Scanner Result
```

------------------------------------------------------------------------

# 35. Excel Export Architecture

Excel generation is separated from attendance scanning.

``` text
Club
  |
  v
Attendance Dashboard
  |
  v
Export XLSX
  |
  v
GET /events/:id/attendance/export
  |
  v
Attendance Service
  |
  v
RDS
  |
  v
ExcelJS
  |
  v
XLSX file
  |
  v
Download
```

The scanner never waits for Excel generation.

------------------------------------------------------------------------

# 36. Student Attendance History

``` text
Student
   |
   v
GET /students/me/attendance
   |
   v
Backend
   |
   v
Attendance + Event tables
   |
   v
Student's attendance only
```

Response can include:

``` text
Event
Date
Club
Status
Check-in time
```

------------------------------------------------------------------------

# 37. Club Attendance Dashboard

``` text
Club
  |
  v
Select Event
  |
  v
GET /events/:id/attendance
  |
  v
Backend
  |
  v
RDS
  |
  v
Attendance list + summary
```

Summary:

``` text
Registered: 150
Present:    132
Absent:      18
Rate:      88%
```

------------------------------------------------------------------------

# 38. Event Lifecycle Architecture

``` text
DRAFT
  |
  v
PUBLISHED
  |
  v
REGISTRATION_CLOSED
  |
  v
ONGOING
  |
  v
COMPLETED
```

Cancellation can happen from appropriate states:

``` text
PUBLISHED → CANCELLED
ONGOING   → CANCELLED
```

Backend must validate state transitions.

------------------------------------------------------------------------

# 39. Registration Lifecycle

``` text
Student
  |
  v
REGISTERED
  |
  +------> CANCELLED
  |
  v
EVENT ENDS
  |
  +------> ATTENDED
  |
  +------> ABSENT
```

Attendance should remain a separate entity from registration.

------------------------------------------------------------------------

# 40. Data Ownership

## Student owns

``` text
Own profile
Own registrations
Own QR
Own attendance history
```

## Club owns

``` text
Club profile
Club events
Club notices
Event registrations
Event attendance
```

## Admin owns

``` text
Platform-level management
```

------------------------------------------------------------------------

# 41. Security Boundaries

``` text
                    INTERNET
                        |
                      HTTPS
                        |
                +-------+-------+
                |               |
             Frontend        Scanner
                |               |
                +-------+-------+
                        |
                    API Layer
                        |
                Authentication
                        |
                 Authorization
                        |
             +----------+----------+
             |                     |
            RDS                   S3
       Structured Data        File Storage
```

No direct browser-to-database connection is permitted.

------------------------------------------------------------------------

# 42. AWS Architecture

## Core deployment

``` text
                         AWS
                          |
             +------------+------------+
             |                         |
             v                         v
         Amazon EC2               Amazon RDS
        Node.js API              PostgreSQL
             |
             |
             v
        Amazon S3
       Event Files
             |
             v
        CloudWatch
        Logs/Metrics
```

------------------------------------------------------------------------

# 43. AWS EC2

EC2 hosts:

``` text
Node.js
Express
CampusHub Backend
```

Example:

``` text
EC2
│
├── Node.js
├── npm
├── CampusHub backend
└── process manager
```

A process manager such as PM2 can keep the backend running.

------------------------------------------------------------------------

# 44. AWS RDS

RDS stores:

``` text
Users
Clubs
Club Members
Events
Venues
Registrations
Attendance
Notices
```

The application connects through a secure database connection.

RDS should not be directly exposed to the public internet in the
production architecture unless specifically required.

------------------------------------------------------------------------

# 45. AWS IAM

IAM controls:

``` text
EC2 → S3
EC2 → CloudWatch
```

Use an EC2 IAM role.

Avoid:

``` text
AWS_ACCESS_KEY_ID = hardcoded
AWS_SECRET_ACCESS_KEY = hardcoded
```

in source code.

------------------------------------------------------------------------

# 46. AWS CloudWatch

CloudWatch should collect:

``` text
Application logs
API errors
Server errors
Performance information
```

Useful logs:

``` text
Attendance scan received
Attendance accepted
Attendance rejected
Database error
Authentication failure
```

Do not log secrets or unnecessary personal data.

------------------------------------------------------------------------

# 47. Optional CloudFront Architecture

For a more polished deployment:

``` text
Student Browser
       |
       v
CloudFront
       |
       v
Static Frontend
       |
       v
EC2 API
       |
       v
RDS
```

CloudFront is not required for the first local/development deployment.

------------------------------------------------------------------------

# 48. Optional Cognito Architecture

``` text
                Student
                   |
                   v
              Cognito Login
                   |
                   v
                Token
                   |
                   v
              CampusHub API
                   |
                   v
            Verify Token
                   |
                   v
             Authorize Role
```

The backend remains responsible for deciding whether the user can
perform an operation.

------------------------------------------------------------------------

# 49. AWS Network Architecture

Recommended production-style structure:

``` text
                 Internet
                    |
                    v
              Public Entry
                    |
                    v
              EC2 / Frontend
                    |
                    v
               Private RDS
```

For the student project, the team can begin with a simpler setup and
improve network isolation before final deployment.

------------------------------------------------------------------------

# 50. Environment Architecture

## Development

``` text
Developer PC
│
├── Frontend
├── Node.js backend
└── Local/development database
```

## AWS Development

``` text
Browser
  ↓
EC2
  ↓
RDS
  ↓
S3
```

## Final Demonstration

``` text
Internet
  ↓
Frontend
  ↓
HTTPS
  ↓
Backend EC2
  ↓
RDS
  +
S3
  +
CloudWatch
```

------------------------------------------------------------------------

# 51. Environment Variables

Backend configuration shall use environment variables.

Example:

``` text
NODE_ENV=
PORT=
DATABASE_URL=
AWS_REGION=
AWS_S3_BUCKET=
COGNITO_USER_POOL_ID=
COGNITO_CLIENT_ID=
```

Never commit:

``` text
.env
```

to Git.

Provide:

``` text
.env.example
```

instead.

------------------------------------------------------------------------

# 52. Database Security Architecture

``` text
Backend EC2
     |
     | Secure DB connection
     v
RDS PostgreSQL
     |
     +-- Users
     +-- Events
     +-- Registrations
     +-- Attendance
```

The frontend cannot connect to RDS directly.

------------------------------------------------------------------------

# 53. S3 Security Architecture

``` text
Frontend
   |
   v
Backend
   |
   v
IAM Authorization
   |
   v
S3
```

The backend controls allowed uploads.

Do not make the entire S3 bucket publicly writable.

------------------------------------------------------------------------

# 54. Performance Architecture

The system's most important fast path is:

``` text
QR
 ↓
Scanner
 ↓
One API request
 ↓
Indexed DB lookup
 ↓
Transaction
 ↓
Small response
```

Avoid:

``` text
QR
 ↓
5 separate API calls
 ↓
Large student profile
 ↓
Large event object
 ↓
Excel generation
 ↓
Response
```

------------------------------------------------------------------------

# 55. Database Performance

Important indexes:

``` text
students(qr_token)
students(email)
students(roll_no)

registrations(student_id, event_id)
registrations(event_id)

attendance(student_id, event_id)
attendance(event_id)

events(club_id)
events(status)
events(event_date)
```

The exact indexes should be confirmed using actual query patterns.

------------------------------------------------------------------------

# 56. Caching

Caching is not required for MVP.

Possible future caching:

``` text
Published event list
Venue information
Club information
```

Do not cache attendance validation blindly because attendance requires
current authoritative database state.

------------------------------------------------------------------------

# 57. Failure Handling

## Database unavailable

Backend returns:

``` text
SERVICE_UNAVAILABLE
```

Scanner must not display:

``` text
Attendance Marked
```

unless the attendance transaction actually succeeded.

## QR invalid

``` text
INVALID QR
```

## Student not registered

``` text
NOT REGISTERED
```

## Already attended

``` text
ALREADY ATTENDED
```

## Network unavailable

Scanner should show:

``` text
Connection unavailable
Try again
```

For MVP, do not mark attendance locally and assume it succeeded.

------------------------------------------------------------------------

# 58. Offline Attendance

Offline attendance is explicitly excluded from MVP.

Reason:

``` text
Offline Scanner
     ↓
Local Data
     ↓
Potential Duplicate
     ↓
Sync Conflict
     ↓
Attendance Integrity Problems
```

A future secure offline mode would require:

-   Local encrypted queue
-   Device identity
-   Signed scan events
-   Synchronization
-   Conflict handling
-   Duplicate reconciliation

------------------------------------------------------------------------

# 59. Monitoring Architecture

``` text
Application
    |
    v
Node.js Logger
    |
    v
CloudWatch
    |
    +-- API Errors
    +-- Attendance Errors
    +-- Database Errors
    +-- Authentication Errors
```

During development, logs can also be shown locally.

------------------------------------------------------------------------

# 60. Backup Strategy

RDS automated backups should be enabled for production.

The project should define:

-   Backup retention period
-   Recovery process
-   Development database reset procedure

For a college project, do not rely on manually copying database files as
the production backup mechanism.

------------------------------------------------------------------------

# 61. Security and Privacy Architecture

Student information:

``` text
Name
Roll No
Email
```

is stored in the database.

QR:

``` text
Opaque Token
```

is displayed publicly.

Scanner receives:

``` text
QR Token
```

Backend returns only necessary information.

This creates:

``` text
QR
 ↓
Identity lookup
 ↓
Event registration check
 ↓
Attendance
```

rather than exposing the student's personal data inside the QR.

------------------------------------------------------------------------

# 62. Critical Security Principle

A valid Universal QR does **not** mean:

``` text
Student can enter every event.
```

It only means:

``` text
This QR belongs to this student.
```

The backend must still verify:

``` text
Student
+
Current Event
+
Registration
+
Attendance Status
```

before allowing attendance.

------------------------------------------------------------------------

# 63. End-to-End Student Flow

``` text
Student
   |
   v
Login
   |
   v
Dashboard
   |
   v
Upcoming Events
   |
   v
Event Details
   |
   v
Register
   |
   v
RDS Registration
   |
   v
My Events
   |
   v
Universal QR
   |
   v
Event Gate
   |
   v
Club Scanner
   |
   v
Attendance API
   |
   v
RDS
   |
   v
Attendance Recorded
   |
   +------------------+
   |                  |
   v                  v
Student History   Club Dashboard
                       |
                       v
                  Excel Export
```

------------------------------------------------------------------------

# 64. End-to-End Club Flow

``` text
Club Member
   |
   v
Login
   |
   v
Club Dashboard
   |
   v
Create Event
   |
   v
Upload Poster → S3
   |
   v
Save Event → RDS
   |
   v
Publish
   |
   v
Students Register
   |
   v
Event Day
   |
   v
Open Scanner
   |
   v
Scan Universal QR
   |
   v
Registration Validation
   |
   v
Attendance
   |
   v
Live Attendance Dashboard
   |
   v
Export XLSX
```

------------------------------------------------------------------------

# 65. Complete System Diagram

``` text
                                      CAMPUSHUB
                                          |
                  +-----------------------+-----------------------+
                  |                                               |
                  v                                               v
           STUDENT PORTAL                                  CLUB PORTAL
                  |                                               |
        +---------+---------+                          +----------+----------+
        |         |         |                          |          |          |
      Events   Notices     QR                       Events    Scanner   Attendance
        |                   |                          |          |          |
        +---------+---------+                          +----------+----------+
                  |                                               |
                  +----------------------+------------------------+
                                         |
                                         v
                                  HTTPS REST API
                                         |
                                         v
                                NODE.JS + EXPRESS
                                         |
                +------------------------+------------------------+
                |                        |                        |
                v                        v                        v
          Auth/Authorization       Business Logic            AWS Services
                |                        |                        |
                |             +----------+----------+             |
                |             |          |          |             |
                v             v          v          v             v
             Identity      Events   Registration Attendance       S3
                |             |          |          |             |
                +-------------+----------+----------+-------------+
                                         |
                                         v
                                  AMAZON RDS
                                   POSTGRESQL
                                         |
                             +-----------+-----------+
                             |                       |
                             v                       v
                        Event Data             Attendance Data
                             |                       |
                             +-----------+-----------+
                                         |
                                         v
                                  Excel / CSV Export

                                  CLOUDWATCH
                                      ^
                                      |
                                Application Logs
```

------------------------------------------------------------------------

# 66. Recommended Development Boundaries

Team members can work independently using these boundaries:

## Frontend Team

``` text
frontend/
```

Responsible for:

-   Pages
-   UI
-   API integration
-   QR display
-   QR scanner UI

## Backend Team

``` text
backend/src/
```

Responsible for:

-   API
-   Business logic
-   Authentication
-   Authorization
-   QR verification
-   Attendance
-   Export

## Database Team

``` text
backend/prisma/
database/
```

Responsible for:

-   Schema
-   Migrations
-   Indexes
-   Seed data

## AWS/Deployment

``` text
infrastructure/
```

Responsible for:

-   RDS
-   EC2
-   S3
-   IAM
-   CloudWatch
-   Deployment

------------------------------------------------------------------------

# 67. Development Contract Between Teams

The frontend and backend must agree on the API contract before
implementation.

Example:

``` text
Frontend expects:

POST /events/:eventId/attendance/scan

Request:
{
  qrToken: string
}

Success:
{
  success: true,
  data: {
    student: {
      name: string,
      rollNo: string
    },
    status: "PRESENT",
    checkInTime: string
  }
}
```

Once this contract is agreed, frontend and backend can be developed
independently.

------------------------------------------------------------------------

# 68. Git Branch Strategy

Recommended:

``` text
main
  |
  +-- develop
       |
       +-- feature/frontend-student
       +-- feature/frontend-club
       +-- feature/backend-auth
       +-- feature/backend-events
       +-- feature/backend-attendance
       +-- feature/database
       +-- feature/aws-deployment
```

Merge features into `develop`, test them, then merge stable releases
into `main`.

------------------------------------------------------------------------

# 69. Architecture Rules

The following rules should not be broken casually:

### Rule 1

Frontend never connects directly to PostgreSQL.

### Rule 2

Frontend never contains AWS secret credentials.

### Rule 3

Backend is the final authority for business rules.

### Rule 4

Database constraints enforce critical uniqueness.

### Rule 5

Attendance is stored in the database before export.

### Rule 6

Excel is a report, not a database.

### Rule 7

Universal QR identifies a student but does not authorize event entry.

### Rule 8

Club members can scan only events they are authorized to manage.

### Rule 9

Attendance timestamps come from the backend/database.

### Rule 10

Do not add microservices unless the project genuinely requires them.

------------------------------------------------------------------------

# 70. Architecture Decision Record

## ADR-001 --- Modular Monolith

**Decision:** Use Node.js + Express modular monolith.

**Reason:** Appropriate complexity for project size and easier
deployment/debugging.

## ADR-002 --- PostgreSQL

**Decision:** Use PostgreSQL on Amazon RDS.

**Reason:** Strong relational model fits students, events, registrations
and attendance.

## ADR-003 --- Universal QR

**Decision:** One permanent QR per student.

**Reason:** Better user experience and simpler identity management.

## ADR-004 --- QR Token

**Decision:** QR contains opaque token only.

**Reason:** Prevent direct exposure of student personal information.

## ADR-005 --- Database Attendance

**Decision:** Attendance stored in RDS.

**Reason:** Database provides consistency and concurrency protection.

## ADR-006 --- Excel Export

**Decision:** Generate Excel after data is stored.

**Reason:** Prevent slow and unreliable scanning.

## ADR-007 --- S3

**Decision:** Store event images/files in S3.

**Reason:** Object storage is more appropriate than database BLOB
storage.

## ADR-008 --- EC2

**Decision:** Host Node.js backend on EC2 for MVP.

**Reason:** Easy to understand, deploy and demonstrate AWS
infrastructure.

## ADR-009 --- Cognito

**Decision:** Optional initial authentication layer; recommended for
AWS-focused production version.

**Reason:** Allows the core application to be developed without blocking
on cloud authentication while retaining an AWS-managed authentication
path.

------------------------------------------------------------------------

# 71. Architecture Definition of Done

The architecture is considered implemented when:

``` text
Frontend
    ↓
HTTPS
    ↓
Backend
    ↓
RDS
```

works for:

``` text
Login
Event discovery
Registration
Universal QR
QR scanning
Attendance
Attendance history
Excel export
```

and:

``` text
Backend
    ↓
S3
```

works for event image uploads.

Additionally:

``` text
Backend
    ↓
CloudWatch
```

provides production logs.

------------------------------------------------------------------------

# 72. Final Architecture Principle

CampusHub should remain centered around one authoritative data flow:

``` text
                 STUDENT IDENTITY
                       |
                       v
                 UNIVERSAL QR
                       |
                       v
                  EVENT SYSTEM
                       |
             +---------+---------+
             |                   |
             v                   v
       REGISTRATION          ATTENDANCE
             |                   |
             +---------+---------+
                       |
                       v
                  POSTGRESQL
                       |
             +---------+---------+
             |                   |
             v                   v
       Student History      Club Dashboard
                                 |
                                 v
                           Excel / CSV
```

The Universal QR is the **student identity mechanism**.

The registration table determines whether the student is eligible for a
particular event.

The attendance table determines whether the student actually entered
that event.

PostgreSQL is the source of truth.

AWS provides the infrastructure around this core system.
