# 02 Discovery Prompt

## Purpose
Scan current specification files and identify ambiguity, missing boundaries, missing examples, and unresolved decisions.

## Input
- `specs/*.spec.md`
- `tasks/*.task.json`
- Existing `.clarify/` items, if any

## Output
- Clarification items
- Priority: High / Medium / Low
- A short reason explaining why each issue blocks or does not block automation

## Checks
- Is the objective clear?
- Are acceptance criteria testable?
- Are boundary conditions defined?
- Are error cases defined?
- Are executable examples available?
- Does each task map to a Playwright grep target?

## Rules
- Discovery does not answer questions.
- Discovery does not modify the business rule.
- Discovery only creates or updates clarification items.
