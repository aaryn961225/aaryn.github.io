# LLM Safety Boundary

The LLM layer is advisory only.

## Rules

1. Do not send credentials, secrets, or production data.
2. Do not send application source code unless an approved use case and data policy explicitly permit it.
3. Do not allow the LLM to execute system commands.
4. Do not allow the LLM to modify specifications automatically.
5. Require QA review for every suggestion and follow-up action.

## Current Mode

- Deterministic local mock only
- No external LLM calls
- No autonomous decision-making
- Human review required
