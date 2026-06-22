# Deterministic Mock LLM Adapter

This adapter produces a deterministic local review response without calling an external model.

## Future Replacement Point

- Replace `mock-llm-client.js` with a local or otherwise approved LLM client.
- Preserve the request and response boundaries defined in `contracts/llm-request.schema.json` and `contracts/llm-response.schema.json`, or version the contracts explicitly when they change.

## Safety Rules

- LLM output remains advisory.
- QA reviews and approves every specification change and follow-up action.
- Credentials, production data, and application source code are outside the default context boundary.
