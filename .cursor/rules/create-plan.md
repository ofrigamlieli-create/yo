# /create-plan

You are creating an implementation plan for a Briefly Chrome extension feature.

## Instructions

1. Read claude.md fully
2. Read the relevant issue file from /issues/
3. Create a step-by-step implementation plan that includes:
   - Feature summary (2-3 sentences)
   - Critical decisions (trigger, architecture, data flow)
   - Ordered task list with subtasks (use checkboxes)
   - Each task must be a single, testable unit of work
   - Note which files will be created or modified
4. Save the plan as a markdown file in /plans/
5. Present the plan to the user and wait for approval

## Rules
- Each feature must be its own module — never mix concerns
- Never add anything outside the scope of the current ticket
- API calls always go through background service worker
- API key always stored in chrome.storage
- Do NOT execute anything until the user explicitly approves the plan
- If the plan grows too large, flag it and suggest splitting into two tickets
