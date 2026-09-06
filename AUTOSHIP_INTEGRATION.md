# Autoship integration

AgentsIDE exposes an Autoship deployment control in Workspace and Tools.

## Runtime endpoint

The frontend defaults to the existing Autoship Cloud Run endpoint. Override it at build time with:

`VITE_AUTOSHIP_URL=https://your-autoship-host`

## Interactive flow

1. AgentsIDE checks `/api/projects` for a project tracking `https://github.com/zskbot/AgentsIDE`.
2. If missing, it creates the project through `POST /api/projects`.
3. Deploy triggers `POST /api/pipelines/trigger` for the `main` branch.
4. The returned pipeline ID is shown in the workspace.

## Server-side deployment flow

`.github/workflows/autoship-deploy.yml` provides the production-safe path for GitHub Actions. It runs only after `AgentsIDE CI` succeeds on `main`, then calls Autoship server-to-server. This avoids browser CORS and keeps deployment configuration out of the frontend bundle.

Configure these GitHub Actions repository secrets when the Autoship API is publicly reachable:

- `AUTOSHIP_URL` — base URL of the Autoship service.
- `AUTOSHIP_PROJECT_ID` — the Autoship project ID tracking AgentsIDE.

If either secret is missing, the workflow exits successfully without deploying. This makes the integration safe to merge before the deployment service is exposed.

## Security boundary

The integration does not store GitHub tokens, Gemini keys, SSH credentials, or deployment secrets in the AgentsIDE frontend. Browser-side deployment is intended for development; the GitHub Actions path is the preferred production trigger.
