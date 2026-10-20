# Demo Script — GitHub SDLC Automation with IBM Bob
**Stand & Deliver | 10–12 Minutes**

---

## Before You Start

| Item | Detail |
|---|---|
| **Environment** | Bob IDE open, workshop repository loaded in Explorer |
| **Branch** | `feature/initial-finance-dashboard` checked out locally |
| **GitHub** | Repository live at `github.com/YOUR_USERNAME/finance-app` |
| **Issue open** | Issue #1 — "Add a graph for a user selected company" |
| **Tab ready** | GitHub repository Actions tab open in browser |

> **Tip:** Practice the transitions between IDE and browser — those are the moments that land hardest with a live audience.

---

## Segment 1 — Opening Hook & Client Pain Point (≈ 2 min)

**[SPEAK TO CAMERA]**

"Every software team I talk to tells me the same thing. Their developers are drowning.

Not in complexity — they can handle complexity. They're drowning in *process overhead*. Writing the ticket, scaffolding the project, wiring up the tests, formatting the pull request, updating the CI pipeline — all the work *around* the code that doesn't ship anything but still consumes half the sprint.

And AI tools haven't fixed this. Most of them stop at the file level. They autocomplete a function, they suggest a refactor. But they don't understand your repository. They don't read your GitHub issues. They don't run your linter, push your branch, or prepare your pull request. You still have to do all of that yourself.

That gap — between *writing code* and *delivering working software* — is exactly what IBM Bob closes.

Today I'm going to show you Bob working inside the GitHub delivery loop that your teams already use: reading the issue, writing the code, running the tests, and opening a merge-ready pull request. In about ten minutes, you're going to see a feature go from an open GitHub issue to a green CI run. Let's do it."

---

## Segment 2 — Part 1 Recap: Plan & Scaffold (≈ 2 min)

> *This segment recaps what Part 1 produced. Show the running app and the file tree — you do NOT need to re-run scaffolding.*

**[SHOW: Bob IDE, Explorer open on `finance-app/` folder]**

"Before I show the evolution loop, let me set the scene with what we started from.

This is a React finance analytics dashboard — it tracks IBM against four competitors using Yahoo Finance data, across three time windows: current day, last seven days, and last quarter.

Here's the key thing: **this entire application was planned and scaffolded by Bob from an empty repository.**

I gave Bob one natural-language prompt — analyze the repository and propose an implementation plan — and Bob produced a full HTML architecture report: folder layout, component boundaries, data service, test strategy, even the GitHub evolution model.

I approved the plan. Bob scaffolded eleven sub-tasks, one at a time — each with an explicit approval gate. Zero handwritten boilerplate. Every file traces back to a decision in the plan."

**[SHOW: `finance-app/src/` in Explorer — point out `services/`, `hooks/`, `components/`, `views/`]**

"Notice the architecture. Services are isolated. Hooks encapsulate data fetching. Views are pure props-in, render-out. That isn't accidental — it came from the plan Bob produced *before* writing a single line of code.

And the whole thing runs offline in mock mode — no external API dependency during development or CI."

**[SHOW: running app in browser at `localhost:5173`]**

"Current day view — IBM and the four competitors. Tabs wired. Tests passing. Clean build. This is the baseline we published to GitHub."

---

## Segment 3 — Part 2: The GitHub Evolution Loop (≈ 6 min)

> *This is the live demonstration heart of the script. Move through it deliberately.*

### 3a — Show the Open Issue (30 sec)

**[SWITCH TO: GitHub in browser, Issues tab]**

"Here's where the next feature starts. Not a Slack message. Not a verbal request. An issue.

Issue #1 — *Add a graph for a user selected company*. The ask is clear: let the user pick any stock ticker, render a new comparison chart, handle bad symbols gracefully, and leave the existing IBM and competitor dashboards untouched.

This is how modern teams work. The issue *is* the requirement. Bob is going to read it directly."

---

### 3b — Bob Reads the Issue & Plans (1 min)

**[SWITCH TO: Bob IDE, Agent mode active in Agentic Sidebar]**

**[PASTE this prompt — read it aloud as you type:]**

```
Read issue #1 from this repository, analyze the scope of the requested feature, and propose an implementation plan before writing any code.
```

**[SPEAK while Bob works:]**

"Watch what Bob does here. It doesn't just start generating code. It fetches the issue, reads the title and the body, inspects the existing source tree — services, hooks, components — and produces a plan that fits *this* codebase. Not a generic React tutorial. A plan grounded in what's already on disk."

**[WHEN Bob surfaces the plan — point out:]**

"Bob has broken this down into scope-bounded sub-tasks: extend the data service, add a new hook, build the ticker input component, wire the new chart view. Each one is explicit. I can review it before a single file changes.

This is the approval gate. I am in control of what gets written."

---

### 3c — Approve and Implement (2 min)

**[SPEAK:]**

"I'm happy with this plan. Let me approve it."

**[CLICK: Approve todo tools for task in the sidebar]**

**[SPEAK while Bob executes:]**

"Bob is now working through the sub-tasks in order. It reads existing files before editing them — so it doesn't overwrite things that already work. It extends the data service. It creates the new custom hook. It builds the input component. It wires the new view into the app shell.

At each step I can see exactly what's changing and why. If something looks wrong, I stop it. That's the model — Bob does the implementation work, I retain oversight."

**[WHEN Bob completes — show the new files in Explorer:]**

"New files on disk. The existing views — `CurrentDayView`, `WeekView`, `QuarterView` — untouched. The feature is additive, exactly as the issue specified."

---

### 3d — Local Validation (1 min)

**[OPEN: Terminal in the IDE]**

**[SPEAK:]**

"Before this goes anywhere near GitHub, Bob runs the full local validation chain — the same gates CI will run on the server. Lint, tests, build."

**[RUN or show Bob running:]**

```bash
cd finance-app && npm run validate
```

**[POINT AT output — zero lint errors, tests passing, clean build]**

"Zero lint errors. All tests passing — including tests for the new feature Bob wrote alongside the implementation code. Clean production build.

This is the key discipline: local validation is part of the workflow, not an afterthought. Bob treats it as a required sub-task, not optional cleanup."

---

### 3e — Commit, Push, CI (1.5 min)

**[SPEAK:]**

"Now the code is ready to deliver. Bob prepares the commit message and the pull request description — both in conventional-commit format, both grounded in what actually changed."

**[SHOW: Bob's commit message output in the sidebar]**

"I take that commit message, stage the changes, and push to the feature branch."

**[RUN in Terminal:]**

```bash
git add .
git commit -m "feat: add user-selected company chart (resolves #1)"
git push origin feature/initial-finance-dashboard
```

**[SWITCH TO: GitHub Actions tab in browser — refresh]**

"The push triggers CI automatically. The branch name matches the `feature/**` pattern in the workflow. GitHub spins up a clean environment, installs dependencies, runs lint, runs the test suite with `VITE_USE_MOCK=true`, builds — and uploads the dist folder as a downloadable artifact."

**[POINT AT the green CI run]**

"Green. The same gates Bob ran locally just passed on a machine GitHub controls. That's what 'ready to review' actually means."

---

### 3f — Pull Request (1 min)

**[CLICK: Create pull request from the feature branch on GitHub]**

**[PASTE Bob's PR description into the body]**

**[SPEAK:]**

"Bob also prepared the pull request description — implementation summary, validation results, test counts, a note that CI ran clean. A reviewer can understand exactly what changed, why it changed, and that it was validated, without asking the author a single question.

This PR is merge-ready. The issue drove the work. The branch carried the code. The tests validated it. CI confirmed it. The pull request documents it. That's the full loop."

---

## Segment 4 — Call to Action (≈ 1.5 min)

**[SPEAK TO CAMERA]**

"Let me be direct about what you just saw.

Bob didn't just write code. Bob operated inside the engineering workflow your teams already run — GitHub issues, branches, pull requests, CI pipelines. It read the requirement, planned the work, implemented sub-task by sub-task with explicit approval gates, validated locally, prepared the delivery artifacts, and triggered the CI run that confirmed the work.

Your developers didn't disappear from that loop. They approved the plan. They reviewed the output. They controlled the push. The AI did the implementation and preparation work. The humans retained oversight over every consequential decision.

**That is the value proposition.** Not autocomplete. Not a chatbot. An AI that extends a developer's reach across the full delivery cycle — from a GitHub issue to a green pull request — while the developer stays in control.

Here's what I'd like to propose for your team:

**Option 1 — Workshop.** A hands-on half-day session where your developers run this exact workflow against your own repository. They leave with a repeatable pattern for AI-assisted delivery.

**Option 2 — Proof of Experience.** We scope a real feature from your backlog — an actual open issue — and deliver it using this workflow. You see the output against your own codebase.

**Option 3 — Deeper technical session.** If you want to understand the architecture — the approval gate model, the CI integration, the branch strategy — I can set up a focused technical review with your engineering leads.

The question isn't whether your teams will use AI in their delivery workflow. They already are. The question is whether that usage is structured, auditable, and tied to your existing engineering process — or whether it's scattered across individual developer habits with no consistency.

IBM Bob is the answer to that question. What would be most useful to explore first?"

---

## Timing Guide

| Segment | Content | Target |
|---|---|---|
| 1 | Opening hook & pain point | 2:00 |
| 2 | Part 1 recap (scaffold) | 2:00 |
| 3a | Show the open issue | 0:30 |
| 3b | Bob reads & plans | 1:00 |
| 3c | Approve & implement | 2:00 |
| 3d | Local validation | 1:00 |
| 3e | Commit, push, CI | 1:30 |
| 3f | Pull request | 1:00 |
| 4 | Call to action | 1:30 |
| **Total** | | **~12:30** |

> Trim Segment 2 to 1 min if you need to land under 12:00.

---

## Evaluation Checklist Coverage

| Requirement | Where It Appears |
|---|---|
| ✅ Articulate client pain points | Segment 1 — process overhead, the gap between writing code and delivering software |
| ✅ Value proposition of IBM Bob | Segment 1 (intro) + Segment 4 (CTA) — AI that extends reach across the full delivery cycle |
| ✅ Highlight use cases for IBM Bob | Segments 2 & 3 — planning, scaffolding, issue-driven feature dev, validation, CI, PR prep |
| ✅ Close with a call to action | Segment 4 — three explicit options: Workshop, PoX, Technical deep-dive |

---

## Key Talking Points (Quick Reference)

- **Pain:** Developers lose half their sprint to process overhead — scaffolding, ticket writing, PR formatting, CI debugging
- **Gap AI tools leave:** File-level autocomplete doesn't close the gap between writing code and delivering software
- **Bob's differentiation:** Operates inside the GitHub loop — reads issues, plans first, sub-task approval gates, validates locally, prepares delivery artifacts, triggers CI
- **Control model:** AI does implementation work; humans retain oversight at every approval gate
- **Proof point:** Same local validation gates run again on GitHub CI — green means independently verified, not just "works on my machine"
- **CTA options:** Workshop / PoX / Technical deep-dive — tailor to the audience in the room
