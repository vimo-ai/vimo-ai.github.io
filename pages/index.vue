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
        
        <!-- Data Packet Animation -->
        <circle v-if="connectionPath" r="3" :fill="activeColor">
          <animateMotion
            :path="connectionPath"
            dur="1.5s"
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
        <ProjectLogo 
          label="CLAUDE HOOKS" 
          :path="icons.hooks"
          color="#ff6b35"
          @mouseenter="handleHover('hooks', '#ff6b35')"
          @mouseleave="handleLeave"
          @click="openLink('https://github.com/higuaifan/claude-hooks')"
        />
      </div>

      <!-- Bottom Right: Vlaude -->
      <div 
        :ref="(el) => setProjectRef('vlaude', el)"
        class="absolute bottom-10 right-32 z-30 transition-transform duration-300 hover:scale-110"
      >
        <ProjectLogo 
          label="VLAUDE" 
          :path="icons.vlaude"
          color="#ff2a6d"
          @mouseenter="handleHover('vlaude', '#ff2a6d')"
          @mouseleave="handleLeave"
          @click="openLink('https://github.com/higuaifan/vlaude')"
        />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

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

const setProjectRef = (key: string, el: any) => {
  if (el) projectRefs.value[key] = el as HTMLElement
}

const handleHover = (key: keyof typeof projects, color: string) => {
  currentText.value = projects[key]
  activeColor.value = color
  updateConnection(key)
}

const handleLeave = () => {
  currentText.value = defaultText
  connectionPath.value = ''
}

const updateConnection = (key: string) => {
  const terminal = terminalRef.value
  const project = projectRefs.value[key]
  
  if (!terminal || !project) return

  const tRect = terminal.getBoundingClientRect()
  const pRect = project.getBoundingClientRect()
  
  // Let's get the container's rect to normalize
  const container = terminal.parentElement // The relative z-10 container
  if (!container) return
  const cRect = container.getBoundingClientRect()

  const endX = tRect.left + tRect.width / 2 - cRect.left
  const endY = tRect.top + tRect.height / 2 - cRect.top

  // Determine if we are left or right of terminal
  // We use the center of the project to determine side, but start point is edge
  const pCenterX = pRect.left + pRect.width / 2
  const tCenterX = tRect.left + tRect.width / 2
  const isLeft = pCenterX < tCenterX

  // Start from the inner edge of the icon
  const startX = isLeft 
    ? pRect.right - cRect.left 
    : pRect.left - cRect.left
    
  const startY = pRect.top + pRect.height / 2 - cRect.top

  console.log('Connection Coords:', { startX, startY, endX, endY, cRect })

  // Circuit path:
  // M startX startY
  // L endX startY  (Horizontal first)
  // L endX endY    (Then Vertical)
  
  connectionPath.value = `M ${startX} ${startY} L ${endX} ${startY} L ${endX} ${endY}`
}

const openLink = (url: string) => {
  window.open(url, '_blank')
}
</script>
