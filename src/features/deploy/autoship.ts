export type AutoshipProject = {
  id: string
  name: string
  repoUrl: string
  branch: string
  target: string
  autoDeployOnPush: boolean
  lastDeployStatus?: string
  totalBuilds?: number
}

export type AutoshipRun = {
  id: string
  projectId: string
  status: string
  commitMessage: string
  branch: string
  triggeredBy: string
  deployedUrl?: string
  startedAt: string
}

const configuredBaseUrl = (import.meta.env.VITE_AUTOSHIP_URL as string | undefined)?.trim()
export const AUTOSHIP_URL = (configuredBaseUrl || 'https://ais-dev-po4u3k2theglc3tqxoryuu-260459870834.asia-southeast1.run.app').replace(/\/$/, '')

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${AUTOSHIP_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  })
  if (!response.ok) throw new Error(`Autoship ${response.status}: ${await response.text()}`)
  return response.json() as Promise<T>
}

export async function getAutoshipProjects(): Promise<AutoshipProject[]> {
  const data = await request<{ projects: AutoshipProject[] }>('/api/projects')
  return data.projects
}

export async function ensureAgentsIDEProject(): Promise<AutoshipProject> {
  const repoUrl = 'https://github.com/zskbot/AgentsIDE'
  const projects = await getAutoshipProjects()
  const existing = projects.find(project => project.repoUrl.replace(/\/$/, '') === repoUrl)
  if (existing) return existing
  const data = await request<{ project: AutoshipProject }>('/api/projects', {
    method: 'POST',
    body: JSON.stringify({
      name: 'AgentsIDE', repoUrl, branch: 'main', target: 'static-server',
      framework: 'react-vite', buildCommand: 'npm ci && npm run build',
      autoDeployOnPush: true, notifyOnSuccess: true, notifyOnFailure: true,
    }),
  })
  return data.project
}

export async function triggerAgentsIDEDeploy(projectId: string, commitMessage = 'deploy: AgentsIDE through Autoship') {
  const data = await request<{ run: AutoshipRun }>('/api/pipelines/trigger', {
    method: 'POST',
    body: JSON.stringify({ projectId, commitMessage, branch: 'main', author: 'AgentsIDE', triggeredBy: 'agentside' }),
  })
  return data.run
}
