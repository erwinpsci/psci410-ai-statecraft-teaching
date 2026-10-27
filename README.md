# PSCI 410 interactive case

Public, buildless HTML/CSS/JS activity for 16 November 2026. The `dist/` directory is the complete public payload. No framework, database, analytics, API or student account is used. Only `dist/` is served; teaching notes and course chapters are not included.

Run a local preview with the configured Python interpreter:
```
$HOME/Developer/python_ml/.venv/bin/python -m http.server 8765 --directory dist --bind 127.0.0.1
```

Choices exist only in JavaScript memory. New loads and browser-history restorations reset choices. External source links are normal navigations; selecting an answer sends no request. Hosting may retain ordinary access logs. Public access is not the same as having no hosting logs.

The original HTML production diagram is an ordered list styled as a four-stage flow. The accessible sequence is design → manufacturing → assembly/testing/packaging → users. Narrow layouts wrap this as a clockwise two-by-two flow. Its caption states that it is not an ownership map or complete industry map.

Without JavaScript, all reading and question sections are visible. Print CSS shows every section irrespective of current step. Keyboard users can use native radio controls, next/back, direct step navigation and all-content view. No countdown, auto-advance or grading.

Content derives from the verified slide case: P001, P031, P028, P039 and P114; source IDs and original locators are maintained in the private teaching-pack source ledger. Readings are named, not reproduced. This is a historical 2021–2026 case, not current export advice.

## Handout

The student handout PDF is published at `docs/week9-handout.pdf` (copied to `dist/`). Its LaTeX source is kept in `handout/`, which is git-ignored. Edit `handout/week9-handout.tex`, then run `sh handout/build.sh` to rebuild and copy the PDF into `docs/` and `dist/`.
