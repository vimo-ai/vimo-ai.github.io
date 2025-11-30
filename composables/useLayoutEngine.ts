import { ref } from 'vue'

interface Rect {
  x: number
  y: number
  width: number
  height: number
}

interface Module {
  id: string
  width: number
  height: number
  preference?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'any'
}

interface LayoutResult {
  [key: string]: { x: number; y: number }
  terminalPosition?: { x: number; y: number }
}

interface FreeRectangle {
  x: number
  y: number
  width: number
  height: number
}

/**
 * 检查两个矩形是否碰撞
 */
function hasCollision(rect1: Rect, rect2: Rect, padding = 0): boolean {
  return !(
    rect1.x + rect1.width + padding < rect2.x ||
    rect2.x + rect2.width + padding < rect1.x ||
    rect1.y + rect1.height + padding < rect2.y ||
    rect2.y + rect2.height + padding < rect1.y
  )
}

/**
 * 初始化可用矩形列表（Terminal 周围的四块区域）
 */
function initializeFreeRectangles(
  containerWidth: number,
  containerHeight: number,
  terminalRect: Rect,
  margin = 75
): FreeRectangle[] {
  const freeRects: FreeRectangle[] = []

  // 左侧区域
  if (terminalRect.x > margin) {
    freeRects.push({
      x: margin,
      y: margin,
      width: terminalRect.x - margin,
      height: containerHeight - 2 * margin
    })
  }

  // 右侧区域
  const rightX = terminalRect.x + terminalRect.width
  if (rightX < containerWidth - margin) {
    freeRects.push({
      x: rightX,
      y: margin,
      width: containerWidth - margin - rightX,
      height: containerHeight - 2 * margin
    })
  }

  // 上方区域（整个宽度）
  if (terminalRect.y > margin) {
    freeRects.push({
      x: margin,
      y: margin,
      width: containerWidth - 2 * margin,
      height: terminalRect.y - margin
    })
  }

  // 下方区域（整个宽度）
  const bottomY = terminalRect.y + terminalRect.height
  if (bottomY < containerHeight - margin) {
    freeRects.push({
      x: margin,
      y: bottomY,
      width: containerWidth - 2 * margin,
      height: containerHeight - margin - bottomY
    })
  }

  return freeRects
}

/**
 * 在可用矩形中找到最佳位置放置模块
 */
function findBestPosition(
  module: Module,
  freeRects: FreeRectangle[],
  occupiedRects: Rect[],
  padding = 30
): { x: number; y: number; rectIndex: number } | null {
  let bestPosition: { x: number; y: number; rectIndex: number } | null = null
  let bestScore = -Infinity

  for (let i = 0; i < freeRects.length; i++) {
    const rect = freeRects[i]

    // 检查模块是否能放入这个矩形
    if (rect.width < module.width || rect.height < module.height) {
      continue
    }

    // 计算安全放置范围
    const safeRangeX = rect.width - module.width
    const safeRangeY = rect.height - module.height

    // 在安全范围内随机生成候选位置（增加随机性和自然感）
    const candidateCount = 15 // 每个矩形尝试15个随机位置
    const candidates: { x: number; y: number }[] = []

    for (let j = 0; j < candidateCount; j++) {
      const randomX = rect.x + Math.random() * safeRangeX
      const randomY = rect.y + Math.random() * safeRangeY
      candidates.push({ x: randomX, y: randomY })
    }

    // 也保留几个关键位置（角落）作为备选
    candidates.push(
      { x: rect.x, y: rect.y }, // 左上
      { x: rect.x + safeRangeX, y: rect.y }, // 右上
      { x: rect.x, y: rect.y + safeRangeY }, // 左下
      { x: rect.x + safeRangeX, y: rect.y + safeRangeY } // 右下
    )

    for (const pos of candidates) {
      const moduleRect: Rect = {
        x: pos.x,
        y: pos.y,
        width: module.width,
        height: module.height
      }

      // 检查是否与已占用区域碰撞
      let hasAnyCollision = false
      for (const occupied of occupiedRects) {
        if (hasCollision(moduleRect, occupied, padding)) {
          hasAnyCollision = true
          break
        }
      }

      if (!hasAnyCollision) {
        // 计算分数：轻微倾向偏好象限，但主要靠随机
        let score = Math.random() * 100 // 主要靠随机

        // 偏好象限只给小权重（10%影响）
        if (module.preference) {
          const centerX = pos.x + module.width / 2
          const centerY = pos.y + module.height / 2
          let preferenceBonus = 0

          switch (module.preference) {
            case 'top-left':
              preferenceBonus = -centerX - centerY
              break
            case 'top-right':
              preferenceBonus = centerX - centerY
              break
            case 'bottom-left':
              preferenceBonus = -centerX + centerY
              break
            case 'bottom-right':
              preferenceBonus = centerX + centerY
              break
          }

          score += preferenceBonus * 0.01 // 降低偏好权重
        }

        if (score > bestScore) {
          bestScore = score
          bestPosition = { x: pos.x, y: pos.y, rectIndex: i }
        }
      }
    }
  }

  return bestPosition
}

/**
 * 分割矩形：放置模块后，将剩余空间切割成新的可用矩形
 */
function splitFreeRectangle(
  freeRect: FreeRectangle,
  placedModule: Rect
): FreeRectangle[] {
  const newRects: FreeRectangle[] = []

  // Guillotine 切割策略：水平和垂直切割

  // 左侧剩余
  if (placedModule.x > freeRect.x) {
    newRects.push({
      x: freeRect.x,
      y: freeRect.y,
      width: placedModule.x - freeRect.x,
      height: freeRect.height
    })
  }

  // 右侧剩余
  const rightX = placedModule.x + placedModule.width
  if (rightX < freeRect.x + freeRect.width) {
    newRects.push({
      x: rightX,
      y: freeRect.y,
      width: freeRect.x + freeRect.width - rightX,
      height: freeRect.height
    })
  }

  // 上方剩余
  if (placedModule.y > freeRect.y) {
    newRects.push({
      x: freeRect.x,
      y: freeRect.y,
      width: freeRect.width,
      height: placedModule.y - freeRect.y
    })
  }

  // 下方剩余
  const bottomY = placedModule.y + placedModule.height
  if (bottomY < freeRect.y + freeRect.height) {
    newRects.push({
      x: freeRect.x,
      y: bottomY,
      width: freeRect.width,
      height: freeRect.y + freeRect.height - bottomY
    })
  }

  return newRects.filter(r => r.width > 0 && r.height > 0)
}

/**
 * 主布局计算函数
 */
export function calculateLayout(
  containerWidth: number,
  containerHeight: number,
  terminalWidth: number,
  terminalHeight: number,
  modules: Module[]
): LayoutResult {
  const margin = 75
  const padding = 30

  // Terminal 初始居中
  let terminalX = (containerWidth - terminalWidth) / 2
  let terminalY = (containerHeight - terminalHeight) / 2

  const terminalRect: Rect = {
    x: terminalX,
    y: terminalY,
    width: terminalWidth,
    height: terminalHeight
  }

  // 初始化可用矩形
  let freeRects = initializeFreeRectangles(containerWidth, containerHeight, terminalRect, margin)

  // 已占用区域（包括 Terminal）
  const occupiedRects: Rect[] = [terminalRect]

  const result: LayoutResult = {}
  const failedModules: Module[] = []

  // 按面积降序排列模块
  const sortedModules = [...modules].sort((a, b) => (b.width * b.height) - (a.width * a.height))

  // 第一轮：尝试放置所有模块
  for (const module of sortedModules) {
    const position = findBestPosition(module, freeRects, occupiedRects, padding)

    if (position) {
      result[module.id] = { x: position.x, y: position.y }

      const placedRect: Rect = {
        x: position.x,
        y: position.y,
        width: module.width,
        height: module.height
      }

      occupiedRects.push(placedRect)

      // 分割使用的矩形，更新可用矩形列表
      const usedRect = freeRects[position.rectIndex]
      const newRects = splitFreeRectangle(usedRect, placedRect)

      // 移除旧矩形，添加新矩形
      freeRects.splice(position.rectIndex, 1)
      freeRects.push(...newRects)
    } else {
      failedModules.push(module)
    }
  }

  // 如果有模块放不下，尝试将 Terminal 上移
  if (failedModules.length > 0) {
    console.log(`有 ${failedModules.length} 个模块放不下，尝试上移 Terminal`)

    // 计算所需底部空间
    const maxFailedHeight = Math.max(...failedModules.map(m => m.height))
    const requiredBottomSpace = maxFailedHeight + margin + padding

    // 计算新的 Terminal Y 位置
    const newTerminalY = Math.max(5, containerHeight - terminalHeight - requiredBottomSpace)

    if (newTerminalY < terminalY) {
      // 重新计算整个布局
      terminalY = newTerminalY
      terminalRect.y = terminalY

      freeRects = initializeFreeRectangles(containerWidth, containerHeight, terminalRect, margin)
      occupiedRects.length = 1 // 只保留 Terminal
      occupiedRects[0] = terminalRect

      // 清空结果，重新放置所有模块
      for (const key in result) {
        delete result[key]
      }

      for (const module of sortedModules) {
        const position = findBestPosition(module, freeRects, occupiedRects, padding)

        if (position) {
          result[module.id] = { x: position.x, y: position.y }

          const placedRect: Rect = {
            x: position.x,
            y: position.y,
            width: module.width,
            height: module.height
          }

          occupiedRects.push(placedRect)

          const usedRect = freeRects[position.rectIndex]
          const newRects = splitFreeRectangle(usedRect, placedRect)

          freeRects.splice(position.rectIndex, 1)
          freeRects.push(...newRects)
        } else {
          console.warn(`即使上移 Terminal，仍无法放置模块: ${module.id}`)
          result[module.id] = { x: margin, y: margin }
        }
      }

      // 保存 Terminal 位置供外部使用
      result.terminalPosition = { x: terminalX, y: terminalY }
    }
  }

  return result
}

/**
 * Composable for managing dynamic layout
 */
export function useLayoutEngine() {
  const positions = ref<LayoutResult>({})

  const computeLayout = (
    viewportWidth: number,
    viewportHeight: number,
    terminalWidth: number,
    terminalHeight: number,
    modules: Module[]
  ) => {
    positions.value = calculateLayout(viewportWidth, viewportHeight, terminalWidth, terminalHeight, modules)
  }

  return {
    positions,
    computeLayout
  }
}
