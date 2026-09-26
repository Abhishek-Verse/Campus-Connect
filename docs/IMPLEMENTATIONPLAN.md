# 11 — AI Agent Implementation Plan

## 1. Purpose

This plan tells AI coding agents how to build CampusHub in a safe, understandable sequence. Agents must inspect the real repository, implement one coherent milestone at a time, and verify each milestone against the project requirements. They must not invent files, endpoints, database fields, scripts, permissions, or product behavior and present them as existing facts.

This plan guides implementation; it does not approve new features or architecture changes.

## 2. Approved technology boundaries

- Frontend: HTML5, CSS3, vanilla JavaScript
- Backend: Node.js and Express.js
- Data access: Prisma
- Database: PostgreSQL on Amazon RDS
- File storage: Amazon S3
- Hosting: Amazon EC2
- AWS permissions: IAM
- Logs and monitoring: Amazon CloudWatch

Do not introduce React, Angular, Vue, Bootstrap, Tailwind, Java, microservices, or additional infrastructure/services without explicit project-owner approval. Use existing repository tools and conventions where possible. Do not add testing platforms, build systems, or dependencies without a concrete need and a documented reason.

## 3. Sources of truth

Before changing code, inspect the actual repository and read the relevant project documents. Use this precedence:

1. Current explicit project-owner instruction.
2. Existing implementation and checked-in configuration, for facts about what currently exists.
3. Approved product and design documents for intended behavior: `01-PRD.md`, `02-SRS.md`, and `06-UI-UX-SPECIFICATION.md` / `DESIGN.md`.
4. Architecture, data, API, security, deployment, testing, and agent documents: `03-ARCHITECTURE.md`, `04-DATABASE-DESIGN.md`, `05-API-DOCUMENTATION.md`, `07-SECURITY.md`, `08-AWS-DEPLOYMENT.md`, `09-TESTING.md`, `AGENTS.md`, `BACKEND.md`, and this plan.

If two sources conflict, do not silently choose whichever is easiest. Identify the exact conflict and its impact. Continue independent work that does not depend on the answer. Ask the project owner when the conflict changes user-visible behavior, data integrity, security, architecture, or deployment. Record the agreed decision in the relevant document.

## 4. Anti-hallucination rules

Agents must:

- Inspect the repository tree, relevant files, package manifests, Prisma schema/migrations, and existing scripts before describing or editing them.
- Distinguish confirmed facts from assumptions. Never say a command, endpoint, environment variable, file, AWS resource, or feature exists unless it was found in the repository or approved documentation.
- Follow existing naming, module, formatting, and error-handling patterns when they are suitable; do not create a second pattern without a reason.
- Use the documented API contract and data model. If an endpoint, field, role permission, validation rule, QR behavior, or error response is unspecified, do not invent a permanent contract. Surface the gap and continue unrelated work.
- Avoid placeholder code that looks complete. Clearly label any scaffold or TODO and state what prevents completion.
- Never fabricate successful test results, deployment status, credentials, AWS access, or files that were not inspected.
- Avoid broad rewrites. Change only files needed for the approved task and preserve unrelated work in the working tree.
- Never use production data or credentials for local tests, seeds, screenshots, or examples.
- Do not place secrets in frontend assets, source control, logs, documentation examples, or test output.

## 5. Standard agent loop

For every milestone, use this cycle:

1. **Orient:** Inspect repository status and structure. Read applicable `AGENTS.md` files and the specific source/docs involved.
2. **State the task:** Summarize the requested behavior, relevant existing files, and acceptance checks in a short plan.
3. **Find the contract:** Identify the API, database, security, and UI rules that govern the change. Note missing or conflicting requirements.
4. **Implement narrowly:** Make the smallest complete change that satisfies the milestone. Keep frontend, backend, and persistence responsibilities in their documented layers.
5. **Verify:** Run only the relevant existing checks or those explicitly required by the task. If a check cannot run, explain why; do not imply it passed.
6. **Review:** Inspect the final diff for unrelated changes, secrets, inconsistent docs, incomplete error paths, and permission/data-integrity gaps.
7. **Report:** List files changed, behavior delivered, checks actually run and their result, known limitations, and any decision needed from the owner.

Do not start the next dependent milestone while the current milestone has unresolved failures that invalidate its acceptance criteria. Independent tasks may proceed if they do not rely on the failed area.

## 6. Implementation sequence and gates

### Phase 0 — Repository audit and plan alignment

**Work:** Inspect the repository, existing docs, source folders, package scripts, environment examples, Prisma schema, migrations, and current test setup. Confirm the actual branch/working tree and do not discard user changes.

**Gate:** Produce a concise inventory of what exists, what is missing, and any conflicts between code and docs. Do not generate a fictional project tree or make a large scaffold before confirming the repository's structure.

### Phase 1 — Minimal project foundation

**Work:** Establish or align the existing frontend and Express backend structure, local configuration example, safe error handling, and health/status behavior only as specified. Keep HTML/CSS/vanilla JS static and straightforward.

**Gate:** Frontend can reach the configured local API; server starts using verified repository commands; configuration values are documented without real secrets. If scripts or folder structure do not exist, propose the minimal needed structure and document it as new.

### Phase 2 — Data model and Prisma migrations

**Work:** Implement the approved PostgreSQL model for users, clubs/memberships, venues, events, registrations, attendance, notices, and any other explicitly approved entities. Add the agreed relations, uniqueness constraints, indexes, and migrations.

**Gate:** A clean test database can receive migrations; Prisma schema and database constraints enforce documented integrity rules; seed data is synthetic and repeatable. Ask before changing the meaning of core relationships or destructive data behavior.

### Phase 3 — Authentication and authorization

**Work:** Implement the authentication mechanism selected in `BACKEND.md` and server-side role/ownership middleware. Protect routes by default where appropriate and ensure browser visibility is not the only permission check.

**Gate:** Valid/invalid authentication behavior, expiry/logout behavior, role denial, and ownership boundaries match the approved docs. Do not select JWT vs session/cookie behavior, change credential policy, or create roles if the docs leave those decisions unresolved; request a decision while continuing unrelated work.

### Phase 4 — API and business rules

**Work:** Build documented endpoints in small groups, keeping route/controller concerns separate from business rules and Prisma access according to the existing backend pattern. Implement safe validation and consistent responses.

Recommended order:

1. Authentication and current-user profile.
2. Event and club read operations.
3. Organizer event management.
4. Registration and cancellation if specified.
5. QR validation and attendance recording.
6. Attendance reporting and exports.
7. Notices and optional file/ticket endpoints if in approved scope.

**Gate:** Each endpoint matches the documented method, request/response shape, status, validation, authorization, and failure behavior. If the API doc is incomplete, mark the contract gap rather than guessing.

### Phase 5 — Frontend journeys

**Work:** Implement the approved screens with semantic HTML5, plain CSS3, and vanilla JavaScript. Add a small API client using the real API contract. Provide loading, empty, success, validation, error, and denied states.

Recommended order:

1. Sign-in and role-aware navigation.
2. Student event list and details.
3. Registration confirmation and student QR display.
4. Organizer event management.
5. Scanner and attendance results.
6. Attendance dashboard and export controls.
7. Profile, notices, and optional file flows.

**Gate:** Each screen uses real API behavior, handles failure without false success, supports keyboard basics and narrow screens, and follows `DESIGN.md` / `06-UI-UX-SPECIFICATION.md`. Do not substitute static mock data for a working integration unless the task is explicitly a prototype; label prototypes clearly.

### Phase 6 — S3 uploads and export flows

**Work:** Implement only the approved upload and export scope. Use backend-controlled object keys, server-side authorization, configured limits, and the documented access model. Keep AWS credentials out of the browser.

**Gate:** Allowed uploads/exports succeed in a test environment; invalid inputs and unauthorized access are rejected; partial failures do not leave misleading database state; exported data is scoped and safely encoded.

### Phase 7 — Integration and security hardening

**Work:** Verify complete student and organizer journeys across frontend, API, Prisma, PostgreSQL, and S3 where relevant. Address authentication, role/ownership, duplicate operations, capacity races, QR replay/identity, safe errors, CORS, and privacy requirements.

**Gate:** Critical cases in `09-TESTING.md` pass in the available test environment. Record the environment and actual results. A test that was not run must remain marked unverified.

### Phase 8 — AWS deployment

**Work:** Follow `08-AWS-DEPLOYMENT.md` for EC2, RDS, S3, IAM, and CloudWatch. Configure least privilege, non-public database access, HTTPS, production frontend/API origins, and safe logs.

**Gate:** Deploy only with explicit project-owner authorization for the target environment. Verify the deployment using the release checks in `08-AWS-DEPLOYMENT.md` and `09-TESTING.md`. Never claim deployment succeeded without direct evidence.

### Phase 9 — Release handoff

**Work:** Review the source diff, docs, migrations, configuration examples, test results, known gaps, and operational instructions.

**Gate:** Handoff includes how to start and use the app based on verified commands, what is implemented, what remains, test/deployment evidence, and any owner decisions required. Update README and affected docs to match actual behavior.

## 7. Definition of done for a milestone

A milestone is done only when:

- The approved user behavior is implemented in the intended layer.
- Authentication, authorization, ownership, and data integrity are enforced server-side where required.
- Success, validation, denial, and failure behavior are considered.
- Relevant existing checks have been run, or the inability to run them is reported accurately.
- Documentation is updated if the contract, configuration, workflow, or command changed.
- No unrelated files, secrets, unsupported technology, or unapproved scope have been added.
- The agent provides a brief evidence-based handoff.

## 8. Handling missing requirements

When information is missing:

1. Identify the exact unknown and which implementation decisions depend on it.
2. Check existing code and all relevant project documents before asking.
3. Continue work that does not depend on the unknown.
4. For a reversible, low-impact detail, follow the existing pattern and record the choice for review.
5. For authentication, permission boundaries, QR identity/validity, data retention, destructive migrations, AWS exposure, or user-visible contract changes, pause only the dependent work and ask the project owner.

Do not hide an assumption in code and let it become an accidental product requirement.

## 9. Agent completion report format

At the end of each milestone, report:

```text
Milestone:
Implemented:
Files changed:
Checks run and results:
Not verified / known limitations:
Decision needed (if any):
```

Keep this report factual and concise. Mention exact commands only if they were found in the repository or actually run. Never report a check, test, AWS access, or deployment as successful without evidence.

## 10. Related documents

- `README.md` — project overview and verified usage guidance
- `AGENTS.md` — global rules for coding agents
- `BACKEND.md` — backend and integration conventions
- `03-ARCHITECTURE.md` — system boundaries
- `04-DATABASE-DESIGN.md` — data model and constraints
- `05-API-DOCUMENTATION.md` — endpoint contracts
- `06-UI-UX-SPECIFICATION.md` and `DESIGN.md` — interface and visual requirements
- `07-SECURITY.md` — security requirements
- `08-AWS-DEPLOYMENT.md` — deployment approach
- `09-TESTING.md` — test coverage and acceptance criteria
- `10-FUTURE-SCOPE.md` — optional work and change control
