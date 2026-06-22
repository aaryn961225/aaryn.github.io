# 07 Failure Analysis Prompt

## Purpose
Analyze test failure summaries and produce a QA-readable explanation.

## Input
- `reports/test-summary.json`
- Playwright failure message or trace summary
- Related specification and task metadata

## Output
- Likely failure area
- Evidence from test output
- Suggested next check
- Whether this is a script issue, data issue, environment issue, or product issue

## Safety
The LLM must not mark the defect as confirmed. Human review is required.
