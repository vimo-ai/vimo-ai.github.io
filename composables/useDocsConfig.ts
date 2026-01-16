// Docs configuration for multi-project documentation

export interface NavItem {
  title: string
  path: string
  children?: NavItem[]
}

export interface ProjectConfig {
  id: string
  label: string
  description: string
  color: string
  icon: string
  navigation: NavItem[]
}

// All documentation projects
export const docsProjects: ProjectConfig[] = [
  {
    id: 'eterm',
    label: 'ETerm',
    description: 'Terminal for AI CLI workflows',
    color: '#00f3ff',
    // Terminal window icon
    icon: 'M15 20 H85 V80 H15 Z M15 20 V30 H85 V20 M20 25 A2 2 0 1 0 20 25.01 M27 25 A2 2 0 1 0 27 25.01 M34 25 A2 2 0 1 0 34 25.01 M25 45 L35 45 M25 55 L50 55 M25 65 L40 65',
    navigation: [
      { title: 'Introduction', path: '/docs/eterm' },
      { title: 'Why ETerm', path: '/docs/eterm/why' },
      { title: 'Installation', path: '/docs/eterm/installation' },
      { title: 'Architecture', path: '/docs/eterm/architecture' },
      {
        title: 'Plugins',
        path: '/docs/eterm/plugins',
        children: [
          { title: 'Plugin SDK', path: '/docs/eterm/plugins/sdk' }
        ]
      }
    ]
  },
  {
    id: 'memex',
    label: 'Memex',
    description: 'Claude Code session history',
    color: '#00f3ff',
    // Brain/chip circuit icon (from homepage)
    icon: 'M30 25 H70 V75 H30 Z M40 35 H60 M40 45 H60 M40 55 H60 M30 25 L20 15 M70 25 L80 15 M30 75 L20 85 M70 75 L80 85 M20 40 H30 M20 50 H30 M20 60 H30 M70 40 H80 M70 50 H80 M70 60 H80',
    navigation: [
      { title: 'Introduction', path: '/docs/memex' },
      { title: 'Why Memex', path: '/docs/memex/why' },
      { title: 'Installation', path: '/docs/memex/installation' },
      { title: 'Configuration', path: '/docs/memex/configuration' },
      { title: 'API Reference', path: '/docs/memex/api' },
      { title: 'MCP Tools', path: '/docs/memex/mcp' },
      { title: 'Architecture', path: '/docs/memex/architecture' },
      {
        title: 'Internals',
        path: '/docs/memex/internals',
        children: [
          { title: 'Scheduler', path: '/docs/memex/internals/scheduler' }
        ]
      }
    ]
  }
]

// Get flat navigation for prev/next
export function getFlatNavigation(projectId: string): { path: string; title: string }[] {
  const project = docsProjects.find(p => p.id === projectId)
  if (!project) return []

  const flat: { path: string; title: string }[] = []

  const flatten = (items: NavItem[]) => {
    for (const item of items) {
      flat.push({ path: item.path, title: item.title })
      if (item.children) {
        flatten(item.children)
      }
    }
  }

  flatten(project.navigation)
  return flat
}

// Get project from path
export function getProjectFromPath(path: string): ProjectConfig | undefined {
  // Extract project id from path like /docs/eterm/... or /docs/memex/...
  const match = path.match(/^\/docs\/([^/]+)/)
  if (!match) return undefined

  const projectId = match[1]
  return docsProjects.find(p => p.id === projectId)
}

// Composable
export function useDocsConfig() {
  const route = useRoute()

  const currentProject = computed(() => {
    return getProjectFromPath(route.path)
  })

  const currentNavigation = computed(() => {
    return currentProject.value?.navigation ?? []
  })

  const flatNavigation = computed(() => {
    if (!currentProject.value) return []
    return getFlatNavigation(currentProject.value.id)
  })

  return {
    projects: docsProjects,
    currentProject,
    currentNavigation,
    flatNavigation
  }
}
