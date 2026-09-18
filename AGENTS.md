# AGENTS.md

## Repository purpose

This repository provides CNB operations to ChatGPT and other MCP clients. The main goal is reliable repository-development automation: read code, inspect Git state, modify files, manage pull requests, and inspect or trigger CNB builds.

## Before changing code

1. Read README.md, package.json, and the relevant files under src/.
2. Treat swagger.json as the checked-in OpenAPI snapshot used for TypeScript schema generation.
3. Keep the repository root minimal. Do not restore obsolete CI, publishing, editor, hook, or split Swagger files without a concrete requirement.
4. Preserve existing MCP tool names unless a breaking change is explicitly intended.

## Development rules

- Prefer the small CnbApiClient wrapper for new ordinary JSON CNB APIs.
- Existing Build and Knowledge Base adapters use the legacy CNB request wrapper; avoid unrelated refactors in those paths.
- Update README.md whenever connection behavior, authentication, runtime commands, or the exposed tool surface materially changes.
- Never commit src/schema.d.ts; regenerate it with npm run generate:schema.
- Keep Dockerfile and compose.yml aligned with the documented runtime environment. The Docker runtime must retain git because cnb_apply_patch uses native Git operations.

## Validation

Run before merging changes:

~~~bash
npm ci
npm run check
~~~

npm run check performs schema generation, ESLint, Prettier validation, and TypeScript compilation. CI also performs a Docker Compose smoke test using docker compose up -d --build and verifies /healthz plus the git binary inside the runtime container.

## Authentication and secrets

- Never commit CNB tokens or other credentials.
- HTTP requests may provide the CNB token with Authorization: Bearer <token>.
- Local/server fallback variables are API_TOKEN and then CNB_TOKEN.
- Git write operations must keep credentials transient. cnb_apply_patch uses a temporary GIT_ASKPASS helper and must not be changed to embed tokens in remote URLs or Git config.

## Pull requests and CI

- Bind CI conclusions to the exact pull-request HEAD commit.
- Inspect the failing job/log before changing code.
- Merge only after the current HEAD passes the required checks.
