# n8n Workflow Design｜Mock

n8n is positioned as a workflow integration layer, not the testing core.

## Intended Flow

```text
Manual or scheduled trigger
        ↓
Read reports/test-summary.json
        ↓
Check status
        ↓
If failed: prepare review notification
If passed: prepare summary notification
        ↓
Human review
```

## Boundary

- n8n does not execute browser tests in this portfolio.
- n8n does not access source code.
- n8n does not connect to production systems.
- n8n does not create defects automatically.

## Future Use

If approved in a real environment, n8n could be used for:

- Scheduled regression trigger
- Test result notification
- Report link distribution
- Human review routing
