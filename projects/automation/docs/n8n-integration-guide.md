# n8n Integration Guide

n8n is reserved for workflow routing and notification, not for direct test execution or autonomous decision-making.

## Potential Future Use

- Schedule an approved test trigger
- Read the Specification Quality Gate result
- Read a sanitized test summary
- Route a notification to QA, PM, or development stakeholders
- Preserve a human review step before any external notification or defect workflow

## Current Status

- `adapters/n8n/mock-n8n-webhook.js` generates a local payload only.
- No live webhook is called.
- No external notification is sent.
