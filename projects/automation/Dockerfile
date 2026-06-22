# Phase 1+ optional container execution image.
# This image packages only the QA automation runtime and test scripts.
# It does NOT include the system-under-test source code.
#
# Important:
# Keep @playwright/test version in package.json aligned with this image tag.
FROM mcr.microsoft.com/playwright:v1.54.0-noble

WORKDIR /work

COPY package.json ./
RUN npm install --no-audit --no-fund

COPY . .

ENV CI=true
CMD ["npx", "playwright", "test"]
