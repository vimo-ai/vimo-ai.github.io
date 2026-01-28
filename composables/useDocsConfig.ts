// Docs configuration for multi-project documentation

export interface NavItem {
  titleKey: string  // i18n key for title
  path: string
  children?: NavItem[]
}

export interface ProjectConfig {
  id: string
  labelKey: string  // i18n key: docs.projects.{id}.label
  descriptionKey: string  // i18n key: docs.projects.{id}.description
  color: string
  icon: string
  navigation: NavItem[]
}

// All documentation projects (using i18n keys)
export const docsProjects: ProjectConfig[] = [
  {
    id: 'eterm',
    labelKey: 'docs.projects.eterm.label',
    descriptionKey: 'docs.projects.eterm.description',
    color: '#00f3ff',
    icon: 'M15 20 H85 V80 H15 Z M15 20 V30 H85 V20 M20 25 A2 2 0 1 0 20 25.01 M27 25 A2 2 0 1 0 27 25.01 M34 25 A2 2 0 1 0 34 25.01 M25 45 L35 45 M25 55 L50 55 M25 65 L40 65',
    navigation: [
      { titleKey: 'docs.eterm.introduction', path: '/docs/eterm' },
      { titleKey: 'docs.eterm.why', path: '/docs/eterm/why' },
      { titleKey: 'docs.eterm.installation', path: '/docs/eterm/installation' },
      { titleKey: 'docs.eterm.architecture', path: '/docs/eterm/architecture' },
      {
        titleKey: 'docs.eterm.plugins',
        path: '/docs/eterm/plugins',
        children: [
          { titleKey: 'docs.eterm.plugin_sdk', path: '/docs/eterm/plugins/sdk' }
        ]
      }
    ]
  },
  {
    id: 'memex',
    labelKey: 'docs.projects.memex.label',
    descriptionKey: 'docs.projects.memex.description',
    color: '#00f3ff',
    icon: 'M30 25 H70 V75 H30 Z M40 35 H60 M40 45 H60 M40 55 H60 M30 25 L20 15 M70 25 L80 15 M30 75 L20 85 M70 75 L80 85 M20 40 H30 M20 50 H30 M20 60 H30 M70 40 H80 M70 50 H80 M70 60 H80',
    navigation: [
      { titleKey: 'docs.memex.introduction', path: '/docs/memex' },
      { titleKey: 'docs.memex.why', path: '/docs/memex/why' },
      { titleKey: 'docs.memex.installation', path: '/docs/memex/installation' },
      { titleKey: 'docs.memex.configuration', path: '/docs/memex/configuration' },
      { titleKey: 'docs.memex.api', path: '/docs/memex/api' },
      { titleKey: 'docs.memex.mcp', path: '/docs/memex/mcp' },
      {
        titleKey: 'docs.memex.how_it_works',
        path: '/docs/memex/how-it-works',
        children: [
          { titleKey: 'docs.memex.collection', path: '/docs/memex/how-it-works/collection' },
          { titleKey: 'docs.memex.storage', path: '/docs/memex/how-it-works/storage' },
          { titleKey: 'docs.memex.compact', path: '/docs/memex/how-it-works/compact' },
          { titleKey: 'docs.memex.search', path: '/docs/memex/how-it-works/search' }
        ]
      },
      {
        titleKey: 'docs.memex.advanced',
        path: '/docs/memex/advanced',
        children: [
          { titleKey: 'docs.memex.hooks', path: '/docs/memex/advanced/hooks' }
        ]
      }
    ]
  },
  {
    id: 'mcp-router',
    labelKey: 'docs.projects.mcp_router.label',
    descriptionKey: 'docs.projects.mcp_router.description',
    color: '#00f3ff',
    icon: 'M50 20 L50 35 M50 65 L50 80 M20 50 L35 50 M65 50 L80 50 M50 50 m-15 0 a15 15 0 1 0 30 0 a15 15 0 1 0 -30 0 M35 35 L25 25 M65 35 L75 25 M35 65 L25 75 M65 65 L75 75',
    navigation: [
      { titleKey: 'docs.mcp_router.introduction', path: '/docs/mcp-router' },
      { titleKey: 'docs.mcp_router.why', path: '/docs/mcp-router/why' },
      { titleKey: 'docs.mcp_router.installation', path: '/docs/mcp-router/installation' },
      { titleKey: 'docs.mcp_router.usage', path: '/docs/mcp-router/usage' },
      { titleKey: 'docs.mcp_router.architecture', path: '/docs/mcp-router/architecture' }
    ]
  }
]

// Get flat navigation for prev/next (returns keys, caller must translate)
export function getFlatNavigation(projectId: string): { path: string; titleKey: string }[] {
  const project = docsProjects.find(p => p.id === projectId)
  if (!project) return []

  const flat: { path: string; titleKey: string }[] = []

  const flatten = (items: NavItem[]) => {
    for (const item of items) {
      flat.push({ path: item.path, titleKey: item.titleKey })
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
  const match = path.match(/^\/docs\/([^/]+)/)
  if (!match) return undefined

  const projectId = match[1]
  return docsProjects.find(p => p.id === projectId)
}

// Composable
export function useDocsConfig() {
  const route = useRoute()
  const { locale, t } = useI18n()

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
    flatNavigation,
    locale,
    t
  }
}
