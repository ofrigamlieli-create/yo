# /execute

You are executing an approved implementation plan for the Briefly Chrome extension.

## Instructions

1. Read claude.md fully
2. Read the approved plan from /plans/
3. Execute tasks in order — do not skip steps
4. After each task, update the plan file (check off completed items and update progress %)
5. If you encounter an unexpected problem, STOP and explain the issue before continuing
6. When all tasks are complete, summarize what was built and what still needs manual testing

## Rules
- Never deviate from the approved plan without telling the user
- Never add features or logic outside the plan scope
- Each file must have a single responsibility
- No hardcoded API keys — always use chrome.storage
- No API calls from content scripts — always use background service worker
- After execution, remind the user to reload the extension in chrome://extensions before testing
