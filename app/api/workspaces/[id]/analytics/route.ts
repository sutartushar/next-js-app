import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: workspaceId } = await params
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user has access to workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', workspaceId)
      .or(`owner_id.eq.${user.id},user_id.eq.${user.id}`)
      .single()

    if (workspaceError || !workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    // Fetch search history for analytics
    const { data: searchHistory, error: searchError } = await supabase
      .from('search_history')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })
      .limit(1000)

    if (searchError) {
      console.error('[v0] Search history error:', searchError)
      return NextResponse.json({ error: 'Failed to fetch search history' }, { status: 500 })
    }

    // Fetch document count
    const { count: documentCount, error: docCountError } = await supabase
      .from('documents')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)

    if (docCountError) {
      console.error('[v0] Document count error:', docCountError)
    }

    // Calculate statistics
    const totalSearches = searchHistory?.length || 0
    const avgExecutionTime = searchHistory && searchHistory.length > 0
      ? searchHistory.reduce((sum, s) => sum + (s.execution_time_ms || 0), 0) / searchHistory.length
      : 0

    // Get unique queries
    const uniqueQueries = new Set(searchHistory?.map((s) => s.query) || []).size

    // Build time series data (group by day)
    const timeSeriesMap = new Map<string, { count: number; totalTime: number; total: number }>()

    searchHistory?.forEach((search) => {
      const date = new Date(search.created_at)
      const dayKey = date.toISOString().split('T')[0]

      if (!timeSeriesMap.has(dayKey)) {
        timeSeriesMap.set(dayKey, { count: 0, totalTime: 0, total: 0 })
      }

      const entry = timeSeriesMap.get(dayKey)!
      entry.count += 1
      entry.totalTime += search.execution_time_ms || 0
      entry.total += 1
    })

    const timeSeries = Array.from(timeSeriesMap.entries())
      .map(([date, data]) => ({
        timestamp: date,
        count: data.count,
        avgExecutionTime: data.total > 0 ? Math.round(data.totalTime / data.total) : 0,
      }))
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
      .slice(-30) // Last 30 days

    // Get top queries
    const queryMap = new Map<string, { count: number; totalTime: number; total: number }>()

    searchHistory?.forEach((search) => {
      if (!queryMap.has(search.query)) {
        queryMap.set(search.query, { count: 0, totalTime: 0, total: 0 })
      }

      const entry = queryMap.get(search.query)!
      entry.count += 1
      entry.totalTime += search.execution_time_ms || 0
      entry.total += 1
    })

    const topQueries = Array.from(queryMap.entries())
      .map(([query, data]) => ({
        query,
        count: data.count,
        avgTime: data.total > 0 ? Math.round(data.totalTime / data.total) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return NextResponse.json({
      stats: {
        totalSearches,
        avgExecutionTime: Math.round(avgExecutionTime),
        uniqueQueries,
        documentsIndexed: documentCount || 0,
      },
      timeSeries,
      topQueries,
    })
  } catch (error) {
    console.error('[v0] Analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
