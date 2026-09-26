# CampusHub --- Software Requirements Specification (SRS)

**Document:** Software Requirements Specification\
**Version:** 1.0\
**Project:** CampusHub\
**Status:** Baseline / Development Specification\
**Related Document:** `01-PRD.md`

------------------------------------------------------------------------

# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification defines the functional and
non-functional requirements for **CampusHub**, a centralized college
event and notice management platform.

CampusHub allows students to discover events, view event information,
register for available seats, use a permanent Universal QR for event
entry, and view their event/attendance history.

Club committee members can create and manage events, publish notices,
view registrations, scan student QR codes at event entrances, record
attendance, and export attendance reports.

This document is intended to act as the engineering contract between:

-   Product requirements
-   Frontend development
-   Backend development
-   Database development
-   AWS/cloud deployment
-   Testing
-   Project documentation

------------------------------------------------------------------------

# 2. Product Scope

CampusHub consists of two primary portals:

1.  **Student Portal**
2.  **Club Committee Portal**

An optional third role, **College/Super Admin**, can be added for
centralized administration.

The core system provides:

``` text
Student
   ↓
Browse Event
   ↓
View Event Details
   ↓
Register
   ↓
Universal QR
   ↓
Event Entry
   ↓
Club Scans QR
   ↓
Registration Verification
   ↓
Attendance Recorded
   ↓
Student + Club Attendance History
   ↓
Excel/CSV Export
```

------------------------------------------------------------------------

# 3. Objectives

The system shall:

1.  Centralize college event discovery.
2.  Allow clubs to publish and manage events.
3.  Allow students to register for events directly.
4.  Track event seat availability.
5.  Provide every student with one permanent Universal QR.
6.  Verify registration using the Universal QR at event entry.
7.  Record attendance quickly and reliably.
8.  Prevent duplicate registration.
9.  Prevent duplicate attendance.
10. Allow students to view their own event and attendance history.
11. Allow clubs to view event-wise registrations and attendance.
12. Export attendance to Excel/CSV.
13. Store core student/event/attendance data in AWS-hosted
    infrastructure.
14. Provide role-based access to protect student and club data.

------------------------------------------------------------------------

# 4. Intended Users

## 4.1 Student

A student is a registered CampusHub user who can:

-   View published events.
-   View notices.
-   Register for events.
-   View registration status.
-   Display their Universal QR.
-   View upcoming events.
-   View past events.
-   View attendance history.
-   View basic personal profile information.

## 4.2 Club Committee Member

A club committee member can:

-   Manage authorized club events.
-   Create and edit events.
-   Publish event information.
-   Manage event registrations.
-   Publish notices.
-   Scan student Universal QR codes.
-   Verify event registration.
-   Record attendance.
-   View attendance.
-   Export attendance reports.

## 4.3 Administrator

An administrator can:

-   Manage students.
-   Manage clubs.
-   Manage users and roles.
-   Review or manage events.
-   View platform-level information.
-   Perform authorized attendance corrections.

The administrator is optional for the first MVP but the system
architecture should support the role.

------------------------------------------------------------------------

# 5. User Roles and Permissions

  Capability                   Student   Club Member   Admin
  -------------------------- --------- ------------- -------
  Login                            Yes           Yes     Yes
  View published events            Yes           Yes     Yes
  View event details               Yes           Yes     Yes
  Register for event               Yes            No      No
  View own registrations           Yes            No      No
  Create event                      No           Yes     Yes
  Edit authorized event             No           Yes     Yes
  Publish event                     No           Yes     Yes
  View event registrations          No           Yes     Yes
  Scan QR                           No           Yes     Yes
  Mark attendance                   No           Yes     Yes
  View own attendance              Yes            No     Yes
  View event attendance             No           Yes     Yes
  Export attendance                 No           Yes     Yes
  Publish notices                   No           Yes     Yes
  Manage clubs                      No            No     Yes
  Manage users                      No            No     Yes

------------------------------------------------------------------------

# 6. System Architecture Requirements

## 6.1 Architecture Style

The MVP shall use a **modular monolithic architecture**.

``` text
Frontend
   ↓
REST API
   ↓
Node.js + Express
   ↓
PostgreSQL
```

AWS services are used for hosting, storage, authentication where
applicable, monitoring, and supporting infrastructure.

The MVP shall not use microservices.

## 6.2 Recommended Technology

### Frontend

-   HTML5
-   CSS3
-   JavaScript ES6+
-   Bootstrap 5 or Tailwind CSS
-   Fetch API
-   QR scanning library: ZXing Browser or html5-qrcode
-   QR generation library: qrcode.js or equivalent

### Backend

-   Node.js
-   Express.js
-   REST API
-   Prisma ORM or node-postgres
-   Zod/Joi for validation
-   ExcelJS for XLSX export
-   Helmet
-   CORS
-   Structured logging

### Database

-   PostgreSQL
-   Amazon RDS for PostgreSQL

### AWS

-   Amazon RDS
-   Amazon EC2
-   Amazon S3
-   AWS IAM
-   Amazon CloudWatch

Optional later:

-   Amazon Cognito
-   CloudFront
-   Amazon SES/SNS

------------------------------------------------------------------------

# 7. Functional Requirements

Functional requirements are identified using the format:

``` text
FR-XXX
```

------------------------------------------------------------------------

# 8. Authentication Requirements

## FR-AUTH-001 --- User Registration

The system shall allow a new student to create a CampusHub account.

Required information:

-   Name
-   Roll number
-   Email
-   Password or managed authentication credentials

The system shall validate required fields before creating the account.

## FR-AUTH-002 --- Unique Student Identity

The system shall ensure:

-   Email is unique.
-   Roll number is unique.
-   QR token is unique.

## FR-AUTH-003 --- Login

The system shall allow registered users to log in.

## FR-AUTH-004 --- Logout

The system shall allow authenticated users to log out.

## FR-AUTH-005 --- Session/Token Validation

Protected API endpoints shall reject unauthenticated requests.

## FR-AUTH-006 --- Role Identification

The system shall identify the authenticated user's role.

Supported roles:

``` text
STUDENT
CLUB_MEMBER
ADMIN
```

## FR-AUTH-007 --- Role-Based Access

The backend shall prevent users from accessing functions outside their
role.

Frontend hiding of buttons shall not be considered sufficient
authorization.

------------------------------------------------------------------------

# 9. Student Requirements

## FR-STU-001 --- Student Profile

The system shall provide a student profile containing:

-   Name
-   Roll number
-   Email

The system may display the student's Universal QR on the profile.

## FR-STU-002 --- Student Dashboard

The dashboard shall display:

-   Upcoming events
-   Relevant notices
-   Registration summary
-   Attendance summary
-   Quick access to Universal QR

## FR-STU-003 --- Event Discovery

Students shall be able to view published upcoming events.

## FR-STU-004 --- Event Search

Students should be able to search events by title or relevant text.

## FR-STU-005 --- Event Filtering

Students should be able to filter events by category and/or date.

## FR-STU-006 --- Event Details

The event details page shall display, where available:

-   Event title
-   Description
-   Poster
-   Date
-   Start time
-   End time
-   Venue
-   Club
-   Guest/speaker
-   Maximum capacity
-   Remaining seats
-   Registration deadline
-   Rules/instructions
-   Registration status

## FR-STU-007 --- Event Registration

An authenticated student shall be able to register for an available
event.

## FR-STU-008 --- Duplicate Registration Prevention

A student shall not be able to create more than one registration for the
same event.

The database shall enforce uniqueness for:

``` text
(event_id, student_id)
```

## FR-STU-009 --- Seat Validation

The backend shall verify seat availability before creating a
registration.

The frontend seat count shall not be treated as authoritative.

## FR-STU-010 --- Registration Deadline

The system shall reject registrations after the event's registration
deadline.

## FR-STU-011 --- Event Status Validation

The system shall allow registration only when the event is in a
registration-eligible state.

For example:

``` text
PUBLISHED
```

may allow registration, while:

``` text
CANCELLED
COMPLETED
```

shall not.

## FR-STU-012 --- Registration Cancellation

If enabled by the product configuration, a student shall be able to
cancel their registration before the configured deadline.

## FR-STU-013 --- My Events

Students shall have a page displaying their registered events.

The page shall distinguish:

-   Upcoming
-   Completed
-   Cancelled
-   Attended
-   Absent

## FR-STU-014 --- Attendance History

Students shall be able to view their own event attendance history.

The system shall not expose another student's attendance history to a
normal student.

------------------------------------------------------------------------

# 10. Universal QR Requirements

## FR-QR-001 --- Universal QR

Each student shall have exactly one Universal QR identity.

The same QR shall be usable for multiple events.

## FR-QR-002 --- QR Token

The QR shall contain an opaque/random identifier rather than personal
information.

Example:

``` text
CH-7F82K91X
```

The QR shall not directly encode:

-   Name
-   Email
-   Roll number
-   Other personal information

## FR-QR-003 --- QR-to-Student Mapping

The backend shall map the QR token to the corresponding student record.

## FR-QR-004 --- QR Display

Students shall be able to display their Universal QR from the Student
Portal.

## FR-QR-005 --- QR Regeneration

The system should not regenerate a student's QR during normal use.

If QR regeneration is supported later, the old token shall be
invalidated safely.

## FR-QR-006 --- QR Security

The QR token shall be sufficiently unpredictable.

Sequential IDs such as:

``` text
1
2
3
4
```

shall not be used as the sole QR identifier.

------------------------------------------------------------------------

# 11. Club Requirements

## FR-CLUB-001 --- Club Dashboard

The club dashboard shall display:

-   Upcoming events
-   Total registrations
-   Attendance counts
-   Event status
-   Quick scanner access

## FR-CLUB-002 --- Create Event

Authorized club members shall be able to create events.

Minimum event information:

-   Title
-   Description
-   Date
-   Start time
-   End time
-   Venue
-   Capacity
-   Registration deadline
-   Category

Optional:

-   Poster
-   Guest/speaker
-   Rules

## FR-CLUB-003 --- Edit Event

Authorized club members shall be able to edit their events.

## FR-CLUB-004 --- Event Ownership

A club member shall only manage events belonging to a club they are
authorized to manage.

## FR-CLUB-005 --- Event Publishing

A club member shall be able to publish an event.

Only published events shall be visible as public registration
opportunities.

## FR-CLUB-006 --- Event Status

The system shall support event statuses:

``` text
DRAFT
PUBLISHED
REGISTRATION_CLOSED
ONGOING
COMPLETED
CANCELLED
```

## FR-CLUB-007 --- Event Cancellation

Authorized club members shall be able to cancel an event.

## FR-CLUB-008 --- Registration List

Authorized club members shall be able to view registrations for their
events.

The list shall support searching by:

-   Name
-   Roll number
-   Email

------------------------------------------------------------------------

# 12. Notice Requirements

## FR-NOTICE-001 --- Create Notice

Authorized club members shall be able to create notices.

## FR-NOTICE-002 --- Notice Fields

A notice shall support:

-   Title
-   Content
-   Related event
-   Priority
-   Publish time
-   Optional expiry time

## FR-NOTICE-003 --- Notice Visibility

Published notices shall be visible to relevant students.

## FR-NOTICE-004 --- Event Notices

A notice may be associated with a specific event.

## FR-NOTICE-005 --- Notice Status

The system should support:

``` text
DRAFT
PUBLISHED
EXPIRED
```

------------------------------------------------------------------------

# 13. QR Scanning and Attendance Requirements

This is one of the most critical system functions.

## FR-ATT-001 --- Scanner Access

Only authenticated and authorized club members shall be able to open an
attendance scanner for an event.

## FR-ATT-002 --- Event Context

The scanner shall operate in the context of a specific event.

The scanner request shall not need to ask the club member to manually
enter the event ID for every scan.

## FR-ATT-003 --- QR Detection

The scanner shall detect a student's Universal QR using the device
camera.

## FR-ATT-004 --- QR Submission

After detecting a QR, the frontend shall send the QR token to the
backend.

Example:

``` http
POST /api/v1/events/{eventId}/attendance/scan
```

Request:

``` json
{
  "qrToken": "CH-7F82K91X"
}
```

## FR-ATT-005 --- Student Lookup

The backend shall find the student associated with the QR token.

If no student exists:

``` text
INVALID_QR
```

shall be returned.

## FR-ATT-006 --- Registration Verification

The backend shall verify that the student has an active registration for
the current event.

If no registration exists:

``` text
NOT_REGISTERED
```

shall be returned.

## FR-ATT-007 --- Duplicate Attendance Prevention

If the student has already been marked present for the event, the system
shall reject the second attendance attempt.

Response:

``` text
ALREADY_ATTENDED
```

## FR-ATT-008 --- Attendance Creation

For a valid first scan, the system shall create an attendance record
containing:

-   Student ID
-   Event ID
-   Registration ID
-   Check-in time
-   Scanning club member ID
-   Status

## FR-ATT-009 --- Server Timestamp

The attendance timestamp shall be generated by the backend/database
rather than trusted from the client device.

## FR-ATT-010 --- Attendance Result

The scanner shall display a clear result.

Success:

``` text
ENTRY ALLOWED
Attendance Marked
```

Failure:

``` text
NOT REGISTERED
```

or:

``` text
ALREADY ATTENDED
```

## FR-ATT-011 --- Automatic Scanner Reset

After displaying the result briefly, the scanner shall automatically
become ready for the next QR.

The club member should not need to navigate away from the scanner page.

## FR-ATT-012 --- Multiple Scanners

Multiple authorized club members shall be able to scan the same event
simultaneously.

## FR-ATT-013 --- Database-Level Duplicate Protection

Attendance uniqueness shall be enforced by the database:

``` text
UNIQUE(event_id, student_id)
```

Application-level checks alone shall not be considered sufficient.

## FR-ATT-014 --- Scanner Information

After a successful scan, the scanner may display:

-   Student name
-   Roll number
-   Attendance status
-   Check-in time

It should not display unrelated private information.

------------------------------------------------------------------------

# 14. Attendance Management Requirements

## FR-ATT-M-001 --- Attendance Dashboard

Club members shall be able to view attendance for an event.

## FR-ATT-M-002 --- Attendance Summary

The system shall display:

``` text
Capacity
Registered
Present
Absent
Attendance percentage
```

## FR-ATT-M-003 --- Attendance List

The club shall be able to view:

-   Name
-   Roll number
-   Email where appropriate
-   Registration status
-   Check-in time
-   Attendance status

## FR-ATT-M-004 --- Absent Calculation

A registered student shall be considered absent only after the event is
completed or after the configured attendance closing condition.

A student shall not be marked absent simply because they have not yet
entered an ongoing event.

## FR-ATT-M-005 --- Attendance Export

Authorized club members shall be able to export event attendance.

Supported formats:

``` text
XLSX
CSV
```

## FR-ATT-M-006 --- Export Fields

The export should include:

``` text
Roll No
Name
Email
Registration ID
Registration Time
Check-in Time
Attendance Status
```

## FR-ATT-M-007 --- Database as Source of Truth

The database shall remain the primary source of attendance data.

Excel/CSV files shall be generated from stored database records.

The system shall not update an Excel file during every QR scan.

------------------------------------------------------------------------

# 15. Database Requirements

## FR-DB-001 --- Persistent Storage

The system shall store persistent application data in PostgreSQL.

The production database shall use Amazon RDS for PostgreSQL.

## FR-DB-002 --- Student Data

The student record shall initially contain:

``` text
id
name
roll_no
email
qr_token
created_at
updated_at
```

## FR-DB-003 --- Club Data

The system shall store:

``` text
club
club members
club roles
```

## FR-DB-004 --- Event Data

The system shall store:

``` text
event
club
venue
capacity
date/time
status
poster
registration deadline
```

## FR-DB-005 --- Registration Data

The system shall store:

``` text
registration
student
event
registration timestamp
registration status
```

## FR-DB-006 --- Attendance Data

The system shall store:

``` text
attendance
student
event
registration
check-in timestamp
scanner
status
```

## FR-DB-007 --- Constraints

The database shall enforce:

``` text
Unique email
Unique roll number
Unique QR token
Unique student + event registration
Unique student + event attendance
```

## FR-DB-008 --- Indexing

The database shall have indexes for frequent operations including:

``` text
qr_token
email
roll_no
event_id
student_id
(event_id, student_id)
```

------------------------------------------------------------------------

# 16. File Storage Requirements

## FR-FILE-001 --- S3 Storage

Event posters and other supported files shall be stored in Amazon S3.

## FR-FILE-002 --- File Metadata

The database may store:

-   S3 object key
-   URL/reference
-   File type
-   File size

The binary file itself should not be stored in PostgreSQL.

## FR-FILE-003 --- File Validation

Uploaded files shall be validated for:

-   Allowed MIME type
-   File size
-   File extension

## FR-FILE-004 --- File Access

S3 permissions shall prevent unauthorized modification.

------------------------------------------------------------------------

# 17. API Requirements

The backend shall expose REST APIs under:

``` text
/api/v1
```

## Authentication

``` http
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
```

## Student

``` http
GET   /students/me
PATCH /students/me
GET   /students/me/events
GET   /students/me/attendance
GET   /students/me/qr
```

## Events

``` http
GET    /events
GET    /events/:eventId
POST   /events
PATCH  /events/:eventId
DELETE /events/:eventId
POST   /events/:eventId/publish
POST   /events/:eventId/cancel
```

## Registration

``` http
POST   /events/:eventId/register
DELETE /events/:eventId/register
GET    /events/:eventId/registrations
GET    /registrations/me
```

## Attendance

``` http
POST /events/:eventId/attendance/scan
GET  /events/:eventId/attendance
GET  /events/:eventId/attendance/export
```

## Notices

``` http
GET    /notices
POST   /notices
PATCH  /notices/:noticeId
DELETE /notices/:noticeId
```

------------------------------------------------------------------------

# 18. API Response Requirements

API responses should use a consistent structure.

## Success

``` json
{
  "success": true,
  "data": {}
}
```

## Error

``` json
{
  "success": false,
  "error": {
    "code": "NOT_REGISTERED",
    "message": "Student is not registered for this event."
  }
}
```

Common error codes:

``` text
UNAUTHORIZED
FORBIDDEN
VALIDATION_ERROR
NOT_FOUND
DUPLICATE_REGISTRATION
EVENT_FULL
REGISTRATION_CLOSED
INVALID_QR
STUDENT_NOT_FOUND
NOT_REGISTERED
ALREADY_ATTENDED
EVENT_NOT_ACTIVE
INTERNAL_ERROR
```

------------------------------------------------------------------------

# 19. Non-Functional Requirements

Non-functional requirements are identified using:

``` text
NFR-XXX
```

------------------------------------------------------------------------

# 20. Performance Requirements

## NFR-PERF-001 --- QR Response Time

Under normal network and server conditions, the system should target
approximately:

``` text
0.5–1.5 seconds
```

from successful QR detection to attendance result.

This is a target, not an absolute guarantee.

## NFR-PERF-002 --- Scanner Readiness

The scanner shall automatically return to scan-ready state after
processing a QR.

## NFR-PERF-003 --- Small API Payload

The QR scan API shall send only the information necessary for
verification.

The QR scan request should contain the opaque QR token.

## NFR-PERF-004 --- No File Generation During Scan

The attendance scanner shall never generate an Excel file as part of the
scan transaction.

## NFR-PERF-005 --- Database Indexes

All high-frequency lookup paths shall be indexed.

## NFR-PERF-006 --- Concurrent Scanners

The system should support multiple scanners for the same event.

Initial testing target:

``` text
2 scanners
5 scanners
10 scanners
```

------------------------------------------------------------------------

# 21. Scalability Requirements

## NFR-SCALE-001

The backend should be designed so additional EC2 capacity can be
introduced later without redesigning the application.

## NFR-SCALE-002

The database should support indexing and efficient queries for:

-   QR lookup
-   Registration lookup
-   Attendance lookup

## NFR-SCALE-003

The MVP shall remain a modular monolith.

The architecture shall not introduce microservices unless a later
requirement justifies them.

------------------------------------------------------------------------

# 22. Availability Requirements

## NFR-AVAIL-001

The system should remain available during event registration and event
entry periods.

## NFR-AVAIL-002

Production backend and database should not depend on a developer's local
computer.

## NFR-AVAIL-003

CloudWatch logs shall be enabled for backend troubleshooting.

------------------------------------------------------------------------

# 23. Security Requirements

## NFR-SEC-001 --- HTTPS

Production communication shall use HTTPS.

## NFR-SEC-002 --- Password Security

If application-managed passwords are used, passwords shall never be
stored in plaintext.

A secure password hashing mechanism such as Argon2 or bcrypt shall be
used.

If Amazon Cognito is used, password handling should be delegated to
Cognito.

## NFR-SEC-003 --- Authorization

Every protected backend operation shall verify authorization.

## NFR-SEC-004 --- QR Privacy

The QR shall not contain:

``` text
Name
Email
Roll number
Phone number
```

## NFR-SEC-005 --- QR Token Randomness

QR tokens shall be generated using a cryptographically secure random
mechanism.

## NFR-SEC-006 --- Input Validation

All user input shall be validated on the backend.

## NFR-SEC-007 --- SQL Injection

Database queries shall use parameterization/ORM protections.

## NFR-SEC-008 --- XSS

User-generated event/notice content shall be safely rendered.

## NFR-SEC-009 --- CORS

Production CORS configuration shall allow only trusted frontend origins.

## NFR-SEC-010 --- Rate Limiting

Rate limiting shall be applied to sensitive endpoints.

Especially:

``` text
Login
Registration
QR scanning
```

The QR scan limit must be tuned so legitimate high-volume event entry is
not blocked.

## NFR-SEC-011 --- AWS Credentials

AWS credentials shall never be hardcoded in source code.

## NFR-SEC-012 --- IAM

AWS resources shall use least-privilege IAM permissions.

The EC2 backend should use an IAM role to access AWS services instead of
embedding long-lived access keys.

## NFR-SEC-013 --- Database Security

The RDS database should not be publicly accessible unless there is a
specific development requirement.

------------------------------------------------------------------------

# 24. Privacy Requirements

## NFR-PRIV-001

Students shall only be able to view their own personal and attendance
information.

## NFR-PRIV-002

Club members shall only receive student information necessary for event
operations.

## NFR-PRIV-003

A club scanner shall not expose a student's complete event history.

## NFR-PRIV-004

Attendance exports shall be accessible only to authorized club/admin
users.

------------------------------------------------------------------------

# 25. Reliability Requirements

## NFR-REL-001

An attendance scan shall either:

``` text
Successfully create attendance
```

or:

``` text
Return a clear failure
```

It shall not silently fail.

## NFR-REL-002

Attendance operations shall use database transactions where needed.

## NFR-REL-003

Duplicate attendance shall be prevented even when two scanners process
the same student concurrently.

## NFR-REL-004

The system shall log important backend errors.

------------------------------------------------------------------------

# 26. Usability Requirements

## NFR-UX-001

The student portal shall be usable on mobile and desktop screens.

## NFR-UX-002

The club scanner shall be optimized for mobile devices.

## NFR-UX-003

The scanner shall show large, clear success/failure feedback.

## NFR-UX-004

The club member should be able to process the next student without
navigating away from the scanner.

## NFR-UX-005

Important states shall be visually distinct:

``` text
SUCCESS
ERROR
WARNING
LOADING
```

## NFR-UX-006

Forms shall show validation errors close to the relevant field.

------------------------------------------------------------------------

# 27. Responsive Design Requirements

The system shall support:

``` text
Mobile
Tablet
Desktop
```

Priority:

### Scanner

Mobile-first.

### Student Portal

Mobile + desktop.

### Club Management

Desktop/tablet preferred, with scanner mobile-friendly.

------------------------------------------------------------------------

# 28. Data Consistency Requirements

## NFR-DATA-001

The database is the source of truth.

## NFR-DATA-002

Seat counts shall be derived from registration data or maintained
transactionally.

## NFR-DATA-003

Attendance shall be derived from attendance records.

## NFR-DATA-004

Excel/CSV files shall not be treated as primary data storage.

## NFR-DATA-005

A registration and attendance record shall maintain referential
integrity.

------------------------------------------------------------------------

# 29. Event Lifecycle Requirements

An event follows:

``` text
DRAFT
  ↓
PUBLISHED
  ↓
REGISTRATION_CLOSED
  ↓
ONGOING
  ↓
COMPLETED
```

Alternative:

``` text
PUBLISHED
  ↓
CANCELLED
```

Rules:

### DRAFT

Students cannot register.

### PUBLISHED

Students can view and register if registration is open.

### REGISTRATION_CLOSED

Students cannot register.

### ONGOING

QR attendance scanning is allowed.

### COMPLETED

Attendance scanning is closed unless an administrator explicitly reopens
it.

### CANCELLED

Registration and attendance scanning are disabled.

------------------------------------------------------------------------

# 30. Registration Lifecycle

``` text
REGISTERED
    ↓
CANCELLED
```

After event completion:

``` text
REGISTERED
    ↓
ATTENDED / ABSENT
```

Attendance status should be derived from attendance records rather than
manually changing the registration status.

------------------------------------------------------------------------

# 31. Attendance Lifecycle

``` text
No Attendance
      ↓
QR Scan
      ↓
Registration Verified
      ↓
PRESENT
```

If the student scans again:

``` text
PRESENT
  ↓
ALREADY_ATTENDED
```

If no registration:

``` text
NOT_REGISTERED
```

------------------------------------------------------------------------

# 32. Registration and Attendance Business Rules

## BR-001

One student can register only once for one event.

## BR-002

One student can have only one attendance record for one event.

## BR-003

A student must be registered before attendance can be recorded.

## BR-004

A club member must be authorized to scan attendance for an event.

## BR-005

Attendance cannot be recorded for cancelled events.

## BR-006

Attendance cannot normally be recorded after the event is completed.

## BR-007

Student QR identity is independent of event registration.

## BR-008

The same Universal QR can be used for unlimited events.

## BR-009

The backend determines registration validity.

## BR-010

The backend/database determines attendance validity.

## BR-011

The frontend cannot directly mark attendance.

## BR-012

Excel export reads data from the database.

------------------------------------------------------------------------

# 33. Seat Management Rules

Given:

``` text
capacity = 100
registered = 97
```

available seats:

``` text
3
```

When a new registration is accepted:

``` text
registered = 98
available = 2
```

The final seat allocation must be handled safely in the
backend/database.

If capacity is reached:

``` text
EVENT_FULL
```

shall be returned.

------------------------------------------------------------------------

# 34. Optional Waitlist Requirements

Waitlist is not required for MVP.

If implemented:

``` text
EVENT_FULL
   ↓
JOIN WAITLIST
   ↓
Position assigned
```

When a seat becomes available:

``` text
First waitlisted student
   ↓
Notification
   ↓
Registration confirmation
```

------------------------------------------------------------------------

# 35. File Upload Requirements

For event posters:

Supported:

``` text
JPEG
PNG
WebP
```

Suggested maximum:

``` text
2–5 MB
```

The final limit shall be configured in the backend.

The system shall reject:

-   Unsupported file type
-   Oversized file
-   Invalid/malformed upload

------------------------------------------------------------------------

# 36. Logging Requirements

The backend shall log:

-   Application startup
-   API errors
-   Database errors
-   Authentication failures
-   Attendance scan failures
-   Important administrative operations

Do not log:

-   Passwords
-   Secrets
-   AWS private keys
-   Full sensitive tokens unnecessarily

CloudWatch shall be used for production backend logs.

------------------------------------------------------------------------

# 37. Audit Requirements

A future audit log should record important actions:

``` text
event created
event updated
event cancelled
notice published
attendance recorded
attendance corrected
```

For attendance correction, store:

``` text
actor
event
student
old status
new status
reason
timestamp
```

This is recommended for Phase 2.

------------------------------------------------------------------------

# 38. Error Handling Requirements

The frontend shall handle:

``` text
Network error
Server error
Authentication error
Authorization error
Validation error
Event full
Registration closed
Invalid QR
Not registered
Already attended
```

The UI shall show a human-readable message.

Example:

``` text
❌ This student is not registered for this event.
```

rather than:

``` text
HTTP 409
```

only.

------------------------------------------------------------------------

# 39. Offline Scanning

Offline scanning is **not part of MVP**.

MVP requirement:

``` text
QR
 ↓
Internet
 ↓
Backend
 ↓
Database
```

Reason:

Allowing offline attendance creates additional complexity around:

-   Duplicate prevention
-   Sync
-   Conflict resolution
-   Device security
-   Data loss

An offline queue can be considered later.

------------------------------------------------------------------------

# 40. Performance-Sensitive Attendance Path

The attendance path shall be optimized:

``` text
Camera
  ↓
QR Decode
  ↓
POST /attendance/scan
  ↓
QR token indexed lookup
  ↓
Registration indexed lookup
  ↓
Attendance uniqueness check
  ↓
Insert
  ↓
Small response
```

Avoid:

``` text
Scan
 ↓
Multiple unnecessary API requests
 ↓
Large data transfer
 ↓
Excel generation
 ↓
Slow response
```

------------------------------------------------------------------------

# 41. Recommended Attendance Database Transaction

Conceptually:

``` sql
BEGIN;

SELECT student
FROM students
WHERE qr_token = ?;

SELECT registration
FROM registrations
WHERE student_id = ?
AND event_id = ?;

INSERT INTO attendance (
    event_id,
    student_id,
    registration_id,
    check_in_time,
    scanned_by,
    status
)
VALUES (...);

COMMIT;
```

The actual implementation should use the ORM/database transaction API.

The unique constraint must remain the final protection against race
conditions.

------------------------------------------------------------------------

# 42. AWS Requirements

## AWS-RDS-001

Production relational data shall be stored in Amazon RDS PostgreSQL.

## AWS-RDS-002

The backend shall connect securely to RDS.

## AWS-S3-001

Event posters shall be stored in Amazon S3.

## AWS-EC2-001

The Node.js backend shall be deployable on Amazon EC2.

## AWS-IAM-001

AWS permissions shall use IAM least privilege.

## AWS-CW-001

Production backend logs shall be available through CloudWatch.

## AWS-COGNITO-001

If Cognito is adopted, the backend shall validate Cognito-issued
identity/access tokens.

Cognito is optional for MVP if the team implements secure application
authentication first, but AWS-managed authentication is recommended for
a later production-oriented version.

------------------------------------------------------------------------

# 43. Frontend Requirements

## FE-001

Frontend shall use HTML, CSS and JavaScript.

## FE-002

Frontend shall communicate with backend through REST APIs.

## FE-003

Frontend shall not directly connect to PostgreSQL.

## FE-004

Frontend shall not contain AWS secret keys.

## FE-005

Frontend shall provide loading states.

## FE-006

Frontend shall provide empty states.

## FE-007

Frontend shall provide error states.

## FE-008

Frontend shall prevent obvious duplicate button submissions.

Backend shall still enforce duplicate protection.

------------------------------------------------------------------------

# 44. Backend Requirements

## BE-001

Backend shall use Node.js and Express.js.

## BE-002

Backend shall expose REST APIs.

## BE-003

Backend shall validate every incoming request.

## BE-004

Backend shall enforce authorization.

## BE-005

Backend shall handle database transactions where required.

## BE-006

Backend shall centralize error handling.

## BE-007

Backend shall use environment configuration for secrets.

## BE-008

Backend shall provide consistent API response structures.

------------------------------------------------------------------------

# 45. Database Requirements

## DB-001

PostgreSQL shall be the relational database.

## DB-002

Production PostgreSQL shall run on Amazon RDS.

## DB-003

Foreign keys shall maintain relationships.

## DB-004

Unique constraints shall enforce business rules.

## DB-005

Indexes shall support high-frequency lookup operations.

## DB-006

Database migrations shall be version-controlled.

## DB-007

Database schema changes shall be performed through migrations rather
than manually editing production tables.

------------------------------------------------------------------------

# 46. Integration Requirements

## INT-001 --- Frontend to Backend

Frontend communicates with backend using HTTPS REST APIs.

## INT-002 --- Backend to RDS

Backend communicates with PostgreSQL using secure database
credentials/configuration.

## INT-003 --- Backend to S3

Backend uses IAM-authorized AWS access to upload event files.

## INT-004 --- Backend to CloudWatch

Application logs are forwarded/available through CloudWatch in
production.

## INT-005 --- QR Scanner to Backend

Scanner sends only the QR token and event context required for
validation.

------------------------------------------------------------------------

# 47. Project Repository Requirements

The project repository should contain:

``` text
CampusHub/
├── docs/
├── frontend/
├── backend/
├── database/
├── infrastructure/
├── scripts/
├── tests/
├── assets/
├── README.md
└── .gitignore
```

The following shall not be committed:

``` text
.env
AWS secret keys
Database passwords
Private certificates
Production secrets
```

------------------------------------------------------------------------

# 48. Testing Requirements

## Unit Tests

Test:

-   Validation
-   Registration logic
-   Seat calculation
-   QR validation
-   Attendance rules

## Integration Tests

Test:

``` text
Frontend → API → Database
```

and:

``` text
QR → API → RDS → Attendance
```

## End-to-End Test

The complete critical flow must be tested:

``` text
Create Student
  ↓
Create Event
  ↓
Publish Event
  ↓
Student Registers
  ↓
Student QR
  ↓
Club Scanner
  ↓
Registration Verification
  ↓
Attendance
  ↓
Student History
  ↓
Club Dashboard
  ↓
Excel Export
```

------------------------------------------------------------------------

# 49. Acceptance Criteria

The MVP shall be considered functional only when all critical acceptance
criteria pass.

## AC-001

A student can log in and view published events.

## AC-002

A student can open complete event details.

## AC-003

A student can register for an available event.

## AC-004

A student cannot register twice for the same event.

## AC-005

A student cannot register after the registration deadline.

## AC-006

A student receives/has access to one Universal QR.

## AC-007

The QR does not expose the student's personal information directly.

## AC-008

A club member can open the scanner for an authorized event.

## AC-009

A valid registered student QR is accepted.

## AC-010

An unregistered student's QR is rejected.

## AC-011

An invalid QR is rejected.

## AC-012

A second scan of the same student for the same event is rejected as
duplicate.

## AC-013

A successful scan creates exactly one attendance record.

## AC-014

The scanner automatically becomes ready for the next student.

## AC-015

Multiple scanners can process different students for the same event.

## AC-016

Concurrent duplicate scans cannot create duplicate attendance.

## AC-017

Student can view their attendance history.

## AC-018

Club can view event attendance.

## AC-019

Club can export attendance as XLSX/CSV.

## AC-020

Frontend cannot directly access the database.

## AC-021

Unauthorized users cannot access protected endpoints.

## AC-022

Production data is stored using AWS services defined by the
architecture.

------------------------------------------------------------------------

# 50. MVP Development Order

The team shall implement the system in this order:

``` text
1. Repository setup
       ↓
2. Database schema
       ↓
3. Backend foundation
       ↓
4. Authentication
       ↓
5. Student APIs
       ↓
6. Club APIs
       ↓
7. Event management
       ↓
8. Registration
       ↓
9. Universal QR
       ↓
10. Scanner
       ↓
11. Attendance
       ↓
12. Attendance dashboard
       ↓
13. Excel/CSV export
       ↓
14. AWS deployment
       ↓
15. Security hardening
       ↓
16. Performance testing
       ↓
17. UI polish
```

Do not start with QR scanning before registration and event logic work
correctly.

------------------------------------------------------------------------

# 51. Definition of Done

A feature is complete only when:

1.  Frontend UI exists.
2.  Backend API exists.
3.  Backend validates input.
4.  Authorization is implemented.
5.  Database interaction works.
6.  Error states are handled.
7.  Success states are handled.
8.  At least one test exists for the core logic.
9.  Documentation is updated.
10. The feature works in an end-to-end flow.

------------------------------------------------------------------------

# 52. Critical Technical Decisions

The following decisions are considered baseline architecture:

``` text
Frontend:
HTML + CSS + JavaScript

Backend:
Node.js + Express.js

Database:
PostgreSQL

Production Database:
Amazon RDS

Backend Hosting:
Amazon EC2

File Storage:
Amazon S3

Monitoring:
CloudWatch

Permissions:
IAM

QR:
One Universal QR per student

QR Content:
Opaque random token

Registration:
Student + Event unique constraint

Attendance:
Student + Event unique constraint

Attendance Source of Truth:
PostgreSQL

Export:
ExcelJS / CSV

Architecture:
Modular monolith
```

------------------------------------------------------------------------

# 53. Out of Scope for Version 1

The following are explicitly outside the MVP:

-   Payments
-   Facial recognition
-   Biometric attendance
-   Native mobile applications
-   Offline QR attendance
-   AI recommendations
-   Complex recommendation algorithms
-   Chat
-   Social feed
-   Multi-college federation
-   Microservices
-   Kubernetes
-   Multi-region AWS architecture
-   Advanced notification automation
-   Advanced certificate verification

These may be considered in future scope.

------------------------------------------------------------------------

# 54. Future Enhancements

Potential future versions can add:

## Version 2

-   Waitlist
-   Email notifications
-   Event reminders
-   Admin approval
-   Attendance correction audit log
-   Event analytics
-   Certificates

## Version 3

-   Mobile application
-   Offline scanner with secure synchronization
-   Calendar integration
-   Digital certificate verification
-   Advanced analytics
-   Event recommendation system

------------------------------------------------------------------------

# 55. Final System Requirement Summary

The core CampusHub requirement can be expressed as:

``` text
STUDENT
   │
   ├── Name
   ├── Roll No
   ├── Email
   └── Universal QR
          │
          ↓
     CAMPUSHUB
          │
          ├── Events
          │
          ├── Registrations
          │
          ├── Notices
          │
          └── Attendance
                 │
                 ↓
            CLUB SCANNER
                 │
                 ↓
          Verify Registration
                 │
          ┌──────┴──────┐
          ↓             ↓
       VALID          INVALID
          ↓             ↓
     Attendance       Reject
          │
          ↓
     Student History
          +
     Club Dashboard
          +
      Excel Export
```

The system's most important invariant is:

> **A Universal QR identifies a student; it does not automatically grant
> event entry. The backend must verify that the student is registered
> for the specific event before attendance is recorded.**
