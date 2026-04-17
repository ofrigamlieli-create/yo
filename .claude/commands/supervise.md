---
name: supervise
description: Enforce build-phase discipline during multi-step feature implementation in Claude Code. Use this skill after a plan has been approved (via /autoplan or equivalent) and before code review (/review). It breaks the plan into atomic tasks, maintains a build journal, enforces one-task-at-a-time execution with verification gates, surfaces architectural ambiguity instead of guessing, tracks scope drift, and produces a structured handoff for the review phase. Invoke with `/supervise` when the approved plan has more than ~5 tasks, when the build will span multiple sessions, or when the feature touches multiple modules.
---

# /supervise — Build-phase discipline

This skill runs between `/autoplan` and `/review`. It does not plan, it does not review, and it does not replace tests or CI. Its only job is to keep the build phase legible, gated, and drift-resistant so the reviewer (human or `/review`) has something coherent to evaluate.

## When to invoke

Invoke `/supervise` when:
- The approved plan has more than ~5 atomic tasks
- The build will likely span multiple sessions or more than ~2 hours
- The feature touches multiple files, modules, or layers (e.g. backend + frontend)
- The user is non-technical and will be reviewing the work in plain English, not by reading the diff line-by-line

Do NOT invoke for:
- Single-file changes
- Copy tweaks, config edits, or trivial fixes
- Exploratory spikes where the goal is to learn, not to ship

## Required inputs

Before starting, confirm these exist:
1. An approved plan document from `/autoplan` or equivalent (file path or pasted content)
2. A worktree or dedicated branch for this feature (do NOT supervise work on `main`)
3. Write access to the repo root so `project-journal.md` can be created/updated

If any are missing, stop and ask the user.

## The supervision loop

### Step 1 — Convert plan to task list

Read the approved plan. Break it into numbered atomic tasks. A task is atomic if it can be verified independently (a test passes, a page renders, an API returns the expected shape). If a "task" in the plan requires three separate verifications, split it into three tasks.

Write the task list to `project-journal.md` at the repo root under a new heading dated with today's date and the feature name. Format:

```markdown
## [YYYY-MM-DD] Feature: <feature name>

**Plan source:** <path or link to plan>
**Branch / worktree:** <branch name>

### Tasks
- [ ] 1. <atomic task> — **Done when:** <verification criterion>
- [ ] 2. <atomic task> — **Done when:** <verification criterion>
...

### Out of scope (captured during build)
_(none yet)_

### Open questions surfaced to user
_(none yet)_

### Build log
_(entries added per task)_
```

Show the full task list to the user and ask: "Ready to start task 1, or want to adjust the breakdown first?"

### Step 2 — Execute one task at a time

For each task, in order:

1. **State intent.** Before touching code, state: "Starting task N: `<task>`. I will verify by `<criterion>`. Expected files touched: `<list>`."
2. **Implement.** Make the changes. Stay strictly within the task's scope.
3. **Verify.** Actually run the verification — run the test, hit the endpoint, load the page, whatever the "Done when" said. Do not mark done based on vibes.
4. **Log.** Append to the Build log in `project-journal.md`:
   ```
   - Task N — <task title>
     - What was done: <1-2 sentences>
     - How it was verified: <what actually ran, what the result was>
     - Surprises / deviations: <anything unexpected, or "none">
   ```
5. **Check the box.** Flip `- [ ]` to `- [x]` in the task list.
6. **Announce.** Tell the user: "Task N complete, verified by <criterion>. Moving to task N+1."

Do NOT start task N+1 before task N is logged and checked.

### Step 3 — The Confusion Protocol

At any point during a task, if one of the following is true, STOP implementing and surface to the user:

- A required piece of information is missing (a type, an env var, a business rule)
- There are two or more valid ways to do something and the plan didn't specify
- An assumption you're about to make would change the user-visible behavior
- The task as written contradicts something already in the codebase

Append to **Open questions surfaced to user** in the journal, then ask the user directly in chat:

> "Paused on task N. I need a decision before continuing: `<question>`. Options I see: (a) ..., (b) .... My recommendation: `<a or b>` because `<reason>`."

Wait for the user's answer. Log the decision in the journal before resuming.

**Do not guess.** Guessing is the primary cause of build drift and is the specific behavior this skill exists to prevent.

### Step 4 — Scope fence

While implementing, you will notice things: a function that could be cleaner, a test that's flaky, a component that could be extracted, a bug adjacent to what you're touching. Do NOT fix them.

Instead, append to **Out of scope (captured during build)** in the journal:
```
- <observation> — noticed during task N. Suggest: <new ticket | defer | ignore>.
```

The only exception: if ignoring it would make the current task impossible or produce broken code. In that case, invoke the Confusion Protocol and ask the user.

### Step 5 — Reality check (every 3 tasks)

After every 3 completed tasks, or any time the session resumes after a break, write a short "Reality check" entry to the journal:

```
### Reality check after task N
- Where the plan said we'd be: <paraphrase from plan>
- Where we actually are: <honest state>
- Divergence: <none | describe>
- Recommendation: <continue | pause and replan>
```

If divergence is non-trivial, pause and surface to the user before continuing.

### Step 6 — Build complete handoff

When the last task is checked off, generate the handoff summary at the bottom of the feature's journal section:

```markdown
### Build complete — handoff to review

**What was built:** <2-4 sentences, plain English, no jargon>

**What was verified:**
- <verification 1 and its result>
- <verification 2 and its result>
...

**What was deferred (out of scope list):**
- <item> → <recommendation>
...

**Decisions made during build (from open questions):**
- <question> → <user's decision>
...

**Uncertainties the reviewer should check:**
- <anything you're not 100% sure about, even if it works>

**Ready for:** `/review` on branch `<branch>`
```

Then tell the user: "Build complete. Handoff summary written to `project-journal.md`. Recommend running `/review` next."

## Constraints

- Never skip the journal update after a task. The journal IS the deliverable of this skill, alongside the code.
- Never mark a task done without running its verification.
- Never silently expand scope. Surface or log, never smuggle.
- Never guess on architectural decisions. Confusion Protocol or nothing.
- If the user interrupts mid-task with new instructions, pause the current task, append an entry to the journal capturing the interruption, and ask whether to (a) finish current task first, (b) stop and replan, or (c) abandon current task.

## What this skill does NOT do

- It does not write the plan (`/autoplan` does)
- It does not review the finished code (`/review` does)
- It does not run browser QA (`/qa` does)
- It does not ship (`/ship` does)
- It does not replace tests, CI, or linters
- It does not second-guess the plan — if the plan is wrong, surface it via Confusion Protocol and let the user decide to pause and replan

## Notes for non-technical users

The journal is written in plain English on purpose. You should be able to read the "Build complete — handoff to review" section and understand what shipped without reading any code. If you ever read it and feel lost, that's a bug in how this skill was invoked — tell Claude the summary wasn't clear and ask for a rewrite.
