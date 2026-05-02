'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Search, Clock, FileText } from 'lucide-react'

interface SearchMetric {
  timestamp: string
  count: number
  avgExecutionTime: number
}

interface SearchQuery {
  query: string
  count: number
  avgTime: number
}

interface AnalyticsDashboardProps {
  workspaceId: string
}

export function AnalyticsDashboard({ workspaceId }: AnalyticsDashboardProps) {
  const [loading, setLoading] = useState(true)
  const [timeSeriesData, setTimeSeriesData] = useState<SearchMetric[]>([])
  const [topQueries, setTopQueries] = useState<SearchQuery[]>([])
  const [stats, setStats] = useState({
    totalSearches: 0,
    avgExecutionTime: 0,
    uniqueQueries: 0,
    documentsIndexed: 0,
  })

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/workspaces/${workspaceId}/analytics`)
        if (!response.ok) throw new Error('Failed to fetch analytics')

        const data = await response.json()
        setTimeSeriesData(data.timeSeries || [])
        setTopQueries(data.topQueries || [])
        setStats(data.stats || stats)
      } catch (error) {
        console.error('[v0] Analytics fetch failed:', error)
      } finally {
        setLoading(false)
      }
    }

    if (workspaceId) {
      fetchAnalytics()
    }
  }, [workspaceId])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">Search performance and usage insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSearches.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">queries executed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.avgExecutionTime)}ms</div>
            <p className="text-xs text-muted-foreground">average execution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Queries</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueQueries.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">distinct searches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents Indexed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.documentsIndexed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">in knowledge base</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Search Volume Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Search Volume Trend</CardTitle>
            <CardDescription>Queries over time</CardDescription>
          </CardHeader>
          <CardContent>
            {timeSeriesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    dot={false}
                    name="Search Count"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Response Time Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Response Time Trend</CardTitle>
            <CardDescription>Average execution time</CardDescription>
          </CardHeader>
          <CardContent>
            {timeSeriesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => `${Math.round(value as number)}ms`} />
                  <Legend />
                  <Bar dataKey="avgExecutionTime" fill="#8b5cf6" name="Avg Time (ms)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Queries */}
      <Card>
        <CardHeader>
          <CardTitle>Top Search Queries</CardTitle>
          <CardDescription>Most frequently used searches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topQueries.length > 0 ? (
              topQueries.map((query, idx) => (
                <div key={idx} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex items-center gap-4 flex-1">
                    <Badge variant="secondary" className="text-xs">
                      #{idx + 1}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{query.query}</p>
                      <p className="text-xs text-muted-foreground">{query.avgTime}ms avg</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{query.count}</p>
                    <p className="text-xs text-muted-foreground">searches</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">No search history yet</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
