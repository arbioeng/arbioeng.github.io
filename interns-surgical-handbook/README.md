# The Intern's Surgical Handbook

**An independent, mobile-friendly surgical education prototype for the transition from medical student to surgical intern.**

> Educational use only. Not intended for clinical decision-making, credentialing, patient records, institutional workflow, or emergency response. Not affiliated with a medical school, hospital, the ACS, or any guideline authors. The medical content is a draft and has **not** been independently peer reviewed. Always follow local protocols, appropriate supervision, and current authoritative sources.

## What works today

- **13 searchable rapid-reference notes** for on-call pages, acute surgical consultation, and basic ward workflow.
- **Five reusable practice checklists** for pre-rounding, postoperative checks, consults, I-PASS, and OR readiness.
- **Three fictional decision cases** with sequential questions, teaching feedback, and primary references.
- **Bookmarks, progress markers, and checkbox persistence** using browser `localStorage`.
- **Keyboard search:** `⌘K`, `Ctrl+K`, or `/`.
- **Light/dark mode**, mobile-friendly navigation, print-ready article view, and zero external runtime dependencies.
- Reference links and dated editorial disclosures on every applicable guide.

The content was originally drafted October 27, 2026. The source library includes ACS INCISE, AHRQ, SCCM 2026 Surviving Sepsis Campaign guidance, NICE NG89, KDIGO AKI guidance, CDC SSI resources, WHO surgical safety resources, and the 2025 edition of the WSES appendicitis guideline published in 2026.

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

## Publish to GitHub Pages

1. Create a new **public** repository on GitHub named `interns-surgical-handbook` (do not pre-populate with a README if uploading these files via Git).
2. From the project folder, run:

```bash
git init
git add .
git commit -m "Initial Intern's Surgical Handbook prototype"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/interns-surgical-handbook.git
git push -u origin main
```

3. In **Settings → Pages**, set **Source: Deploy from a branch**, **Branch: main**, **Folder: /(root)**, then save.
4. When GitHub finishes deployment, visit `https://YOUR-USERNAME.github.io/interns-surgical-handbook/`.

GitHub Pages generally publishes website content publicly **even when a backing repository is private**, except for specific supported private publishing configurations. Never add identifiable patient information or any private files to this repository.

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