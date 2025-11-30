<template>
  <div class="min-h-screen bg-cyber-black flex items-center justify-center overflow-hidden relative font-mono selection:bg-neon-cyan selection:text-cyber-black">
    <BackgroundGrid />

    <!-- Main Container -->
    <div class="relative z-10 w-full max-w-7xl h-[900px] flex items-center justify-center">
      
      <!-- Connection Lines Layer -->
      <svg class="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
        <defs>
          <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        <!-- Default Bus Lines (Faint) -->
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

      <!-- Central Terminal -->
      <div ref="terminalRef" class="relative z-20 transition-transform duration-300 ease-out">
        <ETerminal :target-text="currentText" />
      </div>

      <!-- Orbiting Icons - Adjusted Positions for Larger Logos -->
      
      <!-- Top Left: MCP Router -->
      <div 
        :ref="(el) => setProjectRef('mcp', el)"
        class="absolute top-10 left-32 z-30 transition-transform duration-300 hover:scale-110"
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

      <!-- Top Right: Memex -->
      <div 
        :ref="(el) => setProjectRef('memex', el)"
        class="absolute top-10 right-32 z-30 transition-transform duration-300 hover:scale-110"
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

      <!-- Bottom Left: Claude Hooks -->
      <div 
        :ref="(el) => setProjectRef('hooks', el)"
        class="absolute bottom-10 left-32 z-30 transition-transform duration-300 hover:scale-110"
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

      <!-- Bottom Right: Vlaude -->
      <div 
        :ref="(el) => setProjectRef('vlaude', el)"
        class="absolute bottom-10 right-32 z-30 transition-transform duration-300 hover:scale-110"
      >
        <div class="relative">
          <!-- Ripple Animation for Vlaude -->
          <div v-if="activeProject === 'vlaude'" class="absolute inset-0 pointer-events-none">
             <div class="absolute inset-0 rounded-full border border-neon-pink opacity-60 animate-ping" style="animation-duration: 2s"></div>
             <div class="absolute inset-0 rounded-full border border-neon-pink opacity-60 animate-ping" style="animation-delay: 0.5s; animation-duration: 2s"></div>
             <div class="absolute inset-0 rounded-full border border-neon-pink opacity-60 animate-ping" style="animation-delay: 1s; animation-duration: 2s"></div>
             <div class="absolute inset-0 rounded-full border border-neon-pink opacity-60 animate-ping" style="animation-delay: 1.5s; animation-duration: 2s"></div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

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

[ACCESS_GRANTED]`
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
  vlaude: 'M30 60 A15 15 0 0 1 30 30 A20 20 0 0 1 70 30 A15 15 0 0 1 70 60 H30 M50 60 V80 M35 80 H65 M20 45 L10 45 M90 45 L80 45 M50 20 L50 10'
}

const currentText = ref(defaultText)
const terminalRef = ref<HTMLElement | null>(null)
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
  updateConnection(key)

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

const calculatePath = (startRect: DOMRect, endRect: DOMRect, containerRect: DOMRect, isLeft: boolean) => {
  const startX = isLeft 
    ? startRect.right - containerRect.left 
    : startRect.left - containerRect.left
  const startY = startRect.top + startRect.height / 2 - containerRect.top
  
  const endX = endRect.left + endRect.width / 2 - containerRect.left
  const endY = endRect.top + endRect.height / 2 - containerRect.top

  return `M ${startX} ${startY} L ${endX} ${startY} L ${endX} ${endY}`
}

const updateConnection = (key: string) => {
  const terminal = terminalRef.value
  const project = projectRefs.value[key]
  
  if (!terminal || !project) return

  const tRect = terminal.getBoundingClientRect()
  const pRect = project.getBoundingClientRect()
  const container = terminal.parentElement
  if (!container) return
  const cRect = container.getBoundingClientRect()

  const pCenterX = pRect.left + pRect.width / 2
  const tCenterX = tRect.left + tRect.width / 2
  const isLeft = pCenterX < tCenterX

  connectionPath.value = calculatePath(pRect, tRect, cRect, isLeft)
}

const initBusLines = () => {
  const terminal = terminalRef.value
  const container = terminal?.parentElement
  if (!terminal || !container) return
  
  const tRect = terminal.getBoundingClientRect()
  const cRect = container.getBoundingClientRect()
  
  console.log('Init Bus Lines', { tRect, cRect })

  // Generate bus lines for all projects
  for (const key in projects) {
    const project = projectRefs.value[key]
    if (project) {
      const pRect = project.getBoundingClientRect()
      const pCenterX = pRect.left + pRect.width / 2
      const tCenterX = tRect.left + tRect.width / 2
      const isLeft = pCenterX < tCenterX
      
      const path = calculatePath(pRect, tRect, cRect, isLeft)
      console.log(`Bus Path for ${key}:`, path)
      busPaths.value[key] = path
    }
  }

  // Generate Dependency Line (MCP <-> Memex)
  const mcp = projectRefs.value['mcp']
  const memex = projectRefs.value['memex']
  if (mcp && memex) {
    const mRect = mcp.getBoundingClientRect()
    const xRect = memex.getBoundingClientRect()
    
    // Path from MCP (Top Left) to Memex (Top Right)
    // Let's route it above the terminal
    const startX = mRect.right - cRect.left
    const startY = mRect.top + mRect.height / 2 - cRect.top
    
    const endX = xRect.left - cRect.left
    const endY = xRect.top + xRect.height / 2 - cRect.top
    
    // Arch path
    dependencyPath.value = `M ${startX} ${startY} C ${startX + 100} ${startY}, ${endX - 100} ${endY}, ${endX} ${endY}`
  }
}

const openLink = (url: string) => {
  window.open(url, '_blank')
}

onMounted(() => {
  // Initialize bus lines after a short delay to ensure layout is stable
  setTimeout(() => {
    initBusLines()
    // Force a re-render/check
    nextTick(() => {
      console.log('Bus Paths:', busPaths.value)
    })
  }, 1000)
  window.addEventListener('resize', initBusLines)
})
</script>
