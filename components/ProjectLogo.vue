<template>
  <div 
    class="group relative cursor-pointer flex flex-col items-center justify-center p-4 transition-all duration-300"
    @mouseenter="$emit('hover')"
    @mouseleave="$emit('leave')"
    @click="$emit('click')"
  >
    <!-- Chip Pins (Cyberpunk Style) -->
    <div class="absolute inset-0 pointer-events-none">
      <!-- Top Pins -->
      <div class="absolute -top-1.5 left-1/2 -translate-x-1/2 flex gap-2">
        <div v-for="i in 4" :key="`t-${i}`" class="w-2 h-3 shadow-[0_0_8px_currentColor] rounded-[1px] transition-colors duration-300" :style="{ backgroundColor: color, color: color }"></div>
      </div>
      <!-- Bottom Pins -->
      <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex gap-2">
        <div v-for="i in 4" :key="`b-${i}`" class="w-2 h-3 shadow-[0_0_8px_currentColor] rounded-[1px] transition-colors duration-300" :style="{ backgroundColor: color, color: color }"></div>
      </div>
      <!-- Left Pins -->
      <div class="absolute -left-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <div v-for="i in 4" :key="`l-${i}`" class="w-3 h-2 shadow-[0_0_8px_currentColor] rounded-[1px] transition-colors duration-300" :style="{ backgroundColor: color, color: color }"></div>
      </div>
      <!-- Right Pins -->
      <div class="absolute -right-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <div v-for="i in 4" :key="`r-${i}`" class="w-3 h-2 shadow-[0_0_8px_currentColor] rounded-[1px] transition-colors duration-300" :style="{ backgroundColor: color, color: color }"></div>
      </div>
    </div>

    <!-- Chip Body (Flat Cyberpunk) -->
    <div 
      class="absolute inset-2 bg-[#050505] border border-neon-cyan/30 backdrop-blur-sm"
      :style="{ borderColor: isActive ? color : '#333', boxShadow: isActive ? `0 0 15px ${color}40` : 'none' }"
    >
      <!-- Corner Accents -->
      <div class="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/50"></div>
      <div class="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/50"></div>
      <div class="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/50"></div>
      <div class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/50"></div>
      
      <!-- Silkscreen Text -->
      <div class="absolute top-1.5 left-2 text-[8px] font-mono text-white/40 tracking-widest pointer-events-none">
        VIMO-IC-{{ label.substring(0, 3) }}
      </div>
      <div class="absolute bottom-1.5 right-2 text-[8px] font-mono text-white/40 tracking-widest pointer-events-none">
        SYS.{{ new Date().getFullYear() }}
      </div>
    </div>

    <!-- Background Glow (Behind Icon) -->
    <div 
      class="absolute inset-0 rounded-full blur-[40px] transition-opacity duration-500 z-0"
      :class="[isActive ? 'opacity-60' : 'opacity-0 group-hover:opacity-40']"
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
        stroke-linecap="round" 
        stroke-linejoin="round"
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
      class="mt-4 transition-opacity duration-300 relative z-20"
      :class="[isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100']"
    >
      <GlitchText 
        :text="label" 
        :text-class="`font-orbitron font-bold tracking-widest text-sm whitespace-nowrap`"
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
