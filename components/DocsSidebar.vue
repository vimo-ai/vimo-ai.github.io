<template>
  <aside class="w-64 flex-shrink-0 border-r border-gray-800 p-4">
    <nav class="sticky top-4">
      <div class="mb-6">
        <NuxtLink
          to="/docs/memex"
          class="text-lg font-bold text-neon-cyan hover:text-neon-pink transition-colors"
        >
          Memex
        </NuxtLink>
      </div>

      <ul class="space-y-1">
        <li v-for="item in navigation" :key="item.path">
          <NuxtLink
            :to="item.path"
            class="block px-3 py-2 rounded-lg transition-colors"
            :class="isActive(item.path)
              ? 'bg-gray-800 text-neon-cyan'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'"
          >
            {{ item.title }}
          </NuxtLink>

          <!-- Children -->
          <ul v-if="item.children" class="ml-4 mt-1 space-y-1">
            <li v-for="child in item.children" :key="child.path">
              <NuxtLink
                :to="child.path"
                class="block px-3 py-1.5 text-sm rounded-lg transition-colors"
                :class="isActive(child.path)
                  ? 'bg-gray-800 text-neon-cyan'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'"
              >
                {{ child.title }}
              </NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute()

interface NavItem {
  title: string
  path: string
  children?: NavItem[]
}

const navigation: NavItem[] = [
  { title: 'Introduction', path: '/docs/memex' },
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

function isActive(path: string): boolean {
  return route.path === path
}
</script>
