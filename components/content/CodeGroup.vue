<script setup lang="ts">
import { ref, computed, useSlots, onMounted } from 'vue'

const slots = useSlots()
const activeTab = ref(0)

// Extract tab labels from slot content
// In MDC, code blocks with [Label] syntax get the label as 'filename' prop
const tabs = computed(() => {
  const defaultSlot = slots.default?.()
  if (!defaultSlot) return []

  const extractedTabs: { label: string; index: number }[] = []
  let tabIndex = 0

  const processNode = (node: any) => {
    if (!node) return

    // Check if this is a code block (ProseCode/ProsePre) or has code-related props
    const props = node.props || {}
    const typeName = node.type?.name || node.type?.__name || ''

    // Look for code blocks - they might be ProseCode, ProsePre, or have code/language props
    if (
      typeName.includes('Code') ||
      typeName.includes('Pre') ||
      props.code !== undefined ||
      props.language !== undefined ||
      props.filename !== undefined
    ) {
      // Extract label: try filename first (from [Label] syntax), then language, then default
      const label = props.filename || props.language || `Tab ${tabIndex + 1}`
      extractedTabs.push({ label, index: tabIndex })
      tabIndex++
    }

    // Also check children recursively for nested content
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(processNode)
    }
  }

  defaultSlot.forEach(processNode)

  // If we couldn't find labeled tabs, fall back to simple indexing
  if (extractedTabs.length === 0) {
    defaultSlot.forEach((_: any, i: number) => {
      extractedTabs.push({ label: `Tab ${i + 1}`, index: i })
    })
  }

  return extractedTabs
})

// Get filtered content nodes (only code blocks for display)
const contentNodes = computed(() => {
  const defaultSlot = slots.default?.()
  if (!defaultSlot) return []
  return defaultSlot
})
</script>

<template>
  <div class="code-group my-4 rounded-lg border border-gray-700 overflow-hidden">
    <!-- Tab headers -->
    <div v-if="tabs.length > 1" class="flex bg-gray-900 border-b border-gray-700 overflow-x-auto">
      <button
        v-for="(tab, idx) in tabs"
        :key="idx"
        @click="activeTab = idx"
        class="px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
        :class="activeTab === idx
          ? 'text-green-400 bg-gray-800 border-b-2 border-green-400'
          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab content -->
    <div class="code-group-content">
      <template v-for="(node, idx) in contentNodes" :key="idx">
        <div v-show="activeTab === idx" class="[&>pre]:my-0 [&>pre]:rounded-none [&>div]:my-0">
          <component :is="node" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.code-group :deep(pre) {
  margin: 0;
  border-radius: 0;
}

.code-group :deep(.prose-code) {
  margin: 0;
}
</style>
