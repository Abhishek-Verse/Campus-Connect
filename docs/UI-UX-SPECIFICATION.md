# CampusHub --- UI/UX Specification

**Document:** UI/UX Specification\
**Version:** 1.0\
**Project:** CampusHub

------------------------------------------------------------------------

# 1. Purpose

This document defines the visual language and interface behavior for
CampusHub.

The goal is a **clean, professional, restrained college web
application**.

CampusHub should feel like a real product used by students and college
committees, not like a generated SaaS landing page.

The UI must prioritize:

``` text
Clarity
Usability
Speed
Consistency
Accessibility
Professionalism
```

------------------------------------------------------------------------

# 2. Primary Visual Direction

## The most important visual rule

> **The background must be white.**

Use:

``` text
#FFFFFF
```

as the primary application background.

Very light neutral surfaces may be used for secondary areas, but the
main page canvas remains white.

## Absolutely no background gradients

Do not use:

``` text
linear-gradient(...)
radial-gradient(...)
conic-gradient(...)
```

for:

-   Page backgrounds
-   Hero backgrounds
-   Dashboard backgrounds
-   Cards
-   Navigation
-   Decorative areas

No gradient-based visual identity.

------------------------------------------------------------------------

# 3. Design Inspiration

The design direction takes inspiration from established product
interfaces that emphasize hierarchy and restraint.

### Linear

Linear's recent interface work emphasizes clearer hierarchy, predictable
navigation, reduced visual clutter, and calmer interfaces.
citeturn0search4turn0search8turn0search13

Useful principle for CampusHub:

``` text
Less visual noise
Better hierarchy
Predictable navigation
Clear actions
```

### Notion

Notion's interface is notable for restrained color, strong typography,
whitespace, subtle structure, and the absence of decorative gradients in
the product UI. citeturn0search0turn0search2

Useful principle for CampusHub:

``` text
Content first
Quiet surfaces
Minimal decoration
Color only when useful
```

### Vercel

Vercel's design language is strongly monochromatic, using
white/near-white surfaces, near-black text, grayscale hierarchy, and
restrained use of accent color. citeturn0search1turn0search14

Useful principle for CampusHub:

``` text
White canvas
Strong typography
Grayscale hierarchy
One controlled accent
```

These are **inspiration references, not templates to copy**.

Do not copy:

-   Logos
-   Branding
-   Exact layouts
-   Exact typography
-   Product-specific components
-   Marketing copy
-   Illustrations

CampusHub must have its own identity.

------------------------------------------------------------------------

# 4. Overall Visual Formula

The default CampusHub visual formula is:

``` text
WHITE BACKGROUND
+
DARK TEXT
+
LIGHT GRAY STRUCTURE
+
ONE PRIMARY ACCENT COLOR
+
SMALL STATUS COLORS
```

Approximately:

``` text
80–90% neutral
5–15% primary accent
small amounts of semantic colors
```

Do not make the interface colorful.

------------------------------------------------------------------------

# 5. Color System

## Background

``` text
--color-background: #FFFFFF;
```

This is the default page background.

------------------------------------------------------------------------

## Surface

``` text
--color-surface: #FFFFFF;
--color-surface-subtle: #F7F7F7;
```

Use the subtle surface sparingly for:

-   Secondary panels
-   Table headers
-   Selected navigation
-   Form sections
-   Empty states

Do not turn every section into a gray box.

------------------------------------------------------------------------

## Primary Text

``` text
--color-text: #171717;
```

Use for:

-   Page titles
-   Event names
-   Important information
-   Primary labels

------------------------------------------------------------------------

## Secondary Text

``` text
--color-text-secondary: #666666;
```

Use for:

-   Descriptions
-   Metadata
-   Supporting information

------------------------------------------------------------------------

## Muted Text

``` text
--color-text-muted: #8A8A8A;
```

Use sparingly for:

-   Timestamps
-   Secondary metadata
-   Hints

------------------------------------------------------------------------

## Border

``` text
--color-border: #E6E6E6;
```

Borders should be subtle.

------------------------------------------------------------------------

# 6. Primary Accent

CampusHub should have **one primary accent color**.

Recommended starting direction:

``` text
CampusHub Blue
#2563EB
```

The exact brand color can be changed by the human before implementation.

Use the accent for:

``` text
Primary buttons
Links
Active navigation
Focus states
Selected controls
Important interactive elements
```

Do not use the accent as a background for entire pages.

Do not create multiple brand colors.

------------------------------------------------------------------------

# 7. Semantic Colors

Semantic colors are allowed only for actual system states.

``` text
Success:
#16A34A

Warning:
#D97706

Error:
#DC2626

Info:
#2563EB
```

Use these for:

``` text
Success messages
Warnings
Errors
Attendance status
Validation states
```

Do not use semantic colors as decorative themes.

------------------------------------------------------------------------

# 8. No AI-Slop Visual Patterns

The following are explicitly prohibited unless the human specifically
requests them:

``` text
Purple gradients
Blue-purple gradients
Pink-purple gradients
Mesh gradients
Glow backgrounds
Gradient text
Glassmorphism
Blur-heavy backgrounds
Neon borders
Floating blobs
Decorative geometric backgrounds
Excessive shadows
Huge rounded containers
Every element inside a card
Every button as a pill
Huge marketing hero sections
Random 3D illustrations
Generic AI-generated illustrations
Emoji-heavy UI
```

CampusHub must not look like:

``` text
AI SaaS landing page
Crypto dashboard
Gaming dashboard
Startup template
Generic Tailwind showcase
```

------------------------------------------------------------------------

# 9. Border Radius

Use restrained corner radii.

Recommended:

``` text
Inputs: 6px
Buttons: 6px
Cards: 8px
Modals: 10px
Large containers: 10px
```

Avoid:

``` text
border-radius: 9999px
```

for normal buttons or containers.

Pills are allowed for:

``` text
Status badges
Tags
Small filters
```

They are not the default shape for buttons.

------------------------------------------------------------------------

# 10. Shadows

Use shadows sparingly.

Default:

``` text
No shadow
```

Use a subtle shadow only where depth is useful:

``` text
Modal
Dropdown
Popover
Floating scanner result
```

Cards should generally rely on:

``` text
white surface
subtle border
spacing
```

rather than large shadows.

------------------------------------------------------------------------

# 11. Typography

Use one primary sans-serif family.

Recommended:

``` text
Inter
```

with system fallbacks:

``` text
Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

Do not combine many fonts.

------------------------------------------------------------------------

# 12. Typography Scale

Recommended starting scale:

  Element               Size   Weight
  --------------- ---------- --------
  Page title        28--32px      600
  Section title     20--24px      600
  Card title        16--18px      600
  Body              14--16px      400
  Metadata          13--14px      400
  Button                14px      500
  Small label       12--13px      500

Do not make every heading huge.

The application is an operational product, not a marketing website.

------------------------------------------------------------------------

# 13. Typography Rules

Use:

``` text
Weight 400
Weight 500
Weight 600
```

primarily.

Avoid excessive use of:

``` text
800
900
```

Typography should create hierarchy without looking aggressive.

------------------------------------------------------------------------

# 14. Spacing

Use a 4px base spacing system.

Recommended values:

``` text
4
8
12
16
20
24
32
40
48
64
```

Common usage:

``` text
Page padding: 24–40px
Card padding: 16–24px
Section gap: 32–48px
Form field gap: 16px
Button gap: 8–12px
```

Whitespace is important.

Do not compress everything together.

------------------------------------------------------------------------

# 15. Layout Philosophy

The interface should have:

``` text
Clear content area
Consistent alignment
Predictable navigation
Controlled width
Strong whitespace
```

Avoid:

``` text
Random alignment
Oversized empty hero sections
Uneven card grids
Decorative side panels
```

------------------------------------------------------------------------

# 16. Application Shell

Desktop structure:

``` text
┌──────────────────────────────────────────────────────┐
│ CampusHub                              Profile       │
├───────────────┬──────────────────────────────────────┤
│               │                                      │
│ Dashboard     │                                      │
│ Events        │              Main Content            │
│ My Events     │                                      │
│ My QR         │                                      │
│ Attendance    │                                      │
│ Profile       │                                      │
│               │                                      │
│               │                                      │
└───────────────┴──────────────────────────────────────┘
```

The sidebar should be quiet.

Do not make the sidebar a colorful panel.

Recommended:

``` text
White background
Subtle border-right
Dark text
Accent active state
```

------------------------------------------------------------------------

# 17. Sidebar

Sidebar width:

``` text
220–250px
```

Navigation item:

``` text
Height: 36–40px
Radius: 6px
Horizontal padding: 10–12px
```

Inactive:

``` text
Transparent
Muted text
```

Hover:

``` text
#F5F5F5
```

Active:

``` text
Very light accent surface
Accent text
```

Do not use huge colored active blocks.

------------------------------------------------------------------------

# 18. Top Bar

Top bar should contain only useful controls.

Possible:

``` text
CampusHub
Page title / breadcrumb
Search if needed
Notifications
Profile
```

Do not put unnecessary decorative elements in the header.

------------------------------------------------------------------------

# 19. Student Dashboard

The student dashboard should immediately show:

``` text
Good morning / simple greeting
Upcoming events
Registered events
Recent notices
Attendance summary
```

Do not create a giant hero section.

Example:

``` text
Dashboard

Upcoming Events                         View all →

┌─────────────────────────────────────────────────────┐
│ TechFest 2026                              Oct 12   │
│ Main Auditorium · 10:00 AM                          │
│                                     [Register]      │
└─────────────────────────────────────────────────────┘

My Activity

Registered     Attended     Upcoming
     8             6            2

Notices
...
```

------------------------------------------------------------------------

# 20. Event Cards

Event cards should be information-first.

Structure:

``` text
┌──────────────────────────────────────┐
│ [Event Poster]                       │
│                                      │
│ TechFest 2026                        │
│ 12 Oct · 10:00 AM                    │
│ Main Auditorium                      │
│                                      │
│ 27 seats available     [Register]   │
└──────────────────────────────────────┘
```

Do not add:

``` text
glowing borders
huge shadows
gradient overlays
random icons
```

------------------------------------------------------------------------

# 21. Event Poster

The poster can contain colors because it is **content uploaded by the
club**.

Important distinction:

``` text
Application UI
→ restrained

Uploaded event poster
→ may be colorful
```

Do not force the entire application to match the poster's colors.

------------------------------------------------------------------------

# 22. Event Details Page

Priority order:

``` text
Event title
Date/time
Venue
Registration status
Primary action
Description
Guest
Rules
Seats
Poster
```

Example:

``` text
TechFest 2026

12 October 2026
10:00 AM – 4:00 PM
Main Auditorium

27 seats remaining

[ Register Now ]

About the event
...

Guest
Dr. XYZ

Rules
1. Carry college ID
2. Arrive 15 minutes early
```

------------------------------------------------------------------------

# 23. Registration State

Before registration:

``` text
[ Register Now ]
```

After registration:

``` text
✓ Registered
```

If full:

``` text
Registration Full
```

If closed:

``` text
Registration Closed
```

The state should be obvious without relying only on color.

------------------------------------------------------------------------

# 24. My Events

Use a simple list/table rather than a giant card wall.

Columns:

``` text
Event
Date
Venue
Registration
Attendance
Action
```

Mobile can convert the row into a compact card.

------------------------------------------------------------------------

# 25. Universal QR Page

This page should be extremely simple.

``` text
My CampusHub QR

Use this QR for event entry.

        ┌───────────────┐
        │               │
        │   QR CODE     │
        │               │
        └───────────────┘

Abhishek Yadav
Roll No: 23

This QR works for all CampusHub events.
```

Do not add:

``` text
gradient background
decorative QR frame
glowing QR
animated particles
```

The QR itself is the focus.

------------------------------------------------------------------------

# 26. QR Scanner Page

The scanner is one of the most important operational screens.

Desktop:

``` text
Attendance Scanner

TechFest 2026
12 Oct · Main Auditorium

┌──────────────────────────────────────┐
│                                      │
│             CAMERA                   │
│                                      │
│        Scan student QR here          │
│                                      │
└──────────────────────────────────────┘

Ready to scan
```

The camera should occupy most of the useful screen area.

------------------------------------------------------------------------

# 27. Successful Scan

Use clear but restrained feedback.

``` text
✓ ENTRY ALLOWED

Abhishek Yadav
Roll No: 23

Attendance marked
10:21 AM
```

Use the success color only for the status.

Do not turn the entire screen bright green.

------------------------------------------------------------------------

# 28. Failed Scan

Example:

``` text
ENTRY DENIED

Student is not registered
for this event.

Try another QR
```

Use the error color only where necessary.

------------------------------------------------------------------------

# 29. Scanner Feedback

After the result:

``` text
Result
  ↓
Short feedback
  ↓
Return to scanning
```

Do not require the operator to click through several screens.

------------------------------------------------------------------------

# 30. Attendance Dashboard

Club dashboard:

``` text
TechFest 2026

Registered      Present       Absent
   150             132           18

[ Open Scanner ]     [ Export ]

Attendance

Name              Roll     Status      Time
------------------------------------------------
Abhishek Yadav    23       Present     10:21
...
```

The important information should be visible immediately.

------------------------------------------------------------------------

# 31. Attendance Status

Use text plus restrained color:

``` text
Present
Absent
```

Do not use only:

``` text
green dot
red dot
```

because color alone is insufficient.

------------------------------------------------------------------------

# 32. Club Dashboard

The club dashboard is operational.

Prioritize:

``` text
Active events
Upcoming events
Registrations
Attendance
Quick actions
```

Example:

``` text
Club Dashboard

Upcoming Events

TechFest 2026
12 Oct · 150 seats
[Manage Event]

Quick Actions

[Create Event]
[Open Scanner]
[View Registrations]
```

------------------------------------------------------------------------

# 33. Create Event

The form should be structured into logical sections.

``` text
Create Event

Basic Information
Event title
Description
Category

Schedule
Date
Start time
End time

Location
Venue

Capacity
Number of seats

Additional
Guest
Rules
Poster

[ Save Draft ]    [ Publish ]
```

Do not put all fields into one visually chaotic block.

------------------------------------------------------------------------

# 34. Event Management

Club members should see:

``` text
Draft
Published
Registration Closed
Ongoing
Completed
Cancelled
```

Use small status badges.

Do not make the status badge huge.

------------------------------------------------------------------------

# 35. Notices

Notices should look like content, not advertisements.

Example:

``` text
Registration deadline extended

Registration for TechFest has been extended
until 11:00 PM.

IMPORTANT
5 Oct 2026
```

Use hierarchy and spacing instead of colorful boxes.

------------------------------------------------------------------------

# 36. Profile

Student profile should remain simple.

Current required information:

``` text
Name
Roll No
Email
```

Do not add unnecessary profile fields.

------------------------------------------------------------------------

# 37. Tables

Use tables where users need to compare records.

Good examples:

``` text
Registrations
Attendance
Event management
```

Table rules:

``` text
White background
Subtle header background
Light separators
Compact but readable rows
Clear actions
```

Avoid:

``` text
Colorful table rows
Huge rounded table containers
Excessive icons
```

------------------------------------------------------------------------

# 38. Forms

Inputs:

``` text
Height: 40–44px
Radius: 6px
Border: #D9D9D9
Background: white
```

Focus:

``` text
Accent border/ring
```

Labels should always be visible.

Do not depend only on placeholders.

------------------------------------------------------------------------

# 39. Buttons

### Primary

``` text
Background: Primary accent
Text: White
Radius: 6px
```

Examples:

``` text
Register Now
Create Event
Publish
Open Scanner
```

### Secondary

``` text
White
Subtle border
Dark text
```

Examples:

``` text
Cancel
Back
View Details
```

### Danger

Use only for destructive actions:

``` text
Cancel Event
Delete Draft
```

Do not make every secondary action colorful.

------------------------------------------------------------------------

# 40. Button Shape Rule

Normal buttons:

``` text
6px radius
```

Not:

``` text
999px
```

Pills are allowed only for:

``` text
Status
Tags
Small filters
```

------------------------------------------------------------------------

# 41. Modals

Use modals only for focused decisions.

Examples:

``` text
Cancel event?
Delete draft?
Confirm registration?
```

Structure:

``` text
Title
Explanation
Secondary action
Primary/danger action
```

Do not put entire workflows inside giant modals.

------------------------------------------------------------------------

# 42. Empty States

Empty states should be simple.

Example:

``` text
No upcoming events

There are no upcoming events right now.
```

Optional action:

``` text
[ Browse Events ]
```

Do not use giant illustrations unless genuinely useful.

------------------------------------------------------------------------

# 43. Loading States

Prefer lightweight skeletons or simple loading indicators.

Do not animate large decorative loaders.

For scanner:

``` text
Starting camera...
```

For events:

``` text
Loading events...
```

------------------------------------------------------------------------

# 44. Error States

Example:

``` text
Unable to load events

Something went wrong while loading events.

[ Try Again ]
```

Keep error messages actionable.

------------------------------------------------------------------------

# 45. Success Messages

Use short confirmation:

``` text
Registration successful.
```

or:

``` text
Event published successfully.
```

Avoid giant celebratory screens.

------------------------------------------------------------------------

# 46. Mobile Navigation

On mobile:

``` text
Desktop sidebar
→
Compact top navigation / bottom navigation
```

Prioritize:

``` text
Home
Events
My Events
QR
Profile
```

Club:

``` text
Dashboard
Events
Scanner
Attendance
More
```

The scanner should have easy access.

------------------------------------------------------------------------

# 47. Mobile QR

The QR must remain large enough to scan reliably.

Do not put unnecessary text around it.

Recommended:

``` text
QR
Student name
Roll number
Short instruction
```

------------------------------------------------------------------------

# 48. Mobile Scanner

The camera area should be large.

Recommended:

``` text
Header
Event name
Camera
Scan status
Recent result
```

Avoid sidebars on the scanner screen.

------------------------------------------------------------------------

# 49. Responsive Breakpoints

Use standard responsive behavior.

Suggested:

``` text
Mobile: < 768px
Tablet: 768–1023px
Desktop: ≥ 1024px
```

The exact CSS framework breakpoints may be used if Bootstrap/Tailwind is
selected.

------------------------------------------------------------------------

# 50. Accessibility

Must include:

``` text
Keyboard navigation
Visible focus
Readable contrast
Labels
Alt text
Semantic HTML
Status text
Accessible error messages
```

Do not communicate important state only through color.

------------------------------------------------------------------------

# 51. Motion

Keep motion subtle.

Allowed:

``` text
100–200ms transitions
Hover changes
Focus transitions
Modal entrance
Toast appearance
Scanner success feedback
```

Avoid:

``` text
Bouncy animations
Large scaling
Parallax
Continuous background animation
Floating blobs
```

------------------------------------------------------------------------

# 52. Icons

Use a consistent icon library if needed.

Recommended:

``` text
Lucide
```

Use icons to support labels.

Do not use:

``` text
Emoji as navigation icons
```

For example:

Prefer:

``` text
Calendar  Events
```

over:

``` text
📅 Events
```

------------------------------------------------------------------------

# 53. Cards

Cards should exist only when they help group information.

Good:

``` text
Event card
Attendance summary
Notice
```

Bad:

``` text
Card around a button
Card around a heading
Card around a card
```

Whitespace can separate content without a container.

------------------------------------------------------------------------

# 54. Dashboard Statistics

Statistics should be useful.

Good:

``` text
Registered
Present
Upcoming
```

Bad:

``` text
AI-powered engagement score
Campus happiness index
Random productivity score
```

Do not invent metrics.

------------------------------------------------------------------------

# 55. Design System Tokens

Recommended initial CSS variables:

``` css
:root {
  --color-background: #ffffff;
  --color-surface: #ffffff;
  --color-surface-subtle: #f7f7f7;

  --color-text: #171717;
  --color-text-secondary: #666666;
  --color-text-muted: #8a8a8a;

  --color-border: #e6e6e6;

  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;

  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-error: #dc2626;

  --radius-input: 6px;
  --radius-button: 6px;
  --radius-card: 8px;
  --radius-modal: 10px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
}
```

These are starting tokens, not immutable values.

------------------------------------------------------------------------

# 56. What the UI Should Feel Like

The desired feeling is:

``` text
Clean
Quiet
Professional
Fast
Trustworthy
Academic
Modern
Focused
```

Not:

``` text
Colorful
Flashy
Playful
Neon
AI-generated
Over-designed
Marketing-heavy
```

------------------------------------------------------------------------

# 57. Anti-AI-Slop Checklist

Before approving a page, check:

``` text
[ ] Background is white
[ ] No background gradients
[ ] No purple AI-style gradient
[ ] No mesh gradient
[ ] No decorative glow
[ ] No glassmorphism
[ ] No giant hero unless genuinely necessary
[ ] No excessive cards
[ ] No excessive rounded corners
[ ] No pill-shaped normal buttons
[ ] No excessive shadows
[ ] No random illustrations
[ ] No emoji-based navigation
[ ] No unnecessary animations
[ ] No unnecessary colors
[ ] One main accent color
[ ] Clear hierarchy
[ ] Strong contrast
[ ] Good whitespace
[ ] Real information is prioritized
```

------------------------------------------------------------------------

# 58. Design Review Rule

Before implementing a new page, the agent should ask:

``` text
What is the main task on this page?
What information does the user need first?
What is the primary action?
Can anything be removed?
```

If a component does not help the user:

``` text
Remove it.
```

Minimalism is not:

``` text
"Make everything tiny."
```

Minimalism is:

``` text
"Remove what does not help."
```

------------------------------------------------------------------------

# 59. Human Approval Points

The human should explicitly control:

``` text
Brand/accent color
Logo
Typography choice if changed from Inter
Navigation structure
Major page layout
New visual components
New animations
Major UX changes
New product features
```

The agent can handle:

``` text
Spacing adjustments
Responsive implementation
Small component refinements
Accessibility fixes
Bug fixes
Consistent states
```

unless these changes materially alter the design.

------------------------------------------------------------------------

# 60. Final Design Principle

CampusHub should follow this rule:

> **White canvas. Strong typography. One controlled accent. Subtle
> structure. Clear actions. Almost no decoration.**

The interface should look like a carefully designed professional product
because of:

``` text
Hierarchy
Spacing
Typography
Alignment
Consistency
Interaction
```

---not because of:

``` text
Gradients
Glows
Colors
Animations
Decorative cards
```

------------------------------------------------------------------------

# 61. Final UI Definition

The CampusHub UI is:

``` text
WHITE
MINIMAL
PROFESSIONAL
HIGH-CONTRAST
LOW-COLOR
CONTENT-FIRST
RESPONSIVE
ACCESSIBLE
```

And explicitly:

``` text
NO GRADIENT BACKGROUNDS.
NO PURPLE AI AESTHETIC.
NO AI-SLOP DECORATION.
NO EXCESSIVE PILLS.
NO GLASSMORPHISM.
NO VISUAL CLUTTER.
```

The final implementation must preserve this visual direction across
both:

``` text
Student Portal
Club Committee Portal
```
