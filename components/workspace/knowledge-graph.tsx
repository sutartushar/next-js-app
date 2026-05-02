'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Network, Loader2 } from 'lucide-react'

interface Node {
  id: string
  label: string
  type: 'document' | 'entity'
  relevance: number
}

interface Edge {
  source: string
  target: string
  relationship: string
  strength: number
}

interface KnowledgeGraphProps {
  workspaceId: string
  documentId?: string
}

export function KnowledgeGraph({ workspaceId, documentId }: KnowledgeGraphProps) {
  const [loading, setLoading] = useState(false)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  useEffect(() => {
    if (!workspaceId) return

    const fetchGraph = async () => {
      setLoading(true)
      try {
        const query = new URLSearchParams()
        query.append('workspaceId', workspaceId)
        if (documentId) {
          query.append('documentId', documentId)
        }

        const response = await fetch(`/api/knowledge-graph?${query}`)
        if (!response.ok) throw new Error('Failed to fetch knowledge graph')

        const data = await response.json()
        setNodes(data.nodes || [])
        setEdges(data.edges || [])
      } catch (error) {
        console.error('[v0] Knowledge graph fetch failed:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGraph()
  }, [workspaceId, documentId])

  const getNodePosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2
    const radius = 150
    return {
      x: Math.cos(angle) * radius + 200,
      y: Math.sin(angle) * radius + 200,
    }
  }

  const getRelationshipColor = (type: string): string => {
    const colors: Record<string, string> = {
      relates_to: '#3b82f6',
      mentions: '#8b5cf6',
      cites: '#ec4899',
      references: '#f59e0b',
      'is_about': '#10b981',
    }
    return colors[type] || '#6b7280'
  }

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Knowledge Graph
          </CardTitle>
          <CardDescription>Relationship mapping and entity connections</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (nodes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Knowledge Graph
          </CardTitle>
          <CardDescription>Relationship mapping and entity connections</CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center text-muted-foreground">
          No relationships found. Analyze documents to build the knowledge graph.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Knowledge Graph
        </CardTitle>
        <CardDescription>
          {nodes.length} entities • {edges.length} relationships
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Graph Visualization */}
          <div className="rounded-lg border border-border bg-card p-4">
            <svg width="100%" height="400" viewBox="0 0 400 400" className="border border-border rounded">
              {/* Render edges/relationships */}
              {edges.map((edge, idx) => {
                const source = nodes.find((n) => n.id === edge.source)
                const target = nodes.find((n) => n.id === edge.target)
                if (!source || !target) return null

                const sourcePos = getNodePosition(nodes.indexOf(source), nodes.length)
                const targetPos = getNodePosition(nodes.indexOf(target), nodes.length)

                return (
                  <line
                    key={idx}
                    x1={sourcePos.x}
                    y1={sourcePos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    stroke={getRelationshipColor(edge.relationship)}
                    strokeWidth={Math.max(1, edge.strength * 3)}
                    opacity={0.6}
                  />
                )
              })}

              {/* Render nodes */}
              {nodes.map((node, idx) => {
                const pos = getNodePosition(idx, nodes.length)
                const isSelected = selectedNode === node.id
                const radius = 25

                return (
                  <g
                    key={node.id}
                    onClick={() => handleNodeClick(node.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={radius}
                      fill={isSelected ? '#3b82f6' : node.type === 'entity' ? '#8b5cf6' : '#10b981'}
                      opacity={0.8}
                    />
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dy="0.3em"
                      className="text-xs font-semibold fill-white"
                      pointerEvents="none"
                    >
                      {node.label.substring(0, 3).toUpperCase()}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Node Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Entities</h3>
            <div className="grid gap-2">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedNode === node.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={node.type === 'entity' ? 'default' : 'secondary'}>
                        {node.type}
                      </Badge>
                      <span className="text-sm font-medium">{node.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {(node.relevance * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Relationships Legend */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Relationship Types</h3>
            <div className="grid grid-cols-2 gap-2">
              {['relates_to', 'mentions', 'cites', 'references'].map((type) => (
                <div key={type} className="flex items-center gap-2 text-xs">
                  <div
                    className="h-2 w-4 rounded"
                    style={{ backgroundColor: getRelationshipColor(type) }}
                  />
                  <span className="text-muted-foreground">{type.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
