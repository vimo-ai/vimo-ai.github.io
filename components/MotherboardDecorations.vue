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

interface Point {
  x: number
  y: number
}

interface Trace {
  path: Point[]
}

interface Packet {
  traceIndex: number
  segmentIndex: number
  progress: number // 0 to 1 along current segment
  speed: number
}

interface Capacitor {
  x: number
  y: number
  orientation: 'h' | 'v'
  size: number
}

// Canvas animation for dots and currents
const initCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let traces: Trace[] = []
  let packets: Packet[] = []
  let capacitors: Capacitor[] = []
  const gridSize = 40

  // Generate random circuit traces and capacitors
  const generateTraces = (width: number, height: number) => {
    traces = []
    packets = [] // Clear packets to avoid invalid references
    capacitors = []
    
    const cols = Math.ceil(width / gridSize)
    const rows = Math.ceil(height / gridSize)
    const numTraces = Math.floor((cols * rows) / 20) // Density of traces

    // Generate Traces
    for (let i = 0; i < numTraces; i++) {
      const path: Point[] = []
      let cx = Math.floor(Math.random() * cols) * gridSize
      let cy = Math.floor(Math.random() * rows) * gridSize
      path.push({ x: cx, y: cy })

      const length = 3 + Math.floor(Math.random() * 5) // Path length in segments
      let dir = Math.floor(Math.random() * 4) // 0: right, 1: down, 2: left, 3: up

      for (let j = 0; j < length; j++) {
        // Change direction occasionally
        if (Math.random() < 0.3) {
          dir = (dir + (Math.random() < 0.5 ? 1 : 3)) % 4
        }

        if (dir === 0) cx += gridSize
        else if (dir === 1) cy += gridSize
        else if (dir === 2) cx -= gridSize
        else if (dir === 3) cy -= gridSize

        // Boundary check
        if (cx < 0 || cx > width || cy < 0 || cy > height) break
        
        path.push({ x: cx, y: cy })
      }

      if (path.length > 1) {
        traces.push({ path })
      }
    }

    // Generate Capacitors (Scattered)
    const numCaps = Math.floor((cols * rows) / 30) // Sparse density
    for (let i = 0; i < numCaps; i++) {
      const cx = Math.floor(Math.random() * cols) * gridSize
      const cy = Math.floor(Math.random() * rows) * gridSize
      
      // Don't place too close to edges
      if (cx < 50 || cx > width - 50 || cy < 50 || cy > height - 50) continue

      capacitors.push({
        x: cx,
        y: cy,
        orientation: Math.random() > 0.5 ? 'h' : 'v',
        size: 12 + Math.random() * 8 // Random size
      })
    }
  }

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    generateTraces(canvas.width, canvas.height)
  }
  window.addEventListener('resize', resize)
  resize()

  const render = () => {
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 1. Draw Grid Dots
    const cols = Math.ceil(canvas.width / gridSize)
    const rows = Math.ceil(canvas.height / gridSize)

    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        const x = i * gridSize
        const y = j * gridSize
        
        const dx = x - mouseX.value
        const dy = y - mouseY.value
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        let r = 1
        let alpha = 0.1
        
        if (dist < 300) {
          const intensity = 1 - dist / 300
          r = 1 + intensity * 1.5
          alpha = 0.1 + intensity * 0.4
          ctx.fillStyle = `rgba(0, 243, 255, ${alpha})`
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        }
        
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // 2. Draw Faint Traces
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
    ctx.lineWidth = 1
    traces.forEach(trace => {
      ctx.beginPath()
      ctx.moveTo(trace.path[0].x, trace.path[0].y)
      for (let i = 1; i < trace.path.length; i++) {
        ctx.lineTo(trace.path[i].x, trace.path[i].y)
      }
      ctx.stroke()
    })

    // 3. Draw Capacitors
    capacitors.forEach(cap => {
      ctx.fillStyle = '#222' // Body
      ctx.strokeStyle = '#444' // Border
      ctx.lineWidth = 1
      
      const w = cap.orientation === 'h' ? cap.size : cap.size / 2
      const h = cap.orientation === 'h' ? cap.size / 2 : cap.size
      
      // Draw Body
      ctx.fillRect(cap.x - w/2, cap.y - h/2, w, h)
      ctx.strokeRect(cap.x - w/2, cap.y - h/2, w, h)
      
      // Draw Terminals (Silver ends)
      ctx.fillStyle = '#555'
      if (cap.orientation === 'h') {
        ctx.fillRect(cap.x - w/2, cap.y - h/2, 2, h) // Left
        ctx.fillRect(cap.x + w/2 - 2, cap.y - h/2, 2, h) // Right
      } else {
        ctx.fillRect(cap.x - w/2, cap.y - h/2, w, 2) // Top
        ctx.fillRect(cap.x - w/2, cap.y + h/2 - 2, w, 2) // Bottom
      }
    })

    // 4. Manage and Draw Packets
    // Spawn new packets occasionally
    if (Math.random() < 0.03) { // Slightly more frequent
      const randomTraceIndex = Math.floor(Math.random() * traces.length)
      packets.push({
        traceIndex: randomTraceIndex,
        segmentIndex: 0,
        progress: 0,
        speed: 0.05 + Math.random() * 0.05 // Faster: 0.05 - 0.10
      })
    }

    // Update and Draw Packets
    ctx.lineCap = 'round'
    
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i]
      const trace = traces[p.traceIndex]
      
      // Update progress
      p.progress += p.speed
      if (p.progress >= 1) {
        p.progress = 0
        p.segmentIndex++
      }

      // Remove if finished
      if (p.segmentIndex >= trace.path.length - 1) {
        packets.splice(i, 1)
        continue
      }

      // Calculate current position (Head)
      const p1 = trace.path[p.segmentIndex]
      const p2 = trace.path[p.segmentIndex + 1]
      const currentX = p1.x + (p2.x - p1.x) * p.progress
      const currentY = p1.y + (p2.y - p1.y) * p.progress

      // Draw Energy Beam
      // We need to trace back along the path to draw the tail
      // For simplicity in this grid system, we can just draw a line backwards
      // But since we have corners, a simple line backwards might go off-track.
      // However, for short beams and high speed, a simple linear tail from the current vector is "good enough" visually
      // OR we can properly trace back. Let's try a linear tail first, if it looks bad on corners we fix it.
      // Actually, "tadpole" complaint suggests the tail was the issue.
      // Let's make it a "Bolt".
      
      const tailLength = 60 // Longer beam
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x)
      const tailX = currentX - Math.cos(angle) * tailLength
      const tailY = currentY - Math.sin(angle) * tailLength

      // Create a gradient for the beam
      const gradient = ctx.createLinearGradient(tailX, tailY, currentX, currentY)
      gradient.addColorStop(0, 'rgba(0, 243, 255, 0)')   // Fade out tail
      gradient.addColorStop(0.5, 'rgba(0, 243, 255, 0.5)') // Mid body
      gradient.addColorStop(1, 'rgba(255, 255, 255, 1)')   // White hot head

      ctx.shadowBlur = 15
      ctx.shadowColor = '#00f3ff'
      ctx.strokeStyle = gradient
      ctx.lineWidth = 3
      
      ctx.beginPath()
      ctx.moveTo(tailX, tailY)
      ctx.lineTo(currentX, currentY)
      ctx.stroke()
      
      // Reset shadow
      ctx.shadowBlur = 0
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
