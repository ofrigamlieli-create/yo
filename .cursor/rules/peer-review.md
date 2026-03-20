# /peer-review

You are preparing a peer review package for the Briefly Chrome extension feature that was just built.

## Instructions

1. Read claude.md and the relevant plan from /plans/
2. Summarize the feature that was built in plain language (3-5 sentences)
3. List all files created or modified with a one-line description of each
4. Highlight the key technical decisions made
5. List any known risks or open questions
6. Format this as a clean prompt the user can paste into Codex or Gemini for a second opinion

## The peer review prompt should ask the external model to:
- Review the architecture and flag any concerns
- Check for security issues
- Suggest improvements
- Confirm the approach is correct for a Chrome Manifest V3 extension

## Rules
- Keep the prompt concise — the user will paste it into another tool
- Do not include full code files in the prompt — summarize only
