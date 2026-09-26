# CampusHub --- AGENTS.md

**Purpose:** This file defines the rules, boundaries, workflow, design
standards, and decision-making behavior for any AI agent working on
CampusHub.

**Project:** CampusHub\
**Architecture:** Modular monolith\
**Frontend:** HTML5, CSS3, JavaScript ES6+, Bootstrap 5 or Tailwind CSS\
**Backend:** Node.js + Express.js\
**Database:** PostgreSQL on Amazon RDS\
**Storage:** Amazon S3\
**Deployment:** AWS EC2 + RDS + S3 + IAM + CloudWatch

------------------------------------------------------------------------

# 1. Most Important Rule

## The human is in control.

AI agents are assistants, not project owners.

The agent must:

-   Follow the existing project requirements.
-   Follow the existing architecture.
-   Ask before making important decisions that were not explicitly
    specified.
-   Never silently change the project's scope.
-   Never replace an existing technology or architecture decision
    without asking.
-   Never introduce unnecessary complexity.
-   Explain important trade-offs when a decision is required.
-   Keep changes small, understandable, and reversible.
-   Stop and ask when requirements conflict.

Do not assume:

> "This is probably what the developer wants."

Instead ask:

> "There are two reasonable approaches. Which one do you want?"

------------------------------------------------------------------------

# 2. Read the Project Documentation First

Before making meaningful changes, read the relevant documentation.

Priority:

``` text
docs/
├── 01-PRD.md
├── 02-SRS.md
├── 03-ARCHITECTURE.md
├── 04-DATABASE-DESIGN.md
├── 05-API-DOCUMENTATION.md
└── AGENTS.md
```

For a task involving:

``` text
Database
→ read DATABASE-DESIGN.md

API
→ read API-DOCUMENTATION.md

Architecture
→ read ARCHITECTURE.md

Requirements
→ read PRD.md and SRS.md

Frontend/UI
→ read PRD.md, SRS.md, and this AGENTS.md
```

Do not start implementing from a single sentence if the existing
documentation contains relevant requirements.

------------------------------------------------------------------------

# 3. Never Invent Requirements

If something is not specified, do not automatically add it just because
it is common in other applications.

Examples of things that should NOT be added without approval:

``` text
Chat system
Social feed
AI chatbot
Complex notification center
Gamification
Payment system
Microservices
Kubernetes
Redis
Kafka
GraphQL
Real-time WebSockets
Complex analytics
Multi-tenant architecture
Advanced recommendation systems
```

If a feature is useful but outside the current scope:

``` text
Mention it as an optional suggestion.
Do not implement it automatically.
```

------------------------------------------------------------------------

# 4. Ask Before Important Decisions

The agent should ask the user before:

-   Changing the database structure significantly.
-   Changing the AWS architecture.
-   Replacing a chosen technology.
-   Adding a new external service.
-   Adding a major feature.
-   Changing authentication architecture.
-   Changing the Universal QR architecture.
-   Introducing a new dependency that affects the architecture.
-   Making destructive database changes.
-   Deleting existing functionality.
-   Changing project-wide UI style.
-   Changing the navigation structure.
-   Making a decision with significant security implications.
-   Making a decision that could substantially increase cost.
-   Making a decision that could substantially increase implementation
    complexity.

Do not ask for approval for every tiny implementation detail.

The agent should make normal low-risk implementation decisions
independently.

------------------------------------------------------------------------

# 5. Ask Questions in a Useful Way

Do not ask vague questions such as:

> "What do you want?"

Instead provide the decision clearly.

Bad:

``` text
What database approach should I use?
```

Better:

``` text
For attendance, there are two reasonable options:

A. Store only PRESENT records and calculate ABSENT later.
B. Create an attendance record for every registered student.

The current database design points toward A because it keeps the MVP simpler.

Do you want A or B?
```

When possible:

-   Explain the issue.
-   Give 2--3 reasonable options.
-   State the current project-compatible option.
-   Let the human choose.

------------------------------------------------------------------------

# 6. Do Not Over-Engineer

CampusHub is a student project.

The implementation should be:

``` text
Simple
Understandable
Maintainable
Secure enough
Easy to demonstrate
Easy to explain in viva
Easy to deploy
```

Prefer:

``` text
Modular monolith
```

over:

``` text
Microservices
```

Prefer:

``` text
REST
```

over unnecessary API complexity.

Prefer:

``` text
PostgreSQL
```

over adding multiple databases.

Prefer:

``` text
RDS + S3 + EC2
```

over adding many AWS services without a real requirement.

------------------------------------------------------------------------

# 7. Do Not Add AI Slop

The UI must not look like a generic AI-generated SaaS template.

Avoid:

-   Excessive gradients.
-   Purple/blue AI-style gradients everywhere.
-   Glowing backgrounds.
-   Huge decorative blobs.
-   Random glassmorphism.
-   Excessive glass cards.
-   Neon effects.
-   Overuse of shadows.
-   Excessive rounded corners.
-   Every element inside a rounded card.
-   Pill-shaped buttons everywhere.
-   Huge hero sections for simple dashboard pages.
-   Fake dashboard statistics.
-   Decorative elements with no functional purpose.
-   Excessive icons.
-   Emoji used as primary UI elements.
-   Random floating shapes.
-   Unnecessary animations.
-   "AI startup" visual language.
-   Visually noisy backgrounds.
-   Overly dense card grids.
-   Generic copy such as "Unlock your potential" or "Empower your
    journey."

The application should look like a **real professional college
product**, not an AI-generated landing page.

------------------------------------------------------------------------

# 8. Visual Design Direction

## Default Background

Use a primarily:

``` text
White
```

or very light neutral background.

Example:

``` text
#FFFFFF
#F8FAFC
#F5F7FA
```

Do not make the entire interface dark unless explicitly requested.

------------------------------------------------------------------------

# 9. Use One Strong Contrast Color

The interface should have a strong primary/brand color that contrasts
against the white/light background.

Examples:

``` text
Deep blue
Navy
Deep green
Teal
Red
Orange
```

The exact brand color should be selected consistently.

Do not use:

``` text
Purple gradient + blue gradient + pink gradient
```

as a visual identity.

A professional palette should normally have:

``` text
Background
Surface
Primary
Primary-dark
Text
Muted text
Border
Success
Warning
Error
```

Keep the palette controlled.

------------------------------------------------------------------------

# 10. Buttons

Buttons should look like actual interface controls.

Prefer:

``` text
Rectangular
Moderately rounded
Clear hierarchy
Strong contrast
Readable text
```

Example:

``` text
Register Now
Create Event
Mark Attendance
Publish Event
```

Avoid turning every button into:

``` text
Huge pill
```

Do not use exaggerated border-radius values by default.

Buttons should communicate hierarchy:

``` text
Primary action
Secondary action
Danger action
Subtle action
```

------------------------------------------------------------------------

# 11. Cards

Cards are useful when they group actual information.

Use cards for:

``` text
Event
Registration
Attendance summary
Notice
Dashboard summary
```

Do not put every text element inside a card just because a card
component exists.

Avoid:

``` text
Card inside card inside card
```

Prefer clear layout and whitespace.

------------------------------------------------------------------------

# 12. Typography

Typography should be:

``` text
Readable
Professional
Consistent
Accessible
```

Use a clear hierarchy:

``` text
Page title
Section title
Card title
Body
Metadata
```

Do not use huge text simply to make a page look impressive.

------------------------------------------------------------------------

# 13. Spacing

Use consistent spacing.

Prefer a predictable spacing system instead of random margins.

For example:

``` text
8px
12px
16px
24px
32px
48px
64px
```

Whitespace should make the interface easier to scan.

Do not fill every empty area with decorative graphics.

------------------------------------------------------------------------

# 14. Borders and Shadows

Use subtle borders and shadows.

Good:

``` text
1px neutral border
Small shadow
Clear separation
```

Avoid:

``` text
Heavy shadows
Glow effects
Neon borders
Multiple shadows
```

The interface should feel clean and functional.

------------------------------------------------------------------------

# 15. Professional Web Page Rule

Every page should answer:

``` text
Where am I?
What can I do here?
What is the most important action?
What information matters?
What happens after I click?
```

Do not design screens only for visual appearance.

Function comes first.

------------------------------------------------------------------------

# 16. Student Portal Visual Direction

The student portal should feel:

``` text
Clean
Academic
Modern
Simple
Fast
```

Important areas:

``` text
Dashboard
Upcoming Events
Event Details
My Events
My QR
Attendance
Profile
Notices
```

Avoid turning the student dashboard into a marketing landing page.

------------------------------------------------------------------------

# 17. Club Portal Visual Direction

The club portal is an operational interface.

It should prioritize:

``` text
Event management
Registrations
Attendance
Scanner
Notices
```

The scanner page is especially important.

It should be:

``` text
Focused
Large enough for camera use
Fast
High contrast
Easy to understand
```

Do not fill the scanner page with unnecessary UI.

------------------------------------------------------------------------

# 18. QR Scanner UI

The scanner should prioritize the camera.

Example structure:

``` text
--------------------------------
CampusHub
Attendance Scanner

Event: TechFest 2026

[ Camera Scanner Area ]

Ready to scan

--------------------------------
```

After successful scan:

``` text
✓ ENTRY ALLOWED

Abhishek Yadav
Roll No: 23

Attendance Marked
10:21 AM
```

After rejection:

``` text
✕ ENTRY DENIED

Student is not registered
for this event.
```

The scanner should quickly return to:

``` text
Ready to scan
```

Do not require unnecessary navigation after every scan.

------------------------------------------------------------------------

# 19. UI States Are Required

Every important interface should consider:

``` text
Loading
Success
Empty
Error
Unauthorized
Not found
Disabled
Submitting
```

Example:

### Events page

Loading:

``` text
Loading events...
```

Empty:

``` text
No upcoming events.
```

Error:

``` text
Unable to load events.
Try again.
```

Do not leave blank screens.

------------------------------------------------------------------------

# 20. Responsive Design

CampusHub must work on:

``` text
Desktop
Laptop
Tablet
Mobile
```

Especially:

``` text
Student QR
QR Scanner
Event registration
Attendance
```

The scanner should work properly on mobile devices because the club
member may use a phone.

------------------------------------------------------------------------

# 21. Accessibility

Use:

-   Sufficient color contrast.
-   Visible focus states.
-   Semantic HTML.
-   Proper labels.
-   Keyboard-accessible controls.
-   Alt text for meaningful images.
-   Clear error messages.
-   Do not communicate status only through color.

For example:

Do not use only:

``` text
green = success
red = failure
```

Also include:

``` text
ENTRY ALLOWED
ENTRY DENIED
```

------------------------------------------------------------------------

# 22. Do Not Use Fake Data in Production UI

Placeholder data is acceptable during development.

But do not accidentally ship:

``` text
John Doe
Lorem ipsum
123456
Random event names
Fake attendance numbers
Fake statistics
```

If mock data is required, clearly isolate it.

------------------------------------------------------------------------

# 23. Do Not Hide Functionality Behind Visual Tricks

Important actions should be obvious.

For example:

``` text
Register
Cancel Registration
Create Event
Publish
Scan
Export Attendance
```

Do not make users discover core functionality through hidden hover
effects.

------------------------------------------------------------------------

# 24. Frontend Architecture

Follow the existing frontend structure:

``` text
frontend/
├── pages/
├── css/
├── js/
│   ├── api/
│   ├── auth/
│   ├── student/
│   ├── club/
│   └── utils/
└── assets/
```

Do not put the entire application into:

``` text
index.html
```

Do not create giant JavaScript files when the feature can be separated
logically.

------------------------------------------------------------------------

# 25. Backend Architecture

Follow:

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

Do not put all application logic inside route handlers.

Do not make controllers responsible for everything.

------------------------------------------------------------------------

# 26. Database Rules

Use PostgreSQL on RDS.

Do not:

-   Store database credentials in frontend code.
-   Store passwords in plaintext.
-   Store files directly in PostgreSQL when S3 is appropriate.
-   Remove database constraints just to make frontend code easier.
-   Generate Excel files as the source of attendance data.

The database is the source of truth.

------------------------------------------------------------------------

# 27. Universal QR Rules

The Universal QR is a permanent student identifier.

It should contain an opaque token such as:

``` text
CH-7F82K91X
```

It should NOT directly contain:

``` text
Name
Email
Roll number
Password
Database credentials
```

The backend resolves:

``` text
QR token
   ↓
Student
```

Then checks:

``` text
Student
   ↓
Registration
   ↓
Current Event
```

The QR itself does not grant event access.

------------------------------------------------------------------------

# 28. Attendance Rules

The backend is the authority for attendance.

Never trust:

``` text
Frontend student ID
Frontend attendance status
Frontend check-in time
Frontend registration status
```

The backend must verify them.

Attendance must be:

``` text
QR scan
→ API
→ student lookup
→ registration check
→ duplicate check
→ attendance insert
```

Use a database constraint:

``` text
UNIQUE(student_id, event_id)
```

to prevent duplicate attendance.

------------------------------------------------------------------------

# 29. Do Not Generate Excel During Scanning

Never make this the scan path:

``` text
QR
→ Database
→ Generate Excel
→ Upload Excel
→ Response
```

Use:

``` text
QR
→ Validate
→ Insert attendance
→ Response
```

Then separately:

``` text
Export
→ Query database
→ Generate Excel/CSV
```

------------------------------------------------------------------------

# 30. AWS Rules

Use only the AWS services required by the project.

Current core AWS architecture:

``` text
EC2
RDS
S3
IAM
CloudWatch
```

Optional services must have a real reason:

``` text
Cognito
CloudFront
SES
SNS
```

Do not introduce:

``` text
EKS
Kubernetes
Lambda everywhere
API Gateway
DynamoDB
ElastiCache
Kafka
Step Functions
```

unless the human explicitly approves a change in architecture.

------------------------------------------------------------------------

# 31. S3 Rules

S3 is for:

``` text
Event posters
Club logos
Optional ticket PDFs
Event documents
```

Use predictable keys:

``` text
events/{eventId}/poster.webp
clubs/{clubId}/logo.png
tickets/{eventId}/{registrationId}.pdf
```

Do not expose AWS secret credentials to the browser.

------------------------------------------------------------------------

# 32. Secrets

Never hard-code:

``` text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
DATABASE_URL
JWT_SECRET
SESSION_SECRET
```

Use environment variables.

Example:

``` text
.env
```

The repository should contain:

``` text
.env.example
```

but not real secrets.

------------------------------------------------------------------------

# 33. Git Rules

Never commit:

``` text
.env
AWS credentials
Database passwords
Private keys
Production secrets
Generated sensitive files
```

Use:

``` text
.gitignore
```

appropriately.

------------------------------------------------------------------------

# 34. Code Quality

Write code that another student can understand.

Prefer:

``` text
clear variable names
small functions
simple control flow
consistent formatting
comments only when useful
```

Avoid:

``` text
clever one-liners
unnecessary abstractions
deep inheritance
giant functions
duplicate business logic
```

------------------------------------------------------------------------

# 35. Comments

Do not comment obvious code.

Bad:

``` js
// Set name
user.name = name;
```

Good:

``` js
// The backend generates this timestamp so clients cannot manipulate check-in time.
attendance.checkInTime = new Date();
```

Comments should explain:

``` text
Why
```

rather than:

``` text
What
```

when the code already makes the "what" obvious.

------------------------------------------------------------------------

# 36. Dependencies

Before adding a dependency, ask:

1.  Do we actually need it?
2.  Can the existing stack solve the problem?
3.  Does it increase maintenance?
4.  Does it introduce security or licensing concerns?
5.  Does it conflict with the architecture?

For small features, prefer existing dependencies.

Do not add a package for a trivial function that can be written safely
in a few lines.

------------------------------------------------------------------------

# 37. No Unnecessary Framework Changes

If the project uses:

``` text
HTML + CSS + JavaScript
```

do not suddenly convert it to:

``` text
React
```

unless the human explicitly approves the change.

Likewise, do not replace:

``` text
Express
```

with another backend framework without approval.

------------------------------------------------------------------------

# 38. UI Implementation Rule

Before building a page, identify:

``` text
Purpose
Primary action
Secondary actions
Required data
Loading state
Empty state
Error state
Mobile behavior
```

Then implement.

Do not begin by adding decorative components.

------------------------------------------------------------------------

# 39. Design Before Decoration

The order should be:

``` text
1. Information hierarchy
2. Layout
3. Typography
4. Spacing
5. Controls
6. Colors
7. Small visual polish
```

Not:

``` text
1. Gradient
2. Glass card
3. Shadow
4. Animation
5. Figure out content later
```

------------------------------------------------------------------------

# 40. Animations

Animations should be subtle and functional.

Acceptable:

``` text
Button hover
Small transition
Modal appearance
Loading indicator
Scanner feedback
```

Avoid:

``` text
Large page animations
Constant floating objects
Parallax everywhere
Excessive motion
Animations that slow interaction
```

------------------------------------------------------------------------

# 41. Icons

Use icons only when they improve comprehension.

Do not replace every label with an icon.

For important actions, prefer:

``` text
Icon + text
```

rather than:

``` text
mysterious icon only
```

------------------------------------------------------------------------

# 42. Images

Use images that support the content.

Event posters are meaningful.

Decorative stock images are usually unnecessary.

Do not add random stock photography just to fill empty space.

------------------------------------------------------------------------

# 43. Forms

Forms should be simple and clear.

Each field should have:

``` text
Label
Input
Validation
Error state
```

Avoid:

``` text
Floating labels everywhere
Excessive fields
Unnecessary questions
```

Only collect information CampusHub actually needs.

Current student profile:

``` text
Name
Roll No
Email
```

------------------------------------------------------------------------

# 44. Event Creation Form

The club event form should focus on:

``` text
Event title
Description
Category
Date
Start time
End time
Venue
Capacity
Guest
Registration deadline
Poster
Rules
```

Do not add unnecessary event metadata.

------------------------------------------------------------------------

# 45. Error Handling

Errors should be useful.

Bad:

``` text
Something went wrong.
```

Better:

``` text
Unable to register.
The event is already full.
```

For technical failures:

``` text
Unable to complete the request.
Please try again.
```

Do not expose:

``` text
SQL errors
Stack traces
AWS credentials
Internal server paths
```

to users.

------------------------------------------------------------------------

# 46. Security Over Convenience

If a frontend shortcut creates a security problem, do not use the
shortcut.

Examples:

Do not:

``` text
Trust role from localStorage
Trust student ID from request body
Trust attendance status from frontend
Expose RDS publicly
Expose AWS secret keys
```

The backend must enforce permissions.

------------------------------------------------------------------------

# 47. Testing Before Declaring Done

A feature is not finished simply because the page appears.

Test:

``` text
Happy path
Invalid input
Unauthorized access
Duplicate action
Empty state
Server error
Mobile layout
Database constraint
```

For QR attendance specifically:

``` text
Valid registered student
Invalid QR
Unknown student
Not registered
Already attended
Unauthorized scanner
Inactive event
Two scanners scanning same student
```

------------------------------------------------------------------------

# 48. Before Editing Existing Code

Before modifying a file:

1.  Read the relevant code.
2.  Understand its role.
3.  Identify dependencies.
4.  Make the smallest reasonable change.
5.  Avoid unrelated refactoring.

Do not rewrite an entire file just because the code could be
stylistically improved.

------------------------------------------------------------------------

# 49. Do Not "Clean Up" Unrelated Code

If the task is:

``` text
Fix registration button
```

do not also:

``` text
Rewrite authentication
Change database schema
Redesign dashboard
Replace CSS framework
Rename all variables
```

unless those changes are necessary.

Keep the change focused.

------------------------------------------------------------------------

# 50. Preserve Existing Functionality

Before changing something, consider:

``` text
What currently works?
What depends on this?
Could this change break another portal?
```

Especially protect:

``` text
Authentication
Registration
Universal QR
Attendance
Database relationships
AWS configuration
```

------------------------------------------------------------------------

# 51. When Requirements Conflict

If documentation says:

``` text
A
```

but the latest explicit human instruction says:

``` text
B
```

follow the latest explicit instruction, but identify the conflict.

Example:

``` text
The current architecture specifies X, but your latest instruction requests Y.

This changes [specific part].

I can implement Y, but it will require [impact].

Proceed with Y?
```

Do not silently choose.

------------------------------------------------------------------------

# 52. When Something Is Unclear

Stop before making a high-impact assumption.

Ask concise questions.

Example:

``` text
I need one decision before implementing this:

Should club members be able to edit an event after registrations have started?

A. Yes, with restrictions
B. No, lock event details after publishing
```

------------------------------------------------------------------------

# 53. When There Are Multiple Valid Solutions

Present the choices.

Example:

``` text
There are two valid approaches:

A. Generate tickets on registration.
B. Generate tickets only when the student opens/downloads them.

A uses more storage/work during registration.
B keeps registration faster.

Which approach should CampusHub use?
```

Do not silently choose an architecture-changing option.

------------------------------------------------------------------------

# 54. Agent Must Keep the Human Informed

For larger tasks, report:

``` text
What was changed
Why it was changed
What remains
Any decision that needs approval
```

Do not hide major decisions inside implementation.

------------------------------------------------------------------------

# 55. Never Claim Something Works Without Testing

Do not say:

``` text
Done and working
```

if it was not actually tested.

Instead state:

``` text
Implemented.
```

and identify what was tested.

Example:

``` text
Implemented the attendance endpoint.

Tested:
- Valid QR
- Invalid QR
- Duplicate attendance

Not tested:
- Real mobile camera scanning
```

------------------------------------------------------------------------

# 56. Build in Small Steps

Preferred workflow:

``` text
Understand
   ↓
Ask necessary questions
   ↓
Plan
   ↓
Implement small change
   ↓
Test
   ↓
Review
   ↓
Continue
```

Do not make huge uncontrolled changes across the entire project.

------------------------------------------------------------------------

# 57. Before Creating a New File

Ask:

``` text
Does this belong in an existing file?
```

Create a new file only when it improves structure.

Avoid:

``` text
component-final.js
component-final-2.js
component-new.js
component-new-fixed.js
```

Use meaningful names.

------------------------------------------------------------------------

# 58. Naming

Use consistent names.

Examples:

``` text
attendance.service.js
attendance.controller.js
attendance.routes.js
```

Frontend:

``` text
attendance.js
scanner.js
events.js
```

Database:

``` text
snake_case
```

JavaScript:

``` text
camelCase
```

Classes/types where applicable:

``` text
PascalCase
```

------------------------------------------------------------------------

# 59. No Fake Complexity

Do not create abstractions simply to make the project look advanced.

A second-year project does not become better because it has:

``` text
12 layers
```

when:

``` text
4 layers
```

are enough.

The goal is a working, understandable system.

------------------------------------------------------------------------

# 60. Viva-Friendly Implementation

CampusHub should be explainable in a college viva.

The team should be able to explain:

``` text
Why PostgreSQL?
Why RDS?
Why S3?
Why Express?
Why Universal QR?
Why separate registration and attendance?
Why database unique constraints?
Why EC2?
Why modular monolith?
```

Avoid architecture that the team cannot confidently explain.

------------------------------------------------------------------------

# 61. Core Project Invariants

Never break these rules without explicit approval.

### Invariant 1

``` text
Universal QR identifies the student.
```

### Invariant 2

``` text
Universal QR does not directly grant event access.
```

### Invariant 3

``` text
Backend verifies event registration before attendance.
```

### Invariant 4

``` text
One student can have only one registration per event.
```

### Invariant 5

``` text
One student can have only one attendance record per event.
```

### Invariant 6

``` text
RDS is the source of truth for structured data.
```

### Invariant 7

``` text
S3 is used for files.
```

### Invariant 8

``` text
Frontend never directly accesses RDS.
```

### Invariant 9

``` text
AWS secrets never go into frontend code or Git.
```

### Invariant 10

``` text
Excel/CSV is an export/report, not the source of attendance truth.
```

------------------------------------------------------------------------

# 62. Definition of Good CampusHub UI

A good CampusHub screen should be:

``` text
Clean
Professional
White/light background
Strong contrast
Readable
Functional
Responsive
Consistent
Accessible
Fast
```

It should NOT feel like:

``` text
AI-generated SaaS
Crypto dashboard
Gaming interface
Marketing landing page
Generic template
```

------------------------------------------------------------------------

# 63. Default UI Checklist

Before considering a page complete:

``` text
[ ] White/light background
[ ] Controlled color palette
[ ] Strong contrast
[ ] No unnecessary gradients
[ ] No excessive pill buttons
[ ] No decorative blobs
[ ] No unnecessary glassmorphism
[ ] Clear page title
[ ] Clear primary action
[ ] Consistent spacing
[ ] Responsive layout
[ ] Loading state
[ ] Empty state
[ ] Error state
[ ] Success state
[ ] Accessible labels
[ ] No fake data in production
```

------------------------------------------------------------------------

# 64. Default Development Checklist

Before considering a feature complete:

``` text
[ ] Requirements understood
[ ] Relevant documentation checked
[ ] No unnecessary scope added
[ ] Authorization implemented
[ ] Input validation implemented
[ ] Error handling implemented
[ ] Database constraints respected
[ ] Security checked
[ ] Mobile behavior checked
[ ] Main happy path tested
[ ] Failure paths tested
[ ] No secrets committed
[ ] No unrelated files changed
```

------------------------------------------------------------------------

# 65. Final Agent Rule

When working on CampusHub:

> **Build what was requested, preserve what already works, ask before
> important decisions, keep the architecture simple, and make the
> interface look like a professional real-world college product rather
> than an AI-generated template.**

The human decides:

``` text
Scope
Architecture changes
Major features
Design direction changes
Technology changes
Trade-offs
Final acceptance
```

The agent is responsible for:

``` text
Implementation
Consistency
Testing
Documentation
Identifying risks
Explaining trade-offs
Following project rules
```

When uncertain:

``` text
Do not guess on important decisions.
Ask.
```
