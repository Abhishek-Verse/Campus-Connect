# CampusHub --- Product Requirements Document (PRD)

**Version:** 1.0\
**Project Type:** 2nd-year student cloud/full-stack project\
**Primary Goal:** Build a college-wide event, notice, registration, QR
verification, and attendance platform with separate Student and Club
Committee portals.

------------------------------------------------------------------------

# 1. Product Overview

## 1.1 Product Name

**CampusHub**

## 1.2 Product Vision

CampusHub is an all-in-one college platform where:

-   Students discover upcoming college/club events.
-   Clubs publish events and notices.
-   Students register for events and reserve a seat.
-   Each student has one permanent **Universal QR** associated with
    their CampusHub identity.
-   At an event, a club member scans the student's Universal QR.
-   The backend verifies that the student is registered for the current
    event.
-   Attendance is recorded immediately.
-   Students can view their complete event and attendance history.
-   Clubs can view event-wise attendance and export it to Excel/CSV.

## 1.3 Core Product Principle

The QR code is an identity mechanism, not the attendance database.

**Correct flow:**

``` text
Universal QR
    ↓
Student identity lookup
    ↓
Check registration for current event
    ↓
Check duplicate attendance
    ↓
Record attendance in AWS database
    ↓
Return instant result
```

Excel is a report/export format, not the primary source of truth.

------------------------------------------------------------------------

# 2. Problem Statement

College events are often managed using disconnected tools:

-   Posters/social media for event discovery.
-   Google Forms or separate websites for registration.
-   Manual lists for entry.
-   Manual attendance sheets.
-   Separate Excel files for every event.
-   No centralized student event history.

CampusHub combines these processes into one platform.

------------------------------------------------------------------------

# 3. Target Users

## 3.1 Student

A student can:

-   Create/login to an account.
-   Maintain basic profile information.
-   Browse events.
-   Search/filter events.
-   Read notices.
-   View complete event information.
-   Register for an event.
-   View registration status.
-   Display their Universal QR.
-   View upcoming registrations.
-   View past attended events.
-   View attendance history.

## 3.2 Club Committee Member

A club member can:

-   Login to the club portal.
-   Create events.
-   Edit/manage their events.
-   Publish event information.
-   Upload event posters.
-   Set seat capacity.
-   Publish notices.
-   View registrations.
-   Open the event scanner.
-   Scan student Universal QR codes.
-   Verify registration.
-   Mark attendance.
-   View live attendance counts.
-   Export attendance.

## 3.3 College/Super Admin --- Recommended

An optional third role should manage the overall platform:

-   Approve/manage clubs.
-   Manage students.
-   Approve events if required.
-   Disable inappropriate events.
-   View system-wide statistics.
-   Manage users and roles.

For the first working version, this role can be kept simple.

------------------------------------------------------------------------

# 4. Scope

## 4.1 MVP --- Must Have

### Student

-   Registration/login
-   Profile
-   Universal QR
-   Upcoming events
-   Event details
-   Event registration
-   Seat availability
-   My Events
-   Attendance history
-   Notices

### Club

-   Login
-   Club dashboard
-   Create event
-   Edit event
-   Publish event
-   Manage registrations
-   QR attendance scanner
-   Attendance dashboard
-   Excel/CSV export
-   Notices

### Backend

-   Authentication/authorization
-   Event APIs
-   Registration APIs
-   Attendance APIs
-   QR validation
-   Role-based access
-   Duplicate-registration prevention
-   Duplicate-attendance prevention

### AWS

-   Amazon RDS PostgreSQL
-   Amazon EC2
-   Amazon S3
-   IAM
-   CloudWatch

## 4.2 Phase 2

-   Amazon Cognito
-   Amazon CloudFront
-   Amazon SNS/email notifications
-   Waitlist
-   Event approval
-   Analytics
-   Certificate generation

## 4.3 Explicitly Avoid in MVP

Do not initially build:

-   Native Android/iOS applications.
-   Payment gateway.
-   Complex AI recommendations.
-   Facial recognition.
-   Offline attendance synchronization.
-   Real-time chat.
-   Microservices architecture.
-   Kubernetes/EKS.
-   Multiple database technologies.

These add complexity without improving the core demonstration.

------------------------------------------------------------------------

# 5. Recommended Technology Stack

The project should use plain web technologies where requested, while
using a practical backend.

## 5.1 Frontend

-   HTML5
-   CSS3
-   JavaScript (ES6+)
-   Bootstrap 5 or Tailwind CSS --- choose one, not both
-   Fetch API for backend communication
-   QR scanning library: **ZXing Browser** or **html5-qrcode**
-   QR generation library: **qrcode.js** or an equivalent maintained QR
    library

### Recommended frontend approach

Use **HTML + CSS + JavaScript with reusable components/modules**, rather
than introducing React if the project requirement is specifically
HTML/CSS/JS.

Suggested structure:

``` text
frontend/
├── index.html
├── student/
│   ├── dashboard.html
│   ├── events.html
│   ├── event-details.html
│   ├── my-events.html
│   ├── attendance.html
│   └── profile.html
├── club/
│   ├── dashboard.html
│   ├── create-event.html
│   ├── manage-events.html
│   ├── registrations.html
│   ├── scanner.html
│   ├── attendance.html
│   └── notices.html
├── admin/
│   └── dashboard.html
├── css/
│   ├── global.css
│   ├── student.css
│   └── club.css
└── js/
    ├── api.js
    ├── auth.js
    ├── events.js
    ├── registration.js
    ├── scanner.js
    ├── attendance.js
    └── utils.js
```

## 5.2 Backend

### Recommended

**Node.js + Express.js**

Reasons:

-   JavaScript across frontend/backend.
-   Easy REST API development.
-   Good library support for QR, Excel, validation, PostgreSQL and AWS.
-   Appropriate complexity for a student project.
-   Easy deployment to EC2.

Backend stack:

-   Node.js
-   Express.js
-   PostgreSQL driver/ORM: Prisma or node-postgres
-   Zod/Joi for request validation
-   JSON Web Tokens if using application-managed authentication
-   bcrypt/argon2 only if credentials are managed by the application
-   `qrcode` if server-side QR generation is needed
-   ExcelJS for Excel export
-   Helmet for security headers
-   CORS configuration
-   Morgan/Pino for logging

### Recommended database library

Use **Prisma ORM** if the team is comfortable learning it.

Alternative:

**node-postgres (`pg`)** for a simpler, more direct SQL approach.

For a 2nd-year project, Prisma can make relationships and migrations
easier to understand and maintain.

------------------------------------------------------------------------

# 6. AWS Architecture

## 6.1 Core AWS Services

### Amazon RDS for PostgreSQL

Primary database for:

-   Students
-   Clubs
-   Club members
-   Events
-   Venues
-   Registrations
-   Attendance
-   Notices

### Amazon S3

Object storage for:

-   Event posters
-   Club logos
-   Optional certificates
-   Other event documents

Do not store binary images directly inside PostgreSQL.

### Amazon EC2

Host the Node.js/Express backend.

### AWS IAM

Controls which AWS resources the backend can access.

The EC2 server should use an IAM role instead of hardcoding AWS access
keys.

### Amazon CloudWatch

Use for:

-   Backend logs
-   Error monitoring
-   Basic metrics
-   Troubleshooting

## 6.2 Recommended Phase-2 AWS Services

### Amazon Cognito

Use for authentication if the team wants AWS-managed login.

It can manage:

-   Student accounts
-   Club accounts
-   Password policies
-   Verification
-   Access tokens

### CloudFront

Use as CDN in front of the frontend/S3 or static hosting layer.

### SNS / SES

For notifications.

For email-heavy use cases, Amazon SES is more directly suited to email;
SNS can be useful for notification fan-out.

------------------------------------------------------------------------

# 7. High-Level Architecture

``` text
                     INTERNET
                         |
              +----------+----------+
              |                     |
        Student Portal        Club Portal
              |                     |
              +----------+----------+
                         |
                    HTTPS / REST
                         |
                   Node.js API
                    Amazon EC2
                         |
       +-----------------+-----------------+
       |                 |                 |
       v                 v                 v
   PostgreSQL           S3             Notifications
   Amazon RDS         Storage          Phase 2
       |
       +----------------+
       |                |
       v                v
 Registrations      Attendance
       |                |
       +-------+--------+
               |
               v
        Excel/CSV Export
```

------------------------------------------------------------------------

# 8. Core Product Flow

## 8.1 Student Registration

``` text
Student
  ↓
Login
  ↓
Student Dashboard
  ↓
Upcoming Events
  ↓
Select Event
  ↓
Event Details
  ↓
Register
  ↓
Backend validates:
  - user authenticated?
  - registration open?
  - seats available?
  - already registered?
  ↓
Create registration
  ↓
Success
```

## 8.2 Event Registration Validation

The backend must enforce the rules.

``` text
if event is not published:
    reject

if registration deadline has passed:
    reject

if student already registered:
    reject

if available seats <= 0:
    reject or place student on waitlist

otherwise:
    create registration
```

Never rely only on frontend checks.

------------------------------------------------------------------------

# 9. Universal QR Design

## 9.1 Requirement

Each student has exactly one Universal QR for the CampusHub account.

The QR remains the same across events.

## 9.2 QR Content

Do not encode:

-   Name
-   Email
-   Roll number
-   Phone number
-   Full student profile

Instead encode a random opaque identifier, for example:

``` text
CH-7F82K91X
```

or another sufficiently random token.

Database maps the token to the student.

## 9.3 Student Record

Example:

``` text
student_id: 10023
name: Abhishek Yadav
roll_no: 23
email: abhishek@example.com
qr_token: CH-7F82K91X
```

The QR itself only identifies the account.

## 9.4 Why

This reduces information leakage if someone photographs or shares the
QR.

------------------------------------------------------------------------

# 10. QR Attendance Flow

## 10.1 Club Scanner

Club member:

``` text
Login
  ↓
Select Event
  ↓
Open Scanner
  ↓
Camera starts
  ↓
Student shows Universal QR
  ↓
QR token decoded
  ↓
POST /events/{eventId}/attendance/scan
  ↓
Backend validation
  ↓
Success/Failure displayed
  ↓
Scanner immediately becomes ready for next student
```

## 10.2 Backend Verification

The backend receives:

``` json
{
  "qrToken": "CH-7F82K91X"
}
```

The event ID comes from the authenticated scanner session/URL.

Backend performs:

``` text
1. Authenticate club member.
2. Verify club member is allowed to scan this event.
3. Find student by QR token.
4. Find registration for student + event.
5. If no registration → reject.
6. Check attendance record.
7. If already attended → reject duplicate.
8. Otherwise create attendance record.
9. Return minimal response.
```

## 10.3 Successful Response

``` json
{
  "success": true,
  "student": {
    "name": "Abhishek Yadav",
    "rollNo": "23"
  },
  "status": "PRESENT",
  "checkInTime": "2026-10-12T10:21:04+05:30"
}
```

Do not return unnecessary private information.

------------------------------------------------------------------------

# 11. Fast Scanning Requirements

Fast scanning is a major product requirement.

## Target

Under normal network conditions:

**QR detection + API validation + attendance response should target
roughly 0.5--1.5 seconds.**

Exact speed depends on device, Wi-Fi/mobile network, server and database
load.

## Design Rules

### Rule 1 --- Keep QR payload tiny

Only send the token.

### Rule 2 --- Keep API response tiny

Return only:

-   success/failure
-   name
-   roll number
-   attendance status
-   timestamp

### Rule 3 --- Do not generate Excel during scanning

Never:

``` text
Scan → update Excel → save file → response
```

Use:

``` text
Scan → database transaction → response
```

Excel is generated afterward.

### Rule 4 --- Scanner stays open

After successful scan:

``` text
Success
  ↓
brief visual confirmation
  ↓
automatically return to scanning
```

The club member should not need to click multiple buttons.

### Rule 5 --- Database indexes

Index:

-   `students.qr_token`
-   `registrations.student_id`
-   `registrations.event_id`
-   composite `(student_id, event_id)`
-   `attendance.event_id`
-   `attendance.student_id`
-   composite `(event_id, student_id)`

### Rule 6 --- Duplicate prevention at database level

Use:

``` text
UNIQUE(event_id, student_id)
```

Do not depend only on JavaScript to stop duplicate attendance.

------------------------------------------------------------------------

# 12. Concurrent Scanning

Multiple club members should be able to scan simultaneously.

Example:

``` text
Gate
├── Scanner 1
├── Scanner 2
└── Scanner 3
       |
       v
     API
       |
       v
     RDS
```

The database must remain the source of truth.

If the same QR is scanned simultaneously at two gates, the unique
attendance constraint must allow only one attendance record.

Use a database transaction where appropriate.

------------------------------------------------------------------------

# 13. Student Portal

## 13.1 Student Dashboard

Display:

-   Welcome message
-   Upcoming events
-   Registered event count
-   Attended event count
-   Latest notices
-   Quick access to Universal QR

Example:

``` text
Welcome, Abhishek

Upcoming Events
[Event Card] [Event Card]

My Registrations: 5
Attended: 3

Latest Notices
- Hackathon deadline extended
- Venue changed for Workshop
```

## 13.2 Event Listing

Each event card should show:

-   Poster
-   Event title
-   Date
-   Time
-   Venue
-   Category
-   Available seats
-   Registration status

## 13.3 Event Details

Display:

-   Event poster
-   Title
-   Full description
-   Date
-   Start/end time
-   Venue
-   Guest/speaker
-   Club
-   Seats
-   Registration deadline
-   Rules/instructions
-   Register button

## 13.4 Registration States

The UI should distinguish:

``` text
REGISTER NOW
REGISTERED
FULL
REGISTRATION CLOSED
EVENT COMPLETED
WAITLIST
```

------------------------------------------------------------------------

# 14. Student Universal QR Page

``` text
My CampusHub QR

Name: Abhishek Yadav
Roll No: 23

        [ QR CODE ]

Use this QR at registered events.
```

The QR should be easy to enlarge for scanning.

Optional:

-   Full-screen QR mode.
-   Bright display.
-   Screen-lock-friendly view.

------------------------------------------------------------------------

# 15. Student Event History

## Upcoming

Show registered events that have not occurred.

## Past

Show:

-   Event name
-   Date
-   Club
-   Attendance status

Example:

``` text
TechFest       Present
Hackathon      Present
Cultural Night Absent
Workshop       Present
```

## Attendance Summary

``` text
Registered Events: 12
Attended Events: 9
Missed Events: 3
Attendance Rate: 75%
```

The attendance rate is informational, not a college disciplinary
calculation unless the college explicitly defines such a rule.

------------------------------------------------------------------------

# 16. Club Portal

## 16.1 Club Dashboard

Display:

-   Total events
-   Upcoming events
-   Total registrations
-   Today's event
-   Live attendance count
-   Quick scanner button

## 16.2 Create Event

Required fields:

``` text
Title
Description
Category
Date
Start Time
End Time
Venue
Maximum Seats
Registration Deadline
Guest/Speaker
Poster
Rules
```

Validation:

-   Title required.
-   Date cannot be invalid.
-   End time must be after start time.
-   Capacity must be positive.
-   Registration deadline cannot be after the event.
-   Poster size/type should be restricted.

## 16.3 Event Status

Recommended statuses:

``` text
DRAFT
PUBLISHED
REGISTRATION_CLOSED
ONGOING
COMPLETED
CANCELLED
```

Only published events appear publicly to students.

------------------------------------------------------------------------

# 17. Club Registration Management

Club can see:

``` text
Total registered: 145
Capacity: 150
Remaining: 5
```

Registration table:

``` text
Name | Roll No | Email | Registered At | Status
```

Search by:

-   Name
-   Roll number
-   Email

Do not expose unrelated students to a club unless they are relevant to
that event.

------------------------------------------------------------------------

# 18. Attendance Dashboard

For each event:

``` text
Event: TechFest 2026

Capacity       150
Registered     145
Present        132
Absent          13
Attendance     91.03%
```

Table:

``` text
Student | Roll No | Registration | Check-in | Status
```

Statuses:

``` text
PRESENT
ABSENT
```

Before the event, no one should automatically be marked absent.

After the event is completed, registered students without attendance can
be represented as absent for reporting.

------------------------------------------------------------------------

# 19. Excel/CSV Export

Export only after attendance data is stored.

Example:

``` text
TechFest_Attendance_2026.xlsx

Roll No
Name
Email
Registration ID
Registration Time
Check-in Time
Attendance Status
```

Recommended backend library:

**ExcelJS**

CSV export can be offered alongside XLSX because CSV is simpler and
useful for interoperability.

------------------------------------------------------------------------

# 20. Notice System

Clubs can create notices.

Fields:

``` text
Title
Message
Related Event
Priority
Publish Date
Expiry Date
```

Priority:

``` text
NORMAL
IMPORTANT
URGENT
```

Students see notices on the dashboard.

Event-specific notices should be linked to the event.

------------------------------------------------------------------------

# 21. Database Design

## 21.1 users

``` text
users
-------------------------
id PK
name
email UNIQUE
roll_no UNIQUE
qr_token UNIQUE
role
created_at
updated_at
```

Roles:

``` text
STUDENT
CLUB_MEMBER
ADMIN
```

If student and club users are represented separately later, the schema
can be normalized further.

## 21.2 clubs

``` text
clubs
-------------------------
id PK
name
description
logo_url
created_at
status
```

## 21.3 club_members

``` text
club_members
-------------------------
id PK
club_id FK
user_id FK
role
created_at
```

Possible roles:

``` text
PRESIDENT
SECRETARY
MEMBER
```

## 21.4 venues

``` text
venues
-------------------------
id PK
name
location
capacity
```

## 21.5 events

``` text
events
-------------------------
id PK
club_id FK
venue_id FK
title
description
category
event_date
start_time
end_time
capacity
poster_url
guest_name
registration_deadline
status
created_at
updated_at
```

## 21.6 registrations

``` text
registrations
-------------------------
id PK
event_id FK
student_id FK
registered_at
status
```

Important constraint:

``` text
UNIQUE(event_id, student_id)
```

## 21.7 attendance

``` text
attendance
-------------------------
id PK
event_id FK
student_id FK
registration_id FK
check_in_time
status
scanned_by FK
```

Important constraint:

``` text
UNIQUE(event_id, student_id)
```

## 21.8 notices

``` text
notices
-------------------------
id PK
club_id FK
event_id FK nullable
title
content
priority
published_at
expires_at
status
```

------------------------------------------------------------------------

# 22. Database Relationships

``` text
USER
 |
 +---- STUDENT
 |
 +---- CLUB MEMBER
          |
          v
        CLUB
          |
          v
        EVENTS
          |
      +---+---+
      |       |
      v       v
REGISTRATIONS ATTENDANCE
      ^       ^
      |       |
      +--- STUDENT
```

Core relationship:

``` text
Student 1 ──── * Registration * ──── 1 Event
Student 1 ──── * Attendance   * ──── 1 Event
Club    1 ──── * Event
Club    1 ──── * ClubMember
```

------------------------------------------------------------------------

# 23. Backend API Design

Base URL:

``` text
/api/v1
```

## Authentication

``` text
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
```

If Cognito is used, login itself can be handled by Cognito and the
backend validates the access token.

## Students

``` text
GET /students/me
PATCH /students/me
GET /students/me/events
GET /students/me/attendance
GET /students/me/qr
```

## Events

``` text
GET /events
GET /events/:eventId
POST /events
PATCH /events/:eventId
DELETE /events/:eventId
POST /events/:eventId/publish
POST /events/:eventId/cancel
```

## Registration

``` text
POST /events/:eventId/register
DELETE /events/:eventId/register
GET /events/:eventId/registrations
GET /registrations/me
```

## Attendance

``` text
POST /events/:eventId/attendance/scan
GET /events/:eventId/attendance
GET /events/:eventId/attendance/export
```

## Notices

``` text
GET /notices
POST /notices
PATCH /notices/:noticeId
DELETE /notices/:noticeId
```

------------------------------------------------------------------------

# 24. API Authorization Rules

## Student

Can:

``` text
View published events
Register for events
Cancel own registration
View own QR
View own attendance
```

Cannot:

``` text
Create events
Scan attendance
View another student's attendance
Export club attendance
Modify another user's profile
```

## Club Member

Can:

``` text
Manage authorized club events
View registrations for authorized events
Scan attendance for authorized events
View/export attendance
Create notices for authorized club
```

Cannot:

``` text
Access another club's private event data
Modify student identity information
Change arbitrary attendance without authorization
```

## Admin

Can manage the platform.

------------------------------------------------------------------------

# 25. Backend Folder Structure

``` text
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── aws.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── student.controller.js
│   │   ├── event.controller.js
│   │   ├── registration.controller.js
│   │   ├── attendance.controller.js
│   │   └── notice.controller.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── student.routes.js
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
│   ├── services/
│   │   ├── qr.service.js
│   │   ├── attendance.service.js
│   │   ├── registration.service.js
│   │   ├── s3.service.js
│   │   └── export.service.js
│   │
│   ├── validators/
│   ├── utils/
│   ├── app.js
│   └── server.js
│
├── prisma/
│   └── schema.prisma
│
├── .env
├── package.json
└── README.md
```

------------------------------------------------------------------------

# 26. Frontend Integration

Create one common API module.

``` text
js/api.js
```

Example concept:

``` javascript
async function apiRequest(url, options = {}) {
    const response = await fetch(API_BASE_URL + url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    if (!response.ok) {
        throw new Error("API request failed");
    }

    return response.json();
}
```

Then pages call:

``` text
apiRequest("/events")
apiRequest("/events/123")
apiRequest("/events/123/register")
```

Do not repeat raw `fetch()` logic across every page.

------------------------------------------------------------------------

# 27. QR Generation

## Student QR

Generate QR after account creation.

Recommended process:

``` text
Student created
   ↓
Generate cryptographically random QR token
   ↓
Store token in RDS
   ↓
Frontend receives QR token
   ↓
Render QR image
```

The QR should encode only the opaque token.

The QR can be rendered in the browser, so the server does not need to
generate an image every time.

------------------------------------------------------------------------

# 28. QR Scanning

Use:

-   **ZXing Browser**, or
-   **html5-qrcode**

The scanner should:

1.  Request camera permission.
2.  Start camera.
3.  Detect QR.
4.  Stop/lock scanning briefly for the current token.
5.  Send token to API.
6.  Show result.
7.  Resume scanning.

Prevent duplicate requests caused by the camera detecting the same QR
multiple times in milliseconds.

Example client logic:

``` text
QR detected
   ↓
scannerLocked = true
   ↓
API request
   ↓
show result
   ↓
wait ~500–1000 ms
   ↓
scannerLocked = false
```

The exact delay should be tuned during testing.

------------------------------------------------------------------------

# 29. Attendance Transaction

The attendance operation should be atomic.

Conceptually:

``` text
BEGIN TRANSACTION

Find student from QR token

Find registration:
    student_id + event_id

If no registration:
    ROLLBACK

If attendance already exists:
    ROLLBACK

Insert attendance

COMMIT
```

This prevents race-condition duplicates.

------------------------------------------------------------------------

# 30. S3 File Upload Flow

Do not send large files through multiple unnecessary backend layers.

For MVP:

``` text
Club selects image
   ↓
Backend validates file
   ↓
Upload to S3
   ↓
S3 URL/key stored in events table
```

Recommended restrictions:

``` text
Allowed:
JPEG
PNG
WebP

Maximum size:
for example 2–5 MB
```

Validate file type and size on the server.

------------------------------------------------------------------------

# 31. AWS Environment Variables

Never commit credentials to GitHub.

Example:

``` text
DATABASE_URL=
AWS_REGION=
AWS_S3_BUCKET=
COGNITO_USER_POOL_ID=
COGNITO_CLIENT_ID=
JWT_SECRET=
```

Use:

-   `.env` locally.
-   EC2 environment/secret management for deployment.

Never hardcode:

``` text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

in source code.

Prefer an EC2 IAM role for AWS service access.

------------------------------------------------------------------------

# 32. Security Requirements

## Authentication

Every protected API must verify identity.

## Authorization

Every protected API must verify role and ownership.

## Input Validation

Validate:

-   Event fields
-   IDs
-   Email
-   Roll number
-   Capacity
-   Dates
-   File uploads

## SQL Injection

Use Prisma parameterization or parameterized SQL.

Never concatenate user input directly into SQL.

## XSS

Escape/sanitize user-generated event and notice content.

## CORS

Allow only your actual frontend origin in production.

## HTTPS

Production traffic must use HTTPS.

## QR Privacy

QR should not expose personal information.

## Rate Limiting

Rate-limit:

-   Login
-   Registration
-   Attendance scan endpoint
-   Other sensitive endpoints

Do not make the scan endpoint excessively restrictive because legitimate
event traffic can be high; tune it based on testing.

------------------------------------------------------------------------

# 33. Attendance Integrity

Important rules:

### Rule 1

Only registered students can receive attendance.

### Rule 2

One student can have at most one attendance record per event.

### Rule 3

Only authorized club members can scan for the event.

### Rule 4

Attendance timestamps come from the backend/server, not from the
student's browser.

### Rule 5

Attendance cannot be deleted casually.

If correction is needed:

``` text
Admin/authorized club member
    ↓
Attendance correction
    ↓
Reason required
    ↓
Audit log
```

This is a useful Phase-2 feature.

------------------------------------------------------------------------

# 34. Recommended Audit Log

For a stronger version:

``` text
audit_logs
-------------------------
id
actor_user_id
action
entity_type
entity_id
old_value
new_value
created_at
```

Examples:

``` text
CLUB_MEMBER created event
CLUB_MEMBER changed event capacity
CLUB_MEMBER scanned student
ADMIN corrected attendance
```

This is optional for MVP but valuable for demonstrating system design.

------------------------------------------------------------------------

# 35. Seat Management

When registering:

``` text
capacity = 100
registered = 73
available = 27
```

Do not trust the frontend's seat count.

The backend must perform the final check.

For concurrent registrations near capacity, use a database-safe
transaction/locking strategy so two users cannot both consume the final
seat incorrectly.

------------------------------------------------------------------------

# 36. Event Cancellation

If a club cancels an event:

``` text
Event status → CANCELLED
```

Students should see:

``` text
Event cancelled
```

Registrations remain as historical records unless the product explicitly
chooses to remove them.

------------------------------------------------------------------------

# 37. Event Completion

After event end:

``` text
ONGOING → COMPLETED
```

Attendance export becomes available.

Registered but not checked-in students can then be reported as:

``` text
ABSENT
```

The system should not label a student absent before the event has ended.

------------------------------------------------------------------------

# 38. Performance Requirements

## Student pages

Normal page/API response should target:

**\< 2 seconds** under normal conditions.

## QR scan

Target:

**\~0.5--1.5 seconds** from successful QR detection to result under
normal network conditions.

## Concurrent scanning

The MVP should be tested with:

-   2 scanners
-   5 scanners
-   10 scanners

before claiming high-volume readiness.

## Database

Use indexes on all common lookup paths.

------------------------------------------------------------------------

# 39. Error Handling

Every API should return predictable responses.

Example:

``` json
{
  "success": false,
  "error": {
    "code": "NOT_REGISTERED",
    "message": "Student is not registered for this event."
  }
}
```

Useful attendance errors:

``` text
INVALID_QR
STUDENT_NOT_FOUND
NOT_REGISTERED
ALREADY_ATTENDED
EVENT_NOT_ACTIVE
UNAUTHORIZED_SCANNER
SERVER_ERROR
```

Frontend should convert these into clear messages.

------------------------------------------------------------------------

# 40. Scanner UX Rules

The scanner is a high-speed operational screen.

Do:

-   Large camera area.
-   High-contrast success state.
-   High-contrast failure state.
-   Short messages.
-   Auto-reset.
-   Current event name visible.
-   Live attendance count.
-   Last scanned student visible.
-   Camera permission instructions.

Do not:

-   Navigate to another page after every scan.
-   Ask the club member to manually confirm every valid scan.
-   Show unnecessary student information.
-   Generate/download files during scanning.

------------------------------------------------------------------------

# 41. Testing Requirements

## Student Tests

-   Registration works.
-   Duplicate registration fails.
-   Full event cannot accept another registration.
-   Closed registration cannot accept users.
-   Student sees only own attendance.
-   Student QR remains unchanged.

## Club Tests

-   Club can create event.
-   Club cannot modify another club's event.
-   Club can see event registrations.
-   Club can scan only authorized event.
-   Invalid QR rejected.
-   Unregistered student rejected.
-   Duplicate scan rejected.
-   Valid scan creates attendance.

## Concurrency Tests

Test:

``` text
Same student + same event + two scanners
```

Expected:

``` text
One PRESENT record
One duplicate rejection
```

Test:

``` text
Multiple different students
+
multiple scanners
```

Expected:

``` text
All valid students recorded.
```

## Security Tests

-   Student cannot access club endpoints.
-   Club member cannot access another club's private data.
-   Unauthenticated request rejected.
-   Invalid token rejected.
-   SQL injection attempts rejected.
-   Unauthorized event attendance scan rejected.

------------------------------------------------------------------------

# 42. Deployment Plan

## Local Development

``` text
Browser
   ↓
localhost frontend
   ↓
localhost Node.js
   ↓
Local PostgreSQL or development RDS
```

## AWS Development

``` text
Browser
   ↓
S3/CloudFront frontend
   ↓
EC2 Node.js API
   ↓
RDS PostgreSQL
   ↓
S3
```

## Production

Use:

``` text
HTTPS
Domain
CloudFront
EC2
RDS
S3
CloudWatch
IAM
```

For a student demonstration, one EC2 instance is sufficient. Do not
introduce load balancers, containers, Kubernetes, or multi-region
deployment unless the project genuinely requires them.

------------------------------------------------------------------------

# 43. Suggested AWS Setup Order

## Step 1

Create AWS account and enable billing alerts.

## Step 2

Create IAM user/role following least privilege.

## Step 3

Create S3 bucket.

## Step 4

Create RDS PostgreSQL database.

## Step 5

Configure database security so it is not publicly exposed unnecessarily.

## Step 6

Develop backend locally against a development database.

## Step 7

Create EC2 instance.

## Step 8

Deploy Node.js backend.

## Step 9

Connect EC2 to RDS and S3.

## Step 10

Deploy frontend.

## Step 11

Add HTTPS/domain/CloudFront if needed.

## Step 12

Enable CloudWatch logging and monitoring.

------------------------------------------------------------------------

# 44. Development Phases

## Phase 1 --- Database + Backend Foundation

Build:

-   Database schema
-   Express server
-   Authentication
-   User roles
-   Basic API structure

Deliverable:

``` text
Student can login.
Club member can login.
```

## Phase 2 --- Student Event System

Build:

-   Event listing
-   Event details
-   Search/filter
-   Registration
-   Seat management
-   My Events

Deliverable:

``` text
Student can successfully register for an event.
```

## Phase 3 --- Club Event System

Build:

-   Club dashboard
-   Create event
-   Edit event
-   Publish event
-   Registration management
-   Notices

Deliverable:

``` text
Club can publish and manage events.
```

## Phase 4 --- Universal QR

Build:

-   QR token generation
-   Student QR page
-   QR scanner
-   QR validation

Deliverable:

``` text
Club scanner can identify a student.
```

## Phase 5 --- Attendance

Build:

-   Registration verification
-   Attendance transaction
-   Duplicate prevention
-   Live attendance dashboard

Deliverable:

``` text
Student scans once → attendance appears immediately.
```

## Phase 6 --- Export

Build:

-   XLSX
-   CSV
-   Attendance reports

Deliverable:

``` text
Club downloads event attendance report.
```

## Phase 7 --- AWS

Deploy:

-   RDS
-   EC2
-   S3
-   IAM
-   CloudWatch

## Phase 8 --- Polish

Add:

-   Better UI
-   Loading states
-   Error states
-   Search
-   Analytics
-   Notifications
-   Admin controls

------------------------------------------------------------------------

# 45. MVP Definition of Done

CampusHub MVP is complete when the following complete flow works:

``` text
1. Student creates account.
2. Student receives Universal QR.
3. Club member creates event.
4. Club publishes event.
5. Student sees event.
6. Student opens event details.
7. Student registers.
8. Seat count changes.
9. Registration appears in My Events.
10. Student opens Universal QR.
11. Club member opens scanner.
12. Student shows QR.
13. Scanner identifies student.
14. Backend checks event registration.
15. Attendance is recorded.
16. Scanner immediately becomes ready again.
17. Club sees live attendance.
18. Student sees event as attended.
19. Club exports Excel/CSV.
```

If these 19 steps work reliably, the core project is successful.

------------------------------------------------------------------------

# 46. Recommended Final Stack

``` text
FRONTEND
HTML5
CSS3
JavaScript
Bootstrap/Tailwind
Fetch API
ZXing Browser or html5-qrcode

BACKEND
Node.js
Express.js
Prisma
REST API
Zod/Joi
ExcelJS

DATABASE
PostgreSQL
Amazon RDS

AWS
Amazon EC2
Amazon RDS
Amazon S3
AWS IAM
CloudWatch

PHASE 2 AWS
Cognito
CloudFront
SES/SNS

QR
Universal student QR
Opaque random token
Client-side QR rendering
Camera scanner
Backend validation

EXPORT
ExcelJS
CSV
```

------------------------------------------------------------------------

# 47. Important Design Decisions to Freeze Before Coding

The team should agree on these before implementation:

1.  **One Universal QR per student.**
2.  QR contains only a secure opaque identifier.
3.  Student name, roll number and email are stored in RDS.
4.  Registration is stored separately from the student profile.
5.  Attendance is stored separately from registration.
6.  Attendance is event-specific.
7.  A club member must be authorized for the event before scanning.
8.  Database is the source of truth.
9.  Excel is an export/report.
10. Duplicate registration is prevented by a database constraint.
11. Duplicate attendance is prevented by a database constraint.
12. Scanner automatically returns to scan-ready state.
13. Backend timestamps attendance.
14. Multiple scanners can work on the same event.
15. Frontend validation is for UX; backend validation is mandatory for
    security.
16. AWS credentials are never committed to GitHub.
17. The first release stays monolithic: one Node.js backend + one
    PostgreSQL database.
18. Advanced AWS services are added only after the core system works.

------------------------------------------------------------------------

# 48. Final Product Architecture

``` text
                         CAMPUSHUB
                             |
             +---------------+---------------+
             |                               |
       STUDENT PORTAL                   CLUB PORTAL
             |                               |
      +------+-------+               +-------+------+
      |      |       |               |       |      |
   Events  Notices  QR            Events  Scanner Attendance
      |              |               |       |      |
      +------+- -----+---------------+-------+------+
             |
             v
          REST API
             |
      Node.js + Express
             |
     +-------+--------+
     |       |        |
     v       v        v
    RDS     S3     Auth Layer
     |                |
     |              Cognito
     |
     +----------------------+
     |                      |
Registrations           Attendance
     |                      |
     +----------+-----------+
                |
                v
          Excel / CSV Export
```

------------------------------------------------------------------------

# 49. Core Success Metric

The most important demonstration should be:

> **A student registers for an event, receives/uses their Universal QR,
> walks to the event gate, the club member scans the QR, the backend
> verifies registration, attendance is recorded in AWS, the result
> appears immediately, and the same attendance is visible in both the
> student's history and the club's attendance dashboard.**

That single end-to-end flow demonstrates the majority of the project's
value.
