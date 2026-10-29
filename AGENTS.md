# AGENTS.md — CL-G30logic-iphone-tools-
Agent contract (template: mine-geo-tool context harness). Any AI working here (Cursor, Claude, Grok, Super Hacker):
1. Read `NOW.md` first, then `README.md`, then this file.
2. Check the team board and decisions before starting: https://github.com/joshuameyer113Geo/g30-team (`TASKS.md`, `DECISIONS.md`).
3. When work changes state, update `NOW.md` (focus, blockers, next step, session state) and commit it with the code.
4. Deliver changes as pull requests. Never push to `main`, merge, force-push, or delete without Josh's approval.

## Project
G30 Logic Field Geology — v0.1: Field tools mapping and compass for iPhone

## Stack
Static HTML/CSS/JS

## Workflow
- No build step recorded. See README.md.

## Operating constraints
- No secrets, keys, passwords, or `.env` contents in commits, docs, or PRs.
- Keep company names and site-specific data out of the repo; use neutral wording.
- Code is saved to GitHub and Google Drive (DECISIONS 2026-10-28). No Lovable for new work (DECISIONS 2026-10-28).
- Geo/survey work defaults to NAD83 (DECISIONS 2026-10-28).
- Josh reviews and signs off on all professional output; software never stamps.

## Structure
`README.md`, `compass.html`, `export.js`, `index.html`, `manifest.json`, `sw.js`
