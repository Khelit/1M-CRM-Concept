# Design brief: hotel CRM clickable prototype

**Agents: read this file instead of the source folder.** It is the distilled, current truth for
the prototype. Only open a source file if a task names it. Kept up to date by the orchestrator.

Status: **DESIGN COMPLETE (15 Nov 2026). 36 screens + index, gaps, coverage. Both parts built, audited by Opus, walked by fresh testers, fixed. Open items: native Nepali review (NEPALI-REVIEW.md), BS dates, decisions on the gaps page.**
Done: `assets/app.css`, `assets/steps.js` (step cards, gaps, coverage = single source),
`assets/shell.js`, index / gaps / coverage pages, reference screens `a/A05-departments.html`
(Settings desktop) and `b/B05-housekeeper-phone.html` (staff phone). Fake data: `DATA.md`.

### Builder rules (every screen agent)
1. Copy the head, `<body data-step>` and chrome of the closest reference screen exactly.
   Settings screens: same plum sidebar as A05, move `class="on"` to your item.
2. Only classes from `assets/app.css`. No `<style>` blocks, no `<script>`. Small inline
   `style=""` for layout only; report anything you needed that app.css lacks.
3. States: `<section class="state" data-state="x" data-label="Label">`. Buttons that move the
   story inside a screen use `data-show="state"`; links to another step use `data-go="B03"`.
4. Icons: `<svg class="ic"><use href="#i-NAME"/></svg>`; names are the keys of `I` in shell.js.
5. Titles, people and numbers must match steps.js, §3 and DATA.md. Never recompute money.
6. Self-check: screenshot with headless Edge, look at it, fix, then report.
7. Work-mode chrome (Part B desktop): sidebar `side` (ink), no mode banner, `.modes` Work on.
   Front desk sidebar: brand "Dhaulagiri Courtyard"/"Front desk"; WORK: My Work (inbox), Pending drafts (ai),
   Arrivals today (cal), Departures today (door), In-house (bed), Pipeline (layers), Room status (map);
   foot "Prakash Tamang · Front Desk Agent". Analyze screens: `side side--analyze`, banner
   `mode-banner--analyze` "ANALYZE · read-only", `.modes` Analyze on (class "on analyze").


---

## 0. Scope (from the user; never bend)

- Clickable **design prototype**, not an MVP. Plain HTML + CSS + a little JS for clicks.
- No back end, database, API, login, framework, build step or tests.
- All data fake and written into the screens. A click only navigates or changes what is shown.
  **If you are writing logic that calculates, validates or stores, stop and hard-code the result.**
- Effort goes into: look, screen order, wording, whether hotel staff could use it.
- Use only fields, stages and rules that exist in the source folder (summarised below). Anything
  else goes on the GAPS list (section 7), never silently invented.

## 1. Output layout

```
designs/
  BRIEF.md            this file
  assets/app.css      the ONE shared stylesheet (tokens + components)
  assets/shell.js     the ONE shared script: step registry, top strip, side panel,
                      state switch, play mode. Screens contain no other JS.
  index.html          process map (Part A by day, Part B as guest journey)
  gaps.html           "What was missing" table (rendered from shell.js registry)
  coverage.html       PRD area -> screens, unmarked areas flagged
  a/A01-scope.html ... a/A18-publish.html  (+ a/A17b-billing-permit.html)
  b/B01-whatsapp-draft.html ... b/B11b-report.html
```

Screen file contract (every screen):
- `<body data-step="A07" data-device="desktop|phone">`, links `../assets/app.css` and
  `../assets/shell.js`. Shell injects the top strip and side panel; the screen never draws them.
- Multiple states = sibling `<section class="state" data-state="filled" data-label="Filled">`.
  First one is the default. Shell builds the state switch from these. No other JS.
- Desktop screens: 1280 px canvas. Phone screens: 360 x 760 frame (`.phone` component).
- Every screen shows (via shell, from the registry): step number, who uses it, what they do,
  what it produces.

## 2. Design system rules

Visual language is inherited from the three reference prototypes. Tokens (use these names):

```
--ink:#14181B --ink-2:#48525A --ink-3:#7C868D --ink-4:#A7AFB4
--canvas:#E3E6E1 --paper:#FFFFFF --wash:#F6F7F4
--line:#DEE2DC --line-soft:#EDEFEA --line-hard:#C9CFC7
--pine:#17453B --pine-2:#2A6255 --pine-soft:#E8F0EC     (Work mode, primary action, success)
--brass:#96690F --brass-soft:#F8F0DC                     (warning, due soon, draft)
--rose:#8E3030 --rose-soft:#F8E9E6                       (late, error, cancel, destructive)
--slate:#2A5570 --slate-soft:#E8EFF4                     (Analyze mode, info, AI)
--plum:#5B3A63 --plum-soft:#F0E9F2                       (Settings mode)
fonts: Newsreader (serif, headings only), IBM Plex Sans (UI), IBM Plex Mono (ids, numbers, labels)
radius 6px
```

Modes must look different at a glance:
| Mode | Sidebar | Top bar marker |
|---|---|---|
| Work | ink `#14181B` | none |
| Analyze | slate-dark | "ANALYZE · read-only" |
| Settings | plum-dark `#2E2233` | plum banner "SETTINGS · DRAFT, not live until Publish" |
| Platform (step A04 only) | ink with brass marker | "PLATFORM · our team only" |

Fixed layouts:
- **Record page**: details left (~300px), timeline centre, related right (~300px). Stage bar on top.
- **Staff phone** (00-CONTEXT §6): one main action, the biggest thing on screen; max two taps to
  finish; icon/photo first; every label Nepali + English (Nepali first, English below, smaller);
  no typing; targets >= 48px, text >= 16px; shows offline/queued state; shows what is next.
- **Bills**: Gregorian + Bikram Sambat date, bill number, legal entity + PAN, VAT 13% line,
  "Copy of Original" + print count on reprints, service charge line absent (off by default).
- **Worksheets** (steps with no software: A01-A03): paper look on `--wash`, handwritten-style
  fill areas are NOT used; it is a printable form with filled answers in mono.

Use the ui-ux-pro-max guidance for spacing/type scale/contrast; this brief wins on conflict.

## 3. The example hotel (fictional; all data fake)

- **Hotel Dhaulagiri Courtyard**, Thamel, Kathmandu. Legal entity: Dhaulagiri Courtyard Pvt. Ltd.,
  PAN 609845213, VAT registered. Fiscal year 2083/84 (mid-July to mid-July). Bill series
  `DC-8384-` + 6 digits; credit notes `CN-8384-` + 4 digits.
- **52 rooms**, floors 1-5:

| Type | Rooms | Allocation | Rate plan (Room only / B&B) |
|---|---|---|---|
| Standard | 24 (101-112, 201-212) | Pooled | NPR 6,500 / 7,800 |
| Deluxe | 18 (301-312, 401-406) | Pooled | NPR 9,500 / 11,000 |
| Premier | 8 (407-412, 501-502) | Pooled | NPR 13,500 / 15,000 |
| Courtyard Suite | 2 (503, 504) | Named | NPR 22,000 / 24,000 |

- **65 staff**, department tree (nested, 4 levels):
```
Property  Hotel Dhaulagiri Courtyard
  Division  Rooms Division
    Dept  Front Office (12)  -> Teams: Reservations (3), Front Desk (6), Bell Desk (3)
    Dept  Housekeeping (18)  -> Teams: Floors (14), Laundry (4)
  Division  Food & Beverage (16) -> Teams: Restaurant (10), Kitchen (6)
  Dept  Security (6)
  Dept  Maintenance (4)
  Dept  Finance (4)          -> Team: Accounts (4)
  Dept  Sales (2)
  Dept  Management (3)
```
- **People** (use these names consistently):

| Name | Role | Department |
|---|---|---|
| Bikash Shrestha | General Manager | Management |
| Sunita Karki | Front Office Manager + client System Admin | Front Office |
| Anil Gurung | Duty Manager | Front Office |
| Pooja Maharjan | Reservations Agent | Reservations |
| Prakash Tamang | Front Desk Agent (the hero clerk) | Front Desk |
| Dorje Sherpa | Bell Desk Porter | Bell Desk |
| Hari Bahadur Thapa | Security Guard | Security |
| Kamala Shakya | Housekeeping Supervisor | Housekeeping |
| Maya Lama | Housekeeper | Floors |
| Nisha Rai | F&B Captain | Restaurant |
| Rajesh Dangol | Accounts Officer | Accounts |
| Aashish Poudel | Implementation Lead (our side) | n/a |
| Ritu Bhandari | Migration Analyst (our side) | n/a |

- **Hero guest**: Ramesh Adhikari, from Pokhara, +977 9856-041237. 2 adults + 1 child, Deluxe, B&B,
  2 nights, 28-30 Nov 2026 (Mangsir 12-14, 2083 BS, see GAP-01). Repeat guest: 1 previous stay
  (Mar 2025). Arrives about 14:00. Request: extra bed for the child, ground-floor-near-lift not needed.
  His WhatsApp message (Roman-script Nepali, BS dates):
  > "Namaste dai, Mangsir 12 dekhi 14 samma deluxe room chahiyo, 2 jana thulo 1 jana baccha.
  > Breakfast sahit. Extra bed milcha? - Ramesh Adhikari"
- **Other guests** (for lists, boards, dashboards): Priya Sharma (Delhi, India, Indian national,
  needs immigration entry), Emma Fischer (Germany, via Booking.com), Suman & Sarita Joshi
  (VIP, anniversary, Courtyard Suite 503), Lhakpa Dolma Sherpa (agency: Himalayan Trails Pvt. Ltd.).
- **Hero folio** (fixed numbers; do not recompute):

| Line | NPR |
|---|---|
| Room night 28 Nov, Deluxe B&B | 11,000.00 |
| Room night 29 Nov, Deluxe B&B | 11,000.00 |
| Extra bed x 2 nights | 3,000.00 |
| Restaurant, dinner 29 Nov | 2,450.00 |
| Laundry 29 Nov | 600.00 |
| **Taxable amount** | **28,050.00** |
| VAT 13% | 3,646.50 |
| **Bill total** | **31,696.50** |
| Less deposit received 16 Nov (Fonepay) | 10,000.00 |
| **Balance due at checkout (Fonepay QR)** | **21,696.50** |

  Bill `DC-8384-001287`, issued 30 Nov 2026 11:42. Credit note `CN-8384-0042`: laundry charged
  in error, NPR 600.00 + VAT 78.00 = 678.00. Reprint count after reprint: 1.

## 4. What exists in the source folder (use only these)

Reservation stages (04-workflows §2): Enquiry (reply 2h) -> Held (expires 24h) -> Confirmed
(deposit, invoice same day) -> Pre-arrival (room prepared + inspected before arrival) ->
In-house (check-in < 45s, registration, room assigned, folio opened) -> Checked out (settled,
bill, room released). Side exits: Cancelled / No-show (reason recorded).

Handoff rules (04-workflows §3): Confirmed -> Deposit invoice (Accounts, same day) + confirmation
message (guest). T-24h -> Prepare room (Housekeeping, before arrival) + Confirm details and requests
(Front desk, 2h). VIP -> notify Manager + Welcome amenity (F&B). In-house -> Luggage (Bell desk 10m),
Log arrival (Security 10m), room Occupied. Checked out -> Clean and inspect (Housekeeping 45m) +
Settle bill (Accounts, same day). Late task -> duty manager, then GM after 30m. Hold expiry ->
release + notify front desk. Tasks can be "blocked by" another (inspect after clean).

Room status: clean, dirty, inspected, out of order, occupied.
Payment methods: cash, card, Fonepay QR, wallets (eSewa, Khalti), bank.
Source channels: Booking.com, Expedia, WhatsApp, Viber, Messenger, phone, walk-in, agency.
AI draft states: needs info, pending review, confirmed, rejected. Draft fields: guest name, dates,
room type, number of guests, rate, agent, requests, each with confidence.
Guest fields: name, phone, email, id_type, id_number (masked by role), nationality, flags, preferences.
Registration fields: passport no, visa no, visa expiry, arrived from, next destination, purpose,
signature, ID image. Identity rule order: exact phone, exact email, exact ID, fuzzy name -> review.
Permission per role/object: view, add, edit, delete, record scope, field masks, allowed transitions.
View lenses: table, board, calendar, timeline, dashboard. Nav: locked items, admin-set, user slots.
KPIs: occupancy, ADR, RevPAR, task deadline compliance, bookings by channel.
Bills: append-only; credit note or cancel with reason; reprint "Copy of Original" + count;
tax sync queue (queued, synced, failed + retry); shift close and day end lock totals by method.

## 5. Screen list

Desktop = office screen 1280px. Phone = staff phone 360px. Model = who builds it.

### Part A: Creating the CRM (Settings mode). Grouped by day.

| # | Day | Screen | Who | Device | Model |
|---|---|---|---|---|---|
| A01 | 1 am | Scope worksheet (no software) | Consultant + GM | Paper/desktop | Sonnet |
| A02 | 1 am | Booking walk-through worksheet (no software) | Consultant + dept heads | Paper | Sonnet |
| A03 | 1 am | Vocabulary / objects worksheet (no software) | Impl lead + client admin | Paper | Sonnet |
| A04 | 1 pm | Tenant, legal entity, blueprint install (Platform mode) | Impl lead | Desktop | Sonnet |
| A05 | 1 pm | Department tree with nesting | Impl lead | Desktop | Sonnet |
| A06 | 1 pm | Roles and permissions matrix | Impl lead + client admin | Desktop | Sonnet |
| A07 | 2 | Object and field editor (Reservation) | Impl lead | Desktop | Sonnet |
| A08 | 2 | Guest identity rule + live test | Impl lead | Desktop | Sonnet |
| A09 | 2 | Record page layout editor | Impl lead | Desktop | Sonnet |
| A10 | 3 | Workflow stages and deadlines | Impl lead + dept heads | Desktop | Sonnet |
| A11 | 3 | Rooms, rates, tax rule, payment methods | Impl lead | Desktop | Sonnet |
| A12 | 3 | Handoff rules (from A02) | Impl lead + dept heads | Desktop | Sonnet |
| A13 | 3 | Saved views | Impl lead | Desktop | Sonnet |
| A14 | 3 | Navigation composer + preview as role | Client admin | Desktop | Sonnet |
| A15 | 4 | Import history + duplicate review | Migration analyst | Desktop | Sonnet |
| A16 | 4 | Users / staff invites (+ staff phone first-open PIN) | Client admin | Desktop + phone | Sonnet |
| A17 | 5 | End-to-end test run in sandbox | Impl lead + every role | Desktop | Sonnet |
| A17b | parallel | Electronic billing permit checklist (worksheet) | Impl lead + accounts | Paper | Sonnet |
| A18 | 5 | Publish, launch checks, handover test | Impl lead + client admin + GM | Desktop | Sonnet |

### Part B: Using the CRM (Work and Analyze modes). One guest, message to checkout.

| # | Screen | Who | Device | Model |
|---|---|---|---|---|
| B01 | WhatsApp message arrives, becomes AI draft (Pending drafts queue) | Prakash, front desk | Desktop | Sonnet |
| B02 | Review draft beside message, confirm | Prakash | Desktop | Sonnet |
| B03 | Reservation record page: stage bar, timeline, related | Front desk | Desktop | Sonnet |
| B04 | My Work inbox, front desk | Prakash | Desktop | Sonnet |
| B05 | Housekeeper phone: Prepare room, two taps | Maya | Phone | Sonnet |
| B05b | Supervisor phone: Inspect room | Kamala | Phone | Sonnet |
| B06 | Check-in + guest registration card | Prakash + guest | Desktop (+ signature pad) | Sonnet |
| B06b | Foreign guest: immigration export sheet | Prakash | Desktop | Sonnet |
| B07 | Bell desk + security tasks on phone (two phones) | Dorje, Hari | Phone | Sonnet |
| B08a | Manager live dashboard (Analyze) | Anil / Bikash | Desktop | Sonnet |
| B08b | Room status board | Kamala / front desk | Desktop | Sonnet |
| B09a | Checkout: folio review | Prakash | Desktop | Sonnet |
| B09b | Fonepay QR payment | Prakash + guest | Desktop | Sonnet |
| B09c | Tax bill (print view) + tax sync status | Prakash | Desktop | Sonnet |
| B10 | Credit note + reprint | Rajesh, accounts | Desktop | Sonnet |
| B11a | Shift close and day end | Prakash / Anil | Desktop | Sonnet |
| B11b | Occupancy and revenue report (Analyze) | Bikash | Desktop | Sonnet |

Meta pages: index (process map), gaps, coverage. Built with the shell by Opus.

### Model plan

| Task | Model |
|---|---|
| This brief, step cards, gap analysis, coverage mapping | Opus 5.5 (orchestrator) |
| `app.css` design system + `shell.js` + index / gaps / coverage pages | Opus 5.5 |
| Expanded fake data sheet (room-by-room status, 20 task rows, guest list) | Haiku 5.5 |
| Nepali labels for staff phone screens | Sonnet 5.5 (needs native-speaker review, GAP-02) |
| Each screen batch (A01-A06, A07-A12, A13-A18, B01-B04, B05-B07, B08-B11) | Sonnet 5.5, max 4 in parallel |
| Audit of every batch against its step cards; final consistency audit | Opus 5.5 |
| Fresh walkthrough tester at checkpoints 3 and 4 | Sonnet 5.5 (did not build anything) |
| Fixes from audits | Sonnet 5.5; escalate to Opus only after a failed re-review |

## 6. Step cards

Format: **Who / device / just before** · **Sees, decides, enters** · **Next, for whom** ·
**Can go wrong** · **States to draw** · **Checked against sources**.

### Part A

**A01 Scope worksheet**
- Who: Aashish (impl lead as consultant) with Bikash (GM), meeting room, printed sheet. Before: contract signed.
- Sees/decides: what breaks today, definition of success, in scope, explicitly phase two
  (channel manager, restaurant POS, inventory, payroll: PRD 14.9/14.10/Q5), who inherits the system (Sunita), go-live date, bills in scope Y/N (A1).
- Next: signed one-pager -> A02.
- Wrong: GM wants "everything Aegis has" (PRD 17.3); billing decision unknown blocks A17b.
- States: filled. Sources: 04 §1.1, runbook step 1, PRD §12.

**A02 Booking walk-through worksheet**
- Who: Aashish + heads of Front Office, Housekeeping, Security, Accounts, walking the building. Before: A01.
- Sees/enters: one real past booking traced desk to desk: each handoff, who, how today, delay, which becomes a rule.
- Next: handoffs list feeds A12; SLAs feed A10.
- Wrong: staff describe the ideal, not the real process; a desk not visited (Bell desk, Security).
- States: filled. Sources: 04 §1.2, 04 §3.

**A03 Vocabulary / objects worksheet**
- Who: Aashish + Sunita. Before: A02.
- Decides: what staff call things -> object names (Guest, Reservation "Booking", Room, Folio "Bill", Task "Kaam / Jobs"), Nepali labels (label_ne), what is deliberately absent.
- Next: names used in A07; Nepali labels used everywhere.
- Wrong: two departments use different words for one thing.
- States: filled. Sources: 04 §1.3, 03 object_def.label_ne.

**A04 Tenant, legal entity, blueprint (Platform mode)**
- Who: Aashish, desktop, Platform mode (our team only). Before: A01-A03 signed.
- Sees/enters: tenant name, legal entity name + PAN + VAT registered, fiscal year 2083/84, choose Hotel blueprint (objects/stages/rules/views counts), sandbox created.
- Next: sandbox tenant; Sunita gets admin access -> A05.
- Wrong: PAN missing (blocks billing), wrong blueprint, second legal entity needed (restaurant under other PAN).
- States: choose blueprint; installed. Sources: 04 §1.4, 03 tenant/legal_entity/fiscal_year.

**A05 Department tree**
- Who: Aashish, Settings. Before: A04 installed blueprint's default tree.
- Sees/decides: nested tree (section 3), unit types, staff count per unit, delete what blueprint brought but hotel lacks, which unit owns which workflow (inherit/extend badges).
- Next: units used by roles (A06) and stage owners (A10).
- Wrong: depth > 5 advisory; deleting a unit that owns a stage; moving a unit re-parents its staff.
- States: tree; unit selected with details panel. Sources: 04 §1.5, shell-architecture frame 01, 03 org_unit.

**A06 Roles and permissions**
- Who: Aashish + Sunita (hands on keyboard). Before: A05.
- Sees/decides: 11 roles x object (Reservation shown) six-way permission; who can advance which stage; Guest ID visible / masked / hidden.
- Next: roles used by rules (A12), nav (A14), users (A16).
- Wrong: housekeeper can see passport numbers; nobody can advance Checked out; role with no permission at all.
- States: matrix; warning state (a stage with no role able to advance). Sources: 04 §1.6, 03 permission_set.

**A07 Object and field editor**
- Who: Aashish. Before: A03 vocabulary.
- Sees/edits: objects list (Guest, Reservation, Room, Folio, Task + custom), Reservation fields: trim, rename, add (WhatsApp number, ETA), label_ne, required, PII class, field key locked once published; lookups (source channel).
- Next: fields available to layout (A09) and views (A13).
- Wrong: deleting a field rules depend on; renaming a published key (blocked); fixed fields of system objects cannot be deleted.
- States: field list; add-field panel open. Sources: 04 §1.7, 03 object_def/field_def/lookup.

**A08 Identity rule**
- Who: Aashish. Before: A07.
- Sees/edits: ordered rules (phone exact +977 normalised, email, ID, name fuzzy -> review), live test with sample input.
- Next: drives repeat-guest match in B02 and duplicate review in A15.
- Wrong: fuzzy name auto-merge (forbidden); shared family phone number.
- States: rules + test matched; test ambiguous -> review. Sources: 04 §1.8, 03 identity_rule.

**A09 Record page layout**
- Who: Aashish. Before: A07.
- Sees/edits: fixed frame (left details / centre timeline / right related), choose fields per panel, locked-after-confirmation fields, hidden-until-stage fields, preview as role.
- Next: what B03 looks like.
- Wrong: masked field placed visible for a role without permission (preview shows mask).
- States: editor; preview as Front Desk Agent. Sources: 04 §1.9, brief §2.

**A10 Workflow stages**
- Who: Aashish + dept heads. Before: A05, A06, A02 SLAs.
- Sees/edits: 6 stages + 2 exits, owner unit, form, deadline, who may advance, version (draft v2 / published v1).
- Next: stages drive B03 stage bar and A12 triggers.
- Wrong: stage without owner or advancer (publish check fails); changing a published version.
- States: stage list; one stage open. Sources: 04 §2, 03 workflow_def.

**A11 Rooms, rates, tax, payment methods**
- Who: Aashish + Rajesh. Before: A04 legal entity.
- Sees/enters: 4 room types, 52 rooms by floor, pooled/named, rate plans, overbooking not allowed, hold expiry 24h, tax rule VAT 13% (data), service charge off, payment methods enabled (Fonepay merchant ID).
- Next: availability for B02; folio + bill for B09.
- Wrong: room number duplicated; rate missing for a type; Fonepay merchant not set (GAP-07).
- States: room types; rooms grid. Sources: 04 §1.11, 03 §4-5, 08 §4.

**A12 Handoff rules**
- Who: Aashish + dept heads, reading each rule aloud. Before: A02, A10.
- Sees/edits: rules as sentences "When / then / for / due", each tagged with the A02 handoff it came from; escalation; hold expiry; dry run.
- Next: rules create B04/B05/B07 tasks.
- Wrong: rule loop; rule for a role with no staff; inspect not blocked by clean.
- States: list; dry-run result. Sources: 04 §1.12, 04 §3, 03 rule_def.

**A13 Saved views**
- Who: Aashish. Before: A07, A10.
- Sees/edits: views = object + lens + filter + shared with (Arrivals today, Departures today, Pending drafts, In-house, Pipeline board, Room status board, My tasks, Unpaid bills, Occupancy dashboard).
- Next: views pinned in A14; appear in B04, B08.
- Wrong: view shared with role lacking permission (shows lock).
- States: list. Sources: 04 §1.13, 03 view_def.

**A14 Navigation composer**
- Who: Sunita (client admin drives). Before: A13.
- Sees/edits: per-role sidebar, locked "My Work" first, admin-set, user slots, preview as role (Housekeeper 4 items vs GM).
- Next: what each role sees in Part B.
- Wrong: item without permission cannot be pinned (shown greyed).
- States: composing Front Desk Agent; composing Housekeeper with phone preview. Sources: 04 §1.14, 03 nav_def.

**A15 Import + duplicates**
- Who: Ritu (migration analyst). Before: A08 identity rule.
- Sees/decides: file from old system, rows read, guests created, auto-merged on exact match, pairs for review (merge / keep both), rejected rows; never auto-merge fuzzy.
- Next: guest history for B02 repeat match. Also cutover checklist (PRD 16.4, GAP-08).
- Wrong: bad file (columns not mapped), fuzzy pairs, future reservations from old system (double-book risk at cutover).
- States: mapping; review pairs; done. Sources: 04 §1.15, PRD 16.4.

**A16 Users**
- Who: Sunita alone. Before: A06 roles.
- Sees/enters: 65 staff, role, department, phone, invite by SMS, status; no shared logins. Phone preview: staff opens link, sets 4-digit PIN, language Nepali/English.
- Next: staff exist for task routing.
- Wrong: shared "frontdesk" login requested (refused); staff with no smartphone (GAP-09); phone number reused.
- States: list; phone first-open. Sources: 04 §1.16, 00 §3.6, 03 app_user.pin_hash.

**A17 Test run**
- Who: Aashish + one person per role on their own devices, sandbox. Before: A04-A16.
- Sees: fake guest "Test Sharma" through every stage, who did what on which device, pass/defect, defect list.
- Next: defects fixed -> A18.
- Wrong: step skipped when late; defect in billing found here.
- States: in progress; complete with 3 defects. Sources: 04 §1.17.

**A17b Billing permit checklist (worksheet, parallel track)**
- Who: Aashish + Rajesh + hotel's tax adviser. Before: A11 (bills configured). Must finish before A18.
- Sees: stage-2 package checklist (08 §3): acceptance letter, setup file, manual, system design, backup details, 20 sample bills, original + reprint, sales report, credit note, cancelled bill, audit trail report, test sync proof; portal application; status.
- Next: permit number recorded -> A18 launch check.
- Wrong: permit not issued by go-live date (hotel cannot bill through system).
- States: in progress. Sources: 04 §1 note, 08 §3.

**A18 Publish + handover**
- Who: Aashish + Sunita + Bikash. Before: A17 passed.
- Sees: launch checks, sandbox vs production diff, Publish button, then handover test (Sunita adds a field, changes room-prep SLA, adds a user, unaided).
- Next: live system; Part B begins.
- Wrong: a check fails (Publish disabled with reason); billing permit missing (bills switched off).
- States: checks failing; all pass; handover passed. Sources: 04 §1.18.

### Part B

**B01 Message becomes AI draft**
- Who: Prakash, front desk desktop, Work mode. Before: Ramesh sends WhatsApp at 09:12, 15 Nov.
- Sees: Pending drafts queue (count badge), the message verbatim, draft fields each with confidence, state.
- Decides: open draft.
- Next: B02.
- Wrong: required field missing -> "needs info" with suggested clarifying reply (sent only if admin enabled auto-send); AI down -> banner "AI unavailable, use the normal form" + manual form link; Nepali BS dates must be read correctly.
- States: draft ready; needs info; AI unavailable; empty queue. Sources: 04 §5, 03 nl_draft.

**B02 Review and confirm**
- Who: Prakash. Before: B01.
- Sees: message left, draft card right (not a form): fields, confidence, repeat-guest match "Matched on phone, 1 previous stay", availability for dates (Deluxe 6 free), rate B&B 11,000.
- Decides/enters: edit any field (tap to change), confirm with one tap.
- Next: reservation created at Held (hold 24h) -> B03. Draft records who confirmed and what changed.
- Wrong: no Deluxe available (offer other type); guest asks to change dates mid-review; reject draft.
- States: reviewing; edited field highlighted; no availability. Sources: 04 §5.6-7, PRD 6.3.

**B03 Reservation record page**
- Who: front desk / any role with view. Before: B02.
- Sees: stage bar; left details (guest, dates, type, room, ETA, adults/children, source WhatsApp, rate, total, Guest ID masked); centre timeline (message, AI draft confirmed by Prakash + edits, stage changes, tasks, payments); right related (folio, open tasks, past stays, preferences).
- Decides: advance stage (Held -> Confirmed by recording deposit; then later stages).
- Next: Confirmed fires deposit invoice task (Accounts) + confirmation message.
- Wrong: hold expiry warning; guest changes mind -> cancel with reason; amend dates = transition with reason.
- States: Held (hold expires in 23h); Confirmed (deposit 10,000 Fonepay); In-house; Cancelled. Sources: 04 §2-3, runbook step 9.

**B04 My Work inbox (front desk)**
- Who: Prakash, start of shift, 27 Nov. Before: rules fired T-24h.
- Sees: my tasks grouped Overdue / Due today / Upcoming: "Confirm details and requests: Ramesh Adhikari" (2h), pending drafts, arrivals today count, holds expiring.
- Decides: open task, mark done (with note: "Extra bed confirmed, ETA 14:00").
- Next: room assignment decision (GAP-04).
- Wrong: empty inbox; overdue task (rose); offline read-cache banner.
- States: filled; overdue; empty. Sources: 04 §3, 02 §4.

**B05 Housekeeper phone: Prepare room**
- Who: Maya, budget Android, Floors team, 28 Nov 10:30. Before: push "Prepare room 304".
- Sees: task list (next first), big card: room 304, Deluxe, "extra bed", due before 14:00; one big button.
- Taps: 1 open task, 2 "Done / सकियो" (optional photo). Room becomes clean, inspect task unblocked.
- Next: B05b for Kamala.
- Wrong: offline (done queued, shows "will send when online"); late (rose, due passed); room out of order (report problem = choose icon).
- States: list; task; done; offline queued; late. Sources: 00 §6, 04 §3, PRD 6.5.

**B05b Supervisor phone: Inspect room**
- Who: Kamala. Before: Maya marked 304 done.
- Taps: Pass / Fail (fail = choose reason icon, sends back to Maya). Room -> inspected.
- States: inspect; passed; failed back. Sources: 04 §2 Pre-arrival, 04 §3 blocked-by, 03 room.status.

**B06 Check-in + registration card**
- Who: Prakash with Ramesh at the desk, 28 Nov 14:05. Before: room 304 inspected.
- Sees: arrival found (from Arrivals today), pre-filled from reservation; room 304 assigned (inspected); registration card: name, nationality, ID type + number, arrived from, next destination, purpose, signature on pad, ID photo; timer target < 45s; folio opened.
- Decides: Check in.
- Next: In-house fires Luggage (Bell desk), Log arrival (Security), room Occupied, together.
- Wrong: room not ready (choose another inspected Deluxe); guest early; ID photo fails; walk-in with no reservation.
- States: Nepali guest (Ramesh); foreign guest variant (Priya Sharma: passport, visa fields); room not ready. Sources: 04 §2, 08 §6, PRD 16.9, 03 guest_registration.

**B06b Immigration export sheet**
- Who: Prakash, after checking in a foreign guest. Before: B06 foreign variant.
- Sees: one screen with fields in the immigration system's order to copy from; mark "Entered" with time.
- Wrong: direct connection unknown (Q3) so this is manual; Indian guest overnight also required.
- States: to enter; entered. Sources: 08 §6, 01-map 16.1.

**B07 Bell desk + security phones**
- Who: Dorje (bell desk) and Hari (security), shown side by side. Before: check-in at 14:06.
- Sees: Dorje: "Luggage room 304, 3 bags" 10 min, big Done. Hari: "Log arrival: Ramesh Adhikari, room 304" with VIP/watchlist flag area, big Done.
- Next: completions appear on B08a feed.
- Wrong: late (escalation to duty manager), offline.
- States: task; done; late. Sources: 04 §3, PRD persona Security.

**B08a Manager dashboard (Analyze)**
- Who: Anil (duty manager) / Bikash. Before: tasks in flight.
- Sees: live task feed (completion cascade for Ramesh), late/escalated alerts, pipeline (Enquiry/Held/Confirmed/In-house counts, pending AI drafts), occupancy today and revenue snapshot, channel sync status.
- Next: open a late task, reassign.
- Wrong: escalation after 30 min reaches GM; no data at day start.
- States: normal; escalation. Sources: PRD 6.6, 04 §3.

**B08b Room status board**
- Who: Kamala / front desk. 52 rooms by floor, colour by status (clean, dirty, inspected, out of order, occupied), filter.
- States: board. Sources: PRD 6.7, 03 room.status.

**B09a Checkout: folio review**
- Who: Prakash with Ramesh, 30 Nov 11:30. Before: guest at desk.
- Sees: folio lines (section 3), deposit, balance 21,696.50; buyer name / PAN (optional for individuals); choose payment method.
- Next: B09b.
- Wrong: disputed charge (laundry) -> note, fixed later by credit note (B10); split payment.
- States: review. Sources: 04 §4.1-2, 03 folio.

**B09b Fonepay QR**
- Who: Prakash shows QR on customer-facing screen; Ramesh pays from phone.
- States: waiting for payment (exact amount); verified -> payment recorded; failed/timeout -> retry or other method.
- Sources: 04 §4.2, 01-map 16.2.

**B09c Tax bill**
- Who: Prakash prints; Ramesh receives.
- Sees: bill DC-8384-001287, AD + BS date, entity + PAN, lines, taxable, VAT 13%, total, payment, "cannot be changed" note, tax sync status (queued -> synced; failed + retrying).
- Next: Checked out fires Clean and inspect (Housekeeping) + Settle bill (Accounts).
- States: issued + queued; synced; sync failed retrying. Sources: 04 §4.3-4, 08 §4.

**B10 Credit note + reprint**
- Who: Rajesh, accounts, 30 Nov 15:00. Before: Ramesh called: laundry was not his.
- Sees: original bill (unchanged), create credit note: reason (choose + note), amount, preview CN-8384-0042; reprint original -> "Copy of Original", print count 1.
- Wrong: whole bill wrong -> cancel with reason (both new records); attempt to edit bill impossible (no edit button, explained).
- States: credit note; reprint preview. Sources: 04 §4.5-6, 00 §3.2.

**B11a Shift close and day end**
- Who: Prakash (shift close), Anil (day end), 30 Nov 22:00.
- Sees: totals by payment method (expected vs counted cash), bills issued, credit notes, tax sync pending count; Close shift; Day end locks the day.
- Wrong: cash mismatch (reason required); unsynced bills block nothing but show; open folios at day end.
- States: shift close; day end locked. Sources: 04 §4.7, PRD 14.8.

**B11b Occupancy and revenue report (Analyze)**
- Who: Bikash. Sees: occupancy, ADR, RevPAR, revenue, task deadline compliance, bookings by channel, date range AD/BS.
- States: report. Sources: PRD 6.9, 01-map.

## 7. GAPS (running list)

| ID | Step | What is missing | What we did | Needs your decision? |
|---|---|---|---|---|
| GAP-01 | All bills, B01 | Exact BS dates. Folder gives no converter; I approximated Mangsir 12, 2083 = 28 Nov 2026 | Used approximate BS dates, marked in data | Yes: verify dates before presenting |
| GAP-02 | Staff phones | No Nepali copy exists in the folder | Sonnet drafts Nepali labels | Yes: native speaker review |
| GAP-03 | B02 -> B03 | Draft confirm creates the reservation at which stage? Folder: Enquiry -> Held. Deposit moves to Confirmed | Confirm creates Held + 24h hold; deposit on B03 moves to Confirmed | Confirm |
| GAP-04 | B04 -> B05 | Pooled types assign the room at check-in (03), but Prepare room (T-24h) needs a room number | Show front desk assigning room 304 while doing "Confirm details" task; noted | Yes: when is the room assigned? |
| GAP-05 | B05 -> B06 | No inspection screen in the brief's list, but Pre-arrival requires "prepared and inspected" | Added B05b supervisor inspect | No |
| GAP-06 | B06 | Foreign guest immigration entry has no screen | Added B06b export sheet (08 §6) | No |
| GAP-07 | A11 | No setup step for tax rule, fiscal year, bill series, payment methods / Fonepay merchant | Put them on A11 (rooms and rates) as extra panels | Confirm placement |
| GAP-08 | A15 | Cutover from the old system (future reservations, open folios) not designed (PRD 16.4) | Cutover checklist panel on A15 | Yes: is cutover in scope for the prototype? |
| GAP-09 | A16 | Staff without a smartphone or with shared phone | Noted on A16; no screen | Yes |
| GAP-10 | A17b | Billing permit step exists in 04 only as a note | Added A17b worksheet before A18 | No |
| GAP-11 | B03 | Confirmation message to guest (rule) has no template or preview | Shown as timeline entry with message text | Template content is yours |
| GAP-12 | B08a | Channel manager is phase 6; OTA sync status has no real source yet | Dashboard shows "Channel manager not connected" tile | No |
| GAP-13 | B09a | Buyer PAN rules for individuals vs companies not confirmed (Q11) | Optional buyer PAN field | Yes (tax adviser) |
| GAP-14 | B11a | Night audit (PRD P0) vs day end: folder treats them as one | Day end = night audit; noted | Confirm |
| GAP-15 | A06/B03 | VIP / watchlist flag: who sets it, where shown | Flag on guest details; security sees it on B07 | Yes: who may set watchlist |
| GAP-16 | B01 | Voice notes (PRD 11 open question) | Not shown | No (deferred) |

## 8. Change log
- 2026-11-15 Checkpoint 2 draft written by Opus.
