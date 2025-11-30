<template>
  <div class="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#050505]">
    <!-- Base Grid (Faint Lines) -->
    <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

    <!-- Mouse Follower Spotlight -->
    <div 
      class="absolute inset-0 transition-opacity duration-300"
      :style="{
        background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(0, 243, 255, 0.06), transparent 40%)`
      }"
    ></div>

    <!-- Interactive Dot Grid -->
    <!-- We use a canvas for performance since there are many dots -->
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full opacity-40"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const mouseX = ref(0)
const mouseY = ref(0)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number

// Track mouse position
const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

// Canvas animation for dots
const initCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  window.addEventListener('resize', resize)
  resize()

  const gridSize = 40
  
  const render = () => {
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    const cols = Math.ceil(canvas.width / gridSize)
    const rows = Math.ceil(canvas.height / gridSize)

    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        const x = i * gridSize
        const y = j * gridSize
        
        // Calculate distance to mouse
        const dx = x - mouseX.value
        const dy = y - mouseY.value
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        // Base radius and opacity
        let r = 1
        let alpha = 0.1
        
        // Glow effect near mouse
        if (dist < 300) {
          const intensity = 1 - dist / 300
          r = 1 + intensity * 1.5 // Grow slightly
          alpha = 0.1 + intensity * 0.4 // Brighten
          
          ctx.fillStyle = `rgba(0, 243, 255, ${alpha})`
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        }
        
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    animationFrameId = requestAnimationFrame(render)
  }
  
  render()
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  initCanvas()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>
