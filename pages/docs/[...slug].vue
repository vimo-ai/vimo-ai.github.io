<template>
  <div class="min-h-screen bg-cyber-black text-gray-100">
    <div class="flex max-w-7xl mx-auto">
      <!-- Sidebar -->
      <DocsSidebar class="hidden lg:block" />

      <!-- Main Content -->
      <main class="flex-1 min-w-0 px-6 py-12 lg:px-12">
        <!-- Back Link (mobile) -->
        <NuxtLink to="/" class="text-neon-cyan hover:underline mb-8 inline-block lg:hidden">
          &larr; Back to Home
        </NuxtLink>

        <!-- Content -->
        <article v-if="doc" class="prose prose-invert prose-cyan max-w-none">
          <h1>{{ doc.title }}</h1>
          <p v-if="doc.description" class="text-gray-400 text-lg">{{ doc.description }}</p>
          <ContentRenderer :value="doc" />
        </article>

        <div v-else class="text-center py-20">
          <h1 class="text-2xl text-gray-500">Document not found</h1>
          <NuxtLink to="/" class="text-neon-cyan hover:underline mt-4 inline-block">
            Go Home
          </NuxtLink>
        </div>

        <!-- Prev/Next Navigation -->
        <nav v-if="doc" class="mt-16 pt-8 border-t border-gray-800">
          <div class="flex justify-between items-center">
            <NuxtLink
              v-if="prevPage"
              :to="prevPage.path"
              class="group flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors"
            >
              <span class="text-xl">&larr;</span>
              <div>
                <div class="text-xs text-gray-500 group-hover:text-gray-400">Previous</div>
                <div>{{ prevPage.title }}</div>
              </div>
            </NuxtLink>
            <div v-else></div>

            <NuxtLink
              v-if="nextPage"
              :to="nextPage.path"
              class="group flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors text-right"
            >
              <div>
                <div class="text-xs text-gray-500 group-hover:text-gray-400">Next</div>
                <div>{{ nextPage.title }}</div>
              </div>
              <span class="text-xl">&rarr;</span>
            </NuxtLink>
            <div v-else></div>
          </div>
        </nav>
      </main>

      <!-- Table of Contents (right sidebar) -->
      <aside v-if="doc && toc.length > 0" class="hidden xl:block w-64 flex-shrink-0 p-4">
        <div class="sticky top-4">
          <h4 class="text-sm font-semibold text-gray-400 mb-3">On this page</h4>
          <ul class="space-y-2 text-sm">
            <li v-for="item in toc" :key="item.id">
              <a
                :href="`#${item.id}`"
                class="text-gray-500 hover:text-neon-cyan transition-colors"
                :class="{ 'pl-3': item.depth === 3 }"
              >
                {{ item.text }}
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

// Build path from slug
const slug = computed(() => {
  const s = route.params.slug
  return Array.isArray(s) ? s.join('/') : s || 'index'
})

const { data: doc } = await useAsyncData(`doc-${slug.value}`, () => {
  return queryCollection('docs').path(`/docs/${slug.value}`).first()
})

// Navigation order
const navOrder = [
  { path: '/docs/memex', title: 'Introduction' },
  { path: '/docs/memex/installation', title: 'Installation' },
  { path: '/docs/memex/configuration', title: 'Configuration' },
  { path: '/docs/memex/api', title: 'API Reference' },
  { path: '/docs/memex/mcp', title: 'MCP Tools' },
  { path: '/docs/memex/architecture', title: 'Architecture' },
  { path: '/docs/memex/internals', title: 'Internals' },
  { path: '/docs/memex/internals/scheduler', title: 'Scheduler Internals' }
]

// Find current index
const currentIndex = computed(() => {
  const currentPath = `/docs/${slug.value}`
  return navOrder.findIndex(item => item.path === currentPath)
})

const prevPage = computed(() => {
  if (currentIndex.value > 0) {
    return navOrder[currentIndex.value - 1]
  }
  return null
})

const nextPage = computed(() => {
  if (currentIndex.value >= 0 && currentIndex.value < navOrder.length - 1) {
    return navOrder[currentIndex.value + 1]
  }
  return null
})

// Extract TOC from document
const toc = computed(() => {
  if (!doc.value?.body?.toc?.links) return []
  return doc.value.body.toc.links.flatMap((link: any) => {
    const items = [{ id: link.id, text: link.text, depth: 2 }]
    if (link.children) {
      items.push(...link.children.map((child: any) => ({
        id: child.id,
        text: child.text,
        depth: 3
      })))
    }
    return items
  })
})
</script>

<style>
/* Basic prose styling */
.prose h1 { @apply text-3xl font-bold text-neon-cyan mb-4; }
.prose h2 { @apply text-2xl font-semibold text-gray-100 mt-8 mb-4; }
.prose h3 { @apply text-xl font-semibold text-gray-200 mt-6 mb-3; }
.prose p { @apply text-gray-300 mb-4; }
.prose ul { @apply list-disc list-inside text-gray-300 mb-4; }
.prose ol { @apply list-decimal list-inside text-gray-300 mb-4; }
.prose li { @apply mb-2; }
.prose code { @apply bg-gray-800 px-1.5 py-0.5 rounded text-neon-cyan text-sm; }
.prose pre { @apply bg-gray-900 p-4 rounded-lg overflow-x-auto mb-4; }
.prose pre code { @apply bg-transparent p-0; }
.prose table { @apply w-full border-collapse mb-4; }
.prose th { @apply bg-gray-800 px-4 py-2 text-left border border-gray-700; }
.prose td { @apply px-4 py-2 border border-gray-700; }
.prose strong { @apply text-gray-100; }
.prose a { @apply text-neon-cyan hover:underline; }
.prose blockquote { @apply border-l-4 border-neon-cyan pl-4 italic text-gray-400; }
.prose hr { @apply border-gray-700 my-8; }

/* Mermaid diagrams */
.mermaid-diagram {
  @apply bg-gray-900/50 p-6 rounded-lg overflow-x-auto mb-6 border border-gray-800;
  display: flex;
  justify-content: center;
}

.mermaid-diagram svg {
  max-width: 100%;
  height: auto;
}
</style>
