<template>
  <div class="min-h-screen bg-cyber-black flex items-center justify-center overflow-hidden relative font-mono selection:bg-neon-cyan selection:text-cyber-black">
    
    <!-- Background Grid -->
    <div class="fixed inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20"></div>
    
    <!-- Motherboard Decorations (Static Background Layer) -->
    <MotherboardDecorations v-if="!isMobile" />
    <GlobalHUD v-if="!isMobile" />

    <!-- Main Container -->
    <div
      ref="containerRef"
      class="relative z-10 w-full transition-all duration-500"
      :class="[isMobile ? 'h-auto py-10 flex flex-col items-center gap-12' : 'h-screen block']"
    >
      
      <!-- Connection Lines Layer (Desktop Only) -->
      <svg v-if="!isMobile" class="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
        <defs>
          <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        




        <!-- Default Bus Lines (Faint Dashed) -->
        <path
          v-for="(path, key) in busPaths"
          :key="key"
          :d="path"
          fill="none"
          stroke="#666" 
          stroke-width="1"
          class="opacity-60"
          stroke-dasharray="4 4"
        />

        <!-- Dependency Line (MCP <-> Memex) -->
        <path
          v-if="dependencyPath"
          :d="dependencyPath"
          fill="none"
          :stroke="dependencyActive ? '#39ff14' : '#666'"
          :stroke-width="dependencyActive ? 2 : 1"
          :class="dependencyActive ? 'opacity-100' : 'opacity-40'"
          :filter="dependencyActive ? 'url(#glow-line)' : ''"
          class="transition-all duration-300"
        >
          <animate
            v-if="dependencyActive"
            attributeName="stroke-dasharray"
            from="0, 1000"
            to="1000, 0"
            dur="1s"
            fill="freeze"
          />
        </path>

        <!-- Active Connection Line -->
        <path
          v-if="connectionPath"
          :d="connectionPath"
          fill="none"
          :stroke="activeColor"
          stroke-width="2"
          class="opacity-80"
          filter="url(#glow-line)"
        >
          <animate
            attributeName="stroke-dasharray"
            from="0, 1000"
            to="1000, 0"
            dur="1s"
            fill="freeze"
          />
        </path>
        
        <!-- Data Packet Animation (Active Line) -->
        <circle v-if="connectionPath" r="3" :fill="activeColor">
          <animateMotion
            :path="connectionPath"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>

        <!-- Data Packet Animation (Dependency Line) -->
        <circle v-if="dependencyActive && dependencyPath" r="2" fill="#39ff14">
          <animateMotion
            :path="dependencyPath"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      <!-- Central Terminal (CPU) -->
      <div 
        ref="terminalRef" 
        class="z-20 transition-all duration-300 ease-out"
        :class="[isMobile ? 'relative w-[90%] order-1' : 'absolute']"
        :style="isMobile ? {} : terminalStyle"
      >
        <ETerminal :target-text="currentText" />
      </div>

      <!-- === PROJECT MODULES CONTAINER (Mobile: Grid, Desktop: Absolute) === -->
      <div :class="[isMobile ? 'grid grid-cols-2 gap-8 order-2' : 'contents']">
        
        <!-- MCP Router -->
        <div
          :ref="(el) => setProjectRef('mcp', el)"
          class="z-30 transition-all duration-500 hover:scale-110"
          :class="[isMobile ? 'relative flex justify-center' : 'absolute']"
          :style="isMobile ? {} : getModuleStyle('mcp')"
        >
          <ProjectLogo 
            label="MCP ROUTER" 
            :path="icons.mcp"
            color="#39ff14"
            :is-active="activeProject === 'mcp' || linkedProject === 'mcp'"
            @mouseenter="handleHover('mcp', '#39ff14')"
            @mouseleave="handleLeave"
            @click="openLink('https://github.com/higuaifan/mcp-router')"
          />
        </div>

        <!-- Memex -->
        <div
          :ref="(el) => setProjectRef('memex', el)"
          class="z-30 transition-all duration-500 hover:scale-110"
          :class="[isMobile ? 'relative flex justify-center' : 'absolute']"
          :style="isMobile ? {} : getModuleStyle('memex')"
        >
          <ProjectLogo 
            label="MEMEX" 
            :path="icons.memex"
            color="#00f3ff"
            :is-active="activeProject === 'memex'"
            @mouseenter="handleHover('memex', '#00f3ff')"
            @mouseleave="handleLeave"
            @click="openLink('https://github.com/higuaifan/memex')"
          />
        </div>

        <!-- Claude Hooks -->
        <div
          :ref="(el) => setProjectRef('hooks', el)"
          class="z-30 transition-all duration-500 hover:scale-110"
          :class="[isMobile ? 'relative flex justify-center' : 'absolute']"
          :style="isMobile ? {} : getModuleStyle('hooks')"
        >
          <div class="relative">
            <ProjectLogo 
              label="CLAUDE HOOKS" 
              :path="icons.hooks"
              color="#ff6b35"
              :is-active="activeProject === 'hooks'"
              @mouseenter="handleHover('hooks', '#ff6b35')"
              @mouseleave="handleLeave"
              @click="openLink('https://github.com/higuaifan/claude-hooks')"
            />
          </div>
        </div>

        <!-- Vlaude -->
        <div
          :ref="(el) => setProjectRef('vlaude', el)"
          class="z-30 transition-all duration-500 hover:scale-110"
          :class="[isMobile ? 'relative flex justify-center' : 'absolute']"
          :style="isMobile ? {} : getModuleStyle('vlaude')"
        >
          <div class="relative">
            <!-- Ripple Animation for Vlaude (圆形波纹，被模块遮住) -->
            <div v-if="activeProject === 'vlaude'" class="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div class="rounded-full border-2 border-neon-pink animate-ripple aspect-square"></div>
            </div>
            <div v-if="activeProject === 'vlaude'" class="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div class="rounded-full border-2 border-neon-pink animate-ripple aspect-square" style="animation-delay: 0.5s"></div>
            </div>
            <div v-if="activeProject === 'vlaude'" class="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div class="rounded-full border-2 border-neon-pink animate-ripple aspect-square" style="animation-delay: 1s"></div>
            </div>
            <div v-if="activeProject === 'vlaude'" class="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div class="rounded-full border-2 border-neon-pink animate-ripple aspect-square" style="animation-delay: 1.5s"></div>
            </div>

            <ProjectLogo
              label="VLAUDE"
              :path="icons.vlaude"
              color="#ff2a6d"
              :is-active="activeProject === 'vlaude'"
              @mouseenter="handleHover('vlaude', '#ff2a6d')"
              @mouseleave="handleLeave"
              @click="openLink('https://github.com/higuaifan/vlaude')"
            />
          </div>
        </div>
      </div>

      <!-- === CONTENT CHIPS CONTAINER (Mobile: Flex Row, Desktop: Absolute) === -->
      <div :class="[isMobile ? 'flex flex-wrap justify-center gap-6 order-3' : 'contents']">

        <!-- About -->
        <div
          :ref="(el) => setProjectRef('about', el)"
          class="z-30 transition-all duration-500"
          :class="[isMobile ? 'relative' : 'absolute']"
          :style="isMobile ? {} : getModuleStyle('about')"
        >
          <ContentChip 
            label="ABOUT" 
            :path="icons.about"
            color="#ffffff"
            :is-active="activeProject === 'about'"
            @mouseenter="handleHover('about', '#ffffff')"
            @mouseleave="handleLeave"
          />
        </div>

        <!-- Docs -->
        <div
          :ref="(el) => setProjectRef('docs', el)"
          class="z-30 transition-all duration-500"
          :class="[isMobile ? 'relative' : 'absolute']"
          :style="isMobile ? {} : getModuleStyle('docs')"
        >
          <ContentChip 
            label="DOCS" 
            :path="icons.docs"
            color="#ffffff"
            :is-active="activeProject === 'docs'"
            @mouseenter="handleHover('docs', '#ffffff')"
            @mouseleave="handleLeave"
          />
        </div>

        <!-- Community -->
        <div
          :ref="(el) => setProjectRef('community', el)"
          class="z-30 transition-all duration-500"
          :class="[isMobile ? 'relative' : 'absolute']"
          :style="isMobile ? {} : getModuleStyle('community')"
        >
          <ContentChip 
            label="COMMUNITY" 
            :path="icons.community"
            color="#ffffff"
            :is-active="activeProject === 'community'"
            @mouseenter="handleHover('community', '#ffffff')"
            @mouseleave="handleLeave"
          />
        </div>

        <!-- Roadmap -->
        <div
          :ref="(el) => setProjectRef('roadmap', el)"
          class="z-30 transition-all duration-500"
          :class="[isMobile ? 'relative' : 'absolute']"
          :style="isMobile ? {} : getModuleStyle('roadmap')"
        >
          <ContentChip 
            label="ROADMAP" 
            :path="icons.roadmap"
            color="#ffffff"
            :is-active="activeProject === 'roadmap'"
            @mouseenter="handleHover('roadmap', '#ffffff')"
            @mouseleave="handleLeave"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import ContentChip from '~/components/ContentChip.vue'
import MotherboardDecorations from '~/components/MotherboardDecorations.vue'
import GlobalHUD from '~/components/GlobalHUD.vue'
import { useLayoutEngine } from '~/composables/useLayoutEngine'
import { findPath, pathToSVG } from '~/utils/pathfinding'

// Responsive State
const isMobile = ref(false)

// Layout Engine
const { positions, computeLayout } = useLayoutEngine()

// Terminal dimensions
const TERMINAL_WIDTH = 700
const TERMINAL_HEIGHT = 450

// Module configurations (including label overflow space)
const moduleConfigs = [
  { id: 'mcp', width: 220, height: 220, preference: 'top-left' as const },
  { id: 'memex', width: 200, height: 200, preference: 'top-right' as const },
  { id: 'hooks', width: 180, height: 180, preference: 'bottom-left' as const },
  { id: 'vlaude', width: 180, height: 180, preference: 'bottom-right' as const },
  { id: 'about', width: 140, height: 140, preference: 'top-left' as const },
  { id: 'docs', width: 140, height: 140, preference: 'top-right' as const },
  { id: 'community', width: 140, height: 140, preference: 'bottom-left' as const },
  { id: 'roadmap', width: 140, height: 140, preference: 'bottom-right' as const }
]

// Computed styles for each module
const getModuleStyle = (moduleId: string) => {
  if (isMobile.value) return {}
  const pos = positions.value[moduleId]
  if (!pos) return {}
  return {
    left: `${pos.x}px`,
    top: `${pos.y}px`
  }
}

// Terminal position (dynamic based on layout algorithm)
const terminalStyle = computed(() => {
  if (isMobile.value) return {}

  // 如果算法返回了 Terminal 位置，使用它；否则居中
  const terminalPos = positions.value.terminalPosition
  if (terminalPos) {
    return {
      left: `${terminalPos.x}px`,
      top: `${terminalPos.y}px`
    }
  }

  // 默认居中
  return {
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }
})

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
  if (!isMobile.value) {
    // Re-compute layout when switching to desktop
    nextTick(recalculateLayout)
  }
}

const recalculateLayout = () => {
  if (isMobile.value) return

  // 获取容器的实际尺寸
  // 容器宽度受 max-w-7xl (1280px) 限制
  // 容器高度现在是 min-h-screen，会占满视口
  const container = containerRef.value
  if (!container) {
    console.warn('Container ref not found, using fallback dimensions')
    computeLayout(1280, 900, TERMINAL_WIDTH, TERMINAL_HEIGHT, moduleConfigs)
    return
  }

  const rect = container.getBoundingClientRect()
  const containerWidth = rect.width
  const containerHeight = rect.height

  console.log('Container dimensions:', containerWidth, 'x', containerHeight)
  computeLayout(containerWidth, containerHeight, TERMINAL_WIDTH, TERMINAL_HEIGHT, moduleConfigs)
}

// Project Data
const defaultText = `> SYSTEM_INIT...
> CHECKING_CORE_MODULES... [OK]
> ESTABLISHING_NEURAL_LINK... [OK]

WELCOME TO VIMO.
THE CLAUDE CODE ENHANCEMENT SUITE.

AWAITING_INPUT_`

const projects = {
  mcp: `> TARGET: MCP_ROUTER
> TYPE: NETWORK_INFRASTRUCTURE
> PORT: 3000

Advanced MCP Service Management.
Workspace Isolation // Drag-and-Drop Config
Optimized Token Consumption Protocols.

[ACCESS_GRANTED]`,

  memex: `> TARGET: MEMEX
> TYPE: NEURAL_ARCHIVE
> STATUS: RECORDING

Claude Code Session History Manager.
Full-Text Search // Semantic Retrieval
Automatic Backup Systems Engaged.

[ACCESS_GRANTED]`,

  hooks: `> TARGET: CLAUDE_HOOKS
> TYPE: SURVEILLANCE_SUITE
> SENSORS: ONLINE

Real-time Monitoring & Event Interception.
Quota Tracking // File System Watchdogs
Notification Relay Systems Active.

[ACCESS_GRANTED]`,

  vlaude: `> TARGET: VLAUDE
> TYPE: SYNC_MATRIX
> NODES: CONNECTED

Cross-Device Dialogue Synchronization.
Real-time State Coordination.
Unified Session Experience.

[ACCESS_GRANTED]`,

  about: `> TARGET: ABOUT_VIMO
> TYPE: SYSTEM_INFO

Vimo is a next-generation enhancement suite for Claude Code.
Designed to empower developers with advanced tools.
Hardcore Aesthetics // Powerful Functionality.`,

  docs: `> TARGET: DOCUMENTATION
> TYPE: KNOWLEDGE_BASE

Access full technical specifications.
API References // Integration Guides.
Learn how to maximize your Vimo experience.`,

  community: `> TARGET: COMMUNITY
> TYPE: NETWORK_HUB

Join the Vimo developer network.
Discord Server // GitHub Repository.
Collaborate and share your configurations.`,

  roadmap: `> TARGET: ROADMAP
> TYPE: FUTURE_PROJECTIONS

Upcoming Features:
- Advanced Plugin System
- Cloud Sync V2
- AI-Powered Debugging Assistant`
}

// Complex SVG Paths (100x100 coordinate system)
const icons = {
  // MCP Router: Central hub with radiating nodes
  mcp: 'M50 20 L80 35 L80 65 L50 80 L20 65 L20 35 Z M50 35 L50 65 M20 35 L50 50 L80 35 M20 65 L50 50 L80 65 M50 10 V20 M80 35 L90 30 M80 65 L90 70 M50 80 V90 M20 65 L10 70 M20 35 L10 30',
  
  // Memex: Brain/Chip circuit
  memex: 'M30 20 H70 V80 H30 Z M40 30 H60 M40 40 H60 M40 50 H60 M40 60 H50 M30 20 L20 10 M70 20 L80 10 M30 80 L20 90 M70 80 L80 90 M20 40 H30 M20 50 H30 M20 60 H30 M70 40 H80 M70 50 H80 M70 60 H80',
  
  // Claude Hooks: Eye/Lens with brackets
  hooks: 'M20 30 L10 30 L10 70 L20 70 M80 30 L90 30 L90 70 L80 70 M50 35 A15 15 0 1 0 50 65 A15 15 0 1 0 50 35 M50 45 A5 5 0 1 1 50 55 A5 5 0 1 1 50 45 M50 20 V30 M50 70 V80 M20 50 H30 M70 50 H80',
  
  // Vlaude: Cloud/Signal waves
  vlaude: 'M30 60 A15 15 0 0 1 30 30 A20 20 0 0 1 70 30 A15 15 0 0 1 70 60 H30 M50 60 V80 M35 80 H65 M20 45 L10 45 M90 45 L80 45 M50 20 L50 10',

  // About: Info / CPU Core
  about: 'M30 30 H70 V70 H30 Z M40 40 H60 V60 H40 Z M50 20 V30 M50 70 V80 M20 50 H30 M70 50 H80',

  // Docs: File / Data Sheet
  docs: 'M30 20 L70 20 L70 80 L30 80 Z M40 30 H60 M40 40 H60 M40 50 H60 M40 60 H50',

  // Community: Network Nodes
  community: 'M50 30 A5 5 0 1 0 50 40 A5 5 0 1 0 50 30 M30 70 A5 5 0 1 0 30 80 A5 5 0 1 0 30 70 M70 70 A5 5 0 1 0 70 80 A5 5 0 1 0 70 70 M50 40 L30 70 M50 40 L70 70 M30 70 H70',

  // Roadmap: Timeline / Arrow
  roadmap: 'M20 50 H80 M70 40 L80 50 L70 60 M30 40 V60 M50 40 V60'
}

const currentText = ref(defaultText)
const terminalRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const projectRefs = ref<Record<string, HTMLElement>>({})
const connectionPath = ref('')
const activeColor = ref('#00f3ff')
const activeProject = ref<string | null>(null)
const linkedProject = ref<string | null>(null)

const busPaths = ref<Record<string, string>>({})
const dependencyPath = ref('')
const dependencyActive = ref(false)

const setProjectRef = (key: string, el: any) => {
  if (el) projectRefs.value[key] = el as HTMLElement
}

const handleHover = (key: keyof typeof projects, color: string) => {
  currentText.value = projects[key]
  activeColor.value = color
  activeProject.value = key
  
  if (!isMobile.value) {
    updateConnection(key)
  }

  // Linkage Logic
  if (key === 'memex') {
    linkedProject.value = 'mcp'
    dependencyActive.value = true
  }
}

const handleLeave = () => {
  currentText.value = defaultText
  connectionPath.value = ''
  activeProject.value = null
  linkedProject.value = null
  dependencyActive.value = false
}

/**
 * Get all module rectangles as obstacles for pathfinding
 */
const getObstacles = (excludeKeys: string[] = []): Array<{ x: number; y: number; width: number; height: number }> => {
  const obstacles: Array<{ x: number; y: number; width: number; height: number }> = []
  
  // Add terminal as obstacle (unless excluded)
  if (!excludeKeys.includes('terminal')) {
    const terminal = terminalRef.value
    if (terminal) {
      const tRect = terminal.getBoundingClientRect()
      const container = terminal.parentElement
      if (container) {
        const cRect = container.getBoundingClientRect()
        obstacles.push({
          x: tRect.left - cRect.left,
          y: tRect.top - cRect.top,
          width: tRect.width,
          height: tRect.height
        })
      }
    }
  }
  
  // Add all modules as obstacles (except excluded ones)
  for (const key in projectRefs.value) {
    if (excludeKeys.includes(key)) continue
    
    const module = projectRefs.value[key]
    if (module) {
      const mRect = module.getBoundingClientRect()
      const container = terminalRef.value?.parentElement
      if (container) {
        const cRect = container.getBoundingClientRect()
        obstacles.push({
          x: mRect.left - cRect.left,
          y: mRect.top - cRect.top,
          width: mRect.width,
          height: mRect.height
        })
      }
    }
  }
  
  return obstacles
}

const calculatePath = (startRect: DOMRect, endRect: DOMRect, containerRect: DOMRect) => {
  // Calculate centers
  const startCenterX = startRect.left + startRect.width / 2 - containerRect.left
  const startCenterY = startRect.top + startRect.height / 2 - containerRect.top
  
  const endCenterX = endRect.left + endRect.width / 2 - containerRect.left
  const endCenterY = endRect.top + endRect.height / 2 - containerRect.top
  
  // Determine direction
  const dx = endCenterX - startCenterX
  const dy = endCenterY - startCenterY
  
  // Start point: exit from the edge closest to target
  let startX: number
  let startY: number
  
  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal direction dominant
    startX = dx > 0 ? startRect.right - containerRect.left : startRect.left - containerRect.left
    startY = startCenterY
  } else {
    // Vertical direction dominant
    startX = startCenterX
    startY = dy > 0 ? startRect.bottom - containerRect.top : startRect.top - containerRect.top
  }
  
  // End point: center of target
  const endX = endCenterX
  const endY = endCenterY
  
  // Simple Manhattan routing: always use 2 or 3 segments (only horizontal + vertical)
  // Strategy: Go horizontal first, then vertical, OR vertical first, then horizontal
  
  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal-first routing
    const midX = (startX + endX) / 2
    return `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`
  } else {
    // Vertical-first routing
    const midY = (startY + endY) / 2
    return `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`
  }
}

const updateConnection = (key: string) => {
  if (isMobile.value) return

  const terminal = terminalRef.value
  const project = projectRefs.value[key]
  
  if (!terminal || !project) return

  const tRect = terminal.getBoundingClientRect()
  const pRect = project.getBoundingClientRect()
  const container = terminal.parentElement
  if (!container) return
  const cRect = container.getBoundingClientRect()

  // Use the pre-calculated A* path if available, otherwise fallback to simple path
  if (busPaths.value[key]) {
    connectionPath.value = busPaths.value[key]
  } else {
    connectionPath.value = calculatePath(pRect, tRect, cRect)
  }
}

const initBusLines = () => {
  if (isMobile.value) return

  const terminal = terminalRef.value
  const container = terminal?.parentElement
  if (!terminal || !container) return

  const tRect = terminal.getBoundingClientRect()
  const cRect = container.getBoundingClientRect()

  console.log('Init Bus Lines (A* Pathfinding)', { tRect, cRect })

  // 收集所有模块的矩形信息（先不作为障碍物，后面动态添加）
  const allModuleRects: Record<string, { x: number; y: number; width: number; height: number }> = {}

  for (const key in projects) {
    const project = projectRefs.value[key]
    if (project) {
      const pRect = project.getBoundingClientRect()
      allModuleRects[key] = {
        x: pRect.left - cRect.left,
        y: pRect.top - cRect.top,
        width: pRect.width,
        height: pRect.height
      }
    }
  }

  // Terminal 矩形
  const terminalRect = {
    x: tRect.left - cRect.left,
    y: tRect.top - cRect.top,
    width: tRect.width,
    height: tRect.height
  }

  // 已生成的线路（用于避免重叠）
  const existingPaths: Array<Array<{ x: number; y: number }>> = []

  // 按顺序生成每条线路
  for (const key in projects) {
    const project = projectRefs.value[key]
    if (project) {
      const pRect = project.getBoundingClientRect()

      // 计算起点和终点（使用中心点）
      const startX = pRect.left + pRect.width / 2 - cRect.left
      const startY = pRect.top + pRect.height / 2 - cRect.top
      const endX = tRect.left + tRect.width / 2 - cRect.left
      const endY = tRect.top + tRect.height / 2 - cRect.top

      // 构建障碍物列表：排除当前起点模块和 Terminal
      const obstacles: Array<{ x: number; y: number; width: number; height: number }> = []
      for (const otherKey in allModuleRects) {
        if (otherKey !== key) { // 排除当前模块
          obstacles.push(allModuleRects[otherKey])
        }
      }

      // 使用 A* 寻路，避开其他模块和已有线路
      const pathPoints = findPath(
        { x: startX, y: startY },
        { x: endX, y: endY },
        obstacles,
        50, // 网格大小
        existingPaths
      )

      // 转换为 SVG 路径
      const svgPath = pathToSVG(pathPoints)
      busPaths.value[key] = svgPath

      // 将新生成的线路加入已有线路列表
      existingPaths.push(pathPoints)

      console.log(`Bus Path for ${key} (A*):`, svgPath)
    }
  }

  // Generate Dependency Line (MCP <-> Memex) - 也使用 A*
  const mcp = projectRefs.value['mcp']
  const memex = projectRefs.value['memex']
  if (mcp && memex) {
    const mRect = mcp.getBoundingClientRect()
    const xRect = memex.getBoundingClientRect()

    const startX = mRect.right - cRect.left
    const startY = mRect.top + mRect.height / 2 - cRect.top
    const endX = xRect.left - cRect.left
    const endY = xRect.top + xRect.height / 2 - cRect.top

    const depPathPoints = findPath(
      { x: startX, y: startY },
      { x: endX, y: endY },
      obstacles,
      50,
      existingPaths
    )

    dependencyPath.value = pathToSVG(depPathPoints)
  }
}

const openLink = (url: string) => {
  window.open(url, '_blank')
}

onMounted(() => {
  checkMobile()
  
  window.addEventListener('resize', () => {
    checkMobile()
    if (!isMobile.value) {
      recalculateLayout()
      setTimeout(initBusLines, 100)
    }
  })
  
  // Initialize layout and bus lines
  setTimeout(() => {
    if (!isMobile.value) {
      recalculateLayout()
      setTimeout(initBusLines, 500)
    }
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>
