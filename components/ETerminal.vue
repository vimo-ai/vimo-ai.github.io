<template>
  <div class="relative w-[700px] h-[450px] flex flex-col font-mono group">
    <!-- Energy Core Background -->
    <div class="absolute inset-0 bg-neon-cyan/5 rounded-lg blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
    <div class="absolute -inset-[1px] bg-gradient-to-b from-neon-cyan/50 to-neon-violet/50 rounded-lg opacity-30"></div>

    <!-- Terminal Window -->
    <div class="relative z-10 flex-1 bg-cyber-black/90 backdrop-blur-md border border-neon-cyan/30 rounded-lg p-8 shadow-[0_0_30px_rgba(0,243,255,0.1)] overflow-hidden">
      
      <!-- Scanline Effect -->
      <div class="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%]"></div>

      <!-- Header -->
      <div class="flex items-center justify-between mb-6 border-b border-neon-cyan/20 pb-4">
        <div class="flex gap-3">
          <div class="w-3 h-3 rounded-full bg-neon-violet/80 shadow-[0_0_8px_#bd00ff]"></div>
          <div class="w-3 h-3 rounded-full bg-neon-cyan/80 shadow-[0_0_8px_#00f3ff]"></div>
          <div class="w-3 h-3 rounded-full bg-cyber-gray/80"></div>
        </div>
        <div class="font-orbitron text-xs text-neon-cyan/70 tracking-widest">VIMO_SYSTEM_CORE // v2.0</div>
      </div>

      <!-- Content -->
      <div class="relative z-30 flex-1 overflow-hidden text-neon-cyan text-lg leading-relaxed whitespace-pre-wrap font-medium drop-shadow-[0_0_2px_rgba(0,243,255,0.5)]">
        <span>{{ displayedText }}</span>
        <!-- Vim Command Line (shown during delete animation) -->
        <div v-if="showVimCommand" class="mt-2 text-neon-violet">{{ vimCommand }}<span class="animate-blink inline-block w-3 h-6 bg-neon-violet align-middle ml-1"></span></div>
        <!-- Normal Cursor (shown when not in vim command mode) -->
        <span v-else class="animate-blink inline-block w-3 h-6 bg-neon-cyan align-middle ml-1 shadow-[0_0_8px_#00f3ff]"></span>
      </div>

      <!-- Footer -->
      <div class="mt-6 flex justify-between items-end text-xs font-orbitron text-neon-cyan/40">
        <div class="flex flex-col gap-1">
          <div>MEM_USAGE: 4.2 TB</div>
          <div>NET_STATUS: ENCRYPTED</div>
        </div>
        <div class="text-right">
          <div>UPTIME: 99.999%</div>
          <div class="text-neon-violet">SECURE_CONNECTION</div>
        </div>
      </div>
    </div>
    
    <!-- Decorative Corners -->
    <div class="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-neon-cyan rounded-tl-lg"></div>
    <div class="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-neon-cyan rounded-tr-lg"></div>
    <div class="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-neon-violet rounded-bl-lg"></div>
    <div class="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-neon-violet rounded-br-lg"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  targetText: string
}>()

const displayedText = ref('')
const showVimCommand = ref(false)
const vimCommand = ref('')
const typingSpeed = 20
let timeoutId: NodeJS.Timeout | null = null
let isAnimating = false

const animateVimCommand = async () => {
  return new Promise<void>((resolve) => {
    showVimCommand.value = true
    vimCommand.value = ''
    
    // Type ":"
    setTimeout(() => {
      vimCommand.value = ':'
      
      // Type "d"
      setTimeout(() => {
        vimCommand.value = ':d'
        
        // Type "G"
        setTimeout(() => {
          vimCommand.value = ':dG'
          
          // Execute (clear)
          setTimeout(() => {
            showVimCommand.value = false
            vimCommand.value = ''
            resolve()
          }, 300)
        }, 150)
      }, 150)
    }, 200)
  })
}

const typeText = async () => {
  if (timeoutId) clearTimeout(timeoutId)
  
  const current = displayedText.value
  const target = props.targetText
  
  // If target changed and we need to clear
  if (current !== target && !isAnimating) {
    if (current.length > 0 && !target.startsWith(current)) {
      isAnimating = true
      
      // Show Vim command animation
      await animateVimCommand()
      
      // Clear text
      displayedText.value = ''
      
      // Small delay before typing new content
      setTimeout(() => {
        isAnimating = false
        typeText()
      }, 100)
      return
    }
  }
  
  // Type character by character
  if (current.length < target.length) {
    displayedText.value = target.slice(0, current.length + 1)
    timeoutId = setTimeout(typeText, typingSpeed)
  }
}

watch(() => props.targetText, () => {
  isAnimating = false
  typeText()
})

onMounted(() => {
  typeText()
})
</script>
