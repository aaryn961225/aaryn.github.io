# Clarification Flow

If a specification fails the Quality Gate, the system generates pending clarification items under `.clarify/`.

## Flow

```text
Quality Gate failed
→ Create .clarify/overview.md
→ Create .clarify/features/*.md
→ Ask one question at a time
→ Update specs/*.spec.md
→ Archive resolved item
→ Re-run Quality Gate
```

## Role Boundary

The system may identify missing sections and ask clarification questions. It must not invent business rules or silently update expected behavior without human input.
