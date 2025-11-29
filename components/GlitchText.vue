<template>
  <div class="relative group inline-block">
    <!-- Main Text -->
    <span class="relative z-10" :class="textClass">{{ text }}</span>
    
    <!-- Cyan Offset Layer -->
    <span 
      class="absolute top-0 left-0 text-neon-cyan opacity-0 group-hover:opacity-70 group-hover:animate-glitch translate-x-[2px] pointer-events-none select-none mix-blend-screen"
      :class="textClass"
    >
      {{ text }}
    </span>
    
    <!-- Violet Offset Layer -->
    <span 
      class="absolute top-0 left-0 text-neon-violet opacity-0 group-hover:opacity-70 group-hover:animate-glitch-reverse -translate-x-[2px] pointer-events-none select-none mix-blend-screen"
      :class="textClass"
    >
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
  textClass?: string
}>()
</script>
