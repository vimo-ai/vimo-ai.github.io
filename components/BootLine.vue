<template>
  <path
    :d="d"
    fill="none"
    :stroke="color"
    stroke-width="3"
    stroke-linecap="round"
    filter="url(#glow-line)"
    stroke-dasharray="3000"
    :stroke-dashoffset="3000 - (progress * 3000)"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  d: string
  color: string
  duration?: number
}>()

const progress = ref(0)

onMounted(() => {
  const duration = props.duration || 2000
  const startTime = performance.now()
  
  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const p = Math.min(elapsed / duration, 1)
    
    progress.value = p
    
    if (p < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  requestAnimationFrame(animate)
})
</script>
