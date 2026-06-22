# Prompt Library

This folder contains Phase 2 templates for future AI-assisted review.

## Current Status

- Prompts are not sent automatically to an LLM.
- Templates align with the intended request and response contracts.
- All generated suggestions remain advisory and require human review.

## Workflow

```text
01 Formulation
→ 02 Discovery
→ 03 Clarify and Translation
→ 04 Semantic Consistency Review
→ 05 Boundary Suggestion
→ 06 Gherkin Normalization
→ 07 Failure Analysis
→ 08 Follow-up Test Suggestion
```

## Context Boundary

Do not include credentials, secrets, database dumps, production data, or application source code. Use sanitized specification content and approved report fields only.
