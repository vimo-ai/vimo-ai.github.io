<template>
  <div 
    class="group relative cursor-pointer flex flex-col items-center justify-center w-40 h-40 transition-all duration-300"
    @mouseenter="$emit('hover')"
    @mouseleave="$emit('leave')"
    @click="$emit('click')"
  >
    <!-- Background Glow -->
    <div 
      class="absolute inset-0 rounded-full blur-[40px] transition-opacity duration-500"
      :class="[isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100']"
      :style="{ backgroundColor: `${color}0D` }"
    ></div>
    
    <!-- Icon Container -->
    <div 
      class="relative z-10 w-24 h-24 flex items-center justify-center transition-transform duration-300"
      :class="[isActive ? 'scale-110' : 'group-hover:scale-110']"
    >
      <!-- Main Icon Layer -->
      <svg 
        viewBox="0 0 100 100" 
        class="w-full h-full transition-all duration-300"
        :style="{ color: color, filter: `drop-shadow(0 0 8px ${color}80)` }"
        fill="none" 
        stroke="currentColor" 
        stroke-width="2"
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <path :d="path" />
      </svg>

      <!-- Glitch Layer 1 (Same Color) -->
      <svg 
        viewBox="0 0 100 100" 
        class="absolute inset-0 w-full h-full pointer-events-none"
        :class="[isActive ? 'opacity-50 animate-glitch' : 'opacity-0 group-hover:opacity-50 group-hover:animate-glitch']"
        :style="{ color: color }"
        fill="none" 
        stroke="currentColor" 
        stroke-width="2"
      >
        <path :d="path" />
      </svg>

      <!-- Glitch Layer 2 (Violet) -->
      <svg 
        viewBox="0 0 100 100" 
        class="absolute inset-0 w-full h-full text-neon-violet pointer-events-none"
        :class="[isActive ? 'opacity-50 animate-glitch-reverse' : 'opacity-0 group-hover:opacity-50 group-hover:animate-glitch-reverse']"
        fill="none" 
        stroke="currentColor" 
        stroke-width="2"
      >
        <path :d="path" />
      </svg>
    </div>
    
    <!-- Label with Glitch Effect -->
    <div 
      class="absolute -bottom-10 transition-opacity duration-300"
      :class="[isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100']"
    >
      <GlitchText 
        :text="label" 
        :text-class="`font-orbitron font-bold tracking-widest text-sm`"
        :style="{ color: color, filter: `drop-shadow(0 0 5px ${color}CC)` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import GlitchText from './GlitchText.vue'

defineProps<{
  path: string
  label: string
  color: string
  isActive?: boolean
}>()

defineEmits(['hover', 'leave', 'click'])
</script>
