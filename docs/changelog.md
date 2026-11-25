# Visual changelog

The static `/changelog/` page records selected milestones from the arcade's Git history, with source links and screenshots.

## Why

The project changed substantially between the original 2024 Three.js prototype and the integrated arcade portfolio.
The changelog makes those changes visible without turning the commit log into release notes.

## How it works

`apps/arcade/changelog/index.html` is a separate Vite HTML entry, with a small stylesheet and no JavaScript runtime.
It shares the cabinet's local Arcade Interlaced font, amber accent, and dark background.
The existing workspace build bundles the page, font, and images into root `dist/`.
During development, a scoped HTML transform exposes the shared screenshot directory through Vite's filesystem asset URLs.
The cabinet and README link to `/changelog/`.

Entries are newest first, grouped by year, and use source commit dates rather than invented version numbers.
Prefer visible or meaningful capability changes over routine fixes, dependency bumps, and test maintenance.
Keep new entries brief, with a full source commit link and a screenshot when it helps explain the change.
Add year navigation when introducing a new year.

## Screenshot provenance

All captures are real browser screenshots, rather than generated illustrations.
Images live in `docs/images/changelog/`, where the README can reuse them.

| File | Source | Capture notes |
| --- | --- | --- |
| `first-screen.png` | `b665fd9` (2024-03-17) | Recreated Three.js prototype. |
| `floating-cubes.png` | `2467741` (2024-04-04) | Recreated React scene; the external iframe is intentionally blank. |
| `cloud-scene.png` | `6745b96` (2025-09-09) | Recreated cloud scene; the external iframe is intentionally blank. |
| `original-showcase.png` | `d6b868a` (2026-10-19) | Recreated portfolio game before the museum rebuild. |
| `spotlight.png` | `f6bf203` (2026-10-21) | Recreated cabinet with the earlier control layout. |
| `punch-out.png` | Preserved `docs/screenshots/punch-out-gameplay-desktop.png` | Development capture introduced during the October 28 Punch-Out work. |
| `museum.png` | Preserved `docs/screenshots/museum-desktop.png` | Capture from the October 30 museum work; its old Q instructions are historical. |
| `arcade.png` | `b7db760` (2026-11-07) | Current cabinet before the changelog addition. |

Historical source was exported with `git archive` into ignored `.local-backups/changelog-history/` directories and served locally with Vite.
Recreations use the current locked workspace dependencies and a 1280 × 800 Chromium viewport.
The original source, model, textures, and camera were retained; automatic JSX transformation was enabled for revisions that relied on the React Vite plugin.
Unavailable third-party screens were left blank instead of inventing their historical contents.
These images document a source reconstruction, not an original capture made on the commit date.
The two preserved screenshots retain their original dimensions and UI.

## Key files

- `apps/arcade/changelog/index.html` - curated entries and source links.
- `apps/arcade/changelog/style.css` - responsive reading layout.
- `apps/arcade/vite.config.js` - production HTML entries.
- `docs/images/changelog/` - shared screenshots.
- `tests/changelog.spec.js` - development and production route, assets, navigation, and keyboard checks.

## Related

- [Development](development.md)
- [Scene](scene.md)
