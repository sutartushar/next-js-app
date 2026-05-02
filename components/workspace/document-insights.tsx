'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle, BarChart3, Lightbulb, Tag, TrendingUp } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface DocumentInsight {
  id: string
  summary: string
  key_entities: { entities: Array<{ name: string; type: string; relevance: number }> }
  auto_tags: string[]
  sentiment: string
  topics: { topics: Array<{ name: string; relevance: number }> }
}

interface DocumentInsightsProps {
  documentId: string
  onRefresh?: () => void
}

export function DocumentInsights({ documentId, onRefresh }: DocumentInsightsProps) {
  const [insights, setInsights] = useState<DocumentInsight | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadInsights()
  }, [documentId])

  const loadInsights = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/documents/${documentId}/insights`)
      if (!res.ok) {
        throw new Error('Failed to load insights')
      }
      const data = await res.json()
      setInsights(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setInsights(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Insights</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!insights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No insights available yet. Process the document to generate insights.</p>
        </CardContent>
      </Card>
    )
  }

  const entities = insights.key_entities?.entities || []
  const topics = insights.topics?.topics || []

  const sentimentColor = {
    positive: 'bg-green-100 text-green-800',
    negative: 'bg-red-100 text-red-800',
    neutral: 'bg-gray-100 text-gray-800',
  }[insights.sentiment || 'neutral'] || 'bg-gray-100 text-gray-800'

  return (
    <div className="space-y-4">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground">{insights.summary}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Sentiment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={sentimentColor}>{insights.sentiment}</Badge>
          </CardContent>
        </Card>

        {/* Auto-generated Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Tag className="h-4 w-4" />
              Key Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {insights.auto_tags && insights.auto_tags.length > 0 ? (
              insights.auto_tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)
            ) : (
              <p className="text-sm text-muted-foreground">No tags identified</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Key Entities */}
      {entities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Key Entities</CardTitle>
            <CardDescription>Important concepts and named entities found in the document</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {entities.slice(0, 8).map((entity) => (
                <div key={entity.name} className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm">{entity.name}</span>
                    <span className="text-xs text-muted-foreground">{entity.type}</span>
                  </div>
                  <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(entity.relevance || 0) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Topics */}
      {topics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              Topics
            </CardTitle>
            <CardDescription>Main topics and themes identified</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topics.map((topic) => (
                <div key={topic.name} className="flex items-center justify-between">
                  <span className="font-medium text-sm">{topic.name}</span>
                  <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${(topic.relevance || 0) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
