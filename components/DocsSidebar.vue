<template>
  <aside class="w-64 flex-shrink-0 border-r border-gray-800 p-4">
    <nav class="sticky top-20">
      <!-- Project Title -->
      <div class="mb-6" v-if="currentProject">
        <NuxtLink
          :to="`/docs/${currentProject.id}`"
          class="text-lg font-bold text-neon-cyan hover:text-neon-pink transition-colors"
        >
          {{ $t(currentProject.labelKey) }}
        </NuxtLink>
        <p class="text-xs text-gray-500 mt-1">{{ $t(currentProject.descriptionKey) }}</p>
      </div>

      <!-- Navigation -->
      <ul class="space-y-1">
        <li v-for="item in navigation" :key="item.path">
          <NuxtLink
            :to="item.path"
            class="block px-3 py-2 rounded-lg transition-colors"
            :class="isActive(item.path)
              ? 'bg-gray-800 text-neon-cyan'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'"
          >
            {{ $t(item.titleKey) }}
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
                {{ $t(child.titleKey) }}
              </NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useDocsConfig } from '~/composables/useDocsConfig'

const route = useRoute()
const { currentProject, currentNavigation } = useDocsConfig()

const navigation = currentNavigation

function isActive(path: string): boolean {
  return route.path === path
}
</script>
