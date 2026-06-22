# 01 Formulation Prompt

## Purpose
Convert raw requirement text into structured specification artifacts.

## Input
- Raw requirement description
- Existing terminology, if any
- Scope boundary

## Output
- Data model draft, if relevant
- Functional model draft using Feature > Rule > Example
- Open questions if the requirement is unclear

## Rules
- Do not invent fields, rules, conditions, or behaviors that are not present in the requirement.
- Keep each Rule atomic.
- Every Example must be executable or explicitly marked as TODO.
- Prefer observable behavior for black-box UI automation.

## Human Review
The QA reviewer must confirm the generated specification before it can enter Discovery.
