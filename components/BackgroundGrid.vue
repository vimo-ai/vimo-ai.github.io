<template>
  <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-cyber-black">
    <!-- Grid Pattern - Light Gray -->
    <div 
      class="absolute inset-0 opacity-15"
      style="background-image: linear-gradient(to right, #444444 1px, transparent 1px), linear-gradient(to bottom, #444444 1px, transparent 1px); background-size: 40px 40px;"
    ></div>
    
    <!-- Mouse Follower Light - Enhanced with Cyan/Violet Gradient -->
    <div 
      ref="light"
      class="absolute w-[1000px] h-[1000px] rounded-full opacity-30 pointer-events-none transition-transform duration-100 ease-out"
      style="background: radial-gradient(circle, rgba(0, 243, 255, 0.4) 0%, rgba(189, 0, 255, 0.2) 40%, transparent 70%); transform: translate(-50%, -50%);"
    ></div>
    
    <!-- Bottom Glow - Cyan/Violet Mix -->
    <div class="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-neon-cyan/5 via-neon-violet/5 to-transparent"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const light = ref<HTMLElement | null>(null)

const handleMouseMove = (e: MouseEvent) => {
  if (light.value) {
    light.value.style.left = `${e.clientX}px`
    light.value.style.top = `${e.clientY}px`
  }
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>
