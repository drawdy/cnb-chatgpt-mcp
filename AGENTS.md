# AGENTS.md

## Repository purpose

This repository is a maintained fork of the archived CNB MCP Server. Its primary purpose is to let ChatGPT and other MCP clients operate CNB repositories for real development workflows, especially HyperEyes.

## Before changing code

1. Read `README.md`, `package.json`, and the relevant files under `src/`.
2. Treat `swagger.json` as the checked-in OpenAPI snapshot used for TypeScript schema generation.
3. Do not restore the removed upstream publishing/CNB-internal workflow files such as `.cnb.yml`, Husky hooks, split `swagger/` files, or the old CodeBuddy prompt unless there is a concrete new requirement.
4. Preserve existing MCP tool names unless a breaking change is explicitly intended.

## Development rules

- Prefer the small `CnbApiClient` wrapper for new ordinary JSON CNB APIs.
- Existing Build and Knowledge Base adapters use the legacy CNB request wrapper; do not refactor them casually while changing unrelated features.
- Keep the root directory minimal. Add documentation only when it is operationally useful.
- Update `README.md` whenever connection behavior, authentication, runtime commands, or the exposed tool surface materially changes.
- Never commit `src/schema.d.ts`; regenerate it with `npm run generate:schema`.

## Validation

Run before opening or merging a PR:

```bash
npm ci
npm run check
```

`npm run check` performs schema generation, ESLint, Prettier validation, and TypeScript compilation.

## Authentication and secrets

- Never commit CNB tokens or other credentials.
- HTTP requests may provide the CNB token with `Authorization: Bearer <token>`.
- Local/server fallback variables are `API_TOKEN` and then `CNB_TOKEN`.
- Git write operations must keep credentials transient. The current `cnb_apply_patch` implementation uses a temporary `GIT_ASKPASS` helper and must not be changed to embed tokens in remote URLs or Git config.

## Pull requests and CI

- Bind CI conclusions to the exact PR HEAD commit.
- Inspect the failing job/log before changing code.
- Merge only after the current PR HEAD passes the required checks.
