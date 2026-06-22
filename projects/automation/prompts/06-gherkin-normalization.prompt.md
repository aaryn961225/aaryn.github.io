# 06 Gherkin Normalization Prompt

## Purpose
Normalize executable examples into consistent Given / When / Then wording.

## Input
- Existing executable examples
- Project step style rules

## Output
- Normalized examples
- Step sentence mapping
- Warnings for examples that are not testable

## Rules
- Keep Then statements data-verifiable.
- Do not add new business behavior.
- Preserve original intent.
