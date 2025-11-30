<template>
  <div class="fixed inset-0 pointer-events-none z-50 font-mono text-[10px] tracking-widest text-neon-cyan/60 select-none overflow-hidden">
    <!-- Top Left -->
    <div class="absolute top-8 left-8 flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-neon-cyan animate-pulse shadow-[0_0_5px_#00f3ff]"></div>
        <span class="font-bold">SYSTEM :: ONLINE</span>
      </div>
      <div class="opacity-50">VIMO_OS v2.4.0 // KERNEL_ACTIVE</div>
    </div>

    <!-- Top Right -->
    <div class="absolute top-8 right-8 text-right flex flex-col gap-2">
      <div>NET :: <span class="text-neon-green shadow-[0_0_5px_#39ff14]">SECURE</span></div>
      <div>LATENCY :: <span class="animate-pulse">12ms</span></div>
    </div>

    <!-- Bottom Left -->
    <div class="absolute bottom-8 left-8 flex flex-col gap-1">
      <div class="text-xs font-bold">COORDS</div>
      <div>X : {{ mouseX.toString().padStart(4, '0') }}</div>
      <div>Y : {{ mouseY.toString().padStart(4, '0') }}</div>
    </div>

    <!-- Bottom Right: Hex Stream -->
    <div class="absolute bottom-8 right-8 text-right opacity-50 font-orbitron flex flex-col gap-1">
      <div v-for="(line, i) in hexLines" :key="i" :class="{'text-neon-cyan': i === hexLines.length - 1, 'opacity-30': i < hexLines.length - 1}">
        {{ line }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const mouseX = ref(0)
const mouseY = ref(0)
const hexLines = ref<string[]>([])

const updateMouse = (e: MouseEvent) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

const generateHex = () => {
  const chars = '0123456789ABCDEF'
  let str = ''
  for (let i = 0; i < 12; i++) {
    str += chars[Math.floor(Math.random() * 16)]
    if (i % 2 === 1 && i < 11) str += ' '
  }
  return `0x${str}`
}

let intervalId: NodeJS.Timeout

onMounted(() => {
  window.addEventListener('mousemove', updateMouse)
  
  // Update Hex stream
  intervalId = setInterval(() => {
    const newHex = generateHex()
    hexLines.value.push(newHex)
    if (hexLines.value.length > 5) hexLines.value.shift()
  }, 80)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateMouse)
  clearInterval(intervalId)
})
</script>
