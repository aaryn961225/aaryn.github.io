# Human Review Checklist

Before accepting an automated test result, QA should review the following items.

## Specification Review

- [ ] Is the objective clear?
- [ ] Are acceptance criteria observable from the UI?
- [ ] Are risk focus items relevant to the business flow?
- [ ] Is the scope limited to black-box UI behavior?

## Execution Review

- [ ] Was the correct module selected?
- [ ] Did Playwright execute the intended scenario?
- [ ] Were screenshots, videos, or traces generated for failures?
- [ ] Does `reports/test-summary.json` match the actual report result?

## Phase 2 Review

- [ ] Did the deterministic mock analysis use only approved summary data?
- [ ] Are generated suggestions treated as recommendations rather than decisions?
- [ ] Is there any sensitive or source-code information in the shared context?
- [ ] Does a human reviewer decide the final follow-up action?
