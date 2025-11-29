<template>
  <div 
    class="group relative cursor-pointer flex flex-col items-center justify-center w-24 h-24 transition-all duration-300"
    @mouseenter="$emit('hover')"
    @mouseleave="$emit('leave')"
    @click="$emit('click')"
  >
    <!-- Glow Effect -->
    <div class="absolute inset-0 bg-cyber-primary/0 group-hover:bg-cyber-primary/10 rounded-xl transition-all duration-300 blur-md"></div>
    
    <!-- Icon Container -->
    <div class="relative z-10 w-16 h-16 border border-cyber-primary/30 group-hover:border-cyber-primary bg-cyber-black/50 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,255,65,0.3)]">
      <svg 
        viewBox="0 0 24 24" 
        class="w-8 h-8 text-cyber-primary/70 group-hover:text-cyber-primary transition-colors duration-300"
        fill="none" 
        stroke="currentColor" 
        stroke-width="1.5"
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <path :d="path" />
      </svg>
    </div>
    
    <!-- Label -->
    <div class="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-cyber-primary text-xs font-mono tracking-wider whitespace-nowrap">
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  path: string
  label: string
}>()

defineEmits(['hover', 'leave', 'click'])
</script>
