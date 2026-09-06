# Autoship integration

AgentsIDE now exposes an Autoship deployment control in Workspace and Tools.

## Runtime endpoint

The client defaults to the existing Autoship Cloud Run endpoint. Override it at build time with:

`VITE_AUTOSHIP_URL=https://your-autoship-host`

## Flow

1. AgentsIDE checks `/api/projects` for a project tracking `https://github.com/zskbot/AgentsIDE`.
2. If missing, it creates the project through `POST /api/projects`.
3. Deploy triggers `POST /api/pipelines/trigger` for the `main` branch.
4. The returned pipeline ID is shown in the workspace.

The integration does not store GitHub tokens, Gemini keys, SSH credentials, or other deployment secrets in the AgentsIDE frontend.
