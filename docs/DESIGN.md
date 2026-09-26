# CampusHub Design Guide

## Purpose

This guide gives designers and developers a quick reference for CampusHub's visual language and interaction principles. It summarizes the direction for the interface; the detailed screen and component requirements belong in `06-UI-UX-SPECIFICATION.md`.

## Product design goals

CampusHub should feel like a clear, dependable campus service. Students should quickly understand what events are available and whether they are registered. Organizers should be able to manage events, scan attendees, and check attendance without navigating through clutter.

Design for clarity, speed, accessibility, and trust. Visual decoration should never compete with event information, attendance status, or the action a user needs to take.

## Visual direction

- Use a white or very light neutral page background.
- Use dark, high-contrast text and a restrained palette with one primary accent color and clear semantic colors for success, warning, and error.
- Use plain CSS with a consistent spacing scale, typography hierarchy, border treatment, and a modest corner radius.
- Use whitespace and alignment to establish hierarchy. Prefer subtle dividers and restrained shadows only when they improve grouping.
- Keep controls readable and practical. Buttons should have clear labels and purposeful shapes; do not make every control a pill.
- Use gradients only if the product owner approves a specific, restrained use. Do not use background gradients, glowing blobs, glass effects, or decorative AI-style visual effects.
- Use icons only when they are recognizable and paired with a label where meaning may be unclear.
- Avoid excessive colors, oversized hero decoration, dense dashboard cards, and purely decorative animation.

## Layout and responsive behavior

- Use semantic HTML5 structure and layouts authored in CSS3.
- Design for small screens first where the workflow benefits, especially event browsing, registration, and QR scanning.
- Keep primary actions visible and easy to reach; ensure tables and dashboards remain usable on narrow screens.
- Use consistent page gutters, content widths, spacing, and alignment across Student and Organizer areas.
- Do not rely on hover-only controls; touch and keyboard users must be able to reach all actions.
- Keep the scanner interface focused: camera/scan area, event context, scan status, and recovery action should be immediately understandable.

## Interaction states

Every data-driven screen should define:

- **Loading:** Show that work is in progress and prevent accidental repeated submission.
- **Empty:** Explain why there is no content and offer the next valid action when one exists.
- **Success:** Confirm the completed action, such as registration or attendance recording.
- **Error:** State what failed in plain language and whether retrying is safe.
- **Permission denied:** Explain that the user's role cannot perform the action without exposing protected information.

For registration, QR attendance, uploads, and exports, the interface must not show success until the backend confirms the operation. If a network failure leaves the outcome uncertain, explain how to check status before retrying.

## Accessibility and usability

- Provide programmatic and visible labels for form fields and controls.
- Maintain readable text contrast, visible keyboard focus, and logical tab order.
- Use headings in a meaningful hierarchy and buttons/links according to their purpose.
- Communicate status with text or an icon as well as color.
- Make validation and server errors identifiable to assistive technology and near the relevant control.
- Respect reduced-motion preferences if motion is used; avoid animation that delays essential tasks.
- Ensure QR scanning has clear permission-denied and camera-unavailable states. Any fallback must follow the same server-side security checks.

## Frontend implementation boundaries

- Use HTML5, CSS3, and vanilla JavaScript only.
- Use the documented backend API for data and actions; never connect the browser directly to PostgreSQL/RDS or S3 with AWS credentials.
- Treat client-side checks as convenience only. The Express backend remains responsible for input validation, authentication, authorization, and business rules.
- Keep reusable interface elements consistent through ordinary project CSS and JavaScript patterns; do not add a component framework or CSS framework.
- Do not put secrets, private QR credentials, or sensitive student data into page markup, browser logs, or local assets.

## Core screens to design consistently

The detailed specification defines exact screens. At a minimum, keep these journeys visually coherent:

1. Sign-in and role-appropriate navigation.
2. Student event discovery, event details, and registration confirmation.
3. Student universal QR presentation.
4. Organizer event management and attendee scanning.
5. Attendance review and scoped export.
6. Profile and sign-out, plus loading, empty, and error states throughout.

## Design review checklist

Before accepting a screen, confirm:

- The page has one clear primary task and a readable content hierarchy.
- It uses the approved light visual direction, restrained colors, and consistent spacing.
- It works at mobile widths and with keyboard navigation.
- Form labels, status messages, validation, and focus are clear.
- Loading, empty, success, error, and denied states are considered where relevant.
- The screen does not imply a backend action succeeded before it receives confirmation.
- No prohibited frontend framework, CSS framework, gradients, or visual effects have been introduced.
- Role-sensitive information is not exposed in the interface or API response to unauthorized users.

## Related documents

- `06-UI-UX-SPECIFICATION.md` — detailed screens, components, and behavior
- `03-ARCHITECTURE.md` — frontend/backend boundaries and system flow
- `07-SECURITY.md` — authentication, authorization, and data protection
- `09-TESTING.md` — frontend and end-to-end verification
- `AGENTS.md` — project-wide implementation and design constraints
