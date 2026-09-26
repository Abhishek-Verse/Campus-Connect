# 10 — Future Scope

## 1. Purpose

This document records possible CampusHub improvements after the core project is implemented, tested, and demonstrated. It helps the team distinguish the agreed MVP from optional later work and prevents future ideas from silently changing the current architecture.

Future enhancements must continue to use the approved foundation:

- Frontend: HTML5, CSS3, and vanilla JavaScript
- Backend: Node.js and Express.js
- Data access: Prisma
- Database: PostgreSQL on Amazon RDS
- File storage: Amazon S3
- Hosting: Amazon EC2
- Permissions: AWS IAM
- Logs and monitoring: Amazon CloudWatch

Do not introduce React, Angular, Vue, Bootstrap, Tailwind, Java, microservices, or additional AWS services unless the project owner explicitly approves an architecture change.

## 2. MVP boundary

The MVP should first deliver a dependable end-to-end campus events workflow:

1. Users authenticate and see features allowed for their role.
2. Club organizers manage events within their club's permissions.
3. Students discover events and register within event rules and capacity.
4. An authorized scanner validates a student's universal QR and records attendance once.
5. Organizers review attendance and export only the data they are allowed to access.
6. Approved images or ticket files use S3 under the documented access policy.
7. The application runs on EC2 and accesses RDS/S3 through controlled IAM permissions, with useful CloudWatch logs.

Do not delay these core outcomes for optional enhancements below. Each MVP requirement and acceptance criterion is defined in the relevant PRD, API, security, deployment, and testing documents.

## 3. Candidate enhancements

These are ideas, not commitments. Confirm product value, privacy impact, ownership, and effort before adding them to a release plan.

### Priority A — Improve the core experience

- **Waitlist:** Let students join a waitlist when an event reaches capacity; offer newly available seats using a clearly defined expiry window.
- **Registration cancellation:** Allow cancellation before the configured cutoff and update capacity safely.
- **Event reminders:** Send reminders for registered events using a delivery method selected by the project owner and configured with suitable consent and privacy controls.
- **Better event discovery:** Add filters for date, category, club, venue, and availability, with server-side pagination.
- **Organizer event reports:** Add simple summaries such as registrations, attendance count, and attendance rate with role-scoped access.
- **Accessibility improvements:** Continue keyboard, screen reader, contrast, and mobile usability checks across all screens.
- **QR operational fallback:** Improve safe manual lookup or entry for camera/device problems, while keeping authorization and audit rules identical to QR scans.

### Priority B — Operational improvements

- **Administrative audit history:** Record important event, role, registration, and attendance changes with actor, time, and action. Define retention and visibility before storing additional personal data.
- **Safer bulk organizer actions:** Support limited bulk operations only when each row is validated, authorized, and reported clearly.
- **Improved observability:** Add a small number of useful CloudWatch metrics/alarms for application availability, errors, and critical AWS dependency failures when operational ownership exists.
- **Backup recovery practice:** Schedule and document a test restore process for RDS data and verify recovery steps without using production for destructive testing.
- **Deployment repeatability:** Document a consistent EC2 deployment and rollback procedure using the existing AWS setup; do not add a deployment platform without approval.
- **File lifecycle management:** Define cleanup for replaced or abandoned S3 objects and verify database references remain accurate.

### Priority C — Consider only with clear demand

- **Waitlist analytics and event insights:** Add richer reporting only if the basic scoped reports prove insufficient.
- **Calendar download:** Allow a student to download an event in a standard calendar format without exposing another user's registration information.
- **Multiple campus or venue support:** Add only if CampusHub must serve more than one campus and the data model's ownership rules are reviewed first.
- **More configurable roles:** Add roles only when responsibilities require them; keep permission rules explicit and testable.
- **Offline scanner workflow:** Consider only after documenting device security, stale data, conflict resolution, and attendance audit requirements. Offline records must not be treated as verified until reconciled by the backend.

## 4. Ideas outside the current project scope

The following are not part of the current MVP and need explicit approval, a documented reason, and an impact review before implementation:

- Replacing the frontend or backend stack or adding a frontend framework/CSS framework.
- Splitting the application into microservices or adding a message broker, container orchestration, or a service mesh.
- Adding new cloud products or third-party services for notifications, analytics, identity, or file processing.
- Payments, public ticket sales, or financial handling.
- Native mobile applications.
- Biometric identification, facial recognition, location tracking, or continuous student tracking.
- Public social feeds, direct messaging, or features that expose student data beyond the event workflow.
- Artificial-intelligence features that process student profiles, attendance, or other personal information.

These ideas may be reconsidered if project requirements change, but they must not be assumed or introduced by an implementation agent.

## 5. Prioritization method

Before accepting a future feature, answer:

1. Which student, organizer, or administrator problem does it solve?
2. Is it required for the MVP, a course demonstration, or a later release?
3. Which existing screens, API endpoints, database records, and roles does it affect?
4. Does it introduce personal data, security, consent, retention, or accessibility concerns?
5. Can it fit the approved stack and AWS setup without a new service or major redesign?
6. What test cases and measurable acceptance criteria will demonstrate it works?
7. Who will maintain and operate it after the project demonstration?

Prefer features that improve reliability, privacy, accessibility, and the main registration-to-attendance flow before adding breadth.

## 6. Change control

- Treat this document as a backlog of possibilities, not permission to implement them.
- The project owner chooses which candidates become approved requirements.
- For an approved feature, update the PRD and the affected API, database, UI/UX, security, deployment, and testing documents before or alongside implementation.
- If a feature changes the stack, AWS footprint, data collection, authentication, or authorization model, document the decision and its trade-offs explicitly.
- Preserve existing registration, capacity, QR identity, attendance uniqueness, role scope, and privacy guarantees unless the owner approves a defined change.
- Keep future-scope items out of the MVP acceptance criteria until they are formally approved.

## 7. Definition of ready for a future feature

A candidate is ready to enter implementation when it has:

- An approved user need and clear scope.
- A named owner and priority.
- Written behavior and acceptance criteria.
- Identified API, UI, database, security, and AWS impacts.
- A privacy and role-access review where user or attendance data is involved.
- A testing plan covering success, denial, and failure cases.
- Confirmation that the implementation stays within the approved architecture, or an explicit approval for the architecture change.

## 8. Related documents

- `01-PRD.md` — approved product requirements and MVP scope
- `03-ARCHITECTURE.md` — approved component boundaries
- `04-DATABASE-DESIGN.md` — data model and integrity rules
- `05-API-DOCUMENTATION.md` — API contract
- `06-UI-UX-SPECIFICATION.md` — interface behavior and visual rules
- `07-SECURITY.md` — security requirements
- `08-AWS-DEPLOYMENT.md` — AWS deployment approach
- `09-TESTING.md` — verification and acceptance criteria
- `AGENTS.md` and `BACKEND.md` — agent and backend implementation rules
