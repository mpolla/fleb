# AGENTS.md

This file provides guidance to coding agents (Claude Code etc.) working with code in this repository. `CLAUDE.md` is a symlink to this file so Claude Code auto-loads it.

## Project

FLEB (Fast Log Entry in-Browser) is a Vue 3 + TypeScript single-page web app for ham-radio contact logging. It is a browser reimplementation of DF3CB's FLE: the operator writes free-form plaintext shorthand in a textarea, and FLEB parses each line into a QSO record and exports ADIF. Live build is deployed to GitHub Pages at https://mpolla.github.io/fleb/.

## Commands

- `npm start` — webpack-dev-server with hot reload, auto-opens browser.
- `npm run build` — production webpack build into `dist/`.
- `npm test` — runs Jest (ts-jest) over `fleb.test.ts`.
- `npx jest -t 'Parse call'` — run a single test by name (e.g., the `Parse call` block).
- `npm run deploy` — publishes `dist/` to the `gh-pages` branch via the `gh-pages` package. CI also auto-deploys on push to `master` (see `.github/workflows/webpack.yml`).

## Architecture

Two layers, intentionally decoupled:

### 1. The parser/exporter (`src/fleb.ts`)
Pure TypeScript, no Vue. This is the heart of the app and the only thing tested. It exposes:
- `makeJsonArray(text, interpolate, consecutiveserials)` — turns the multiline FLE text into an array of QSO objects. This is the main pipeline: it walks lines top-down, maintaining mutable module-level state (`MYCALL`, `MYGRID`, `DATE`, `BAND`, `FREQ`, `MODE`, `STX`, etc.) that header lines mutate and QSO lines read.
- `printAdif(qsos, raw)` — serializes a QSO array to ADIF via the local `AdiWriter` (adapted from the `adif` npm package; field types live in `src/fields.ts`).
- Per-token parsers: `parseCall`, `parseTime`, `parseMode`, `parseGrid`, `parseName`, `parseQsoComment`, `parseQsoQslMsg`, `parseSotaref`, `parsePotaref`, `parseSTX`, `parseSRX`, `parseNick`, `parseWwffref`, `detectband`.
- Post-processing helpers: `interpolateTimes`, `fillTimes`, `fixSerials` (consecutive serial numbering for contests).
- `downloadAdif` / `downloadTxt` / `downloadCsv` / `notesReset` — DOM-level actions wired to the App.vue toolbar; they read the live `<textarea id="notes">`.

The FLE text format is positional and stateful: header lines like `mycall`, `mygrid`, `operator`, `date`, a band token (`20m`), or a frequency (`14.044`) set state that subsequent QSO lines inherit until overridden. `day +` increments the date. Sigils used in QSO lines: `@name`, `#GRID`, `<qso comment>`, `{qslmsg}`, `,stx .srx` (contest serials), `pota K-1234`, `sota SM/NB-011`, WWFF `OHFF-1234`.

### 2. DXCC flag lookup (`src/flags.ts`)
A small standalone module: a `dxccFlags: Record<number, string>` table mapping ARRL DXCC entity numbers to flag emoji (~333 entries), plus `flagIcon(call)` which delegates prefix-matching to `findDxcc` from `@ham-core/fast-dxcc` and looks up the emoji by entity number. Only consumer is `src/components/QsoTable.vue`. Calls with no DXCC match (or matched to an entity intentionally omitted from the table — ITU/UN HQ, SMOM, Spratly, Scarborough Reef) fall through to a `&nbsp;&nbsp;&nbsp;` placeholder.

### 3. The Vue 3 app (`src/index.ts`, `src/App.vue`, `src/components/`)
- `index.ts` is the entry point. It mounts the Vue app and ALSO attaches `highlight-within-textarea` to `#notes` with a long list of regex/className pairs that colorize tokens live as the user types. These regexes are deliberately separate from the parser regexes in `fleb.ts` — they exist for visual feedback only and can drift from the parser's behaviour. When changing parser tokenization, update both.
- `App.vue` holds top-level state: the parsed QSO array `kdata`, the QTH grid, display toggles, and real-time/interpolation flags. It composes `FlebEditor`, `QsoTable`, `QsoStatistics`, `QsoMap`.
- `FlebEditor.vue` owns the `<textarea>` and re-runs `makeJsonArray` on every change, pushing the result up to `App.vue` via `$parent`. It also implements real-time mode (auto-prepend `hhmm` on Enter when the line has a callsign) and the F1/F2 keyboard shortcuts to insert date/time.
- jQuery is provided globally via `webpack.ProvidePlugin` because `highlight-within-textarea` requires it.

### Tests
`fleb.test.ts` lives in the project root (not under `src/`). It exercises individual parser functions AND does golden-file round-trip tests: `src/test/*.txt` is parsed and compared to `src/test/*.adi`. The FLEB-emitted ADIF differs from DF3CB's FLE in the program-id header line only, so the test fixtures originally come from FLE and the test replaces `FLE_ADIF_HEADER`/`FLE_ID` with FLEB's equivalents before comparing. **When adding parser features that change ADIF output, regenerate the matching `.adi` fixture rather than hand-editing it.**

## Conventions to be aware of

- The parser uses module-level mutable state. `makeJsonArray` is not reentrant-safe; calls do not isolate state from each other within the same module load. Tests pass because Jest re-imports per test file.
- Variable and function names mix English and Finnish (`nootit` = notes, `kdata`, `lataileadif` = "download ADIF"). This is intentional — don't rename them as cleanup.
- TypeScript is configured loosely (`noImplicitAny: false`). The codebase is effectively typed JS in many places; don't introduce strict-mode breakage without intent.
- The webpack `publicPath` is hard-coded to `/fleb/` for GitHub Pages. Changing it breaks the deployed build.
