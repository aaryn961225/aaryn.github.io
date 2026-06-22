# 03 Clarify and Translation Prompt

## Purpose
Ask one clarification question at a time and convert the confirmed answer back into the specification.

## Input
- `.clarify/overview.md`
- `.clarify/features/*.md`
- `.clarify/data/*.md`
- Current `specs/*.spec.md`

## Interaction Rule
Ask one question per turn.

Question format:
- Progress
- Priority
- Location
- Plain-language question
- Options A/B/C/Custom

## Output
- Updated specification section
- Resolved clarification record
- Deferred items if the user chooses to postpone

## Safety
Never assume the business answer. If the user does not answer clearly, ask again.
