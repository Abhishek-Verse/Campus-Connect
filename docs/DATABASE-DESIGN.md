# CampusHub --- Database Design

**Document:** Database Design\
**Version:** 1.0\
**Project:** CampusHub\
**Database:** PostgreSQL on Amazon RDS\
**Object Storage:** Amazon S3\
**Related Documents:** `01-PRD.md`, `02-SRS.md`, `03-ARCHITECTURE.md`

------------------------------------------------------------------------

# 1. Purpose

This document defines the database structure required for the CampusHub
MVP.

The design intentionally keeps the database simple.

CampusHub needs to store:

-   Student information
-   Club information
-   Club members
-   Events
-   Event registrations
-   Attendance
-   Notices
-   Event/ticket file references

The primary structured database is:

> **Amazon RDS PostgreSQL**

Amazon S3 is used for files such as:

-   Event posters
-   Club logos
-   Generated ticket files if needed
-   Other event documents

The database stores the **reference/key** to an S3 object rather than
storing the actual file.

------------------------------------------------------------------------

# 2. Database Architecture

``` text
                    CampusHub Backend
                           |
              +------------+------------+
              |                         |
              v                         v
       Amazon RDS                 Amazon S3
       PostgreSQL                Object Storage
              |                         |
       Structured Data             Files/Tickets
```

## RDS stores

``` text
Students
Clubs
Club Members
Events
Registrations
Attendance
Notices
Venues
```

## S3 stores

``` text
Event Posters
Club Logos
Ticket Files
Event Documents
```

------------------------------------------------------------------------

# 3. Main Database Entities

The MVP uses these main tables:

``` text
users
clubs
club_members
venues
events
registrations
attendance
notices
```

The design intentionally does **not** create separate tables for every
small concept.

------------------------------------------------------------------------

# 4. Entity Relationship Overview

``` text
                    USERS
                      |
             +--------+--------+
             |                 |
             v                 v
         STUDENT           CLUB MEMBER
             |                 |
             |                 v
             |                CLUB
             |                 |
             |                 v
             +--------->     EVENTS
             |                 |
             |          +------+------+
             |          |             |
             v          v             v
        REGISTRATIONS  VENUE       NOTICES
             |
             v
         ATTENDANCE
```

A simpler logical relationship is:

``` text
Student
   |
   +------ Registration ------ Event ------ Club
   |
   +------ Attendance -------- Event
```

------------------------------------------------------------------------

# 5. Table: `users`

This table stores the basic identity of CampusHub users.

``` text
users
------------------------------------------------
id                  UUID / BIGSERIAL PK
name                VARCHAR(100)
email               VARCHAR(255) UNIQUE
roll_no             VARCHAR(50) UNIQUE
qr_token            VARCHAR(100) UNIQUE
role                VARCHAR(30)
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

## Role values

``` text
STUDENT
CLUB_MEMBER
ADMIN
```

For the current project, the main roles are:

``` text
STUDENT
CLUB_MEMBER
```

Admin can be added as the project expands.

------------------------------------------------------------------------

# 6. Universal QR

Every student has one permanent QR token.

Example:

``` text
users
-----------------------------------------------
id          1001
name        Abhishek Yadav
roll_no     23
email       abhishek@example.com
qr_token    CH-7F82K91X
role        STUDENT
```

The QR contains:

``` text
CH-7F82K91X
```

It does **not** contain:

``` text
Abhishek Yadav
23
abhishek@example.com
```

The backend uses the token to find the student.

------------------------------------------------------------------------

# 7. Table: `clubs`

Stores college clubs/committees.

``` text
clubs
------------------------------------------------
id                  UUID / BIGSERIAL PK
name                VARCHAR(150)
description         TEXT
logo_url            TEXT
status              VARCHAR(30)
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

Example:

``` text
id          C001
name        Coding Club
description Technical events and competitions
logo_url    s3://campushub/.../logo.png
status      ACTIVE
```

------------------------------------------------------------------------

# 8. Table: `club_members`

Connects users to clubs.

``` text
club_members
------------------------------------------------
id                  UUID / BIGSERIAL PK
club_id             FK → clubs.id
user_id             FK → users.id
role                VARCHAR(50)
created_at          TIMESTAMP
```

Example roles:

``` text
PRESIDENT
SECRETARY
MEMBER
```

Relationship:

``` text
Club
 |
 +-- Member 1
 +-- Member 2
 +-- Member 3
```

------------------------------------------------------------------------

# 9. Table: `venues`

Stores event venue information.

``` text
venues
------------------------------------------------
id                  UUID / BIGSERIAL PK
name                VARCHAR(150)
location            VARCHAR(255)
capacity            INTEGER
created_at          TIMESTAMP
```

Example:

``` text
id          V001
name        Main Auditorium
location    Block A, College Campus
capacity    500
```

A venue can be reused for multiple events.

------------------------------------------------------------------------

# 10. Table: `events`

Stores event information.

``` text
events
------------------------------------------------
id                      UUID / BIGSERIAL PK
club_id                 FK → clubs.id
venue_id                FK → venues.id
title                   VARCHAR(200)
description             TEXT
category                VARCHAR(100)
event_date              DATE
start_time              TIME
end_time                TIME
capacity                INTEGER
poster_url              TEXT
guest_name              VARCHAR(150)
registration_deadline   TIMESTAMP
status                  VARCHAR(30)
created_at              TIMESTAMP
updated_at              TIMESTAMP
```

## Event status

``` text
DRAFT
PUBLISHED
REGISTRATION_CLOSED
ONGOING
COMPLETED
CANCELLED
```

------------------------------------------------------------------------

# 11. Event Example

``` text
events
------------------------------------------------
title: TechFest 2026

club: Coding Club

date: 2026-10-12

start: 10:00 AM

end: 04:00 PM

capacity: 150

poster_url:
s3://campushub/events/EVT001/poster.webp

guest_name:
Dr. XYZ

status:
PUBLISHED
```

------------------------------------------------------------------------

# 12. Table: `registrations`

This is one of the most important tables.

It connects:

``` text
Student
   +
Event
```

Structure:

``` text
registrations
------------------------------------------------
id                  UUID / BIGSERIAL PK
student_id          FK → users.id
event_id            FK → events.id
registered_at       TIMESTAMP
status              VARCHAR(30)
```

Status can be:

``` text
REGISTERED
CANCELLED
```

------------------------------------------------------------------------

# 13. Registration Constraint

A student cannot register twice for the same event.

Database constraint:

``` text
UNIQUE(student_id, event_id)
```

So:

``` text
Abhishek + TechFest
```

can exist only once.

This is important because frontend validation alone is not enough.

------------------------------------------------------------------------

# 14. Registration Flow

``` text
Student
   |
   v
Click Register
   |
   v
Backend
   |
   +--> Check Event
   |
   +--> Check Deadline
   |
   +--> Check Capacity
   |
   +--> Check Existing Registration
   |
   v
Create Registration
   |
   v
RDS
```

------------------------------------------------------------------------

# 15. Seat Calculation

For the MVP, available seats can be calculated from registrations.

``` text
Available Seats =
Event Capacity - Active Registrations
```

Example:

``` text
Capacity       = 150
Registrations  = 123

Available      = 27
```

The backend must perform the final capacity check.

The frontend number is only for display.

------------------------------------------------------------------------

# 16. Table: `attendance`

Stores actual event entry.

``` text
attendance
------------------------------------------------
id                  UUID / BIGSERIAL PK
event_id            FK → events.id
student_id          FK → users.id
registration_id     FK → registrations.id
check_in_time       TIMESTAMP
scanned_by          FK → users.id
status              VARCHAR(30)
```

Status:

``` text
PRESENT
```

The table is intentionally simple.

------------------------------------------------------------------------

# 17. Attendance Constraint

A student can have only one attendance record for one event.

``` text
UNIQUE(student_id, event_id)
```

This protects against:

``` text
Scanner 1 → Student A
Scanner 2 → Student A
```

at nearly the same time.

Only one attendance record can succeed.

------------------------------------------------------------------------

# 18. Attendance Flow

``` text
Student shows Universal QR
          |
          v
      QR Scanner
          |
          v
       QR Token
          |
          v
       Backend
          |
          v
Find Student
          |
          v
Find Registration
          |
          v
Already Attended?
      /       \
    YES        NO
     |          |
   Reject      Insert
                 |
                 v
             Attendance
```

------------------------------------------------------------------------

# 19. Why Attendance Is Separate from Registration

Registration means:

> The student reserved a seat.

Attendance means:

> The student actually entered the event.

Therefore:

``` text
Registration
    ≠
Attendance
```

Example:

``` text
Student registered
       ↓
Did not attend
       ↓
Registration exists
Attendance does not
```

After the event, this can be shown as:

``` text
ABSENT
```

------------------------------------------------------------------------

# 20. Table: `notices`

Stores club notices.

``` text
notices
------------------------------------------------
id                  UUID / BIGSERIAL PK
club_id             FK → clubs.id
event_id            FK → events.id NULL
title               VARCHAR(200)
content             TEXT
priority             VARCHAR(30)
published_at        TIMESTAMP
expires_at          TIMESTAMP NULL
status              VARCHAR(30)
```

Priority:

``` text
NORMAL
IMPORTANT
URGENT
```

Status:

``` text
DRAFT
PUBLISHED
EXPIRED
```

------------------------------------------------------------------------

# 21. S3 Storage Design

Amazon S3 should be used for files, not relational records.

Recommended bucket:

``` text
campushub-production
```

Folder/key structure:

``` text
campushub-production/
│
├── clubs/
│   └── {clubId}/
│       └── logo.png
│
├── events/
│   └── {eventId}/
│       └── poster.webp
│
├── tickets/
│   └── {eventId}/
│       └── {registrationId}.pdf
│
└── documents/
    └── {eventId}/
        └── document.pdf
```

------------------------------------------------------------------------

# 22. S3 and Tickets

If the project generates a **downloadable ticket**, the ticket file can
be stored in S3.

Example:

``` text
Student registers
       |
       v
Registration created
       |
       v
Ticket generated
       |
       v
Upload ticket to S3
       |
       v
Store S3 object key
       |
       v
Student can access ticket
```

The database should store:

``` text
ticket_s3_key
```

rather than storing the entire PDF inside PostgreSQL.

------------------------------------------------------------------------

# 23. Do We Need a Separate Ticket Table?

For the first version:

**No.**

Keep the ticket information inside the `registrations` table if a
downloadable ticket is required.

Add:

``` text
ticket_s3_key TEXT NULL
```

to:

``` text
registrations
```

Example:

``` text
registrations
------------------------------------------------
id
student_id
event_id
registered_at
status
ticket_s3_key
```

This keeps the database simple.

------------------------------------------------------------------------

# 24. Ticket vs Universal QR

These are different concepts.

### Universal QR

Permanent student identity:

``` text
Student
   ↓
Universal QR
   ↓
CH-7F82K91X
```

### Ticket

Event-specific registration proof/document:

``` text
TechFest
   ↓
Registration
   ↓
Ticket
```

The Universal QR should remain unchanged across events.

The ticket is event-specific.

------------------------------------------------------------------------

# 25. Recommended Ticket Design

If you create a PDF ticket, it can contain:

``` text
CAMPUSHUB

TECHFEST 2026

Student:
Abhishek Yadav

Roll No:
23

Date:
12 October 2026

Time:
10:00 AM

Venue:
Main Auditorium

Registration ID:
REG-8F73K92

[Universal QR / Event Ticket QR]
```

For the MVP, the ticket does not need to become another complex database
entity.

------------------------------------------------------------------------

# 26. S3 Security

The S3 bucket should not be openly writable by users.

Recommended:

``` text
Frontend
   |
   v
Backend
   |
   v
IAM Permission
   |
   v
S3
```

The backend controls uploads.

The application should not expose AWS secret keys to the browser.

------------------------------------------------------------------------

# 27. S3 Object Naming

Use IDs rather than user names.

Prefer:

``` text
events/EVT123/poster.webp
```

instead of:

``` text
events/AbhishekTechFestFinalPoster.webp
```

This makes object management predictable and avoids unnecessary personal
information in file paths.

------------------------------------------------------------------------

# 28. Database and S3 Relationship

Example event:

``` text
events
--------------------------------
id          EVT001
title       TechFest 2026
poster_url  events/EVT001/poster.webp
```

S3:

``` text
campushub-production
    |
    └── events
        └── EVT001
            └── poster.webp
```

The database references the file.

------------------------------------------------------------------------

# 29. Core Relationships

``` text
USERS
  |
  | 1
  |
  +------------------+
  |                  |
  | *                | *
  v                  v
REGISTRATIONS     ATTENDANCE
  |                  |
  | *                | *
  +--------+---------+
           |
           | 1
           v
         EVENTS
           |
           | *
           v
          CLUB
```

More specifically:

``` text
users.id
    ↓
registrations.student_id

events.id
    ↓
registrations.event_id

registrations.id
    ↓
attendance.registration_id

users.id
    ↓
attendance.student_id

events.id
    ↓
attendance.event_id

clubs.id
    ↓
events.club_id
```

------------------------------------------------------------------------

# 30. Recommended Indexes

Keep indexes focused on actual application queries.

## Users

``` text
UNIQUE(email)
UNIQUE(roll_no)
UNIQUE(qr_token)
```

## Registrations

``` text
INDEX(event_id)
INDEX(student_id)
UNIQUE(student_id, event_id)
```

## Attendance

``` text
INDEX(event_id)
INDEX(student_id)
UNIQUE(student_id, event_id)
```

## Events

``` text
INDEX(club_id)
INDEX(status)
INDEX(event_date)
```

These indexes are particularly important for the QR attendance path.

------------------------------------------------------------------------

# 31. QR Scan Database Query Path

When a club member scans:

``` text
QR Token
    |
    v
users.qr_token
    |
    v
student_id
    |
    v
registrations
    |
    +--> event_id
    |
    v
attendance
```

The database should not need to search through every student/event
record.

Indexes make these lookups fast.

------------------------------------------------------------------------

# 32. Attendance Transaction

The backend should use one database transaction.

Conceptually:

``` text
BEGIN

1. Find student by qr_token.

2. Find registration for:
   student_id + event_id.

3. Check attendance for:
   student_id + event_id.

4. If no attendance:
   INSERT attendance.

5. COMMIT
```

If the student is not registered:

``` text
ROLLBACK
```

If already attended:

``` text
ROLLBACK
```

------------------------------------------------------------------------

# 33. Database Constraints

Important constraints:

``` text
users.email
    UNIQUE

users.roll_no
    UNIQUE

users.qr_token
    UNIQUE

registrations(student_id, event_id)
    UNIQUE

attendance(student_id, event_id)
    UNIQUE
```

These constraints protect the system even if multiple requests arrive
simultaneously.

------------------------------------------------------------------------

# 34. Suggested PostgreSQL Data Types

Use:

``` text
UUID
VARCHAR
TEXT
INTEGER
DATE
TIME
TIMESTAMP
BOOLEAN
```

For IDs, either:

``` text
UUID
```

or:

``` text
BIGSERIAL
```

can work.

### Recommendation

Use UUIDs for the public-facing/application IDs.

Example:

``` text
event_id:
550e8400-e29b-41d4-a716-446655440000
```

Do not expose sequential database IDs unnecessarily in public QR tokens.

------------------------------------------------------------------------

# 35. Suggested Prisma Model Structure

If Prisma is used, the logical models are:

``` text
User
Club
ClubMember
Venue
Event
Registration
Attendance
Notice
```

The schema should represent:

``` text
User
 ├── registrations
 ├── attendance
 └── clubMemberships

Club
 ├── members
 ├── events
 └── notices

Event
 ├── registrations
 ├── attendance
 ├── notices
 └── venue
```

------------------------------------------------------------------------

# 36. Minimal Database Version

If the team needs an even simpler MVP, start with only:

``` text
users
clubs
events
registrations
attendance
```

Then add:

``` text
club_members
venues
notices
```

once the core event flow works.

However, the recommended final MVP schema includes all eight tables
because they are still manageable.

------------------------------------------------------------------------

# 37. Data Flow Example

## Student Registration

``` text
Student
  ↓
POST /events/EVT001/register
  ↓
Backend
  ↓
RDS
  ↓
registrations
  ↓
ticket_s3_key (optional)
```

## QR Attendance

``` text
Universal QR
  ↓
qr_token
  ↓
users
  ↓
student_id
  ↓
registrations
  ↓
attendance
```

## Event Poster

``` text
Club uploads poster
  ↓
Backend
  ↓
S3
  ↓
object key
  ↓
events.poster_url
```

------------------------------------------------------------------------

# 38. Example Complete Data

## User

``` text
id:
U001

name:
Abhishek Yadav

roll_no:
23

email:
abhishek@example.com

qr_token:
CH-7F82K91X

role:
STUDENT
```

## Event

``` text
id:
EVT001

title:
TechFest 2026

club_id:
CLUB001

capacity:
150

status:
PUBLISHED
```

## Registration

``` text
id:
REG001

student_id:
U001

event_id:
EVT001

status:
REGISTERED
```

## Attendance

``` text
id:
ATT001

student_id:
U001

event_id:
EVT001

registration_id:
REG001

check_in_time:
2026-10-12 10:21:04

status:
PRESENT
```

------------------------------------------------------------------------

# 39. Student History Query

To display:

``` text
My Events
```

the backend can query registrations joined with events.

Conceptually:

``` text
registrations
      |
      +---- events
```

For attendance history:

``` text
attendance
      |
      +---- events
```

The student should only receive records where:

``` text
student_id = authenticated_student_id
```

------------------------------------------------------------------------

# 40. Club Attendance Query

For an event:

``` text
events
   |
   v
registrations
   |
   +---- students
   |
   +---- attendance
```

This allows the club to display:

``` text
Student
Roll No
Email
Registration Status
Check-in Time
Attendance
```

------------------------------------------------------------------------

# 41. Absent Calculation

Do not create an attendance record for every student before the event.

Instead:

``` text
Registered Students
        -
Present Students
        =
Absent Students
```

Example:

``` text
Registered = 150
Present    = 132
Absent     = 18
```

This keeps the database simpler.

------------------------------------------------------------------------

# 42. Ticket Storage Recommendation

For the project, there are two possible ticket approaches.

## Option A --- Recommended for MVP

Do not store a PDF ticket.

Display an event registration page containing:

``` text
Event information
Registration ID
Universal QR
Registration status
```

## Option B --- Add downloadable ticket

Generate PDF and store it in S3:

``` text
registration
     |
     v
ticket PDF
     |
     v
S3
```

If the project specifically needs downloadable tickets, use Option B.

------------------------------------------------------------------------

# 43. What AWS Is Actually Needed for Database/File Storage

Do not add AWS services unnecessarily.

### Required

``` text
Amazon RDS
    ↓
PostgreSQL database

Amazon S3
    ↓
Event files / optional tickets

Amazon EC2
    ↓
Node.js backend

IAM
    ↓
AWS permissions

CloudWatch
    ↓
Logs
```

### Optional

``` text
Cognito
CloudFront
SES/SNS
```

For the core database architecture, **RDS + S3 are the important AWS
services**.

------------------------------------------------------------------------

# 44. Backup

Amazon RDS should have automated backups enabled for the deployed
database.

The project should not depend on:

``` text
Manual SQL file copied once
```

as its only backup.

For development, database seed files can still be kept in:

``` text
database/seed/
```

------------------------------------------------------------------------

# 45. Database Environment

## Local Development

The team can use:

``` text
Local PostgreSQL
```

or a development RDS database.

## Production

``` text
Amazon RDS PostgreSQL
```

The schema should be identical between environments through migrations.

------------------------------------------------------------------------

# 46. Migration Strategy

Database changes should use migrations.

Example:

``` text
Migration 001
Create users

Migration 002
Create clubs

Migration 003
Create events

Migration 004
Create registrations

Migration 005
Create attendance
```

Do not manually change production tables without recording the change.

------------------------------------------------------------------------

# 47. Seed Data

Development seed data can include:

``` text
5 students
2 clubs
5 club members
3 venues
5 events
10 registrations
sample attendance
sample notices
```

This allows the team to test the UI without manually creating
everything.

------------------------------------------------------------------------

# 48. Database Security

The production RDS database should:

-   Use strong credentials.
-   Restrict network access.
-   Be accessible by the backend only.
-   Use encrypted connections where configured.
-   Have backups enabled.
-   Avoid public access where possible.

The frontend must never know:

``` text
DATABASE_URL
```

or database credentials.

------------------------------------------------------------------------

# 49. Final Database Architecture

``` text
                         CAMPUSHUB
                             |
                         Backend
                             |
                +------------+------------+
                |                         |
                v                         v
          Amazon RDS                 Amazon S3
          PostgreSQL                Object Storage
                |                         |
        +-------+-------+          +------+------+
        |       |       |          |             |
      Users   Events  Notices    Posters       Tickets
        |       |
        |       +--------+
        |                |
        v                v
  Registrations       Attendance
        |
        v
     Students
```

------------------------------------------------------------------------

# 50. Final Recommended Schema

For the current project, freeze the schema at:

``` text
users
clubs
club_members
venues
events
registrations
attendance
notices
```

### Relationships

``` text
users
  ├── club_members
  ├── registrations
  └── attendance

clubs
  ├── club_members
  ├── events
  └── notices

venues
  └── events

events
  ├── registrations
  ├── attendance
  └── notices

registrations
  └── attendance
```

### AWS

``` text
RDS
└── All structured data

S3
├── Event posters
├── Club logos
└── Optional downloadable tickets
```

------------------------------------------------------------------------

# 51. Database Design Principles

The project should follow these rules:

1.  **RDS PostgreSQL is the source of truth for structured data.**
2.  **S3 stores files, not relational records.**
3.  **One student has one Universal QR token.**
4.  **QR token does not contain personal information.**
5.  **Registration and attendance are separate records.**
6.  **One student can register once per event.**
7.  **One student can attend once per event.**
8.  **Database constraints enforce duplicate prevention.**
9.  **Attendance is recorded before Excel export.**
10. **Ticket PDFs, if implemented, are stored in S3.**
11. **The frontend never connects directly to RDS.**
12. **The backend controls all database access.**
13. **Only the most important AWS services are used.**
14. **The schema should remain simple enough for the team to understand
    and maintain.**
