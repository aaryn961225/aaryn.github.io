# Docker Integration Guide

Docker is optional in this portfolio. The primary interview demonstration uses local Playwright execution with a visible browser.

## Purpose

Docker packages only the QA automation runtime:

- Node.js
- Playwright 1.54.0
- Chromium
- Specifications and automation scripts

The image does not contain the application-under-test source code, production databases, credentials, company repositories, external AI services, live MCP servers, or n8n instances.

## Why Use Docker

- Keep the Playwright and browser versions aligned.
- Isolate runtime dependencies from the host machine.
- Provide a reproducible foundation for a future CI environment.
- Reproduce the same black-box automation flow on another approved machine.

## Windows PowerShell

Enter the Automation directory from the portfolio root:

```powershell
cd .\projects\automation
```

Build the image. The first build is comparatively large because the official Playwright image includes browser runtime dependencies.

```powershell
docker build --no-cache -t low-code-qa-demo-portfolio-v8 .
```

Run the tests and persist reports on the host machine:

```powershell
docker run --rm `
  -v "${PWD}\playwright-report:/work/playwright-report" `
  -v "${PWD}\reports:/work/reports" `
  low-code-qa-demo-portfolio-v8
```

The container runs `npx playwright test` in headless mode. Generated files are written to the mounted host directories:

```text
projects/automation/playwright-report/
projects/automation/reports/
```

## Docker Compose Alternative

```powershell
docker compose -f .\docker\docker-compose.example.yml up --build --abort-on-container-exit
```

## Version Alignment

`package.json` fixes `@playwright/test` at `1.54.0`, and the Dockerfile uses `mcr.microsoft.com/playwright:v1.54.0-noble`. Keep the two versions aligned when upgrading.

## Interview Explanation

Docker is not the product being tested. It is an optional, reproducible QA test runtime. Local visible-browser execution is better suited to a live demonstration; Docker documents environment consistency, isolation, and a future CI integration path.
