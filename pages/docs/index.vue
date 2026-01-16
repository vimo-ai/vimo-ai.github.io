<template>
  <div class="min-h-screen bg-cyber-black text-gray-100">
    <!-- Header -->
    <DocsHeader />

    <!-- Main Content -->
    <main class="px-6 py-16">
      <!-- Title -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-neon-cyan mb-4 font-orbitron tracking-wider">
          DOCUMENTATION
        </h1>
        <p class="text-gray-400">
          Select a project to explore its documentation
        </p>
      </div>

      <!-- Project Cards -->
      <div class="grid md:grid-cols-2 gap-6">
        <NuxtLink
          v-for="project in projects"
          :key="project.id"
          :to="`/docs/${project.id}`"
          class="group relative border border-gray-800 hover:border-neon-cyan/50 bg-cyber-dark/50 p-6 rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,243,255,0.1)]"
        >
          <!-- Icon -->
          <div class="mb-4">
            <svg
              class="w-12 h-12 text-gray-600 group-hover:text-neon-cyan transition-colors duration-300"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path :d="project.icon" />
            </svg>
          </div>

          <!-- Content -->
          <h2 class="text-xl font-bold text-gray-100 group-hover:text-neon-cyan transition-colors mb-2">
            {{ project.label }}
          </h2>
          <p class="text-gray-500 text-sm">
            {{ project.description }}
          </p>

          <!-- Arrow -->
          <div class="absolute top-6 right-6 text-gray-600 group-hover:text-neon-cyan transition-all duration-300 group-hover:translate-x-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <!-- Hover glow effect -->
          <div class="absolute inset-0 rounded-lg bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/5 to-neon-cyan/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </NuxtLink>
      </div>

      <!-- Back to Home -->
      <div class="text-center mt-12">
        <NuxtLink
          to="/"
          class="text-gray-500 hover:text-neon-cyan transition-colors text-sm"
        >
          &larr; Back to Home
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { docsProjects } from '~/composables/useDocsConfig'

const projects = docsProjects
</script>
