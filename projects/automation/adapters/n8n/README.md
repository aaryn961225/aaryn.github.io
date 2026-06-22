# Deterministic Mock n8n Adapter

This adapter creates a local notification payload that demonstrates a possible future n8n integration boundary.

## Current Behavior

- Writes `reports/n8n-payload.json` and a local notification preview.
- Does not call a webhook.
- Does not send email, Teams, or other external notifications.

## Future Replacement Point

- Read an approved webhook URL from a protected environment variable.
- Send only sanitized payload fields to an approved n8n workflow.
- Preserve a human review step before external notification or defect creation.
