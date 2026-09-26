# CampusHub --- API Documentation

**Document:** API Documentation\
**Version:** 1.0\
**Project:** CampusHub\
**Backend:** Node.js + Express.js\
**Database:** PostgreSQL on Amazon RDS\
**Storage:** Amazon S3\
**API Style:** REST\
**Base URL:** `/api/v1`

------------------------------------------------------------------------

# 1. Purpose

This document defines the REST API used by the CampusHub frontend and
backend.

The API handles:

-   Authentication
-   Student profile
-   Universal QR
-   Events
-   Event registration
-   Attendance
-   Club management
-   Notices
-   Ticket/file references
-   Attendance export

The frontend must communicate with the backend through these APIs.

The frontend must **not** directly access:

-   PostgreSQL/RDS
-   S3 using AWS credentials
-   Other backend resources without authorization

------------------------------------------------------------------------

# 2. Basic API Structure

``` text
Frontend
   |
   | HTTP/HTTPS
   v
Node.js + Express
   |
   +---- Authentication
   |
   +---- Business Logic
   |
   +---- PostgreSQL / RDS
   |
   +---- Amazon S3
```

------------------------------------------------------------------------

# 3. Base URL

Development:

``` text
http://localhost:3000/api/v1
```

Production example:

``` text
https://your-domain.com/api/v1
```

The actual production domain can be configured later.

------------------------------------------------------------------------

# 4. HTTP Methods

The API uses standard HTTP methods.

  Method   Purpose
  -------- ------------------------------
  GET      Read data
  POST     Create data / perform action
  PATCH    Update data
  DELETE   Remove/cancel data

Examples:

``` http
GET /events
POST /events
PATCH /events/:eventId
DELETE /events/:eventId
```

------------------------------------------------------------------------

# 5. Authentication

CampusHub requires authentication for protected APIs.

Recommended MVP approach:

``` text
Login
  ↓
Backend verifies credentials
  ↓
Session/JWT created
  ↓
Frontend uses authenticated requests
```

For a simple implementation, the project can use a secure HTTP-only
session cookie.

If JWT is selected instead, protected requests can use:

``` http
Authorization: Bearer <token>
```

The final implementation should use **one authentication approach
consistently**.

------------------------------------------------------------------------

# 6. User Roles

``` text
STUDENT
CLUB_MEMBER
ADMIN
```

Role-based middleware controls access.

Example:

``` text
Student
  → Register for events
  → View own QR
  → View own attendance

Club Member
  → Create/manage authorized club events
  → Scan attendance
  → View event registrations

Admin
  → Manage system-wide resources
```

------------------------------------------------------------------------

# 7. Standard Response Format

Successful responses should be predictable.

Example:

``` json
{
  "success": true,
  "data": {
    "id": "..."
  }
}
```

For lists:

``` json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

------------------------------------------------------------------------

# 8. Standard Error Format

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

The frontend should use the `code` for logic and the `message` for user
display.

------------------------------------------------------------------------

# 9. Common HTTP Status Codes

  Status   Meaning
  -------- ------------------------------------------
  200      Successful request
  201      Resource created
  204      Successful request with no response body
  400      Invalid request
  401      Not authenticated
  403      Not authorized
  404      Resource not found
  409      Conflict
  422      Validation error
  429      Too many requests
  500      Server error

------------------------------------------------------------------------

# 10. Authentication APIs

## POST `/auth/register`

Registers a new student.

### Request

``` json
{
  "name": "Abhishek Yadav",
  "rollNo": "23",
  "email": "abhishek@example.com",
  "password": "secure-password"
}
```

### Response

``` json
{
  "success": true,
  "data": {
    "user": {
      "id": "USER_ID",
      "name": "Abhishek Yadav",
      "rollNo": "23",
      "email": "abhishek@example.com",
      "role": "STUDENT"
    }
  }
}
```

The backend automatically generates the Universal QR token.

The QR token must not be supplied by the frontend.

------------------------------------------------------------------------

# 11. POST `/auth/login`

Authenticates a user.

### Request

``` json
{
  "email": "abhishek@example.com",
  "password": "secure-password"
}
```

### Response

``` json
{
  "success": true,
  "data": {
    "user": {
      "id": "USER_ID",
      "name": "Abhishek Yadav",
      "email": "abhishek@example.com",
      "role": "STUDENT"
    }
  }
}
```

The authentication session/token is established by the backend.

------------------------------------------------------------------------

# 12. POST `/auth/logout`

Logs out the current user.

### Response

``` json
{
  "success": true,
  "message": "Logged out successfully."
}
```

------------------------------------------------------------------------

# 13. GET `/auth/me`

Returns the currently authenticated user.

### Response

``` json
{
  "success": true,
  "data": {
    "id": "USER_ID",
    "name": "Abhishek Yadav",
    "rollNo": "23",
    "email": "abhishek@example.com",
    "role": "STUDENT"
  }
}
```

------------------------------------------------------------------------

# 14. Student APIs

## GET `/students/me`

Returns the logged-in student's profile.

### Response

``` json
{
  "success": true,
  "data": {
    "id": "USER_ID",
    "name": "Abhishek Yadav",
    "rollNo": "23",
    "email": "abhishek@example.com"
  }
}
```

------------------------------------------------------------------------

# 15. PATCH `/students/me`

Updates the student's editable profile information.

### Request

``` json
{
  "name": "Abhishek Yadav"
}
```

The student should not be able to modify:

``` text
id
qr_token
role
```

Roll number and email changes should be restricted according to the
project's identity rules.

------------------------------------------------------------------------

# 16. GET `/students/me/qr`

Returns the student's Universal QR information.

### Response

``` json
{
  "success": true,
  "data": {
    "qrToken": "CH-7F82K91X"
  }
}
```

The frontend uses this token to generate/display the QR.

The QR should not expose unnecessary personal information.

------------------------------------------------------------------------

# 17. GET `/students/me/events`

Returns events associated with the current student.

Possible categories:

``` text
Registered
Upcoming
Past
```

### Response

``` json
{
  "success": true,
  "data": [
    {
      "id": "EVENT_ID",
      "title": "TechFest 2026",
      "eventDate": "2026-10-12",
      "startTime": "10:00",
      "venue": "Main Auditorium",
      "registrationStatus": "REGISTERED"
    }
  ]
}
```

------------------------------------------------------------------------

# 18. GET `/students/me/attendance`

Returns the student's attendance history.

### Response

``` json
{
  "success": true,
  "data": [
    {
      "eventId": "EVENT_ID",
      "eventTitle": "TechFest 2026",
      "eventDate": "2026-10-12",
      "status": "PRESENT",
      "checkInTime": "2026-10-12T10:21:04Z"
    },
    {
      "eventId": "EVENT_ID_2",
      "eventTitle": "Workshop",
      "eventDate": "2026-09-20",
      "status": "ABSENT",
      "checkInTime": null
    }
  ]
}
```

The backend must only return records belonging to the authenticated
student.

------------------------------------------------------------------------

# 19. Event APIs

## GET `/events`

Returns published events.

Optional query parameters:

``` text
?page=1
&limit=20
&status=PUBLISHED
&category=TECH
```

Example:

``` http
GET /api/v1/events?page=1&limit=20&status=PUBLISHED
```

### Response

``` json
{
  "success": true,
  "data": [
    {
      "id": "EVENT_ID",
      "title": "TechFest 2026",
      "eventDate": "2026-10-12",
      "startTime": "10:00",
      "endTime": "16:00",
      "venue": "Main Auditorium",
      "capacity": 150,
      "availableSeats": 27,
      "posterUrl": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

------------------------------------------------------------------------

# 20. GET `/events/:eventId`

Returns complete event details.

### Response

``` json
{
  "success": true,
  "data": {
    "id": "EVENT_ID",
    "title": "TechFest 2026",
    "description": "Annual technical event.",
    "category": "TECH",
    "eventDate": "2026-10-12",
    "startTime": "10:00",
    "endTime": "16:00",
    "venue": {
      "name": "Main Auditorium",
      "location": "Block A"
    },
    "capacity": 150,
    "availableSeats": 27,
    "guestName": "Dr. XYZ",
    "registrationDeadline": "2026-10-11T23:59:00Z",
    "posterUrl": "...",
    "status": "PUBLISHED",
    "rules": [
      "Carry college ID",
      "Report 15 minutes before the event"
    ]
  }
}
```

------------------------------------------------------------------------

# 21. POST `/events`

Creates an event.

### Access

``` text
CLUB_MEMBER
```

The backend must verify that the club member belongs to the club
creating the event.

### Request

``` json
{
  "clubId": "CLUB_ID",
  "title": "TechFest 2026",
  "description": "Annual technical event.",
  "category": "TECH",
  "venueId": "VENUE_ID",
  "eventDate": "2026-10-12",
  "startTime": "10:00",
  "endTime": "16:00",
  "capacity": 150,
  "guestName": "Dr. XYZ",
  "registrationDeadline": "2026-10-11T23:59:00Z",
  "rules": [
    "Carry college ID"
  ]
}
```

### Response

``` json
{
  "success": true,
  "data": {
    "id": "EVENT_ID",
    "status": "DRAFT"
  }
}
```

------------------------------------------------------------------------

# 22. PATCH `/events/:eventId`

Updates an event.

Only authorized club members can update the event.

### Request

``` json
{
  "title": "TechFest 2026 - Updated",
  "capacity": 200
}
```

Only allowed fields should be updated.

------------------------------------------------------------------------

# 23. POST `/events/:eventId/publish`

Publishes an event.

``` http
POST /api/v1/events/EVENT_ID/publish
```

### Response

``` json
{
  "success": true,
  "data": {
    "eventId": "EVENT_ID",
    "status": "PUBLISHED"
  }
}
```

------------------------------------------------------------------------

# 24. POST `/events/:eventId/cancel`

Cancels an event.

### Response

``` json
{
  "success": true,
  "data": {
    "eventId": "EVENT_ID",
    "status": "CANCELLED"
  }
}
```

------------------------------------------------------------------------

# 25. DELETE `/events/:eventId`

For the MVP, deleting should normally mean removing an unpublished
draft.

Published events should preferably use:

``` text
POST /events/:eventId/cancel
```

instead of physical deletion.

This preserves useful historical data.

------------------------------------------------------------------------

# 26. Registration APIs

## POST `/events/:eventId/register`

Registers the authenticated student.

No student ID is required in the request body.

The backend gets the student from authentication.

### Request

``` json
{}
```

### Response

``` json
{
  "success": true,
  "data": {
    "registrationId": "REG_ID",
    "eventId": "EVENT_ID",
    "status": "REGISTERED",
    "registeredAt": "2026-10-01T12:30:00Z"
  }
}
```

------------------------------------------------------------------------

# 27. Registration Validation

When registration is requested, backend checks:

``` text
Authenticated user is STUDENT
        ↓
Event exists
        ↓
Event is accepting registrations
        ↓
Registration deadline has not passed
        ↓
Capacity is available
        ↓
Student is not already registered
        ↓
Create registration
```

------------------------------------------------------------------------

# 28. Registration Errors

Possible codes:

``` text
EVENT_NOT_FOUND
REGISTRATION_CLOSED
REGISTRATION_DEADLINE_PASSED
EVENT_FULL
ALREADY_REGISTERED
UNAUTHORIZED
```

Example:

``` json
{
  "success": false,
  "error": {
    "code": "EVENT_FULL",
    "message": "No seats are available for this event."
  }
}
```

------------------------------------------------------------------------

# 29. DELETE `/events/:eventId/register`

Cancels the student's registration where cancellation is allowed.

### Response

``` json
{
  "success": true,
  "message": "Registration cancelled."
}
```

------------------------------------------------------------------------

# 30. GET `/registrations/me`

Returns the authenticated student's registrations.

### Response

``` json
{
  "success": true,
  "data": [
    {
      "registrationId": "REG_ID",
      "eventId": "EVENT_ID",
      "eventTitle": "TechFest 2026",
      "status": "REGISTERED",
      "registeredAt": "2026-10-01T12:30:00Z",
      "ticketS3Key": null
    }
  ]
}
```

------------------------------------------------------------------------

# 31. Club Registration API

## GET `/events/:eventId/registrations`

Returns registrations for a club event.

### Access

``` text
CLUB_MEMBER
```

The backend verifies that the user is authorized for the event.

### Response

``` json
{
  "success": true,
  "data": [
    {
      "registrationId": "REG001",
      "student": {
        "id": "USER_ID",
        "name": "Abhishek Yadav",
        "rollNo": "23",
        "email": "abhishek@example.com"
      },
      "status": "REGISTERED",
      "registeredAt": "2026-10-01T12:30:00Z"
    }
  ]
}
```

------------------------------------------------------------------------

# 32. Attendance API

The attendance scan endpoint is one of the most important APIs in
CampusHub.

## POST `/events/:eventId/attendance/scan`

Used by the club scanner.

### Access

``` text
CLUB_MEMBER
```

The backend verifies:

``` text
User is authenticated
        ↓
User is authorized for this event
        ↓
Event is active
```

------------------------------------------------------------------------

# 33. Attendance Scan Request

Only the QR token is required.

``` json
{
  "qrToken": "CH-7F82K91X"
}
```

The event ID comes from the URL:

``` text
/events/:eventId/attendance/scan
```

Therefore:

``` text
POST /events/EVT001/attendance/scan
```

with:

``` json
{
  "qrToken": "CH-7F82K91X"
}
```

------------------------------------------------------------------------

# 34. Attendance Scan Backend Flow

``` text
QR Scanner
    |
    v
qrToken
    |
    v
POST /events/:eventId/attendance/scan
    |
    v
Authenticate club member
    |
    v
Check club authorization
    |
    v
Check event status
    |
    v
Find student by qr_token
    |
    v
Find registration
    |
    v
Check existing attendance
    |
    v
Create attendance
    |
    v
Return small response
```

------------------------------------------------------------------------

# 35. Successful Scan Response

``` json
{
  "success": true,
  "data": {
    "student": {
      "name": "Abhishek Yadav",
      "rollNo": "23"
    },
    "status": "PRESENT",
    "checkInTime": "2026-10-12T10:21:04Z"
  }
}
```

The scanner UI can show:

``` text
ENTRY ALLOWED

Abhishek Yadav
Roll No: 23

Attendance Marked
10:21 AM
```

------------------------------------------------------------------------

# 36. Invalid QR Response

``` json
{
  "success": false,
  "error": {
    "code": "INVALID_QR",
    "message": "Invalid QR code."
  }
}
```

------------------------------------------------------------------------

# 37. Student Not Found

``` json
{
  "success": false,
  "error": {
    "code": "STUDENT_NOT_FOUND",
    "message": "Student could not be found."
  }
}
```

------------------------------------------------------------------------

# 38. Not Registered

``` json
{
  "success": false,
  "error": {
    "code": "NOT_REGISTERED",
    "message": "This student is not registered for this event."
  }
}
```

------------------------------------------------------------------------

# 39. Already Attended

``` json
{
  "success": false,
  "error": {
    "code": "ALREADY_ATTENDED",
    "message": "Attendance has already been marked for this event."
  }
}
```

------------------------------------------------------------------------

# 40. Event Not Active

``` json
{
  "success": false,
  "error": {
    "code": "EVENT_NOT_ACTIVE",
    "message": "Attendance is not currently available for this event."
  }
}
```

------------------------------------------------------------------------

# 41. Unauthorized Scanner

``` json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED_SCANNER",
    "message": "You are not authorized to scan attendance for this event."
  }
}
```

------------------------------------------------------------------------

# 42. Attendance Security Rule

The backend must **never** trust the frontend to decide:

``` text
student identity
event registration
attendance status
scanner authorization
check-in time
```

The backend must determine all of these.

------------------------------------------------------------------------

# 43. Attendance Timestamp

The frontend should not send:

``` json
{
  "checkInTime": "..."
}
```

The backend/database generates the timestamp.

This prevents users from manipulating attendance time.

------------------------------------------------------------------------

# 44. Multiple Scanner Support

Multiple club members can scan the same event.

Example:

``` text
Scanner A ─┐
           |
Scanner B ─┼──> Backend ──> RDS
           |
Scanner C ─┘
```

The database constraint:

``` text
UNIQUE(student_id, event_id)
```

prevents duplicate attendance.

------------------------------------------------------------------------

# 45. Scanner Performance

The scan endpoint should return a small response.

Do **not**:

``` text
Scan QR
  ↓
Generate Excel
  ↓
Upload Excel
  ↓
Return response
```

Instead:

``` text
Scan QR
  ↓
Validate
  ↓
Insert attendance
  ↓
Return response
```

Excel export happens separately.

------------------------------------------------------------------------

# 46. GET `/events/:eventId/attendance`

Returns attendance for a club event.

### Response

``` json
{
  "success": true,
  "data": [
    {
      "student": {
        "name": "Abhishek Yadav",
        "rollNo": "23",
        "email": "abhishek@example.com"
      },
      "registrationStatus": "REGISTERED",
      "attendanceStatus": "PRESENT",
      "checkInTime": "2026-10-12T10:21:04Z"
    }
  ]
}
```

------------------------------------------------------------------------

# 47. Attendance Dashboard

The frontend can calculate/display:

``` text
Registered: 150
Present: 132
Absent: 18
```

The backend should provide enough data to calculate these values.

------------------------------------------------------------------------

# 48. GET `/events/:eventId/attendance/export`

Exports attendance.

Recommended format:

``` text
CSV
```

or:

``` text
Excel (.xlsx)
```

The backend can generate the file using ExcelJS.

Example:

``` http
GET /api/v1/events/EVT001/attendance/export?format=xlsx
```

The export should be generated from the database.

------------------------------------------------------------------------

# 49. Attendance Export Columns

Recommended:

``` text
Student Name
Roll No
Email
Registration Status
Attendance Status
Check-in Time
```

Example:

``` text
Abhishek Yadav | 23 | abhishek@example.com |
REGISTERED | PRESENT | 10:21:04
```

------------------------------------------------------------------------

# 50. Ticket APIs

If downloadable tickets are implemented:

## GET `/registrations/:registrationId/ticket`

Returns access to the student's ticket.

The backend must verify:

``` text
Authenticated user
        ↓
Owns registration
```

before returning the ticket.

The actual file can be stored in S3.

------------------------------------------------------------------------

# 51. S3 File Upload

Files should generally be uploaded through the backend or using a
controlled pre-signed URL.

Simple MVP flow:

``` text
Frontend
   |
   v
Backend
   |
   v
S3
   |
   v
Object Key
   |
   v
RDS
```

Example stored value:

``` text
events/EVT001/poster.webp
```

------------------------------------------------------------------------

# 52. Notice APIs

## GET `/notices`

Returns published notices.

### Response

``` json
{
  "success": true,
  "data": [
    {
      "id": "NOTICE_ID",
      "title": "Registration Deadline Extended",
      "content": "Registration is now open until 11 PM.",
      "priority": "IMPORTANT",
      "publishedAt": "2026-10-05T09:00:00Z"
    }
  ]
}
```

------------------------------------------------------------------------

# 53. POST `/notices`

Creates a notice.

### Access

``` text
CLUB_MEMBER
```

### Request

``` json
{
  "clubId": "CLUB_ID",
  "eventId": "EVENT_ID",
  "title": "Registration Deadline Extended",
  "content": "Registration is now open until 11 PM.",
  "priority": "IMPORTANT"
}
```

------------------------------------------------------------------------

# 54. PATCH `/notices/:noticeId`

Updates a notice.

### Access

``` text
CLUB_MEMBER
```

The backend must verify ownership/authorization.

------------------------------------------------------------------------

# 55. DELETE `/notices/:noticeId`

Deletes or archives a notice.

For historical records, archiving can be preferred over physical
deletion.

------------------------------------------------------------------------

# 56. API Validation

Use a validation library such as:

``` text
Zod
```

or:

``` text
Joi
```

Validate:

``` text
Email
Password
Event title
Event date
Capacity
Registration deadline
QR token
UUIDs
Notice content
```

------------------------------------------------------------------------

# 57. Example Validation Error

Request:

``` json
{
  "capacity": -10
}
```

Response:

``` json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Capacity must be greater than zero."
  }
}
```

------------------------------------------------------------------------

# 58. API Authorization Matrix

  API                          Student   Club Member   Admin
  -------------------------- --------- ------------- -------
  Register/Login                   Yes           Yes     Yes
  View events                      Yes           Yes     Yes
  Register for event               Yes          No\*   Yes\*
  View own QR                      Yes            No      No
  View own attendance              Yes            No     Yes
  Create event                      No           Yes     Yes
  Edit club event                   No           Yes     Yes
  Publish event                     No           Yes     Yes
  View event registrations          No           Yes     Yes
  Scan attendance                   No           Yes     Yes
  View event attendance             No           Yes     Yes
  Export attendance                 No           Yes     Yes
  Create notice                     No           Yes     Yes

`*` Only if the implementation allows those roles to act as
students/admins.

------------------------------------------------------------------------

# 59. API Route Summary

``` text
AUTH
POST   /auth/register
POST   /auth/login
POST   /auth/logout
GET    /auth/me

STUDENT
GET    /students/me
PATCH  /students/me
GET    /students/me/qr
GET    /students/me/events
GET    /students/me/attendance

EVENTS
GET    /events
GET    /events/:eventId
POST   /events
PATCH  /events/:eventId
DELETE /events/:eventId
POST   /events/:eventId/publish
POST   /events/:eventId/cancel

REGISTRATION
POST   /events/:eventId/register
DELETE /events/:eventId/register
GET    /registrations/me
GET    /events/:eventId/registrations

ATTENDANCE
POST   /events/:eventId/attendance/scan
GET    /events/:eventId/attendance
GET    /events/:eventId/attendance/export

NOTICES
GET    /notices
POST   /notices
PATCH  /notices/:noticeId
DELETE /notices/:noticeId

TICKETS
GET    /registrations/:registrationId/ticket
```

------------------------------------------------------------------------

# 60. Backend Folder Mapping

The API can map to the backend structure:

``` text
backend/src/

controllers/
├── auth.controller.js
├── student.controller.js
├── event.controller.js
├── registration.controller.js
├── attendance.controller.js
├── notice.controller.js
└── club.controller.js

services/
├── qr.service.js
├── attendance.service.js
├── registration.service.js
├── event.service.js
├── s3.service.js
└── export.service.js

routes/
├── auth.routes.js
├── student.routes.js
├── event.routes.js
├── registration.routes.js
├── attendance.routes.js
└── notice.routes.js
```

------------------------------------------------------------------------

# 61. Important Backend Rule

Controllers should not contain all business logic.

Recommended flow:

``` text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Prisma
  ↓
PostgreSQL
```

Example:

``` text
POST /events/:eventId/attendance/scan
          ↓
attendance.routes.js
          ↓
auth middleware
          ↓
role middleware
          ↓
attendance.controller.js
          ↓
attendance.service.js
          ↓
Prisma
          ↓
RDS PostgreSQL
```

------------------------------------------------------------------------

# 62. QR Attendance Service

The attendance service should perform approximately:

``` text
1. Validate event ID.

2. Validate QR token.

3. Find student.

4. Check club member authorization.

5. Check event status.

6. Find registration.

7. Check existing attendance.

8. Insert attendance.

9. Return result.
```

This service should be kept small because it is on the critical scanner
path.

------------------------------------------------------------------------

# 63. Security Requirements

The API must:

-   Authenticate protected requests.
-   Check user roles.
-   Check event ownership/club membership.
-   Validate request bodies.
-   Rate-limit sensitive endpoints.
-   Never expose database credentials.
-   Never expose AWS secret keys.
-   Avoid returning unnecessary personal data.
-   Use HTTPS in production.
-   Use secure authentication cookies if sessions are used.
-   Handle database errors without exposing internal details.

------------------------------------------------------------------------

# 64. Rate Limiting

Rate limiting should be applied to:

``` text
/auth/login
/auth/register
/events/:eventId/attendance/scan
```

The QR scanner needs to remain fast, so the rate limit should prevent
abuse without blocking normal scanning.

------------------------------------------------------------------------

# 65. Error Codes

Recommended application error codes:

``` text
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
NOT_FOUND

EVENT_NOT_FOUND
EVENT_FULL
EVENT_NOT_ACTIVE
REGISTRATION_CLOSED
REGISTRATION_DEADLINE_PASSED
ALREADY_REGISTERED

INVALID_QR
STUDENT_NOT_FOUND
NOT_REGISTERED
ALREADY_ATTENDED
UNAUTHORIZED_SCANNER

TICKET_NOT_FOUND
FILE_UPLOAD_FAILED

SERVER_ERROR
```

------------------------------------------------------------------------

# 66. Final API Design

The most important CampusHub API path is:

``` text
Student
   |
   | Register
   v
POST /events/:eventId/register
   |
   v
RDS registrations
```

Then at the event:

``` text
Student QR
   |
   v
POST /events/:eventId/attendance/scan
   |
   v
Backend validation
   |
   +--> users
   |
   +--> registrations
   |
   +--> attendance
   |
   v
ENTRY ALLOWED
```

After the event:

``` text
GET /events/:eventId/attendance
        |
        v
Attendance Dashboard

GET /events/:eventId/attendance/export
        |
        v
Excel / CSV
```

------------------------------------------------------------------------

# 67. API Design Principles

1.  **Backend is the final authority.**
2.  **Frontend never directly accesses RDS.**
3.  **Frontend never contains AWS secret credentials.**
4.  **Universal QR identifies the student, not event access.**
5.  **Every attendance scan verifies event registration.**
6.  **Database constraints prevent duplicate registration/attendance.**
7.  **Attendance response should be small and fast.**
8.  **Excel generation is separate from QR scanning.**
9.  **Only authorized club members can scan an event.**
10. **Students can access only their own private data.**
11. **S3 stores files; RDS stores structured application data.**
12. **Keep the API small enough for the MVP team to implement and
    test.**
