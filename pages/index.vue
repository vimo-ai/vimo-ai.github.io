<template>
  <div class="min-h-screen bg-cyber-black flex items-center justify-center overflow-hidden relative font-mono selection:bg-neon-cyan selection:text-cyber-black">
    <BackgroundGrid />

    <!-- Main Container -->
    <div class="relative z-10 w-full max-w-7xl h-[900px] flex items-center justify-center">
      
      <!-- Central Terminal -->
      <div class="relative z-20">
        <ETerminal :target-text="currentText" />
      </div>

      <!-- Orbiting Icons - Adjusted Positions for Larger Logos -->
      
      <!-- Top Left: MCP Router -->
      <div class="absolute top-10 left-32">
        <ProjectLogo 
          label="MCP ROUTER" 
          :path="icons.mcp"
          color="#39ff14"
          @hover="setProject('mcp')"
          @leave="resetText"
          @click="openLink('https://github.com/higuaifan/mcp-router')"
        />
      </div>

      <!-- Top Right: Memex -->
      <div class="absolute top-10 right-32">
        <ProjectLogo 
          label="MEMEX" 
          :path="icons.memex"
          color="#00f3ff"
          @hover="setProject('memex')"
          @leave="resetText"
          @click="openLink('https://github.com/higuaifan/memex')"
        />
      </div>

      <!-- Bottom Left: Claude Hooks -->
      <div class="absolute bottom-10 left-32">
        <ProjectLogo 
          label="CLAUDE HOOKS" 
          :path="icons.hooks"
          color="#ff6b35"
          @hover="setProject('hooks')"
          @leave="resetText"
          @click="openLink('https://github.com/higuaifan/claude-hooks')"
        />
      </div>

      <!-- Bottom Right: Vlaude -->
      <div class="absolute bottom-10 right-32">
        <ProjectLogo 
          label="VLAUDE" 
          :path="icons.vlaude"
          color="#ff2a6d"
          @hover="setProject('vlaude')"
          @leave="resetText"
          @click="openLink('https://github.com/higuaifan/vlaude')"
        />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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

const setProject = (key: keyof typeof projects) => {
  currentText.value = projects[key]
}

const resetText = () => {
  currentText.value = defaultText
}

const openLink = (url: string) => {
  window.open(url, '_blank')
}
</script>
