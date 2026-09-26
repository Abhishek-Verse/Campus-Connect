# 09 — Testing Strategy

## 1. Purpose

This document defines how to verify CampusHub before demonstration and release. Testing must confirm that the HTML5/CSS3/vanilla JavaScript frontend, Node.js/Express.js backend, Prisma data access, PostgreSQL on Amazon RDS, Amazon S3, and AWS deployment work together correctly.

Keep the approach understandable for a student project: use the project's existing test runner and scripts where available, plus focused manual checks. Do not add a new testing platform, framework, cloud service, or CI system solely for this document. Do not introduce React, Angular, Vue, Bootstrap, Tailwind, Java, or microservices.

## 2. Test principles

- Test the behavior a user or API client can observe, not framework internals.
- Use a separate local/test PostgreSQL database. Never run test cleanup against production RDS.
- Use test accounts and synthetic event data; never use real student credentials or attendance records.
- Keep test outcomes repeatable. Seed only the data required for a scenario and clean it up safely.
- Verify authorization on the server for every protected action. Hiding a button in the browser is not authorization.
- Exercise failure cases as well as successful flows, especially duplicate registration, expired/invalid QR, full events, and denied roles.
- Never commit credentials, tokens, production exports, or private S3 object URLs to test fixtures or logs.
- If a scenario depends on AWS, clearly identify whether it was verified against a test AWS environment or mocked/stubbed locally. Do not claim a live AWS check if it was not run.

## 3. Test levels and environments

| Level | What it verifies | Typical environment |
|---|---|---|
| Frontend checks | Forms, validation, accessibility basics, responsive layouts, API states | Browser against local app or test API |
| Backend/API checks | Routes, validation, response codes, role checks, business rules | Node.js/Express with test configuration |
| Database checks | Prisma queries, constraints, transactions, migrations | Dedicated test PostgreSQL database |
| Integration checks | Full browser/API/database flows across components | Local environment or isolated test deployment |
| AWS checks | EC2 configuration, IAM access, RDS connectivity, S3 permissions, CloudWatch visibility | Non-production AWS environment |

Prefer the repository's existing test tools. If none exist, begin with a small set of Node.js built-in tests or documented manual test cases, and add dependencies only when a concrete test need cannot be met simply. Use the browser's developer tools for frontend inspection. Do not make a particular test library, browser automation suite, container stack, or hosted test service mandatory.

## 4. Frontend testing (HTML5, CSS3, vanilla JavaScript)

Check each screen and important interaction in a current desktop browser and a narrow mobile viewport:

- Pages load with no JavaScript console errors, failed local assets, or broken navigation.
- HTML forms have labels, appropriate input types, required fields, and clear validation messages.
- Client-side validation improves usability, while the API remains authoritative and rejects invalid input independently.
- Buttons prevent accidental duplicate submissions while a request is in progress and become usable again after a recoverable error.
- Loading, empty, success, and error states are visible and understandable.
- API errors are displayed without exposing stack traces, SQL details, tokens, or internal server information.
- Login/logout behavior is clear; protected screens do not appear usable after the session expires.
- Student, club-member, and admin navigation reflects the signed-in role, while direct API access is still tested separately for authorization.
- QR scan screen reports success, duplicate attendance, invalid QR, network failure, and camera permission denial clearly. If a manual QR entry fallback is supported, verify it follows the same validation and authorization rules.
- Tables, event details, registration forms, and scanner controls remain usable at mobile widths and with keyboard navigation.
- Keyboard focus is visible, controls have meaningful names, and color is not the only way to communicate status.
- CSS remains plain CSS and HTML remains semantic; verify the page does not require a prohibited frontend framework or CSS library.

## 5. Backend and API testing

For each endpoint documented in `05-API-DOCUMENTATION.md`, verify the contract and relevant permission boundary:

- Correct HTTP method, route, status code, content type, and response shape.
- Valid request succeeds; missing, malformed, too-long, out-of-range, and unexpected values are rejected with a safe, consistent error response.
- Missing or invalid authentication is rejected for protected routes.
- Unknown route and unsupported method return a controlled response.
- Database or S3 failures return a safe server error and do not expose implementation details.
- List endpoints enforce pagination and do not return records outside the requesting user's allowed scope.
- Request validation and normalization are performed on the server; database access uses Prisma safely.
- State-changing requests cannot be repeated to bypass business rules.
- CORS accepts only configured frontend origins; production settings do not use an unrestricted wildcard with credentials.
- Logs support diagnosis with a request identifier where available but omit passwords, authorization headers, session tokens, QR secrets, and sensitive student data.

## 6. Authentication and role-based access control

Use at least one test account for each role defined by the product (for example, student, authorized club member, and admin). Verify:

| Scenario | Expected result |
|---|---|
| Correct credentials | User signs in and receives the configured session/token safely |
| Incorrect credentials | Generic authentication failure; no account or password details disclosed |
| Missing, malformed, expired, or tampered credential | Protected request is rejected |
| Logout/session invalidation | Subsequent protected requests cannot reuse the logged-out session where the chosen auth design supports invalidation |
| Student calls club/admin operation | Forbidden response; no data mutation |
| Club member accesses another club's event/attendance | Forbidden response unless explicitly allowed by product rules |
| Admin-only operation by non-admin | Forbidden response |
| Direct URL/API request bypassing hidden UI | Backend still enforces role and ownership checks |

Document the authentication mechanism actually selected in `BACKEND.md` and test its real expiry, cookie or token settings, and CSRF protections as applicable. Do not invent a second authentication system for tests.

## 7. Event registration and capacity

Test the registration lifecycle against the documented product rules:

1. A student registers for an open event and receives a clear confirmation.
2. The same student attempts to register again; the second attempt is rejected or returns the documented idempotent result, and only one registration exists.
3. Registration for a closed, cancelled, or already-ended event is rejected as specified.
4. Registration for an event at capacity is rejected without increasing the attendee count.
5. Two near-simultaneous registrations for the last seat do not exceed capacity. Verify the result using the transaction/locking strategy implemented by the backend and database.
6. A user cannot register another student by changing an identifier in the request.
7. Registration cancellation, if supported, updates capacity and status consistently and cannot be abused after the allowed cutoff.
8. Event details show the same registration status and capacity as the API/database.

## 8. Universal QR scanning and attendance

Test both QR creation/display and scan processing. Universal QR identifies the authenticated student; the event-specific validity and the scanner's authority must still be checked by the backend.

- Correct student's valid QR scanned by an authorized scanner for an eligible event records attendance once.
- Scanning the same QR again does not create duplicate attendance and returns the documented duplicate/already-attended result.
- Invalid, altered, expired, revoked, or unknown QR is rejected without identifying another student or creating attendance.
- QR belonging to a different student cannot be used to mark attendance for the signed-in student when the flow requires identity binding.
- A student or unauthorized club member cannot call the scan endpoint to mark attendance.
- Scanner cannot record attendance for an event or club outside its permitted scope.
- A student without an eligible registration is rejected if registration is required by the rules.
- Concurrent duplicate scans produce exactly one attendance record.
- Network timeout/retry does not result in duplicate attendance; the UI clearly communicates an uncertain result and lets the operator safely check/retry.
- QR payloads do not contain unnecessary personal information or reusable credentials; secrets are not written to logs.
- Test camera permission denied, unreadable QR, and manual fallback (if supported) on the frontend.

## 9. Database, Prisma, and migration checks

Run database tests only against a disposable test database. Verify:

- Prisma schema matches the documented PostgreSQL data model and migrations apply from a clean database.
- Required fields reject null/invalid values; foreign keys prevent orphan registrations, attendance, and event records.
- Unique constraints prevent duplicate registration and duplicate attendance according to the selected keys.
- Capacity and state transitions remain correct under concurrent requests and transaction rollback.
- Deleting or archiving related records follows the documented referential behavior; do not accidentally cascade-delete attendance history.
- Date/time values, status enums or checks, and indexes used by QR/registration lookup behave as expected.
- A failed multi-step transaction leaves no partial registration/attendance state.
- Migration rollback or recovery steps are documented where supported; never test rollback on production data.
- Seed scripts are repeatable and do not include real personal information.

Constraints in the database are a final integrity boundary. Do not rely solely on frontend checks or a prior read in application code to prevent duplicates or over-capacity writes.

## 10. Security testing

Use the scenarios in `07-SECURITY.md` as the source of truth. At minimum, verify:

- Injection-like input is treated as data; Prisma queries do not concatenate untrusted SQL.
- Stored and reflected text is rendered safely; user content cannot execute script in another user's browser.
- Authentication and role checks resist direct API requests and identifier changes (IDOR-style access).
- Login and QR scan endpoints have reasonable abuse/rate protections if configured.
- Cookies, if used, have appropriate Secure, HttpOnly, and SameSite attributes in HTTPS deployment; token storage follows the documented design.
- CSRF protections are verified when cookie-based authentication is used.
- HTTPS is enforced in the deployed environment; security headers and CORS match the deployment configuration.
- Secrets are loaded from the server environment/configuration and never placed in frontend files, source control, logs, or error responses.
- Error responses and exports do not leak password hashes, credentials, unrelated student data, or internal identifiers beyond product needs.
- Dependency/security checks use already available project tooling where practical; do not add an elaborate scanning platform as a requirement.

Use synthetic payloads and accounts. Do not perform destructive, load, or penetration tests against production systems.

## 11. S3 upload and file access testing

If CampusHub uploads event posters, club logos, or optional tickets to S3, verify in a non-production bucket:

- Authorized role can upload an allowed file type within the configured size limit.
- Unsupported type, oversized file, malformed upload, and missing required file are rejected safely.
- Object key is generated/controlled by the backend; user-supplied paths cannot overwrite another user's object.
- Upload failure does not leave a database row claiming a usable file exists. A partial S3/database operation is handled or cleaned up according to the implementation.
- Private files remain private and are available only through the intended authorization flow (for example, a short-lived signed URL if that is the documented design).
- Public access settings and bucket policy match the intended public/private use; IAM permits only required actions on the required bucket/prefix.
- Deleted/replaced assets behave consistently in database records and S3.
- No AWS access keys are shipped to the browser. The server/EC2 role is used for AWS access where configured.
- CloudWatch/application logs do not expose signed URLs or sensitive upload metadata.

## 12. Export testing

For attendance or registration exports (CSV/Excel only as specified by the project), verify:

- Authorized club members can export only their permitted event/club data; students and unrelated clubs are denied.
- Exported row count, names/identifiers, event, attendance status, and timestamps match the authorized source records.
- Empty data produces a valid, clearly empty export rather than an error or unrelated data.
- Special characters, commas, quotes, and line breaks are escaped correctly for the selected format.
- Spreadsheet formula-like values from user-controlled fields are neutralized where relevant to prevent formula injection.
- File name, format, content type, and download behavior are correct; large exports are bounded or paginated as designed.
- Errors do not return partial data or include server paths, credentials, or other clubs' records.

## 13. Integration test scenarios

Run these end-to-end scenarios with a fresh test dataset:

### Student journey

1. Student signs in.
2. Student browses an available event and views accurate details/capacity.
3. Student registers once and sees confirmation.
4. Student's universal QR is shown or retrieved through the documented flow.
5. Authorized club scanner scans the QR; attendance appears in the correct event dashboard.
6. Re-scan is reported as duplicate without changing counts.
7. Student signs out and protected data is no longer accessible.

### Club organizer journey

1. Authorized club member signs in and creates or manages an event within their club scope.
2. Event is listed for eligible students and registration respects capacity.
3. Organizer scans registered students and views accurate attendance.
4. Organizer exports only their event's records.
5. Organizer attempts to access another club's event/export and is denied.

### Failure and recovery journey

1. Simulate a database or API failure during a user action.
2. Confirm the frontend shows a recoverable error without claiming the action succeeded.
3. Restore service and retry/check status; no duplicate registration or attendance is created.

## 14. AWS deployment checks (EC2, IAM, RDS, S3, CloudWatch)

Use a non-production deployment and a checklist for each release:

- EC2 application process starts after deployment/restart, serves the intended frontend/API routes, and reports a healthy status using the project's configured method.
- Production frontend points to the intended HTTPS API origin; no localhost URLs, development credentials, or test data remain.
- Environment configuration is present without printing secret values. Application errors do not reveal stack traces to users.
- EC2 security group exposes only required inbound ports; RDS is not publicly reachable and accepts database traffic only from the application environment as intended.
- EC2 IAM role has only required S3/CloudWatch permissions and no unnecessary broad administrative access. No long-lived AWS credentials are embedded in code or frontend assets.
- Application connects to the intended RDS PostgreSQL database, applies the planned Prisma migration process, and uses TLS/network controls as configured.
- S3 upload/download behavior matches the intended bucket privacy and IAM policy.
- CloudWatch receives application/system logs and configured health/error signals; verify a sample success and controlled failure can be found without sensitive data.
- Restart the EC2 application and confirm it recovers without manual local-only state.
- Verify backup/restore responsibility and deployment rollback/recovery steps from `08-AWS-DEPLOYMENT.md` before a production release.
- Confirm HTTPS, domain, CORS, and security-header settings for the deployed site.

Do not run destructive migration, restore, or load checks on production. AWS checks must use a test environment unless a specific production-safe read-only check is intended.

## 15. Core test case checklist

| ID | Area | Test | Pass condition |
|---|---|---|---|
| FE-01 | Frontend | Submit invalid required form fields | Clear errors; no invalid API mutation |
| FE-02 | Frontend | API unavailable during submit | Safe error shown; no false success |
| AUTH-01 | Authentication | Sign in with valid and invalid credentials | Valid user signs in; invalid user receives generic failure |
| RBAC-01 | Authorization | Student calls admin-only API | Denied; no state changes |
| REG-01 | Registration | Register once, then repeat | One registration maximum |
| REG-02 | Capacity | Concurrent requests compete for last seat | Capacity is never exceeded |
| QR-01 | QR/attendance | Authorized scan of valid QR | One correct attendance record created |
| QR-02 | QR/attendance | Repeat scan | Duplicate is reported; count unchanged |
| QR-03 | QR/attendance | Invalid or unauthorized scan | Denied; no attendance mutation or data leak |
| DB-01 | Database | Insert duplicate registration/attendance | PostgreSQL constraint rejects duplicate |
| SEC-01 | Security | Submit script/injection-like input | No script execution or query manipulation |
| S3-01 | Upload | Upload allowed and disallowed files | Allowed upload follows policy; invalid upload rejected |
| EXP-01 | Export | Export as authorized and unauthorized roles | Correct scoped data for authorized user; denied otherwise |
| INT-01 | Integration | Complete student registration-to-attendance journey | UI, API, Prisma, and database agree throughout |
| AWS-01 | Deployment | Restart app and check RDS/S3/CloudWatch behavior | App recovers; least-privilege access and logs work |

Record each run with date, environment, build/version, tester, test case IDs, pass/fail, and defect reference. Do not include secrets or real student data in the record.

## 16. Viva-friendly acceptance criteria

CampusHub is ready for a project demonstration when all of these statements can be shown and explained:

1. The frontend is built with HTML5, CSS3, and vanilla JavaScript, and communicates with the backend through the documented API.
2. The Node.js/Express.js backend validates requests and enforces authentication, role permissions, and ownership on the server.
3. Prisma accesses PostgreSQL/RDS, and database constraints prevent duplicate registrations and attendance records.
4. Event capacity is not exceeded, including when requests happen at nearly the same time.
5. The universal QR scan maps to the correct student, and only an authorized scanner can record attendance for an allowed event.
6. Invalid, expired, unauthorized, and repeated QR scans do not create incorrect records or expose sensitive data.
7. S3 files follow the configured access policy; AWS credentials are not exposed to the browser.
8. Attendance exports contain only data the requesting organizer is allowed to access and safely handle user-provided text.
9. The interface has understandable loading, empty, success, and error states and works at mobile widths.
10. The deployed EC2 application reaches the intended RDS and S3 resources using least-privilege IAM, and CloudWatch provides useful logs without secrets.
11. Core scenarios have recorded pass/fail results in a test environment, and known failures are documented rather than hidden.
12. The team can explain the path of one request: browser → Express route and validation → service/business rule → Prisma/PostgreSQL or S3 → safe API response → browser update.

## 17. Release decision

Release only when all critical authentication, authorization, registration, QR attendance, database integrity, upload privacy, and export-scope cases pass. Document lower-priority failures with their impact and owner. A passing test run is evidence for the tested build and environment; it does not prove untested AWS settings or future code changes are safe.

## 18. Related documents

- `03-ARCHITECTURE.md` — component boundaries and request flow
- `04-DATABASE-DESIGN.md` — PostgreSQL entities, relationships, and constraints
- `05-API-DOCUMENTATION.md` — endpoint contract and response codes
- `07-SECURITY.md` — security requirements and threat controls
- `08-AWS-DEPLOYMENT.md` — deployment and AWS configuration
- `BACKEND.md` — backend implementation rules
- `AGENTS.md` — repository-wide instructions for AI coding agents
