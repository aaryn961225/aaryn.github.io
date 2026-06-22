# Content Baseline｜QA Career Journey

This file defines the approved wording and scope boundaries for future merges.

## Protected Positioning

- VTrainer: 8 core decision rules and 6 high-risk scenarios.
- Dog Fetch: 11 behavior nodes and 7 core GWT scenarios.
- QA Checklist: 9 categories and 140 reusable checklist items.
- UI charts: 38 retained source cases and 8 interactive offline ECharts implementations.
- When the ECharts page is embedded in the portfolio modal, the parent artifact tabs are the only navigation; the embedded hero, duplicate view tabs, and footer remain hidden.
- Automation: a separate reusable execution-framework prototype; it is not an end-to-end integration of the other four projects.

## Protected Status Boundaries

- Playwright execution and the rule-based Specification Quality Gate are implemented.
- Docker runtime configuration is prepared and optional; do not label Docker execution as verified unless it has been run and evidence is retained.
- MCP Context, AI Review, and n8n notification artifacts are deterministic mocks.
- External AI, live MCP, and live n8n connections are planned only.
- XR, hardware, and gamepad scenarios are designed but not executed across a complete physical-device matrix.
- Web Security Sanity Checks are not penetration testing, vulnerability scanning, or a security audit.

## Protected Evidence Wording

The retained evidence is:

- 3/3 Playwright demonstration tests passed in the included report dated 2026-06-18.
- The Specification Quality Gate reported 0 blocking issues for the three demonstration modules.

Do not convert this statement into claims of product stability, complete regression coverage, or production readiness.
