# The Intern's Surgical Handbook

**An independent, mobile-friendly surgical education prototype for the transition from medical student to surgical intern.**

> Educational use only. Not intended for clinical decision-making, credentialing, patient records, institutional workflow, or emergency response. Not affiliated with a medical school, hospital, the ACS, or any guideline authors. The medical content is a draft and has **not** been independently peer reviewed. Always follow local protocols, appropriate supervision, and current authoritative sources.

## What works today

- **19 searchable articles: 13 clinical rapid-reference notes and 6 new Intern Essentials chapters** for on-call pages, acute surgical consultation, and basic ward workflow.
- **Twelve reusable practice checklists** for pre-rounding, postoperative checks, consults, I-PASS, and OR readiness.
- **Five fictional decision cases** with sequential questions, teaching feedback, and primary references.
- **Bookmarks, progress markers, and checkbox persistence** using browser `localStorage`.
- **Keyboard search:** `⌘K`, `Ctrl+K`, or `/`.
- **Light/dark mode**, mobile-friendly navigation, print-ready article view, and zero external runtime dependencies.
- Reference links and dated editorial disclosures on every applicable guide.

The content was drafted and expanded October 27, 2026. Intern Essentials is an original educational adaptation inspired by **Stony Brook Department of Surgery, _A Survival Guide and Summary of What Every Surgical Intern Should Know_ (revised by Dan Rutigliano, DO)**. We link to the public source and do not reproduce its document text or its institution-specific policies. This handbook is independent and not endorsed by Stony Brook. The source library includes ACS INCISE, AHRQ, SCCM 2026 Surviving Sepsis Campaign guidance, NICE NG89, KDIGO AKI guidance, CDC SSI resources, WHO surgical safety resources, 2026 ACGME Common Program Requirements (Residency), the Stony Brook intern survival guide, and the 2025 edition of the WSES appendicitis guideline published in 2026.

## Intern Essentials expansion (v0.2)

A dedicated **Intern essentials** tab contains six original, linked chapters:

1. The dependable surgical intern — escalation, honesty, teamwork and accountability.
2. A day in the life — pre-rounding, OR, afternoon reassessment and sign-out.
3. Prioritizing the surgical task list — risk, timing, ownership and closed-loop completion.
4. Night coverage — watchers, pages, reassessment and morning handoff.
5. Communication, documentation and safe handoffs — SBAR, I-PASS, accurate records, discharge.
6. Professional growth, teaching and sustainable practice — learner supervision, teamwork, 2026 ACGME work-hour basics.

Seven new educational checklists and two fictional cases practice tasks and escalation decisions. These are **learning aids only** and are not substitutes for a hospital's official workflow, patient chart or training requirements.

### Scope and source policy

The original Stony Brook source contains advice from its local training environment. This project retains broadly useful ideas but does **not** reproduce its prose or present local scheduling, phone escalation instructions, dress customs or the institution's EHR workflow as universal medical policy. Current ACGME limits are sourced directly from the July 2026 requirements and may coexist with more specific institutional requirements.

## Preview locally

You can open `index.html` directly in a modern browser. Or serve it locally:

```bash
cd interns-surgical-handbook
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

No package installation or build is necessary.

## Run integrity tests

```bash
node tests/smoke.js
```

This checks all content IDs, source links, case-choice structure, navigation rendering, practice-case transitions, and bookmark persistence. This is **not** a substitute for browser compatibility testing or clinical peer review.

## GitHub Pages deployment (current)

This site is published inside the existing GitHub Pages repository [`arbioeng/arbioeng.github.io`](https://github.com/arbioeng/arbioeng.github.io) on the `master` branch, in the folder `interns-surgical-handbook/`.

- **Published URL:** https://arbioeng.github.io/interns-surgical-handbook/
- **Source:** https://github.com/arbioeng/arbioeng.github.io/tree/master/interns-surgical-handbook
- To redeploy, commit changed files to that directory in `master`; Pages must be configured to deploy from `master` `/ (root)` (unless using a custom GitHub Actions deployment).
- If the published link fails, check repository **Settings → Pages** and the deployment status. Do not assume visibility just because a commit succeeded.

GitHub Pages sites are generally public. Keep identifiable patient information, institutional credentials and restricted materials out of the repository.

## Update content without touching layout

All topics, cases, source links and checklists are in `assets/data.js`:

- `sources`: bibliographic links and guideline editions.
- `articles`: `id`, `title`, `category`, `urgency`, `summary`, `redFlags`, `sections`, `pearl`, and `refs`.
- `checklists`: unique ID, description, group and ordered items.
- `cases`: fictional stem, observations, decision steps and answer feedback.

A case uses one preferred teaching choice per step; it does not represent a validated clinical scoring rubric. Update `assets/data.js`, commit, and push. Hard-refresh if you see an old cached version.

## Data privacy and syncing

There is **no server-side database and no account sign-in**. Favorites, dark mode, completed reading markers and checklist progress are saved to **this browser only** through `localStorage`. They do **not** sync across devices, GitHub accounts, or private browser sessions. Clearing browsing data will clear this state. Do not enter real patient data.

## What should happen before clinical use or an educational study?

- Obtain independent clinical review and establish a scheduled guideline-maintenance process.
- Define target learners, success measures, and a reproducible content-review protocol.
- Assess usability and learning outcomes in a pilot study with appropriate permissions.
- For any patient-care deployment, complete institutional approval, security and privacy assessment, testing and human-factors review. This prototype is **not** that product.

## Technical architecture

Vanilla HTML + CSS + JavaScript. Hash-based navigation allows deep links on GitHub Pages without server rewrites. No external analytics, third-party scripts, fonts, libraries, patient-level data or backend APIs are required. The `index.html` entry point loads `assets/data.js` and `assets/app.js`.

## Licensing

The website's original source code and authored educational content are made available under the included MIT license. External references retain their respective publishers' copyrights and licenses. The website links to (and does not reproduce) those resources.