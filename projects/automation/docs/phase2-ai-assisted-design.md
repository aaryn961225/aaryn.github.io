# Phase 2 AI-assisted Design

Phase 2 is designed as an advisory layer with explicit data and authority boundaries.

## AI May Assist With

- Semantic consistency review
- Identification of potentially missing boundaries
- Gherkin normalization
- Failure-summary drafting
- Follow-up test suggestions

## AI Must Not

- Access application source code, databases, or production data without explicit approval
- Execute system commands
- Modify business rules or specifications automatically
- Create defects or notify external systems without human approval

## Current Implementation

- `prompts/` contains review templates.
- `contracts/` contains JSON schemas and data boundaries.
- `adapters/llm/mock-llm-client.js` produces deterministic local mock output.
- No external LLM is called.
