<template>
  <div class="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#050505]">
    <!-- Base Grid (Faint Lines) -->
    <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

    <!-- Mouse Follower Spotlight (Dynamic Color) -->
    <div
      class="absolute inset-0 transition-all duration-200"
      :style="{
        background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 40%)`
      }"
    ></div>

    <!-- Interactive Dot Grid -->
    <!-- We use a canvas for performance since there are many dots -->
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full opacity-40"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const mouseX = ref(0)
const mouseY = ref(0)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number

// ==================== 性能优化：模块位置缓存 ====================
interface CachedModule {
  x: number
  y: number
  color: string
}

const cachedModules = ref<CachedModule[]>([])
let moduleCacheTimer: number | null = null

// 更新模块位置缓存（只在需要时调用，不是每帧）
const updateModuleCache = () => {
  const moduleElements = document.querySelectorAll('[data-module]:not([data-module="sys_core"])')
  const modules: CachedModule[] = []

  moduleElements.forEach((element) => {
    const moduleColor = element.getAttribute('data-module-color')
    if (moduleColor && !element.classList.contains('grayscale')) {
      const rect = element.getBoundingClientRect()
      modules.push({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        color: moduleColor
      })
    }
  })

  cachedModules.value = modules
}

// 启动模块缓存定时更新（每 500ms 更新一次，而不是每帧 60 次）
const startModuleCacheUpdater = () => {
  updateModuleCache()
  moduleCacheTimer = window.setInterval(updateModuleCache, 500)
}

const stopModuleCacheUpdater = () => {
  if (moduleCacheTimer !== null) {
    clearInterval(moduleCacheTimer)
    moduleCacheTimer = null
  }
}

// ==================== 性能优化：mousemove 节流 ====================
let lastMouseMoveTime = 0
const MOUSE_THROTTLE_MS = 16 // ~60fps，但实际会被 rAF 进一步限制

const handleMouseMove = (e: MouseEvent) => {
  const now = performance.now()
  if (now - lastMouseMoveTime < MOUSE_THROTTLE_MS) return
  lastMouseMoveTime = now

  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

// ==================== 计算光圈颜色（使用缓存） ====================
const spotlightColor = computed(() => {
  const MOUSE_PROXIMITY_THRESHOLD = 300
  const modules = cachedModules.value

  if (modules.length === 0) {
    return 'rgba(0, 243, 255, 0.06)'
  }

  const nearbyModules: Array<{ color: string; distance: number }> = []

  for (const module of modules) {
    const dx = mouseX.value - module.x
    const dy = mouseY.value - module.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < MOUSE_PROXIMITY_THRESHOLD) {
      nearbyModules.push({ color: module.color, distance })
    }
  }

  if (nearbyModules.length > 0) {
    let totalWeight = 0
    let mixedR = 0, mixedG = 0, mixedB = 0

    for (const module of nearbyModules) {
      const intensity = 1 - module.distance / MOUSE_PROXIMITY_THRESHOLD
      const weight = intensity

      const hex = module.color
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)

      mixedR += r * weight
      mixedG += g * weight
      mixedB += b * weight
      totalWeight += weight
    }

    if (totalWeight > 0) {
      const finalR = Math.round(mixedR / totalWeight)
      const finalG = Math.round(mixedG / totalWeight)
      const finalB = Math.round(mixedB / totalWeight)
      const opacity = Math.max(0.06, 0.15 * (totalWeight / nearbyModules.length))

      return `rgba(${finalR}, ${finalG}, ${finalB}, ${opacity})`
    }
  }

  return 'rgba(0, 243, 255, 0.06)'
})

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

  // ==================== 性能优化：离屏 Canvas 缓存静态内容 ====================
  let staticCanvas: OffscreenCanvas | HTMLCanvasElement
  let staticCtx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null

  const renderStaticLayer = (width: number, height: number) => {
    // 创建离屏 Canvas（如果浏览器支持）
    if (typeof OffscreenCanvas !== 'undefined') {
      staticCanvas = new OffscreenCanvas(width, height)
    } else {
      staticCanvas = document.createElement('canvas')
      staticCanvas.width = width
      staticCanvas.height = height
    }
    staticCtx = staticCanvas.getContext('2d')
    if (!staticCtx) return

    // 清除背景（透明）
    staticCtx.clearRect(0, 0, width, height)

    const cols = Math.ceil(width / gridSize)
    const rows = Math.ceil(height / gridSize)

    // 只绘制静态点阵（走线和电容移除，保持背景简洁）
    staticCtx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        const x = i * gridSize
        const y = j * gridSize
        staticCtx.beginPath()
        staticCtx.arc(x, y, 1, 0, Math.PI * 2)
        staticCtx.fill()
      }
    }
  }

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    generateTraces(canvas.width, canvas.height)
    // 重新渲染静态层
    renderStaticLayer(canvas.width, canvas.height)
  }
  window.addEventListener('resize', resize)
  resize()

  // ==================== 性能优化：预计算模块颜色 RGB 值 ====================
  interface ParsedModule {
    x: number
    y: number
    r: number
    g: number
    b: number
  }

  // 解析 hex 颜色为 RGB（避免每帧重复解析）
  const parseModuleColors = (modules: CachedModule[]): ParsedModule[] => {
    return modules.map(m => ({
      x: m.x,
      y: m.y,
      r: parseInt(m.color.slice(1, 3), 16),
      g: parseInt(m.color.slice(3, 5), 16),
      b: parseInt(m.color.slice(5, 7), 16)
    }))
  }

  const render = () => {
    if (!ctx) return

    // 每帧必须先清除画布，否则动态内容会叠加
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 复制静态层（点阵）
    if (staticCanvas) {
      ctx.drawImage(staticCanvas as CanvasImageSource, 0, 0)
    }

    // 常量
    const cols = Math.ceil(canvas.width / gridSize)
    const rows = Math.ceil(canvas.height / gridSize)
    const MODULE_INFLUENCE_RADIUS = 250
    const MODULE_INFLUENCE_RADIUS_SQ = MODULE_INFLUENCE_RADIUS * MODULE_INFLUENCE_RADIUS
    const MOUSE_LIGHT_RADIUS = 175
    const MOUSE_LIGHT_RADIUS_SQ = MOUSE_LIGHT_RADIUS * MOUSE_LIGHT_RADIUS

    // ==================== 性能优化：使用缓存的模块数据 ====================
    const onlineModules = parseModuleColors(cachedModules.value)

    // ==================== 性能优化：计算鼠标影响区域边界 ====================
    const mx = mouseX.value
    const my = mouseY.value

    // 只渲染鼠标附近的点（空间分区优化）
    const minCol = Math.max(0, Math.floor((mx - MOUSE_LIGHT_RADIUS) / gridSize))
    const maxCol = Math.min(cols, Math.ceil((mx + MOUSE_LIGHT_RADIUS) / gridSize))
    const minRow = Math.max(0, Math.floor((my - MOUSE_LIGHT_RADIUS) / gridSize))
    const maxRow = Math.min(rows, Math.ceil((my + MOUSE_LIGHT_RADIUS) / gridSize))

    // ==================== 绘制鼠标附近的动态高亮点 ====================
    for (let i = minCol; i <= maxCol; i++) {
      for (let j = minRow; j <= maxRow; j++) {
        const x = i * gridSize
        const y = j * gridSize

        const dxToMouse = x - mx
        const dyToMouse = y - my
        const distanceToMouseSq = dxToMouse * dxToMouse + dyToMouse * dyToMouse

        if (distanceToMouseSq >= MOUSE_LIGHT_RADIUS_SQ) continue

        const distanceToMouse = Math.sqrt(distanceToMouseSq)

        let totalWeight = 0
        let mixedR = 0, mixedG = 0, mixedB = 0
        let hasInfluence = false

        for (let k = 0; k < onlineModules.length; k++) {
          const module = onlineModules[k]
          const dxModule = x - module.x
          const dyModule = y - module.y
          const distanceToModuleSq = dxModule * dxModule + dyModule * dyModule

          if (distanceToModuleSq < MODULE_INFLUENCE_RADIUS_SQ) {
            hasInfluence = true
            const distanceToModule = Math.sqrt(distanceToModuleSq)
            const weight = Math.pow(1 - distanceToModule / MODULE_INFLUENCE_RADIUS, 2)

            mixedR += module.r * weight
            mixedG += module.g * weight
            mixedB += module.b * weight
            totalWeight += weight
          }
        }

        if (hasInfluence && totalWeight > 0) {
          const finalR = Math.round(mixedR / totalWeight)
          const finalG = Math.round(mixedG / totalWeight)
          const finalB = Math.round(mixedB / totalWeight)

          const intensity = 1 - distanceToMouse / MOUSE_LIGHT_RADIUS
          const r = 1 + intensity * 1.5
          const alpha = 0.1 + intensity * 0.6

          ctx.fillStyle = `rgba(${finalR}, ${finalG}, ${finalB}, ${alpha})`
          ctx.beginPath()
          ctx.arc(x, y, r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

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
  startModuleCacheUpdater()
  initCanvas()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  stopModuleCacheUpdater()
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>
