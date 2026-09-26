# CampusHub --- Security

**Document:** Security Specification\
**Version:** 1.0\
**Project:** CampusHub

------------------------------------------------------------------------

# 1. Purpose

This document defines the security rules for CampusHub.

The goal is to protect:

-   Student accounts
-   Student personal information
-   Universal QR tokens
-   Event registrations
-   Attendance records
-   Club access
-   Database
-   Amazon S3 files
-   AWS credentials

Security should be practical for the CampusHub MVP.

------------------------------------------------------------------------

# 2. Security Principles

CampusHub follows these principles:

1.  **Never trust the frontend.**
2.  **Backend is the final authority.**
3.  **Least privilege.**
4.  **Passwords are never stored as plaintext.**
5.  **AWS credentials are never exposed to the browser.**
6.  **Students can access only their own private data.**
7.  **Club members can access only authorized club/event data.**
8.  **Database constraints protect important business rules.**
9.  **QR codes identify students but do not independently grant event
    access.**
10. **Production traffic uses HTTPS.**

------------------------------------------------------------------------

# 3. Security Architecture

``` text
                     Internet
                        |
                      HTTPS
                        |
                        v
                CampusHub Backend
                        |
          +-------------+-------------+
          |             |             |
          v             v             v
        RDS            S3            IAM
     PostgreSQL     File Storage    Permissions
          |
          v
     Application Data
```

The browser should never directly connect to:

``` text
RDS
```

and should not contain AWS secret credentials.

------------------------------------------------------------------------

# 4. Authentication

Authentication answers:

> Who is this user?

CampusHub has:

``` text
STUDENT
CLUB_MEMBER
ADMIN
```

The backend must authenticate users before protected operations.

Recommended MVP options:

``` text
Secure HTTP-only session cookie
```

or:

``` text
Short-lived access token
```

Choose one approach and use it consistently.

Do not mix multiple authentication systems unnecessarily.

------------------------------------------------------------------------

# 5. Password Storage

Passwords must never be stored directly.

Never store:

``` text
password = "mypassword123"
```

Use a password hashing algorithm such as:

``` text
Argon2id
```

or:

``` text
bcrypt
```

Recommended:

``` text
Password
   ↓
Argon2id/bcrypt
   ↓
Password hash
   ↓
PostgreSQL
```

The original password must never be recoverable from the database.

------------------------------------------------------------------------

# 6. Login Security

Login should:

-   Validate email format.
-   Validate password presence.
-   Compare against the password hash.
-   Return a generic error for invalid credentials.
-   Avoid exposing whether an account exists.
-   Rate-limit repeated attempts.

Example:

``` text
Invalid email or password.
```

Avoid:

``` text
This email exists but the password is wrong.
```

------------------------------------------------------------------------

# 7. Session Security

If cookie-based authentication is used, production cookies should use:

``` text
HttpOnly
Secure
SameSite
```

Example concept:

``` text
Set-Cookie:
session=...
HttpOnly
Secure
SameSite=Lax
```

The exact configuration depends on the deployment setup.

The frontend should not need to read the authentication cookie.

------------------------------------------------------------------------

# 8. Authorization

Authentication is not enough.

The backend must also check:

> Is this user allowed to perform this action?

Example:

``` text
Logged-in student
        ↓
Can view own attendance
        ↓
Cannot view another student's attendance
```

------------------------------------------------------------------------

# 9. Role-Based Access

## Student

Can:

``` text
View public events
Register for events
Cancel own registration when allowed
View own events
View own attendance
View own QR
Update allowed profile fields
```

Cannot:

``` text
Create club events
Scan attendance
View all student registrations
Modify attendance
```

------------------------------------------------------------------------

# 10. Club Member

Can:

``` text
Create authorized club events
Edit authorized events
Publish/cancel authorized events
View event registrations
Open attendance scanner
Mark attendance through QR scanning
View event attendance
Export event attendance
Create/manage authorized notices
```

Cannot automatically access another club's data.

------------------------------------------------------------------------

# 11. Admin

Admin permissions should be introduced only where required.

An admin may manage system-wide resources if the feature is implemented.

Do not give every user admin permissions simply because it is convenient
during development.

------------------------------------------------------------------------

# 12. Authorization Must Be Server-Side

Never rely on:

``` text
localStorage.role
```

or:

``` text
frontendRole === "ADMIN"
```

for security.

The frontend can hide/show UI, but the backend must enforce
authorization.

Example:

``` text
POST /events/EVT001/attendance/scan
        ↓
Backend checks authenticated user
        ↓
Backend checks CLUB_MEMBER role
        ↓
Backend checks membership/authorization
```

------------------------------------------------------------------------

# 13. Club Authorization

A club member must only manage events belonging to an authorized club.

Example:

``` text
User A
  ↓
Member of Coding Club
  ↓
Can manage Coding Club events

Cannot automatically manage
Drama Club events
```

Every protected club operation must perform this check.

------------------------------------------------------------------------

# 14. Event Authorization

For event-specific operations:

``` text
/events/:eventId/...
```

the backend should:

1.  Find the event.
2.  Find the owning club.
3.  Verify the authenticated user is authorized for that club.
4.  Continue only if authorized.

------------------------------------------------------------------------

# 15. Student Data Privacy

Student private data includes:

``` text
Name
Roll number
Email
QR token
Attendance history
Registration history
```

Students should receive only their own private information.

Example:

``` text
GET /students/me/attendance
```

is valid.

A student should not be able to manipulate:

``` text
GET /students/OTHER_USER_ID/attendance
```

to access another student's data.

------------------------------------------------------------------------

# 16. Universal QR Security

The Universal QR contains an opaque token.

Example:

``` text
CH-7F82K91X
```

Do not encode:

``` text
Name
Email
Roll number
Password
Database ID with sensitive meaning
```

The QR should not expose unnecessary personal information.

------------------------------------------------------------------------

# 17. QR Token Requirements

QR tokens should be:

-   Random/unpredictable.
-   Unique.
-   Stored in the database.
-   Generated by the backend.
-   Not generated from the student's roll number.
-   Not generated from email.
-   Not based on sequential IDs.

Good:

``` text
CH-7F82K91X
```

Bad:

``` text
STUDENT-23
```

Bad:

``` text
ABHISHEK-23
```

------------------------------------------------------------------------

# 18. QR Does Not Grant Access

This is a core security rule.

A valid QR only identifies a student.

The backend must still check:

``` text
QR token
   ↓
Student
   ↓
Registration for this event?
   ↓
Already attended?
   ↓
Event active?
   ↓
Attendance allowed
```

Therefore:

``` text
Valid QR
≠
Automatic event entry
```

------------------------------------------------------------------------

# 19. QR Attendance Security

The attendance endpoint:

``` http
POST /api/v1/events/:eventId/attendance/scan
```

receives:

``` json
{
  "qrToken": "CH-7F82K91X"
}
```

The backend must verify:

``` text
1. User is authenticated.
2. User is an authorized club scanner.
3. Event exists.
4. Event is active for attendance.
5. QR token is valid.
6. Student exists.
7. Student is registered for this event.
8. Student has not already attended.
9. Attendance is inserted.
```

------------------------------------------------------------------------

# 20. Do Not Trust Client-Supplied Identity

Do not accept:

``` json
{
  "studentId": "123",
  "qrToken": "..."
}
```

as two independent sources of identity.

The backend should derive the student from:

``` text
qrToken
```

and derive the event from:

``` text
:eventId
```

The authenticated scanner identity comes from:

``` text
authentication/session
```

------------------------------------------------------------------------

# 21. Attendance Timestamp

Never trust:

``` json
{
  "checkInTime": "2020-01-01T00:00:00Z"
}
```

from the client.

The backend/database creates the timestamp.

``` text
Scanner
   ↓
Request
   ↓
Backend
   ↓
Server/database timestamp
```

------------------------------------------------------------------------

# 22. Duplicate Attendance Protection

The database must enforce:

``` text
UNIQUE(student_id, event_id)
```

This protects against:

``` text
Scanner A → scan
Scanner B → same student → almost simultaneously
```

Even if two requests reach the backend at nearly the same time, only one
attendance record should succeed.

------------------------------------------------------------------------

# 23. Registration Protection

The database must enforce:

``` text
UNIQUE(student_id, event_id)
```

for registrations.

This prevents duplicate registration caused by:

``` text
Double click
Multiple browser tabs
Repeated API request
Network retry
Concurrent requests
```

------------------------------------------------------------------------

# 24. Registration Capacity

Capacity must be enforced by the backend.

Do not trust:

``` text
availableSeats
```

calculated only in JavaScript.

The backend must verify availability before creating a registration.

For high-concurrency registration, use an appropriate
transaction/locking strategy so capacity cannot be exceeded by
simultaneous requests.

------------------------------------------------------------------------

# 25. Input Validation

Every API request must validate input.

Validate:

``` text
UUIDs
Email
Password
Name
Roll number
Event title
Description
Date
Time
Capacity
Registration deadline
QR token
Notice content
```

Use:

``` text
Zod
```

or:

``` text
Joi
```

------------------------------------------------------------------------

# 26. Validation Example

Invalid:

``` json
{
  "capacity": -100
}
```

Return:

``` json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Capacity must be greater than zero."
  }
}
```

Do not pass invalid values directly into business logic.

------------------------------------------------------------------------

# 27. SQL Injection

Use Prisma or parameterized queries.

Do not construct SQL using raw user input.

Bad:

``` text
"SELECT * FROM users WHERE email = '" + email + "'"
```

Prefer:

``` text
Prisma query
```

or:

``` text
Parameterized SQL
```

------------------------------------------------------------------------

# 28. XSS Protection

User-controlled text can include:

``` text
Event description
Notice content
Event title
Club name
```

Do not inject raw user HTML into the page.

Avoid:

``` javascript
element.innerHTML = userInput;
```

unless the content is properly sanitized and HTML is intentionally
supported.

Prefer safe DOM APIs/text rendering.

------------------------------------------------------------------------

# 29. HTTP Security Headers

Use a middleware such as:

``` text
Helmet
```

to configure appropriate security headers.

Examples include protections for:

``` text
Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
```

The exact production policy should be tested rather than copied blindly.

------------------------------------------------------------------------

# 30. CORS

CORS should allow only trusted frontend origins.

Do not use:

``` text
Access-Control-Allow-Origin: *
```

for authenticated production APIs unless there is a specific reason.

Example concept:

``` text
Allowed origin:
https://campushub.example.com
```

Development can allow:

``` text
http://localhost:...
```

as required.

------------------------------------------------------------------------

# 31. HTTPS

Production CampusHub must use HTTPS.

HTTPS protects:

``` text
Login credentials
Session information
QR requests
Personal data
Attendance requests
```

Do not deploy the production application using plain HTTP.

------------------------------------------------------------------------

# 32. Rate Limiting

Rate limiting should be applied to sensitive endpoints.

Especially:

``` text
POST /auth/login
POST /auth/register
POST /events/:eventId/attendance/scan
```

The exact limits should account for normal scanner usage.

Do not create a rate limit so aggressive that normal event attendance
becomes impossible.

------------------------------------------------------------------------

# 33. QR Scanner Abuse

A malicious user may repeatedly submit random QR tokens.

Protection:

``` text
Authentication
+
Club/event authorization
+
Rate limiting
+
Input validation
+
Fast rejection
```

Do not expose internal database errors for invalid tokens.

------------------------------------------------------------------------

# 34. Error Messages

User-facing errors should not expose internal information.

Do not return:

``` text
PostgreSQL error
SQL query
File system path
AWS error containing credentials
Stack trace
Internal service details
```

Instead:

``` text
Unable to complete the request.
Please try again.
```

Detailed errors can be logged server-side.

------------------------------------------------------------------------

# 35. Logging

Log important security/application events such as:

``` text
Failed login attempts
Successful login
Event creation
Event publication
Event cancellation
Attendance scan results
Authorization failures
Server errors
File upload failures
```

Do not log:

``` text
Passwords
AWS secret keys
Session secrets
Full authentication tokens
```

QR tokens should also be treated carefully in logs because they are
student identifiers.

------------------------------------------------------------------------

# 36. CloudWatch

Use Amazon CloudWatch for:

``` text
Application logs
EC2 logs
Errors
Basic monitoring
```

Monitor especially:

``` text
5xx errors
Authentication failures
Database errors
S3 upload failures
Attendance endpoint failures
```

Do not send sensitive secrets to logs.

------------------------------------------------------------------------

# 37. AWS IAM

Use IAM to provide only required permissions.

The backend should have access to the S3 bucket/actions it actually
needs.

Avoid:

``` text
AdministratorAccess
```

for the application runtime.

Prefer limited permissions such as:

``` text
Read/write required S3 paths
```

------------------------------------------------------------------------

# 38. S3 Security

The S3 bucket should not be an unrestricted public write location.

Recommended:

``` text
Private bucket
       ↓
Backend-controlled access
```

If users need temporary access to a private file, use a controlled
pre-signed URL where appropriate.

------------------------------------------------------------------------

# 39. S3 File Upload Validation

Uploaded files should be validated for:

``` text
File type
File size
Expected extension
```

For example, event posters may allow:

``` text
JPEG
PNG
WEBP
```

Set a reasonable size limit.

Do not allow unlimited uploads.

------------------------------------------------------------------------

# 40. File Names

Do not trust the original filename.

Bad:

``` text
../../something
```

or:

``` text
my-secret-file.exe
```

Generate controlled S3 object keys:

``` text
events/{eventId}/poster.webp
```

The backend controls the path.

------------------------------------------------------------------------

# 41. Database Security

Production RDS should:

-   Use a strong database password.
-   Restrict network access.
-   Prefer private networking where practical.
-   Allow access from the backend only.
-   Use encrypted connections where configured.
-   Enable backups.
-   Avoid unnecessary public exposure.

The database should not be publicly accessible just because it makes
development easier.

------------------------------------------------------------------------

# 42. RDS Credentials

Never put database credentials into:

``` text
frontend/
```

Never commit them to Git.

Use environment variables or an appropriate AWS secret-management
approach.

Example:

``` text
DATABASE_URL
```

must remain server-side.

------------------------------------------------------------------------

# 43. Environment Variables

Example:

``` text
NODE_ENV=production

DATABASE_URL=...

AWS_REGION=...

S3_BUCKET_NAME=...

SESSION_SECRET=...
```

Do not commit real values.

Repository should contain:

``` text
.env.example
```

with placeholders.

------------------------------------------------------------------------

# 44. AWS Credentials

Never put:

``` text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

inside:

``` text
HTML
CSS
JavaScript
```

Do not expose them through browser network requests.

The frontend should communicate with the backend.

------------------------------------------------------------------------

# 45. Password Reset

If password reset is implemented later, it must use a temporary,
expiring reset token.

Do not implement password reset using:

``` text
security questions
```

or predictable tokens.

Password reset can remain outside the first MVP if not required.

------------------------------------------------------------------------

# 46. Account Enumeration

Authentication and account-related responses should avoid revealing
whether a specific account exists when that information is not required.

Prefer:

``` text
Invalid email or password.
```

instead of different messages that reveal account existence.

------------------------------------------------------------------------

# 47. Session Expiration

Authenticated sessions should expire.

The exact timeout depends on the authentication implementation.

Sensitive operations should require a valid active session.

Logout should invalidate the user's session/token according to the
chosen authentication architecture.

------------------------------------------------------------------------

# 48. CSRF

If CampusHub uses cookie-based authentication, protect state-changing
requests against CSRF.

Possible approach:

``` text
SameSite cookie policy
+
CSRF token where required
+
Origin/Referer validation where appropriate
```

If token-based authentication is used differently, assess CSRF
requirements accordingly.

Do not assume CSRF is irrelevant without considering the authentication
mechanism.

------------------------------------------------------------------------

# 49. Clickjacking

Configure appropriate security headers to prevent unauthorized framing
of CampusHub pages.

Helmet can help with this.

------------------------------------------------------------------------

# 50. Dependency Security

Keep dependencies updated.

Before adding a package:

``` text
Check necessity
Check maintenance
Check known vulnerabilities
Check license
```

Do not install large packages for trivial features.

------------------------------------------------------------------------

# 51. Dependency Auditing

Run package security checks periodically.

For npm:

``` bash
npm audit
```

Review vulnerabilities rather than blindly applying every automated
change.

------------------------------------------------------------------------

# 52. Database Migrations

Production database changes must use controlled migrations.

Do not manually modify production tables without recording the change.

Before destructive migrations:

``` text
Backup
+
Review
+
Human approval
```

------------------------------------------------------------------------

# 53. Backup

RDS automated backups should be enabled in production.

Important project data includes:

``` text
Users
Events
Registrations
Attendance
Notices
```

S3 objects should also have an appropriate recovery/retention strategy
for production.

------------------------------------------------------------------------

# 54. Attendance Integrity

Attendance is a sensitive record because it represents physical event
participation.

Therefore:

``` text
Only authorized scanners
        ↓
Can create attendance
```

Students should not be able to call the attendance endpoint themselves
and mark their own attendance.

------------------------------------------------------------------------

# 55. Attendance Modification

For the MVP:

``` text
Student
→ Cannot edit attendance

Club member
→ Can record attendance through scanner

Admin
→ May have controlled correction capability if implemented
```

If attendance correction is added later, it should be audited.

Do not silently overwrite attendance history.

------------------------------------------------------------------------

# 56. Export Security

Attendance export contains personal information.

Therefore:

``` text
GET /events/:eventId/attendance/export
```

must verify:

``` text
Authenticated user
+
Authorized club/event
```

Do not expose export URLs that anyone can access permanently.

------------------------------------------------------------------------

# 57. Student Data in Exports

Include only necessary fields:

``` text
Name
Roll No
Email
Registration Status
Attendance Status
Check-in Time
```

Do not include:

``` text
Password hash
QR token
Internal session data
Unnecessary database IDs
```

------------------------------------------------------------------------

# 58. Privacy by Design

Collect only information required by CampusHub.

Current student information:

``` text
Name
Roll No
Email
QR token
```

Do not add unnecessary personal information.

------------------------------------------------------------------------

# 59. API Data Minimization

An API should return only the fields required by that screen.

For example, an event list does not need to return:

``` text
All registrations
All attendance records
Internal database metadata
```

This reduces unnecessary data exposure.

------------------------------------------------------------------------

# 60. Security Testing

Test at minimum:

### Authentication

``` text
Valid login
Invalid login
Expired session
Logout
Unauthorized request
```

### Authorization

``` text
Student accessing another student's data
Club A accessing Club B event
Student calling club-only endpoint
Unauthorized scanner
```

### QR

``` text
Valid QR
Invalid QR
Unknown QR
Not registered
Already attended
Inactive event
Repeated requests
```

### Input

``` text
Invalid email
Invalid UUID
Negative capacity
Oversized input
Unexpected fields
Malicious text
```

------------------------------------------------------------------------

# 61. Security Test Matrix

  Test                                         Expected
  -------------------------------------------- -------------------------
  Student calls club event creation            403
  Student scans attendance                     403
  Club A scans Club B event                    403
  Invalid QR                                   Rejected
  Valid QR but not registered                  Rejected
  Valid QR + registered                        Attendance created
  Same QR twice                                Second request rejected
  Student views another student's attendance   Rejected
  Invalid login repeatedly                     Rate limited
  Frontend sends fake student ID               Ignored/not trusted
  Frontend sends fake check-in time            Ignored
  Public RDS connection attempt                Blocked

------------------------------------------------------------------------

# 62. Security Checklist Before Deployment

``` text
[ ] HTTPS enabled
[ ] Strong database password
[ ] RDS access restricted
[ ] S3 bucket secured
[ ] IAM permissions limited
[ ] No secrets in Git
[ ] .env ignored
[ ] Password hashing enabled
[ ] Authentication enabled
[ ] Role authorization enabled
[ ] Input validation enabled
[ ] Helmet configured
[ ] CORS restricted
[ ] Rate limiting enabled
[ ] Database unique constraints enabled
[ ] Error responses sanitized
[ ] Logging enabled
[ ] RDS backups enabled
[ ] Attendance authorization tested
[ ] Export authorization tested
```

------------------------------------------------------------------------

# 63. Things NOT Required for MVP

Do not introduce unnecessary security infrastructure such as:

``` text
Zero Trust enterprise platform
Service mesh
Kubernetes security stack
Dedicated SIEM
Complex key-management architecture
Multiple identity providers
Blockchain-based attendance
Biometric authentication
```

These are outside the project's current needs.

------------------------------------------------------------------------

# 64. Core Security Invariants

These must never be broken without explicit approval.

### 1.

``` text
Frontend is never trusted for authorization.
```

### 2.

``` text
Passwords are never stored in plaintext.
```

### 3.

``` text
AWS credentials never reach the browser.
```

### 4.

``` text
RDS is not directly accessible by the frontend.
```

### 5.

``` text
QR token identifies the student but does not itself authorize entry.
```

### 6.

``` text
Backend verifies event registration before attendance.
```

### 7.

``` text
Database prevents duplicate attendance.
```

### 8.

``` text
Database prevents duplicate registration.
```

### 9.

``` text
Only authorized club members can scan an event.
```

### 10.

``` text
Attendance timestamps come from the backend/database.
```

------------------------------------------------------------------------

# 65. Final Security Architecture

``` text
                     USER
                       |
                     HTTPS
                       |
                       v
                CampusHub Backend
                       |
          +------------+-------------+
          |            |             |
          v            v             v
   Authentication   Authorization   Validation
          |            |             |
          +------------+-------------+
                       |
                +------+------+
                |             |
                v             v
             RDS            S3
          PostgreSQL      Private Files
                |
                v
        Registrations
        Attendance
        Users
        Events
```

The security model should remain understandable:

``` text
Authenticate
→ Authorize
→ Validate
→ Execute
→ Log
```

------------------------------------------------------------------------

# 66. Final Rule

CampusHub security should be **strong where it matters and simple where
it does not**.

Protect the important things:

``` text
Accounts
Student data
QR identity
Event access
Attendance
Database
S3
AWS credentials
```

Do not create unnecessary security complexity that the project team
cannot understand or maintain.
