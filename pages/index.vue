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
      <svg 
        v-if="!isMobile" 
        class="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
      >
        <defs>
          <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- === CONNECTION LAYER === -->

        <!-- 1. BOOT LINES (Drawing Outwards) -->
        <path
          v-for="(path, moduleKey) in busPaths"
          :key="`boot-${moduleKey}`"
          v-show="moduleStates[moduleKey] === 'booting'"
          :d="path"
          fill="none"
          :stroke="moduleColors[moduleKey] || '#00f3ff'"
          stroke-width="2"
          stroke-linecap="round"
          filter="url(#glow-line)"
          stroke-dasharray="3000"
          :stroke-dashoffset="getBootProgress(moduleKey)"
        />

        <!-- 2. ONLINE STATE (Dashed Lines + Maintenance Pulses) -->
        <g v-for="(path, moduleKey) in busPaths" :key="`online-${moduleKey}`">
          <template v-if="moduleStates[moduleKey] === 'online'">
            <!-- Dashed Line -->
            <path
              :d="path"
              fill="none"
              stroke="#666" 
              stroke-width="1"
              class="opacity-80"
              stroke-dasharray="4 4"
            />
            
            <!-- Maintenance Pulse (Occasional) -->
            <circle r="1.5" fill="#00f3ff" class="opacity-40">
              <animateMotion
                :path="path"
                dur="3s"
                repeatCount="indefinite"
                :begin="`${Math.random() * 2}s`" 
              />
              <animate 
                attributeName="opacity" 
                values="0;0.6;0" 
                dur="3s" 
                repeatCount="indefinite"
                :begin="`${Math.random() * 2}s`"
              />
            </circle>
          </template>
        </g>

        <!-- 3. ACTIVE STATE (Hover Overlay) -->
        <!-- ACTIVATING LINE (Bright, Animating Outwards) -->
        <path
          v-if="activatingProject && busPaths[activatingProject]"
          :d="busPaths[activatingProject]"
          fill="none"
          :stroke="activeColor"
          stroke-width="2"
          class="opacity-100"
          filter="url(#glow-line)"
        >
          <animate
            attributeName="stroke-dasharray"
            from="0, 1000"
            to="1000, 0"
            dur="0.6s"
            fill="freeze"
            calcMode="spline"
            keySplines="0.4 0 0.2 1"
          />
        </path>

        <!-- STABLE ACTIVE LINE (Solid Color) -->
        <path
          v-if="activeProject && busPaths[activeProject] && activeProject !== 'sys_core'"
          :d="busPaths[activeProject]"
          fill="none"
          :stroke="activeColor"
          stroke-width="2"
          class="opacity-100 transition-all duration-300"
          filter="url(#glow-line)"
        />

        <!-- ACTIVE DATA PACKET (Fast Pulse) -->
        <circle 
          v-if="activeProject && busPaths[activeProject] && activeProject !== 'sys_core'" 
          r="2" 
          :fill="activeColor"
          filter="url(#glow-line)"
        >
          <animateMotion
            :path="busPaths[activeProject]"
            dur="1s"
            repeatCount="indefinite"
            calcMode="linear"
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
          data-module="mcp"
          :data-module-color="moduleColors['mcp']"
          class="z-30 transition-all duration-500 hover:scale-110"
          :class="[isMobile ? 'relative flex justify-center' : 'absolute', moduleStates['mcp'] === 'offline' ? 'opacity-100 grayscale scale-95' : 'opacity-100 grayscale-0 scale-100']"
          :style="isMobile ? {} : getModuleStyle('mcp')"
        >
          <ProjectLogo 
            label="MCP ROUTER" 
            :path="icons.mcp"
            :color="moduleStates['mcp'] === 'online' || activeProject === 'mcp' ? '#39ff14' : '#444444'"
            :is-active="activeProject === 'mcp' || linkedProject === 'mcp'"
            @mouseenter="handleHover('mcp', '#39ff14')"
            @mouseleave="handleLeave"
            @click="openLink('https://github.com/higuaifan/mcp-router')"
          />
        </div>

        <!-- Memex -->
        <div
          :ref="(el) => setProjectRef('memex', el)"
          data-module="memex"
          :data-module-color="moduleColors['memex']"
          class="z-30 transition-all duration-500 hover:scale-110"
          :class="[isMobile ? 'relative flex justify-center' : 'absolute', moduleStates['memex'] === 'offline' ? 'opacity-100 grayscale scale-95' : 'opacity-100 grayscale-0 scale-100']"
          :style="isMobile ? {} : getModuleStyle('memex')"
        >
          <ProjectLogo 
            label="MEMEX" 
            :path="icons.memex"
            :color="moduleStates['memex'] === 'online' || activeProject === 'memex' ? '#00f3ff' : '#444444'"
            :is-active="activeProject === 'memex'"
            @mouseenter="handleHover('memex', '#00f3ff')"
            @mouseleave="handleLeave"
            @click="openLink('https://github.com/higuaifan/memex')"
          />
        </div>

        <!-- Claude Hooks -->
        <div
          :ref="(el) => setProjectRef('hooks', el)"
          data-module="hooks"
          :data-module-color="moduleColors['hooks']"
          class="z-30 transition-all duration-500 hover:scale-110"
          :class="[isMobile ? 'relative flex justify-center' : 'absolute', moduleStates['hooks'] === 'offline' ? 'opacity-100 grayscale scale-95' : 'opacity-100 grayscale-0 scale-100']"
          :style="isMobile ? {} : getModuleStyle('hooks')"
        >
          <div class="relative">
            <ProjectLogo 
              label="CLAUDE HOOKS" 
              :path="icons.hooks"
              :color="moduleStates['hooks'] === 'online' || activeProject === 'hooks' ? '#ff6b35' : '#444444'"
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
          data-module="vlaude"
          :data-module-color="moduleColors['vlaude']"
          class="z-30 transition-all duration-500 hover:scale-110"
          :class="[isMobile ? 'relative flex justify-center' : 'absolute', moduleStates['vlaude'] === 'offline' ? 'opacity-100 grayscale scale-95' : 'opacity-100 grayscale-0 scale-100']"
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
              :color="moduleStates['vlaude'] === 'online' || activeProject === 'vlaude' ? '#ff2a6d' : '#444444'"
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
          data-module="about"
          :data-module-color="moduleColors['about']"
          class="z-30 transition-all duration-500"
          :class="[isMobile ? 'relative' : 'absolute', moduleStates['about'] === 'offline' ? 'opacity-100 grayscale scale-95' : 'opacity-100 grayscale-0 scale-100']"
          :style="isMobile ? {} : getModuleStyle('about')"
        >
          <ContentChip 
            label="ABOUT" 
            :path="icons.about"
            :color="moduleStates['about'] === 'online' || activeProject === 'about' ? '#ffffff' : '#444444'"
            :is-active="activeProject === 'about'"
            @mouseenter="handleHover('about', '#ffffff')"
            @mouseleave="handleLeave"
          />
        </div>

        <!-- Docs -->
        <div
          :ref="(el) => setProjectRef('docs', el)"
          data-module="docs"
          :data-module-color="moduleColors['docs']"
          class="z-30 transition-all duration-500"
          :class="[isMobile ? 'relative' : 'absolute', moduleStates['docs'] === 'offline' ? 'opacity-100 grayscale scale-95' : 'opacity-100 grayscale-0 scale-100']"
          :style="isMobile ? {} : getModuleStyle('docs')"
        >
          <ContentChip 
            label="DOCS" 
            :path="icons.docs"
            :color="moduleStates['docs'] === 'online' || activeProject === 'docs' ? '#ffffff' : '#444444'"
            :is-active="activeProject === 'docs'"
            @mouseenter="handleHover('docs', '#ffffff')"
            @mouseleave="handleLeave"
          />
        </div>

        <!-- Community -->
        <div
          :ref="(el) => setProjectRef('community', el)"
          data-module="community"
          :data-module-color="moduleColors['community']"
          class="z-30 transition-all duration-500"
          :class="[isMobile ? 'relative' : 'absolute', moduleStates['community'] === 'offline' ? 'opacity-100 grayscale scale-95' : 'opacity-100 grayscale-0 scale-100']"
          :style="isMobile ? {} : getModuleStyle('community')"
        >
          <ContentChip 
            label="COMMUNITY" 
            :path="icons.community"
            :color="moduleStates['community'] === 'online' || activeProject === 'community' ? '#ffffff' : '#444444'"
            :is-active="activeProject === 'community'"
            @mouseenter="handleHover('community', '#ffffff')"
            @mouseleave="handleLeave"
          />
        </div>

        <!-- Roadmap -->
        <div
          :ref="(el) => setProjectRef('roadmap', el)"
          data-module="roadmap"
          :data-module-color="moduleColors['roadmap']"
          class="z-30 transition-all duration-500"
          :class="[isMobile ? 'relative' : 'absolute', moduleStates['roadmap'] === 'offline' ? 'opacity-100 grayscale scale-95' : 'opacity-100 grayscale-0 scale-100']"
          :style="isMobile ? {} : getModuleStyle('roadmap')"
        >
          <ContentChip 
            label="ROADMAP" 
            :path="icons.roadmap"
            :color="moduleStates['roadmap'] === 'online' || activeProject === 'roadmap' ? '#ffffff' : '#444444'"
            :is-active="activeProject === 'roadmap'"
            @mouseenter="handleHover('roadmap', '#ffffff')"
            @mouseleave="handleLeave"
          />
        </div>

        <!-- System Core (Disconnected Vertical Chip) -->
        <div
          :ref="(el) => setProjectRef('sys_core', el)"
          class="z-30 transition-all duration-500"
          :class="[isMobile ? 'relative' : 'absolute']"
          :style="isMobile ? {} : getModuleStyle('sys_core')"
        >
          <div 
            class="w-full h-full border border-dashed border-[#444] hover:border-red-500/80 transition-colors duration-300 flex flex-col items-center justify-between py-4 cursor-pointer group bg-[#050505]/50 backdrop-blur-sm"
            @mouseenter="handleHover('sys_core', '#ff0000')"
            @mouseleave="handleLeave"
          >
            <!-- Top Indicator -->
            <div class="w-1 h-1 bg-[#444] group-hover:bg-red-500 rounded-full shadow-[0_0_5px_currentColor] transition-colors duration-300"></div>
            
            <!-- Vertical Text -->
            <div 
              class="text-[10px] font-mono tracking-[0.3em] text-[#444] group-hover:text-red-500 transition-colors duration-300 select-none flex items-center gap-4"
              style="writing-mode: vertical-rl; text-orientation: mixed;"
            >
              <span class="opacity-50">NO_SIGNAL</span>
              <span class="font-bold">SYS_CORE_LEGACY</span>
            </div>

            <!-- Bottom Barcode/Details -->
            <div class="flex flex-col gap-1 w-full px-3 opacity-30 group-hover:opacity-80 transition-opacity duration-300">
              <div class="h-[1px] w-full bg-current text-[#444] group-hover:text-red-500"></div>
              <div class="h-[1px] w-2/3 bg-current text-[#444] group-hover:text-red-500 self-end"></div>
              <div class="h-[1px] w-full bg-current text-[#444] group-hover:text-red-500"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import ContentChip from '~/components/ContentChip.vue'
import BootLine from '~/components/BootLine.vue'
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
  { id: 'roadmap', width: 140, height: 140, preference: 'bottom-right' as const },
  { id: 'sys_core', width: 60, height: 240, preference: 'bottom-right' as const }
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

const recalculateLayout = async () => {
  if (isMobile.value) return

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

  // Wait for DOM updates to complete
  await nextTick()
  await new Promise(resolve => requestAnimationFrame(resolve))

  // Wait for CSS transitions to complete (modules have transition-all duration-500)
  // This ensures getBoundingClientRect() returns final positions, not mid-animation positions
  await new Promise(resolve => setTimeout(resolve, 550))

  // Now recalculate connection lines with updated positions
  initBusLines()
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
- AI-Powered Debugging Assistant`,

  sys_core: `> TARGET: UNKNOWN_CHIP
> TYPE: LEGACY_HARDWARE
> STATUS: OFFLINE

[NO_CONNECTION_DETECTED]
[MANUAL_OVERRIDE_REQUIRED]

This module appears to be dormant.
A relic from a previous iteration?`
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
  roadmap: 'M20 50 H80 M70 40 L80 50 L70 60 M30 40 V60 M50 40 V60',

  // Sys Core: BGA Chip
  sys_core: 'M25 25 H75 V75 H25 Z M35 35 H65 V65 H35 Z M45 45 H55 V55 H45 Z M25 25 L15 15 M75 25 L85 15 M25 75 L15 85 M75 75 L85 85'
}

// Module Colors
const moduleColors: Record<string, string> = {
  mcp: '#39ff14',      // Neon Green
  memex: '#00f3ff',    // Cyan
  hooks: '#ff6b35',    // Orange
  vlaude: '#9d4edd',   // Purple
  about: '#ffd60a',    // Yellow
  docs: '#06ffa5',     // Mint
  community: '#ff006e', // Pink
  roadmap: '#4cc9f0'   // Sky Blue
}

const currentText = ref(defaultText)
const terminalRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const projectRefs = ref<Record<string, HTMLElement>>({})
const activeColor = ref('#00f3ff')
const activeProject = ref<string | null>(null)
const activatingProject = ref<string | null>(null) // New state for animation
const linkedProject = ref<string | null>(null)
let activationTimeout: NodeJS.Timeout | null = null

const busPaths = ref<Record<string, string>>({})

const setProjectRef = (key: string, el: any) => {
  if (el) projectRefs.value[key] = el as HTMLElement
}

const handleHover = (key: keyof typeof projects, color: string) => {
  if (key === 'sys_core') {
    // Sys Core is special: instant offline status, no line
    currentText.value = projects[key]
    activeColor.value = color
    activeProject.value = key
    return
  }

  // Prevent re-triggering if already active or activating
  if (activeProject.value === key || activatingProject.value === key) return

  currentText.value = projects[key]
  activeColor.value = color
  
  // Start Activation Sequence
  activatingProject.value = key
  
  // Clear any existing timeout
  if (activationTimeout) clearTimeout(activationTimeout)

  // Wait for line animation (e.g., 600ms) then activate module
  activationTimeout = setTimeout(() => {
    if (activatingProject.value === key) {
      activatingProject.value = null
      activeProject.value = key
      
      // Linkage Logic (only after activation)
    }
  }, 600)
}

const handleLeave = () => {
  currentText.value = defaultText
  activeProject.value = null
  activatingProject.value = null
  linkedProject.value = null
  if (activationTimeout) clearTimeout(activationTimeout)
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

const initBusLines = () => {
  if (isMobile.value) return

  const terminal = terminalRef.value
  const container = terminal?.parentElement
  if (!terminal || !container) {
    console.warn('initBusLines: terminal or container not found')
    return
  }

  // Check if projectRefs are populated
  const availableRefs = Object.keys(projectRefs.value).length
  if (availableRefs === 0) {
    console.warn('initBusLines: No project refs available yet')
    return
  }

  const tRect = terminal.getBoundingClientRect()
  const cRect = container.getBoundingClientRect()

  console.log('Init Bus Lines (A* Pathfinding)', {
    tRect,
    cRect,
    availableRefs,
    expectedRefs: Object.keys(projects).length
  })

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
    if (key === 'sys_core') continue // Skip disconnected chip

    const project = projectRefs.value[key]
    if (project) {
      const pRect = project.getBoundingClientRect()

      // 计算起点和终点（使用中心点）
      // Reverse: Start from Terminal, End at Module
      const startX = tRect.left + tRect.width / 2 - cRect.left
      const startY = tRect.top + tRect.height / 2 - cRect.top
      const endX = pRect.left + pRect.width / 2 - cRect.left
      const endY = pRect.top + pRect.height / 2 - cRect.top

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

  // Debug: Log all generated paths
  console.log('=== BUS PATHS GENERATED ===')
  console.log('Total paths:', Object.keys(busPaths.value).length)
  for (const key in busPaths.value) {
    console.log(`${key}:`, busPaths.value[key].substring(0, 50) + '...')
  }
}

const moduleStates = ref<Record<string, 'offline' | 'booting' | 'online'>>({
  mcp: 'offline',
  memex: 'offline',
  hooks: 'offline',
  vlaude: 'offline',
  about: 'offline',
  docs: 'offline',
  community: 'offline',
  roadmap: 'offline',
  sys_core: 'offline'
})

const bootProgress = ref<Record<string, number>>({})

const getBootProgress = (moduleKey: string) => {
  return 3000 - ((bootProgress.value[moduleKey] || 0) * 3000)
}

const animateBootLine = (moduleKey: string, duration: number): Promise<void> => {
  return new Promise(resolve => {
    const drawDuration = duration * 0.7 // 70% for drawing out
    const retractDuration = duration * 0.3 // 30% for retracting
    const startTime = performance.now()
    bootProgress.value[moduleKey] = 0
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      
      if (elapsed < drawDuration) {
        // Phase 1: Draw out (0 -> 1)
        const p = Math.min(elapsed / drawDuration, 1)
        bootProgress.value[moduleKey] = p
        requestAnimationFrame(animate)
      } else if (elapsed < drawDuration + retractDuration) {
        // Phase 2: Retract (1 -> 1.5, which makes line disappear from start)
        const retractElapsed = elapsed - drawDuration
        const p = 1 + (retractElapsed / retractDuration) * 0.5
        bootProgress.value[moduleKey] = p
        requestAnimationFrame(animate)
      } else {
        // Done
        bootProgress.value[moduleKey] = 1.5
        resolve()
      }
    }
    
    requestAnimationFrame(animate)
  })
}

const runBootSequence = async () => {
  console.log('Starting Boot Sequence...')
  
  // Wait a bit for layout
  await new Promise(resolve => setTimeout(resolve, 800))

  // Sequence
  const keys = Object.keys(projects)
  console.log('Boot sequence keys:', keys)
  console.log('Available busPaths:', Object.keys(busPaths.value))
  
  for (const key of keys) {
    if (key === 'sys_core') {
      moduleStates.value[key] = 'offline'
      continue
    }

    // Check if path exists
    if (!busPaths.value[key]) {
      console.warn(`No bus path for ${key}, skipping`)
      continue
    }

    // Start Booting (Line draws)
    console.log(`Booting ${key}... State:`, moduleStates.value[key])
    moduleStates.value[key] = 'booting'
    
    // Animate line (2 seconds)
    await animateBootLine(key, 2000)
    
    // Online (Turn Colorful)
    console.log(`${key} is Online`)
    moduleStates.value[key] = 'online'
    
    // Small stagger
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  console.log('Boot Sequence Complete')
}

const openLink = (url: string) => {
  window.open(url, '_blank')
}

onMounted(async () => {
  checkMobile()

  // Wait for DOM to be fully rendered
  await nextTick()
  await new Promise(resolve => requestAnimationFrame(resolve))

  // Initialize layout with stable dimensions
  if (!isMobile.value) {
    await recalculateLayout()

    // Add additional wait to ensure all refs are set
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    // Verify refs are populated before boot sequence
    const refsCount = Object.keys(projectRefs.value).length
    console.log(`Refs populated: ${refsCount} / ${Object.keys(projects).length}`)

    if (refsCount < Object.keys(projects).length) {
      console.warn('Not all project refs are set, retrying initBusLines...')
      initBusLines()
    }

    runBootSequence()
  }

  // Setup resize listener
  let resizeTimeout: NodeJS.Timeout
  window.addEventListener('resize', async () => {
    checkMobile()
    if (!isMobile.value) {
      // Hide connection lines immediately during resize
      busPaths.value = {}

      // Debounce resize to avoid excessive recalculations
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(async () => {
        await recalculateLayout()
      }, 200)
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>
