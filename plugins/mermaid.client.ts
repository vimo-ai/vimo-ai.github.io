import mermaid from 'mermaid'

export default defineNuxtPlugin(() => {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
      primaryColor: '#00f0ff',
      primaryTextColor: '#fff',
      primaryBorderColor: '#00f0ff',
      lineColor: '#00f0ff',
      secondaryColor: '#1a1a2e',
      tertiaryColor: '#0a0a0f',
      background: '#0a0a0f',
      mainBkg: '#1a1a2e',
      nodeBorder: '#00f0ff',
      clusterBkg: '#1a1a2e',
      titleColor: '#00f0ff',
      edgeLabelBackground: '#1a1a2e'
    }
  })

  // Create fullscreen overlay
  const createOverlay = () => {
    if (document.getElementById('mermaid-fullscreen')) return

    const overlay = document.createElement('div')
    overlay.id = 'mermaid-fullscreen'
    overlay.innerHTML = `
      <div class="mermaid-fullscreen-content"></div>
      <button class="mermaid-fullscreen-close">&times;</button>
      <div class="mermaid-fullscreen-hint">ESC or click to close</div>
    `
    document.body.appendChild(overlay)

    // Close handlers
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active')
    })
    overlay.querySelector('.mermaid-fullscreen-close')?.addEventListener('click', () => {
      overlay.classList.remove('active')
    })
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') overlay.classList.remove('active')
    })

    // Add styles
    const style = document.createElement('style')
    style.textContent = `
      #mermaid-fullscreen {
        position: fixed;
        inset: 0;
        background: rgba(10, 10, 15, 0.98);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s, visibility 0.2s;
      }
      #mermaid-fullscreen.active {
        opacity: 1;
        visibility: visible;
      }
      .mermaid-fullscreen-content {
        width: 95vw;
        height: 90vh;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: auto;
      }
      .mermaid-fullscreen-content svg {
        width: auto;
        height: auto;
        max-width: 95vw;
        max-height: 88vh;
        min-width: 80vw;
      }
      .mermaid-fullscreen-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: transparent;
        border: 1px solid #00f0ff;
        color: #00f0ff;
        font-size: 2rem;
        width: 3rem;
        height: 3rem;
        cursor: pointer;
        border-radius: 4px;
        transition: background 0.2s;
      }
      .mermaid-fullscreen-close:hover {
        background: rgba(0, 240, 255, 0.1);
      }
      .mermaid-fullscreen-hint {
        position: absolute;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
        color: #666;
        font-size: 0.875rem;
      }
      .mermaid-diagram {
        position: relative;
        cursor: pointer;
      }
      .mermaid-expand-btn {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: rgba(0, 240, 255, 0.1);
        border: 1px solid #00f0ff;
        color: #00f0ff;
        width: 2rem;
        height: 2rem;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s, background 0.2s;
      }
      .mermaid-diagram:hover .mermaid-expand-btn {
        opacity: 1;
      }
      .mermaid-expand-btn:hover {
        background: rgba(0, 240, 255, 0.2);
      }
      .mermaid-expand-btn svg {
        width: 1rem;
        height: 1rem;
      }
    `
    document.head.appendChild(style)
  }

  const showFullscreen = (svg: string) => {
    const overlay = document.getElementById('mermaid-fullscreen')
    const content = overlay?.querySelector('.mermaid-fullscreen-content')
    if (content) {
      content.innerHTML = svg
      overlay?.classList.add('active')
    }
  }

  const renderMermaid = async () => {
    await nextTick()
    createOverlay()

    // Find all mermaid code blocks (Nuxt Content puts class on <pre>)
    const elements = document.querySelectorAll('pre.language-mermaid')

    for (const pre of elements) {
      if ((pre as HTMLElement).dataset.mermaidRendered) continue

      const code = pre.textContent || ''
      const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`

      try {
        const { svg } = await mermaid.render(id, code)
        const container = document.createElement('div')
        container.className = 'mermaid-diagram'
        container.innerHTML = svg

        // Add expand button
        const expandBtn = document.createElement('button')
        expandBtn.className = 'mermaid-expand-btn'
        expandBtn.title = 'Fullscreen'
        expandBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>`
        expandBtn.addEventListener('click', (e) => {
          e.stopPropagation()
          showFullscreen(svg)
        })
        container.appendChild(expandBtn)

        container.addEventListener('click', () => showFullscreen(svg))
        pre.replaceWith(container)
      } catch (e) {
        console.error('Mermaid render error:', e)
      }
    }
  }

  // Render on route change
  const router = useRouter()
  router.afterEach(() => {
    setTimeout(renderMermaid, 100)
  })

  // Initial render
  if (import.meta.client) {
    setTimeout(renderMermaid, 100)
  }
})
