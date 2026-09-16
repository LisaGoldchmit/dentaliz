# CLAUDE.md

Working notes for DentaLizi. Read this before changing code — it covers the
bits that aren't obvious from reading the files.

## Project overview

DentaLizi is a Hebrew, right-to-left practice site for people preparing for the
**dental school entrance exams** in Israel. It offers math and chemistry
question banks with full step-by-step Hebrew solutions, a mixed "shuffle" mode,
and a timed full simulation that mirrors the real exam structure.

Audience: exam candidates, not enrolled students. All user-facing copy is Hebrew.

## Tech stack

- **React 19** + **Vite 6** (`@vitejs/plugin-react`)
- **react-router-dom 7**, using **`HashRouter`** — deliberately, not
  `BrowserRouter`. The site is a GitHub Pages *project* site; with real paths,
  refreshing or deep-linking `/math` would 404 because Pages has no SPA
  rewrite. Hash URLs (`/#/math`) sidestep that entirely.
- `vite.config.js` sets `base: "/dentaliz/"` to match the repo name in the
  Pages URL. **If the repo is renamed, update `base`.**
- No CSS framework, no state library, no test suite. One global stylesheet.

## Folder structure

```
index.html                 Vite entry (the only HTML file)
vite.config.js             base path + react plugin
src/
  main.jsx                 mounts <App> inside <HashRouter>, imports the CSS
  App.jsx                  all routes
  styles/style.css         the entire stylesheet (global, RTL)
  assets/                  images imported by components (logo, hero)
  components/
    Layout.jsx             Header + <Outlet> + Footer
    Header.jsx             logo, nav, login button
    Footer.jsx
    Breadcrumb.jsx         breadcrumb trail (see RTL note below)
    Quiz.jsx               the question engine (both practice and exam modes)
    ResultsReview.jsx      score summary + per-question review with solutions
  pages/
    Home.jsx               landing page
    About.jsx              "אודות" — Lisa's personal page
    TopicPicker.jsx        topic grid, shared by math and chemistry
    Practice.jsx           single-topic or shuffle practice run
    Simulation.jsx         the timed two-part simulation
  data/
    topics.js              TOPICS metadata + QUESTION_BANKS wiring + helpers
    math/<topic>.js        one practice question bank per topic
    chemistry/<topic>.js
    simulations/
      index.js             SIMULATIONS array + getSimulation(id)
      sim-0N.js            one fixed full exam each (own questions)
public/favicon.svg         copied as-is to the build output
.github/workflows/deploy.yml
```

Routes: `/`, `/math`, `/chemistry`, `/practice/:subject/:topic`, `/simulation`,
`/about`. Anything else redirects to `/`.

## Question data

Every topic file exports one array:

```js
export const questions = [
  {
    id: "chem-ab-1",        // unique across the whole site
    question: "...",         // \n is rendered as a line break (white-space: pre-line)
    choices: ["...", "...", "...", "..."],
    correctIndex: 2,         // 0-based index into choices
    solution: "..."          // full step-by-step Hebrew explanation
  }
];
```

`src/data/topics.js` is the only place that knows which files exist. It exports
`TOPICS` (display metadata), `QUESTION_BANKS` (key → questions), and the helpers
`getAllQuestions(subject)`, `getTopicQuestions(subject, topicKey)` and
`getTopicLabel(subject, topicKey)`.

### Add a question to an existing topic

Append an object to the array in `src/data/<subject>/<topic>.js`. Give it a
unique `id`, keep `correctIndex` 0-based, and write the `solution` in Hebrew.
Nothing else needs touching — counts on the topic cards are derived at runtime.

### Add a new topic

1. Create `src/data/<subject>/<new-topic>.js` exporting `questions`.
2. In `src/data/topics.js`: import it, add it to `QUESTION_BANKS[subject]` under
   its key, and add `{ key, label }` to `TOPICS[subject].topics`.

That's it — the topic picker, the practice route, shuffle mode and the
simulation all read from `TOPICS`/`QUESTION_BANKS` and pick it up automatically.
Keep the file name and the key identical (kebab-case).

Adding a whole new *subject* is more work: it also needs a route in `App.jsx`,
a nav entry in `Header.jsx`, and a decision about the simulation.

## How the modes work

**Practice** (`Practice.jsx` → `Quiz.jsx` with `mode="practice"`) locks a
question as soon as an answer is picked, shows immediate right/wrong feedback,
and offers "הצג פתרון מלא". No timer.

**Shuffle mode** is the same page with `topic === "shuffle"`: it runs
`shuffleArray(getAllQuestions(subject))` over every question in the subject.
"תרגול נוסף (סדר חדש)" bumps a `runId` counter, which both recomputes the
shuffled array and is used as `key` on `<Quiz>` so all quiz state resets.

**Simulations** (`Simulation.jsx`) are **fixed full exams** — each one always
serves the same questions, in the same order. They live in
`src/data/simulations/sim-0N.js`, each exporting
`{ id, label, math: [...], chemistry: [...] }` with its own questions. Those
questions are deliberately **not** in the practice banks, so a candidate can
drill by topic and then sit an exam on unseen material. Nothing is sampled or
shuffled at runtime.

The page moves through phases
`intro (pick a simulation) → chooseOrder → transition → part → (transition → part) → results`.
Parts run 20 math in 60 minutes and 30 chemistry in 90, in whichever order the
user picks, using `mode="exam"`: no feedback until submission, plus a jump-grid
for navigating between questions.

### Add a new simulation

Create `src/data/simulations/sim-0N.js` exporting a `simulation` object in the
shape above (unique question `id`s — the convention is `simN-math-1`,
`simN-chem-1`). That's the whole job: `index.js` picks up `./sim-*.js` via
`import.meta.glob` and sorts by filename, so there's no list to edit and the
picker renders it automatically. Question counts per part are read from the
arrays themselves, but the timers in `PART_META` are fixed at 60/90 minutes.

**The timer** lives in `Quiz.jsx` and only runs when `timerSeconds` is set. A
`setInterval` decrements `remaining` once per second; a separate effect watches
for `remaining === 0` and calls the finish handler with `timeUp = true`, which
auto-submits the part. Finishing is guarded by `finishedRef` so a manual submit
and a timeout can't both fire. `Quiz` is keyed per part, so switching parts
gives a completely fresh timer and answer state.

## Running and deploying

```bash
npm install     # first time only
npm run dev     # local dev server
npm run build   # production build into dist/
npm run preview # serve the built output
```

Deployment is automatic: pushing to `main` triggers
`.github/workflows/deploy.yml`, which builds and publishes `dist/` to GitHub
Pages. **One-time manual setup:** in the repo's Settings → Pages, set the source
to "GitHub Actions". (The workflow uses `npm install` rather than `npm ci`
because there's no committed `package-lock.json` yet; once one is committed,
`npm ci` is the faster choice.)

## Conventions and gotchas

- **RTL.** `dir="rtl"` is set on `<html>` in `index.html` and the whole
  stylesheet assumes it. Prefer letting the base direction do the work over
  hard-coding `direction` on individual elements — the header bug where the logo
  sat on the wrong side was caused by a stray `direction: ltr` on
  `.header-inner`.
- **Mirrored characters.** `«` and `»` are `Bidi_Mirrored`: inside an RTL run the
  browser flips the glyph. So `»` in the source is what *renders* as a
  left-pointing arrow, which is the correct "forward" direction for Hebrew.
  `Breadcrumb.jsx` relies on this — don't "fix" it to `«`.
- **Arrows in question text.** The `→` and `⇌` in question/solution strings are
  chemistry notation, not UI. Never direction-flip those.
- **`#root` carries the layout.** Because React mounts into a wrapper div, the
  `header/main/footer` flex column lives on `#root`, not `body`. Removing that
  rule makes the footer float up mid-page.
- **Naming.** Components are `PascalCase.jsx`, data files and topic keys are
  `kebab-case` and must match each other.
- **Hebrew copy** lives inline in the JSX; code comments in this repo are Hebrew
  in the app source and English in this file.
- **Styling** reuses the existing global class names (`.card`, `.btn`, `.hero`,
  `.quiz-*`, `.results-*`). Add new rules to `src/styles/style.css` rather than
  introducing CSS modules, so the existing look stays consistent.
