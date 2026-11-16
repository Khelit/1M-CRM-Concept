# 1M-CRM Concept

A clickable design prototype of 1M-CRM, a configurable CRM for Nepal, shown with a 52-room hotel as the example.

- **Part A, creating the CRM:** the 18 setup steps an operations person follows to configure a client in five days.
- **Part B, using the CRM:** one guest from a WhatsApp message to checkout, across front desk, housekeeping, bell desk, security, manager and accounts.

Open `index.html` for the process map. Every screen has Previous/Next, a side panel explaining the step in simple words (press P to hide it), a state switch, and "Play the whole story".

Plain HTML, CSS and a little JavaScript. No build step, no back end; all data is fake.

| File | What it is |
| --- | --- |
| `index.html` | Process map, links to every screen |
| `gaps.html` | What was missing from the plan, and the decisions needed |
| `coverage.html` | Hotel requirement areas mapped to screens |
| `a/`, `b/` | Part A and Part B screens |
| `assets/` | The one shared stylesheet and script, and the step registry |
| `BRIEF.md` | Design brief for anyone (or any agent) continuing the work |
| `NEPALI-REVIEW.md` | Every Nepali label, for native-speaker review |
