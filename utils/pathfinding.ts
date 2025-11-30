interface Point {
  x: number
  y: number
}

interface Rect {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Check if a line segment intersects with a rectangle
 */
function lineIntersectsRect(p1: Point, p2: Point, rect: Rect, padding = 10): boolean {
  // Expand rect by padding
  const expandedRect = {
    x: rect.x - padding,
    y: rect.y - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2
  }

  // Check if either endpoint is inside the rect
  if (
    (p1.x >= expandedRect.x && p1.x <= expandedRect.x + expandedRect.width &&
      p1.y >= expandedRect.y && p1.y <= expandedRect.y + expandedRect.height) ||
    (p2.x >= expandedRect.x && p2.x <= expandedRect.x + expandedRect.width &&
      p2.y >= expandedRect.y && p2.y <= expandedRect.y + expandedRect.height)
  ) {
    return true
  }

  // Check if line segment intersects any of the 4 edges
  const edges = [
    { x1: expandedRect.x, y1: expandedRect.y, x2: expandedRect.x + expandedRect.width, y2: expandedRect.y }, // top
    { x1: expandedRect.x + expandedRect.width, y1: expandedRect.y, x2: expandedRect.x + expandedRect.width, y2: expandedRect.y + expandedRect.height }, // right
    { x1: expandedRect.x, y1: expandedRect.y + expandedRect.height, x2: expandedRect.x + expandedRect.width, y2: expandedRect.y + expandedRect.height }, // bottom
    { x1: expandedRect.x, y1: expandedRect.y, x2: expandedRect.x, y2: expandedRect.y + expandedRect.height } // left
  ]

  for (const edge of edges) {
    if (lineSegmentsIntersect(p1.x, p1.y, p2.x, p2.y, edge.x1, edge.y1, edge.x2, edge.y2)) {
      return true
    }
  }

  return false
}

/**
 * Check if two line segments intersect
 */
function lineSegmentsIntersect(
  x1: number, y1: number, x2: number, y2: number,
  x3: number, y3: number, x4: number, y4: number
): boolean {
  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)
  if (denom === 0) return false // parallel

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom

  return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1
}

/**
 * Manhattan distance heuristic
 */
function heuristic(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

/**
 * A* pathfinding with Manhattan routing (only horizontal/vertical moves)
 * Optimized for performance
 */
export function findPath(
  start: Point,
  end: Point,
  obstacles: Rect[],
  gridSize = 100, // Larger grid = fewer nodes
  existingPaths: Point[][] = [] // 已有线路作为障碍物
): Point[] {
  // Simple case: if direct path doesn't collide, use it
  const directPath = generateManhattanPath(start, end)
  if (!pathCollidesWithObstacles(directPath, obstacles, existingPaths)) {
    return directPath
  }

  // Otherwise, use A* to find a path around obstacles
  const openSet: Array<{ point: Point; g: number; h: number; f: number; parent: Point | null }> = []
  const closedSet = new Set<string>()

  const maxIterations = 200 // Prevent infinite loops
  let iterations = 0

  const startNode = {
    point: start,
    g: 0,
    h: heuristic(start, end),
    f: heuristic(start, end),
    parent: null
  }

  openSet.push(startNode)

  const getKey = (p: Point) => `${Math.round(p.x / gridSize)},${Math.round(p.y / gridSize)}`

  while (openSet.length > 0 && iterations < maxIterations) {
    iterations++

    // Find node with lowest f score
    openSet.sort((a, b) => a.f - b.f)
    const current = openSet.shift()!

    // Check if we're close enough to the goal
    if (heuristic(current.point, end) < gridSize * 2) {
      // Reconstruct path
      const path: Point[] = [start]
      let node: typeof current | null = current

      // Trace back through parents
      const visited = new Set<string>()
      while (node && node.parent) {
        const key = getKey(node.point)
        if (visited.has(key)) break // Prevent loops
        visited.add(key)

        path.push(node.point)
        // Find parent node
        const parentKey = getKey(node.parent)
        node = openSet.find(n => getKey(n.point) === parentKey) ||
          Array.from(closedSet).map(k => {
            const parts = k.split(',')
            const x = Number(parts[0])
            const y = Number(parts[1])
            if (isNaN(x) || isNaN(y)) return null
            return { point: { x: x * gridSize, y: y * gridSize }, parent: null, g: 0, h: 0, f: 0 }
          }).filter((n): n is NonNullable<typeof n> => n !== null)
            .find(n => getKey(n.point) === parentKey) || null
      }

      path.push(end)
      return path
    }

    closedSet.add(getKey(current.point))

    // Generate neighbors (4 directions: up, down, left, right)
    const neighbors = [
      { x: current.point.x + gridSize, y: current.point.y },
      { x: current.point.x - gridSize, y: current.point.y },
      { x: current.point.x, y: current.point.y + gridSize },
      { x: current.point.x, y: current.point.y - gridSize }
    ]

    for (const neighbor of neighbors) {
      const key = getKey(neighbor)
      if (closedSet.has(key)) continue

      // Check if this move collides with obstacles
      const segment = [current.point, neighbor]
      if (pathCollidesWithObstacles(segment, obstacles, existingPaths)) continue

      const g = current.g + gridSize
      const h = heuristic(neighbor, end)
      const f = g + h

      const existingNode = openSet.find(n => getKey(n.point) === key)
      if (existingNode) {
        if (g < existingNode.g) {
          existingNode.g = g
          existingNode.f = f
          existingNode.parent = current.point
        }
      } else {
        openSet.push({
          point: neighbor,
          g,
          h,
          f,
          parent: current.point
        })
      }
    }
  }

  // Fallback: return direct path if no path found or timeout
  console.warn('Pathfinding timeout or no path found, using direct path')
  return directPath
}

/**
 * Generate a simple Manhattan path (L-shape or Z-shape)
 */
function generateManhattanPath(start: Point, end: Point): Point[] {
  const midX = (start.x + end.x) / 2
  return [
    start,
    { x: midX, y: start.y },
    { x: midX, y: end.y },
    end
  ]
}

/**
 * Check if a path collides with any obstacles
 */
function pathCollidesWithObstacles(path: Point[], obstacles: Rect[], existingPaths: Point[][] = []): boolean {
  // 检查与矩形障碍物碰撞
  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i]
    const p2 = path[i + 1]
    if (!p1 || !p2) continue
    for (const obstacle of obstacles) {
      if (lineIntersectsRect(p1, p2, obstacle)) {
        return true
      }
    }
  }

  // 检查与已有线路碰撞（线段相交检测）
  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i]
    const p2 = path[i + 1]
    if (!p1 || !p2) continue

    for (const existingPath of existingPaths) {
      for (let j = 0; j < existingPath.length - 1; j++) {
        const e1 = existingPath[j]
        const e2 = existingPath[j + 1]
        if (!e1 || !e2) continue

        // 检查线段是否相交或距离过近
        if (lineSegmentsIntersect(p1.x, p1.y, p2.x, p2.y, e1.x, e1.y, e2.x, e2.y)) {
          return true
        }

        // 检查距离是否过近（10px 缓冲）
        if (distanceBetweenSegments(p1, p2, e1, e2) < 10) {
          return true
        }
      }
    }
  }

  return false
}

/**
 * 计算两条线段之间的最短距离
 */
function distanceBetweenSegments(a1: Point, a2: Point, b1: Point, b2: Point): number {
  // 简化版：检查四个端点到对方线段的最短距离
  const d1 = distanceToSegment(a1, b1, b2)
  const d2 = distanceToSegment(a2, b1, b2)
  const d3 = distanceToSegment(b1, a1, a2)
  const d4 = distanceToSegment(b2, a1, a2)
  return Math.min(d1, d2, d3, d4)
}

/**
 * 计算点到线段的距离
 */
function distanceToSegment(p: Point, s1: Point, s2: Point): number {
  const l2 = Math.pow(s2.x - s1.x, 2) + Math.pow(s2.y - s1.y, 2)
  if (l2 === 0) return Math.hypot(p.x - s1.x, p.y - s1.y)

  const t = Math.max(0, Math.min(1, ((p.x - s1.x) * (s2.x - s1.x) + (p.y - s1.y) * (s2.y - s1.y)) / l2))
  const projection = { x: s1.x + t * (s2.x - s1.x), y: s1.y + t * (s2.y - s1.y) }
  return Math.hypot(p.x - projection.x, p.y - projection.y)
}

/**
 * Convert path points to SVG path string
 * 强制使用水平/垂直线段（Manhattan 路径）
 */
export function pathToSVG(points: Point[]): string {
  if (points.length === 0) return ''

  const firstPoint = points[0]
  if (!firstPoint) return ''

  let path = `M ${Math.round(firstPoint.x)} ${Math.round(firstPoint.y)}`

  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1]
    const point = points[i]
    if (!prevPoint || !point) continue

    const x = Math.round(point.x)
    const y = Math.round(point.y)
    const prevX = Math.round(prevPoint.x)
    const prevY = Math.round(prevPoint.y)

    // 强制 Manhattan 路径：只允许水平或垂直移动
    if (Math.abs(x - prevX) > Math.abs(y - prevY)) {
      // 水平移动为主，先水平再垂直
      if (x !== prevX) {
        path += ` H ${x}` // 水平线到 x
      }
      if (y !== prevY) {
        path += ` V ${y}` // 垂直线到 y
      }
    } else {
      // 垂直移动为主，先垂直再水平
      if (y !== prevY) {
        path += ` V ${y}` // 垂直线到 y
      }
      if (x !== prevX) {
        path += ` H ${x}` // 水平线到 x
      }
    }
  }

  return path
}
