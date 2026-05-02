'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ZoomIn, ZoomOut } from 'lucide-react'
import Link from 'next/link'

export default function KnowledgeGraphPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Draw background
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-background').trim()
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Mock nodes and connections
    const nodes = [
      { id: 'ai', x: canvas.width / 2, y: 100, label: 'AI & Automation', color: '#5856d6', size: 40 },
      { id: 'ml', x: 200, y: 250, label: 'Machine Learning', color: '#5856d6', size: 35 },
      { id: 'data', x: canvas.width - 200, y: 250, label: 'Data Science', color: '#5856d6', size: 35 },
      { id: 'cloud', x: 150, y: 400, label: 'Cloud Computing', color: '#ff5722', size: 30 },
      { id: 'security', x: canvas.width - 150, y: 400, label: 'Security', color: '#ff5722', size: 30 },
      { id: 'market', x: canvas.width / 2, y: 500, label: 'Market Trends', color: '#4caf50', size: 32 },
    ]

    const connections = [
      { from: 'ai', to: 'ml', strength: 0.9 },
      { from: 'ai', to: 'data', strength: 0.85 },
      { from: 'ml', to: 'cloud', strength: 0.7 },
      { from: 'data', to: 'security', strength: 0.75 },
      { from: 'cloud', to: 'market', strength: 0.6 },
      { from: 'security', to: 'market', strength: 0.65 },
      { from: 'ai', to: 'market', strength: 0.8 },
    ]

    // Draw connections
    connections.forEach((conn) => {
      const from = nodes.find((n) => n.id === conn.from)
      const to = nodes.find((n) => n.id === conn.to)
      if (from && to) {
        const alpha = conn.strength
        ctx.strokeStyle = `rgba(88, 86, 214, ${alpha * 0.3})`
        ctx.lineWidth = conn.strength * 3
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.stroke()
      }
    })

    // Draw nodes
    nodes.forEach((node) => {
      // Node circle
      ctx.fillStyle = node.color
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
      ctx.fill()

      // Node border
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()

      // Node label
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.label, node.x, node.y)
    })

    // Draw legend
    ctx.fillStyle = 'rgba(0,0,0,0.05)'
    ctx.fillRect(10, canvas.height - 120, 200, 110)

    ctx.fillStyle = '#333'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('Legend:', 20, canvas.height - 100)

    const legendItems = [
      { color: '#5856d6', label: 'AI & Technology' },
      { color: '#ff5722', label: 'Infrastructure' },
      { color: '#4caf50', label: 'Business' },
    ]

    legendItems.forEach((item, i) => {
      ctx.fillStyle = item.color
      ctx.beginPath()
      ctx.arc(20, canvas.height - 75 + i * 25, 6, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#666'
      ctx.font = '11px sans-serif'
      ctx.fillText(item.label, 35, canvas.height - 72 + i * 25)
    })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Knowledge Graph Visualization</h1>
          <p className="text-muted-foreground mt-2">Explore relationships and connections between document topics</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Canvas */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden bg-card/50">
              <canvas
                ref={canvasRef}
                className="w-full h-96 md:h-[600px] bg-gradient-to-br from-background to-secondary"
              />
            </Card>

            {/* Controls */}
            <div className="flex gap-2 mt-4 justify-center">
              <Button variant="outline" size="sm">
                <ZoomIn className="w-4 h-4 mr-2" />
                Zoom In
              </Button>
              <Button variant="outline" size="sm">
                <ZoomOut className="w-4 h-4 mr-2" />
                Zoom Out
              </Button>
              <Button variant="outline" size="sm">Reset View</Button>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Graph Statistics</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Total Nodes</p>
                  <p className="text-2xl font-bold text-primary">6</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Connections</p>
                  <p className="text-2xl font-bold text-accent">7</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Strength</p>
                  <p className="text-2xl font-bold text-yellow-500">75%</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Top Topics</h3>
              <div className="space-y-2">
                {[
                  { name: 'AI & Automation', documents: 124, strength: 0.95 },
                  { name: 'Data Science', documents: 87, strength: 0.88 },
                  { name: 'Cloud Computing', documents: 72, strength: 0.82 },
                ].map((topic) => (
                  <div key={topic.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{topic.name}</span>
                      <Badge variant="secondary">{topic.documents}</Badge>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full"
                        style={{ width: `${topic.strength * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <h3 className="font-semibold mb-3">How It Works</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The knowledge graph visualizes connections between key topics extracted from your documents. Node size
                represents frequency, and connection strength shows relationship importance.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
