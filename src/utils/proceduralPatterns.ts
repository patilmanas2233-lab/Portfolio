// Pure monochrome procedural pattern generator for high-contrast brutalist schematics
// Guaranteed 0% color: uses strictly #000000 and #ffffff values

export function createProceduralSchematic(type: 'crypto' | 'intel' | 'heuristic', width = 800, height = 500): string {
  if (typeof document === 'undefined') return ''

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  // 1. Pure Black Base
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, width, height)

  // 2. High-contrast Television Snow / Static Noise (1-bit B&W)
  const imgData = ctx.getImageData(0, 0, width, height)
  const data = imgData.data
  for (let i = 0; i < data.length; i += 4) {
    // 1-bit randomized threshold: either pure white (255) or pure black (0)
    const val = Math.random() > 0.88 ? 255 : 0
    data[i] = val     // R
    data[i + 1] = val // G
    data[i + 2] = val // B
    data[i + 3] = val > 0 ? 90 : 255 // Alpha intensity
  }
  ctx.putImageData(imgData, 0, 0)

  // 3. Technical 1-Bit Schematic Grid Lines
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 1

  // Dense background grid
  const gridSize = 40
  ctx.beginPath()
  ctx.globalAlpha = 0.15
  for (let x = 0; x < width; x += gridSize) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
  }
  ctx.stroke()
  ctx.globalAlpha = 1.0

  // 4. Type-specific schematic graphics
  if (type === 'crypto') {
    // Zero-Knowledge Crypto Vault Schematic
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2

    // Main vault chamber polygon
    ctx.strokeRect(120, 80, width - 240, height - 160)
    ctx.strokeRect(160, 110, width - 320, height - 220)

    // Key registers & lock blocks
    for (let i = 0; i < 6; i++) {
      const rx = 200 + i * 65
      ctx.strokeRect(rx, 150, 45, 120)
      ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#000000'
      ctx.fillRect(rx + 8, 160, 29, 30)
      ctx.fillRect(rx + 8, 220, 29, 30)
    }

    // Interconnect trace lines
    ctx.beginPath()
    ctx.moveTo(120, 250)
    ctx.lineTo(200, 250)
    ctx.moveTo(600, 250)
    ctx.lineTo(680, 250)
    ctx.stroke()

    // Technical Typography Labels
    ctx.font = '12px "Space Mono", monospace'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('VAULT_CORE // ARGON2ID + AES-256-GCM', 130, 70)
    ctx.fillText('REG_STATE: ZERO_KNOWLEDGE_ENFORCED', 130, height - 60)
    ctx.fillText('BLOCK_INTEGRITY: 100% OK', width - 320, height - 60)
  } else if (type === 'intel') {
    // Dhruva Threat Intel Forensic Pipeline
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.5

    // Multi-node Tor SOCKS5 routing constellation
    const nodes = [
      { x: 160, y: 150, r: 24, label: 'ENTRY' },
      { x: 300, y: 280, r: 32, label: 'RELAY_1' },
      { x: 440, y: 160, r: 20, label: 'RELAY_2' },
      { x: 540, y: 320, r: 28, label: 'EXIT_S5' },
      { x: 680, y: 200, r: 36, label: 'TARGET' },
    ]

    // Route connections
    ctx.beginPath()
    nodes.forEach((n, idx) => {
      if (idx === 0) ctx.moveTo(n.x, n.y)
      else ctx.lineTo(n.x, n.y)
    })
    ctx.stroke()

    // Node circles & crosshairs
    nodes.forEach((n) => {
      ctx.beginPath()
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
      ctx.fillStyle = '#000000'
      ctx.fill()
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(n.x, n.y, n.r / 2, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.fill()

      ctx.font = '10px "Space Mono", monospace'
      ctx.fillStyle = '#ffffff'
      ctx.fillText(n.label, n.x - 24, n.y + n.r + 16)
    })

    // Technical Header
    ctx.font = '12px "Space Mono", monospace'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('DHRUVA // DEBERTA_NLP_TOR_PIPELINE', 130, 70)
    ctx.fillText('ROUTE: SOCKS5 [127.0.0.1:9050]', 130, height - 60)
    ctx.fillText('PACKET_INSPECT: ACTIVE', width - 300, height - 60)
  } else {
    // Heuristic Scam Anomaly Engine
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.5

    // Scatter distribution graph with decision boundary
    ctx.beginPath()
    ctx.moveTo(140, 100)
    ctx.lineTo(140, height - 100)
    ctx.lineTo(width - 140, height - 100)
    ctx.stroke()

    // Decision Boundary hyper-plane
    ctx.beginPath()
    ctx.setLineDash([6, 4])
    ctx.moveTo(140, height - 120)
    ctx.lineTo(width - 140, 140)
    ctx.stroke()
    ctx.setLineDash([])

    // Data points & anomaly clusters
    for (let i = 0; i < 40; i++) {
      const px = 170 + Math.random() * (width - 340)
      const py = 120 + Math.random() * (height - 240)
      ctx.strokeRect(px - 3, py - 3, 6, 6)
      if (Math.random() > 0.5) {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(px - 2, py - 2, 4, 4)
      }
    }

    // Technical Labels
    ctx.font = '12px "Space Mono", monospace'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('HEURISTIC_MODEL // TF-IDF + LOGISTIC_REG', 130, 70)
    ctx.fillText('DECISION_BOUNDARY: OPTIMIZED', 130, height - 60)
    ctx.fillText('ANOMALY_SCORE: 0.998', width - 280, height - 60)
  }

  // Calibration corner ticks
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2
  ctx.strokeRect(20, 20, 20, 20)
  ctx.strokeRect(width - 40, 20, 20, 20)
  ctx.strokeRect(20, height - 40, 20, 20)
  ctx.strokeRect(width - 40, height - 40, 20, 20)

  return canvas.toDataURL('image/png')
}
