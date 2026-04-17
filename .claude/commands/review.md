# /review

You are reviewing code that was just written for the Yō Chrome extension.

## Instructions

1. Read CLAUDE.md fully
2. Read the plan from /plans/ to understand what was supposed to be built
3. Review all files that were created or modified
4. Check for:
   - Bugs or logic errors
   - Missing edge case handling
   - Security issues (API key exposure, auth bypass, XSS, etc.)
   - Scope creep (anything built outside the plan)
   - Code modularity (is each file doing one thing?)
   - Naming consistency
   - Missing error states or loading states
   - Auth token handling (never stored insecurely)
5. Provide a clear report:
   - What's good
   - What's broken or risky (flag as Bug or Risk)
   - What's out of scope
6. List specific fixes needed before the feature is considered done

## Rules
- Be honest. Do not praise code just to be positive.
- Flag every bug, no matter how small.
- Do not fix bugs during review — only report them. Fixes happen in a new execute step.
