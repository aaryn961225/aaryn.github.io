# 04 Semantic Consistency Review Prompt

## Purpose
Review whether the specification contains semantic contradictions or terminology inconsistencies.

## Input
- `specs/*.spec.md`
- `tasks/*.task.json`
- `reports/quality-gate-report.json`

## Output JSON
```json
{
  "status": "clear | needs_review",
  "findings": [
    {
      "severity": "High | Medium | Low",
      "location": "file path or section",
      "issue": "what looks inconsistent",
      "suggestedQuestion": "question for QA/product owner"
    }
  ]
}
```

## Rules
- Do not rewrite the specification directly.
- Only produce findings and clarification questions.
