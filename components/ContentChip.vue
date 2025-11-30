<template>
  <div 
    class="group relative cursor-pointer flex flex-col items-center justify-center w-24 h-24 transition-all duration-300"
    @mouseenter="$emit('hover')"
    @mouseleave="$emit('leave')"
    @click="$emit('click')"
  >
    <!-- Background Glow -->
    <div 
      class="absolute inset-0 rounded-lg blur-[20px] transition-opacity duration-500"
      :class="[isActive ? 'opacity-80' : 'opacity-0 group-hover:opacity-60']"
      :style="{ backgroundColor: `${color}0D` }"
    ></div>
    
    <!-- Chip Container -->
    <div 
      class="relative z-10 w-16 h-16 flex items-center justify-center transition-transform duration-300 border border-white/10 bg-cyber-black/80 backdrop-blur-sm"
      :class="[isActive ? 'scale-110 border-opacity-50' : 'group-hover:scale-110 group-hover:border-opacity-50']"
      :style="{ borderColor: color }"
    >
      <!-- Corner Accents -->
      <div class="absolute -top-px -left-px w-2 h-2 border-t border-l border-white/30"></div>
      <div class="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-white/30"></div>

      <!-- Main Icon -->
      <svg 
        viewBox="0 0 100 100" 
        class="w-10 h-10 transition-all duration-300"
        :style="{ color: color, filter: isActive ? `drop-shadow(0 0 5px ${color})` : '' }"
        fill="none" 
        stroke="currentColor" 
        stroke-width="2"
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <path :d="path" />
      </svg>
    </div>
    
    <!-- Label -->
    <div 
      class="absolute -bottom-6 transition-opacity duration-300"
      :class="[isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100']"
    >
      <span 
        class="font-orbitron font-bold tracking-wider text-[10px]"
        :style="{ color: color }"
      >
        {{ label }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  path: string
  label: string
  color: string
  isActive?: boolean
}>()

defineEmits(['hover', 'leave', 'click'])
</script>
