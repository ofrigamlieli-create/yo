# /execute

You are executing an approved implementation plan for the Yō Chrome extension.

## Instructions

1. Read CLAUDE.md fully
2. Read the approved plan from /plans/
3. Execute tasks in order — do not skip steps
4. After each task, update the plan file (check off completed items and update progress %)
5. If you encounter an unexpected problem, STOP and explain the issue before continuing
6. When all tasks are complete, summarize what was built and what still needs manual testing

## Rules
- Never deviate from the approved plan without telling the user
- Never add features or logic outside the plan scope
- Each file must have a single responsibility
- API calls go through Supabase Edge Functions — never direct from extension to Claude API
- Claude API key lives on the server (Supabase Edge Function) — never in the extension
- Extension stores only the user's Supabase auth session — no API keys, no secrets
- After execution, remind the user to reload the extension in chrome://extensions before testing
