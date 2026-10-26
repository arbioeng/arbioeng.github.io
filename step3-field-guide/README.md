# Step III — The Field Guide

A dark, Bloodborne-checklist-inspired USMLE Step 3 study tracker. Unofficial and independent; **not affiliated with USMLE, NBME, UWorld, or CCSCases**.

## Features

- Expandable five-chapter master checklist, covering preparation, biostatistics, UWorld, CCS, readiness and the exam.
- Fifteen-week roadmap, October 26, 2026 to early February 2027.
- Editable UWorld question-bank counts and accuracy.
- 173 optional CCS case-number slots with initial attempt, repeat, score and notes; target 70–100 cases, not a claim that providers currently offer 173.
- NBME / CCMSA and official sample assessment journal.
- Daily habit checkboxes, date-aware countdown, full text search, priority filters, hide-completed option.
- Automatic `localStorage` saving, plus manual export/import of progress as JSON.
- Responsive for desktop and phone; **no npm, frameworks, database or account needed**.

## Preview locally

Open `index.html` in a browser, or run a local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000/`.

Add `?demo=1` to the URL to see **sample** progress for screenshots. Demo mode is clearly labeled and does not save changes.

## Live deployment

The GitHub Pages deployment lives at `https://arbioeng.github.io/step3-field-guide/` when Pages is enabled for the existing public repository `arbioeng/arbioeng.github.io`. The site's files are isolated in the `step3-field-guide/` subdirectory. No dependencies or build step are required.

## Deployment notes

1. Create a GitHub repository, such as `step3-field-guide`.
2. Upload `index.html`, `styles.css`, `app.js`, and `data.js` at the repository root. You may also upload `README.md` and `LICENSE`.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/(root)`, and save.
5. GitHub Pages will provide the live URL, typically `https://YOUR-USERNAME.github.io/step3-field-guide/`.

This directory was added to the existing GitHub repository. GitHub Pages availability depends on the repository's Pages settings.

## Privacy and backup

Data lives in your browser's `localStorage`; publishing the code to GitHub Pages **does not sync progress** between devices. Use **Resources → Export JSON** to back up, and **Import JSON** to move data to another browser. Avoid entering confidential patient information in case notes or assessment notes.

## Clinical and administrative context

The initial checklist was structured from the supplied study-guide conversation and updated for the official Step 3 exam software in effect from March 10, 2026: Day 1 has twelve 30-minute blocks; Day 2 has nine 30-minute MCQ blocks and 13–14 CCS simulations. Official orientation links are listed in Resources. Verify the current availability of CCMSA forms and passing standards with NBME/USMLE.

- https://www.usmle.org/step-exams/step-3/step-3-exam-content
- https://www.usmle.org/exam-resources/step-3-materials
- https://www.nbme.org/examinees/self-assessments/comprehensive-clinical-medicine-self-assessment/
- https://www.fsmb.org/usmle/usmle-information/
- https://www.ecfmg.org/

Finishing an arbitrary number of practice questions or checklist items **does not guarantee exam readiness**. Use current official assessment feedback and clinical performance alongside study volume.

## Editing checklist content

The study data is kept in `data.js` (`window.STEP3_DATA`), which includes `phases`, `weeks`, and `resources`. To edit, make sure each task's `id` is unique. **Avoid changing an existing ID after you've checked it off**, since progress is stored by ID.

MIT License. No external scripts or analytics.